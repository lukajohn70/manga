'use client';

import * as React from 'react';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    currency,
    cartCount,
    wishlistCount,
    toggleCurrency,
    lastOrderRef,
  } = useStore();

  const initialRef = searchParams.get('ref') || lastOrderRef || '';
  const [orderRefInput, setOrderRefInput] = useState(initialRef);
  const [searchedRef, setSearchedRef] = useState(initialRef);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!searchedRef.trim()) {
      setTrackingData(null);
      setNotFound(false);
      return;
    }

    let active = true;
    const fetchTracking = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await fetch(`/api/tracking/${encodeURIComponent(searchedRef.trim())}`);
        if (res.ok) {
          const json = await res.json();
          if (active && json.data) {
            setTrackingData(json.data);
            setNotFound(false);
          } else if (active) {
            setTrackingData(null);
            setNotFound(true);
          }
        } else if (active) {
          setTrackingData(null);
          setNotFound(true);
        }
      } catch (err) {
        if (active) {
          setTrackingData(null);
          setNotFound(true);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchTracking();
    return () => {
      active = false;
    };
  }, [searchedRef]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderRefInput.trim()) {
      setSearchedRef(orderRefInput.trim());
      router.push(`/track-order?ref=${encodeURIComponent(orderRefInput.trim())}`);
    }
  };

  const primaryParcel = trackingData?.parcels?.[0];
  const orderStatus = trackingData?.status || 'confirmed';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1D1917]">
      <Header
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onOpenCart={() => router.push('/cart')}
        onOpenWishlist={() => router.push('/wishlist')}
        onOpenTrackOrder={() => {}}
        onSelectCategory={(cat) => router.push(`/shop?category=${cat}`)}
        searchQuery=""
        onSearchChange={(q) => router.push(`/shop?q=${encodeURIComponent(q)}`)}
        currency={currency}
        onToggleCurrency={toggleCurrency}
      />

      <main className="flex-1">
        
        {/* Hero Search Banner: Apple Titanium Finish */}
        <div className="bg-[#1A1513] text-white py-14 sm:py-18 border-b border-black/30">
          <div className="container mx-auto px-4 lg:px-8 text-center max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/10 text-[#E7D5BC] border border-white/15 mb-3.5">
              <i className="fas fa-location-crosshairs text-xs"></i> Real-Time Nationwide Tracking
            </span>
            <h1 className="apple-heading text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2.5">
              Track Shipment & Order Status
            </h1>
            <p className="apple-subhead text-xs sm:text-sm text-white/70 mb-8 leading-relaxed font-normal">
              Check delivery milestones and courier dispatch progress across Nigeria.
            </p>

            {/* Input Bar */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2.5 max-w-lg mx-auto">
              <input
                type="text"
                required
                placeholder="Enter order reference (e.g. MNG-769149-F92D)"
                value={orderRefInput}
                onChange={(e) => setOrderRefInput(e.target.value)}
                className="flex-1 px-4 py-2.5 text-xs bg-white text-[#1D1917] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B5532E]/40 font-mono uppercase font-semibold shadow-xs"
              />
              <motion.button
                type="submit"
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', bounce: 0, duration: 0.25 }}
                disabled={loading}
                className="px-6 py-2.5 bg-[#B5532E] hover:bg-[#A04523] text-white text-xs font-semibold rounded-xl transition-colors border-0 cursor-pointer shadow-xs disabled:opacity-50 apple-pressable"
              >
                {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Track Order'}
              </motion.button>
            </form>
          </div>
        </div>

        {/* Tracking Details Container */}
        <div className="container mx-auto px-4 lg:px-8 py-10 sm:py-14 max-w-3xl">
          {!searchedRef ? (
            <div className="bg-white rounded-3xl border border-[#EAE3D9] p-10 text-center shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] text-[#B5532E] flex items-center justify-center text-xl mx-auto mb-4 border border-[#EAE3D9]">
                <i className="fas fa-barcode"></i>
              </div>
              <h3 className="font-display font-black text-lg text-[#2A2320] mb-2">Track Your Delivery Waybill</h3>
              <p className="text-xs text-[#8C8279] max-w-md mx-auto mb-6">
                Enter your order reference code (e.g. from your order confirmation or checkout receipt) in the search field above to view real-time courier checkpoints.
              </p>
              <Link
                href="/shop"
                className="px-6 py-2.5 bg-[#B5532E] hover:bg-[#8F3B1F] text-white text-xs font-bold rounded-xl transition-colors inline-block"
              >
                Browse Marketplace Products
              </Link>
            </div>
          ) : notFound ? (
            <div className="bg-white rounded-3xl border border-rose-200 p-10 text-center shadow-2xs">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center text-2xl mx-auto mb-4">
                <i className="fas fa-circle-exclamation"></i>
              </div>
              <h3 className="font-display font-black text-lg text-[#2A2320] mb-2">Order Reference Not Found</h3>
              <p className="text-xs text-[#8C8279] max-w-md mx-auto mb-6">
                No active shipment was found matching <span className="font-mono font-bold text-[#2A2320]">{searchedRef}</span>. Please verify your reference number or sign in to your buyer account.
              </p>
              <Link
                href="/account"
                className="px-6 py-2.5 bg-[#2A2320] hover:bg-[#B5532E] text-white text-xs font-bold rounded-xl transition-colors inline-block"
              >
                View Account Orders
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#E7D5BC] p-6 sm:p-8 shadow-2xs space-y-6">
            
            {/* Overview Card */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#F6EDE0]/50 border border-[#E7D5BC] text-xs">
              <div>
                <span className="text-[#8C8279] text-[10px] block uppercase font-bold tracking-wider">Tracking Reference</span>
                <strong className="text-base font-black text-[#B5532E] font-mono">{searchedRef}</strong>
              </div>
              <div>
                <span className="text-[#8C8279] text-[10px] block uppercase font-bold tracking-wider">Courier Carrier</span>
                <strong className="text-xs text-[#2A2320] font-bold">
                  {primaryParcel?.carrier || 'Marketsquare Express Fleet'}
                </strong>
              </div>
              <div className="sm:text-right">
                <span className="text-[#8C8279] text-[10px] block uppercase font-bold tracking-wider">Estimated Delivery</span>
                <strong className="text-xs text-[#4F6B3A] font-extrabold">
                  {primaryParcel?.estimatedDelivery || 'Tomorrow, by 5:00 PM'}
                </strong>
              </div>
            </div>

            {/* Vendor Parcel Breakdown */}
            {trackingData?.parcels && trackingData.parcels.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C8279]">
                  Parcels in this Order ({trackingData.parcels.length})
                </h4>
                {trackingData.parcels.map((parcel: any, idx: number) => (
                  <div
                    key={parcel.shipmentGroupId || idx}
                    className="p-4 rounded-xl bg-[#FAF6F0] border border-[#E7D5BC] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <i className="fas fa-box text-[#B5532E] text-sm"></i>
                      <div>
                        <strong className="text-[#2A2320] block">{parcel.vendorName}</strong>
                        <span className="text-[10px] text-[#8C8279]">Tracking: {parcel.trackingNumber}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-[#4F6B3A]/15 text-[#4F6B3A]">
                      {parcel.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* 5-Stage Stepper with Manga Defined Colors */}
            <div className="pt-4 border-t border-[#E7D5BC]/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C8279] mb-6">
                Milestone Timeline & Dispatch Progress
              </h4>

              <div className="space-y-6 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E7D5BC]">
                {/* Step 1 */}
                <div className="flex items-start gap-4 relative">
                  <span className="w-7 h-7 rounded-full bg-[#4F6B3A] text-white flex items-center justify-center text-xs flex-shrink-0 z-10 shadow-2xs">
                    <i className="fas fa-check"></i>
                  </span>
                  <div>
                    <h5 className="font-bold text-xs text-[#2A2320]">Order Placed & Payment Verified</h5>
                    <p className="text-[11px] text-[#8C8279]">
                      Payment verified securely. Dispatched by verified seller.
                    </p>
                    <span className="text-[10px] text-[#4F6B3A] font-bold">Completed</span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-4 relative">
                  <span className="w-7 h-7 rounded-full bg-[#4F6B3A] text-white flex items-center justify-center text-xs flex-shrink-0 z-10 shadow-2xs">
                    <i className="fas fa-check"></i>
                  </span>
                  <div>
                    <h5 className="font-bold text-xs text-[#2A2320]">Merchant Acceptance & Quality Inspection</h5>
                    <p className="text-[11px] text-[#8C8279]">
                      Merchant accepted parcel order. Sourced authentic merchandise verified and barcoded.
                    </p>
                    <span className="text-[10px] text-[#4F6B3A] font-bold">Verified</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-4 relative">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 z-10 shadow-2xs ${
                    orderStatus === 'in_transit'
                      ? 'bg-[#3E5C76] text-white animate-pulse'
                      : orderStatus === 'delivered'
                      ? 'bg-[#4F6B3A] text-white'
                      : 'bg-[#D9A441] text-white'
                  }`}>
                    <i className="fas fa-truck-fast"></i>
                  </span>
                  <div>
                    <h5 className="font-bold text-xs text-[#2A2320]">In Transit — Sorting & Logistics Hub</h5>
                    <p className="text-[11px] text-[#8C8279]">
                      Package processed at central sort facility. Handed over to regional fleet driver.
                    </p>
                    <span className="text-[10px] text-[#3E5C76] font-bold">Active Status</span>
                  </div>
                </div>

                {/* Step 4 */}
                <div className={`flex items-start gap-4 relative ${orderStatus === 'delivered' ? '' : 'opacity-60'}`}>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 z-10 ${
                    orderStatus === 'delivered' ? 'bg-[#4F6B3A] text-white' : 'bg-[#E7D5BC] text-[#8C8279]'
                  }`}>
                    <i className="fas fa-door-open"></i>
                  </span>
                  <div>
                    <h5 className="font-bold text-xs text-[#2A2320]">Out for Final Doorstep Delivery</h5>
                    <p className="text-[11px] text-[#8C8279]">
                      Rider on delivery route. You will receive an SMS and phone call prior to arrival.
                    </p>
                    <span className="text-[10px] text-[#8C8279]">Scheduled for tomorrow</span>
                  </div>
                </div>

                {/* Step 5 */}
                <div className={`flex items-start gap-4 relative ${orderStatus === 'delivered' ? '' : 'opacity-60'}`}>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 z-10 ${
                    orderStatus === 'delivered' ? 'bg-[#4F6B3A] text-white' : 'bg-[#E7D5BC] text-[#8C8279]'
                  }`}>
                    <i className="fas fa-shield-halved"></i>
                  </span>
                  <div>
                    <h5 className="font-bold text-xs text-[#2A2320]">Delivery Signed & Completed</h5>
                    <p className="text-[11px] text-[#8C8279]">
                      Buyer receives and verifies parcel upon handover.
                    </p>
                    <span className="text-[10px] text-[#8C8279]">Pending Handover</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Assistance Banner */}
            <div className="p-4 bg-[#FAF6F0] rounded-2xl border border-[#E7D5BC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#8C8279]">
              <span className="flex items-center gap-2">
                <i className="fas fa-headset text-[#B5532E]"></i>
                <span>Need delivery help or change of address? Contact <strong>0700-62642-NG</strong></span>
              </span>
              <Link
                href="/shop"
                className="text-xs font-bold text-[#B5532E] hover:underline"
              >
                Browse More Products →
              </Link>
            </div>

          </div>
          )}

        </div>

      </main>

      <Footer
        onOpenCart={() => router.push('/cart')}
        onOpenWishlist={() => router.push('/wishlist')}
        onOpenTrackOrder={() => {}}
        onSelectCategory={(cat) => router.push(`/shop?category=${cat}`)}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
      />
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0]">
          <i className="fas fa-spinner fa-spin text-3xl text-[#B5532E]"></i>
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
