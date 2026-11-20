'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

interface FlashItem {
  id: string;
  title: string;
  category: string;
  priceNgn: number;
  oldPriceNgn?: number;
  priceUsd: number;
  oldPriceUsd?: number;
  image: string;
  rating: number;
  reviewsCount: number;
  claimedPercent: number;
  discountPercent: number;
  storeName: string;
}

export default function FlashSalesPage() {
  const router = useRouter();
  const {
    currency,
    formatPrice,
    addToCart,
    cartCount,
    wishlistCount,
    toggleCurrency,
  } = useStore();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 42, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 8, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [items, setItems] = useState<FlashItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.items && Array.isArray(data.items)) {
          const deals: FlashItem[] = data.items
            .filter((p: any) => p.oldPriceNgn && p.oldPriceNgn > p.priceNgn)
            .map((p: any) => ({
              id: p.id,
              title: p.title,
              category: p.category,
              priceNgn: p.priceNgn,
              oldPriceNgn: p.oldPriceNgn,
              priceUsd: p.priceUsd,
              oldPriceUsd: p.oldPriceUsd,
              image: p.image,
              rating: p.rating,
              reviewsCount: p.reviewsCount,
              claimedPercent: 75,
              discountPercent: Math.round(((p.oldPriceNgn - p.priceNgn) / p.oldPriceNgn) * 100),
              storeName: p.storeName,
            }));
          setItems(deals);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatDigit = (num: number) => String(num).padStart(2, '0');

  const filteredDeals =
    activeCategory === 'all'
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1D1917]">
      <Header
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onOpenCart={() => router.push('/cart')}
        onOpenWishlist={() => router.push('/wishlist')}
        onOpenTrackOrder={() => router.push('/track-order')}
        onSelectCategory={(cat) => router.push(`/shop?category=${cat}`)}
        searchQuery=""
        onSearchChange={(q) => router.push(`/shop?q=${encodeURIComponent(q)}`)}
        currency={currency}
        onToggleCurrency={toggleCurrency}
      />

      <main className="flex-1">
        
        {/* Flash Sale Hero Banner: Apple Dark Finish */}
        <div className="bg-[#1A1513] text-white py-14 sm:py-18 border-b border-black/30">
          <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#E7D5BC] text-xs font-semibold mb-3.5 border border-white/15">
                <span>Limited Allocations • Direct Verified Stock</span>
              </div>
              <h1 className="apple-heading text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
                Limited Flash Deals
              </h1>
              <p className="apple-subhead text-sm sm:text-base text-white/70 leading-relaxed max-w-xl font-normal">
                Authentic flagship technology, studio sound, and designer goods at direct promotional discounts before allocations expire.
              </p>
            </div>

            {/* Apple Countdown Clock */}
            <div className="apple-glass-dark p-6 sm:p-7 rounded-3xl text-center flex-shrink-0 shadow-xl border border-white/15">
              <span className="text-[11px] uppercase font-semibold tracking-wider text-[#E7D5BC] block mb-2.5">
                Deals Expire In
              </span>
              <div className="flex items-center gap-2 font-mono text-2xl sm:text-3xl font-bold text-white">
                <div className="bg-white/10 px-3.5 py-2 rounded-2xl min-w-[55px] text-center border border-white/10">
                  <span>{formatDigit(timeLeft.hours)}</span>
                  <span className="block text-[8px] font-sans font-semibold text-white/60 mt-0.5">HOURS</span>
                </div>
                <span className="text-white/40">:</span>
                <div className="bg-white/10 px-3.5 py-2 rounded-2xl min-w-[55px] text-center border border-white/10">
                  <span>{formatDigit(timeLeft.minutes)}</span>
                  <span className="block text-[8px] font-sans font-semibold text-white/60 mt-0.5">MINS</span>
                </div>
                <span className="text-white/40">:</span>
                <div className="bg-white/10 px-3.5 py-2 rounded-2xl min-w-[55px] text-center border border-white/10">
                  <span className="text-[#D9A441]">{formatDigit(timeLeft.seconds)}</span>
                  <span className="block text-[8px] font-sans font-semibold text-[#D9A441] mt-0.5">SECS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deals Container */}
        <div className="container mx-auto px-4 lg:px-8 py-10 sm:py-14">
          
          {/* Category Filter Chips with Spring Feedback */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
            {[
              { id: 'all', label: 'All Flash Deals' },
              { id: 'computing', label: 'Phones & Computing' },
              { id: 'electronics', label: 'Audio & Gadgets' },
              { id: 'home', label: 'Home Appliances' },
              { id: 'fashion', label: 'Streetwear & Lifestyle' },
              { id: 'digital', label: 'Digital Licenses' },
            ].map((chip) => {
              const isSelected = activeCategory === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setActiveCategory(chip.id)}
                  className={`relative px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors duration-150 cursor-pointer border-0 apple-pressable z-10 ${
                    isSelected ? 'text-white' : 'text-[#1D1917] hover:text-[#B5532E]'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="flashSalesCategoryPill"
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.28 }}
                      className="absolute inset-0 bg-[#B5532E] rounded-xl shadow-xs -z-10"
                    />
                  )}
                  {!isSelected && (
                    <div className="absolute inset-0 bg-white border border-[#EAE3D9] rounded-xl shadow-xs -z-10" />
                  )}
                  {chip.label}
                </button>
              );
            })}
          </div>

          {/* Deals Grid */}
          {filteredDeals.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#EAE3D9] p-8 shadow-xs max-w-xl mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D9] text-[#78716C] flex items-center justify-center text-xl mx-auto mb-4">
                <i className="fas fa-bolt text-[#D9A441]"></i>
              </div>
              <h4 className="apple-heading font-bold text-[#1D1917] text-lg mb-2">No Active Flash Deals</h4>
              <p className="text-xs text-[#78716C] mb-6 leading-relaxed">
                There are no limited-time promotional deals running right now in this department. Explore the catalog or check back shortly.
              </p>
              <Link
                href="/shop"
                className="px-6 py-2.5 bg-[#B5532E] hover:bg-[#A04523] text-white text-xs font-semibold rounded-xl shadow-xs transition inline-flex items-center gap-2 no-underline apple-pressable"
              >
                <span>Browse Catalog</span>
                <i className="fas fa-arrow-right text-[10px] opacity-75"></i>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredDeals.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -3 }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
                  className="bg-white rounded-2xl border border-[#EAE3D9] hover:border-[#B5532E]/40 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] flex flex-col justify-between group"
                >
                  <div
                    id={`flash-visual-${item.id}`}
                    className="relative aspect-square overflow-hidden bg-[#F5F2EC]"
                  >
                    <Link href={`/product/${item.id}`} className="block w-full h-full">
                      <motion.img
                        src={item.image}
                        alt={item.title}
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.22 }}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <span className="absolute top-2.5 left-2.5 bg-[#1D1917]/90 text-white font-semibold text-[10px] px-2.5 py-0.5 rounded-full shadow-xs tracking-wide">
                      -{item.discountPercent}% OFF
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-[#78716C] font-normal block mb-1 truncate">
                        {item.storeName}
                      </span>
                      <Link
                        href={`/product/${item.id}`}
                        className="font-medium text-xs sm:text-sm text-[#1D1917] hover:text-[#B5532E] transition-colors line-clamp-2 leading-snug mb-2 block no-underline"
                      >
                        {item.title}
                      </Link>
                    </div>

                    <div className="space-y-3 pt-2">
                      {/* Progress Claimed */}
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-[#78716C] mb-1 font-medium">
                          <span>{item.claimedPercent}% Claimed</span>
                          <span className="text-[#B5532E]">Limited</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#FAF7F2] rounded-full overflow-hidden border border-[#EAE3D9]">
                          <div
                            className="h-full bg-[#B5532E] rounded-full"
                            style={{ width: `${item.claimedPercent}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-base sm:text-lg font-bold text-[#B5532E] tracking-tight">
                          {formatPrice(item.priceNgn, item.priceUsd)}
                        </span>
                        {item.oldPriceNgn && (
                          <span className="text-xs text-[#78716C] line-through font-normal">
                            {formatPrice(item.oldPriceNgn, item.oldPriceUsd || 0)}
                          </span>
                        )}
                      </div>

                      {/* CTA with Tactile Response */}
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.97 }}
                        onClick={(e) => {
                          const visualEl = document.getElementById(`flash-visual-${item.id}`) || e.currentTarget;
                          addToCart(item, 1, visualEl);
                        }}
                        className="w-full py-2.5 rounded-xl bg-[#B5532E] hover:bg-[#A04523] text-white text-xs font-semibold transition-colors border-0 cursor-pointer shadow-xs flex items-center justify-center gap-1.5 apple-pressable"
                      >
                        <i className="fas fa-bag-shopping text-xs opacity-75"></i>
                        <span>Claim Deal</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

        </div>

      </main>

      <Footer
        onOpenCart={() => router.push('/cart')}
        onOpenWishlist={() => router.push('/wishlist')}
        onOpenTrackOrder={() => router.push('/track-order')}
        onSelectCategory={(cat) => router.push(`/shop?category=${cat}`)}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
      />
    </div>
  );
}
