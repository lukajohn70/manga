import { describe, it, expect, beforeEach } from 'vitest';
import { NotificationService } from '../src/notifications/notification.service.js';
import { OutboxProcessorWorker, OutboxEventRow } from '../src/worker.service.js';
import { DomainEventNames } from '@manga/domain';

describe('Milestone 2.8: Notifications Fan-Out & Outbox Worker', () => {
  let notificationService: NotificationService;
  let worker: OutboxProcessorWorker;

  beforeEach(() => {
    notificationService = new NotificationService();
    worker = new OutboxProcessorWorker(notificationService);
  });

  it('fans out order.confirmed event to Email and WhatsApp channels with formatted currency', async () => {
    const eventRow: OutboxEventRow = {
      id: crypto.randomUUID(),
      name: DomainEventNames.ORDER_CONFIRMED,
      aggregate_type: 'order',
      aggregate_id: 'ord-123',
      correlation_id: crypto.randomUUID(),
      status: 'pending',
      created_at: new Date(),
      payload: {
        orderId: 'ord-123',
        orderNumber: 'MNG-2611-99XYZ',
        buyerId: 'usr-buyer-1',
        buyerEmail: 'alice@manga.ng',
        buyerPhone: '+2348011223344',
        grandTotalMinor: '5137500', // 51,375.00 NGN
      },
    };

    const status = await worker.processEventRow(eventRow);
    expect(status).toBe('published');
    expect(eventRow.status).toBe('published');

    // Verify dispatched messages
    const logs = notificationService.dispatchedLog;
    expect(logs.length).toBe(2);

    const emailMsg = logs.find((m) => m.channel === 'email');
    expect(emailMsg).toBeDefined();
    expect(emailMsg?.recipient).toBe('alice@manga.ng');
    expect(emailMsg?.status).toBe('delivered');

    const waMsg = logs.find((m) => m.channel === 'whatsapp');
    expect(waMsg).toBeDefined();
    expect(waMsg?.recipient).toBe('+2348011223344');
    expect(waMsg?.status).toBe('delivered');
  });

  it('guarantees strict delivery idempotency: duplicate event consumption is ignored', async () => {
    const eventRow: OutboxEventRow = {
      id: 'event-duplicate-test',
      name: DomainEventNames.ORDER_CONFIRMED,
      aggregate_type: 'order',
      aggregate_id: 'ord-dup',
      correlation_id: crypto.randomUUID(),
      status: 'pending',
      created_at: new Date(),
      payload: {
        orderNumber: 'MNG-DUP-001',
        buyerId: 'usr-1',
        buyerEmail: 'bob@example.com',
        buyerPhone: '+2348099887766',
        grandTotalMinor: '1000000',
      },
    };

    // First processing run
    await worker.processEventRow(eventRow);
    expect(notificationService.dispatchedLog.length).toBe(2);

    // Second processing run (simulating redelivery / replay)
    await worker.processEventRow(eventRow);
    // Dispatched messages count must NOT double!
    expect(notificationService.dispatchedLog.length).toBe(2);
  });

  it('falls back from push to SMS when push token is invalid or expired (§11)', async () => {
    const buyerId = 'usr-fallback-test';

    // Register expired push token
    notificationService.registerDevice({
      userId: buyerId,
      deviceId: 'device-iphone-1',
      platform: 'ios',
      pushToken: 'EXPIRED_TOKEN',
      locale: 'en-NG',
    });

    const eventRow: OutboxEventRow = {
      id: crypto.randomUUID(),
      name: DomainEventNames.SHIPMENT_DELIVERED,
      aggregate_type: 'shipment_group',
      aggregate_id: 'sg-456',
      correlation_id: crypto.randomUUID(),
      status: 'pending',
      created_at: new Date(),
      payload: {
        buyerId,
        buyerPhone: '+2348033445566',
        trackingNumber: 'TRK-987654',
      },
    };

    await worker.processEventRow(eventRow);

    const logs = notificationService.dispatchedLog;
    // Push was attempted and failed
    const failedPush = logs.find((m) => m.channel === 'push');
    expect(failedPush?.status).toBe('failed');

    // SMS fallback was triggered and succeeded
    const fallbackSms = logs.find((m) => m.channel === 'sms');
    expect(fallbackSms?.status).toBe('delivered');
    expect(fallbackSms?.recipient).toBe('+2348033445566');
  });

  it('honors user preferences and does not dispatch to opted-out channels', async () => {
    const buyerId = 'usr-optout-test';

    // User opts out of WhatsApp for order updates
    notificationService.setPreference({
      userId: buyerId,
      channel: 'whatsapp',
      category: 'order_updates',
      enabled: false,
    });

    const eventRow: OutboxEventRow = {
      id: crypto.randomUUID(),
      name: DomainEventNames.ORDER_CONFIRMED,
      aggregate_type: 'order',
      aggregate_id: 'ord-optout',
      correlation_id: crypto.randomUUID(),
      status: 'pending',
      created_at: new Date(),
      payload: {
        orderNumber: 'MNG-OPTOUT-1',
        buyerId,
        buyerEmail: 'optout@example.com',
        buyerPhone: '+2348011223344',
        grandTotalMinor: '500000',
      },
    };

    await worker.processEventRow(eventRow);

    const logs = notificationService.dispatchedLog;
    // Email sent
    expect(logs.some((m) => m.channel === 'email')).toBe(true);
    // WhatsApp must NOT be sent
    expect(logs.some((m) => m.channel === 'whatsapp')).toBe(false);
  });
});
