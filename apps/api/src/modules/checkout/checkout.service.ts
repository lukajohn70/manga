import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';
import { InventoryService } from '../inventory/inventory.service.js';
import { LedgerService } from '../ledger/ledger.service.js';
import { OutboxService } from '../outbox/outbox.service.js';
import { PaymentProvider, MockCardPaymentProvider } from '../payments/payment.provider.js';
import { DomainEventNames, MoneyUtil, ShipmentGroupStateMachine } from '@manga/domain';

export interface CheckoutItemInput {
  offerId: string;
  qty: number;
}

export interface ConfirmCheckoutSessionDto {
  buyerId: string;
  items: CheckoutItemInput[];
  shippingAddress: {
    recipientName: string;
    phone: string;
    streetAddress: string;
    city: string;
    stateOrProvince: string;
    countryCode: string;
    postalCode?: string;
  };
  paymentMethod: string;
  idempotencyKey: string;
}

export interface OrderCheckoutResult {
  orderId: string;
  orderNumber: string;
  status: 'confirmed' | 'payment_failed';
  grandTotalMinor: string;
  currency: string;
  paymentRef?: string;
}

@Injectable()
export class CheckoutService {
  private psp: PaymentProvider;

  constructor(
    private readonly db: DatabaseService,
    private readonly inventory: InventoryService,
    private readonly ledger: LedgerService,
    private readonly outbox: OutboxService
  ) {
    this.psp = new MockCardPaymentProvider();
  }

  /**
   * Executes the Checkout Saga (§8.1) with end-to-end compensations.
   */
  public async confirmCheckout(dto: ConfirmCheckoutSessionDto): Promise<OrderCheckoutResult> {
    // 0. Idempotency Check: if order exists with this key, return it immediately (§2, §6.2)
    const existingOrderRes = await this.db.query(
      `SELECT * FROM orders.orders WHERE idempotency_key = $1`,
      [dto.idempotencyKey]
    );

    if (existingOrderRes.rows.length > 0) {
      const order = existingOrderRes.rows[0];
      return {
        orderId: order.id,
        orderNumber: order.order_number,
        status: order.status,
        grandTotalMinor: order.totals.grandTotalMinor,
        currency: order.currency,
      };
    }

    // Step 1: Validate cart & fetch active offers
    const offerIds = dto.items.map((i) => i.offerId);
    const offersRes = await this.db.query(
      `SELECT o.*, mp.title as product_title
       FROM offers.offers o
       JOIN catalog.variants v ON o.variant_id = v.id
       JOIN catalog.master_products mp ON v.master_product_id = mp.id
       WHERE o.id = ANY($1::uuid[]) AND o.status = 'active'`,
      [offerIds]
    );

    if (offersRes.rows.length !== dto.items.length) {
      throw new BadRequestException('One or more selected offers are no longer available.');
    }

    const offersById = new Map<string, any>();
    offersRes.rows.forEach((o) => offersById.set(o.id, o));

    // Group items by vendor (Parcel-level model, §7.3, ADR 009)
    const itemsByVendor = new Map<string, Array<{ item: CheckoutItemInput; offer: any }>>();
    for (const item of dto.items) {
      const offer = offersById.get(item.offerId);
      const list = itemsByVendor.get(offer.vendor_id) || [];
      list.push({ item, offer });
      itemsByVendor.set(offer.vendor_id, list);
    }

    // Fetch primary warehouse per vendor for inventory reservation
    const vendorIds = Array.from(itemsByVendor.keys());
    const warehousesRes = await this.db.query(
      `SELECT id, vendor_id FROM vendor.warehouses WHERE vendor_id = ANY($1::uuid[])`,
      [vendorIds]
    );
    const warehouseByVendor = new Map<string, string>();
    warehousesRes.rows.forEach((w) => warehouseByVendor.set(w.vendor_id, w.id));

    const orderRef = `MNG-${Date.now().toString().slice(-6)}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;

    // Step 2: Reserve inventory per shipment group (all-or-nothing with compensation)
    const reservations: any[] = [];
    try {
      for (const item of dto.items) {
        const offer = offersById.get(item.offerId);
        const warehouseId = warehouseByVendor.get(offer.vendor_id) || crypto.randomUUID();

        const reservation = await this.inventory.reserveStock({
          orderRef,
          variantId: offer.variant_id,
          warehouseId,
          qty: item.qty,
        });
        reservations.push(reservation);
      }
    } catch (reserveError: any) {
      // Compensate: release any acquired reservations
      for (const res of reservations) {
        await this.inventory.releaseReservation(res.id).catch(() => {});
      }
      throw new ConflictException(`Inventory reservation failed: ${reserveError.message}`);
    }

    // Step 3: Compute totals & snapshots
    let subtotalMinor = 0n;
    let commissionTotalMinor = 0n;
    const currency = offersRes.rows[0].currency;

    for (const item of dto.items) {
      const offer = offersById.get(item.offerId);
      const lineSubtotal = BigInt(offer.price_minor) * BigInt(item.qty);
      subtotalMinor += lineSubtotal;

      // Commission snapshot: standard 500 bps (5%)
      const lineCommission = (lineSubtotal * 500n) / 10000n;
      commissionTotalMinor += lineCommission;
    }

    const shippingTotalMinor = BigInt(itemsByVendor.size) * 150000n; // 1,500 NGN per vendor shipment group
    const taxTotalMinor = (subtotalMinor * 750n) / 10000n; // 7.5% VAT
    const grandTotalMinor = subtotalMinor + shippingTotalMinor + taxTotalMinor;

    const totalsSnapshot = {
      subtotalMinor: subtotalMinor.toString(),
      shippingTotalMinor: shippingTotalMinor.toString(),
      taxTotalMinor: taxTotalMinor.toString(),
      grandTotalMinor: grandTotalMinor.toString(),
    };

    // Step 4: Create Order in DB (status: pending_payment)
    const orderId = crypto.randomUUID();

    await this.db.transaction(async (client) => {
      // Insert Order
      await client.query(
        `INSERT INTO orders.orders (
          id, order_number, buyer_id, status, currency, totals, address_snapshot, tax_snapshot, idempotency_key
         ) VALUES ($1, $2, $3, 'pending_payment', $4, $5, $6, $7, $8)`,
        [
          orderId,
          orderRef,
          dto.buyerId,
          currency,
          JSON.stringify(totalsSnapshot),
          JSON.stringify(dto.shippingAddress),
          JSON.stringify({ vatBps: 750, taxTotalMinor: taxTotalMinor.toString() }),
          dto.idempotencyKey,
        ]
      );

      // Insert Shipment Groups and Order Lines
      for (const [vendorId, vendorLines] of itemsByVendor.entries()) {
        const shipmentGroupId = crypto.randomUUID();
        const acceptDeadline = new Date(Date.now() + 24 * 3600 * 1000);
        const shipDeadline = new Date(Date.now() + 48 * 3600 * 1000);

        await client.query(
          `INSERT INTO orders.shipment_groups (
            id, order_id, vendor_id, fulfillment_mode, status, shipping_method, shipping_fee_minor, sla_deadlines
           ) VALUES ($1, $2, $3, 'vendor_fulfilled', 'pending_vendor_accept', 'Standard Carrier', 150000, $4)`,
          [
            shipmentGroupId,
            orderId,
            vendorId,
            JSON.stringify({ acceptDeadline, shipDeadline }),
          ]
        );

        for (const { item, offer } of vendorLines) {
          const unitPrice = BigInt(offer.price_minor);
          const lineCommission = (unitPrice * BigInt(item.qty) * 500n) / 10000n;

          await client.query(
            `INSERT INTO orders.order_lines (
              order_id, shipment_group_id, offer_id, variant_id, vendor_id, qty,
              unit_price_minor, commission_snapshot, policy_snapshot, title_snapshot
             ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
              orderId,
              shipmentGroupId,
              offer.id,
              offer.variant_id,
              vendorId,
              item.qty,
              unitPrice.toString(),
              JSON.stringify({ rateBps: 500, computedCommissionMinor: lineCommission.toString() }),
              JSON.stringify({ returnWindowDays: 14, returnShippingPayer: 'buyer' }),
              offer.product_title,
            ]
          );
        }
      }
    });

    // Step 5: Charge via PSP (Orchestration)
    const paymentResult = await this.psp.createIntent({
      orderId,
      orderNumber: orderRef,
      amountMinor: grandTotalMinor,
      currency,
      paymentMethod: dto.paymentMethod,
      idempotencyKey: dto.idempotencyKey,
    });

    // Step 6a: If Payment Succeeded -> Confirm order, post ledger capture, emit order.confirmed
    if (paymentResult.status === 'authorized' || paymentResult.status === 'captured') {
      await this.db.query(
        `UPDATE orders.orders SET status = 'confirmed' WHERE id = $1`,
        [orderId]
      );

      // Record payment
      await this.db.query(
        `INSERT INTO payments.payments (order_id, method, psp, psp_ref, status, amount_minor, currency, captured_at)
         VALUES ($1, $2, $3, $4, 'captured', $5, $6, NOW())`,
        [
          orderId,
          dto.paymentMethod,
          paymentResult.psp,
          paymentResult.pspRef,
          grandTotalMinor.toString(),
          currency,
        ]
      );

      // Post Double-Entry Ledger Capture (§7.5): Debit psp_clearing / Credit buyer_funds_held
      await this.ledger.postPaymentCapture({
        orderId,
        grossAmountMinor: grandTotalMinor,
        currency,
        idempotencyKey: `LEDGER-CAP-${dto.idempotencyKey}`,
        pspAccountId: crypto.randomUUID(),
        buyerFundsHeldAccountId: crypto.randomUUID(),
      });

      // Emit order.confirmed
      await this.outbox.stageEvent({
        id: crypto.randomUUID(),
        name: DomainEventNames.ORDER_CONFIRMED,
        aggregateType: 'order',
        aggregateId: orderId,
        correlationId: crypto.randomUUID(),
        timestamp: new Date(),
        payload: {
          orderId,
          orderNumber: orderRef,
          buyerId: dto.buyerId,
          grandTotalMinor: grandTotalMinor.toString(),
        },
      });

      return {
        orderId,
        orderNumber: orderRef,
        status: 'confirmed',
        grandTotalMinor: grandTotalMinor.toString(),
        currency,
        paymentRef: paymentResult.pspRef,
      };
    }

    // Step 6b: If Payment Failed -> Compensate (release reservations, mark payment_failed)
    await this.db.query(
      `UPDATE orders.orders SET status = 'payment_failed' WHERE id = $1`,
      [orderId]
    );

    for (const res of reservations) {
      await this.inventory.releaseReservation(res.id).catch(() => {});
    }

    return {
      orderId,
      orderNumber: orderRef,
      status: 'payment_failed',
      grandTotalMinor: grandTotalMinor.toString(),
      currency,
    };
  }
}
