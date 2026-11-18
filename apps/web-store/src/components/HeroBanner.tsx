'use client';

import * as React from 'react';

export interface HeroBannerProps {
  onExploreClick: () => void;
  onFlashDealsClick: () => void;
  onSelectFeatured: () => void;
  currency: 'NGN' | 'USD';
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreClick,
  onFlashDealsClick,
  onSelectFeatured,
  currency,
}) => {
  return (
    <section className="relative bg-gradient-to-br from-[#2A2320] via-[#8F3B1F] to-[#2A2320] text-white py-12 sm:py-16 lg:py-20 overflow-hidden">
      {/* Glowing ambient earth accents in Manga Terracotta & Ochre */}
      <div className="pointer-events-none absolute -top-40 -right-20 w-96 h-96 bg-[#B5532E]/30 rounded-full blur-3xl"></div>
      <div className="pointer-events-none absolute -bottom-40 -left-20 w-96 h-96 bg-[#D9A441]/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#D9A441] text-xs font-bold mb-6">
              <span className="w-2 h-2 rounded-full bg-[#B5532E] animate-ping"></span>
              <span>Nigeria & Global Multi-Category Marketplace</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white mb-6 leading-tight">
              Everything you need.<br />
              <span className="bg-gradient-to-r from-white via-[#F6EDE0] to-[#D9A441] bg-clip-text text-transparent">
                One authentic marketplace.
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-[#F6EDE0]/90 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8 font-normal">
              Shop genuine smartphones, laptops, audio, fashion, and home goods — all from verified sellers. Same-day delivery available for orders within Kaduna.
            </p>

            {/* CTA Buttons in Manga Terracotta #B5532E */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                type="button"
                onClick={onExploreClick}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#B5532E] hover:bg-[#8F3B1F] text-white font-bold text-sm shadow-xl hover:scale-105 transition-all text-center flex items-center justify-center gap-2 border-0 cursor-pointer"
              >
                <span>Explore All Departments</span>
                <i className="fas fa-arrow-right text-xs"></i>
              </button>
              <button
                type="button"
                onClick={onFlashDealsClick}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-[#F6EDE0] font-bold text-sm backdrop-blur-sm transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Today's Flash Deals</span>
              </button>
            </div>

            {/* Micro Trust Signals */}
            <div className="mt-10 pt-8 border-t border-white/15 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">100%</div>
                <div className="text-[11px] text-[#E7D5BC] font-medium">Genuine Brands</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#D9A441]">24 - 48 Hrs</div>
                <div className="text-[11px] text-[#E7D5BC] font-medium">Express Nationwide</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#F6EDE0]">7 Days</div>
                <div className="text-[11px] text-[#E7D5BC] font-medium">Hassle-Free Returns</div>
              </div>
            </div>

          </div>

          {/* Right Hero Visual Spotlight */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              <div
                onClick={onSelectFeatured}
                className="block rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 shadow-2xl hover:border-white/40 transition-all duration-300 group cursor-pointer"
              >
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-4 bg-[#1E1815]">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85"
                    alt="Sony WH-1000XM5 Noise Cancelling Headphones"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-[#B5532E] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Featured Spotlight
                  </span>
                  <span className="absolute top-3 right-3 bg-[#2A2320] text-[#D9A441] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-[#D9A441]/30">
                    Manga Express
                  </span>
                </div>
                <div className="flex items-center justify-between text-white">
                  <div className="pr-3">
                    <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-[#D9A441] transition-colors">
                      Sony WH-1000XM5 Wireless ANC Headphones
                    </h4>
                    <p className="text-xs text-[#E7D5BC] line-clamp-1">Flagship Audio • Official Sony Store</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-base font-black text-[#D9A441]">
                      {currency === 'NGN' ? '₦450,000' : '$320'}
                    </span>
                    <span className="block text-[11px] text-[#E7D5BC]/70 line-through">
                      {currency === 'NGN' ? '₦580,000' : '$399'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
