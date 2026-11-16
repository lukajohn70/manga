/**
 * Manga Platform - Order Domain Model (Parcel-level multi-vendor model)
 * An Order is a container; each ShipmentGroup is the unit of fulfilment, payout, return, and dispute.
 */

export type OrderStatus =
  | 'pending_payment'
  | 'payment_failed'
  | 'confirmed'
  | 'processing'
  | 'partially_fulfilled'
  | 'fulfilled'
  | 'cancelled';

export type ShipmentGroupStatus =
  | 'pending_vendor_accept'
  | 'accepted'
  | 'packing'
  | 'ready_to_ship'
  | 'shipped'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'delivery_failed'
  | 'returned_to_sender'
  | 'lost'
  | 'cancelled_by_vendor'
  | 'cancelled_by_buyer';

export type FulfillmentMode = 'vendor_fulfilled' | 'cross_dock' | 'marketplace_hub';

export interface AddressSnapshot {
  readonly recipientName: string;
  readonly phone: string;
  readonly streetAddress: string;
  readonly landmark?: string;
  readonly city: string;
  readonly stateOrProvince: string;
  readonly postalCode?: string;
  readonly countryCode: string;
  readonly latitude?: number;
  readonly longitude?: number;
}

export interface CommissionSnapshot {
  readonly ruleId: string;
  readonly rateBps: number;
  readonly fixedMinor: bigint;
  readonly computedCommissionMinor: bigint;
}

export interface PolicySnapshot {
  readonly policyId: string;
  readonly returnWindowDays: number;
  readonly returnShippingPayer: 'buyer' | 'vendor' | 'platform';
}

export interface OrderLine {
  readonly id: string;
  readonly orderId: string;
  readonly shipmentGroupId: string;
  readonly offerId: string;
  readonly variantId: string;
  readonly vendorId: string;
  readonly qty: number;
  readonly unitPriceMinor: bigint;
  readonly discountMinor: bigint;
  readonly taxMinor: bigint;
  readonly commissionSnapshot: CommissionSnapshot;
  readonly policySnapshot: PolicySnapshot;
  readonly titleSnapshot: string;
  readonly imageSnapshot?: string;
}

export interface SlaDeadlines {
  readonly acceptDeadline: Date;
  readonly shipDeadline: Date;
  readonly deliveryEtaMin: Date;
  readonly deliveryEtaMax: Date;
}

export interface ShipmentGroup {
  readonly id: string;
  readonly orderId: string;
  readonly vendorId: string;
  readonly fulfillmentMode: FulfillmentMode;
  readonly status: ShipmentGroupStatus;
  readonly shippingMethod: string;
  readonly shippingFeeMinor: bigint;
  readonly slaDeadlines: SlaDeadlines;
  readonly lines: readonly OrderLine[];
}

export interface OrderTotals {
  readonly subtotalMinor: bigint;
  readonly discountTotalMinor: bigint;
  readonly shippingTotalMinor: bigint;
  readonly taxTotalMinor: bigint;
  readonly grandTotalMinor: bigint;
}

export interface Order {
  readonly id: string;
  readonly orderNumber: string; // e.g. MNG-2611-48K2F
  readonly buyerId: string;
  readonly status: OrderStatus;
  readonly currency: string;
  readonly totals: OrderTotals;
  readonly addressSnapshot: AddressSnapshot;
  readonly placedAt: Date;
  readonly idempotencyKey: string;
  readonly shipmentGroups: readonly ShipmentGroup[];
}

export class ShipmentGroupStateMachine {
  private static readonly transitions: Record<ShipmentGroupStatus, readonly ShipmentGroupStatus[]> = {
    pending_vendor_accept: ['accepted', 'cancelled_by_vendor', 'cancelled_by_buyer'],
    accepted: ['packing', 'cancelled_by_vendor', 'cancelled_by_buyer'],
    packing: ['ready_to_ship', 'cancelled_by_vendor'],
    ready_to_ship: ['shipped', 'cancelled_by_vendor'],
    shipped: ['in_transit', 'delivery_failed', 'lost'],
    in_transit: ['out_for_delivery', 'delivery_failed', 'lost'],
    out_for_delivery: ['delivered', 'delivery_failed'],
    delivered: [], // terminal state for forward flow
    delivery_failed: ['returned_to_sender', 'out_for_delivery'],
    returned_to_sender: [],
    lost: [],
    cancelled_by_vendor: [],
    cancelled_by_buyer: [],
  };

  public static canTransition(current: ShipmentGroupStatus, next: ShipmentGroupStatus): boolean {
    const allowed = this.transitions[current] || [];
    return allowed.includes(next);
  }

  public static assertCanTransition(current: ShipmentGroupStatus, next: ShipmentGroupStatus): void {
    if (!this.canTransition(current, next)) {
      throw new Error(`Illegal shipment group status transition from '${current}' to '${next}'`);
    }
  }
}
