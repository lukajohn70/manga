'use client';

import * as React from 'react';

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
    <div
      id={`product-card-${item.id}`}
      data-product-id={item.id}
      className="group bg-white rounded-2xl border border-[#E7D5BC]/80 hover:border-[#B5532E]/40 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
    >
      <div>
        <div
          ref={visualRef}
          id={`product-visual-${item.id}`}
          className="relative bg-gray-100 aspect-square overflow-hidden cursor-pointer"
          onClick={() => onViewProduct(item)}
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute top-3 left-3 bg-[#2A2320] text-[#F6EDE0] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {item.categoryName || item.category}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(item.id, visualRef.current || e.currentTarget);
            }}
            title={inWishlist ? 'Remove from Wishlist' : 'Save to Wishlist'}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-[#8C8279] shadow-md backdrop-blur-sm flex items-center justify-center transition-all z-10 hover:scale-110 border-0 cursor-pointer"
          >
            <i className={`${inWishlist ? 'fas text-[#B5532E]' : 'far text-[#8C8279]'} fa-heart text-xs`}></i>
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-1 text-xs text-[#D9A441] mb-1">
            <i className="fas fa-star text-[10px]"></i>
            <span className="font-bold text-[#2A2320]">{item.rating.toFixed(1)}</span>
            <span className="text-[#8C8279] text-[11px]">({item.reviewsCount} reviews)</span>
          </div>

          <h3
            onClick={() => onViewProduct(item)}
            className="font-bold text-sm text-[#2A2320] line-clamp-2 mb-2 group-hover:text-[#B5532E] transition-colors cursor-pointer"
          >
            {item.title}
          </h3>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-base font-black text-[#B5532E]">
              {formatPrice(item.priceNgn, item.priceUsd)}
            </span>
            {item.oldPriceNgn && (
              <span className="text-xs text-[#8C8279] line-through">
                {formatPrice(item.oldPriceNgn, item.oldPriceUsd || 0)}
              </span>
            )}
          </div>

          <div className="text-[11px] text-[#8C8279] flex items-center justify-between gap-1 mb-2">
            <span className="flex items-center gap-1 truncate">
              <i className="fas fa-store text-[#8C8279] text-[10px]"></i>
              <span className="truncate">Sold by: {item.storeName}</span>
            </span>
            {item.type === 'digital' ? (
              <span className="text-[#3E5C76] font-bold text-[10px]">Instant</span>
            ) : (
              <span className="text-[#4F6B3A] font-bold text-[10px]">Express</span>
            )}
          </div>

          {/* Buy Box Offer Switcher */}
          {item.otherOffers && item.otherOffers.length > 0 && onOpenBuyBox && (
            <button
              type="button"
              onClick={() => onOpenBuyBox(item)}
              className="w-full mb-1 py-1 px-2 rounded-lg bg-[#F6EDE0] hover:bg-[#E7D5BC]/60 border border-[#E7D5BC] text-[#B5532E] text-[10px] font-bold flex items-center justify-between cursor-pointer transition-colors"
            >
              <span>Compare {item.otherOffers.length + 1} seller offers</span>
              <span className="underline">View</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-5 pt-0">
        <button
          type="button"
          onClick={() => onAddToCart(item)}
          className="w-full py-2.5 bg-[#FAF6F0] hover:bg-[#B5532E] text-[#2A2320] hover:text-white rounded-xl text-xs font-bold border border-[#E7D5BC] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
        >
          <i className="fas fa-cart-plus"></i>
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};
