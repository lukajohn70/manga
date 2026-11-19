'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '../../context/StoreContext';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

const FLASH_ITEMS = [
  {
    id: '66666666-6666-6666-6666-666666666661',
    title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    category: 'electronics',
    priceNgn: 450000,
    oldPriceNgn: 580000,
    priceUsd: 320,
    oldPriceUsd: 399,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
    rating: 4.9,
    reviewsCount: 384,
    claimedPercent: 78,
    discountPercent: 22,
    storeName: 'Sony Audio Official Store',
  },
  {
    id: 'prod-logitech-mx3s',
    title: 'Logitech MX Master 3S Ergonomic Wireless Mouse',
    category: 'computing',
    priceNgn: 135000,
    oldPriceNgn: 175000,
    priceUsd: 95,
    oldPriceUsd: 119,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=85',
    rating: 4.8,
    reviewsCount: 220,
    claimedPercent: 64,
    discountPercent: 23,
    storeName: 'Alpha Hardware Solutions',
  },
  {
    id: '66666666-6666-6666-6666-666666666664',
    title: "De'Longhi Dedica Deluxe Slim Espresso Machine",
    category: 'home',
    priceNgn: 320000,
    oldPriceNgn: 390000,
    priceUsd: 225,
    oldPriceUsd: 275,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=900&q=85',
    rating: 4.9,
    reviewsCount: 64,
    claimedPercent: 88,
    discountPercent: 18,
    storeName: "De'Longhi Official Store",
  },
  {
    id: '66666666-6666-6666-6666-666666666665',
    title: 'Handcrafted Kano Vegetable-Tanned Leather Travel Rucksack',
    category: 'fashion',
    priceNgn: 165000,
    oldPriceNgn: 210000,
    priceUsd: 115,
    oldPriceUsd: 150,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85',
    rating: 4.9,
    reviewsCount: 73,
    claimedPercent: 55,
    discountPercent: 21,
    storeName: 'Manga Signature Workshop',
  },
  {
    id: '66666666-6666-6666-6666-666666666662',
    title: 'Samsung Galaxy S24 Ultra 512GB Titanium Black with S-Pen & AI',
    category: 'computing',
    priceNgn: 1850000,
    oldPriceNgn: 2100000,
    priceUsd: 1290,
    oldPriceUsd: 1450,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=900&q=85',
    rating: 4.8,
    reviewsCount: 96,
    claimedPercent: 92,
    discountPercent: 12,
    storeName: 'Samsung Nigeria Official',
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    title: 'SaaS UI Design System & Figma Pro Kit (400+ Components)',
    category: 'digital',
    priceNgn: 45000,
    oldPriceNgn: 70000,
    priceUsd: 32,
    oldPriceUsd: 50,
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=900&q=85',
    rating: 5.0,
    reviewsCount: 167,
    claimedPercent: 82,
    discountPercent: 36,
    storeName: 'DesignCraft Labs',
  },
];

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

  const formatDigit = (num: number) => String(num).padStart(2, '0');

  const filteredDeals =
    activeCategory === 'all'
      ? FLASH_ITEMS
      : FLASH_ITEMS.filter((item) => item.category === activeCategory);

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
                      <span className="text-xs text-[#8C8279] line-through font-medium">
                        {formatPrice(item.oldPriceNgn, item.oldPriceUsd)}
                      </span>
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
