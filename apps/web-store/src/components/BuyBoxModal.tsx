'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductItem, VendorOffer } from './ProductCard';

export interface BuyBoxModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectOffer: (product: ProductItem, offer: VendorOffer) => void;
  currency: 'NGN' | 'USD';
}

export const BuyBoxModal: React.FC<BuyBoxModalProps> = ({
  product,
  isOpen,
  onClose,
  onSelectOffer,
  currency,
}) => {
  const formatPrice = (ngn: number, usd: number) => {
    return currency === 'NGN' ? `₦${ngn.toLocaleString()}` : `$${usd.toLocaleString()}`;
  };

  const allOffers: VendorOffer[] = product
    ? [
        {
          vendorId: 'primary',
          vendorName: product.storeName,
          vendorRating: product.rating,
          priceNgn: product.priceNgn,
          priceUsd: product.priceUsd,
          condition: 'Brand New (Official Partner)',
          deliveryTime: product.deliveryEstimate || 'Manga Express • Tomorrow',
          dispatchCity: 'Lagos Hub',
        },
        ...(product.otherOffers || []),
      ]
    : [];

  return (
    <AnimatePresence mode="wait">
      {isOpen && product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with Soft Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Dialog with Apple Spring Scale */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.28 }}
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl z-10 overflow-hidden border border-[#EAE3D9] text-[#1D1917]"
          >
        
        {/* Header */}
        <div className="p-5 border-b border-[#EAE3D9] flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-white text-[#B5532E] flex items-center justify-center font-bold text-sm border border-[#EAE3D9]">
              <i className="fas fa-scale-balanced"></i>
            </span>
            <div>
              <h3 className="apple-heading font-bold text-base text-[#1D1917] leading-tight tracking-tight">
                Compare Verified Seller Offers
              </h3>
              <p className="apple-subhead text-xs text-[#78716C] font-normal">Choose your preferred price, condition & delivery speed</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-[#78716C] hover:text-[#1D1917] hover:bg-[#FAF7F2] flex items-center justify-center transition-colors border-0 bg-transparent cursor-pointer apple-pressable"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Product Mini Banner */}
        <div className="p-4 bg-[#FAF7F2]/60 border-b border-[#EAE3D9] flex items-center gap-3">
          <img
            src={product.image}
            alt={product.title}
            className="w-12 h-12 object-cover rounded-xl border border-[#EAE3D9] bg-white"
          />
          <div className="min-w-0">
            <h4 className="font-semibold text-xs text-[#1D1917] truncate">{product.title}</h4>
            <p className="text-[11px] text-[#78716C] font-normal">{product.categoryName || product.category} Department</p>
          </div>
        </div>

        {/* Offers List */}
        <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
          {allOffers.map((offer, idx) => {
            const isFeatured = idx === 0;
            return (
              <div
                key={offer.vendorId}
                className={`p-4 rounded-2xl border transition-colors ${
                  isFeatured
                    ? 'border-[#B5532E] bg-[#FAF7F2]/60 shadow-xs'
                    : 'border-[#EAE3D9] bg-white hover:border-[#78716C]'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-semibold text-sm text-[#1D1917]">{offer.vendorName}</h5>
                      {isFeatured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#B5532E] text-white">
                          Featured Choice
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#D9A441] mt-0.5">
                      <div className="flex items-center gap-1">
                        <i className="fas fa-star text-[10px]"></i>
                        <span className="font-semibold text-[#1D1917]">{offer.vendorRating.toFixed(1)}</span>
                      </div>
                      <span className="text-[#EAE3D9]">•</span>
                      <span className="text-[#78716C] text-[11px] font-normal">{offer.condition}</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-lg font-bold text-[#B5532E] block leading-none tracking-tight">
                      {formatPrice(offer.priceNgn, offer.priceUsd)}
                    </span>
                    <span className="text-[10px] text-[#78716C] mt-0.5 block font-normal">
                      Dispatched from {offer.dispatchCity}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#EAE3D9]/60 text-xs">
                  <span className="text-[#4F6B3A] font-medium flex items-center gap-1 text-[11px]">
                    <i className="fas fa-truck-fast"></i> {offer.deliveryTime}
                  </span>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
                    onClick={() => {
                      onSelectOffer(product, offer);
                      onClose();
                    }}
                    className="px-4 py-1.5 rounded-xl bg-[#B5532E] hover:bg-[#A04523] text-white font-semibold text-xs transition-colors border-0 cursor-pointer flex items-center gap-1 shadow-xs apple-pressable"
                  >
                    <span>Select Seller</span>
                    <i className="fas fa-check text-[10px]"></i>
                  </motion.button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Guarantee */}
        <div className="p-4 bg-[#FAF7F2] border-t border-[#EAE3D9] flex items-center justify-between text-xs text-[#78716C]">
          <span className="flex items-center gap-1.5 font-normal">
            <i className="fas fa-shield-halved text-[#4F6B3A]"></i>
            <span>Every seller offer backed by 100% Verified Sellers Guarantee</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-[#78716C] hover:text-[#1D1917] font-semibold bg-transparent border-0 cursor-pointer"
          >
            Close
          </button>
        </div>

      </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
