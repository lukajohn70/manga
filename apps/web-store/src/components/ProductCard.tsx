'use client';

import * as React from 'react';
import { motion } from 'motion/react';

export interface VendorOffer {
  vendorId: string;
  vendorName: string;
  vendorRating: number;
  priceNgn: number;
  priceUsd: number;
  condition: string;
  deliveryTime: string;
  dispatchCity: string;
}

export interface ProductItem {
  id: string;
  title: string;
  category: string;
  categoryName?: string;
  priceNgn: number;
  oldPriceNgn?: number;
  priceUsd: number;
  oldPriceUsd?: number;
  image: string;
  rating: number;
  reviewsCount: number;
  storeName: string;
  type: 'physical' | 'digital';
  deliveryEstimate?: string;
  otherOffers?: VendorOffer[];
}

export interface ProductCardProps {
  item: ProductItem;
  currency: 'NGN' | 'USD';
  inWishlist: boolean;
  onToggleWishlist: (id: string, sourceEl?: HTMLElement) => void;
  onAddToCart: (item: ProductItem, sourceEl?: HTMLElement) => void;
  onViewProduct: (item: ProductItem) => void;
  onOpenBuyBox?: (item: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  item,
  currency,
  inWishlist,
  onToggleWishlist,
  onAddToCart,
  onViewProduct,
  onOpenBuyBox,
}) => {
  const visualRef = React.useRef<HTMLDivElement>(null);

  const formatPrice = (ngn: number, usd: number) => {
    return currency === 'NGN' ? `₦${ngn.toLocaleString()}` : `$${usd.toLocaleString()}`;
  };

  return (
    <motion.div
      id={`product-card-${item.id}`}
      data-product-id={item.id}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
      className="group bg-white rounded-2xl border border-[#EAE3D9] hover:border-[#B5532E]/40 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] flex flex-col justify-between overflow-hidden"
    >
      <div>
        <div
          ref={visualRef}
          id={`product-visual-${item.id}`}
          className="relative bg-[#F5F2EC] aspect-square overflow-hidden cursor-pointer"
          onClick={() => onViewProduct(item)}
        >
          <motion.img
            src={item.image}
            alt={item.title}
            whileHover={{ scale: 1.04 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-3 left-3 bg-[#1D1917]/90 backdrop-blur-sm text-[#F5F2EC] text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {item.categoryName || item.category}
          </span>
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(item.id, visualRef.current || e.currentTarget);
            }}
            title={inWishlist ? 'Remove from Wishlist' : 'Save to Wishlist'}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#78716C] shadow-sm backdrop-blur-md flex items-center justify-center border border-white/60 cursor-pointer apple-pressable"
          >
            <i className={`${inWishlist ? 'fas text-[#B5532E]' : 'far text-[#78716C]'} fa-heart text-xs`} />
          </motion.button>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-1.5 text-xs text-[#D9A441] mb-1.5">
            <i className="fas fa-star text-[10px]" />
            <span className="font-semibold text-[#1D1917]">{item.rating.toFixed(1)}</span>
            <span className="text-[#78716C] text-[11px] font-normal">({item.reviewsCount})</span>
          </div>

          <h3
            onClick={() => onViewProduct(item)}
            className="font-medium text-sm text-[#1D1917] line-clamp-2 mb-2 group-hover:text-[#B5532E] transition-colors cursor-pointer leading-snug"
          >
            {item.title}
          </h3>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-base font-bold text-[#B5532E] tracking-tight">
              {formatPrice(item.priceNgn, item.priceUsd)}
            </span>
            {item.oldPriceNgn && (
              <span className="text-xs text-[#78716C] line-through font-normal">
                {formatPrice(item.oldPriceNgn, item.oldPriceUsd || 0)}
              </span>
            )}
          </div>

          <div className="text-[11px] text-[#78716C] flex items-center justify-between gap-1 mb-2">
            <span className="flex items-center gap-1.5 truncate">
              <i className="fas fa-store text-[10px] opacity-70" />
              <span className="truncate">{item.storeName}</span>
            </span>
            {item.type === 'digital' ? (
              <span className="text-[#3E5C76] font-semibold text-[10px]">Instant</span>
            ) : (
              <span className="text-[#4F6B3A] font-semibold text-[10px]">Express</span>
            )}
          </div>

          {/* Buy Box Offer Switcher */}
          {item.otherOffers && item.otherOffers.length > 0 && onOpenBuyBox && (
            <button
              type="button"
              onClick={() => onOpenBuyBox(item)}
              className="w-full mb-1 py-1 px-2.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F5EFE6] border border-[#EAE3D9] text-[#B5532E] text-[10px] font-semibold flex items-center justify-between cursor-pointer transition-colors"
            >
              <span>Compare {item.otherOffers.length + 1} offers</span>
              <span className="underline">View</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-5 pt-0">
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={(e) => {
            const visualEl = visualRef.current || e.currentTarget;
            onAddToCart(item, visualEl);
          }}
          className="w-full py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#B5532E] text-[#1D1917] hover:text-white border border-[#EAE3D9] hover:border-transparent text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer apple-pressable transition-colors"
        >
          <i className="fas fa-bag-shopping text-xs opacity-75" />
          <span>Add to Bag</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
