import { describe, it, expect } from 'vitest';
import { ShipmentGroupStateMachine } from '@manga/domain';

describe('Milestone 3.8: Vendor Pack & Scan Workflow State Integrity', () => {
  it('enforces that vendor orders must be accepted before packing can commence', () => {
    // Cannot start packing directly from pending_vendor_accept
    expect(ShipmentGroupStateMachine.canTransition('pending_vendor_accept', 'packing')).toBe(false);

    // After vendor acceptance, transition to packing is allowed
    expect(ShipmentGroupStateMachine.canTransition('pending_vendor_accept', 'accepted')).toBe(true);
    expect(ShipmentGroupStateMachine.canTransition('accepted', 'packing')).toBe(true);
  });

  it('enforces that a barcode scan advances package to ready_to_ship with generated label', () => {
    expect(ShipmentGroupStateMachine.canTransition('packing', 'ready_to_ship')).toBe(true);
  });

  it('prevents premature shipment dispatch before label is created', () => {
    expect(ShipmentGroupStateMachine.canTransition('packing', 'shipped')).toBe(false);
    expect(ShipmentGroupStateMachine.canTransition('ready_to_ship', 'shipped')).toBe(true);
  });
});
