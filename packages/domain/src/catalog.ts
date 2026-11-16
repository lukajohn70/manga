/**
 * Manga Platform - Catalog & Offers Domain Model
 */

export type ProductStatus = 'draft' | 'pending_moderation' | 'published' | 'archived';

export type OfferCondition = 'new' | 'refurbished_excellent' | 'refurbished_good' | 'used';

export type OfferStatus = 'active' | 'paused' | 'suspended';

export interface AttributeDefinition {
  readonly id: string;
  readonly categoryId: string;
  readonly key: string;
  readonly type: 'string' | 'number' | 'boolean' | 'enum';
  readonly constraints?: Record<string, unknown>;
  readonly facetable: boolean;
  readonly required: boolean;
}

export interface MasterProduct {
  readonly id: string;
  readonly brandId?: string;
  readonly title: string;
  readonly description: string;
  readonly gtin?: string;
  readonly categoryId: string;
  readonly status: ProductStatus;
  readonly attributes: Record<string, unknown>;
  readonly createdAt: Date;
}

export interface ProductVariant {
  readonly id: string;
  readonly masterProductId: string;
  readonly skuCanonical: string;
  readonly optionValues: Record<string, string>;
  readonly gtin?: string;
  readonly weightGrams: number;
  readonly dimensionsMm?: { length: number; width: number; height: number };
  readonly hsCode?: string;
}

export interface VendorOffer {
  readonly id: string;
  readonly vendorId: string;
  readonly variantId: string;
  readonly condition: OfferCondition;
  readonly priceMinor: bigint;
  readonly currency: string;
  readonly compareAtPriceMinor?: bigint;
  readonly handlingTimeHours: number;
  readonly shippingProfileId: string;
  readonly policyTemplateId: string;
  readonly status: OfferStatus;
  readonly version: number;
}
