import * as crypto from 'crypto';
import {
  PaymentProvider,
  CreatePaymentIntentParams,
  PaymentIntentResult,
  PaymentCaptureResult,
  PaymentRefundParams,
  PaymentRefundResult,
} from './payment.provider.js';

export class PaystackPaymentProvider implements PaymentProvider {
  public readonly name = 'paystack';
  private readonly secretKey: string;
  private readonly baseUrl = 'https://api.paystack.co';

  constructor(secretKey?: string) {
    this.secretKey = secretKey || process.env.PAYSTACK_SECRET_KEY || '';
  }

  public get isLiveConfigured(): boolean {
    return Boolean(this.secretKey && this.secretKey.startsWith('sk_'));
  }

  /**
   * Initializes a transaction with Paystack or simulates in test mode.
   */
  public async createIntent(params: CreatePaymentIntentParams): Promise<PaymentIntentResult> {
    const reference = `MNG-${params.orderNumber}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;

    // Test rejection simulation
    if (params.paymentMethod === 'card_fail') {
      return {
        psp: this.name,
        pspRef: reference,
        status: 'failed',
      };
    }

    if (!this.isLiveConfigured) {
      // Offline / Local Development Fallback
      return {
        psp: this.name,
        pspRef: reference,
        clientSecret: `pstk_test_${crypto.randomUUID()}`,
        redirectUrl: `https://checkout.paystack.com/simulate/${reference}`,
        status: 'authorized',
      };
    }

    try {
      const customerEmail =
        params.metadata?.email || `customer-${params.orderNumber.toLowerCase()}@manga.ng`;

      const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: customerEmail,
          amount: params.amountMinor.toString(), // Paystack expects minor units (kobo)
          currency: params.currency || 'NGN',
          reference,
          metadata: {
            orderId: params.orderId,
            orderNumber: params.orderNumber,
            idempotencyKey: params.idempotencyKey,
            ...params.metadata,
          },
        }),
      });

      const body: any = await response.json();

      if (!response.ok || !body.status) {
        console.error('[PaystackPaymentProvider] Initialize error:', body);
        return {
          psp: this.name,
          pspRef: reference,
          status: 'failed',
        };
      }

      return {
        psp: this.name,
        pspRef: body.data.reference || reference,
        redirectUrl: body.data.authorization_url,
        clientSecret: body.data.access_code,
        status: 'requires_action',
      };
    } catch (err: any) {
      console.error('[PaystackPaymentProvider] Network error:', err.message);
      return {
        psp: this.name,
        pspRef: reference,
        status: 'failed',
      };
    }
  }

  /**
   * Verifies that funds have been captured on Paystack.
   */
  public async capture(pspRef: string, amountMinor: bigint): Promise<PaymentCaptureResult> {
    if (!this.isLiveConfigured) {
      return {
        pspRef,
        status: 'captured',
        capturedAmountMinor: amountMinor,
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/transaction/verify/${encodeURIComponent(pspRef)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      });

      const body: any = await response.json();

      if (response.ok && body.status && body.data.status === 'success') {
        const verifiedAmount = BigInt(body.data.amount);
        return {
          pspRef,
          status: 'captured',
          capturedAmountMinor: verifiedAmount,
        };
      }

      return {
        pspRef,
        status: 'failed',
        capturedAmountMinor: 0n,
      };
    } catch (err: any) {
      console.error('[PaystackPaymentProvider] Capture verification error:', err.message);
      return {
        pspRef,
        status: 'failed',
        capturedAmountMinor: 0n,
      };
    }
  }

  /**
   * Issues a refund through Paystack.
   */
  public async refund(params: PaymentRefundParams): Promise<PaymentRefundResult> {
    if (!this.isLiveConfigured) {
      return {
        refundPspRef: `PSTK-REF-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
        status: 'succeeded',
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/refund`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction: params.paymentPspRef,
          amount: params.amountMinor.toString(),
          currency: params.currency,
          customer_note: params.reason || 'Escrow cancellation refund',
        }),
      });

      const body: any = await response.json();

      if (response.ok && body.status) {
        return {
          refundPspRef: body.data.id ? body.data.id.toString() : params.paymentPspRef,
          status: 'succeeded',
        };
      }

      return {
        refundPspRef: params.paymentPspRef,
        status: 'failed',
      };
    } catch (err: any) {
      console.error('[PaystackPaymentProvider] Refund error:', err.message);
      return {
        refundPspRef: params.paymentPspRef,
        status: 'failed',
      };
    }
  }

  /**
   * Cryptographically verifies incoming Paystack IPN Webhook payloads.
   */
  public verifyWebhookSignature(rawBody: string, signature: string): boolean {
    if (!this.secretKey) return false;
    const computedHash = crypto
      .createHmac('sha512', this.secretKey)
      .update(rawBody)
      .digest('hex');
    return computedHash === signature;
  }
}
