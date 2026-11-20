'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

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
  // Direct manipulation & subtle interactive tilt for the spotlight card (WWDC 2018 Fluid Interfaces)
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);

  // Critically damped springs (damping 1.0, response 0.35s) for Apple fluid feel
  const springX = useSpring(cardX, { damping: 24, stiffness: 220 });
  const springY = useSpring(cardY, { damping: 24, stiffness: 220 });

  const rotateX = useTransform(springY, [-80, 80], [6, -6]);
  const rotateY = useTransform(springX, [-80, 80], [-6, 6]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    cardX.set(e.clientX - centerX);
    cardY.set(e.clientY - centerY);
  };

  const handlePointerLeave = () => {
    cardX.set(0);
    cardY.set(0);
  };

  return (
    <section className="relative bg-[#1A1513] text-white py-16 sm:py-20 lg:py-24 overflow-hidden border-b border-black/30">
      {/* Refined optical ambient surface (not decorative AI blur blobs) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% -15%, rgba(181, 83, 46, 0.28), rgba(26, 21, 19, 0) 80%)',
        }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Column: Apple Typographic Rigor */}
          <div className="lg:col-span-7 text-center lg:text-left">
            
            {/* Subtle Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] border border-white/10 text-[#E7D5BC] text-xs font-medium tracking-wide mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B5532E]" />
              <span>Verified Commerce • Nationwide Dispatch</span>
            </div>
            
            {/* Hero Heading: High contrast, negative optical tracking, tight leading */}
            <h1 className="apple-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.03em] text-white mb-6 leading-[1.06]">
              Authentic goods.<br />
              <span className="text-[#E7D5BC]">Guaranteed from source.</span>
            </h1>
            
            {/* Editorial Subcopy */}
            <p className="apple-subhead text-base sm:text-lg text-white/75 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-9 font-normal">
              Direct access to genuine computing, consumer audio, living essentials, and production digital assets from verified merchants. Protected by full escrow.
            </p>

            {/* Interactive Spring CTA Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <motion.button
                type="button"
                onClick={onExploreClick}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#B5532E] hover:bg-[#A04523] text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 border-0 cursor-pointer apple-pressable"
              >
                <span>Explore Catalog</span>
                <i className="fas fa-arrow-right text-xs opacity-80" />
              </motion.button>
              
              <motion.button
                type="button"
                onClick={onFlashDealsClick}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/15 text-white/90 font-medium text-sm backdrop-blur-sm flex items-center justify-center gap-2 cursor-pointer apple-pressable"
              >
                <span>Today's Limited Deals</span>
              </motion.button>
            </div>

            {/* Micro Trust Hierarchy: Clean, rhythmic layout */}
            <div className="mt-12 pt-7 border-t border-white/10 grid grid-cols-3 gap-6 text-center lg:text-left">
              <div>
                <div className="text-xl sm:text-2xl font-bold tracking-tight text-white">100%</div>
                <div className="text-[11px] text-white/55 font-medium mt-0.5">Authentic Verification</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold tracking-tight text-white">Same-Day</div>
                <div className="text-[11px] text-white/55 font-medium mt-0.5">Kaduna Metro Dispatch</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold tracking-tight text-white">Escrow</div>
                <div className="text-[11px] text-white/55 font-medium mt-0.5">Buyer Purchase Shield</div>
              </div>
            </div>

          </div>

          {/* Right Hero Spotlight: Layered Translucent Apple Glass Card */}
          <div className="lg:col-span-5 relative perspective-1000">
            <motion.div
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }}
              whileTap={{ scale: 0.985 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
              className="relative mx-auto max-w-md cursor-grab active:cursor-grabbing select-none"
            >
              <div className="apple-glass-dark rounded-3xl p-6 sm:p-7 relative overflow-hidden">
                {/* Top Material Specular Edge */}
                <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#B5532E] text-white flex items-center justify-center font-bold text-base shadow-inner">
                      M
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-white tracking-tight">MANGA MARKETSQUARE</h3>
                      <p className="text-[11px] text-white/55">Direct Verified Merchant Hub</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-[11px] font-medium border border-emerald-500/25 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Verified Active
                  </span>
                </div>

                {/* Layered functional list with tactile depth */}
                <div className="space-y-2.5 text-xs mb-6">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/80">
                    <span className="flex items-center gap-2.5 text-white/90">
                      <i className="fas fa-shield-halved text-[#D9A441] text-xs" />
                      <span>Buyer Escrow Protection</span>
                    </span>
                    <span className="text-white/60 font-medium text-[11px]">Protected</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/80">
                    <span className="flex items-center gap-2.5 text-white/90">
                      <i className="fas fa-truck-fast text-[#D9A441] text-xs" />
                      <span>Express Courier Dispatch</span>
                    </span>
                    <span className="text-white/60 font-medium text-[11px]">Nationwide</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/80">
                    <span className="flex items-center gap-2.5 text-white/90">
                      <i className="fas fa-certificate text-[#D9A441] text-xs" />
                      <span>Authorized Brand Direct</span>
                    </span>
                    <span className="text-white/60 font-medium text-[11px]">100% Genuine</span>
                  </div>
                </div>

                {/* Sub-action */}
                <div className="pt-1">
                  <Link
                    href="/sell"
                    className="w-full py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors apple-pressable no-underline"
                  >
                    <i className="fas fa-store text-xs opacity-75" />
                    <span>Become a Merchant Partner</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
