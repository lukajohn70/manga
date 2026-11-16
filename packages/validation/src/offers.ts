import { z } from 'zod';
import { CurrencyCodeSchema } from './common.js';

export const CreateOfferSchema = z.object({
  variantId: z.string().uuid(),
  condition: z.enum(['new', 'refurbished_excellent', 'refurbished_good', 'used']),
  priceMinor: z.union([z.bigint(), z.number(), z.string()]).transform((v) => BigInt(v)),
  currency: CurrencyCodeSchema,
  compareAtPriceMinor: z
    .union([z.bigint(), z.number(), z.string()])
    .transform((v) => BigInt(v))
    .optional(),
  handlingTimeHours: z.number().int().min(1).max(168), // up to 7 days
  shippingProfileId: z.string().uuid(),
  policyTemplateId: z.string().uuid(),
});

export const UpdateOfferPriceSchema = z.object({
  priceMinor: z.union([z.bigint(), z.number(), z.string()]).transform((v) => BigInt(v)),
  compareAtPriceMinor: z
    .union([z.bigint(), z.number(), z.string()])
    .transform((v) => BigInt(v))
    .optional(),
});

export type CreateOfferInput = z.infer<typeof CreateOfferSchema>;
export type UpdateOfferPriceInput = z.infer<typeof UpdateOfferPriceSchema>;
