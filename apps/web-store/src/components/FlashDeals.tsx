'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export interface FlashItem {
  id: string;
  title: string;
  priceNgn: number;
  oldPriceNgn: number;
  priceUsd: number;
  oldPriceUsd: number;
  image: string;
  rating: number;
  reviewsCount: number;
  claimedPercent: number;
  discountPercent: number;
  type: 'physical' | 'digital';
  category: string;
  storeName: string;
}

export interface FlashDealsProps {
  items: FlashItem[];
  currency: 'NGN' | 'USD';
  wishlist: string[];
  onToggleWishlist: (id: string, sourceEl?: HTMLElement) => void;
  onAddToCart: (item: FlashItem, sourceEl?: HTMLElement) => void;
  onViewProduct: (item: FlashItem) => void;
}

export const FlashDeals: React.FC<FlashDealsProps> = ({
  items,
  currency,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onViewProduct,
}) => {
  // Live ticking countdown timer
  const [timeLeft, setTimeLeft] = useState(8 * 3600 + 42 * 60 + 19);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 24 * 3600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hrs = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
  const mins = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');

  const formatPrice = (ngn: number, usd: number) => {
    return currency === 'NGN' ? `₦${ngn.toLocaleString()}` : `$${usd.toLocaleString()}`;
  };

  return (
    <section className="py-14 sm:py-16 bg-[#FAF7F2] border-b border-[#EAE3D9]/80">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Apple-grade Header Bar: Translucent dark material with specular light catching top edge */}
        <div className="apple-glass-dark rounded-2xl p-6 sm:p-7 text-white mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[#E7D5BC] text-[11px] font-medium tracking-wide mb-2 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B5532E]" />
              <span>Limited Allocations</span>
            </div>
            <h2 className="apple-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
              Limited-Time Flash Deals
            </h2>
            <p className="apple-subhead text-xs sm:text-sm text-white/70 mt-1 font-normal">
              Direct manufacturer discounts on authentic smartphones, audio, and hardware.
            </p>
          </div>
          
          {/* Minimalist Countdown Clock */}
          <div className="flex items-center gap-3 bg-white/[0.07] px-4 py-2.5 rounded-xl border border-white/10 backdrop-blur-md">
            <span className="text-white/60 uppercase text-[10px] font-medium tracking-wider">
              Ends In
            </span>
            <div className="flex items-center gap-1 font-mono text-white text-sm font-semibold">
              <span className="bg-black/30 px-2 py-1 rounded text-white/95">{hrs}</span>
              <span className="text-white/40">:</span>
              <span className="bg-black/30 px-2 py-1 rounded text-white/95">{mins}</span>
              <span className="text-white/40">:</span>
              <span className="bg-black/30 px-2 py-1 rounded text-[#D9A441]">{secs}</span>
            </div>
          </div>
        </div>

        {/* Deal Cards Grid with Spring Physics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => {
            const inWishlist = wishlist.includes(item.id);
            return (
              <motion.div
                key={item.id}
                id={`product-card-${item.id}`}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                className="group bg-white rounded-2xl border border-[#EAE3D9] hover:border-[#B5532E]/40 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div
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
                    <span className="absolute top-3 left-3 bg-[#1D1917] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full tracking-wide">
                      -{item.discountPercent}%
                    </span>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        const visualEl = document.getElementById(`product-visual-${item.id}`) || e.currentTarget;
                        onToggleWishlist(item.id, visualEl);
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
                    
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-base font-bold text-[#B5532E] tracking-tight">
                        {formatPrice(item.priceNgn, item.priceUsd)}
                      </span>
                      {item.oldPriceNgn && (
                        <span className="text-xs text-[#78716C] line-through font-normal">
                          {formatPrice(item.oldPriceNgn, item.oldPriceUsd)}
                        </span>
                      )}
                    </div>

                    {/* Subtle Allocation Bar */}
                    <div className="w-full bg-[#EAE3D9]/60 rounded-full h-1.5 mb-1.5 overflow-hidden">
                      <div
                        className="bg-[#B5532E] h-1.5 rounded-full"
                        style={{ width: `${item.claimedPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-[#78716C] font-medium block">
                      {item.claimedPercent}% claimed
                    </span>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={(e) => {
                      const visualEl = document.getElementById(`product-visual-${item.id}`) || e.currentTarget;
                      onAddToCart(item, visualEl);
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#B5532E] hover:bg-[#A04523] text-white text-xs font-semibold flex items-center justify-center gap-1.5 border-0 cursor-pointer apple-pressable transition-colors shadow-xs"
                  >
                    <i className="fas fa-bag-shopping text-xs opacity-80" />
                    <span>Claim Deal</span>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
