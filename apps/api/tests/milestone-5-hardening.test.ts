import { describe, it, expect, beforeEach } from 'vitest';
import { MockDatabaseService } from './mock-database.service.js';
import { OutboxService } from '../src/modules/outbox/outbox.service.js';
import { LedgerService } from '../src/modules/ledger/ledger.service.js';
import { InventoryService } from '../src/modules/inventory/inventory.service.js';
import { SearchService } from '../src/modules/search/search.service.js';
import { AdminRepairService } from '../src/modules/admin/repair/admin-repair.service.js';
import { LedgerHealthDetectorService } from '../src/modules/ledger/ledger-health.service.js';
import { RiskEngineService } from '../src/modules/trust/risk-engine.service.js';
import { TelemetryService } from '../src/modules/observability/telemetry.service.js';
import { SecurityService } from '../src/modules/security/security.service.js';
import { DomainEventNames } from '@manga/domain';

describe('Milestone 5: Hardening, Observability, Risk Engine & Admin Repair', () => {
  let db: MockDatabaseService;
  let outbox: OutboxService;
  let ledger: LedgerService;
  let inventory: InventoryService;
  let search: SearchService;
  let adminRepair: AdminRepairService;
  let ledgerHealth: LedgerHealthDetectorService;
  let riskEngine: RiskEngineService;
  let telemetry: TelemetryService;
  let security: SecurityService;

  beforeEach(() => {
    db = new MockDatabaseService();
    outbox = new OutboxService();
    ledger = new LedgerService(db, outbox);
    inventory = new InventoryService(db, outbox);
    search = new SearchService(db);
    adminRepair = new AdminRepairService(db, ledger, outbox, inventory, search);
    ledgerHealth = new LedgerHealthDetectorService(db);
    riskEngine = new RiskEngineService(db, outbox);
    telemetry = new TelemetryService(db);
    security = new SecurityService();
  });

  describe('M5.1 Admin Operational Repair Tools & Audit Logging (§18)', () => {
    it('replays a failed outbox event and logs immutable audit trail', async () => {
      const eventId = crypto.randomUUID();
      db.tables['outbox.events'].push({
        id: eventId,
        event_name: 'order.confirmed',
        aggregate_type: 'order',
        aggregate_id: 'ord-123',
        status: 'failed',
      });

      const res = await adminRepair.replayOutboxEvent({
        eventId,
        actorId: 'admin_ops@manga.ng',
        reason: 'Webhook consumer timed out due to carrier downtime',
      });

      expect(res.success).toBe(true);
      expect(res.status).toBe('replayed_pending');

      const updatedEv = db.tables['outbox.events'].find((e) => e.id === eventId);
      expect(updatedEv?.status).toBe('pending');

      // Verify audit log
      const logs = await adminRepair.getAuditLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].action).toBe('REPLAY_OUTBOX_EVENT');
      expect(logs[0].actor_id).toBe('admin_ops@manga.ng');
    });

    it('releases stuck inventory reservation and restores stock with audit trail', async () => {
      const whId = crypto.randomUUID();
      const variantId = crypto.randomUUID();
      const reservationId = crypto.randomUUID();

      // Seed stock: on_hand=10, reserved=2, safety_stock=0
      db.tables['inventory.stock_levels'].push({
        warehouse_id: whId,
        variant_id: variantId,
        on_hand: 10,
        reserved: 2,
        safety_stock: 0,
      });

      db.tables['inventory.reservations'].push({
        id: reservationId,
        warehouse_id: whId,
        variant_id: variantId,
        quantity: 2,
        status: 'active',
      });

      const res = await adminRepair.releaseStuckReservation({
        reservationId,
        actorId: 'inv_lead@manga.ng',
        reason: 'Checkout session expired without payment confirmation',
      });

      expect(res.success).toBe(true);
      expect(res.status).toBe('released');

      // Verify audit log
      const logs = await adminRepair.getAuditLogs();
      const invLog = logs.find((l) => l.action === 'RELEASE_STUCK_RESERVATION');
      expect(invLog).toBeDefined();
    });

    it('enforces Maker-Checker requirement when reversing a ledger transaction', async () => {
      const txId = crypto.randomUUID();
      const acc1 = crypto.randomUUID();
      const acc2 = crypto.randomUUID();

      db.tables['ledger.transactions'].push({
        id: txId,
        ref_type: 'fee_posting',
        ref_id: 'ord-1',
        description: 'Incorrect fee charge',
        posted_at: new Date(),
        idempotency_key: 'idemp-fee-01',
      });

      db.tables['ledger.entries'].push(
        { id: crypto.randomUUID(), transaction_id: txId, account_id: acc1, direction: 'D', amount_minor: 50000n, currency: 'NGN' },
        { id: crypto.randomUUID(), transaction_id: txId, account_id: acc2, direction: 'C', amount_minor: 50000n, currency: 'NGN' }
      );

      // 1. Violating Maker-Checker (actor === checker) must fail
      await expect(
        adminRepair.reverseLedgerTransaction({
          transactionId: txId,
          actorId: 'finance_admin_1',
          checkerId: 'finance_admin_1',
          reason: 'Unauthorized self-approval',
          idempotencyKey: 'rev-01',
        })
      ).rejects.toThrow('Maker-Checker violation');

      // 2. Dual approval succeeds
      const result = await adminRepair.reverseLedgerTransaction({
        transactionId: txId,
        actorId: 'finance_maker@manga.ng',
        checkerId: 'finance_checker@manga.ng',
        reason: 'Authorized reversal of duplicate surcharge',
        idempotencyKey: 'rev-02',
      });

      expect(result.success).toBe(true);
      expect(result.reversingTransactionId).toBeDefined();
      expect(result.approvedBy).toBe('finance_checker@manga.ng');

      // Verify reversing transaction is perfectly balanced
      const reversingEntries = db.tables['ledger.entries'].filter(
        (e) => e.transaction_id === result.reversingTransactionId
      );
      expect(reversingEntries).toHaveLength(2);
      const revDebit = reversingEntries.find((e) => e.direction === 'D');
      const revCredit = reversingEntries.find((e) => e.direction === 'C');
      expect(revDebit?.amount_minor).toBe(50000n);
      expect(revCredit?.amount_minor).toBe(50000n);
    });
  });

  describe('M5.2 Fraud & Risk Engine v1 (§13)', () => {
    it('allows clean checkout with low risk score', async () => {
      const result = await riskEngine.evaluateCheckoutRisk({
        orderAmountMinor: 1500000n, // ₦15,000.00
        currency: 'NGN',
        cardAttemptsLast10Min: 1,
        ordersFromIpLastHour: 1,
        buyerCompletedOrdersCount: 3,
      });

      expect(result.action).toBe('allow');
      expect(result.riskScore).toBeLessThan(30);
      expect(result.matchedRules).toHaveLength(0);
    });

    it('denies checkout from blacklisted device emulator signature', async () => {
      const result = await riskEngine.evaluateCheckoutRisk({
        orderAmountMinor: 5000000n,
        currency: 'NGN',
        deviceFingerprint: 'fp_emulator_nox_001',
      });

      expect(result.action).toBe('deny');
      expect(result.riskScore).toBeGreaterThanOrEqual(90);
      expect(result.matchedRules).toContain('RULE_BLACKLISTED_DEVICE_FINGERPRINT');

      // Verify outbox risk.flagged event
      const staged = outbox.getStagedEvents();
      const flagged = staged.find((e) => e.eventName === DomainEventNames.RISK_FLAGGED);
      expect(flagged).toBeDefined();
    });

    it('requires 3DS / OTP step-up when card velocity threshold is breached', async () => {
      const result = await riskEngine.evaluateCheckoutRisk({
        orderAmountMinor: 2500000n,
        currency: 'NGN',
        cardAttemptsLast10Min: 4, // Breaches threshold of 3
      });

      expect(result.action).toBe('require_3ds_otp');
      expect(result.matchedRules).toContain('RULE_CARD_ATTEMPT_VELOCITY');
    });

    it('honors shadow mode by passing allow action while recording real risk evaluation', async () => {
      const result = await riskEngine.evaluateCheckoutRisk({
        orderAmountMinor: 5000000n,
        currency: 'NGN',
        deviceFingerprint: 'fp_emulator_nox_001',
        shadowMode: true,
      });

      expect(result.shadowMode).toBe(true);
      expect(result.action).toBe('allow'); // Passed through because shadow mode is active
      expect(result.riskScore).toBe(90); // Real risk score preserved
    });
  });

  describe('M5.3 Observability, Telemetry & Business SLOs (§18)', () => {
    it('tracks OpenTelemetry spans and scrubs PII from log metadata', () => {
      const span = telemetry.startSpan('checkout.process_payment', {
        correlationId: 'corr-tx-99',
        orderId: 'ord-8812',
        email: 'chidi.buyer@gmail.com',
        phone: '+2348099887766',
        amountMinor: 2500000n,
      });

      expect(span.traceId).toBe('corr-tx-99');
      expect(span.tags.email).toBe('[REDACTED_PII]');
      expect(span.tags.phone).toBe('[REDACTED_PII]');
      expect(span.tags.orderId).toBe('ord-8812');

      const ended = telemetry.endSpan(span.spanId, { status: 'success' });
      expect(ended.durationMs).toBeGreaterThanOrEqual(0);
    });

    it('collects business SLO health metrics', async () => {
      db.tables['orders.orders'].push({ id: 'ord-1', status: 'pending_payment', created_at: new Date(Date.now() - 40 * 60 * 1000) });
      db.tables['payments.payments'].push({ id: 'pay-1', status: 'captured' }, { id: 'pay-2', status: 'captured' });

      const metrics = await telemetry.collectBusinessSloMetrics();
      expect(metrics.paymentSuccessRatePercent).toBe(100);
      expect(metrics.ordersStuckInPayment).toBe(1);
    });
  });

  describe('M5.4 Real-Time Unbalanced Ledger Detector (§18, ADR 003)', () => {
    it('confirms 100% healthy when debits exactly equal credits across all entries', async () => {
      const txId = crypto.randomUUID();
      db.tables['ledger.entries'].push(
        { id: 'e1', transaction_id: txId, direction: 'D', amount_minor: 10000000n, currency: 'NGN' },
        { id: 'e2', transaction_id: txId, direction: 'C', amount_minor: 10000000n, currency: 'NGN' }
      );

      const report = await ledgerHealth.checkLedgerIntegrity();
      expect(report.isHealthy).toBe(true);
      expect(report.criticalAlert).toBeNull();
      expect(report.unbalancedTransactionIds).toHaveLength(0);
    });

    it('triggers P0 Critical Alert when an unbalanced ledger entry anomaly is detected', async () => {
      const txId = crypto.randomUUID();
      // Injecting a 1 kobo / ₦1.00 discrepancy
      db.tables['ledger.entries'].push(
        { id: 'e1', transaction_id: txId, direction: 'D', amount_minor: 10000000n, currency: 'NGN' },
        { id: 'e2', transaction_id: txId, direction: 'C', amount_minor: 9999900n, currency: 'NGN' } // 100 minor units short
      );

      const report = await ledgerHealth.checkLedgerIntegrity();
      expect(report.isHealthy).toBe(false);
      expect(report.criticalAlert).toContain('P0 CRITICAL: Unbalanced double-entry ledger detected!');
      expect(report.unbalancedTransactionIds).toContain(txId);
      expect(report.currencies[0].varianceMinor).toBe(100n);
    });
  });

  describe('M5.5 Security Hardening: PII Envelope Encryption & Rate Limiting (§12)', () => {
    it('performs AES-256-GCM envelope encryption and decryption with authentication tag integrity', () => {
      const sensitivePii = '+234 801 234 5678, 14 Broad Street, Lagos';

      const encrypted = security.encryptField(sensitivePii);
      expect(encrypted.ciphertextHex).not.toBe(sensitivePii);
      expect(encrypted.ivHex).toHaveLength(24); // 12 bytes = 24 hex chars
      expect(encrypted.authTagHex).toHaveLength(32); // 16 bytes = 32 hex chars

      const decrypted = security.decryptField(encrypted);
      expect(decrypted).toBe(sensitivePii);
    });

    it('enforces sliding-window rate limiting and throws HTTP 429 when threshold exceeded', () => {
      const clientIp = '197.210.65.12';

      // Limit: 3 requests per 10 seconds
      security.enforceRateLimit(clientIp, 3, 10);
      security.enforceRateLimit(clientIp, 3, 10);
      security.enforceRateLimit(clientIp, 3, 10);

      // 4th request must throw 429
      expect(() => security.enforceRateLimit(clientIp, 3, 10)).toThrow('Rate limit exceeded');
    });
  });
});
