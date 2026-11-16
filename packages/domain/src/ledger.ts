/**
 * Manga Platform - Double-Entry Ledger Domain Model
 * Immutable facts, strict double-entry invariants (Sum(Debits) == Sum(Credits) per currency).
 */

export type LedgerAccountType =
  | 'buyer_funds_held'
  | 'vendor_payable'
  | 'platform_revenue'
  | 'tax_payable'
  | 'shipping_payable'
  | 'reserve'
  | 'refunds_clearing'
  | 'chargeback_loss'
  | 'psp_clearing'
  | 'bank';

export type LedgerOwnerType = 'platform' | 'vendor' | 'buyer' | 'psp' | 'tax_authority' | 'carrier';

export type LedgerDirection = 'D' | 'C'; // Debit | Credit

export interface LedgerAccount {
  readonly id: string;
  readonly type: LedgerAccountType;
  readonly ownerType: LedgerOwnerType;
  readonly ownerId: string;
  readonly currency: string;
  readonly createdAt: Date;
}

export interface LedgerEntry {
  readonly id: string;
  readonly transactionId: string;
  readonly accountId: string;
  readonly direction: LedgerDirection;
  readonly amountMinor: bigint;
  readonly currency: string;
}

export interface LedgerTransaction {
  readonly id: string;
  readonly refType: string; // e.g. 'order', 'refund', 'payout', 'chargeback'
  readonly refId: string;
  readonly description: string;
  readonly postedAt: Date;
  readonly idempotencyKey: string;
  readonly entries: readonly LedgerEntry[];
}

export class LedgerValidator {
  /**
   * Verifies that the transaction balances perfectly: Sum of Debits == Sum of Credits per currency.
   */
  public static validateBalanced(entries: readonly LedgerEntry[]): void {
    if (entries.length < 2) {
      throw new Error('A ledger transaction must contain at least two entries.');
    }

    const balanceByCurrency = new Map<string, bigint>();

    for (const entry of entries) {
      if (entry.amountMinor <= 0n) {
        throw new Error(`Ledger entry amount must be strictly positive: received ${entry.amountMinor}`);
      }

      const currentBalance = balanceByCurrency.get(entry.currency) ?? 0n;
      // Debit increases asset/expense, Credit increases liability/equity/revenue.
      // Net zero test: Debits (+), Credits (-) must sum to 0.
      const signedDelta = entry.direction === 'D' ? entry.amountMinor : -entry.amountMinor;
      balanceByCurrency.set(entry.currency, currentBalance + signedDelta);
    }

    for (const [currency, balance] of balanceByCurrency.entries()) {
      if (balance !== 0n) {
        throw new Error(
          `Unbalanced ledger transaction for currency ${currency}: net variance is ${balance} minor units.`
        );
      }
    }
  }
}
