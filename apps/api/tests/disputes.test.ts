import { describe, it, expect, beforeEach } from 'vitest';
import { MockDatabaseService } from './mock-database.service.js';
import { OutboxService } from '../src/modules/outbox/outbox.service.js';
import { LedgerService } from '../src/modules/ledger/ledger.service.js';
import { DisputesService } from '../src/modules/disputes/disputes.service.js';
import { DomainEventNames } from '@manga/domain';

describe('Milestone 4.8: Dispute Center & Binding Mediation Engine', () => {
  let db: MockDatabaseService;
  let outbox: OutboxService;
  let ledger: LedgerService;
  let disputes: DisputesService;

  beforeEach(() => {
    db = new MockDatabaseService();
    outbox = new OutboxService();
    ledger = new LedgerService(db, outbox);
    disputes = new DisputesService(db, ledger, outbox);
  });

  it('manages the entire dispute dispute lifecycle: opening, evidence compilation, and binding resolution with double-entry refund', async () => {
    // 1. Setup sample order, shipment group, and vendor
    const vendorId = crypto.randomUUID();
    const orderId = crypto.randomUUID();
    const shipmentGroupId = crypto.randomUUID();

    db.tables['vendor.vendors'].push({
      id: vendorId,
      business_name: 'Apex Superstore',
      status: 'active',
    });

    db.tables['orders.orders'].push({
      id: orderId,
      order_number: 'MNG-2611-99XYZ',
      currency: 'NGN',
      totals: { grandTotalMinor: 15000000n },
      address_snapshot: { street: '14 Broad Street', city: 'Lagos Island', state: 'Lagos' },
    });

    db.tables['orders.shipment_groups'].push({
      id: shipmentGroupId,
      order_id: orderId,
      vendor_id: vendorId,
      status: 'delivered',
    });

    // 2. Open Dispute (Buyer initiates due to damaged item)
    const disputeCase = await disputes.openDispute({
      orderId,
      shipmentGroupId,
      openedBy: 'buyer',
      type: 'damaged_goods',
      reason: 'The outer box was smashed and the internal display is cracked.',
      claimedAmountMinor: 12500000n,
      currency: 'NGN',
    });

    expect(disputeCase).toBeDefined();
    expect(disputeCase.id).toBeDefined();
    expect(disputeCase.status).toBe('opened');
    expect(new Date(disputeCase.deadline_at).getTime()).toBeGreaterThan(Date.now() + 4 * 24 * 3600 * 1000);

    // Verify outbox event emitted
    const stagedEvents = outbox.getStagedEvents();
    const openEvent = stagedEvents.find((e) => e.eventName === DomainEventNames.DISPUTE_OPENED);
    expect(openEvent).toBeDefined();
    expect((openEvent?.payload as any).orderId).toBe(orderId);

    // 3. Evidence Submission (Buyer photo + Carrier slip)
    const buyerEvidence = await disputes.submitEvidence({
      caseId: disputeCase.id,
      party: 'buyer',
      kind: 'photo',
      uri: 'https://cdn.manga.internal/evidence/cracked_screen.jpg',
      notes: 'Photo of cracked screen immediately upon unpacking',
    });
    expect(buyerEvidence.party).toBe('buyer');

    const carrierEvidence = await disputes.submitEvidence({
      caseId: disputeCase.id,
      party: 'carrier',
      kind: 'document',
      uri: 'https://cdn.manga.internal/evidence/carrier_damage_log.pdf',
      notes: 'Carrier driver signed exception log acknowledging damaged carton',
    });
    expect(carrierEvidence.party).toBe('carrier');

    // 4. Evidence Bundle Retrieval
    const bundle = await disputes.getDisputeDetail(disputeCase.id);
    expect(bundle.disputeCase.id).toBe(disputeCase.id);
    expect(bundle.order.orderNumber).toBe('MNG-2611-99XYZ');
    expect(bundle.shipmentGroup.vendorName).toBe('Apex Superstore');
    expect(bundle.evidenceFiles).toHaveLength(2);

    // 5. Admin Mediator Ruling: In Buyer Favor (Vendor liability)
    const resolution = await disputes.resolveDispute(disputeCase.id, {
      adminId: 'admin-support-01',
      outcome: 'resolved_buyer_favor',
      resolutionNotes: 'Carrier inspection confirms transit mishandling. Full refund granted to buyer from vendor funds.',
      refundAmountMinor: 12500000n,
      refundSource: 'vendor',
      currency: 'NGN',
      idempotencyKey: 'idemp-disp-resolve-001',
    });

    expect(resolution.status).toBe('resolved_buyer_favor');
    expect(resolution.ledger_tx_id).toBeDefined();

    // Verify ledger balanced transaction was posted
    const disputeTx = db.tables['ledger.transactions'].find((tx) => tx.id === resolution.ledger_tx_id);
    expect(disputeTx).toBeDefined();
    expect(disputeTx.ref_type).toBe('dispute_vendor_refund');

    const disputeEntries = db.tables['ledger.entries'].filter((e) => e.transaction_id === disputeTx.id);
    expect(disputeEntries).toHaveLength(2);
    const debit = disputeEntries.find((e) => e.direction === 'D');
    const credit = disputeEntries.find((e) => e.direction === 'C');
    expect(debit?.amount_minor).toBe(12500000n);
    expect(credit?.amount_minor).toBe(12500000n);
    // Double-entry invariant holds
    expect(debit?.amount_minor).toEqual(credit?.amount_minor);

    // Verify dispute.resolved outbox event
    const resolvedEvent = outbox.getStagedEvents().find((e) => e.eventName === DomainEventNames.DISPUTE_RESOLVED);
    expect(resolvedEvent).toBeDefined();
    expect((resolvedEvent?.payload as any).outcome).toBe('resolved_buyer_favor');

    // 6. Prevent double resolution
    await expect(
      disputes.resolveDispute(disputeCase.id, {
        adminId: 'admin-support-02',
        outcome: 'resolved_vendor_favor',
        resolutionNotes: 'Attempting to change outcome',
        idempotencyKey: 'idemp-disp-resolve-002',
      })
    ).rejects.toThrow('already closed/resolved');
  });

  it('supports platform guarantee absorption when vendor cannot be held liable', async () => {
    const vendorId = crypto.randomUUID();
    const orderId = crypto.randomUUID();
    const shipmentGroupId = crypto.randomUUID();

    db.tables['vendor.vendors'].push({ id: vendorId, business_name: 'Electro Mart', status: 'active' });
    db.tables['orders.orders'].push({
      id: orderId,
      order_number: 'MNG-2611-PLAT-01',
      currency: 'NGN',
      totals: { grandTotalMinor: 5000000n },
    });
    db.tables['orders.shipment_groups'].push({
      id: shipmentGroupId,
      order_id: orderId,
      vendor_id: vendorId,
      status: 'delivered',
    });

    const disputeCase = await disputes.openDispute({
      orderId,
      shipmentGroupId,
      openedBy: 'buyer',
      type: 'package_theft',
      reason: 'Porch piracy verified via CCTV footage.',
      claimedAmountMinor: 5000000n,
    });

    // Resolve with platform guarantee
    const resolution = await disputes.resolveDispute(disputeCase.id, {
      adminId: 'admin-lead-99',
      outcome: 'settled_by_platform',
      resolutionNotes: 'Neither buyer nor vendor at fault. Platform Goodwill Guarantee Fund covers buyer refund.',
      refundAmountMinor: 5000000n,
      refundSource: 'platform_guarantee',
      currency: 'NGN',
      idempotencyKey: 'idemp-plat-guar-001',
    });

    expect(resolution.status).toBe('settled_by_platform');
    const tx = db.tables['ledger.transactions'].find((t) => t.id === resolution.ledger_tx_id);
    expect(tx?.ref_type).toBe('dispute_guarantee_settlement');

    const entries = db.tables['ledger.entries'].filter((e) => e.transaction_id === tx.id);
    expect(entries).toHaveLength(2);
    expect(entries[0].amount_minor).toBe(5000000n);
    expect(entries[1].amount_minor).toBe(5000000n);
  });
});
