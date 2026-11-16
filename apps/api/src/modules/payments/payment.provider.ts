export interface CreatePaymentIntentParams {
  orderId: string;
  orderNumber: string;
  amountMinor: bigint;
  currency: string;
  paymentMethod: string;
  idempotencyKey: string;
  metadata?: Record<string, string>;
}

export interface PaymentIntentResult {
  psp: string;
  pspRef: string;
  clientSecret?: string;
  redirectUrl?: string;
  status: 'requires_action' | 'authorized' | 'captured' | 'failed';
}

export interface PaymentCaptureResult {
  pspRef: string;
  status: 'captured' | 'failed';
  capturedAmountMinor: bigint;
}

export interface PaymentRefundParams {
  paymentPspRef: string;
  amountMinor: bigint;
  currency: string;
  idempotencyKey: string;
  reason?: string;
}

export interface PaymentRefundResult {
  refundPspRef: string;
  status: 'succeeded' | 'pending' | 'failed';
}

export interface PaymentProvider {
  name: string;
  createIntent(params: CreatePaymentIntentParams): Promise<PaymentIntentResult>;
  capture(pspRef: string, amountMinor: bigint): Promise<PaymentCaptureResult>;
  refund(params: PaymentRefundParams): Promise<PaymentRefundResult>;
}

export class MockCardPaymentProvider implements PaymentProvider {
  public name = 'mock_card_psp';

  public async createIntent(params: CreatePaymentIntentParams): Promise<PaymentIntentResult> {
    const pspRef = `CARD-TX-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    // Test rejection simulation
    if (params.paymentMethod === 'card_fail') {
      return {
        psp: this.name,
        pspRef,
        status: 'failed',
      };
    }

    return {
      psp: this.name,
      pspRef,
      clientSecret: `cs_test_${crypto.randomUUID()}`,
      status: 'authorized',
    };
  }

  public async capture(pspRef: string, amountMinor: bigint): Promise<PaymentCaptureResult> {
    return {
      pspRef,
      status: 'captured',
      capturedAmountMinor: amountMinor,
    };
  }

  public async refund(params: PaymentRefundParams): Promise<PaymentRefundResult> {
    return {
      refundPspRef: `REFUND-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      status: 'succeeded',
    };
  }
}
