'use client';

import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductItem } from './ProductCard';

export interface ProductDetailModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: ProductItem, qty: number, sourceEl?: HTMLElement) => void;
  inWishlist: boolean;
  onToggleWishlist: (id: string, sourceEl?: HTMLElement) => void;
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
  const modalVisualRef = React.useRef<HTMLDivElement>(null);
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
    <AnimatePresence>
      {isOpen && product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl z-10 overflow-hidden border border-[#EAE3D9] max-h-[92vh] flex flex-col text-[#1D1917]"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#EAE3D9] flex items-center justify-between bg-[#FAF7F2]">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold uppercase tracking-wider text-[#B5532E]">
                  {product.categoryName || product.category}
                </span>
                <span className="text-[#C5BDB5]">•</span>
                <span className="text-[#78716C] font-mono text-[11px]">
                  SKU: {variants[selectedVariant].sku}
                </span>
              </div>
              <motion.button
                whileTap={{ scale: 0.92 }}
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg text-[#78716C] hover:text-[#1D1917] hover:bg-[#EAE3D9]/50 flex items-center justify-center transition-colors border-0 bg-transparent cursor-pointer"
              >
                <i className="fas fa-times"></i>
              </motion.button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8">
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                
                {/* Gallery (Left 5 Cols) */}
                <div className="lg:col-span-5 space-y-3">
                  <div
                    ref={modalVisualRef}
                    id="modal-product-visual"
                    className="relative rounded-2xl overflow-hidden aspect-square bg-[#FAF7F2] border border-[#EAE3D9] flex items-center justify-center p-4"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-contain"
                    />
                    <span className="absolute top-3 left-3 bg-[#B5532E] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                      Verified Genuine
                    </span>
                    <span className="absolute top-3 right-3 bg-[#161311] text-[#D9A441] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/10">
                      Manga Express
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#78716C] px-1">
                    <span className="flex items-center gap-1 text-[11px]">
                      <i className="fas fa-camera text-[#B5532E]"></i> Studio Photography
                    </span>
                    <span className="text-[11px] text-[#4F6B3A] font-semibold">
                      <i className="fas fa-shield-halved"></i> Genuine Guarantee
                    </span>
                  </div>
                </div>

                {/* Product Details & Purchase Controls (Right 7 Cols) */}
                <div className="lg:col-span-7 space-y-4">
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-[#D9A441]">
                      <i className="fas fa-star text-[11px]"></i>
                      <span className="font-bold text-[#1D1917]">{product.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-[#C5BDB5]">•</span>
                    <span className="text-[#78716C] text-xs">({product.reviewsCount} reviews)</span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-bold apple-heading text-[#1D1917] leading-tight">
                    {product.title}
                  </h1>

                  {/* Price Bar */}
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D9] flex flex-wrap items-baseline justify-between gap-3">
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#B5532E] tracking-tight">
                        {formatPrice(currentPriceNgn, currentPriceUsd)}
                      </span>
                      {product.oldPriceNgn && (
                        <span className="text-sm text-[#78716C] line-through font-normal">
                          {formatPrice(product.oldPriceNgn, product.oldPriceUsd || 0)}
                        </span>
                      )}
                    </div>

                    <div>
                      {product.type === 'physical' ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#4F6B3A]/10 text-[#4F6B3A] border border-[#4F6B3A]/20 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4F6B3A]"></span> In Stock
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#3E5C76]/10 text-[#3E5C76] border border-[#3E5C76]/20 flex items-center gap-1.5">
                          <i className="fas fa-infinity text-[#3E5C76]"></i> Lifetime License
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Variation Selector */}
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D9] space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1D1917] flex items-center gap-2">
                      <i className="fas fa-sliders text-[#B5532E]"></i> Select Edition
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {variants.map((v, idx) => (
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          key={v.sku}
                          type="button"
                          onClick={() => setSelectedVariant(idx)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            selectedVariant === idx
                              ? 'border-[#B5532E] bg-white ring-1 ring-[#B5532E] shadow-xs'
                              : 'border-[#EAE3D9] bg-white hover:border-[#78716C]'
                          }`}
                        >
                          <strong className="text-xs text-[#1D1917] block truncate font-semibold">{v.title}</strong>
                          <span className="text-[10px] text-[#78716C]">
                            {v.priceOffset === 0 ? 'Standard price' : `+${formatPrice(v.priceOffset, Math.round(v.priceOffset / 1400))}`}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Purchase Action Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    {product.type === 'physical' ? (
                      <div className="w-28 flex-shrink-0">
                        <div className="flex items-center border border-[#EAE3D9] rounded-xl bg-[#FAF7F2] overflow-hidden h-12">
                          <button
                            type="button"
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            className="w-9 h-full flex items-center justify-center text-[#78716C] hover:text-[#1D1917] font-bold text-base border-0 bg-transparent cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-full text-center font-bold text-sm bg-transparent text-[#1D1917]">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuantity((q) => q + 1)}
                            className="w-9 h-full flex items-center justify-center text-[#78716C] hover:text-[#1D1917] font-bold text-base border-0 bg-transparent cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ) : null}

                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      onClick={(e) => {
                        onAddToCart(product, quantity, modalVisualRef.current || (e.currentTarget as HTMLElement));
                        onClose();
                      }}
                      className="flex-1 h-12 px-4 bg-[#B5532E] hover:bg-[#8F3B1F] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 border-0 cursor-pointer apple-pressable"
                    >
                      <i className="fas fa-cart-plus text-xs"></i>
                      <span>Add to Bag ({quantity})</span>
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.94 }}
                      type="button"
                      onClick={(e) => {
                        onToggleWishlist(product.id, modalVisualRef.current || (e.currentTarget as HTMLElement));
                      }}
                      title={inWishlist ? 'Remove from Wishlist' : 'Save to Wishlist'}
                      className={`w-12 h-12 rounded-xl border flex items-center justify-center text-base transition-colors flex-shrink-0 cursor-pointer apple-pressable ${
                        inWishlist
                          ? 'bg-rose-50 border-rose-200 text-rose-600'
                          : 'bg-[#FAF7F2] border-[#EAE3D9] text-[#78716C] hover:text-rose-600 hover:bg-rose-50'
                      }`}
                    >
                      <i className={`${inWishlist ? 'fas text-rose-500' : 'far'} fa-heart`}></i>
                    </motion.button>
                  </div>

                  {/* Delivery, Returns & Merchant Info */}
                  <div className="mt-4 p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D9] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#B5532E]/10 text-[#B5532E] flex items-center justify-center flex-shrink-0 text-xs">
                        <i className="fas fa-truck-fast"></i>
                      </div>
                      <div>
                        <h5 className="font-bold text-[#1D1917]">Door Delivery Across Nigeria</h5>
                        <p className="text-[11px] text-[#78716C] mt-0.5">Dispatched within 24-72 hours nationwide.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#4F6B3A]/10 text-[#4F6B3A] flex items-center justify-center flex-shrink-0 text-xs">
                        <i className="fas fa-rotate-left"></i>
                      </div>
                      <div>
                        <h5 className="font-bold text-[#1D1917]">7-Day Free Returns</h5>
                        <p className="text-[11px] text-[#78716C] mt-0.5">Hassle-free replacement guarantee.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#D9A441]/15 text-[#8F3B1F] flex items-center justify-center flex-shrink-0 text-xs">
                        <i className="fas fa-shield-halved"></i>
                      </div>
                      <div>
                        <h5 className="font-bold text-[#1D1917]">100% Genuine Guaranteed</h5>
                        <p className="text-[11px] text-[#78716C] mt-0.5">Authentic sourced products with warranty.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#3E5C76]/10 text-[#3E5C76] flex items-center justify-center flex-shrink-0 text-xs">
                        <i className="fas fa-store"></i>
                      </div>
                      <div>
                        <h5 className="font-bold text-[#1D1917]">Verified Seller</h5>
                        <p className="text-[11px] text-[#78716C] mt-0.5 truncate">{product.storeName}</p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
