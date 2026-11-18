'use client';

import * as React from 'react';
import { useState } from 'react';
import { ProductItem } from './ProductCard';

export interface ProductDetailModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: ProductItem, qty: number) => void;
  inWishlist: boolean;
  onToggleWishlist: (id: string) => void;
  currency: 'NGN' | 'USD';
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  inWishlist,
  onToggleWishlist,
  currency,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);

  if (!isOpen || !product) return null;

  const formatPrice = (ngn: number, usd: number) => {
    return currency === 'NGN' ? `₦${ngn.toLocaleString()}` : `$${usd.toLocaleString()}`;
  };

  const variants = [
    { title: 'Standard Edition (Graphite / Midnight)', sku: `${product.id}-STD`, priceOffset: 0 },
    { title: 'Pro Performance Bundle (Titanium)', sku: `${product.id}-PRO`, priceOffset: 25000 },
  ];

  const currentPriceNgn = product.priceNgn + variants[selectedVariant].priceOffset;
  const currentPriceUsd = product.priceUsd + Math.round(variants[selectedVariant].priceOffset / 1400);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl z-10 overflow-hidden border border-[#E7D5BC] max-h-[92vh] flex flex-col text-[#2A2320]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E7D5BC]/60 flex items-center justify-between bg-[#FAF6F0]">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-[#B5532E]">
              {product.categoryName || product.category}
            </span>
            <span className="text-[#8C8279]">•</span>
            <span className="text-[#8C8279] font-mono text-[11px]">
              SKU: {variants[selectedVariant].sku}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-[#8C8279] hover:text-[#2A2320] hover:bg-[#F6EDE0] flex items-center justify-center transition-colors border-0 bg-transparent cursor-pointer"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Gallery (Left 5 Cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="relative rounded-2xl overflow-hidden aspect-square bg-[#FAF6F0] border border-[#E7D5BC] flex items-center justify-center p-4">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
                <span className="absolute top-3 left-3 bg-[#B5532E] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Verified Genuine
                </span>
                <span className="absolute top-3 right-3 bg-[#2A2320] text-[#D9A441] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-[#D9A441]/30">
                  Manga Express
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-[#8C8279] px-1">
                <span className="flex items-center gap-1 text-[11px]">
                  <i className="fas fa-camera text-[#B5532E]"></i> Studio Photography
                </span>
                <span className="text-[11px] text-[#4F6B3A] font-semibold">
                  <i className="fas fa-shield-halved"></i> Manufacturer Warranty
                </span>
              </div>
            </div>

            {/* Product Details & Purchase Controls (Right 7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-[#D9A441]">
                  <i className="fas fa-star text-[11px]"></i>
                  <span className="font-bold text-[#2A2320]">{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-[#E7D5BC]">•</span>
                <span className="text-[#8C8279] text-xs">({product.reviewsCount} verified reviews)</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black font-display text-[#2A2320] leading-tight">
                {product.title}
              </h1>

              {/* Price Bar */}
              <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E7D5BC]/80 flex flex-wrap items-baseline justify-between gap-3">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-black text-[#B5532E]">
                    {formatPrice(currentPriceNgn, currentPriceUsd)}
                  </span>
                  {product.oldPriceNgn && (
                    <span className="text-sm text-[#8C8279] line-through">
                      {formatPrice(product.oldPriceNgn, product.oldPriceUsd || 0)}
                    </span>
                  )}
                </div>

                <div>
                  {product.type === 'physical' ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#4F6B3A]/15 text-[#4F6B3A] border border-[#4F6B3A]/30 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#4F6B3A] animate-pulse"></span> In Stock (Express Dispatch)
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#3E5C76]/15 text-[#3E5C76] border border-[#3E5C76]/30 flex items-center gap-1.5">
                      <i className="fas fa-infinity text-[#3E5C76]"></i> Lifetime Commercial License
                    </span>
                  )}
                </div>
              </div>

              {/* Variation Selector */}
              <div className="p-4 rounded-2xl bg-[#F6EDE0]/50 border border-[#E7D5BC] space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2A2320] flex items-center gap-2">
                  <i className="fas fa-sliders text-[#B5532E]"></i> Select Product Edition
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {variants.map((v, idx) => (
                    <button
                      key={v.sku}
                      type="button"
                      onClick={() => setSelectedVariant(idx)}
                      className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        selectedVariant === idx
                          ? 'border-[#B5532E] bg-white shadow-xs'
                          : 'border-[#E7D5BC] bg-[#FAF6F0] hover:border-[#8C8279]'
                      }`}
                    >
                      <strong className="text-xs text-[#2A2320] block truncate">{v.title}</strong>
                      <span className="text-[10px] text-[#8C8279]">
                        {v.priceOffset === 0 ? 'Standard price' : `+${formatPrice(v.priceOffset, Math.round(v.priceOffset / 1400))}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Purchase Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                {product.type === 'physical' ? (
                  <div className="w-28 flex-shrink-0">
                    <div className="flex items-center border border-[#E7D5BC] rounded-xl bg-[#FAF6F0] overflow-hidden h-12">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-9 h-full flex items-center justify-center text-[#8C8279] hover:text-[#2A2320] font-bold text-base border-0 bg-transparent cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-full text-center font-black text-sm bg-transparent text-[#2A2320]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-9 h-full flex items-center justify-center text-[#8C8279] hover:text-[#2A2320] font-bold text-base border-0 bg-transparent cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  className="flex-1 h-12 px-4 bg-[#B5532E] hover:bg-[#8F3B1F] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 border-0 cursor-pointer"
                >
                  <i className="fas fa-cart-plus text-xs"></i>
                  <span>Add to Cart ({quantity})</span>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleWishlist(product.id)}
                  title={inWishlist ? 'Remove from Wishlist' : 'Save to Wishlist'}
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center text-base transition-all flex-shrink-0 cursor-pointer ${
                    inWishlist
                      ? 'bg-[#F6EDE0] border-[#B5532E] text-[#B5532E]'
                      : 'bg-[#FAF6F0] border-[#E7D5BC] text-[#8C8279] hover:text-[#B5532E] hover:bg-[#F6EDE0]'
                  }`}
                >
                  <i className={`${inWishlist ? 'fas text-[#B5532E]' : 'far'} fa-heart`}></i>
                </button>
              </div>

              {/* Delivery, Returns & Merchant Info */}
              <div className="mt-4 p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E7D5BC] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#F6EDE0] text-[#B5532E] flex items-center justify-center flex-shrink-0 text-xs">
                    <i className="fas fa-truck-fast"></i>
                  </div>
                  <div>
                    <h5 className="font-extrabold text-[#2A2320]">Door Delivery Across Nigeria</h5>
                    <p className="text-[11px] text-[#8C8279] mt-0.5">Dispatched within 24-72 hours nationwide.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#4F6B3A]/15 text-[#4F6B3A] flex items-center justify-center flex-shrink-0 text-xs">
                    <i className="fas fa-rotate-left"></i>
                  </div>
                  <div>
                    <h5 className="font-extrabold text-[#2A2320]">7-Day Free Returns</h5>
                    <p className="text-[11px] text-[#8C8279] mt-0.5">Hassle-free replacement guarantee.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#D9A441]/15 text-[#D9A441] flex items-center justify-center flex-shrink-0 text-xs">
                    <i className="fas fa-shield-halved"></i>
                  </div>
                  <div>
                    <h5 className="font-extrabold text-[#2A2320]">100% Genuine Guaranteed</h5>
                    <p className="text-[11px] text-[#8C8279] mt-0.5">Authentic sourced products with warranty.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#3E5C76]/15 text-[#3E5C76] flex items-center justify-center flex-shrink-0 text-xs">
                    <i className="fas fa-store"></i>
                  </div>
                  <div>
                    <h5 className="font-extrabold text-[#2A2320]">Verified Seller</h5>
                    <p className="text-[11px] text-[#8C8279] mt-0.5 truncate">{product.storeName}</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
