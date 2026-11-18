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

// Comprehensive catalog across all standard departments
const CATALOG_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-apple-16pm',
    title: 'Apple iPhone 16 Pro Max 256GB Desert Titanium (Official Warranty)',
    category: 'computing',
    categoryName: 'Phones & Computing',
    priceNgn: 2250000,
    oldPriceNgn: 2450000,
    priceUsd: 1590,
    oldPriceUsd: 1720,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=85',
    rating: 4.9,
    reviewsCount: 142,
    storeName: 'Apple Authorized Store Nigeria',
    type: 'physical',
    deliveryEstimate: 'Manga Express • Tomorrow',
    otherOffers: [
      {
        vendorId: 'vnd-slot-ikj',
        vendorName: 'Slot Systems Ikeja',
        vendorRating: 4.8,
        priceNgn: 2240000,
        priceUsd: 1580,
        condition: 'Sealed Brand New',
        deliveryTime: 'Today in Lagos Hub',
        dispatchCity: 'Lagos',
      },
      {
        vendorId: 'vnd-finet',
        vendorName: 'Finet Communications Victoria Island',
        vendorRating: 4.7,
        priceNgn: 2260000,
        priceUsd: 1595,
        condition: 'Official Apple Care Pack',
        deliveryTime: 'Tomorrow in Lagos',
        dispatchCity: 'Lagos',
      },
    ],
  },
  {
    id: 'prod-sony-wh1000xm5',
    title: 'Sony WH-1000XM5 Wireless Noise-Cancelling Over-Ear Headphones',
    category: 'electronics',
    categoryName: 'Electronics & Audio',
    priceNgn: 450000,
    oldPriceNgn: 580000,
    priceUsd: 320,
    oldPriceUsd: 399,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
    rating: 4.9,
    reviewsCount: 384,
    storeName: 'Sony Audio Official Store',
    type: 'physical',
    deliveryEstimate: 'Manga Express • Tomorrow',
    otherOffers: [
      {
        vendorId: 'vnd-apex-audio',
        vendorName: 'Apex Pro Sound Studio',
        vendorRating: 4.8,
        priceNgn: 460000,
        priceUsd: 325,
        condition: 'Factory Sealed with Hard Case',
        deliveryTime: 'Same Day in Lagos',
        dispatchCity: 'Lagos',
      },
    ],
  },
  {
    id: 'prod-samsung-s24u',
    title: 'Samsung Galaxy S24 Ultra 512GB Titanium Black with S-Pen & AI',
    category: 'computing',
    categoryName: 'Phones & Computing',
    priceNgn: 1850000,
    oldPriceNgn: 2100000,
    priceUsd: 1290,
    oldPriceUsd: 1450,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=900&q=85',
    rating: 4.8,
    reviewsCount: 96,
    storeName: 'Samsung Nigeria Official',
    type: 'physical',
    deliveryEstimate: 'Manga Express • 24 Hours',
  },
  {
    id: 'prod-delonghi-dedica',
    title: "De'Longhi Dedica Deluxe Slim Espresso & Cappuccino Pump Machine",
    category: 'home',
    categoryName: 'Home & Appliances',
    priceNgn: 320000,
    oldPriceNgn: 390000,
    priceUsd: 225,
    oldPriceUsd: 275,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=900&q=85',
    rating: 4.9,
    reviewsCount: 64,
    storeName: "De'Longhi Official Brand Store",
    type: 'physical',
    deliveryEstimate: 'Nationwide Delivery in 2–3 days',
  },
  {
    id: 'prod-macbook-air-m3',
    title: 'Apple MacBook Air 15" M3 Chip (16GB Unified Memory, 512GB SSD Midnight)',
    category: 'computing',
    categoryName: 'Phones & Computing',
    priceNgn: 2100000,
    oldPriceNgn: 2350000,
    priceUsd: 1480,
    oldPriceUsd: 1650,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85',
    rating: 5.0,
    reviewsCount: 118,
    storeName: 'Slot Systems Ikeja',
    type: 'physical',
    deliveryEstimate: 'Manga Express • Tomorrow',
  },
  {
    id: 'prod-logitech-mx3s',
    title: 'Logitech MX Master 3S Wireless Performance Ergonomic Mouse (Quiet Clicks)',
    category: 'computing',
    categoryName: 'Phones & Computing',
    priceNgn: 135000,
    oldPriceNgn: 175000,
    priceUsd: 95,
    oldPriceUsd: 119,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=85',
    rating: 4.8,
    reviewsCount: 220,
    storeName: 'Alpha Hardware Solutions',
    type: 'physical',
    deliveryEstimate: 'Manga Express • Tomorrow',
  },
  {
    id: 'prod-kano-rucksack',
    title: 'Handcrafted Kano Full-Grain Leather Travel Rucksack & Laptop Carrier',
    category: 'fashion',
    categoryName: 'Fashion & Streetwear',
    priceNgn: 85000,
    oldPriceNgn: 120000,
    priceUsd: 60,
    oldPriceUsd: 85,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85',
    rating: 4.9,
    reviewsCount: 78,
    storeName: 'Heritage Leatherworks Kano',
    type: 'physical',
    deliveryEstimate: 'Arrives in 2–3 days',
  },
  {
    id: 'prod-arc-bag',
    title: 'Arc Mini Sculpted Full Leather Bag (Limited Ochre / Terracotta Edition)',
    category: 'fashion',
    categoryName: 'Fashion & Streetwear',
    priceNgn: 185000,
    oldPriceNgn: 220000,
    priceUsd: 128,
    oldPriceUsd: 150,
    image: 'https://images.unsplash.com/photo-1603219527847-24c87f552a77?auto=format&fit=crop&w=900&q=85',
    rating: 4.9,
    reviewsCount: 52,
    storeName: 'Cedar & Hide Studio',
    type: 'physical',
    deliveryEstimate: 'Arrives in 2–3 days',
  },
  {
    id: 'prod-philips-airfryer',
    title: 'Philips Premium XXL Smart Sensing Airfryer 7.2L with Rapid Air Technology',
    category: 'home',
    categoryName: 'Home & Appliances',
    priceNgn: 195000,
    oldPriceNgn: 245000,
    priceUsd: 138,
    oldPriceUsd: 170,
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=900&q=85',
    rating: 4.8,
    reviewsCount: 89,
    storeName: 'HomeTech Mart Lagos',
    type: 'physical',
    deliveryEstimate: 'Manga Express • Tomorrow',
  },
  {
    id: 'prod-figma-pro-kit',
    title: 'SaaS UI Design System & Figma Pro Kit (400+ Components & Tokens)',
    category: 'digital',
    categoryName: 'Software & Digital Assets',
    priceNgn: 45000,
    oldPriceNgn: 70000,
    priceUsd: 32,
    oldPriceUsd: 50,
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=900&q=85',
    rating: 5.0,
    reviewsCount: 167,
    storeName: 'DesignCraft Labs',
    type: 'digital',
    deliveryEstimate: 'Instant digital download & license key',
  },
  {
    id: 'prod-type-family',
    title: 'Studio Display Type Family (14 Weights • Variable OpenType & WebFont)',
    category: 'digital',
    categoryName: 'Software & Digital Assets',
    priceNgn: 60000,
    oldPriceNgn: 90000,
    priceUsd: 42,
    oldPriceUsd: 65,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=85',
    rating: 5.0,
    reviewsCount: 94,
    storeName: 'North Type Co.',
    type: 'digital',
    deliveryEstimate: 'Delivered instantly with commercial license',
  },
  {
    id: 'prod-flutter-starter',
    title: 'Complete Mobile Commerce Flutter Production Kit with Riverpod & GoRouter',
    category: 'digital',
    categoryName: 'Software & Digital Assets',
    priceNgn: 75000,
    oldPriceNgn: 110000,
    priceUsd: 52,
    oldPriceUsd: 80,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=85',
    rating: 4.9,
    reviewsCount: 81,
    storeName: 'CodeForge Global',
    type: 'digital',
    deliveryEstimate: 'Instant GitHub repository invite & license',
  },
];

// Flash sales rail items
const FLASH_ITEMS: FlashItem[] = [
  {
    id: 'prod-sony-wh1000xm5',
    title: 'Sony WH-1000XM5 Wireless ANC Headphones',
    priceNgn: 450000,
    oldPriceNgn: 580000,
    priceUsd: 320,
    oldPriceUsd: 399,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
    rating: 4.9,
    reviewsCount: 384,
    claimedPercent: 78,
    discountPercent: 22,
    type: 'physical',
    category: 'electronics',
    storeName: 'Sony Audio Official Store',
  },
  {
    id: 'prod-logitech-mx3s',
    title: 'Logitech MX Master 3S Ergonomic Wireless Mouse',
    priceNgn: 135000,
    oldPriceNgn: 175000,
    priceUsd: 95,
    oldPriceUsd: 119,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=85',
    rating: 4.8,
    reviewsCount: 220,
    claimedPercent: 64,
    discountPercent: 23,
    type: 'physical',
    category: 'computing',
    storeName: 'Alpha Hardware Solutions',
  },
  {
    id: 'prod-delonghi-dedica',
    title: "De'Longhi Dedica Deluxe Espresso Machine",
    priceNgn: 320000,
    oldPriceNgn: 390000,
    priceUsd: 225,
    oldPriceUsd: 275,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=900&q=85',
    rating: 4.9,
    reviewsCount: 64,
    claimedPercent: 88,
    discountPercent: 18,
    type: 'physical',
    category: 'home',
    storeName: "De'Longhi Official Store",
  },
  {
    id: 'prod-kano-rucksack',
    title: 'Handcrafted Kano Leather Travel Rucksack',
    priceNgn: 85000,
    oldPriceNgn: 120000,
    priceUsd: 60,
    oldPriceUsd: 85,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85',
    rating: 4.9,
    reviewsCount: 78,
    claimedPercent: 91,
    discountPercent: 29,
    type: 'physical',
    category: 'fashion',
    storeName: 'Heritage Leatherworks Kano',
  },
];

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
  const [products, setProducts] = useState<ProductItem[]>(CATALOG_PRODUCTS);
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
          if (active && json.items && Array.isArray(json.items) && json.items.length > 0) {
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
          onSelectFeatured={() => router.push('/product/66666666-6666-6666-6666-666666666661')}
          currency={currency}
        />

        {/* Section 2: Shop by Department Icon Grid */}
        <CategoryNav
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => router.push(cat === 'all' ? '/shop' : `/shop?category=${cat}`)}
        />

        {/* Section 3: Live Flash Sales Rail with Countdown Timer */}
        <div id="flash-section">
          <FlashDeals
            items={FLASH_ITEMS}
            currency={currency}
            wishlist={wishlist}
            onToggleWishlist={(id, el) => toggleWishlist(id, el)}
            onAddToCart={(prod, el) => addToCart(prod, 1, el)}
            onViewProduct={(item) => router.push(`/product/${item.id}`)}
          />
        </div>

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
              <div className="text-center py-16 bg-white rounded-3xl border border-[#E7D5BC] p-8 shadow-2xs">
                <i className="fas fa-search text-3xl text-[#8C8279] mb-3 block"></i>
                <h4 className="font-bold text-[#2A2320] text-base mb-1">No products found matching your search</h4>
                <p className="text-xs text-[#8C8279] mb-4">Try clearing your filters or search terms.</p>
                <button
                  type="button"
                  onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                  className="px-6 py-2 bg-[#B5532E] hover:bg-[#8F3B1F] text-white text-xs font-bold rounded-xl border-0 cursor-pointer shadow-xs"
                >
                  Reset Catalog Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Section 6: Digital Software & Developer Codebase Rail */}
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

        {/* Section 7: Inspired by your browsing (Recently Viewed Shelf) */}
        <section className="py-12 bg-[#FAF6F0]">
          <div className="container mx-auto px-4 lg:px-8">
            <h3 className="text-base font-bold text-[#2A2320] flex items-center gap-2 mb-6">
              <i className="fas fa-clock-rotate-left text-[#8C8279]"></i>
              <span>Inspired by your browsing (Recently Viewed)</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {CATALOG_PRODUCTS.slice(0, 4).map((rv) => (
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
