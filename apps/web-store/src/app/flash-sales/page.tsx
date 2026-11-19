'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#2A2320]">
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
        
        {/* Flash Sale Hero Banner */}
        <div className="bg-gradient-to-r from-[#2A2320] via-[#8F3B1F] to-[#2A2320] text-white py-14 sm:py-16 border-b border-[#E7D5BC]/30">
          <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#D9A441] text-xs font-bold mb-4 border border-white/20">
                <span>Limited Time Offers • Verified Merchant Stock</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black font-display text-white mb-3">
                MARKETSQUARE Flash Deals
              </h1>
              <p className="text-sm sm:text-base text-[#F6EDE0]/80 leading-relaxed max-w-xl">
                Grab verified flagship technology, studio sound, and designer craftsmanship at discounted promotional prices before the clock resets.
              </p>
            </div>

            {/* Countdown Clock */}
            <div className="bg-black/40 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-center flex-shrink-0 shadow-2xl">
              <span className="text-[11px] uppercase font-bold tracking-wider text-[#D9A441] block mb-2">
                Lightning Deals Expire In
              </span>
              <div className="flex items-center gap-2.5 font-mono text-2xl sm:text-3xl font-black text-white">
                <div className="bg-white/10 px-3.5 py-2.5 rounded-2xl min-w-[55px] text-center">
                  <span>{formatDigit(timeLeft.hours)}</span>
                  <span className="block text-[8px] font-sans font-bold text-[#E7D5BC]/70 mt-0.5">HOURS</span>
                </div>
                <span>:</span>
                <div className="bg-white/10 px-3.5 py-2.5 rounded-2xl min-w-[55px] text-center">
                  <span>{formatDigit(timeLeft.minutes)}</span>
                  <span className="block text-[8px] font-sans font-bold text-[#E7D5BC]/70 mt-0.5">MINS</span>
                </div>
                <span>:</span>
                <div className="bg-white/10 px-3.5 py-2.5 rounded-2xl min-w-[55px] text-center">
                  <span className="text-[#D9A441]">{formatDigit(timeLeft.seconds)}</span>
                  <span className="block text-[8px] font-sans font-bold text-[#D9A441]/80 mt-0.5">SECS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deals Container */}
        <div className="container mx-auto px-4 lg:px-8 py-10 sm:py-14">
          
          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
            {[
              { id: 'all', label: 'All Flash Deals' },
              { id: 'computing', label: 'Phones & Computing' },
              { id: 'electronics', label: 'Audio & Gadgets' },
              { id: 'home', label: 'Home Appliances' },
              { id: 'fashion', label: 'Streetwear & Leather' },
              { id: 'digital', label: 'Digital Assets' },
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setActiveCategory(chip.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border ${
                  activeCategory === chip.id
                    ? 'bg-[#B5532E] text-white border-[#B5532E] shadow-xs'
                    : 'bg-white text-[#2A2320] border-[#E7D5BC] hover:border-[#B5532E]/40'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Deals Grid */}
          {filteredDeals.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#E7D5BC] p-8 shadow-2xs max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#E7D5BC] text-[#8C8279] flex items-center justify-center text-2xl mx-auto mb-4">
                <i className="fas fa-bolt text-[#D9A441]"></i>
              </div>
              <h4 className="font-black text-[#2A2320] text-lg mb-2">No Active Flash Deals</h4>
              <p className="text-xs text-[#8C8279] mb-6 leading-relaxed">
                There are no limited-time promotional deals running right now. Explore the marketplace or check back soon!
              </p>
              <Link
                href="/shop"
                className="px-6 py-2.5 bg-[#B5532E] hover:bg-[#8F3B1F] text-white text-xs font-bold rounded-xl shadow-xs transition inline-flex items-center gap-2"
              >
                <span>Browse All Products</span>
                <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredDeals.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-[#E7D5BC] hover:border-[#B5532E]/40 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div
                    id={`flash-visual-${item.id}`}
                    className="relative aspect-square overflow-hidden bg-[#FAF6F0]"
                  >
                    <Link href={`/product/${item.id}`} className="block w-full h-full">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                    <span className="absolute top-2.5 left-2.5 bg-[#B3261E] text-white font-black text-xs px-2.5 py-0.5 rounded-full shadow-xs">
                      -{item.discountPercent}% OFF
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-[#8C8279] font-medium block mb-1 truncate">
                        {item.storeName}
                      </span>
                      <Link
                        href={`/product/${item.id}`}
                        className="font-bold text-xs sm:text-sm text-[#2A2320] hover:text-[#B5532E] transition-colors line-clamp-2 leading-snug mb-2 block"
                      >
                        {item.title}
                      </Link>
                    </div>

                    <div className="space-y-3 pt-2">
                      {/* Progress Claimed */}
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-[#8C8279] mb-1 font-bold">
                          <span>{item.claimedPercent}% Claimed</span>
                          <span className="text-[#B3261E]">Limited Stock</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#FAF6F0] rounded-full overflow-hidden border border-[#E7D5BC]/60">
                          <div
                            className="h-full bg-gradient-to-r from-[#D9A441] to-[#B3261E] rounded-full"
                            style={{ width: `${item.claimedPercent}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-base sm:text-lg font-black text-[#B5532E]">
                          {formatPrice(item.priceNgn, item.priceUsd)}
                        </span>
                        {item.oldPriceNgn && (
                          <span className="text-xs text-[#8C8279] line-through font-medium">
                            {formatPrice(item.oldPriceNgn, item.oldPriceUsd || 0)}
                          </span>
                        )}
                      </div>

                      {/* CTA */}
                      <button
                        type="button"
                        onClick={(e) => {
                          const btn = e.currentTarget;
                          btn.classList.add('scale-95');
                          setTimeout(() => btn.classList.remove('scale-95'), 150);
                          const visualEl = document.getElementById(`flash-visual-${item.id}`) || btn;
                          addToCart(item, 1, visualEl);
                        }}
                        className="w-full py-2.5 rounded-xl bg-[#B5532E] hover:bg-[#8F3B1F] text-white text-xs font-bold transition-all border-0 cursor-pointer shadow-2xs flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <span>Claim Deal</span>
                      </button>
                    </div>
                  </div>
                </div>
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
