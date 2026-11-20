'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

const OFFICIAL_BRANDS = [
  {
    name: 'Apple',
    query: 'Apple',
    tagline: 'Premium iPhone, MacBook, iPad, and AppleCare accessories.',
    badge: 'Authorized Reseller Nigeria',
    warranty: '1 Year International Warranty',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    icon: 'fa-apple',
  },
  {
    name: 'Samsung',
    query: 'Samsung',
    tagline: 'Flagship Galaxy smartphones, ultra-wide monitors, and displays.',
    badge: 'Direct Factory Authorized Store',
    warranty: '24 Months Official Warranty',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
    icon: 'fa-mobile-screen',
  },
  {
    name: 'Sony Audio',
    query: 'Sony',
    tagline: 'Industry-leading Active Noise Cancellation headphones and soundbars.',
    badge: 'Official Audio Partner',
    warranty: '1 Year Official Sony Warranty',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    icon: 'fa-headphones',
  },
  {
    name: "De'Longhi",
    query: "De'Longhi",
    tagline: 'Barista-grade espresso machines and automatic coffee systems.',
    badge: 'Official Distributor',
    warranty: '2 Year Manufacturer Guarantee',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
    icon: 'fa-mug-hot',
  },
  {
    name: 'Logitech',
    query: 'Logitech',
    tagline: 'MX Master ergonomic mice, mechanical keyboards, and 4K webcams.',
    badge: 'Authorized Hardware Partner',
    warranty: '2 Years Replacement Warranty',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    icon: 'fa-laptop',
  },
  {
    name: 'Manga Signature',
    query: 'Manga Signature',
    tagline: 'Handcrafted Kano vegetable-tanned leather bags and premium goods.',
    badge: 'Master Artisan Guild',
    warranty: 'Lifetime Craftsmanship Guarantee',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    icon: 'fa-bag-shopping',
  },
];

export default function OfficialStoresPage() {
  const router = useRouter();
  const {
    currency,
    cartCount,
    wishlistCount,
    toggleCurrency,
  } = useStore();

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
        
        {/* Hero Section: Apple Dark Surface */}
        <div className="bg-[#1A1513] text-white py-14 sm:py-18 border-b border-black/30">
          <div className="container mx-auto px-4 lg:px-8 text-center max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#E7D5BC] text-xs font-semibold mb-3.5 border border-white/15">
              <i className="fas fa-circle-check text-[#4F6B3A]"></i>
              <span>100% Authentic Guarantee</span>
            </div>
            <h1 className="apple-heading text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
              Official Brand Mall
            </h1>
            <p className="apple-subhead text-sm sm:text-base text-white/70 leading-relaxed max-w-2xl mx-auto font-normal">
              Direct distribution from manufacturer-certified authorized partners. Backed by genuine manufacturer warranty, tamper-proof packaging, and escrow protection.
            </p>
          </div>
        </div>

        {/* Brand Grid Container */}
        <div className="container mx-auto px-4 lg:px-8 py-12 sm:py-16">
          
          <div className="flex items-center justify-between pb-4 border-b border-[#EAE3D9] mb-8">
            <div>
              <h2 className="apple-heading text-xl sm:text-2xl font-bold text-[#1D1917] tracking-tight">
                Authorized Brand Stores
              </h2>
              <p className="apple-subhead text-xs text-[#78716C] mt-0.5 font-normal">Explore brand catalogs and official warranty terms</p>
            </div>
            <Link
              href="/shop"
              className="text-xs font-semibold text-[#B5532E] hover:text-[#8F3B1F] no-underline"
            >
              Browse Catalog →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {OFFICIAL_BRANDS.map((brand) => (
              <motion.div
                key={brand.name}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                className="bg-white rounded-3xl border border-[#EAE3D9] hover:border-[#B5532E]/40 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[16/9] overflow-hidden bg-[#F5F2EC]">
                    <motion.img
                      src={brand.image}
                      alt={brand.name}
                      whileHover={{ scale: 1.04 }}
                      transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"></div>
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#E7D5BC] block">
                        {brand.badge}
                      </span>
                      <h3 className="apple-heading font-bold text-lg text-white">{brand.name}</h3>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <p className="text-xs text-[#78716C] leading-relaxed font-normal">
                      {brand.tagline}
                    </p>

                    <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE3D9] flex items-center gap-2 text-xs text-[#4F6B3A] font-semibold">
                      <i className="fas fa-shield-halved text-xs"></i>
                      <span className="text-[11px]">{brand.warranty}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href={`/shop?q=${encodeURIComponent(brand.query)}`}
                    className="w-full py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#B5532E] text-[#1D1917] hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-[#EAE3D9] group-hover:border-[#B5532E] no-underline apple-pressable"
                  >
                    <span>Visit {brand.name} Store</span>
                    <i className="fas fa-arrow-right text-[10px] opacity-75"></i>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Value Strip */}
          <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-white border border-[#E7D5BC] grid sm:grid-cols-3 gap-6 text-center">
            <div className="space-y-1">
              <div className="w-10 h-10 rounded-xl bg-[#4F6B3A]/15 text-[#4F6B3A] flex items-center justify-center mx-auto text-lg mb-2">
                <i className="fas fa-circle-check"></i>
              </div>
              <h4 className="font-display font-bold text-sm text-[#2A2320]">100% Genuine Guaranteed</h4>
              <p className="text-xs text-[#8C8279]">Sourced directly from authorized brand importers.</p>
            </div>

            <div className="space-y-1">
              <div className="w-10 h-10 rounded-xl bg-[#D9A441]/15 text-[#D9A441] flex items-center justify-center mx-auto text-lg mb-2">
                <i className="fas fa-shield-halved"></i>
              </div>
              <h4 className="font-display font-bold text-sm text-[#2A2320]">Official Warranty</h4>
              <p className="text-xs text-[#8C8279]">Backed by nationwide authorized service centers.</p>
            </div>

            <div className="space-y-1">
              <div className="w-10 h-10 rounded-xl bg-[#3E5C76]/15 text-[#3E5C76] flex items-center justify-center mx-auto text-lg mb-2">
                <i className="fas fa-rotate-left"></i>
              </div>
              <h4 className="font-display font-bold text-sm text-[#2A2320]">7-Day Hassle-Free Returns</h4>
              <p className="text-xs text-[#8C8279]">Return or replacement if defective upon delivery.</p>
            </div>
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
