import { z } from 'zod';

export const CurrencyCodeSchema = z
  .string()
  .length(3)
  .transform((val) => val.toUpperCase());

export const MoneySchema = z.object({
  amount: z.union([z.bigint(), z.number(), z.string()]).transform((val) => BigInt(val)),
  currency: CurrencyCodeSchema,
});

export const IdempotencyKeySchema = z
  .string()
  .min(16)
  .max(128)
  .regex(/^[a-zA-Z0-9_-]+$/, 'Idempotency key must be alphanumeric, underscore, or hyphen');

export const PhoneNumberSchema = z
  .string()
  .min(7)
  .max(20)
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid international phone number format (E.164)');

export const AddressSchema = z.object({
  recipientName: z.string().min(2).max(120),
  phone: PhoneNumberSchema,
  streetAddress: z.string().min(5).max(255),
  landmark: z.string().max(255).optional(),
  city: z.string().min(2).max(100),
  stateOrProvince: z.string().min(2).max(100),
  postalCode: z.string().max(20).optional(),
  countryCode: z.string().length(2).transform((v) => v.toUpperCase()),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export type AddressInput = z.infer<typeof AddressSchema>;
