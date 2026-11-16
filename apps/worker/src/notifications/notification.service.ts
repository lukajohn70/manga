import { DomainEvent, DomainEventNames } from '@manga/domain';
import { I18nFormatter } from '@manga/i18n';
import {
  NotificationChannel,
  NotificationChannelAdapter,
  NotificationDeliveryResult,
  EmailChannelAdapter,
  SmsChannelAdapter,
  WhatsAppChannelAdapter,
  WebPushChannelAdapter,
} from '../channels/channel.adapter.js';

export interface DeviceRecord {
  userId: string;
  deviceId: string;
  platform: 'web' | 'ios' | 'android';
  pushToken: string;
  locale: string;
}

export interface UserPreferenceRecord {
  userId: string;
  channel: NotificationChannel;
  category: 'order_updates' | 'promotions' | 'security_alerts';
  enabled: boolean;
}

export interface DispatchedMessageRecord {
  id: string;
  eventId: string;
  recipient: string;
  channel: NotificationChannel;
  templateId: string;
  status: 'delivered' | 'failed' | 'fallback_redirected';
  providerReceiptRef?: string;
  errorMessage?: string;
  sentAt: Date;
}

export class NotificationService {
  private adapters: Map<NotificationChannel, NotificationChannelAdapter> = new Map();
  private formatter: I18nFormatter;

  // In-memory tables for standalone/worker test execution and fast lookups
  public deviceRegistry: Map<string, DeviceRecord[]> = new Map(); // userId -> DeviceRecord[]
  public userPreferences: Map<string, boolean> = new Map(); // "userId:channel:category" -> enabled
  public dispatchedLog: DispatchedMessageRecord[] = [];

  constructor() {
    this.formatter = new I18nFormatter('en-NG');
    this.registerAdapter(new EmailChannelAdapter());
    this.registerAdapter(new SmsChannelAdapter());
    this.registerAdapter(new WhatsAppChannelAdapter());
    this.registerAdapter(new WebPushChannelAdapter());
  }

  public registerAdapter(adapter: NotificationChannelAdapter): void {
    this.adapters.set(adapter.channel, adapter);
  }

  public registerDevice(device: DeviceRecord): void {
    const list = this.deviceRegistry.get(device.userId) || [];
    const filtered = list.filter((d) => d.deviceId !== device.deviceId);
    filtered.push(device);
    this.deviceRegistry.set(device.userId, filtered);
  }

  public setPreference(pref: UserPreferenceRecord): void {
    const key = `${pref.userId}:${pref.channel}:${pref.category}`;
    this.userPreferences.set(key, pref.enabled);
  }

  public isChannelEnabled(
    userId: string,
    channel: NotificationChannel,
    category: 'order_updates' | 'promotions' | 'security_alerts'
  ): boolean {
    const key = `${userId}:${channel}:${category}`;
    if (this.userPreferences.has(key)) {
      return this.userPreferences.get(key)!;
    }
    // Default enabled for order updates and security alerts
    return category !== 'promotions';
  }

  /**
   * Fan-out router: maps domain event to targeted recipients, templates & channels (§11).
   */
  public async handleDomainEvent(event: DomainEvent<any>): Promise<DispatchedMessageRecord[]> {
    const results: DispatchedMessageRecord[] = [];

    switch (event.name) {
      case DomainEventNames.ORDER_CONFIRMED: {
        const { orderNumber, buyerId, grandTotalMinor } = event.payload;
        const buyerEmail = event.payload.buyerEmail || 'buyer@example.com';
        const buyerPhone = event.payload.buyerPhone || '+2348012345678';
        const formattedTotal = this.formatter.formatMoney(BigInt(grandTotalMinor || 0), 'NGN');

        // 1. Email Channel
        if (this.isChannelEnabled(buyerId, 'email', 'order_updates')) {
          const res = await this.dispatchWithIdempotency({
            eventId: event.id,
            recipient: buyerEmail,
            channel: 'email',
            templateId: 'order_confirmed_email_v1',
            subject: `Your Manga Order #${orderNumber} is Confirmed!`,
            body: `Thank you for your order! Total amount: ${formattedTotal}. We are preparing your shipment.`,
          });
          if (res) results.push(res);
        }

        // 2. WhatsApp Channel
        if (this.isChannelEnabled(buyerId, 'whatsapp', 'order_updates')) {
          const res = await this.dispatchWithIdempotency({
            eventId: event.id,
            recipient: buyerPhone,
            channel: 'whatsapp',
            templateId: 'order_confirmed_whatsapp_v1',
            body: `Manga: Order #${orderNumber} confirmed (${formattedTotal}). Track your parcel anytime in your Manga account!`,
          });
          if (res) results.push(res);
        }

        break;
      }

      case DomainEventNames.SHIPMENT_DELIVERED: {
        const { trackingNumber, shipmentGroupId } = event.payload;
        const buyerId = event.payload.buyerId || 'buyer-123';
        const buyerPhone = event.payload.buyerPhone || '+2348012345678';
        const devices = this.deviceRegistry.get(buyerId) || [];

        // Primary Channel: Web/Mobile Push Notification
        let pushSucceeded = false;
        if (devices.length > 0 && this.isChannelEnabled(buyerId, 'push', 'order_updates')) {
          for (const device of devices) {
            const pushRes = await this.dispatchWithIdempotency({
              eventId: event.id,
              recipient: device.pushToken,
              channel: 'push',
              templateId: 'parcel_delivered_push_v1',
              subject: 'Parcel Delivered!',
              body: `Your parcel with tracking number ${trackingNumber} has arrived!`,
            });
            if (pushRes) {
              results.push(pushRes);
              if (pushRes.status === 'delivered') {
                pushSucceeded = true;
              }
            }
          }
        }

        // Fallback Channel (§11): Push -> SMS for delivery exceptions or when push fails/unregistered
        if (!pushSucceeded && this.isChannelEnabled(buyerId, 'sms', 'order_updates')) {
          const smsRes = await this.dispatchWithIdempotency({
            eventId: event.id,
            recipient: buyerPhone,
            channel: 'sms',
            templateId: 'parcel_delivered_sms_fallback_v1',
            body: `Manga Delivery Notice: Your parcel (${trackingNumber}) has been delivered successfully!`,
          });
          if (smsRes) results.push(smsRes);
        }

        break;
      }

      default:
        // No notifications configured for this event type
        break;
    }

    return results;
  }

  /**
   * Enforces strict delivery idempotency per (event_id, recipient, channel) (§11).
   */
  private async dispatchWithIdempotency(params: {
    eventId: string;
    recipient: string;
    channel: NotificationChannel;
    templateId: string;
    subject?: string;
    body: string;
  }): Promise<DispatchedMessageRecord | null> {
    // Check uniqueness constraint
    const existing = this.dispatchedLog.find(
      (m) =>
        m.eventId === params.eventId &&
        m.recipient === params.recipient &&
        m.channel === params.channel
    );

    if (existing) {
      // Idempotent: already sent
      return null;
    }

    const adapter = this.adapters.get(params.channel);
    if (!adapter) {
      throw new Error(`Unsupported notification channel: ${params.channel}`);
    }

    const deliveryResult: NotificationDeliveryResult = await adapter.send({
      recipient: params.recipient,
      subject: params.subject,
      body: params.body,
      templateId: params.templateId,
    });

    const record: DispatchedMessageRecord = {
      id: crypto.randomUUID(),
      eventId: params.eventId,
      recipient: params.recipient,
      channel: params.channel,
      templateId: params.templateId,
      status: deliveryResult.success ? 'delivered' : 'failed',
      providerReceiptRef: deliveryResult.providerReceiptRef,
      errorMessage: deliveryResult.errorMessage,
      sentAt: new Date(),
    };

    this.dispatchedLog.push(record);
    return record;
  }
}
