'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '../../context/StoreContext';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export default function WishlistPage() {
  const router = useRouter();
  const {
    user,
    currency,
    formatPrice,
    wishlist,
    wishlistCount,
    toggleWishlist,
    addToCart,
    cartCount,
    toggleCurrency,
  } = useStore();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (active && data.items) {
            setProducts(data.items);
          }
        }
      } catch (err) {
        console.warn('Error loading wishlist products:', err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchCatalog();
    return () => {
      active = false;
    };
  }, []);

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleMoveToCart = (item: any, e?: React.MouseEvent) => {
    const visualEl = document.getElementById(`wishlist-item-${item.id}`) || (e ? (e.currentTarget as HTMLElement) : null);
    addToCart(item, 1, visualEl);
    toggleWishlist(item.id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#2A2320]">
      <Header
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onOpenCart={() => router.push('/cart')}
        onOpenWishlist={() => {}}
        onOpenTrackOrder={() => router.push('/track-order')}
        onSelectCategory={(cat) => router.push(`/shop?category=${cat}`)}
        searchQuery=""
        onSearchChange={(q) => router.push(`/shop?q=${encodeURIComponent(q)}`)}
        currency={currency}
        onToggleCurrency={toggleCurrency}
      />

      <main className="flex-1 container mx-auto px-4 lg:px-8 py-8 sm:py-10">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#8C8279] mb-4">
          <Link href="/" className="hover:text-[#B5532E] transition-colors">Home</Link>
          <span>/</span>
          <span className="font-bold text-[#2A2320]">Saved Wishlist</span>
        </div>

        <div className="pb-4 border-b border-[#E7D5BC] mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-[#2A2320]">
              My Saved Wishlist ({savedProducts.length} {savedProducts.length === 1 ? 'item' : 'items'})
            </h1>
            <p className="text-xs sm:text-sm text-[#8C8279] mt-0.5">
              Keep track of items you love. Move them to your cart whenever you are ready to order.
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-[#B5532E] hover:underline hidden sm:inline"
          >
            Explore More Products →
          </Link>
        </div>

        {!user && (
          <div className="mb-6 p-4 rounded-2xl bg-white border border-[#E7D5BC] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3 text-xs text-[#8C8279]">
              <div className="w-8 h-8 rounded-full bg-[#FAF6F0] text-[#B5532E] flex items-center justify-center text-sm flex-shrink-0">
                <i className="fas fa-bookmark"></i>
              </div>
              <span>
                <strong>Browsing as guest:</strong> Sign in to your Manga account to permanently sync your saved items across all your devices.
              </span>
            </div>
            <Link
              href="/account/login"
              className="px-4 py-2 rounded-xl bg-[#B5532E] hover:bg-[#8F3B1F] text-white font-bold text-xs transition-colors whitespace-nowrap shadow-xs"
            >
              Sign In to Account
            </Link>
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center">
            <i className="fas fa-spinner fa-spin text-3xl text-[#B5532E] mb-3"></i>
            <p className="text-sm font-medium text-[#8C8279]">Loading your saved items...</p>
          </div>
        ) : savedProducts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-[#E7D5BC] p-8 shadow-2xs max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-full bg-[#F6EDE0] text-[#B5532E] flex items-center justify-center text-3xl mx-auto mb-4">
              <i className="fas fa-heart"></i>
            </div>
            <h3 className="font-display font-black text-xl text-[#2A2320] mb-2">Your Wishlist is Empty</h3>
            <p className="text-xs text-[#8C8279] max-w-sm mx-auto mb-6 leading-relaxed">
              Explore authentic tech, home appliances, streetwear, and digital templates, then tap the heart icon to save them here.
            </p>
            <Link
              href="/shop"
              className="px-8 py-3 rounded-xl bg-[#B5532E] hover:bg-[#8F3B1F] text-white font-extrabold text-xs transition-colors shadow-sm inline-flex items-center gap-2"
            >
              <span>Explore All Products</span>
              <i className="fas fa-arrow-right text-[10px]"></i>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {savedProducts.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#E7D5BC] hover:border-[#B5532E]/40 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div
                  id={`wishlist-item-${item.id}`}
                  className="relative aspect-square overflow-hidden bg-[#FAF6F0]"
                >
                  <Link href={`/product/${item.id}`} className="block w-full h-full">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(item.id)}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-[#B3261E] text-white flex items-center justify-center shadow-md border-0 cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <i className="fas fa-times text-xs"></i>
                  </button>

                  <span className="absolute bottom-2.5 left-2.5 bg-[#2A2320] text-[#D9A441] text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {item.storeName}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-[#4F6B3A] font-bold block mb-1">
                      <i className="fas fa-circle-check text-[9px]"></i> In Stock
                    </span>
                    <Link
                      href={`/product/${item.id}`}
                      className="font-bold text-xs sm:text-sm text-[#2A2320] hover:text-[#B5532E] transition-colors line-clamp-2 leading-snug mb-2 block"
                    >
                      {item.title}
                    </Link>
                  </div>

                  <div className="pt-3 border-t border-[#E7D5BC]/60">
                    <span className="text-base font-black text-[#B5532E] block mb-3">
                      {formatPrice(item.priceNgn, item.priceUsd)}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        const btn = e.currentTarget;
                        btn.classList.add('scale-95');
                        setTimeout(() => btn.classList.remove('scale-95'), 150);
                        handleMoveToCart(item, e);
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#B5532E] hover:bg-[#8F3B1F] text-white text-xs font-bold transition-all border-0 cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs active:scale-95"
                    >
                      <i className="fas fa-cart-plus text-xs"></i>
                      <span>Move to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      <Footer
        onOpenCart={() => router.push('/cart')}
        onOpenWishlist={() => {}}
        onOpenTrackOrder={() => router.push('/track-order')}
        onSelectCategory={(cat) => router.push(`/shop?category=${cat}`)}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
      />
    </div>
  );
}
