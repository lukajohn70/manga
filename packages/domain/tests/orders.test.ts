import { describe, it, expect } from 'vitest';
import { ShipmentGroupStateMachine } from '../src/orders.js';

describe('Shipment Group State Machine Transitions', () => {
  it('allows forward happy-path fulfillment flow', () => {
    expect(ShipmentGroupStateMachine.canTransition('pending_vendor_accept', 'accepted')).toBe(true);
    expect(ShipmentGroupStateMachine.canTransition('accepted', 'packing')).toBe(true);
    expect(ShipmentGroupStateMachine.canTransition('packing', 'ready_to_ship')).toBe(true);
    expect(ShipmentGroupStateMachine.canTransition('ready_to_ship', 'shipped')).toBe(true);
    expect(ShipmentGroupStateMachine.canTransition('shipped', 'in_transit')).toBe(true);
    expect(ShipmentGroupStateMachine.canTransition('in_transit', 'out_for_delivery')).toBe(true);
    expect(ShipmentGroupStateMachine.canTransition('out_for_delivery', 'delivered')).toBe(true);
  });

  it('allows legal cancellation pre-ship', () => {
    expect(ShipmentGroupStateMachine.canTransition('pending_vendor_accept', 'cancelled_by_vendor')).toBe(true);
    expect(ShipmentGroupStateMachine.canTransition('accepted', 'cancelled_by_buyer')).toBe(true);
  });

  it('rejects illegal status jumps', () => {
    expect(ShipmentGroupStateMachine.canTransition('pending_vendor_accept', 'shipped')).toBe(false);
    expect(ShipmentGroupStateMachine.canTransition('delivered', 'packing')).toBe(false);

    expect(() =>
      ShipmentGroupStateMachine.assertCanTransition('pending_vendor_accept', 'delivered')
    ).toThrow(/Illegal shipment group status transition/);
  });
});
