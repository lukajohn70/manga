import {
  InventoryCalculator,
  StockLevel,
  StockReservation,
  StockMovement,
} from '@manga/domain';

export interface ReserveStockCommand {
  readonly orderRef: string;
  readonly variantId: string;
  readonly warehouseId: string;
  readonly qty: number;
  readonly ttlMinutes?: number;
}

export class InventoryService {
  /**
   * Performs atomic stock reservation.
   * In DB: UPDATE stock_levels SET reserved = reserved + :qty
   *        WHERE variant_id = :v AND warehouse_id = :w AND (on_hand - reserved - safety_stock) >= :qty
   */
  public async reserveStock(
    currentStock: StockLevel,
    cmd: ReserveStockCommand
  ): Promise<StockReservation> {
    if (!InventoryCalculator.canReserve(currentStock, cmd.qty)) {
      throw new Error(
        `Insufficient stock for variant ${cmd.variantId} at warehouse ${cmd.warehouseId}. Requested: ${cmd.qty}`
      );
    }

    const ttl = cmd.ttlMinutes ?? 30;
    const expiresAt = new Date(Date.now() + ttl * 60 * 1000);

    const reservation: StockReservation = {
      id: crypto.randomUUID(),
      orderRef: cmd.orderRef,
      variantId: cmd.variantId,
      warehouseId: cmd.warehouseId,
      qty: cmd.qty,
      status: 'pending',
      expiresAt,
      createdAt: new Date(),
    };

    return reservation;
  }
}
