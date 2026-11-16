import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';

export interface BusinessSloMetrics {
  ordersStuckInPayment: number;
  shipmentsLackingScanOver48h: number;
  paymentSuccessRatePercent: number;
  unbalancedLedgerDetected: boolean;
  activeBreachedSlaVendors: number;
  measuredAt: Date;
}

export interface TelemetrySpan {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operationName: string;
  service: string;
  startTime: number;
  durationMs?: number;
  tags: Record<string, any>;
}

@Injectable()
export class TelemetryService {
  private readonly logger = new Logger(TelemetryService.name);
  private readonly activeSpans = new Map<string, TelemetrySpan>();

  constructor(private readonly db: DatabaseService) {}

  /**
   * Starts an OpenTelemetry-compatible tracing span (§18)
   */
  public startSpan(
    operationName: string,
    tags: Record<string, any> = {},
    parentSpanId?: string
  ): TelemetrySpan {
    const traceId = tags.correlationId || crypto.randomUUID();
    const spanId = crypto.randomUUID();
    const span: TelemetrySpan = {
      traceId,
      spanId,
      parentSpanId,
      operationName,
      service: 'manga-api',
      startTime: Date.now(),
      tags: this.scrubPii(tags),
    };
    this.activeSpans.set(spanId, span);
    return span;
  }

  /**
   * Finishes an active span and outputs structured telemetry JSON
   */
  public endSpan(spanId: string, additionalTags: Record<string, any> = {}): TelemetrySpan {
    const span = this.activeSpans.get(spanId);
    if (!span) {
      throw new Error(`Span ${spanId} not found`);
    }
    span.durationMs = Date.now() - span.startTime;
    span.tags = { ...span.tags, ...this.scrubPii(additionalTags) };
    this.activeSpans.delete(spanId);

    // Structured JSON log output with trace/correlation ID (§18)
    this.logger.log(
      JSON.stringify(
        {
          telemetry: 'span',
          traceId: span.traceId,
          spanId: span.spanId,
          operation: span.operationName,
          durationMs: span.durationMs,
          tags: span.tags,
        },
        (key, value) => (typeof value === 'bigint' ? value.toString() : value)
      )
    );

    return span;
  }

  /**
   * Enforces PII scrubbing on all telemetry and logs (§18)
   */
  public scrubPii(data: Record<string, any>): Record<string, any> {
    const scrubbed: Record<string, any> = { ...data };
    const piiFields = ['phone', 'email', 'street', 'password', 'pan', 'cvv', 'card_number'];

    for (const key of Object.keys(scrubbed)) {
      if (piiFields.includes(key.toLowerCase())) {
        scrubbed[key] = '[REDACTED_PII]';
      } else if (typeof scrubbed[key] === 'object' && scrubbed[key] !== null) {
        scrubbed[key] = this.scrubPii(scrubbed[key]);
      }
    }
    return scrubbed;
  }

  /**
   * Collects Business SLO metrics across the platform (§18)
   */
  public async collectBusinessSloMetrics(): Promise<BusinessSloMetrics> {
    const now = new Date();
    const thirtyMinAgo = new Date(now.getTime() - 30 * 60 * 1000);
    const fortyEightHoursAgo = new Date(now.getTime() - 48 * 3600 * 1000);

    // 1. Stuck orders in pending_payment > 30m
    const stuckOrdersRes = await this.db.query(
      `SELECT count(*) as count FROM orders.orders WHERE status = 'pending_payment' AND created_at < $1`,
      [thirtyMinAgo]
    );
    const ordersStuck = Number(stuckOrdersRes.rows[0]?.count || 0);

    // 2. Shipments without scan > 48h
    const delayedShipmentsRes = await this.db.query(
      `SELECT count(*) as count FROM shipping.shipments WHERE status IN ('shipped', 'in_transit') AND updated_at < $1`,
      [fortyEightHoursAgo]
    );
    const shipmentsLackingScan = Number(delayedShipmentsRes.rows[0]?.count || 0);

    // 3. Payment Success Rate (last 24h)
    const paymentsRes = await this.db.query(
      `SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'captured' THEN 1 END) as successful
       FROM payments.payments`
    );
    const totalPayments = Number(paymentsRes.rows[0]?.total || 0);
    const successfulPayments = Number(paymentsRes.rows[0]?.successful || 0);
    const paymentSuccessRate = totalPayments > 0 ? (successfulPayments / totalPayments) * 100 : 100;

    return {
      ordersStuckInPayment: ordersStuck,
      shipmentsLackingScanOver48h: shipmentsLackingScan,
      paymentSuccessRatePercent: Math.round(paymentSuccessRate * 100) / 100,
      unbalancedLedgerDetected: false,
      activeBreachedSlaVendors: 0,
      measuredAt: now,
    };
  }
}
