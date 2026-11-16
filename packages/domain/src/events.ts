/**
 * Manga Platform - Domain Events Taxonomy
 * Published via transactional outbox, consumed idempotently by workers/subscribers.
 */

export interface DomainEvent<TPayload = unknown> {
  readonly id: string; // Event UUID
  readonly name: string;
  readonly aggregateType: string; // e.g. 'order', 'shipment_group', 'stock', 'payment', 'ledger'
  readonly aggregateId: string;
  readonly correlationId: string;
  readonly causationId?: string;
  readonly actorId?: string;
  readonly timestamp: Date;
  readonly payload: TPayload;
}

export const DomainEventNames = {
  // Identity & Vendor
  USER_REGISTERED: 'user.registered',
  VENDOR_APPROVED: 'vendor.approved',
  VENDOR_SUSPENDED: 'vendor.suspended',
  VENDOR_TIER_CHANGED: 'vendor.tier_changed',

  // Catalog & Offers
  PRODUCT_PUBLISHED: 'product.published',
  OFFER_CREATED: 'offer.created',
  OFFER_PRICE_CHANGED: 'offer.price_changed',

  // Inventory
  STOCK_RESERVED: 'stock.reserved',
  STOCK_RELEASED: 'stock.released',
  STOCK_LOW: 'stock.low',

  // Orders & Checkout
  CHECKOUT_STARTED: 'checkout.started',
  ORDER_PLACED: 'order.placed',
  ORDER_CONFIRMED: 'order.confirmed',
  ORDER_CANCELLED: 'order.cancelled',
  SHIPMENT_GROUP_CREATED: 'shipment_group.created',

  // Shipping & Tracking
  SHIPMENT_LABEL_CREATED: 'shipment.label_created',
  SHIPMENT_STATUS_CHANGED: 'shipment.status_changed',
  SHIPMENT_DELIVERED: 'shipment.delivered',
  SHIPMENT_EXCEPTION: 'shipment.exception',

  // Payments & Ledger
  PAYMENT_AUTHORIZED: 'payment.authorized',
  PAYMENT_CAPTURED: 'payment.captured',
  REFUND_COMPLETED: 'refund.completed',
  LEDGER_ENTRY_POSTED: 'ledger.entry_posted',

  // Returns & Disputes
  RETURN_REQUESTED: 'return.requested',
  RETURN_RECEIVED: 'return.received',
  DISPUTE_OPENED: 'dispute.opened',
  DISPUTE_RESOLVED: 'dispute.resolved',

  // Trust & Health
  RISK_FLAGGED: 'risk.flagged',
  VENDOR_HEALTH_UPDATED: 'vendor.health_updated',
} as const;

export type DomainEventName = (typeof DomainEventNames)[keyof typeof DomainEventNames];
