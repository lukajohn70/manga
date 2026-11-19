export interface ScannableBenefit {
  benefit: string;
  explanation: string;
}

export interface ProductFaq {
  question: string;
  answer: string;
}

export interface SizingGuide {
  fitNotes: string;
  modelStats?: string;
  chart?: Array<{
    label: string;
    metric: string;
    imperial?: string;
  }>;
}

export interface TrustShippingInfo {
  warrantyDuration: string;
  returnPolicy: string;
  kadunaSameDay: boolean;
  nationwideDelivery: string;
  sellerAccredited: boolean;
  escrowProtected: boolean;
}

export interface ProductDetailItem {
  id: string;
  sku: string;
  title: string;
  brand: string;
  category: string;
  categoryName: string;
  priceNgn: number;
  oldPriceNgn?: number;
  priceUsd: number;
  oldPriceUsd?: number;
  image: string;
  gallery: string[];
  rating: number;
  reviewsCount: number;
  storeName: string;
  vendorTier?: string;
  vendorRating?: number;
  vendorLocation?: string;
  type: 'physical' | 'digital';
  stockLeft: number;
  deliveryEstimate: string;
  warranty: string;
  description: string;
  
  // 10 Core High-Converting Components
  hook: string; // 2. Engaging Hook / Value Proposition
  scannableBenefits: ScannableBenefit[]; // 3. Scannable Bullet Points (Features & Benefits)
  narrativeStory: string; // 4. Detailed Narrative Description
  specs: Array<{ label: string; value: string }>; // 5. Technical Specifications Matrix
  sizingGuide?: SizingGuide; // 6. Sizing & Fit Guide
  boxContents: string[]; // 7. "What's in the Box" (Package Contents)
  trustShipping: TrustShippingInfo; // 8. Trust Signals, Warranty & Shipping Info
  faq: ProductFaq[]; // 10. Social Proof & FAQ

  highlights: string[];
  variants: Array<{
    id: string;
    name: string;
    sku?: string;
    priceNgn?: number;
    priceUsd?: number;
    inStock: boolean;
    stockQuantity?: number;
  }>;
  offerId?: string;
  otherOffers?: Array<{
    vendorId: string;
    vendorName: string;
    vendorRating?: number;
    priceNgn: number;
    priceUsd: number;
    condition: string;
    deliveryTime?: string;
    dispatchCity?: string;
  }>;
}

export const CATALOG_PRODUCTS_MAP: Record<string, ProductDetailItem> = {};

export function findProductById(id: string): ProductDetailItem | null {
  return CATALOG_PRODUCTS_MAP[id] || null;
}
