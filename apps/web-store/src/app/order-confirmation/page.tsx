'use client';

import * as React from 'react';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
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

  const ref = searchParams.get('ref') || lastOrderRef || 'MNG-769149-F92D';
  const [copied, setCopied] = useState(false);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(ref);
    setCopied(true);
    showToast('Order reference copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

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

      <main className="flex-1 container mx-auto px-4 lg:px-8 py-10 sm:py-16 max-w-3xl">
        
        {/* Success Hero Card */}
        <div className="bg-white rounded-3xl border border-[#E7D5BC] p-8 sm:p-12 text-center shadow-2xs mb-8">
          <div className="flex items-center justify-center mb-5">
            <SuccessCheckmark size={72} color="#4F6B3A" strokeWidth={3.8} />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#4F6B3A]/10 text-[#4F6B3A] border border-[#4F6B3A]/20 mb-3">
            <i className="fas fa-shield-halved text-xs"></i> Payment Confirmed & Protected
          </span>

          <h1 className="text-2xl sm:text-4xl font-black font-display text-[#2A2320] mb-2">
            Order Confirmed & Verified!
          </h1>
          <p className="text-xs sm:text-sm text-[#8C8279] max-w-md mx-auto leading-relaxed">
            Thank you for shopping on MANGA MARKETSQUARE. Your payment has been received and verified. Verified sellers have been notified to initiate packing.
          </p>

          {/* Reference Number Pill */}
          <div className="mt-6 inline-flex items-center gap-3 p-3 bg-[#FAF6F0] rounded-2xl border border-[#E7D5BC]">
            <span className="text-xs text-[#8C8279] font-bold">Order Reference:</span>
            <strong className="text-sm sm:text-base font-black text-[#B5532E] font-mono tracking-wider">
              {ref}
            </strong>
            <button
              type="button"
              onClick={handleCopyRef}
              className="p-1.5 rounded-lg bg-white hover:bg-[#F6EDE0] text-[#8C8279] hover:text-[#B5532E] transition-colors border border-[#E7D5BC] cursor-pointer text-xs"
              title="Copy Order Reference"
            >
              <i className={`fas ${copied ? 'fa-check text-[#4F6B3A]' : 'fa-copy'}`}></i>
            </button>
          </div>

          {/* Delivery Timeline Summary */}
          <div className="mt-8 p-6 rounded-2xl bg-[#F6EDE0]/40 border border-[#E7D5BC] text-left">
            <div className="flex items-center justify-between pb-4 border-b border-[#E7D5BC]/60 text-xs mb-4">
              <div>
                <span className="text-[10px] text-[#8C8279] uppercase font-bold tracking-wider block">Estimated Delivery</span>
                <strong className="text-xs sm:text-sm font-extrabold text-[#4F6B3A]">Tomorrow, by 5:00 PM</strong>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#8C8279] uppercase font-bold tracking-wider block">Courier Logistics</span>
                <strong className="text-xs text-[#2A2320] font-bold">Marketsquare Express Fleet</strong>
              </div>
            </div>

            {/* Stepper Progress */}
            <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
              <div>
                <div className="w-6 h-6 rounded-full bg-[#4F6B3A] text-white flex items-center justify-center mx-auto mb-1 text-[10px]">
                  <i className="fas fa-check"></i>
                </div>
                <span className="font-bold text-[#2A2320] block">Payment Confirmed</span>
                <span className="text-[#8C8279]">Completed</span>
              </div>
              <div>
                <div className="w-6 h-6 rounded-full bg-[#D9A441] text-white flex items-center justify-center mx-auto mb-1 text-[10px]">
                  <i className="fas fa-box"></i>
                </div>
                <span className="font-bold text-[#2A2320] block">Vendor Packing</span>
                <span className="text-[#D9A441] font-bold">In Progress</span>
              </div>
              <div className="opacity-50">
                <div className="w-6 h-6 rounded-full bg-[#E7D5BC] text-[#8C8279] flex items-center justify-center mx-auto mb-1 text-[10px]">
                  <i className="fas fa-truck-fast"></i>
                </div>
                <span className="font-bold text-[#2A2320] block">In Transit</span>
                <span className="text-[#8C8279]">Pending</span>
              </div>
              <div className="opacity-50">
                <div className="w-6 h-6 rounded-full bg-[#E7D5BC] text-[#8C8279] flex items-center justify-center mx-auto mb-1 text-[10px]">
                  <i className="fas fa-door-open"></i>
                </div>
                <span className="font-bold text-[#2A2320] block">Doorstep Delivery</span>
                <span className="text-[#8C8279]">Pending</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/track-order?ref=${encodeURIComponent(ref)}`}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#B5532E] hover:bg-[#8F3B1F] text-white font-extrabold text-xs transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <i className="fas fa-location-crosshairs"></i>
              <span>Track Live Shipment Status</span>
            </Link>

            <button
              type="button"
              onClick={() => window.print()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-[#FAF6F0] text-[#2A2320] border border-[#E7D5BC] font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <i className="fas fa-receipt text-[#8C8279]"></i>
              <span>Print Tax Invoice</span>
            </button>

            <Link
              href="/shop"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-[#FAF6F0] text-[#8C8279] hover:text-[#2A2320] border border-[#E7D5BC] font-bold text-xs transition-colors flex items-center justify-center"
            >
              <span>Back to Marketplace</span>
            </Link>
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
