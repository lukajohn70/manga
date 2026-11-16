import {
  LedgerAccount,
  LedgerEntry,
  LedgerTransaction,
  LedgerValidator,
} from '@manga/domain';

export interface PostTransactionCommand {
  readonly refType: string;
  readonly refId: string;
  readonly description: string;
  readonly idempotencyKey: string;
  readonly entries: readonly Omit<LedgerEntry, 'id' | 'transactionId'>[];
}

export class LedgerService {
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

    // Invariant check
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

    // In a real database transaction, this writes atomically to `ledger.transactions` and `ledger.entries`
    return transaction;
  }
}
