'use client';

import * as React from 'react';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { SuccessCheckmark } from '@manga/ui';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    currency,
    cartCount,
    wishlistCount,
    toggleCurrency,
    lastOrderRef,
    showToast,
  } = useStore();

  const ref = searchParams.get('ref') || lastOrderRef || '';
  const [copied, setCopied] = useState(false);

  const handleCopyRef = () => {
    if (!ref) return;
    navigator.clipboard.writeText(ref);
    setCopied(true);
    showToast('Order reference copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!ref) {
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
        <main className="flex-1 container mx-auto px-4 lg:px-8 py-16 max-w-xl text-center">
          <div className="bg-white rounded-3xl border border-[#EAE3D9] p-8 sm:p-12 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D9] flex items-center justify-center mx-auto mb-4 text-[#78716C]">
              <i className="fas fa-receipt text-xl"></i>
            </div>
            <h1 className="apple-heading text-2xl font-bold text-[#1D1917] mb-2 tracking-tight">No Active Order Found</h1>
            <p className="apple-subhead text-sm text-[#78716C] mb-6 font-normal">
              You haven't completed an order in this session, or the order reference is missing.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/shop" className="px-6 py-2.5 rounded-xl bg-[#B5532E] hover:bg-[#A04523] text-white font-semibold text-xs transition-colors no-underline shadow-xs apple-pressable">
                Browse Catalog
              </Link>
              <Link href="/track-order" className="px-6 py-2.5 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#1D1917] border border-[#EAE3D9] font-semibold text-xs transition-colors no-underline apple-pressable">
                Track Existing Order
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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

      <main className="flex-1 container mx-auto px-4 lg:px-8 py-10 sm:py-16 max-w-3xl">
        
        {/* Success Hero Card */}
        <div className="bg-white rounded-3xl border border-[#EAE3D9] p-8 sm:p-12 text-center shadow-xs mb-8">
          <div className="flex items-center justify-center mb-5">
            <SuccessCheckmark size={72} color="#4F6B3A" strokeWidth={3.8} />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#4F6B3A]/10 text-[#4F6B3A] border border-[#4F6B3A]/20 mb-3">
            <i className="fas fa-shield-halved text-xs"></i> Payment Confirmed & Protected
          </span>

          <h1 className="apple-heading text-2xl sm:text-4xl font-bold text-[#1D1917] mb-2 tracking-tight">
            Order Confirmed & Verified!
          </h1>
          <p className="apple-subhead text-xs sm:text-sm text-[#78716C] max-w-md mx-auto leading-relaxed font-normal">
            Thank you for shopping on MANGA MARKETSQUARE. Your payment has been received and verified. Verified sellers have been notified to initiate packaging.
          </p>

          {/* Reference Number Pill */}
          <div className="mt-6 inline-flex items-center gap-3 p-3 bg-[#FAF7F2] rounded-2xl border border-[#EAE3D9]">
            <span className="text-xs text-[#78716C] font-medium">Order Reference:</span>
            <strong className="text-sm sm:text-base font-bold text-[#B5532E] font-mono tracking-wider">
              {ref}
            </strong>
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={handleCopyRef}
              className="p-1.5 rounded-lg bg-white hover:bg-[#FAF7F2] text-[#78716C] hover:text-[#B5532E] transition-colors border border-[#EAE3D9] cursor-pointer text-xs apple-pressable"
              title="Copy Order Reference"
            >
              <i className={`fas ${copied ? 'fa-check text-[#4F6B3A]' : 'fa-copy'}`}></i>
            </motion.button>
          </div>
        </div>

          {/* Delivery Timeline Summary */}
          <div className="mt-8 p-6 rounded-2xl bg-white border border-[#EAE3D9] text-left shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE3D9] text-xs mb-4">
              <div>
                <span className="text-[10px] text-[#78716C] uppercase font-bold tracking-wider block">Estimated Delivery</span>
                <strong className="text-xs sm:text-sm font-bold text-[#4F6B3A]">Tomorrow, by 5:00 PM</strong>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#78716C] uppercase font-bold tracking-wider block">Courier Logistics</span>
                <strong className="text-xs text-[#1D1917] font-semibold">Marketsquare Express Fleet</strong>
              </div>
            </div>

            {/* Stepper Progress */}
            <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
              <div>
                <div className="w-6 h-6 rounded-full bg-[#4F6B3A] text-white flex items-center justify-center mx-auto mb-1 text-[10px]">
                  <i className="fas fa-check"></i>
                </div>
                <span className="font-semibold text-[#1D1917] block">Payment Confirmed</span>
                <span className="text-[#78716C]">Completed</span>
              </div>
              <div>
                <div className="w-6 h-6 rounded-full bg-[#D9A441] text-white flex items-center justify-center mx-auto mb-1 text-[10px]">
                  <i className="fas fa-box"></i>
                </div>
                <span className="font-semibold text-[#1D1917] block">Vendor Packing</span>
                <span className="text-[#D9A441] font-semibold">In Progress</span>
              </div>
              <div className="opacity-50">
                <div className="w-6 h-6 rounded-full bg-[#FAF7F2] border border-[#EAE3D9] text-[#78716C] flex items-center justify-center mx-auto mb-1 text-[10px]">
                  <i className="fas fa-truck-fast"></i>
                </div>
                <span className="font-semibold text-[#1D1917] block">In Transit</span>
                <span className="text-[#78716C]">Pending</span>
              </div>
              <div className="opacity-50">
                <div className="w-6 h-6 rounded-full bg-[#FAF7F2] border border-[#EAE3D9] text-[#78716C] flex items-center justify-center mx-auto mb-1 text-[10px]">
                  <i className="fas fa-door-open"></i>
                </div>
                <span className="font-semibold text-[#1D1917] block">Doorstep Delivery</span>
                <span className="text-[#78716C]">Pending</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/track-order?ref=${encodeURIComponent(ref)}`}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#B5532E] hover:bg-[#8F3B1F] text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 apple-pressable"
            >
              <i className="fas fa-location-crosshairs"></i>
              <span>Track Live Shipment Status</span>
            </Link>

            <button
              type="button"
              onClick={() => window.print()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#1D1917] border border-[#EAE3D9] font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer apple-pressable"
            >
              <i className="fas fa-receipt text-[#78716C]"></i>
              <span>Print Tax Invoice</span>
            </button>

            <Link
              href="/shop"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#78716C] hover:text-[#1D1917] border border-[#EAE3D9] font-semibold text-xs transition-colors flex items-center justify-center apple-pressable"
            >
              <span>Back to Marketplace</span>
            </Link>
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

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0]">
          <i className="fas fa-spinner fa-spin text-3xl text-[#B5532E]"></i>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
