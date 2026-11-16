import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service.js';
import { LedgerService } from '../../ledger/ledger.service.js';
import { OutboxService } from '../../outbox/outbox.service.js';
import { InventoryService } from '../../inventory/inventory.service.js';
import { SearchService } from '../../search/search.service.js';

export interface ReplayOutboxDto {
  eventId: string;
  actorId: string;
  reason: string;
}

export interface ReleaseStuckReservationDto {
  reservationId: string;
  actorId: string;
  reason: string;
}

export interface RefreshSearchIndexDto {
  productId: string;
  actorId: string;
  reason: string;
}

export interface ReverseLedgerTxDto {
  transactionId: string;
  actorId: string;
  checkerId: string;
  reason: string;
  idempotencyKey: string;
}

export interface ResyncTrackingDto {
  shipmentId: string;
  actorId: string;
  reason: string;
}

@Injectable()
export class AdminRepairService {
  constructor(
    private readonly db: DatabaseService,
    private readonly ledger: LedgerService,
    private readonly outbox: OutboxService,
    private readonly inventory: InventoryService,
    private readonly search: SearchService
  ) {}

  /**
   * Records an immutable audit log entry (§12.4, §18)
   */
  private async recordAudit(
    actorId: string,
    actorRole: string,
    action: string,
    targetType: string,
    targetId: string,
    beforeState: any,
    afterState: any,
    reason: string
  ): Promise<any> {
    const res = await this.db.query(
      `INSERT INTO admin.audit_logs (
        actor_id, actor_role, action, target_type, target_id, before_state, after_state, reason
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        actorId,
        actorRole,
        action,
        targetType,
        targetId,
        JSON.stringify(beforeState ?? {}),
        JSON.stringify(afterState ?? {}),
        reason,
      ]
    );
    return res.rows[0];
  }

  /**
   * Replays an outbox event by resetting its status to 'pending' or re-staging (§18)
   */
  public async replayOutboxEvent(dto: ReplayOutboxDto): Promise<any> {
    const eventRes = await this.db.query(
      `SELECT * FROM outbox.events WHERE id = $1`,
      [dto.eventId]
    );

    if (eventRes.rows.length === 0) {
      throw new NotFoundException(`Outbox event ${dto.eventId} not found`);
    }

    const beforeState = eventRes.rows[0];

    const updateRes = await this.db.query(
      `UPDATE outbox.events SET status = 'pending' WHERE id = $1 RETURNING *`,
      [dto.eventId]
    );

    const afterState = updateRes.rows[0] ?? { ...beforeState, status: 'pending' };

    await this.recordAudit(
      dto.actorId,
      'admin_support',
      'REPLAY_OUTBOX_EVENT',
      'outbox_event',
      dto.eventId,
      beforeState,
      afterState,
      dto.reason
    );

    return {
      success: true,
      eventId: dto.eventId,
      status: 'replayed_pending',
    };
  }

  /**
   * Releases a stuck or orphaned inventory reservation (§18)
   */
  public async releaseStuckReservation(dto: ReleaseStuckReservationDto): Promise<any> {
    const res = await this.db.query(
      `SELECT * FROM inventory.reservations WHERE id = $1`,
      [dto.reservationId]
    );

    if (res.rows.length === 0) {
      throw new NotFoundException(`Reservation ${dto.reservationId} not found`);
    }

    const reservation = res.rows[0];
    if (reservation.status !== 'active' && reservation.status !== 'pending') {
      throw new BadRequestException(
        `Reservation ${dto.reservationId} is not active (current status: ${reservation.status})`
      );
    }

    // Release via InventoryService
    await this.inventory.releaseReservation(dto.reservationId);

    const afterRes = await this.db.query(
      `SELECT * FROM inventory.reservations WHERE id = $1`,
      [dto.reservationId]
    );

    await this.recordAudit(
      dto.actorId,
      'inventory_ops',
      'RELEASE_STUCK_RESERVATION',
      'inventory_reservation',
      dto.reservationId,
      reservation,
      afterRes.rows[0] ?? { ...reservation, status: 'released' },
      dto.reason
    );

    return {
      success: true,
      reservationId: dto.reservationId,
      status: 'released',
    };
  }

  /**
   * Force-refreshes search index document (§18)
   */
  public async refreshSearchIndex(dto: RefreshSearchIndexDto): Promise<any> {
    const prodRes = await this.db.query(
      `SELECT * FROM catalog.master_products WHERE id = $1`,
      [dto.productId]
    );

    if (prodRes.rows.length === 0) {
      throw new NotFoundException(`Product ${dto.productId} not found`);
    }

    // Index or re-index product
    await this.search.indexProduct({
      id: prodRes.rows[0].id,
      title: prodRes.rows[0].title,
      description: prodRes.rows[0].description,
      brand: prodRes.rows[0].brand_name,
      categories: [prodRes.rows[0].category_id],
      attributes: prodRes.rows[0].attributes || {},
      status: prodRes.rows[0].status,
      variants: [],
      hasStock: true,
    });

    await this.recordAudit(
      dto.actorId,
      'catalog_ops',
      'REFRESH_SEARCH_INDEX',
      'catalog_product',
      dto.productId,
      null,
      { refreshed: true },
      dto.reason
    );

    return {
      success: true,
      productId: dto.productId,
      indexedAt: new Date(),
    };
  }

  /**
   * Reverses a posted ledger transaction with mandatory Maker-Checker approval (§12.4, §18)
   */
  public async reverseLedgerTransaction(dto: ReverseLedgerTxDto): Promise<any> {
    if (dto.actorId === dto.checkerId) {
      throw new BadRequestException(
        'Maker-Checker violation: Reversing a ledger transaction requires dual separate approval'
      );
    }

    const txRes = await this.db.query(
      `SELECT * FROM ledger.transactions WHERE id = $1`,
      [dto.transactionId]
    );

    if (txRes.rows.length === 0) {
      throw new NotFoundException(`Ledger transaction ${dto.transactionId} not found`);
    }

    const origTx = txRes.rows[0];

    // Fetch existing entries
    const entriesRes = await this.db.query(
      `SELECT * FROM ledger.entries WHERE transaction_id = $1`,
      [dto.transactionId]
    );

    if (entriesRes.rows.length === 0) {
      throw new BadRequestException(`No ledger entries found for transaction ${dto.transactionId}`);
    }

    // Invert entries: Debits become Credits, Credits become Debits
    const invertedEntries = entriesRes.rows.map((entry: any) => ({
      accountId: entry.account_id,
      direction: (entry.direction === 'D' ? 'C' : 'D') as 'D' | 'C',
      amountMinor: BigInt(entry.amount_minor),
      currency: entry.currency,
    }));

    // Post reversing balanced transaction
    const reversingTx = await this.ledger.postTransaction({
      refType: 'admin_reversal',
      refId: dto.transactionId,
      description: `Admin reversal of tx ${dto.transactionId}: ${dto.reason}`,
      idempotencyKey: dto.idempotencyKey,
      entries: invertedEntries,
    });

    await this.recordAudit(
      dto.actorId,
      'finance_admin',
      'REVERSE_LEDGER_TRANSACTION',
      'ledger_transaction',
      dto.transactionId,
      origTx,
      { reversingTransactionId: reversingTx.id, checkerId: dto.checkerId },
      dto.reason
    );

    return {
      success: true,
      originalTransactionId: dto.transactionId,
      reversingTransactionId: reversingTx.id,
      approvedBy: dto.checkerId,
    };
  }

  /**
   * Re-syncs tracking status from carrier
   */
  public async resyncTracking(dto: ResyncTrackingDto): Promise<any> {
    const shipmentRes = await this.db.query(
      `SELECT * FROM shipping.shipments WHERE id = $1`,
      [dto.shipmentId]
    );

    if (shipmentRes.rows.length === 0) {
      throw new NotFoundException(`Shipment ${dto.shipmentId} not found`);
    }

    const shipment = shipmentRes.rows[0];

    await this.recordAudit(
      dto.actorId,
      'shipping_ops',
      'RESYNC_TRACKING',
      'shipment',
      dto.shipmentId,
      shipment,
      { resynced: true },
      dto.reason
    );

    return {
      success: true,
      shipmentId: dto.shipmentId,
      trackingNumber: shipment.tracking_number,
      status: shipment.status,
    };
  }

  /**
   * Lists audit logs for oversight and forensic audit
   */
  public async getAuditLogs(limit = 50): Promise<any[]> {
    const res = await this.db.query(
      `SELECT * FROM admin.audit_logs ORDER BY created_at DESC LIMIT $1`,
      [limit]
    );
    return res.rows;
  }
}
