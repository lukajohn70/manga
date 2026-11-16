import { DatabaseService } from '../src/database/database.service.js';

export class MockDatabaseService extends DatabaseService {
  public tables: Record<string, any[]> = {
    'catalog.categories': [],
    'catalog.attribute_definitions': [],
    'catalog.master_products': [],
    'catalog.variants': [],
    'offers.offers': [],
    'offers.buybox_scores': [],
    'vendor.vendors': [],
    'vendor.warehouses': [],
    'inventory.stock_levels': [],
    'inventory.reservations': [],
    'inventory.movements': [],
    'orders.orders': [],
    'orders.shipment_groups': [],
    'orders.order_lines': [],
    'shipping.shipments': [],
    'shipping.tracking_events': [],
    'returns.return_requests': [],
    'returns.return_items': [],
    'payments.payments': [],
    'ledger.transactions': [],
    'ledger.entries': [],
    'outbox.events': [],
    'disputes.cases': [],
    'disputes.evidence': [],
    'admin.audit_logs': [],
    'trust.risk_evaluations': [],
  };

  constructor() {
    super();
  }

  public override async query(sqlText: string, params: any[] = []): Promise<any> {
    const text = sqlText.replace(/\s+/g, ' ').trim();

    // 1. INSERT INTO catalog.categories
    if (text.includes('INSERT INTO catalog.categories')) {
      const row = {
        id: crypto.randomUUID(),
        slug: params[0],
        name: params[1],
        parent_id: params[2],
        icon_url: params[3],
      };
      this.tables['catalog.categories'].push(row);
      return { rows: [row] };
    }

    // 2. INSERT INTO catalog.attribute_definitions
    if (text.includes('INSERT INTO catalog.attribute_definitions')) {
      const row = {
        id: crypto.randomUUID(),
        category_id: params[0],
        key: params[1],
        type: params[2],
        constraints: JSON.parse(params[3] || '{}'),
        facetable: params[4],
        required: params[5],
      };
      this.tables['catalog.attribute_definitions'].push(row);
      return { rows: [row] };
    }

    // 3. SELECT * FROM catalog.attribute_definitions WHERE category_id = $1
    if (text.includes('SELECT * FROM catalog.attribute_definitions WHERE category_id = $1')) {
      const rows = this.tables['catalog.attribute_definitions'].filter(
        (r) => r.category_id === params[0]
      );
      return { rows };
    }

    // 4. INSERT INTO catalog.master_products
    if (text.includes('INSERT INTO catalog.master_products')) {
      const row = {
        id: crypto.randomUUID(),
        title: params[0],
        description: params[1],
        category_id: params[2],
        brand_name: params[3],
        gtin: params[4],
        status: 'pending_moderation',
        attributes: JSON.parse(params[5] || '{}'),
        created_at: new Date(),
      };
      this.tables['catalog.master_products'].push(row);
      return { rows: [row] };
    }

    // 5. UPDATE catalog.master_products SET status = $1 WHERE id = $2
    if (text.includes('UPDATE catalog.master_products SET status = $1 WHERE id = $2')) {
      const prod = this.tables['catalog.master_products'].find((p) => p.id === params[1]);
      if (prod) {
        prod.status = params[0];
        return { rows: [prod] };
      }
      return { rows: [] };
    }

    // 6. INSERT INTO catalog.variants
    if (text.includes('INSERT INTO catalog.variants')) {
      const row = {
        id: crypto.randomUUID(),
        master_product_id: params[0],
        sku_canonical: params[1],
        option_values: JSON.parse(params[2] || '{}'),
        weight_g: params[3],
        dims_mm: JSON.parse(params[4] || '{}'),
        gtin: params[5],
        hs_code: params[6],
      };
      this.tables['catalog.variants'].push(row);
      return { rows: [row] };
    }

    // 7. INSERT INTO offers.offers
    if (text.includes('INSERT INTO offers.offers')) {
      const row = {
        id: crypto.randomUUID(),
        vendor_id: params[0],
        variant_id: params[1],
        condition: params[2],
        price_minor: params[3],
        currency: params[4],
        compare_at_minor: params[5],
        handling_time_hours: params[6],
        shipping_profile_id: params[7],
        policy_template_id: params[8],
        status: 'active',
        version: 1,
      };
      this.tables['offers.offers'].push(row);
      return { rows: [row] };
    }

    // 8. UPDATE offers.offers SET price_minor = $1 ... WHERE id = $3 AND version = $4
    if (text.includes('UPDATE offers.offers')) {
      const offer = this.tables['offers.offers'].find((o) => o.id === params[2]);
      if (offer && offer.version === params[3]) {
        offer.price_minor = params[0];
        offer.compare_at_minor = params[1];
        offer.version += 1;
        return { rows: [offer] };
      }
      return { rows: [] };
    }

    // 9. SELECT o.*, v.tier as vendor_tier ... FROM offers.offers o JOIN vendor.vendors v ...
    if (text.includes('FROM offers.offers o') && text.includes('JOIN vendor.vendors v')) {
      const variantId = params[0];
      const offers = this.tables['offers.offers'].filter(
        (o) => o.variant_id === variantId && o.status === 'active'
      );
      const rows = offers.map((o) => {
        const v = this.tables['vendor.vendors'].find((vnd) => vnd.id === o.vendor_id);
        return {
          ...o,
          vendor_tier: v?.tier ?? 'tier_1',
          vendor_status: v?.status ?? 'active',
        };
      });
      return { rows };
    }

    // 10. INSERT INTO offers.buybox_scores
    if (text.includes('INSERT INTO offers.buybox_scores')) {
      const existing = this.tables['offers.buybox_scores'].find((b) => b.variant_id === params[0]);
      if (existing) {
        existing.winning_offer_id = params[1];
        existing.score = params[2];
      } else {
        this.tables['offers.buybox_scores'].push({
          variant_id: params[0],
          winning_offer_id: params[1],
          score: params[2],
        });
      }
      return { rows: [] };
    }

    // 11. INSERT INTO vendor.vendors
    if (text.includes('INSERT INTO vendor.vendors')) {
      const row = {
        id: crypto.randomUUID(),
        user_id: params[0],
        business_name: params[1],
        legal_entity_type: params[2],
        tier: 'tier_1',
        status: 'pending_verification',
        kyc_status: 'pending',
      };
      this.tables['vendor.vendors'].push(row);
      return { rows: [row] };
    }

    // 12. UPDATE vendor.vendors SET kyc_status = $1, kyc_reference = $2, status = $3 WHERE id = $4
    if (text.includes('UPDATE vendor.vendors') && text.includes('kyc_status')) {
      const v = this.tables['vendor.vendors'].find((vnd) => vnd.id === params[3]);
      if (v) {
        v.kyc_status = params[0];
        v.kyc_reference = params[1];
        v.status = params[2];
        return { rows: [v] };
      }
      return { rows: [] };
    }

    // 13. INSERT INTO vendor.warehouses
    if (text.includes('INSERT INTO vendor.warehouses')) {
      const row = {
        id: crypto.randomUUID(),
        vendor_id: params[0],
        code: params[1],
        name: params[2],
        address: JSON.parse(params[3] || '{}'),
        is_primary: params[4],
      };
      this.tables['vendor.warehouses'].push(row);
      return { rows: [row] };
    }

    // 14. SELECT * FROM vendor.warehouses
    if (text.includes('FROM vendor.warehouses')) {
      if (params[0] && Array.isArray(params[0])) {
        const rows = this.tables['vendor.warehouses'].filter((w) =>
          params[0].includes(w.vendor_id)
        );
        return { rows };
      }
      const rows = this.tables['vendor.warehouses'].filter((w) => w.vendor_id === params[0]);
      return { rows };
    }

    // 15. INSERT INTO inventory.stock_levels (UPSERT)
    if (text.includes('INSERT INTO inventory.stock_levels')) {
      const existing = this.tables['inventory.stock_levels'].find(
        (s) => s.variant_id === params[0] && s.warehouse_id === params[1]
      );
      if (existing) {
        existing.on_hand += params[2];
        existing.safety_stock = params[3] ?? existing.safety_stock;
        return { rows: [existing] };
      }
      const row = {
        variant_id: params[0],
        warehouse_id: params[1],
        on_hand: params[2],
        reserved: 0,
        safety_stock: params[3] ?? 0,
      };
      this.tables['inventory.stock_levels'].push(row);
      return { rows: [row] };
    }

    // 16. INSERT INTO inventory.movements
    if (text.includes('INSERT INTO inventory.movements')) {
      const row = {
        id: crypto.randomUUID(),
        variant_id: params[0],
        warehouse_id: params[1],
        delta: params[2],
        reason: params[3],
        ref_type: params[4],
        ref_id: params[5],
        actor: params[6],
      };
      this.tables['inventory.movements'].push(row);
      return { rows: [row] };
    }

    // 17. UPDATE inventory.stock_levels SET reserved = reserved + $1 ... (ATOMIC CONDITIONAL RESERVATION)
    if (text.includes('UPDATE inventory.stock_levels SET reserved = reserved + $1')) {
      const deltaQty = params[0];
      const variantId = params[1];
      const warehouseId = params[2];

      const stock = this.tables['inventory.stock_levels'].find(
        (s) => s.variant_id === variantId && s.warehouse_id === warehouseId
      );

      if (stock && stock.on_hand - stock.reserved - stock.safety_stock >= deltaQty) {
        stock.reserved += deltaQty;
        return { rows: [stock] };
      }
      return { rows: [] }; // Atomic update matched 0 rows -> Insufficient stock!
    }

    // 18. INSERT INTO inventory.reservations
    if (text.includes('INSERT INTO inventory.reservations')) {
      const row = {
        id: crypto.randomUUID(),
        order_ref: params[0],
        variant_id: params[1],
        warehouse_id: params[2],
        qty: params[3],
        status: 'pending',
        expires_at: params[4],
      };
      this.tables['inventory.reservations'].push(row);
      return { rows: [row] };
    }

    // 19. SELECT * FROM inventory.reservations WHERE id = $1
    if (text.includes('FROM inventory.reservations WHERE id = $1')) {
      const rows = this.tables['inventory.reservations'].filter((r) => r.id === params[0]);
      return { rows };
    }

    // 20. UPDATE inventory.stock_levels SET reserved = GREATEST(0, reserved - $1)
    if (text.includes('reserved = GREATEST(0, reserved - $1)')) {
      const qty = params[0];
      const variantId = params[1];
      const warehouseId = params[2];
      const stock = this.tables['inventory.stock_levels'].find(
        (s) => s.variant_id === variantId && s.warehouse_id === warehouseId
      );
      if (stock) {
        stock.reserved = Math.max(0, stock.reserved - qty);
      }
      return { rows: [] };
    }

    // 21. UPDATE inventory.reservations SET status = 'released'
    if (text.includes("UPDATE inventory.reservations SET status = 'released'")) {
      const res = this.tables['inventory.reservations'].find((r) => r.id === params[0]);
      if (res) res.status = 'released';
      return { rows: [] };
    }

    // 22. SELECT * FROM orders.orders WHERE idempotency_key = $1
    if (text.includes('FROM orders.orders WHERE idempotency_key = $1')) {
      const rows = this.tables['orders.orders'].filter((o) => o.idempotency_key === params[0]);
      return { rows };
    }

    // 23. SELECT o.*, mp.title as product_title FROM offers.offers o JOIN catalog.variants ...
    if (text.includes('FROM offers.offers o') && text.includes('JOIN catalog.variants v')) {
      const offerIds: string[] = params[0];
      const offers = this.tables['offers.offers'].filter((o) => offerIds.includes(o.id));
      const rows = offers.map((o) => {
        const v = this.tables['catalog.variants'].find((vr) => vr.id === o.variant_id);
        const mp = this.tables['catalog.master_products'].find(
          (m) => m.id === v?.master_product_id
        );
        return {
          ...o,
          product_title: mp?.title || 'Product',
        };
      });
      return { rows };
    }

    // 24. INSERT INTO orders.orders
    if (text.includes('INSERT INTO orders.orders')) {
      const row = {
        id: params[0],
        order_number: params[1],
        buyer_id: params[2],
        status: 'pending_payment',
        currency: params[3],
        totals: JSON.parse(params[4]),
        address_snapshot: JSON.parse(params[5]),
        tax_snapshot: JSON.parse(params[6]),
        idempotency_key: params[7],
      };
      this.tables['orders.orders'].push(row);
      return { rows: [row] };
    }

    // 25. INSERT INTO orders.shipment_groups
    if (text.includes('INSERT INTO orders.shipment_groups')) {
      const row = {
        id: params[0],
        order_id: params[1],
        vendor_id: params[2],
        fulfillment_mode: 'vendor_fulfilled',
        status: 'pending_vendor_accept',
        shipping_method: 'Standard Carrier',
        shipping_fee_minor: 150000,
        sla_deadlines: params[3] ? JSON.parse(params[3]) : {},
      };
      this.tables['orders.shipment_groups'].push(row);
      return { rows: [row] };
    }

    // 26. INSERT INTO orders.order_lines
    if (text.includes('INSERT INTO orders.order_lines')) {
      const row = {
        id: crypto.randomUUID(),
        order_id: params[0],
        shipment_group_id: params[1],
        offer_id: params[2],
        variant_id: params[3],
        vendor_id: params[4],
        qty: params[5],
        unit_price_minor: params[6],
        commission_snapshot: JSON.parse(params[7]),
        policy_snapshot: JSON.parse(params[8]),
        title_snapshot: params[9],
      };
      this.tables['orders.order_lines'].push(row);
      return { rows: [row] };
    }

    // 27. UPDATE orders.orders SET status = ...
    if (text.includes('UPDATE orders.orders SET status = $1 WHERE id = $2')) {
      const o = this.tables['orders.orders'].find((ord) => ord.id === params[1]);
      if (o) o.status = params[0];
      return { rows: [] };
    }

    // 28. INSERT INTO payments.payments
    if (text.includes('INSERT INTO payments.payments')) {
      const row = {
        id: crypto.randomUUID(),
        order_id: params[0],
        method: params[1],
        psp: params[2],
        psp_ref: params[3],
        status: 'captured',
        amount_minor: params[4],
        currency: params[5],
      };
      this.tables['payments.payments'].push(row);
      return { rows: [row] };
    }

    // 29. SELECT * FROM orders.shipment_groups WHERE id = $1
    if (text.includes('FROM orders.shipment_groups WHERE id = $1')) {
      const rows = this.tables['orders.shipment_groups'].filter((s) => s.id === params[0]);
      return { rows };
    }

    // 30. SELECT sg.*, o.address_snapshot FROM orders.shipment_groups sg JOIN orders.orders o ...
    if (text.includes('FROM orders.shipment_groups sg JOIN orders.orders o')) {
      const rows = this.tables['orders.shipment_groups']
        .filter((s) => s.id === params[0])
        .map((sg) => {
          const ord = this.tables['orders.orders'].find((o) => o.id === sg.order_id);
          return { ...sg, address_snapshot: ord?.address_snapshot || {} };
        });
      return { rows };
    }

    // 31. INSERT INTO shipping.shipments
    if (text.includes('INSERT INTO shipping.shipments')) {
      const row = {
        id: crypto.randomUUID(),
        shipment_group_id: params[0],
        carrier_id: params[1],
        service_code: params[2],
        tracking_number: params[3],
        label_url: params[4],
        status: 'label_created',
        cost_minor: params[5],
        weight_g: params[6],
      };
      this.tables['shipping.shipments'].push(row);
      return { rows: [row] };
    }

    // 32. UPDATE orders.shipment_groups SET status = ...
    if (text.includes('UPDATE orders.shipment_groups SET status =')) {
      const targetId = params[params.length - 1];
      const sg = this.tables['orders.shipment_groups'].find((s) => s.id === targetId);
      if (sg) {
        if (text.includes("'accepted'")) sg.status = 'accepted';
        else if (text.includes("'ready_to_ship'")) sg.status = 'ready_to_ship';
        else if (text.includes("'in_transit'")) sg.status = 'in_transit';
        else if (text.includes("'out_for_delivery'")) sg.status = 'out_for_delivery';
        else if (text.includes("'delivered'")) sg.status = 'delivered';
        else if (params[0]) sg.status = params[0];
      }
      return { rows: sg ? [sg] : [] };
    }

    // 33. SELECT s.*, sg.order_id ... FROM shipping.shipments s JOIN orders.shipment_groups sg ...
    if (text.includes('FROM shipping.shipments s') && text.includes('WHERE s.tracking_number = $1')) {
      const s = this.tables['shipping.shipments'].find((sh) => sh.tracking_number === params[0]);
      if (!s) return { rows: [] };
      const sg = this.tables['orders.shipment_groups'].find((g) => g.id === s.shipment_group_id);
      return {
        rows: [
          {
            ...s,
            order_id: sg?.order_id,
            shipment_group_id: sg?.id,
            vendor_id: sg?.vendor_id,
          },
        ],
      };
    }

    // 34. SELECT id FROM shipping.tracking_events WHERE shipment_id = $1 AND source_event_id = $2
    if (text.includes('FROM shipping.tracking_events WHERE shipment_id = $1 AND source_event_id = $2')) {
      const rows = this.tables['shipping.tracking_events'].filter(
        (t) => t.shipment_id === params[0] && t.source_event_id === params[1]
      );
      return { rows };
    }

    // 35. INSERT INTO shipping.tracking_events
    if (text.includes('INSERT INTO shipping.tracking_events')) {
      const row = {
        id: crypto.randomUUID(),
        shipment_id: params[0],
        status_canonical: params[1],
        carrier_status: params[2],
        occurred_at: params[3],
        location: JSON.parse(params[4] || '{}'),
        source_event_id: params[5],
        seq: params[6],
      };
      this.tables['shipping.tracking_events'].push(row);
      return { rows: [row] };
    }

    // 36. UPDATE shipping.shipments SET status = $1 WHERE id = $2
    if (text.includes('UPDATE shipping.shipments SET status = $1 WHERE id = $2')) {
      const sh = this.tables['shipping.shipments'].find((s) => s.id === params[1]);
      if (sh) sh.status = params[0];
      return { rows: [] };
    }

    // 37. INSERT INTO returns.return_requests
    if (text.includes('INSERT INTO returns.return_requests')) {
      const row = {
        id: crypto.randomUUID(),
        order_id: params[0],
        shipment_group_id: params[1],
        status: 'requested',
        reason_code: params[2],
        resolution_requested: params[3],
        policy_snapshot: JSON.parse(params[4] || '{}'),
      };
      this.tables['returns.return_requests'].push(row);
      return { rows: [row] };
    }

    // 38. INSERT INTO returns.return_items
    if (text.includes('INSERT INTO returns.return_items')) {
      const row = {
        id: crypto.randomUUID(),
        return_request_id: params[0],
        order_line_id: params[1],
        qty: params[2],
        condition_claimed: params[3],
      };
      this.tables['returns.return_items'].push(row);
      return { rows: [row] };
    }

    // 39. SELECT * FROM returns.return_requests WHERE id = $1
    if (text.includes('FROM returns.return_requests WHERE id = $1')) {
      const rows = this.tables['returns.return_requests'].filter((r) => r.id === params[0]);
      return { rows };
    }

    // 40. UPDATE returns.return_requests SET status = 'refund_issued'
    if (text.includes("UPDATE returns.return_requests SET status = 'refund_issued'")) {
      const r = this.tables['returns.return_requests'].find((rq) => rq.id === params[0]);
      if (r) r.status = 'refund_issued';
      return { rows: [] };
    }

    // 41. SELECT v.id, v.business_name FROM vendor.vendors v WHERE v.status = 'active'
    if (text.includes("FROM vendor.vendors v WHERE v.status = 'active'")) {
      const rows = this.tables['vendor.vendors'].filter((v) => v.status === 'active');
      return { rows };
    }

    // INSERT INTO ledger.transactions
    if (text.includes('INSERT INTO ledger.transactions')) {
      const row = {
        id: params[0],
        ref_type: params[1],
        ref_id: params[2],
        description: params[3],
        idempotency_key: params[4],
        posted_at: params[5],
      };
      this.tables['ledger.transactions'].push(row);
      return { rows: [row] };
    }

    // INSERT INTO ledger.entries
    if (text.includes('INSERT INTO ledger.entries')) {
      const row = {
        id: params[0],
        transaction_id: params[1],
        account_id: params[2],
        direction: params[3],
        amount_minor: params[4],
        currency: params[5],
      };
      this.tables['ledger.entries'].push(row);
      return { rows: [row] };
    }

    // 42. INSERT INTO disputes.cases
    if (text.includes('INSERT INTO disputes.cases')) {
      const row = {
        id: crypto.randomUUID(),
        order_id: params[0],
        shipment_group_id: params[1],
        opened_by: params[2],
        type: params[3],
        status: 'opened',
        deadline_at: params[4],
        outcome: params[5],
        created_at: new Date(),
      };
      this.tables['disputes.cases'].push(row);
      return { rows: [row] };
    }

    // 43. SELECT * FROM disputes.cases WHERE id = $1
    if (text.includes('SELECT * FROM disputes.cases WHERE id = $1')) {
      const rows = this.tables['disputes.cases'].filter((c) => c.id === params[0]);
      return { rows };
    }

    // 44. INSERT INTO disputes.evidence
    if (text.includes('INSERT INTO disputes.evidence')) {
      const row = {
        id: crypto.randomUUID(),
        case_id: params[0],
        party: params[1],
        kind: params[2],
        uri: params[3],
        notes: params[4],
        created_at: new Date(),
      };
      this.tables['disputes.evidence'].push(row);
      return { rows: [row] };
    }

    // 45. SELECT * FROM disputes.evidence WHERE case_id = $1
    if (text.includes('FROM disputes.evidence WHERE case_id = $1')) {
      const rows = this.tables['disputes.evidence'].filter((e) => e.case_id === params[0]);
      return { rows };
    }

    // 46. SELECT dispute detail bundle with joins
    if (text.includes('FROM disputes.cases d') && text.includes('WHERE d.id = $1')) {
      const dispute = this.tables['disputes.cases'].find((c) => c.id === params[0]);
      if (!dispute) return { rows: [] };

      const order = this.tables['orders.orders'].find((o) => o.id === dispute.order_id) || {
        order_number: 'MNG-TEST-001',
        currency: 'NGN',
        totals: { grandTotalMinor: 5000000n },
        address_snapshot: { city: 'Lagos' },
      };
      const sg = this.tables['orders.shipment_groups'].find((s) => s.id === dispute.shipment_group_id) || {
        vendor_id: 'v-100',
      };
      const vendor = this.tables['vendor.vendors'].find((v) => v.id === sg.vendor_id) || {
        business_name: 'Apex Superstore',
      };

      const joined = {
        ...dispute,
        order_number: order.order_number,
        currency: order.currency || 'NGN',
        totals: order.totals,
        address_snapshot: order.address_snapshot,
        vendor_id: sg.vendor_id,
        vendor_name: vendor.business_name,
      };
      return { rows: [joined] };
    }

    // 47. SELECT disputes list with joins
    if (text.includes('FROM disputes.cases d') && !text.includes('WHERE d.id = $1')) {
      const rows = this.tables['disputes.cases'].map((dispute) => {
        const order = this.tables['orders.orders'].find((o) => o.id === dispute.order_id) || {
          order_number: 'MNG-TEST-001',
          currency: 'NGN',
          totals: { grandTotalMinor: 5000000n },
        };
        const sg = this.tables['orders.shipment_groups'].find((s) => s.id === dispute.shipment_group_id) || {
          vendor_id: 'v-100',
        };
        const vendor = this.tables['vendor.vendors'].find((v) => v.id === sg.vendor_id) || {
          business_name: 'Apex Superstore',
        };
        return {
          ...dispute,
          order_number: order.order_number,
          currency: order.currency || 'NGN',
          totals: order.totals,
          vendor_id: sg.vendor_id,
          vendor_name: vendor.business_name,
        };
      });

      if (params.length > 0) {
        return { rows: rows.filter((r) => r.status === params[0]) };
      }
      return { rows };
    }

    // 48. SELECT t.*, s.tracking_number, s.carrier_id FROM shipping.tracking_events t
    if (text.includes('FROM shipping.tracking_events t') && text.includes('WHERE s.shipment_group_id = $1')) {
      const shipment = this.tables['shipping.shipments'].find((s) => s.shipment_group_id === params[0]);
      if (!shipment) return { rows: [] };
      const trackingEvents = this.tables['shipping.tracking_events']
        .filter((t) => t.shipment_id === shipment.id)
        .map((t) => ({
          ...t,
          tracking_number: shipment.tracking_number || 'TRK-TEST',
          carrier_id: shipment.carrier_id || 'gigm',
        }));
      return { rows: trackingEvents };
    }

    // 49. UPDATE disputes.cases SET status = $1, outcome = $2, ledger_tx_id = $3 WHERE id = $4
    if (text.includes('UPDATE disputes.cases SET status = $1, outcome = $2, ledger_tx_id = $3 WHERE id = $4')) {
      const dispute = this.tables['disputes.cases'].find((c) => c.id === params[3]);
      if (dispute) {
        dispute.status = params[0];
        dispute.outcome = params[1];
        dispute.ledger_tx_id = params[2];
        return { rows: [dispute] };
      }
      return { rows: [] };
    }

    // 50. INSERT INTO admin.audit_logs
    if (text.includes('INSERT INTO admin.audit_logs')) {
      const row = {
        id: crypto.randomUUID(),
        actor_id: params[0],
        actor_role: params[1],
        action: params[2],
        target_type: params[3],
        target_id: params[4],
        before_state: JSON.parse(params[5] || '{}'),
        after_state: JSON.parse(params[6] || '{}'),
        reason: params[7],
        created_at: new Date(),
      };
      this.tables['admin.audit_logs'].push(row);
      return { rows: [row] };
    }

    // 51. SELECT * FROM admin.audit_logs
    if (text.includes('FROM admin.audit_logs')) {
      return { rows: [...this.tables['admin.audit_logs']].reverse() };
    }

    // 52. SELECT * FROM outbox.events WHERE id = $1
    if (text.includes('FROM outbox.events WHERE id = $1')) {
      const rows = this.tables['outbox.events'].filter((e) => e.id === params[0]);
      return { rows };
    }

    // 53. UPDATE outbox.events SET status = 'pending' WHERE id = $1
    if (text.includes("UPDATE outbox.events SET status = 'pending' WHERE id = $1")) {
      const ev = this.tables['outbox.events'].find((e) => e.id === params[0]);
      if (ev) ev.status = 'pending';
      return { rows: ev ? [ev] : [] };
    }

    // 54. SELECT * FROM inventory.reservations WHERE id = $1
    if (text.includes('FROM inventory.reservations WHERE id = $1')) {
      const rows = this.tables['inventory.reservations'].filter((r) => r.id === params[0]);
      return { rows };
    }

    // 55. SELECT * FROM ledger.transactions WHERE id = $1
    if (text.includes('FROM ledger.transactions WHERE id = $1')) {
      const rows = this.tables['ledger.transactions'].filter((t) => t.id === params[0]);
      return { rows };
    }

    // 56. SELECT * FROM ledger.entries WHERE transaction_id = $1
    if (text.includes('FROM ledger.entries WHERE transaction_id = $1')) {
      const rows = this.tables['ledger.entries'].filter((e) => e.transaction_id === params[0]);
      return { rows };
    }

    // 57. SELECT transaction_id, direction, amount_minor, currency FROM ledger.entries
    if (text.includes('SELECT transaction_id, direction, amount_minor, currency FROM ledger.entries')) {
      return { rows: this.tables['ledger.entries'] };
    }

    // 58. INSERT INTO trust.risk_evaluations
    if (text.includes('INSERT INTO trust.risk_evaluations')) {
      const row = {
        id: params[0],
        order_id: params[1],
        buyer_id: params[2],
        risk_score: params[3],
        action: params[4],
        matched_rules: JSON.parse(params[5] || '[]'),
        device_fingerprint: params[6],
        ip_address: params[7],
        shadow_mode: params[8],
        created_at: params[9],
      };
      this.tables['trust.risk_evaluations'].push(row);
      return { rows: [row] };
    }

    // 59. SELECT * FROM shipping.shipments WHERE id = $1
    if (text.includes('FROM shipping.shipments WHERE id = $1')) {
      const rows = this.tables['shipping.shipments'].filter((s) => s.id === params[0]);
      return { rows };
    }

    // 60. Business SLO counts
    if (text.includes("SELECT count(*) as count FROM orders.orders WHERE status = 'pending_payment'")) {
      const count = this.tables['orders.orders'].filter((o) => o.status === 'pending_payment').length;
      return { rows: [{ count }] };
    }
    if (text.includes('SELECT count(*) as count FROM shipping.shipments')) {
      const count = this.tables['shipping.shipments'].filter((s) => s.status === 'shipped').length;
      return { rows: [{ count }] };
    }
    if (text.includes("COUNT(CASE WHEN status = 'captured' THEN 1 END)")) {
      const total = this.tables['payments.payments'].length;
      const successful = this.tables['payments.payments'].filter((p) => p.status === 'captured').length;
      return { rows: [{ total, successful }] };
    }

    return { rows: [] };
  }

  public override async transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
    return await callback({
      query: (sql: string, params: any[]) => this.query(sql, params),
    });
  }
}
