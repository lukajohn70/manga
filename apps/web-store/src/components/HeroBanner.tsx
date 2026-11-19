'use client';

import * as React from 'react';
import Link from 'next/link';

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

          {/* Right Hero Visual Spotlight: Marketplace Guarantee Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              <div
                className="block rounded-3xl bg-[#1A1512]/90 backdrop-blur-xl border border-[#D9A441]/40 p-6 sm:p-7 shadow-2xl relative"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#B5532E] text-white flex items-center justify-center font-black text-lg">
                      M
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">MANGA MARKETSQUARE</h4>
                      <p className="text-[11px] text-[#D9A441]">Multi-Vendor Commerce Hub</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    Live Verified
                  </span>
                </div>

                <div className="space-y-3 text-xs mb-6">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-[#E7D5BC]">
                    <span className="flex items-center gap-2">
                      <i className="fas fa-shield-halved text-[#D9A441]"></i> Buyer Escrow Protection
                    </span>
                    <span className="text-white font-bold">100% Guaranteed</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-[#E7D5BC]">
                    <span className="flex items-center gap-2">
                      <i className="fas fa-truck-fast text-[#D9A441]"></i> Manga Express Delivery
                    </span>
                    <span className="text-white font-bold">Same-Day Kaduna</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-[#E7D5BC]">
                    <span className="flex items-center gap-2">
                      <i className="fas fa-store text-[#D9A441]"></i> Verified Merchant Stores
                    </span>
                    <span className="text-white font-bold">Nationwide</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/sell"
                    className="w-full py-3 rounded-xl bg-[#B5532E] hover:bg-[#8F3B1F] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <i className="fas fa-shop"></i>
                    <span>Become a Merchant Partner</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
