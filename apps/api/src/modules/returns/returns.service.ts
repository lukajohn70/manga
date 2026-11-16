import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';
import { LedgerService } from '../ledger/ledger.service.js';
import { OutboxService } from '../outbox/outbox.service.js';
import { PaymentProvider, MockCardPaymentProvider } from '../payments/payment.provider.js';
import { DomainEventNames, ReturnReasonCode } from '@manga/domain';

export interface RequestReturnDto {
  orderId: string;
  shipmentGroupId: string;
  reasonCode: ReturnReasonCode;
  resolutionRequested: 'refund' | 'exchange' | 'store_credit';
  items: Array<{
    orderLineId: string;
    qty: number;
    conditionClaimed: string;
  }>;
}

export interface InspectReturnDto {
  returnRequestId: string;
  graderId: string;
  grade: 'like_new' | 'used' | 'damaged' | 'ineligible';
  notes: string;
  refundAmountMinor: bigint;
  commissionReversalMinor: bigint;
  currency: string;
  idempotencyKey: string;
}

@Injectable()
export class ReturnsService {
  private psp: PaymentProvider;

  constructor(
    private readonly db: DatabaseService,
    private readonly ledger: LedgerService,
    private readonly outbox: OutboxService
  ) {
    this.psp = new MockCardPaymentProvider();
  }

  public async requestReturn(dto: RequestReturnDto): Promise<any> {
    // 1. Verify shipment group is delivered
    const sgRes = await this.db.query(
      `SELECT * FROM orders.shipment_groups WHERE id = $1 AND order_id = $2`,
      [dto.shipmentGroupId, dto.orderId]
    );

    if (sgRes.rows.length === 0) {
      throw new NotFoundException(`Shipment group ${dto.shipmentGroupId} not found for order`);
    }

    const sg = sgRes.rows[0];
    if (sg.status !== 'delivered') {
      throw new BadRequestException('Returns can only be requested for delivered orders.');
    }

    return await this.db.transaction(async (client) => {
      // 2. Create return request
      const returnRes = await client.query(
        `INSERT INTO returns.return_requests (
          order_id, shipment_group_id, status, reason_code, resolution_requested, policy_snapshot
         ) VALUES ($1, $2, 'requested', $3, $4, '{}')
         RETURNING *`,
        [dto.orderId, dto.shipmentGroupId, dto.reasonCode, dto.resolutionRequested]
      );
      const returnRequest = returnRes.rows[0];

      // 3. Insert return items
      for (const item of dto.items) {
        await client.query(
          `INSERT INTO returns.return_items (return_request_id, order_line_id, qty, condition_claimed)
           VALUES ($1, $2, $3, $4)`,
          [returnRequest.id, item.orderLineId, item.qty, item.conditionClaimed]
        );
      }

      await this.outbox.stageEvent({
        id: crypto.randomUUID(),
        name: DomainEventNames.RETURN_REQUESTED,
        aggregateType: 'return_request',
        aggregateId: returnRequest.id,
        correlationId: crypto.randomUUID(),
        timestamp: new Date(),
        payload: {
          returnRequestId: returnRequest.id,
          orderId: dto.orderId,
          reasonCode: dto.reasonCode,
        },
      });

      return returnRequest;
    });
  }

  public async inspectAndRefund(dto: InspectReturnDto): Promise<any> {
    const returnRes = await this.db.query(
      `SELECT * FROM returns.return_requests WHERE id = $1`,
      [dto.returnRequestId]
    );

    if (returnRes.rows.length === 0) {
      throw new NotFoundException(`Return request ${dto.returnRequestId} not found`);
    }

    // Call PSP refund
    const refundResult = await this.psp.refund({
      paymentPspRef: 'MOCK-PSP-TX',
      amountMinor: dto.refundAmountMinor,
      currency: dto.currency,
      idempotencyKey: dto.idempotencyKey,
    });

    return await this.db.transaction(async (client) => {
      // Update return request status
      await client.query(
        `UPDATE returns.return_requests SET status = 'refund_issued' WHERE id = $1`,
        [dto.returnRequestId]
      );

      // Post Double-Entry Ledger Reversal (§7.5, Posting #4):
      // Reverses vendor_payable, platform_revenue, and buyer_funds_held
      await this.ledger.postRefund({
        returnId: dto.returnRequestId,
        refundAmountMinor: dto.refundAmountMinor,
        commissionReversalMinor: dto.commissionReversalMinor,
        currency: dto.currency,
        idempotencyKey: dto.idempotencyKey,
        vendorPayableAccountId: crypto.randomUUID(),
        platformRevenueAccountId: crypto.randomUUID(),
        buyerFundsHeldAccountId: crypto.randomUUID(),
      });

      return {
        returnRequestId: dto.returnRequestId,
        status: 'refund_issued',
        refundPspRef: refundResult.refundPspRef,
      };
    });
  }
}
