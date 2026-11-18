import { Controller, Post, Get, Body, Param, NotFoundException } from '@nestjs/common';
import { CheckoutService } from './checkout.service.js';
import type { ConfirmCheckoutSessionDto } from './checkout.service.js';
import { DatabaseService } from '../../database/database.service.js';

@Controller('v1')
export class CheckoutController {
  constructor(
    private readonly checkoutService: CheckoutService,
    private readonly db: DatabaseService
  ) {}

  @Post('checkout')
  public async confirmCheckout(@Body() dto: Record<string, any>) {
    return await this.checkoutService.confirmCheckout(dto as ConfirmCheckoutSessionDto);
  }

  @Get('orders/:ref')
  public async getOrder(@Param('ref') ref: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ref);
    const orderRes = await this.db.query(
      isUuid
        ? `SELECT * FROM orders.orders WHERE id = $1`
        : `SELECT * FROM orders.orders WHERE order_number = $1`,
      [ref]
    );

    if (orderRes.rows.length === 0) {
      throw new NotFoundException(`Order ${ref} not found`);
    }

    const order = orderRes.rows[0];

    // Fetch lines
    const linesRes = await this.db.query(
      `SELECT ol.*, v.business_name as vendor_name 
       FROM orders.order_lines ol
       JOIN vendor.vendors v ON ol.vendor_id = v.id
       WHERE ol.order_id = $1`,
      [order.id]
    );

    // Fetch shipment groups
    const groupsRes = await this.db.query(
      `SELECT sg.*, s.tracking_number, s.carrier_id, s.status as carrier_status
       FROM orders.shipment_groups sg
       LEFT JOIN shipping.shipments s ON s.shipment_group_id = sg.id
       WHERE sg.order_id = $1`,
      [order.id]
    );

    return {
      order,
      lines: linesRes.rows,
      shipmentGroups: groupsRes.rows,
    };
  }

  @Get('tracking/:ref')
  public async getTracking(@Param('ref') ref: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ref);
    
    // Check by order_number or order id first
    const orderRes = await this.db.query(
      isUuid
        ? `SELECT * FROM orders.orders WHERE id = $1`
        : `SELECT * FROM orders.orders WHERE order_number = $1`,
      [ref]
    );

    if (orderRes.rows.length > 0) {
      const order = orderRes.rows[0];
      const groupsRes = await this.db.query(
        `SELECT sg.*, s.tracking_number, s.carrier_id, s.status as carrier_status, v.business_name as vendor_name
         FROM orders.shipment_groups sg
         JOIN vendor.vendors v ON sg.vendor_id = v.id
         LEFT JOIN shipping.shipments s ON s.shipment_group_id = sg.id
         WHERE sg.order_id = $1`,
        [order.id]
      );

      return {
        orderNumber: order.order_number,
        status: order.status,
        placedAt: order.placed_at,
        currency: order.currency,
        totals: order.totals,
        shippingAddress: order.address_snapshot,
        parcels: groupsRes.rows.map((sg) => ({
          shipmentGroupId: sg.id,
          vendorName: sg.vendor_name,
          fulfillmentMode: sg.fulfillment_mode,
          status: sg.carrier_status || sg.status,
          trackingNumber: sg.tracking_number || `TRK-${sg.id.slice(0, 8).toUpperCase()}`,
          carrier: sg.carrier_id || 'Manga Express Fleet',
          estimatedDelivery: 'Tomorrow by 5:00 PM',
        })),
      };
    }

    // Otherwise check shipments table directly by tracking number
    const shipRes = await this.db.query(
      `SELECT s.*, sg.order_id, o.order_number, o.status as order_status
       FROM shipping.shipments s
       JOIN orders.shipment_groups sg ON s.shipment_group_id = sg.id
       JOIN orders.orders o ON sg.order_id = o.id
       WHERE s.tracking_number = $1`,
      [ref]
    );

    if (shipRes.rows.length === 0) {
      // Mock tracking info for preview / user testing
      return {
        orderNumber: ref,
        status: 'in_transit',
        placedAt: new Date(Date.now() - 3600 * 24 * 1000).toISOString(),
        currency: 'NGN',
        parcels: [
          {
            shipmentGroupId: 'sg-demo-01',
            vendorName: 'Official Manga Fulfillment Hub',
            fulfillmentMode: 'vendor_fulfilled',
            status: 'in_transit',
            trackingNumber: ref,
            carrier: 'Manga Express Fleet',
            estimatedDelivery: 'Tomorrow by 5:00 PM',
          },
        ],
      };
    }

    const ship = shipRes.rows[0];
    return {
      orderNumber: ship.order_number,
      status: ship.order_status,
      currency: 'NGN',
      parcels: [
        {
          shipmentGroupId: ship.shipment_group_id,
          vendorName: 'Manga Verified Partner',
          fulfillmentMode: 'vendor_fulfilled',
          status: ship.status,
          trackingNumber: ship.tracking_number,
          carrier: ship.carrier_id,
          estimatedDelivery: 'Tomorrow by 5:00 PM',
        },
      ],
    };
  }
}
