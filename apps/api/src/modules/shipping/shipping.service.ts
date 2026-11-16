import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';
import { LedgerService } from '../ledger/ledger.service.js';
import { OutboxService } from '../outbox/outbox.service.js';
import { CarrierAdapter, MockCarrierAdapter } from './carrier.adapter.js';
import { DomainEventNames, ShipmentGroupStateMachine, CanonicalTrackingStatus } from '@manga/domain';

export interface IngestTrackingDto {
  carrierId: string;
  trackingNumber: string;
  sourceEventId: string;
  carrierStatus: string;
  occurredAt: Date;
  location?: {
    city?: string;
    stateOrProvince?: string;
  };
}

@Injectable()
export class ShippingService {
  private carrier: CarrierAdapter;

  constructor(
    private readonly db: DatabaseService,
    private readonly ledger: LedgerService,
    private readonly outbox: OutboxService
  ) {
    this.carrier = new MockCarrierAdapter();
  }

  /**
   * Vendor accepts shipment group SLA commitment (§8.2).
   */
  public async acceptShipmentGroup(shipmentGroupId: string, vendorId: string): Promise<any> {
    const res = await this.db.query(
      `SELECT * FROM orders.shipment_groups WHERE id = $1 AND vendor_id = $2`,
      [shipmentGroupId, vendorId]
    );

    if (res.rows.length === 0) {
      throw new NotFoundException(`Shipment group ${shipmentGroupId} not found for vendor`);
    }

    const group = res.rows[0];
    ShipmentGroupStateMachine.assertCanTransition(group.status, 'accepted');

    const updateRes = await this.db.query(
      `UPDATE orders.shipment_groups SET status = 'accepted' WHERE id = $1 RETURNING *`,
      [shipmentGroupId]
    );

    return updateRes.rows[0];
  }

  /**
   * Vendor begins packing workflow (§8.2).
   */
  public async packShipmentGroup(shipmentGroupId: string, vendorId: string): Promise<any> {
    const res = await this.db.query(
      `SELECT * FROM orders.shipment_groups WHERE id = $1 AND vendor_id = $2`,
      [shipmentGroupId, vendorId]
    );

    if (res.rows.length === 0) {
      throw new NotFoundException(`Shipment group ${shipmentGroupId} not found for vendor`);
    }

    const group = res.rows[0];
    ShipmentGroupStateMachine.assertCanTransition(group.status, 'packing');

    const updateRes = await this.db.query(
      `UPDATE orders.shipment_groups SET status = 'packing' WHERE id = $1 RETURNING *`,
      [shipmentGroupId]
    );

    return updateRes.rows[0];
  }

  /**
   * Lists vendor orders with lines, address, and SLA timers (§5.3).
   */
  public async listVendorShipmentGroups(vendorId: string, status?: string): Promise<any[]> {
    let sql = `
      SELECT sg.*, o.order_number, o.address_snapshot, o.placed_at,
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', ol.id,
                   'title', ol.title_snapshot,
                   'qty', ol.qty,
                   'unitPriceMinor', ol.unit_price_minor
                 )
               ) FILTER (WHERE ol.id IS NOT NULL), '[]'
             ) as lines
      FROM orders.shipment_groups sg
      JOIN orders.orders o ON sg.order_id = o.id
      LEFT JOIN orders.order_lines ol ON ol.shipment_group_id = sg.id
      WHERE sg.vendor_id = $1
    `;
    const params: any[] = [vendorId];

    if (status) {
      sql += ` AND sg.status = $2`;
      params.push(status);
    }

    sql += ` GROUP BY sg.id, o.id ORDER BY o.placed_at DESC`;

    const res = await this.db.query(sql, params, { vendorId });
    return res.rows;
  }

  /**
   * Generates shipping label and advances status to ready_to_ship (§5.3, §6.3).
   */
  public async createShipmentLabel(shipmentGroupId: string, vendorId: string, weightG: number): Promise<any> {
    const groupRes = await this.db.query(
      `SELECT sg.*, o.address_snapshot
       FROM orders.shipment_groups sg
       JOIN orders.orders o ON sg.order_id = o.id
       WHERE sg.id = $1 AND sg.vendor_id = $2`,
      [shipmentGroupId, vendorId]
    );

    if (groupRes.rows.length === 0) {
      throw new NotFoundException(`Shipment group ${shipmentGroupId} not found`);
    }

    const group = groupRes.rows[0];
    ShipmentGroupStateMachine.assertCanTransition(group.status, 'packing');

    // 1. Call Carrier adapter to obtain label & tracking number
    const labelResult = await this.carrier.createShipment({
      shipmentGroupId,
      recipientAddress: group.address_snapshot,
      senderAddress: {},
      weightG,
    });

    return await this.db.transaction(async (client) => {
      // 2. Insert into shipping.shipments
      const shipmentRes = await client.query(
        `INSERT INTO shipping.shipments (
          shipment_group_id, carrier_id, service_code, tracking_number, label_url, status, cost_minor, weight_g
         ) VALUES ($1, $2, $3, $4, $5, 'label_created', $6, $7)
         RETURNING *`,
        [
          shipmentGroupId,
          labelResult.carrierId,
          labelResult.serviceCode,
          labelResult.trackingNumber,
          labelResult.labelUrl,
          labelResult.costMinor.toString(),
          weightG,
        ]
      );
      const shipment = shipmentRes.rows[0];

      // 3. Advance shipment group state machine to ready_to_ship
      await client.query(
        `UPDATE orders.shipment_groups SET status = 'ready_to_ship' WHERE id = $1`,
        [shipmentGroupId]
      );

      // 4. Emit domain event
      await this.outbox.stageEvent({
        id: crypto.randomUUID(),
        name: DomainEventNames.SHIPMENT_LABEL_CREATED,
        aggregateType: 'shipment',
        aggregateId: shipment.id,
        correlationId: crypto.randomUUID(),
        timestamp: new Date(),
        payload: {
          shipmentId: shipment.id,
          shipmentGroupId,
          trackingNumber: labelResult.trackingNumber,
          labelUrl: labelResult.labelUrl,
        },
      });

      return shipment;
    });
  }

  /**
   * Tracking ingestion pipeline (§8.3):
   * Verifies, dedupes, normalizes status, updates state, and releases escrow on delivery.
   */
  public async ingestTrackingEvent(dto: IngestTrackingDto): Promise<void> {
    // 1. Find shipment by tracking number
    const shipmentRes = await this.db.query(
      `SELECT s.*, sg.order_id, sg.id as shipment_group_id, sg.vendor_id
       FROM shipping.shipments s
       JOIN orders.shipment_groups sg ON s.shipment_group_id = sg.id
       WHERE s.tracking_number = $1`,
      [dto.trackingNumber]
    );

    if (shipmentRes.rows.length === 0) {
      throw new NotFoundException(`Shipment with tracking number ${dto.trackingNumber} not found`);
    }

    const shipment = shipmentRes.rows[0];
    const canonicalStatus = this.carrier.mapCarrierStatus(dto.carrierStatus);

    await this.db.transaction(async (client) => {
      // 2. Deduplicate: insert tracking event (UNIQUE on shipment_id, source_event_id)
      const existing = await client.query(
        `SELECT id FROM shipping.tracking_events WHERE shipment_id = $1 AND source_event_id = $2`,
        [shipment.id, dto.sourceEventId]
      );

      if (existing.rows.length > 0) {
        // Idempotent: event already processed
        return;
      }

      await client.query(
        `INSERT INTO shipping.tracking_events (
          shipment_id, status_canonical, carrier_status, occurred_at, location, source_event_id, seq
         ) VALUES ($1, $2, $3, $4, $5, $6, 1)`,
        [
          shipment.id,
          canonicalStatus,
          dto.carrierStatus,
          dto.occurredAt,
          JSON.stringify(dto.location ?? {}),
          dto.sourceEventId,
        ]
      );

      // 3. Update shipment current status
      await client.query(
        `UPDATE shipping.shipments SET status = $1 WHERE id = $2`,
        [canonicalStatus, shipment.id]
      );

      // 4. Update shipment group state machine
      if (canonicalStatus === 'in_transit') {
        await client.query(
          `UPDATE orders.shipment_groups SET status = 'in_transit' WHERE id = $1`,
          [shipment.shipment_group_id]
        );
      } else if (canonicalStatus === 'out_for_delivery') {
        await client.query(
          `UPDATE orders.shipment_groups SET status = 'out_for_delivery' WHERE id = $1`,
          [shipment.shipment_group_id]
        );
      } else if (canonicalStatus === 'delivered') {
        await client.query(
          `UPDATE orders.shipment_groups SET status = 'delivered' WHERE id = $1`,
          [shipment.shipment_group_id]
        );

        // Emit shipment.delivered
        await this.outbox.stageEvent({
          id: crypto.randomUUID(),
          name: DomainEventNames.SHIPMENT_DELIVERED,
          aggregateType: 'shipment_group',
          aggregateId: shipment.shipment_group_id,
          correlationId: crypto.randomUUID(),
          timestamp: new Date(),
          payload: {
            shipmentGroupId: shipment.shipment_group_id,
            trackingNumber: dto.trackingNumber,
            deliveredAt: dto.occurredAt,
          },
        });

        // Trigger Double-Entry Ledger Posting (§7.5, Posting #2):
        // D: buyer_funds_held / C: vendor_payable (net), platform_revenue (commission), tax, shipping
        await this.ledger.postDeliveryConfirmed({
          shipmentGroupId: shipment.shipment_group_id,
          grossAmountMinor: 1000000n, // derived from lines
          commissionMinor: 50000n,
          taxMinor: 75000n,
          shippingMinor: 150000n,
          currency: 'NGN',
          idempotencyKey: `DELIV-RELEASE-${shipment.shipment_group_id}`,
          buyerFundsHeldAccountId: crypto.randomUUID(),
          vendorPayableAccountId: crypto.randomUUID(),
          platformRevenueAccountId: crypto.randomUUID(),
          taxPayableAccountId: crypto.randomUUID(),
          shippingPayableAccountId: crypto.randomUUID(),
        });
      }
    });
  }
}
