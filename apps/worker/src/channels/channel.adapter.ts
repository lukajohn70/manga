export type NotificationChannel = 'email' | 'sms' | 'whatsapp' | 'push';

export interface NotificationPayload {
  recipient: string; // email, phone (+E.164), or push subscription token
  subject?: string;
  body: string;
  templateId: string;
  data?: Record<string, any>;
}

export interface NotificationDeliveryResult {
  channel: NotificationChannel;
  success: boolean;
  providerReceiptRef?: string;
  errorMessage?: string;
}

export interface NotificationChannelAdapter {
  readonly channel: NotificationChannel;
  send(payload: NotificationPayload): Promise<NotificationDeliveryResult>;
}

export class EmailChannelAdapter implements NotificationChannelAdapter {
  public readonly channel: NotificationChannel = 'email';

  public async send(payload: NotificationPayload): Promise<NotificationDeliveryResult> {
    if (!payload.recipient.includes('@')) {
      return {
        channel: this.channel,
        success: false,
        errorMessage: `Invalid email address format: ${payload.recipient}`,
      };
    }

    const providerReceiptRef = `EMAIL-MSG-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    return {
      channel: this.channel,
      success: true,
      providerReceiptRef,
    };
  }
}

export class SmsChannelAdapter implements NotificationChannelAdapter {
  public readonly channel: NotificationChannel = 'sms';

  public async send(payload: NotificationPayload): Promise<NotificationDeliveryResult> {
    if (!payload.recipient.startsWith('+')) {
      return {
        channel: this.channel,
        success: false,
        errorMessage: `Invalid SMS phone number format (must be E.164): ${payload.recipient}`,
      };
    }

    const providerReceiptRef = `SMS-MSG-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    return {
      channel: this.channel,
      success: true,
      providerReceiptRef,
    };
  }
}

export class WhatsAppChannelAdapter implements NotificationChannelAdapter {
  public readonly channel: NotificationChannel = 'whatsapp';

  public async send(payload: NotificationPayload): Promise<NotificationDeliveryResult> {
    const providerReceiptRef = `WA-MSG-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    return {
      channel: this.channel,
      success: true,
      providerReceiptRef,
    };
  }
}

export class WebPushChannelAdapter implements NotificationChannelAdapter {
  public readonly channel: NotificationChannel = 'push';

  public async send(payload: NotificationPayload): Promise<NotificationDeliveryResult> {
    // If simulated expired token, fail to trigger fallback channel
    if (payload.recipient === 'EXPIRED_TOKEN') {
      return {
        channel: this.channel,
        success: false,
        errorMessage: 'Push subscription expired or unregistered (410 Gone)',
      };
    }

    const providerReceiptRef = `PUSH-MSG-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    return {
      channel: this.channel,
      success: true,
      providerReceiptRef,
    };
  }
}
