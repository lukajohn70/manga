'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';

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
    <section className="py-12 sm:py-16 bg-[#FAF6F0] border-b border-[#E7D5BC]">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Flash Sale Header with Live Timer (Manga Terracotta to Laterite Gradient) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 bg-gradient-to-r from-[#B5532E] via-[#8F3B1F] to-[#2A2320] rounded-2xl text-white mb-8 shadow-lg">
          <div>
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/15 text-[#D9A441] text-[10px] font-black uppercase tracking-wider mb-1">
              Limited Time Offers
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-display text-white">Flash Sales & Limited Deals</h2>
            <p className="text-xs sm:text-sm text-[#F6EDE0]/85">Markdowns on authentic consumer electronics, hardware & fashion.</p>
          </div>
          
          {/* Countdown Timer Box */}
          <div className="flex items-center gap-2 text-xs font-bold bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
            <span className="text-[#E7D5BC] uppercase text-[10px]">Ends In:</span>
            <div className="flex items-center gap-1 font-mono text-white text-sm">
              <span className="bg-black/40 px-1.5 py-0.5 rounded text-[#D9A441]">{hrs}</span>:
              <span className="bg-black/40 px-1.5 py-0.5 rounded text-[#D9A441]">{mins}</span>:
              <span className="bg-black/40 px-1.5 py-0.5 rounded text-[#D9A441]">{secs}</span>
            </div>
          </div>
        </div>

        {/* Deal Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => {
            const inWishlist = wishlist.includes(item.id);
            return (
              <div
                key={item.id}
                id={`product-card-${item.id}`}
                className="group bg-white rounded-2xl border border-[#E7D5BC]/80 hover:border-[#B5532E]/40 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div
                    id={`product-visual-${item.id}`}
                    className="relative bg-gray-100 aspect-square overflow-hidden cursor-pointer"
                    onClick={() => onViewProduct(item)}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-[#B3261E] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase shadow-md">
                      -{item.discountPercent}% OFF
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const visualEl = document.getElementById(`product-visual-${item.id}`) || e.currentTarget;
                        onToggleWishlist(item.id, visualEl);
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
                      <span className="text-[#8C8279] text-[11px]">({item.reviewsCount})</span>
                    </div>
                    
                    <h3
                      onClick={() => onViewProduct(item)}
                      className="font-bold text-sm text-[#2A2320] line-clamp-2 mb-2 group-hover:text-[#B5532E] transition-colors cursor-pointer"
                    >
                      {item.title}
                    </h3>
                    
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-base font-black text-[#B5532E]">
                        {formatPrice(item.priceNgn, item.priceUsd)}
                      </span>
                      {item.oldPriceNgn && (
                        <span className="text-xs text-[#8C8279] line-through">
                          {formatPrice(item.oldPriceNgn, item.oldPriceUsd)}
                        </span>
                      )}
                    </div>

                    {/* Claimed Progress Bar */}
                    <div className="w-full bg-[#E7D5BC]/50 rounded-full h-2 mb-1.5 overflow-hidden">
                      <div
                        className="bg-[#B5532E] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.claimedPercent}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-[#8C8279] font-medium">
                      <span>{item.claimedPercent}% claimed</span>
                      <span className="text-[#4F6B3A] font-semibold">Fast selling</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      const btn = e.currentTarget;
                      btn.classList.add('scale-95');
                      setTimeout(() => btn.classList.remove('scale-95'), 150);
                      const visualEl = document.getElementById(`product-visual-${item.id}`) || btn;
                      onAddToCart(item, visualEl);
                    }}
                    className="w-full py-2.5 bg-[#FAF6F0] hover:bg-[#B5532E] text-[#2A2320] hover:text-white rounded-xl text-xs font-bold border border-[#E7D5BC] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-95"
                  >
                    <i className="fas fa-cart-plus"></i>
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
