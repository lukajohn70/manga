'use client';

import * as React from 'react';
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
  if (!isOpen || !product) return null;

  const formatPrice = (ngn: number, usd: number) => {
    return currency === 'NGN' ? `₦${ngn.toLocaleString()}` : `$${usd.toLocaleString()}`;
  };

  const allOffers: VendorOffer[] = [
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
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl z-10 overflow-hidden border border-[#E7D5BC] text-[#2A2320]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E7D5BC]/60 flex items-center justify-between bg-[#FAF6F0]">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-[#F6EDE0] text-[#B5532E] flex items-center justify-center font-bold text-sm">
              <i className="fas fa-scale-balanced"></i>
            </span>
            <div>
              <h3 className="font-display font-black text-base text-[#2A2320] leading-tight">
                Compare Verified Seller Offers
              </h3>
              <p className="text-xs text-[#8C8279]">Choose your preferred price, condition & delivery speed</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-[#8C8279] hover:text-[#2A2320] hover:bg-[#F6EDE0] flex items-center justify-center transition-colors border-0 bg-transparent cursor-pointer"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Product Mini Banner */}
        <div className="p-4 bg-[#F6EDE0]/40 border-b border-[#E7D5BC] flex items-center gap-3">
          <img
            src={product.image}
            alt={product.title}
            className="w-12 h-12 object-cover rounded-xl border border-[#E7D5BC] bg-white"
          />
          <div className="min-w-0">
            <h4 className="font-bold text-xs text-[#2A2320] truncate">{product.title}</h4>
            <p className="text-[11px] text-[#8C8279] font-medium">{product.categoryName || product.category} Department</p>
          </div>
        </div>

        {/* Offers List */}
        <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
          {allOffers.map((offer, idx) => {
            const isFeatured = idx === 0;
            return (
              <div
                key={offer.vendorId}
                className={`p-4 rounded-2xl border transition-all ${
                  isFeatured
                    ? 'border-[#B5532E] bg-[#F6EDE0]/30 shadow-xs'
                    : 'border-[#E7D5BC]/80 bg-white hover:border-[#8C8279]'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-sm text-[#2A2320]">{offer.vendorName}</h5>
                      {isFeatured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#B5532E] text-white">
                          Featured Choice
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#D9A441] mt-0.5">
                      <div className="flex items-center gap-1">
                        <i className="fas fa-star text-[10px]"></i>
                        <span className="font-bold text-[#2A2320]">{offer.vendorRating.toFixed(1)}</span>
                      </div>
                      <span className="text-[#E7D5BC]">•</span>
                      <span className="text-[#8C8279] text-[11px]">{offer.condition}</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-lg font-black text-[#B5532E] block leading-none">
                      {formatPrice(offer.priceNgn, offer.priceUsd)}
                    </span>
                    <span className="text-[10px] text-[#8C8279] mt-0.5 block">
                      Dispatched from {offer.dispatchCity}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E7D5BC]/40 text-xs">
                  <span className="text-[#4F6B3A] font-semibold flex items-center gap-1 text-[11px]">
                    <i className="fas fa-truck-fast"></i> {offer.deliveryTime}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectOffer(product, offer);
                      onClose();
                    }}
                    className="px-4 py-1.5 rounded-xl bg-[#B5532E] hover:bg-[#8F3B1F] text-white font-bold text-xs transition-colors border-0 cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <span>Select Seller</span>
                    <i className="fas fa-check text-[10px]"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Guarantee */}
        <div className="p-4 bg-[#FAF6F0] border-t border-[#E7D5BC]/60 flex items-center justify-between text-xs text-[#8C8279]">
          <span className="flex items-center gap-1.5 font-medium">
            <i className="fas fa-shield-halved text-[#4F6B3A]"></i>
            <span>Every seller offer backed by 100% Verified Sellers Guarantee</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8C8279] hover:text-[#2A2320] font-bold bg-transparent border-0 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
