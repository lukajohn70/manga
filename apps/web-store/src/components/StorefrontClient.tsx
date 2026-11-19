'use client';

import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../context/StoreContext';
import { Header } from './Header';
import { HeroBanner } from './HeroBanner';
import { CategoryNav } from './CategoryNav';
import { FlashDeals, FlashItem } from './FlashDeals';
import { OfficialStoresSection } from './OfficialStoresSection';
import { ProductCard, ProductItem, VendorOffer } from './ProductCard';
import { Footer } from './Footer';
import { BuyBoxModal } from './BuyBoxModal';

// Clean marketplace catalog initialized from PostgreSQL database
const CATALOG_PRODUCTS: ProductItem[] = [];

export function StorefrontClient() {
  const router = useRouter();
  const {
    currency,
    toggleCurrency,
    cartItems,
    cartCount,
    wishlist,
    wishlistCount,
    addToCart,
    toggleWishlist,
    isInWishlist,
    showToast,
    lastOrderRef,
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Live products connected to backend API
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchCatalog = async () => {
      setIsLoading(true);
      try {
        const url = new URL('/api/products', window.location.origin);
        if (selectedCategory && selectedCategory !== 'all' && selectedCategory !== 'flash') {
          url.searchParams.set('category', selectedCategory);
        }
        if (searchQuery.trim()) {
          url.searchParams.set('q', searchQuery.trim());
        }
        const res = await fetch(url.toString());
        if (res.ok) {
          const json = await res.json();
          if (active && json.items && Array.isArray(json.items)) {
            setProducts(json.items);
          }
        }
      } catch (err) {
        console.warn('Live products fetch note:', err);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchCatalog();
    return () => {
      active = false;
    };
  }, [selectedCategory, searchQuery]);

  // Buy-Box state
  const [buyBoxProduct, setBuyBoxProduct] = useState<ProductItem | null>(null);

  const handleSelectVendorOffer = (product: ProductItem, offer: VendorOffer) => {
    const visualEl = document.getElementById(`product-visual-${product.id}`);
    addToCart(
      {
        ...product,
        storeName: offer.vendorName,
        priceNgn: offer.priceNgn,
        priceUsd: offer.priceUsd,
        offerId: offer.vendorId,
      },
      1,
      visualEl
    );
    setBuyBoxProduct(null);
  };

  // Filtered products (wired to live backend catalog)
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        selectedCategory === 'flash' ||
        item.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.categoryName || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Digital products subset
  const digitalProducts = useMemo(() => {
    return products.filter((item) => item.type === 'digital');
  }, [products]);

  // Flash deals subset derived from live catalog
  const flashItems = useMemo<FlashItem[]>(() => {
    return products
      .filter((p) => p.oldPriceNgn && p.oldPriceNgn > p.priceNgn)
      .map((p) => ({
        id: p.id,
        title: p.title,
        priceNgn: p.priceNgn,
        oldPriceNgn: p.oldPriceNgn || p.priceNgn,
        priceUsd: p.priceUsd,
        oldPriceUsd: p.oldPriceUsd || p.priceUsd,
        image: p.image,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        claimedPercent: 75,
        discountPercent: Math.round(((p.oldPriceNgn! - p.priceNgn) / p.oldPriceNgn!) * 100),
        type: p.type,
        category: p.category,
        storeName: p.storeName,
      }));
  }, [products]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#2A2320]">
      {/* 1. Header (Manga Iron Top Utility + Sticky Navigation Bar + Megamenu Ribbon) */}
      <Header
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onOpenCart={() => router.push('/cart')}
        onOpenWishlist={() => router.push('/wishlist')}
        onOpenTrackOrder={() => router.push('/track-order')}
        onSelectCategory={(cat) => router.push(cat === 'all' ? '/shop' : `/shop?category=${cat}`)}
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
        currency={currency}
        onToggleCurrency={toggleCurrency}
      />

      {/* Main Page Body */}
      <main className="flex-1 pb-12 min-w-0">
        
        {/* Section 1: Hero Promotional Banner (Manga Palette) */}
        <HeroBanner
          onExploreClick={() => router.push('/shop')}
          onFlashDealsClick={() => router.push('/flash-sales')}
          onSelectFeatured={() => router.push(products.length > 0 ? `/product/${products[0].id}` : '/shop')}
          currency={currency}
        />

        {/* Section 2: Shop by Department Icon Grid */}
        <CategoryNav
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => router.push(cat === 'all' ? '/shop' : `/shop?category=${cat}`)}
        />

        {/* Section 3: Live Flash Sales Rail with Countdown Timer */}
        {flashItems.length > 0 && (
          <div id="flash-section">
            <FlashDeals
              items={flashItems}
              currency={currency}
              wishlist={wishlist}
              onToggleWishlist={(id, el) => toggleWishlist(id, el)}
              onAddToCart={(prod, el) => addToCart(prod, 1, el)}
              onViewProduct={(item) => router.push(`/product/${item.id}`)}
            />
          </div>
        )}

        {/* Section 4: Manga Mall & Official Verified Brand Stores */}
        <OfficialStoresSection
          onSelectBrand={(brand) => {
            if (brand) router.push(`/shop?q=${encodeURIComponent(brand)}`);
            else router.push('/official-stores');
          }}
        />

        {/* Section 5: Top Trending & Best Sellers Catalog Section */}
        <section id="catalog-section" className="py-14 sm:py-20 bg-[#FAF6F0]">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black font-display text-[#2A2320]">
                  Top Trending & Best Sellers
                </h2>
                <p className="text-sm text-[#8C8279] mt-1">
                  High-demand customer favorites ready for rapid courier dispatch across Nigeria.
                </p>
              </div>

              {/* Department pill filter */}
              <div className="flex flex-wrap items-center gap-2">
                {['all', 'computing', 'electronics', 'fashion', 'home', 'digital'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      if (c === 'all') setSelectedCategory('all');
                      else router.push(`/shop?category=${c}`);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border-0 cursor-pointer capitalize shadow-2xs ${
                      selectedCategory === c
                        ? 'bg-[#B5532E] text-white shadow-xs'
                        : 'bg-white hover:bg-[#F6EDE0] text-[#2A2320] border border-[#E7D5BC]'
                    }`}
                  >
                    {c === 'all' ? 'All Products' : c}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  currency={currency}
                  inWishlist={isInWishlist(item.id)}
                  onToggleWishlist={(id, el) => toggleWishlist(id, el, item)}
                  onAddToCart={(prod, el) => addToCart(prod, 1, el)}
                  onViewProduct={(prod) => router.push(`/product/${prod.id}`)}
                  onOpenBuyBox={(prod) => setBuyBoxProduct(prod)}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#E7D5BC] p-8 shadow-2xs max-w-xl mx-auto">
                <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#E7D5BC] text-[#8C8279] flex items-center justify-center text-2xl mx-auto mb-4">
                  <i className="fas fa-boxes-stacked"></i>
                </div>
                <h4 className="font-black text-[#2A2320] text-lg mb-2">New Arrivals Coming Soon</h4>
                <p className="text-xs text-[#8C8279] mb-6 leading-relaxed">
                  Verified merchants and official stores are updating their inventory catalogs. Check back shortly for new drops or list your own authentic products.
                </p>
                <button
                  type="button"
                  onClick={() => router.push('/sell')}
                  className="px-6 py-2.5 bg-[#B5532E] hover:bg-[#8F3B1F] text-white text-xs font-bold rounded-xl border-0 cursor-pointer shadow-xs transition inline-flex items-center gap-2"
                >
                  <i className="fas fa-shop"></i>
                  <span>Sell on Manga / Partner With Us</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Section 6: Digital Software & Developer Codebase Rail */}
        {digitalProducts.length > 0 && (
          <section className="py-14 bg-white border-t border-b border-[#E7D5BC]">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-bold text-[#4F6B3A] uppercase tracking-wider block mb-1">
                    <i className="fas fa-cloud-arrow-down mr-1"></i> Instant Delivery & Codebases
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black font-display text-[#2A2320]">
                    Software, UI Kits & Digital Licenses
                  </h2>
                  <p className="text-sm text-[#8C8279] mt-1">
                    Commercial typography, production Flutter templates, and comprehensive Figma systems.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push('/shop?category=digital')}
                  className="text-xs font-bold text-[#B5532E] hover:underline flex items-center gap-1 bg-transparent border-0 cursor-pointer"
                >
                  <span>Browse All Digital Assets</span>
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {digitalProducts.map((digi) => (
                  <div
                    key={digi.id}
                    className="p-6 rounded-2xl bg-[#FAF6F0] hover:bg-white border border-[#E7D5BC]/80 hover:border-[#B5532E]/30 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-[#4F6B3A]/15 text-[#4F6B3A] border border-[#4F6B3A]/30">
                          <i className="fas fa-check-circle mr-1"></i> Lifetime License
                        </span>
                        <span className="text-xs font-black text-[#B5532E]">
                          {currency === 'NGN' ? `₦${digi.priceNgn.toLocaleString()}` : `$${digi.priceUsd}`}
                        </span>
                      </div>

                      <h4
                        onClick={() => router.push(`/product/${digi.id}`)}
                        className="font-bold text-sm text-[#2A2320] hover:text-[#B5532E] transition-colors mb-2 cursor-pointer line-clamp-2"
                      >
                        {digi.title}
                      </h4>
                      <p className="text-xs text-[#8C8279] mb-4 line-clamp-2">
                        Verified vendor asset by {digi.storeName}. Instant license delivery upon payment.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E7D5BC]/60 flex items-center justify-between">
                      <span className="text-[11px] text-[#8C8279] font-medium">
                        <i className="fas fa-download mr-1 text-[#3E5C76]"></i> Direct Access
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          const btn = e.currentTarget;
                          btn.classList.add('scale-95');
                          setTimeout(() => btn.classList.remove('scale-95'), 150);
                          addToCart(digi, 1, btn);
                        }}
                        className="px-4 py-1.5 rounded-xl bg-[#B5532E] hover:bg-[#8F3B1F] text-white text-xs font-bold transition-all border-0 cursor-pointer shadow-2xs active:scale-95"
                      >
                        Add License
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section 7: Inspired by your browsing (Recently Viewed Shelf) */}
        {products.length > 0 && (
          <section className="py-12 bg-[#FAF6F0]">
            <div className="container mx-auto px-4 lg:px-8">
              <h3 className="text-base font-bold text-[#2A2320] flex items-center gap-2 mb-6">
                <i className="fas fa-clock-rotate-left text-[#8C8279]"></i>
                <span>Inspired by your browsing (Recently Viewed)</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {products.slice(0, 4).map((rv) => (
                  <div
                    key={rv.id}
                    onClick={() => router.push(`/product/${rv.id}`)}
                    className="p-3 bg-white rounded-xl hover:bg-[#F6EDE0]/50 transition-colors flex items-center gap-3 group border border-[#E7D5BC] cursor-pointer shadow-2xs"
                  >
                    <img src={rv.image} alt={rv.title} className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#2A2320] truncate group-hover:text-[#B5532E]">
                        {rv.title}
                      </h4>
                      <p className="text-xs font-black text-[#B5532E] mt-0.5">
                        {currency === 'NGN' ? `₦${rv.priceNgn.toLocaleString()}` : `$${rv.priceUsd}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>

      {/* Global Footer (Value Proposition + Directory + App Dock) */}
      <Footer
        onOpenCart={() => router.push('/cart')}
        onOpenWishlist={() => router.push('/wishlist')}
        onOpenTrackOrder={() => router.push('/track-order')}
        onSelectCategory={(cat) => router.push(cat === 'all' ? '/shop' : `/shop?category=${cat}`)}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
      />

      {/* Buy-Box Offer Comparison Modal */}
      <BuyBoxModal
        product={buyBoxProduct}
        isOpen={Boolean(buyBoxProduct)}
        onClose={() => setBuyBoxProduct(null)}
        onSelectOffer={handleSelectVendorOffer}
        currency={currency}
      />

    </div>
  );
}
