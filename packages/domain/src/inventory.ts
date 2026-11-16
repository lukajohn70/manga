/**
 * Manga Platform - Inventory Domain Model
 * Oversell prevention, atomic reservations, immutable movement ledger.
 */

export type ReservationStatus = 'pending' | 'confirmed' | 'released' | 'expired';

export type StockMovementReason =
  | 'intake'
  | 'adjustment'
  | 'reservation_held'
  | 'reservation_released'
  | 'shipment_dispatched'
  | 'return_restock'
  | 'damaged_write_off';

export interface StockLevel {
  readonly variantId: string;
  readonly warehouseId: string;
  readonly onHand: number;
  readonly reserved: number;
  readonly safetyStock: number;
  readonly updatedAt: Date;
}

export interface StockReservation {
  readonly id: string;
  readonly orderRef: string;
  readonly variantId: string;
  readonly warehouseId: string;
  readonly qty: number;
  readonly status: ReservationStatus;
  readonly expiresAt: Date;
  readonly createdAt: Date;
}

export interface StockMovement {
  readonly id: string;
  readonly variantId: string;
  readonly warehouseId: string;
  readonly delta: number; // positive for additions, negative for deductions
  readonly reason: StockMovementReason;
  readonly refType: string;
  readonly refId: string;
  readonly actor: string;
  readonly createdAt: Date;
}

export class InventoryCalculator {
  /**
   * Available stock eligible for new orders.
   */
  public static calculateAvailable(stock: StockLevel): number {
    const available = stock.onHand - stock.reserved - stock.safetyStock;
    return Math.max(0, available);
  }

  /**
   * Checks whether the requested quantity can be reserved safely.
   */
  public static canReserve(stock: StockLevel, qty: number): boolean {
    if (qty <= 0) return false;
    return this.calculateAvailable(stock) >= qty;
  }
}
