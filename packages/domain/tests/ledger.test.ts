import { describe, it, expect } from 'vitest';
import { LedgerValidator, LedgerEntry } from '../src/ledger.js';

describe('Double-Entry Ledger Invariants', () => {
  it('accepts perfectly balanced transactions where sum(debits) == sum(credits)', () => {
    // Payment capture: Debit PSP clearing 10,000, Credit Buyer funds held 10,000
    const entries: LedgerEntry[] = [
      {
        id: '1',
        transactionId: 'tx-1',
        accountId: 'acc-psp',
        direction: 'D',
        amountMinor: 10000n,
        currency: 'NGN',
      },
      {
        id: '2',
        transactionId: 'tx-1',
        accountId: 'acc-buyer-held',
        direction: 'C',
        amountMinor: 10000n,
        currency: 'NGN',
      },
    ];

    expect(() => LedgerValidator.validateBalanced(entries)).not.toThrow();
  });

  it('rejects unbalanced transactions with an explicit variance error', () => {
    const entries: LedgerEntry[] = [
      {
        id: '1',
        transactionId: 'tx-1',
        accountId: 'acc-psp',
        direction: 'D',
        amountMinor: 10000n,
        currency: 'NGN',
      },
      {
        id: '2',
        transactionId: 'tx-1',
        accountId: 'acc-buyer-held',
        direction: 'C',
        amountMinor: 9500n,
        currency: 'NGN',
      },
    ];

    expect(() => LedgerValidator.validateBalanced(entries)).toThrow(
      /Unbalanced ledger transaction for currency NGN: net variance is 500 minor units/
    );
  });

  it('rejects transactions with negative or zero amounts', () => {
    const entries: LedgerEntry[] = [
      {
        id: '1',
        transactionId: 'tx-1',
        accountId: 'acc-1',
        direction: 'D',
        amountMinor: 0n,
        currency: 'NGN',
      },
      {
        id: '2',
        transactionId: 'tx-1',
        accountId: 'acc-2',
        direction: 'C',
        amountMinor: 0n,
        currency: 'NGN',
      },
    ];

    expect(() => LedgerValidator.validateBalanced(entries)).toThrow(
      /Ledger entry amount must be strictly positive/
    );
  });
});
