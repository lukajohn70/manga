'use client';

import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { Header } from './Header';
import { HeroBanner } from './HeroBanner';
import { CategoryNav } from './CategoryNav';
import { FlashDeals, FlashItem } from './FlashDeals';
import { OfficialStoresSection } from './OfficialStoresSection';
import { ProductCard, ProductItem, VendorOffer } from './ProductCard';
import { Footer } from './Footer';
import { BuyBoxModal } from './BuyBoxModal';

const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.025,
      delayChildren: 0.02,
    },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] as const },
  },
};

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
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1D1917]">
      {/* 1. Header (Translucent Floating Chrome + Navigation Bar) */}
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
      <main className="flex-1 pb-16 min-w-0">
        
        {/* Section 1: Hero Promotional Banner (Apple Typographic Rigor & Depth) */}
        <HeroBanner
          onExploreClick={() => router.push('/shop')}
          onFlashDealsClick={() => router.push('/flash-sales')}
          onSelectFeatured={() => router.push(products.length > 0 ? `/product/${products[0].id}` : '/shop')}
          currency={currency}
        />

        {/* Section 2: Shop by Department Tactile Spring Grid */}
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
        <section id="catalog-section" className="py-16 sm:py-20 bg-[#FAF7F2]">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-5 mb-9">
              <div>
                <h2 className="apple-heading text-2xl sm:text-3xl font-bold text-[#1D1917] tracking-tight">
                  Top Trending & Best Sellers
                </h2>
                <p className="apple-subhead text-sm text-[#78716C] mt-1.5 font-normal">
                  Authentic customer favorites ready for rapid courier dispatch across Nigeria.
                </p>
              </div>

              {/* Department pill filter with fluid spring sliding indicator */}
              <div className="flex flex-wrap items-center gap-2 relative">
                {['all', 'computing', 'electronics', 'fashion', 'home', 'digital'].map((c) => {
                  const isSelected = selectedCategory === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        if (c === 'all') setSelectedCategory('all');
                        else router.push(`/shop?category=${c}`);
                      }}
                      className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize border-0 cursor-pointer apple-pressable transition-colors duration-150 z-10 ${
                        isSelected ? 'text-white' : 'text-[#1D1917] hover:text-[#B5532E]'
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="storefrontCategoryPill"
                          transition={{ type: 'spring', bounce: 0.15, duration: 0.28 }}
                          className="absolute inset-0 bg-[#B5532E] rounded-xl shadow-xs -z-10"
                        />
                      )}
                      {!isSelected && (
                        <div className="absolute inset-0 bg-white border border-[#EAE3D9] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.03)] -z-10" />
                      )}
                      {c === 'all' ? 'All Products' : c}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Products Grid with Stagger Fade */}
            <motion.div
              key={selectedCategory}
              variants={gridContainerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {filteredProducts.map((item) => (
                <motion.div key={item.id} variants={cardItemVariants}>
                  <ProductCard
                    item={item}
                    currency={currency}
                    inWishlist={isInWishlist(item.id)}
                    onToggleWishlist={(id, el) => toggleWishlist(id, el, item)}
                    onAddToCart={(prod, el) => addToCart(prod, 1, el)}
                    onViewProduct={(prod) => router.push(`/product/${prod.id}`)}
                    onOpenBuyBox={(prod) => setBuyBoxProduct(prod)}
                  />
                </motion.div>
              ))}
            </motion.div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#EAE3D9] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)] max-w-xl mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D9] text-[#78716C] flex items-center justify-center text-xl mx-auto mb-4">
                  <i className="fas fa-boxes-stacked"></i>
                </div>
                <h4 className="font-bold text-[#1D1917] text-base mb-2">New Arrivals Coming Soon</h4>
                <p className="text-xs text-[#78716C] mb-6 leading-relaxed">
                  Verified merchants and official stores are updating their inventory catalogs. Check back shortly for new drops or list your own authentic products.
                </p>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.25 }}
                  onClick={() => router.push('/sell')}
                  className="px-6 py-2.5 bg-[#B5532E] hover:bg-[#A04523] text-white text-xs font-semibold rounded-xl border-0 cursor-pointer shadow-xs inline-flex items-center gap-2 apple-pressable"
                >
                  <i className="fas fa-store text-xs opacity-75"></i>
                  <span>Sell on Manga / Partner With Us</span>
                </motion.button>
              </div>
            )}
          </div>
        </section>

        {/* Section 6: Digital Software & Developer Codebase Rail */}
        {digitalProducts.length > 0 && (
          <section className="py-16 bg-white border-t border-b border-[#EAE3D9]/80">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-9">
                <div>
                  <span className="text-xs font-semibold text-[#4F6B3A] uppercase tracking-wider block mb-1">
                    <i className="fas fa-cloud-arrow-down mr-1"></i> Instant Delivery & Codebases
                  </span>
                  <h2 className="apple-heading text-2xl sm:text-3xl font-bold text-[#1D1917] tracking-tight">
                    Software, UI Kits & Digital Licenses
                  </h2>
                  <p className="apple-subhead text-sm text-[#78716C] mt-1 font-normal">
                    Production codebases, Flutter templates, and comprehensive Figma design systems.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push('/shop?category=digital')}
                  className="text-xs font-semibold text-[#B5532E] hover:text-[#8F3B1F] flex items-center gap-1.5 bg-transparent border-0 cursor-pointer transition-colors"
                >
                  <span>Browse Digital Assets</span>
                  <i className="fas fa-arrow-right text-[10px] opacity-75"></i>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {digitalProducts.map((digi) => (
                  <motion.div
                    key={digi.id}
                    whileHover={{ y: -4 }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                    className="p-6 rounded-2xl bg-[#FAF7F2] hover:bg-white border border-[#EAE3D9] hover:border-[#B5532E]/30 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.05)] transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#4F6B3A]/10 text-[#4F6B3A] border border-[#4F6B3A]/20">
                          <i className="fas fa-check-circle mr-1"></i> Lifetime License
                        </span>
                        <span className="text-sm font-bold text-[#B5532E]">
                          {currency === 'NGN' ? `₦${digi.priceNgn.toLocaleString()}` : `$${digi.priceUsd}`}
                        </span>
                      </div>

                      <h4
                        onClick={() => router.push(`/product/${digi.id}`)}
                        className="font-semibold text-sm text-[#1D1917] hover:text-[#B5532E] transition-colors mb-2 cursor-pointer line-clamp-2 leading-snug"
                      >
                        {digi.title}
                      </h4>
                      <p className="text-xs text-[#78716C] mb-5 line-clamp-2 leading-relaxed">
                        Verified vendor asset by {digi.storeName}. Instant license delivery upon payment.
                      </p>
                    </div>

                    <div className="pt-3.5 border-t border-[#EAE3D9]/70 flex items-center justify-between">
                      <span className="text-[11px] text-[#78716C] font-normal flex items-center gap-1">
                        <i className="fas fa-download text-[#3E5C76] text-xs"></i> Direct Access
                      </span>
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
                        onClick={(e) => {
                          const btn = e.currentTarget;
                          addToCart(digi, 1, btn);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#B5532E] hover:bg-[#A04523] text-white text-xs font-semibold border-0 cursor-pointer apple-pressable shadow-xs transition-colors"
                      >
                        Add License
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section 7: Inspired by your browsing (Recently Viewed Shelf) */}
        {products.length > 0 && (
          <section className="py-14 bg-[#FAF7F2]">
            <div className="container mx-auto px-4 lg:px-8">
              <h3 className="text-sm font-semibold text-[#1D1917] flex items-center gap-2 mb-6">
                <i className="fas fa-clock-rotate-left text-[#78716C] text-xs"></i>
                <span>Inspired by your browsing (Recently Viewed)</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {products.slice(0, 4).map((rv) => (
                  <motion.div
                    key={rv.id}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                    onClick={() => router.push(`/product/${rv.id}`)}
                    className="p-3.5 bg-white rounded-xl hover:border-[#B5532E]/30 flex items-center gap-3 group border border-[#EAE3D9] cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.03)] apple-pressable transition-colors"
                  >
                    <img src={rv.image} alt={rv.title} className="w-13 h-13 object-cover rounded-lg flex-shrink-0 bg-[#F5F2EC]" />
                    <div className="min-w-0">
                      <h4 className="text-xs font-medium text-[#1D1917] truncate group-hover:text-[#B5532E] transition-colors">
                        {rv.title}
                      </h4>
                      <p className="text-xs font-bold text-[#B5532E] mt-0.5">
                        {currency === 'NGN' ? `₦${rv.priceNgn.toLocaleString()}` : `$${rv.priceUsd}`}
                      </p>
                    </div>
                  </motion.div>
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
