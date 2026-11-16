import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';
import { LedgerService } from '../ledger/ledger.service.js';
import { OutboxService } from '../outbox/outbox.service.js';
import { DomainEventNames, DisputeStatus } from '@manga/domain';

export interface OpenDisputeDto {
  orderId: string;
  shipmentGroupId: string;
  openedBy: 'buyer' | 'vendor';
  type: string; // e.g. 'not_received', 'damaged_goods', 'wrong_item', 'return_rejected'
  reason: string;
  claimedAmountMinor?: bigint;
  currency?: string;
}

export interface SubmitEvidenceDto {
  caseId: string;
  party: 'buyer' | 'vendor' | 'carrier' | 'platform';
  kind: 'photo' | 'video' | 'document' | 'message_transcript';
  uri: string;
  notes?: string;
}

export interface ResolveDisputeDto {
  adminId: string;
  outcome: 'resolved_buyer_favor' | 'resolved_vendor_favor' | 'settled_by_platform';
  resolutionNotes: string;
  refundAmountMinor?: bigint;
  refundSource?: 'vendor' | 'platform_guarantee';
  currency?: string;
  idempotencyKey: string;
}

export interface DisputeEvidenceBundle {
  disputeCase: any;
  order: any;
  shipmentGroup: any;
  trackingHistory: any[];
  evidenceFiles: any[];
}

@Injectable()
export class DisputesService {
  constructor(
    private readonly db: DatabaseService,
    private readonly ledger: LedgerService,
    private readonly outbox: OutboxService
  ) {}

  public async openDispute(dto: OpenDisputeDto): Promise<any> {
    const deadlineAt = new Date(Date.now() + 5 * 24 * 3600 * 1000); // 5-day evidence window (§8.6)

    const res = await this.db.query(
      `INSERT INTO disputes.cases (
        order_id, shipment_group_id, opened_by, type, status, deadline_at, outcome
       ) VALUES ($1, $2, $3, $4, 'opened', $5, $6)
       RETURNING *`,
      [dto.orderId, dto.shipmentGroupId, dto.openedBy, dto.type, deadlineAt, dto.reason]
    );

    const disputeCase = res.rows[0];

    await this.outbox.stageEvent({
      id: crypto.randomUUID(),
      name: DomainEventNames.DISPUTE_OPENED,
      aggregateType: 'dispute',
      aggregateId: disputeCase.id,
      correlationId: crypto.randomUUID(),
      timestamp: new Date(),
      payload: {
        caseId: disputeCase.id,
        orderId: dto.orderId,
        openedBy: dto.openedBy,
        type: dto.type,
      },
    });

    return disputeCase;
  }

  public async submitEvidence(dto: SubmitEvidenceDto): Promise<any> {
    const caseRes = await this.db.query(
      `SELECT * FROM disputes.cases WHERE id = $1`,
      [dto.caseId]
    );

    if (caseRes.rows.length === 0) {
      throw new NotFoundException(`Dispute case ${dto.caseId} not found`);
    }

    const res = await this.db.query(
      `INSERT INTO disputes.evidence (case_id, party, kind, uri, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [dto.caseId, dto.party, dto.kind, dto.uri, dto.notes ?? null]
    );

    return res.rows[0];
  }

  public async listDisputes(status?: string): Promise<any[]> {
    let sql = `
      SELECT d.*, o.order_number, o.currency, o.totals, sg.vendor_id, v.business_name as vendor_name
      FROM disputes.cases d
      JOIN orders.orders o ON d.order_id = o.id
      JOIN orders.shipment_groups sg ON d.shipment_group_id = sg.id
      JOIN vendor.vendors v ON sg.vendor_id = v.id
    `;
    const params: any[] = [];

    if (status) {
      sql += ` WHERE d.status = $1`;
      params.push(status);
    }

    sql += ` ORDER BY d.deadline_at ASC`;
    const res = await this.db.query(sql, params);
    return res.rows;
  }

  /**
   * Compiles the automated evidence bundle (§8.6)
   */
  public async getDisputeDetail(caseId: string): Promise<DisputeEvidenceBundle> {
    const caseRes = await this.db.query(
      `SELECT d.*, o.order_number, o.currency, o.totals, o.address_snapshot, sg.vendor_id, v.business_name as vendor_name
       FROM disputes.cases d
       JOIN orders.orders o ON d.order_id = o.id
       JOIN orders.shipment_groups sg ON d.shipment_group_id = sg.id
       JOIN vendor.vendors v ON sg.vendor_id = v.id
       WHERE d.id = $1`,
      [caseId]
    );

    if (caseRes.rows.length === 0) {
      throw new NotFoundException(`Dispute case ${caseId} not found`);
    }
    const disputeCase = caseRes.rows[0];

    // Evidence uploads
    const evidenceRes = await this.db.query(
      `SELECT * FROM disputes.evidence WHERE case_id = $1 ORDER BY created_at ASC`,
      [caseId]
    );

    // Tracking history
    const trackingRes = await this.db.query(
      `SELECT t.*, s.tracking_number, s.carrier_id
       FROM shipping.tracking_events t
       JOIN shipping.shipments s ON t.shipment_id = s.id
       WHERE s.shipment_group_id = $1
       ORDER BY t.occurred_at ASC`,
      [disputeCase.shipment_group_id]
    );

    return {
      disputeCase,
      order: {
        id: disputeCase.order_id,
        orderNumber: disputeCase.order_number,
        currency: disputeCase.currency,
        totals: disputeCase.totals,
        address: disputeCase.address_snapshot,
      },
      shipmentGroup: {
        id: disputeCase.shipment_group_id,
        vendorId: disputeCase.vendor_id,
        vendorName: disputeCase.vendor_name,
      },
      trackingHistory: trackingRes.rows,
      evidenceFiles: evidenceRes.rows,
    };
  }

  /**
   * Mediator resolves dispute and executes financial settlement (§8.6).
   */
  public async resolveDispute(caseId: string, dto: ResolveDisputeDto): Promise<any> {
    const bundle = await this.getDisputeDetail(caseId);
    if (bundle.disputeCase.status !== 'opened' && bundle.disputeCase.status !== 'awaiting_evidence') {
      throw new BadRequestException(`Dispute ${caseId} is already closed/resolved.`);
    }

    let ledgerTxId: string | null = null;
    const currency = dto.currency || bundle.disputeCase.currency || 'NGN';

    // If resolving in buyer's favor or settled by platform, execute compensating ledger transaction
    if (dto.outcome === 'resolved_buyer_favor' || dto.outcome === 'settled_by_platform') {
      const refundAmount = dto.refundAmountMinor || 1000000n;

      if (dto.refundSource === 'platform_guarantee') {
        // Platform guarantee fund absorption: D: platform_revenue / C: buyer_funds_held
        const tx = await this.ledger.postTransaction({
          refType: 'dispute_guarantee_settlement',
          refId: caseId,
          description: `Platform guarantee settlement for dispute ${caseId}`,
          idempotencyKey: dto.idempotencyKey,
          entries: [
            {
              accountId: crypto.randomUUID(), // platform guarantee reserve account
              direction: 'D',
              amountMinor: refundAmount,
              currency,
            },
            {
              accountId: crypto.randomUUID(), // buyer clearing account
              direction: 'C',
              amountMinor: refundAmount,
              currency,
            },
          ],
        });
        ledgerTxId = tx.id;
      } else {
        // Vendor liability refund: D: vendor_payable / C: buyer_funds_held
        const tx = await this.ledger.postTransaction({
          refType: 'dispute_vendor_refund',
          refId: caseId,
          description: `Vendor dispute refund for dispute ${caseId}`,
          idempotencyKey: dto.idempotencyKey,
          entries: [
            {
              accountId: crypto.randomUUID(), // vendor_payable account
              direction: 'D',
              amountMinor: refundAmount,
              currency,
            },
            {
              accountId: crypto.randomUUID(), // buyer clearing account
              direction: 'C',
              amountMinor: refundAmount,
              currency,
            },
          ],
        });
        ledgerTxId = tx.id;
      }
    }

    // Update dispute record
    const updateRes = await this.db.query(
      `UPDATE disputes.cases
       SET status = $1, outcome = $2, ledger_tx_id = $3
       WHERE id = $4
       RETURNING *`,
      [dto.outcome, dto.resolutionNotes, ledgerTxId, caseId]
    );

    // Emit dispute.resolved event
    await this.outbox.stageEvent({
      id: crypto.randomUUID(),
      name: DomainEventNames.DISPUTE_RESOLVED,
      aggregateType: 'dispute',
      aggregateId: caseId,
      correlationId: crypto.randomUUID(),
      timestamp: new Date(),
      payload: {
        caseId,
        outcome: dto.outcome,
        resolvedBy: dto.adminId,
        ledgerTxId,
      },
    });

    return updateRes.rows[0];
  }
}
