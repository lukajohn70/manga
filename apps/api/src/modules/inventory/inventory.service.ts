import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';
import { OutboxService } from '../outbox/outbox.service.js';
import { DomainEventNames, StockMovementReason } from '@manga/domain';

export interface StockIntakeDto {
  variantId: string;
  warehouseId: string;
  qty: number;
  safetyStock?: number;
  reason: StockMovementReason;
  refType: string;
  refId: string;
  actor: string;
}

export interface ReserveStockDto {
  orderRef: string;
  variantId: string;
  warehouseId: string;
  qty: number;
  ttlMinutes?: number;
}

@Injectable()
export class InventoryService {
  constructor(
    private readonly db: DatabaseService,
    private readonly outbox: OutboxService
  ) {}

  /**
   * Adjusts on-hand stock and logs an immutable movement record (§7.2).
   */
  public async adjustStock(dto: StockIntakeDto): Promise<any> {
    return await this.db.transaction(async (client) => {
      // 1. Upsert stock level
      const stockRes = await client.query(
        `INSERT INTO inventory.stock_levels (variant_id, warehouse_id, on_hand, safety_stock, updated_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (variant_id, warehouse_id)
         DO UPDATE SET on_hand = inventory.stock_levels.on_hand + EXCLUDED.on_hand,
                       safety_stock = COALESCE(EXCLUDED.safety_stock, inventory.stock_levels.safety_stock),
                       updated_at = NOW()
         RETURNING *`,
        [dto.variantId, dto.warehouseId, dto.qty, dto.safetyStock ?? 0]
      );

      // 2. Append immutable movement record
      await client.query(
        `INSERT INTO inventory.movements (variant_id, warehouse_id, delta, reason, ref_type, ref_id, actor)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          dto.variantId,
          dto.warehouseId,
          dto.qty,
          dto.reason,
          dto.refType,
          dto.refId,
          dto.actor,
        ]
      );

      return stockRes.rows[0];
    });
  }

  /**
   * Performs atomic inventory reservation preventing overselling (§7.2).
   * Uses atomic conditional UPDATE.
   */
  public async reserveStock(dto: ReserveStockDto): Promise<any> {
    return await this.db.transaction(async (client) => {
      // 1. Attempt single-statement atomic reservation
      const updateRes = await client.query(
        `UPDATE inventory.stock_levels
         SET reserved = reserved + $1, updated_at = NOW()
         WHERE variant_id = $2
           AND warehouse_id = $3
           AND (on_hand - reserved - safety_stock) >= $1
         RETURNING *`,
        [dto.qty, dto.variantId, dto.warehouseId]
      );

      if (updateRes.rows.length === 0) {
        throw new ConflictException(
          `Insufficient available stock to reserve ${dto.qty} units of variant ${dto.variantId} at warehouse ${dto.warehouseId}.`
        );
      }

      // 2. Insert reservation record
      const ttl = dto.ttlMinutes ?? 30;
      const expiresAt = new Date(Date.now() + ttl * 60 * 1000);

      const reservationRes = await client.query(
        `INSERT INTO inventory.reservations (order_ref, variant_id, warehouse_id, qty, status, expires_at)
         VALUES ($1, $2, $3, $4, 'pending', $5)
         RETURNING *`,
        [dto.orderRef, dto.variantId, dto.warehouseId, dto.qty, expiresAt]
      );

      const reservation = reservationRes.rows[0];

      // 3. Stage domain event
      await this.outbox.stageEvent({
        id: crypto.randomUUID(),
        name: DomainEventNames.STOCK_RESERVED,
        aggregateType: 'stock',
        aggregateId: dto.variantId,
        correlationId: crypto.randomUUID(),
        timestamp: new Date(),
        payload: {
          reservationId: reservation.id,
          orderRef: dto.orderRef,
          variantId: dto.variantId,
          warehouseId: dto.warehouseId,
          qty: dto.qty,
        },
      });

      return reservation;
    });
  }

  /**
   * Idempotently releases an active reservation back to available stock.
   */
  public async releaseReservation(reservationId: string): Promise<void> {
    await this.db.transaction(async (client) => {
      const resQuery = await client.query(
        `SELECT * FROM inventory.reservations WHERE id = $1 FOR UPDATE`,
        [reservationId]
      );

      if (resQuery.rows.length === 0) {
        throw new NotFoundException(`Reservation ${reservationId} not found`);
      }

      const reservation = resQuery.rows[0];
      if (reservation.status !== 'pending' && reservation.status !== 'active') {
        // Idempotent: already released, confirmed, or expired
        return;
      }

      // Decrement reserved counter
      const variantId = reservation.variant_id ?? reservation.variantId;
      const warehouseId = reservation.warehouse_id ?? reservation.warehouseId;

      await client.query(
        `UPDATE inventory.stock_levels
         SET reserved = GREATEST(0, reserved - $1), updated_at = NOW()
         WHERE variant_id = $2 AND warehouse_id = $3`,
        [reservation.qty, variantId, warehouseId]
      );

      // Mark reservation released
      await client.query(
        `UPDATE inventory.reservations SET status = 'released' WHERE id = $1`,
        [reservationId]
      );

      await this.outbox.stageEvent({
        id: crypto.randomUUID(),
        name: DomainEventNames.STOCK_RELEASED,
        aggregateType: 'stock',
        aggregateId: reservation.variant_id,
        correlationId: crypto.randomUUID(),
        timestamp: new Date(),
        payload: {
          reservationId,
          orderRef: reservation.order_ref,
          qty: reservation.qty,
        },
      });
    });
  }

  /**
   * Sweeps expired reservations and restores available stock.
   */
  public async expireOverdueReservations(): Promise<number> {
    const expiredRes = await this.db.query(
      `SELECT id FROM inventory.reservations
       WHERE status = 'pending' AND expires_at < NOW()`
    );

    let count = 0;
    for (const row of expiredRes.rows) {
      await this.releaseReservation(row.id);
      count++;
    }

    return count;
  }
}
