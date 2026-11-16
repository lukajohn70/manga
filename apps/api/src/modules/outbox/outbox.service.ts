import { DomainEvent } from '@manga/domain';

export interface OutboxRecord {
  readonly id: string;
  readonly eventName: string;
  readonly aggregateType: string;
  readonly aggregateId: string;
  readonly payload: unknown;
  readonly status: 'pending' | 'published' | 'failed';
  readonly createdAt: Date;
}

export class OutboxService {
  /**
   * Persists domain events atomically within the primary business transaction.
   */
  public async stageEvent<T>(event: DomainEvent<T>): Promise<OutboxRecord> {
    return {
      id: event.id,
      eventName: event.name,
      aggregateType: event.aggregateType,
      aggregateId: event.aggregateId,
      payload: event.payload,
      status: 'pending',
      createdAt: event.timestamp,
    };
  }
}
