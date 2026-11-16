# ADR 003: Double-Entry Append-Only Ledger

## Status
Accepted (Core Invariant - Non-negotiable)

## Context
Marketplace platforms handle complex multi-party money movement: buyer payments, vendor payables, marketplace commissions, shipping deductions, tax liabilities, refunds, and chargebacks. Mutable balance columns (`UPDATE accounts SET balance = balance + x`) cause balance drift, concurrency bugs, and audit failures.

## Decision
All financial events must be recorded in an immutable, double-entry ledger:
1. Every transaction consists of balanced journal entries where $\sum \text{Debits} = \sum \text{Credits}$ per currency.
2. Ledger transactions and entries are strictly append-only; `UPDATE` and `DELETE` operations are prohibited at database and application layers.
3. Corrections and reversals are performed exclusively by posting new reversing transactions.
4. Account balances are materialised projections derived from journal entries.

## Consequences
- Guaranteed audit trail and financial consistency.
- Trivial automated reconciliation against payment gateway and bank settlement files.
- Inability to silently modify historic financial figures.
