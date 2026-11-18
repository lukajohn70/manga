'use client';

import * as React from 'react';
import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useStore } from '../../context/StoreContext';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export interface ShopProduct {
  id: string;
  title: string;
  brand?: string;
  category: string;
  categoryName: string;
  priceNgn: number;
  oldPriceNgn?: number;
  priceUsd: number;
  oldPriceUsd?: number;
  image: string;
  rating: number;
  reviewsCount: number;
  storeName: string;
  type: 'physical' | 'digital';
  deliveryEstimate?: string;
  inStock?: boolean;
  offerId?: string;
}

const DEPARTMENTS = [
  { id: 'all', name: 'All Departments', icon: 'fa-table-cells' },
  { id: 'computing', name: 'Phones & Computing', icon: 'fa-laptop' },
  { id: 'electronics', name: 'Electronics & Audio', icon: 'fa-headphones' },
  { id: 'fashion', name: 'Fashion & Streetwear', icon: 'fa-shirt' },
  { id: 'home', name: 'Home & Appliances', icon: 'fa-couch' },
  { id: 'digital', name: 'Software & Digital', icon: 'fa-code' },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    currency,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    cartCount,
    wishlistCount,
    toggleCurrency,
  } = useStore();

  const initialCat = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';
  const initialType = searchParams.get('type') || 'all';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [selectedType, setSelectedType] = useState<string>(initialType);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyExpress, setOnlyExpress] = useState<boolean>(false);

  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync state if URL changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const q = searchParams.get('q');
    if (q !== null) setSearchQuery(q);
    const t = searchParams.get('type');
    if (t) setSelectedType(t);
  }, [searchParams]);

  // Fetch products from backend API
  useEffect(() => {
    let active = true;
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const url = new URL('/api/products', window.location.origin);
        if (selectedCategory && selectedCategory !== 'all') {
          url.searchParams.set('category', selectedCategory);
        }
        if (searchQuery.trim()) {
          url.searchParams.set('q', searchQuery.trim());
        }
        const res = await fetch(url.toString());
        if (res.ok) {
          const data = await res.json();
          if (active && data.items) {
            setProducts(data.items);
          }
        }
      } catch (err) {
        console.warn('Shop page fetch note:', err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchCatalog();
    return () => {
      active = false;
    };
  }, [selectedCategory, searchQuery]);

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by type (physical vs digital)
    if (selectedType === 'physical') {
      list = list.filter((p) => p.type === 'physical');
    } else if (selectedType === 'digital') {
      list = list.filter((p) => p.type === 'digital');
    }

    // Filter by price range
    if (priceRange === 'under_50k') {
      list = list.filter((p) => p.priceNgn < 50000);
    } else if (priceRange === '50k_200k') {
      list = list.filter((p) => p.priceNgn >= 50000 && p.priceNgn <= 200000);
    } else if (priceRange === '200k_500k') {
      list = list.filter((p) => p.priceNgn > 200000 && p.priceNgn <= 500000);
    } else if (priceRange === 'over_500k') {
      list = list.filter((p) => p.priceNgn > 500000);
    }

    // Filter by rating
    if (minRating > 0) {
      list = list.filter((p) => (p.rating || 0) >= minRating);
    }

    // Filter by Express
    if (onlyExpress) {
      list = list.filter((p) => (p.deliveryEstimate || '').toLowerCase().includes('express'));
    }

    // Sorting
    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.priceNgn - b.priceNgn);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.priceNgn - a.priceNgn);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return list;
  }, [products, selectedType, priceRange, minRating, onlyExpress, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedType('all');
    setSearchQuery('');
    setPriceRange('all');
    setMinRating(0);
    setOnlyExpress(false);
    setSortBy('featured');
    router.push('/shop');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#2A2320]">
      <Header
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onOpenCart={() => router.push('/cart')}
        onOpenWishlist={() => router.push('/wishlist')}
        onOpenTrackOrder={() => router.push('/track-order')}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          router.push(`/shop?category=${cat}`);
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
        currency={currency}
        onToggleCurrency={toggleCurrency}
      />

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-4 lg:px-8 py-8 sm:py-10">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#8C8279] mb-4">
          <Link href="/" className="hover:text-[#B5532E] transition-colors">Home</Link>
          <span>/</span>
          <span className="font-bold text-[#2A2320]">Shop Marketplace</span>
          {selectedCategory !== 'all' && (
            <>
              <span>/</span>
              <span className="text-[#B5532E] font-bold capitalize">
                {DEPARTMENTS.find((d) => d.id === selectedCategory)?.name || selectedCategory}
              </span>
            </>
          )}
        </div>

        {/* Header Title & Sorting Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E7D5BC] mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-[#2A2320]">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Marketplace Catalog'}
            </h1>
            <p className="text-xs sm:text-sm text-[#8C8279] mt-1">
              Showing <strong>{filteredProducts.length}</strong> verified authentic products
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label htmlFor="sort" className="text-xs font-bold text-[#8C8279] whitespace-nowrap">
              Sort By:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-white border border-[#E7D5BC] rounded-xl text-xs font-bold text-[#2A2320] focus:outline-none focus:ring-1 focus:ring-[#B5532E] cursor-pointer shadow-2xs"
            >
              <option value="featured">Featured & Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
            </select>
          </div>
        </div>

        {/* Layout: Sidebar Filters + Products Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Faceted Sidebar Filters (3 cols) */}
          <aside className="lg:col-span-3 space-y-6">
            
            {/* Filter Group: Product Format */}
            <div className="p-5 bg-white rounded-2xl border border-[#E7D5BC] shadow-2xs">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#8C8279] mb-3">Product Format</h3>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: 'all', label: 'All Products' },
                  { id: 'physical', label: 'Physical Goods (Nationwide Delivery)' },
                  { id: 'digital', label: 'Digital Assets (Instant License)' },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setSelectedType(fmt.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-between border-0 ${
                      selectedType === fmt.id
                        ? 'bg-[#F6EDE0] font-bold text-[#B5532E]'
                        : 'bg-transparent hover:bg-[#FAF6F0] text-[#2A2320]'
                    }`}
                  >
                    <span>{fmt.label}</span>
                    {selectedType === fmt.id && <i className="fas fa-check text-[10px]"></i>}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Group: Departments */}
            <div className="p-5 bg-white rounded-2xl border border-[#E7D5BC] shadow-2xs">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#8C8279] mb-3">Department</h3>
              <ul className="space-y-1 text-xs">
                {DEPARTMENTS.map((dept) => (
                  <li key={dept.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(dept.id);
                        router.push(`/shop?category=${dept.id}`);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-between border-0 ${
                        selectedCategory === dept.id
                          ? 'bg-[#F6EDE0] font-bold text-[#B5532E]'
                          : 'bg-transparent hover:bg-[#FAF6F0] text-[#2A2320]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <i className={`fas ${dept.icon} text-[11px] text-[#8C8279]`}></i>
                        <span>{dept.name}</span>
                      </span>
                      {selectedCategory === dept.id && <i className="fas fa-circle text-[6px] text-[#B5532E]"></i>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Filter Group: Price Range */}
            <div className="p-5 bg-white rounded-2xl border border-[#E7D5BC] shadow-2xs">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#8C8279] mb-3">Price Range</h3>
              <div className="space-y-2 text-xs">
                {[
                  { id: 'all', label: 'All Prices' },
                  { id: 'under_50k', label: 'Under ₦50,000' },
                  { id: '50k_200k', label: '₦50,000 – ₦200,000' },
                  { id: '200k_500k', label: '₦200,000 – ₦500,000' },
                  { id: 'over_500k', label: 'Above ₦500,000' },
                ].map((range) => (
                  <label key={range.id} className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={priceRange === range.id}
                      onChange={() => setPriceRange(range.id)}
                      className="accent-[#B5532E]"
                    />
                    <span className={priceRange === range.id ? 'font-bold text-[#B5532E]' : 'text-[#2A2320]'}>
                      {range.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Group: Customer Rating */}
            <div className="p-5 bg-white rounded-2xl border border-[#E7D5BC] shadow-2xs">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#8C8279] mb-3">Customer Rating</h3>
              <div className="space-y-2 text-xs">
                {[
                  { stars: 4.5, label: '4.5 & Above' },
                  { stars: 4.0, label: '4.0 & Above' },
                  { stars: 0, label: 'Any Rating' },
                ].map((r) => (
                  <label key={r.stars} className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="minRating"
                      checked={minRating === r.stars}
                      onChange={() => setMinRating(r.stars)}
                      className="accent-[#B5532E]"
                    />
                    <span className="flex items-center gap-1 text-[#2A2320]">
                      {r.stars > 0 ? (
                        <>
                          <i className="fas fa-star text-[#D9A441]"></i>
                          <span className="font-bold">{r.stars}</span>
                          <span className="text-[#8C8279]">& Above</span>
                        </>
                      ) : (
                        'All Ratings'
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reset Filters CTA */}
            <button
              type="button"
              onClick={handleResetFilters}
              className="w-full py-2.5 bg-white hover:bg-[#FAF6F0] text-[#B5532E] border border-[#B5532E]/40 font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-2xs flex items-center justify-center gap-2"
            >
              <i className="fas fa-rotate-left"></i>
              <span>Reset All Filters</span>
            </button>

          </aside>

          {/* Right Column: Products Grid (9 cols) */}
          <div className="lg:col-span-9">
            {loading ? (
              <div className="py-24 text-center">
                <i className="fas fa-spinner fa-spin text-3xl text-[#B5532E] mb-3"></i>
                <p className="text-sm font-medium text-[#8C8279]">Loading verified catalog products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-[#E7D5BC] shadow-2xs">
                <div className="w-16 h-16 rounded-2xl bg-[#F6EDE0] text-[#B5532E] flex items-center justify-center text-2xl mx-auto mb-4">
                  <i className="fas fa-box-open"></i>
                </div>
                <h3 className="font-display font-black text-lg text-[#2A2320]">No products matched your filters</h3>
                <p className="text-xs text-[#8C8279] max-w-sm mx-auto mt-1 mb-6">
                  Try adjusting your search terms, expanding the price range, or clearing department filters.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-[#B5532E] text-white text-xs font-bold rounded-xl hover:bg-[#8F3B1F] transition-colors border-0 cursor-pointer shadow-xs"
                >
                  View All Marketplace Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((item) => {
                  const discountPct =
                    item.oldPriceNgn && item.oldPriceNgn > item.priceNgn
                      ? Math.round(((item.oldPriceNgn - item.priceNgn) / item.oldPriceNgn) * 100)
                      : null;
                  const inWish = isInWishlist(item.id);

                  return (
                    <div
                      key={item.id}
                      className="group bg-white rounded-2xl border border-[#E7D5BC]/80 hover:border-[#B5532E]/40 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                    >
                      {/* Product Media Area */}
                      <div className="relative aspect-square overflow-hidden bg-[#FAF6F0]">
                        <Link href={`/product/${item.id}`} className="block w-full h-full">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </Link>

                        {/* Top Discount & Wishlist Badges */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                          {discountPct ? (
                            <span className="bg-[#B3261E] text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                              -{discountPct}%
                            </span>
                          ) : (
                            <span></span>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleWishlist(item.id);
                            }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border-0 cursor-pointer pointer-events-auto shadow-sm ${
                              inWish
                                ? 'bg-[#B3261E] text-white'
                                : 'bg-white/90 text-[#8C8279] hover:text-[#B3261E] hover:bg-white'
                            }`}
                            title={inWish ? 'Remove from saved' : 'Save item'}
                          >
                            <i className="fas fa-heart text-xs"></i>
                          </button>
                        </div>

                        {/* Format Tag */}
                        {item.type === 'digital' ? (
                          <span className="absolute bottom-2.5 left-2.5 bg-[#3E5C76] text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                            Instant Digital
                          </span>
                        ) : (
                          <span className="absolute bottom-2.5 left-2.5 bg-[#4F6B3A] text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                            Manga Express
                          </span>
                        )}
                      </div>

                      {/* Product Content Details */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-[#8C8279] mb-1">
                            <span className="font-semibold truncate max-w-[140px]">{item.storeName}</span>
                            <span className="flex items-center gap-1 text-[#D9A441] font-bold">
                              <i className="fas fa-star text-[10px]"></i>
                              <span>{item.rating ? item.rating.toFixed(1) : '4.9'}</span>
                            </span>
                          </div>

                          <Link
                            href={`/product/${item.id}`}
                            className="font-bold text-xs sm:text-sm text-[#2A2320] hover:text-[#B5532E] transition-colors line-clamp-2 leading-snug mb-2 block"
                          >
                            {item.title}
                          </Link>
                        </div>

                        {/* Pricing & Add to Cart Action */}
                        <div className="pt-3 border-t border-[#E7D5BC]/50">
                          <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-base sm:text-lg font-black text-[#B5532E]">
                              {formatPrice(item.priceNgn, item.priceUsd)}
                            </span>
                            {item.oldPriceNgn && item.oldPriceNgn > item.priceNgn && (
                              <span className="text-xs text-[#8C8279] line-through font-medium">
                                {formatPrice(item.oldPriceNgn, item.oldPriceUsd || 0)}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => addToCart(item, 1)}
                              className="flex-1 py-2 rounded-xl bg-[#B5532E] hover:bg-[#8F3B1F] text-white text-xs font-bold transition-colors border-0 cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                            >
                              <i className="fas fa-cart-plus text-xs"></i>
                              <span>Add to Cart</span>
                            </button>
                            <Link
                              href={`/product/${item.id}`}
                              className="px-3 py-2 rounded-xl bg-[#F6EDE0] hover:bg-[#E7D5BC] text-[#2A2320] text-xs font-bold transition-colors text-center"
                              title="View Product Details"
                            >
                              <i className="fas fa-arrow-right text-xs"></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </main>

      <Footer
        onOpenCart={() => router.push('/cart')}
        onOpenWishlist={() => router.push('/wishlist')}
        onOpenTrackOrder={() => router.push('/track-order')}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          router.push(`/shop?category=${cat}`);
        }}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
      />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0]">
          <i className="fas fa-spinner fa-spin text-3xl text-[#B5532E]"></i>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
