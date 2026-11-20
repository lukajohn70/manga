'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
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

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1D1917]">
        <Header
          cartCount={cartCount}
          wishlistCount={0}
          onOpenCart={() => router.push('/cart')}
          onOpenWishlist={() => router.push('/account/login?redirect=/wishlist')}
          onOpenTrackOrder={() => router.push('/track-order')}
          onSelectCategory={(cat) => router.push(`/shop?category=${cat}`)}
          searchQuery=""
          onSearchChange={(q) => router.push(`/shop?q=${encodeURIComponent(q)}`)}
          currency={currency}
          onToggleCurrency={toggleCurrency}
        />
        <main className="flex-1 container mx-auto px-4 lg:px-8 py-16 flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#EAE3D9] shadow-xs text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] text-[#B5532E] flex items-center justify-center text-xl mx-auto mb-4 border border-[#EAE3D9]">
              <i className="fas fa-heart"></i>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#B5532E]/10 text-[#B5532E] border border-[#B5532E]/20 mb-3">
              <i className="fas fa-lock text-[9px]"></i> Saved Items
            </span>
            <h2 className="apple-heading text-xl font-bold text-[#1D1917] mb-2 tracking-tight">
              Sign In to View Your Saved Items
            </h2>
            <p className="text-xs text-[#78716C] mb-6 leading-relaxed font-normal">
              Saved items are tied to your Manga account. Sign in to sync and access your wishlist across all devices.
            </p>
            <motion.div whileTap={{ scale: 0.97 }}>
              <Link
                href="/account/login?redirect=/wishlist"
                className="block w-full py-3 rounded-xl bg-[#B5532E] hover:bg-[#A04523] text-white font-semibold text-xs shadow-xs transition-colors text-center mb-3 no-underline apple-pressable"
              >
                Sign In to Account
              </Link>
            </motion.div>
            <Link
              href="/shop"
              className="text-xs font-semibold text-[#78716C] hover:text-[#1D1917] no-underline"
            >
              ← Continue Shopping
            </Link>
          </div>
        </main>
        <Footer
          onOpenCart={() => router.push('/cart')}
          onOpenWishlist={() => router.push('/account/login?redirect=/wishlist')}
          onOpenTrackOrder={() => router.push('/track-order')}
          onSelectCategory={(cat) => router.push(`/shop?category=${cat}`)}
          cartCount={cartCount}
          wishlistCount={0}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1D1917]">
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
        <div className="flex items-center gap-2 text-xs text-[#78716C] mb-4">
          <Link href="/" className="hover:text-[#B5532E] transition-colors no-underline text-[#78716C]">Home</Link>
          <span>/</span>
          <span className="font-semibold text-[#1D1917]">Saved Items</span>
        </div>

        <div className="pb-4 border-b border-[#EAE3D9] mb-8 flex items-center justify-between">
          <div>
            <h1 className="apple-heading text-2xl sm:text-3xl font-bold text-[#1D1917] tracking-tight">
              Saved Items ({savedProducts.length} {savedProducts.length === 1 ? 'item' : 'items'})
            </h1>
            <p className="apple-subhead text-xs sm:text-sm text-[#78716C] mt-0.5 font-normal">
              Keep track of items you love. Move them to your bag whenever you are ready to order.
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs font-semibold text-[#B5532E] hover:text-[#8F3B1F] hidden sm:inline no-underline"
          >
            Explore Catalog →
          </Link>
        </div>

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
              <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                className="bg-white rounded-2xl border border-[#EAE3D9] hover:border-[#B5532E]/40 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] flex flex-col justify-between"
              >
                <div
                  id={`wishlist-item-${item.id}`}
                  className="relative aspect-square overflow-hidden bg-[#F5F2EC]"
                >
                  <Link href={`/product/${item.id}`} className="block w-full h-full">
                    <motion.img
                      src={item.image}
                      alt={item.title}
                      whileHover={{ scale: 1.04 }}
                      transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleWishlist(item.id)}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-[#1D1917]/85 text-white flex items-center justify-center shadow-sm border-0 cursor-pointer apple-pressable backdrop-blur-md"
                    title="Remove from saved"
                  >
                    <i className="fas fa-times text-xs"></i>
                  </motion.button>

                  <span className="absolute bottom-2.5 left-2.5 bg-[#1D1917]/90 text-[#FAF7F2] text-[9px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider backdrop-blur-sm">
                    {item.storeName}
                  </span>
                </div>

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-[#4F6B3A] font-semibold block mb-1">
                      <i className="fas fa-circle-check text-[9px]"></i> Available
                    </span>
                    <Link
                      href={`/product/${item.id}`}
                      className="font-medium text-xs sm:text-sm text-[#1D1917] hover:text-[#B5532E] transition-colors line-clamp-2 leading-snug mb-2 block no-underline"
                    >
                      {item.title}
                    </Link>
                  </div>

                  <div className="pt-3 border-t border-[#EAE3D9]/60">
                    <span className="text-base font-bold text-[#B5532E] block mb-3 tracking-tight">
                      {formatPrice(item.priceNgn, item.priceUsd)}
                    </span>

                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={(e) => {
                        handleMoveToCart(item, e);
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#B5532E] hover:bg-[#A04523] text-white text-xs font-semibold transition-colors border-0 cursor-pointer flex items-center justify-center gap-1.5 shadow-xs apple-pressable"
                    >
                      <i className="fas fa-bag-shopping text-xs opacity-75"></i>
                      <span>Move to Bag</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
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
