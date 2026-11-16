import { describe, it, expect, beforeEach } from 'vitest';
import { MockDatabaseService } from './mock-database.service.js';
import { OutboxService } from '../src/modules/outbox/outbox.service.js';
import { LedgerService } from '../src/modules/ledger/ledger.service.js';
import { InventoryService } from '../src/modules/inventory/inventory.service.js';
import { CheckoutService } from '../src/modules/checkout/checkout.service.js';
import { ShippingService } from '../src/modules/shipping/shipping.service.js';
import { ReturnsService } from '../src/modules/returns/returns.service.js';
import { PayoutsService } from '../src/modules/payouts/payouts.service.js';

describe('Phase 1 E2E: Checkout, Multi-Vendor Fulfillment, Ledger & Payouts', () => {
  let db: MockDatabaseService;
  let outbox: OutboxService;
  let ledger: LedgerService;
  let inventory: InventoryService;
  let checkout: CheckoutService;
  let shipping: ShippingService;
  let returns: ReturnsService;
  let payouts: PayoutsService;

  beforeEach(() => {
    db = new MockDatabaseService();
    outbox = new OutboxService();
    ledger = new LedgerService(db, outbox);
    inventory = new InventoryService(db, outbox);
    checkout = new CheckoutService(db, inventory, ledger, outbox);
    shipping = new ShippingService(db, ledger, outbox);
    returns = new ReturnsService(db, ledger, outbox);
    payouts = new PayoutsService(db, ledger, outbox);
  });

  it('orchestrates end-to-end checkout saga, inventory reservation, and ledger capture', async () => {
    // 1. Seed two vendors with warehouses and stock
    const vendor1 = { id: crypto.randomUUID(), business_name: 'Tech Haven', status: 'active' };
    const vendor2 = { id: crypto.randomUUID(), business_name: 'Book World', status: 'active' };
    db.tables['vendor.vendors'].push(vendor1, vendor2);

    const wh1 = { id: crypto.randomUUID(), vendor_id: vendor1.id, code: 'WH1' };
    const wh2 = { id: crypto.randomUUID(), vendor_id: vendor2.id, code: 'WH2' };
    db.tables['vendor.warehouses'].push(wh1, wh2);

    // Products & Variants
    const prod1 = { id: crypto.randomUUID(), title: 'Wireless Earbuds' };
    const prod2 = { id: crypto.randomUUID(), title: 'TypeScript Manual' };
    db.tables['catalog.master_products'].push(prod1, prod2);

    const var1 = { id: crypto.randomUUID(), master_product_id: prod1.id, sku_canonical: 'SKU-EARBUDS' };
    const var2 = { id: crypto.randomUUID(), master_product_id: prod2.id, sku_canonical: 'SKU-BOOK' };
    db.tables['catalog.variants'].push(var1, var2);

    // Stock levels: 20 units each
    db.tables['inventory.stock_levels'].push(
      { variant_id: var1.id, warehouse_id: wh1.id, on_hand: 20, reserved: 0, safety_stock: 0 },
      { variant_id: var2.id, warehouse_id: wh2.id, on_hand: 20, reserved: 0, safety_stock: 0 }
    );

    // Offers: Earbuds = 25,000 NGN, Book = 10,000 NGN
    const offer1 = {
      id: crypto.randomUUID(),
      vendor_id: vendor1.id,
      variant_id: var1.id,
      price_minor: '2500000',
      currency: 'NGN',
      status: 'active',
    };
    const offer2 = {
      id: crypto.randomUUID(),
      vendor_id: vendor2.id,
      variant_id: var2.id,
      price_minor: '1000000',
      currency: 'NGN',
      status: 'active',
    };
    db.tables['offers.offers'].push(offer1, offer2);

    // 2. Buyer places multi-vendor order
    const buyerId = crypto.randomUUID();
    const idempotencyKey = 'IDEMPOTENCY-CHECKOUT-001';

    const orderResult = await checkout.confirmCheckout({
      buyerId,
      items: [
        { offerId: offer1.id, qty: 1 },
        { offerId: offer2.id, qty: 2 },
      ],
      shippingAddress: {
        recipientName: 'Alice Buyer',
        phone: '+2348012345678',
        streetAddress: '14 Broad Street',
        city: 'Lagos',
        stateOrProvince: 'Lagos',
        countryCode: 'NG',
      },
      paymentMethod: 'card',
      idempotencyKey,
    });

    expect(orderResult.status).toBe('confirmed');
    expect(orderResult.orderId).toBeDefined();

    // Invariant: Subtotal = 25,000 + 2 * 10,000 = 45,000 NGN (4,500,000 minor)
    // Shipping: 2 vendors * 1,500 NGN = 3,000 NGN (300,000 minor)
    // Tax: 7.5% of 45,000 NGN = 3,375 NGN (337,500 minor)
    // Grand total: 5,137,500 minor
    expect(orderResult.grandTotalMinor).toBe('5137500');

    // 3. Verify Idempotency: Repeating exact call returns existing order without re-charging
    const repeatedResult = await checkout.confirmCheckout({
      buyerId,
      items: [
        { offerId: offer1.id, qty: 1 },
        { offerId: offer2.id, qty: 2 },
      ],
      shippingAddress: {
        recipientName: 'Alice Buyer',
        phone: '+2348012345678',
        streetAddress: '14 Broad Street',
        city: 'Lagos',
        stateOrProvince: 'Lagos',
        countryCode: 'NG',
      },
      paymentMethod: 'card',
      idempotencyKey,
    });

    expect(repeatedResult.orderId).toBe(orderResult.orderId);
    expect(repeatedResult.orderNumber).toBe(orderResult.orderNumber);

    // 4. Fulfillment & Shipping: Vendor 1 accepts and generates label
    const vendor1ShipmentGroup = db.tables['orders.shipment_groups'].find(
      (sg) => sg.vendor_id === vendor1.id
    );
    expect(vendor1ShipmentGroup).toBeDefined();

    const acceptedGroup = await shipping.acceptShipmentGroup(vendor1ShipmentGroup.id, vendor1.id);
    expect(acceptedGroup.status).toBe('accepted');

    // Vendor packs and requests shipping label
    const shipment = await shipping.createShipmentLabel(vendor1ShipmentGroup.id, vendor1.id, 500);
    expect(shipment.tracking_number).toBeDefined();
    expect(shipment.label_url).toBeDefined();

    // 5. Tracking Ingestion Pipeline
    // Carrier scans: picked up -> in transit -> delivered
    await shipping.ingestTrackingEvent({
      carrierId: 'mock_carrier_logistics',
      trackingNumber: shipment.tracking_number,
      sourceEventId: 'SCAN-001',
      carrierStatus: 'HUB_SCANNED_IN_TRANSIT',
      occurredAt: new Date(),
    });

    // Deduplication check: duplicate scan must be ignored safely
    await shipping.ingestTrackingEvent({
      carrierId: 'mock_carrier_logistics',
      trackingNumber: shipment.tracking_number,
      sourceEventId: 'SCAN-001',
      carrierStatus: 'HUB_SCANNED_IN_TRANSIT',
      occurredAt: new Date(),
    });

    // Out for delivery scan
    await shipping.ingestTrackingEvent({
      carrierId: 'mock_carrier_logistics',
      trackingNumber: shipment.tracking_number,
      sourceEventId: 'SCAN-002',
      carrierStatus: 'OUT_FOR_DELIVERY',
      occurredAt: new Date(),
    });

    // Delivered scan: releases escrow and triggers delivery confirmed ledger posting
    await shipping.ingestTrackingEvent({
      carrierId: 'mock_carrier_logistics',
      trackingNumber: shipment.tracking_number,
      sourceEventId: 'SCAN-003',
      carrierStatus: 'PARCEL_DELIVERED',
      occurredAt: new Date(),
    });

    // Verify shipment group reached terminal status 'delivered'
    const updatedSg = db.tables['orders.shipment_groups'].find(
      (sg) => sg.id === vendor1ShipmentGroup.id
    );
    expect(updatedSg.status).toBe('delivered');

    // 6. Returns & Inspection Flow
    const returnRequest = await returns.requestReturn({
      orderId: orderResult.orderId,
      shipmentGroupId: vendor1ShipmentGroup.id,
      reasonCode: 'buyer_remorse',
      resolutionRequested: 'refund',
      items: [
        {
          orderLineId: 'line-1',
          qty: 1,
          conditionClaimed: 'unopened',
        },
      ],
    });
    expect(returnRequest.status).toBe('requested');

    // Inspection and refund execution
    const inspectionResult = await returns.inspectAndRefund({
      returnRequestId: returnRequest.id,
      graderId: 'support-agent-1',
      grade: 'like_new',
      notes: 'Item in perfect sealed box',
      refundAmountMinor: 2500000n,
      commissionReversalMinor: 125000n,
      currency: 'NGN',
      idempotencyKey: 'REFUND-IDEM-001',
    });
    expect(inspectionResult.status).toBe('refund_issued');

    // 7. Payout Engine: generate batch and execute maker-checker approval
    const batch = await payouts.createPayoutBatch('NGN');
    expect(batch.status).toBe('pending_approval');
    expect(batch.itemCount).toBeGreaterThan(0);

    const executedBatch = await payouts.approveAndExecutePayout(
      batch.id,
      'finance-admin-1',
      batch.totalAmountMinor,
      'NGN'
    );
    expect(executedBatch.status).toBe('paid');
    expect(executedBatch.approvedBy).toBe('finance-admin-1');
  });
});
