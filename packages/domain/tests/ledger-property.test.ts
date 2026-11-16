import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { LedgerValidator, LedgerEntry } from '../src/ledger.js';

describe('Ledger Property-Based Invariants (fast-check)', () => {
  it('mathematically guarantees: perfectly balanced transactions always pass validation', () => {
    fc.assert(
      fc.property(
        fc.bigInt({ min: 1n, max: 1_000_000_000_000n }),
        fc.constantFrom('NGN', 'USD', 'EUR', 'GBP'),
        (amount, currency) => {
          const entries: LedgerEntry[] = [
            {
              id: '1',
              transactionId: 'tx-prop',
              accountId: 'acc-debit',
              direction: 'D',
              amountMinor: amount,
              currency,
            },
            {
              id: '2',
              transactionId: 'tx-prop',
              accountId: 'acc-credit',
              direction: 'C',
              amountMinor: amount,
              currency,
            },
          ];

          expect(() => LedgerValidator.validateBalanced(entries)).not.toThrow();
        }
      ),
      { numRuns: 1000 }
    );
  });

  it('mathematically guarantees: any non-zero difference between debits and credits is caught and rejected', () => {
    fc.assert(
      fc.property(
        fc.bigInt({ min: 1n, max: 1_000_000_000_000n }),
        fc.bigInt({ min: 1n, max: 1_000_000n }),
        fc.constantFrom('NGN', 'USD', 'EUR', 'GBP'),
        (amount, delta, currency) => {
          const entries: LedgerEntry[] = [
            {
              id: '1',
              transactionId: 'tx-prop',
              accountId: 'acc-debit',
              direction: 'D',
              amountMinor: amount + delta,
              currency,
            },
            {
              id: '2',
              transactionId: 'tx-prop',
              accountId: 'acc-credit',
              direction: 'C',
              amountMinor: amount,
              currency,
            },
          ];

          expect(() => LedgerValidator.validateBalanced(entries)).toThrow(
            /Unbalanced ledger transaction/
          );
        }
      ),
      { numRuns: 1000 }
    );
  });
});
