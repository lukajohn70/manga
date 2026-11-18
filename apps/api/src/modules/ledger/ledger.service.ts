import { Injectable, NotFoundException } from '@nestjs/common';
import {
  LedgerAccount,
  LedgerEntry,
  LedgerTransaction,
  LedgerValidator,
  MoneyUtil,
} from '@manga/domain';
import { DatabaseService } from '../../database/database.service.js';
import { OutboxService } from '../outbox/outbox.service.js';
import { DomainEventNames } from '@manga/domain';

export interface PostTransactionCommand {
  refType: string;
  refId: string;
  description: string;
  idempotencyKey: string;
  entries: Array<{
    accountId: string;
    direction: 'D' | 'C';
    amountMinor: bigint;
    currency: string;
  }>;
}

export interface PostCapturePostingParams {
  orderId: string;
  grossAmountMinor: bigint;
  currency: string;
  idempotencyKey: string;
  pspAccountId: string;
  buyerFundsHeldAccountId: string;
}

export interface PostDeliveryConfirmedPostingParams {
  shipmentGroupId: string;
  grossAmountMinor: bigint;
  commissionMinor: bigint;
  taxMinor: bigint;
  shippingMinor: bigint;
  currency: string;
  idempotencyKey: string;
  buyerFundsHeldAccountId: string;
  vendorPayableAccountId: string;
  platformRevenueAccountId: string;
  taxPayableAccountId: string;
  shippingPayableAccountId: string;
}

export interface PostRefundPostingParams {
  returnId: string;
  refundAmountMinor: bigint;
  commissionReversalMinor: bigint;
  currency: string;
  idempotencyKey: string;
  vendorPayableAccountId: string;
  platformRevenueAccountId: string;
  buyerFundsHeldAccountId: string;
}

@Injectable()
export class LedgerService {
  constructor(
    private readonly db: DatabaseService,
    private readonly outbox: OutboxService
  ) {}

  public async getOrCreateAccount(
    type: string,
    ownerType: string,
    ownerId: string,
    currency: string
  ): Promise<string> {
    const existing = await this.db.query(
      `SELECT id FROM ledger.accounts WHERE type = $1 AND owner_type = $2 AND owner_id = $3 AND currency = $4`,
      [type, ownerType, ownerId, currency]
    );
    if (existing.rows.length > 0) {
      return existing.rows[0].id;
    }
    const insertRes = await this.db.query(
      `INSERT INTO ledger.accounts (type, owner_type, owner_id, currency)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [type, ownerType, ownerId, currency]
    );
    return insertRes?.rows?.[0]?.id || crypto.randomUUID();
  }

  /**
   * Posts an immutable double-entry ledger transaction.
   * Enforces that Σdebits = Σcredits per currency.
   */
  public async postTransaction(cmd: PostTransactionCommand): Promise<LedgerTransaction> {
    const transactionId = crypto.randomUUID();

    const fullEntries: LedgerEntry[] = cmd.entries.map((e) => ({
      ...e,
      id: crypto.randomUUID(),
      transactionId,
    }));

    // Strict Double-Entry Invariant Check (§7.5, ADR 003)
    LedgerValidator.validateBalanced(fullEntries);

    const transaction: LedgerTransaction = {
      id: transactionId,
      refType: cmd.refType,
      refId: cmd.refId,
      description: cmd.description,
      postedAt: new Date(),
      idempotencyKey: cmd.idempotencyKey,
      entries: fullEntries,
    };

    await this.db.query(
      `INSERT INTO ledger.transactions (id, ref_type, ref_id, description, idempotency_key, posted_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [transactionId, cmd.refType, cmd.refId, cmd.description, cmd.idempotencyKey, transaction.postedAt]
    );

    for (const entry of fullEntries) {
      await this.db.query(
        `INSERT INTO ledger.entries (id, transaction_id, account_id, direction, amount_minor, currency)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [entry.id, transactionId, entry.accountId, entry.direction, entry.amountMinor, entry.currency]
      );
    }

    // Stage outbox event
    await this.outbox.stageEvent({
      id: crypto.randomUUID(),
      name: DomainEventNames.LEDGER_ENTRY_POSTED,
      aggregateType: 'ledger',
      aggregateId: transactionId,
      correlationId: crypto.randomUUID(),
      timestamp: new Date(),
      payload: {
        transactionId,
        refType: cmd.refType,
        refId: cmd.refId,
        entryCount: fullEntries.length,
      },
    });

    return transaction;
  }

  /**
   * 1. Capture Posting (§7.5):
   * Debit: psp_clearing / Credit: buyer_funds_held (gross)
   */
  public async postPaymentCapture(params: PostCapturePostingParams): Promise<LedgerTransaction> {
    return await this.postTransaction({
      refType: 'payment_capture',
      refId: params.orderId,
      description: `Payment capture for order ${params.orderId}`,
      idempotencyKey: params.idempotencyKey,
      entries: [
        {
          accountId: params.pspAccountId,
          direction: 'D',
          amountMinor: params.grossAmountMinor,
          currency: params.currency,
        },
        {
          accountId: params.buyerFundsHeldAccountId,
          direction: 'C',
          amountMinor: params.grossAmountMinor,
          currency: params.currency,
        },
      ],
    });
  }

  /**
   * 2. Delivery Confirmed Posting (§7.5):
   * Debit: buyer_funds_held (gross)
   * Credit: vendor_payable (net of commission), platform_revenue (commission), tax_payable, shipping_payable
   */
  public async postDeliveryConfirmed(
    params: PostDeliveryConfirmedPostingParams
  ): Promise<LedgerTransaction> {
    const netVendorPayable =
      params.grossAmountMinor -
      params.commissionMinor -
      params.taxMinor -
      params.shippingMinor;

    const entries: PostTransactionCommand['entries'] = [
      {
        accountId: params.buyerFundsHeldAccountId,
        direction: 'D',
        amountMinor: params.grossAmountMinor,
        currency: params.currency,
      },
      {
        accountId: params.vendorPayableAccountId,
        direction: 'C',
        amountMinor: netVendorPayable,
        currency: params.currency,
      },
      {
        accountId: params.platformRevenueAccountId,
        direction: 'C',
        amountMinor: params.commissionMinor,
        currency: params.currency,
      },
    ];

    if (params.taxMinor > 0n) {
      entries.push({
        accountId: params.taxPayableAccountId,
        direction: 'C',
        amountMinor: params.taxMinor,
        currency: params.currency,
      });
    }

    if (params.shippingMinor > 0n) {
      entries.push({
        accountId: params.shippingPayableAccountId,
        direction: 'C',
        amountMinor: params.shippingMinor,
        currency: params.currency,
      });
    }

    return await this.postTransaction({
      refType: 'delivery_confirmed',
      refId: params.shipmentGroupId,
      description: `Delivery release for shipment group ${params.shipmentGroupId}`,
      idempotencyKey: params.idempotencyKey,
      entries,
    });
  }

  /**
   * 3. Refund Posting (§7.5):
   * Reverses proportionally, debiting vendor_payable and platform_revenue, crediting buyer_funds_held/clearing.
   */
  public async postRefund(params: PostRefundPostingParams): Promise<LedgerTransaction> {
    const vendorDebit = params.refundAmountMinor - params.commissionReversalMinor;

    const entries: PostTransactionCommand['entries'] = [
      {
        accountId: params.vendorPayableAccountId,
        direction: 'D',
        amountMinor: vendorDebit,
        currency: params.currency,
      },
      {
        accountId: params.platformRevenueAccountId,
        direction: 'D',
        amountMinor: params.commissionReversalMinor,
        currency: params.currency,
      },
      {
        accountId: params.buyerFundsHeldAccountId,
        direction: 'C',
        amountMinor: params.refundAmountMinor,
        currency: params.currency,
      },
    ];

    return await this.postTransaction({
      refType: 'refund',
      refId: params.returnId,
      description: `Refund ledger posting for return ${params.returnId}`,
      idempotencyKey: params.idempotencyKey,
      entries,
    });
  }
}
