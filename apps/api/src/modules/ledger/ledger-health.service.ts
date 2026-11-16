import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';

export interface CurrencyBalanceReport {
  currency: string;
  totalDebitsMinor: bigint;
  totalCreditsMinor: bigint;
  varianceMinor: bigint;
  isBalanced: boolean;
}

export interface LedgerAuditReport {
  isHealthy: boolean;
  timestamp: Date;
  currencies: CurrencyBalanceReport[];
  criticalAlert: string | null;
  unbalancedTransactionIds: string[];
}

@Injectable()
export class LedgerHealthDetectorService {
  private readonly logger = new Logger(LedgerHealthDetectorService.name);

  constructor(private readonly db: DatabaseService) {}

  /**
   * Continuous detector enforcing that sum(Debits) - sum(Credits) == 0 per currency.
   * If any non-zero variance exists, triggers a P0 Critical Alert. (§18, ADR 003)
   */
  public async checkLedgerIntegrity(): Promise<LedgerAuditReport> {
    const entriesRes = await this.db.query(
      `SELECT transaction_id, direction, amount_minor, currency FROM ledger.entries`
    );

    const currencyTotals: Record<string, { debits: bigint; credits: bigint }> = {};
    const txImbalanceCheck: Record<string, { debits: bigint; credits: bigint }> = {};

    for (const entry of entriesRes.rows) {
      const currency = entry.currency || 'NGN';
      const amount = BigInt(entry.amount_minor);

      if (!currencyTotals[currency]) {
        currencyTotals[currency] = { debits: 0n, credits: 0n };
      }

      if (!txImbalanceCheck[entry.transaction_id]) {
        txImbalanceCheck[entry.transaction_id] = { debits: 0n, credits: 0n };
      }

      if (entry.direction === 'D') {
        currencyTotals[currency].debits += amount;
        txImbalanceCheck[entry.transaction_id].debits += amount;
      } else if (entry.direction === 'C') {
        currencyTotals[currency].credits += amount;
        txImbalanceCheck[entry.transaction_id].credits += amount;
      }
    }

    const reports: CurrencyBalanceReport[] = [];
    let overallHealthy = true;

    for (const [curr, totals] of Object.entries(currencyTotals)) {
      const variance = totals.debits - totals.credits;
      const balanced = variance === 0n;
      if (!balanced) {
        overallHealthy = false;
      }
      reports.push({
        currency: curr,
        totalDebitsMinor: totals.debits,
        totalCreditsMinor: totals.credits,
        varianceMinor: variance,
        isBalanced: balanced,
      });
    }

    // Find any individually unbalanced transactions
    const offendingTxIds: string[] = [];
    for (const [txId, totals] of Object.entries(txImbalanceCheck)) {
      if (totals.debits !== totals.credits) {
        offendingTxIds.push(txId);
      }
    }

    let criticalAlert: string | null = null;
    if (!overallHealthy || offendingTxIds.length > 0) {
      criticalAlert = `P0 CRITICAL: Unbalanced double-entry ledger detected! Offending transactions: ${offendingTxIds.join(
        ', '
      )}. Variance details: ${JSON.stringify(
        reports.map((r) => ({ curr: r.currency, variance: r.varianceMinor.toString() }))
      )}`;
      this.logger.error(criticalAlert);
    }

    return {
      isHealthy: overallHealthy && offendingTxIds.length === 0,
      timestamp: new Date(),
      currencies: reports,
      criticalAlert,
      unbalancedTransactionIds: offendingTxIds,
    };
  }
}
