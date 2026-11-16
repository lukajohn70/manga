/**
 * Manga Platform - Analytics Event Taxonomy (Single schema for Web and Phase 2 Mobile)
 */

export interface BaseAnalyticsEvent {
  readonly eventName: string;
  readonly timestamp: number;
  readonly anonymousId: string;
  readonly userId?: string;
  readonly sessionId?: string;
  readonly platform: 'web' | 'ios' | 'android';
  readonly appVersion?: string;
}

export interface ProductViewedEvent extends BaseAnalyticsEvent {
  readonly eventName: 'product_viewed';
  readonly productId: string;
  readonly variantId?: string;
  readonly categoryId: string;
  readonly vendorId?: string;
  readonly priceMinor: number;
  readonly currency: string;
}

export interface SearchPerformedEvent extends BaseAnalyticsEvent {
  readonly eventName: 'search_performed';
  readonly query: string;
  readonly filters: Record<string, string | number | boolean>;
  readonly resultCount: number;
  readonly tookMs: number;
}

export interface CheckoutStepEvent extends BaseAnalyticsEvent {
  readonly eventName: 'checkout_step';
  readonly stepNumber: number;
  readonly stepName: 'address' | 'shipping_method' | 'payment_method' | 'review';
  readonly cartTotalMinor: number;
  readonly itemCount: number;
}

export interface PaymentAttemptedEvent extends BaseAnalyticsEvent {
  readonly eventName: 'payment_attempted';
  readonly orderId: string;
  readonly psp: string;
  readonly paymentMethod: string;
  readonly amountMinor: number;
  readonly currency: string;
}

export type AnalyticsEvent =
  | ProductViewedEvent
  | SearchPerformedEvent
  | CheckoutStepEvent
  | PaymentAttemptedEvent;
