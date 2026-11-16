import { z } from 'zod';
import { AddressSchema, IdempotencyKeySchema } from './common.js';

export const CheckoutCartItemSchema = z.object({
  offerId: z.string().uuid(),
  quantity: z.number().int().positive().max(100),
});

export const CreateCheckoutSessionSchema = z.object({
  cartId: z.string().uuid().optional(),
  items: z.array(CheckoutCartItemSchema).min(1),
  shippingAddress: AddressSchema,
  deliverToBucketId: z.string().optional(),
});

export const ConfirmCheckoutSessionSchema = z.object({
  sessionId: z.string().uuid(),
  idempotencyKey: IdempotencyKeySchema,
  paymentMethod: z.enum([
    'card',
    'bank_transfer',
    'ussd',
    'mobile_money',
    'apple_pay',
    'google_pay',
    'pay_on_delivery',
  ]),
});

export type CreateCheckoutSessionInput = z.infer<typeof CreateCheckoutSessionSchema>;
export type ConfirmCheckoutSessionInput = z.infer<typeof ConfirmCheckoutSessionSchema>;
