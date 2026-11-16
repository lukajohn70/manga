import { describe, it, expect } from 'vitest';
import { InventoryCalculator, StockLevel } from '../src/inventory.js';

describe('Inventory Reservation Invariants', () => {
  const sampleStock: StockLevel = {
    variantId: 'var-123',
    warehouseId: 'wh-abc',
    onHand: 100,
    reserved: 20,
    safetyStock: 5,
    updatedAt: new Date(),
  };

  it('correctly calculates available inventory subtracting reserved and safety stock', () => {
    // 100 on_hand - 20 reserved - 5 safety = 75 available
    const available = InventoryCalculator.calculateAvailable(sampleStock);
    expect(available).toBe(75);
  });

  it('permits reservation within available boundary', () => {
    expect(InventoryCalculator.canReserve(sampleStock, 75)).toBe(true);
    expect(InventoryCalculator.canReserve(sampleStock, 10)).toBe(true);
  });

  it('prevents overselling by blocking reservations exceeding available stock', () => {
    expect(InventoryCalculator.canReserve(sampleStock, 76)).toBe(false);
    expect(InventoryCalculator.canReserve(sampleStock, 100)).toBe(false);
    expect(InventoryCalculator.canReserve(sampleStock, 0)).toBe(false);
  });
});
