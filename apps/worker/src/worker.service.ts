import { DomainEvent } from '@manga/domain';
import { NotificationService } from './notifications/notification.service.js';

export interface OutboxEventRow {
  id: string;
  name: string;
  aggregate_type: string;
  aggregate_id: string;
  correlation_id: string;
  payload: any;
  status: 'pending' | 'published' | 'failed';
  created_at: Date;
}

export class OutboxProcessorWorker {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * Processes a single outbox event row, triggers notification fan-out, and updates status.
   */
  public async processEventRow(row: OutboxEventRow): Promise<'published' | 'failed'> {
    try {
      const domainEvent: DomainEvent<any> = {
        id: row.id,
        name: row.name,
        aggregateType: row.aggregate_type,
        aggregateId: row.aggregate_id,
        correlationId: row.correlation_id,
        timestamp: row.created_at,
        payload: row.payload,
      };

      // Trigger multi-channel notification fan-out
      await this.notificationService.handleDomainEvent(domainEvent);

      row.status = 'published';
      return 'published';
    } catch (err: any) {
      console.error(`[Worker] Failed to process outbox event ${row.id}:`, err);
      row.status = 'failed';
      return 'failed';
    }
  }

  /**
   * Batch processor for outbox events.
   */
  public async processBatch(rows: OutboxEventRow[]): Promise<{
    processed: number;
    published: number;
    failed: number;
  }> {
    let published = 0;
    let failed = 0;

    for (const row of rows) {
      const outcome = await this.processEventRow(row);
      if (outcome === 'published') published++;
      else failed++;
    }

    return {
      processed: rows.length,
      published,
      failed,
    };
  }
}
