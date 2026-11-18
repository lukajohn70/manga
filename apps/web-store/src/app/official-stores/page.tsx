'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
        
        {/* Hero Section */}
        <div className="bg-[#2A2320] text-white py-14 sm:py-16 border-b border-[#E7D5BC]/30">
          <div className="container mx-auto px-4 lg:px-8 text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#D9A441] text-xs font-bold mb-4 border border-white/20">
              <i className="fas fa-circle-check text-[#4F6B3A]"></i>
              <span>100% Authentic Guarantee</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-display text-white mb-3">
              MARKETSQUARE Official Mall
            </h1>
            <p className="text-sm sm:text-base text-[#F6EDE0]/80 leading-relaxed max-w-2xl mx-auto">
              Shop directly from manufacturer-certified authorized distributors. Every purchase is backed by genuine manufacturer warranty, tamper-proof packaging, and 100% verified seller guarantees.
            </p>
          </div>
        </div>

        {/* Brand Grid Container */}
        <div className="container mx-auto px-4 lg:px-8 py-12 sm:py-16">
          
          <div className="flex items-center justify-between pb-4 border-b border-[#E7D5BC] mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-display text-[#2A2320]">
                Authorized Brand Stores
              </h2>
              <p className="text-xs text-[#8C8279] mt-0.5">Explore brand catalogs and official warranty terms</p>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold text-[#B5532E] hover:underline"
            >
              Browse All Products →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {OFFICIAL_BRANDS.map((brand) => (
              <div
                key={brand.name}
                className="bg-white rounded-3xl border border-[#E7D5BC] hover:border-[#B5532E]/40 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[16/9] overflow-hidden bg-[#FAF6F0]">
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#D9A441] block">
                        {brand.badge}
                      </span>
                      <h3 className="font-display font-black text-lg text-white">{brand.name}</h3>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <p className="text-xs text-[#8C8279] leading-relaxed">
                      {brand.tagline}
                    </p>

                    <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#E7D5BC] flex items-center gap-2 text-xs text-[#4F6B3A] font-semibold">
                      <i className="fas fa-shield-halved text-xs"></i>
                      <span className="text-[11px]">{brand.warranty}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href={`/shop?q=${encodeURIComponent(brand.query)}`}
                    className="w-full py-2.5 rounded-xl bg-[#FAF6F0] hover:bg-[#B5532E] text-[#2A2320] hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-[#E7D5BC] group-hover:border-[#B5532E]"
                  >
                    <span>Visit {brand.name} Store</span>
                    <i className="fas fa-arrow-right text-[10px]"></i>
                  </Link>
                </div>
              </div>
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
