'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderRef?: string | null;
}

export interface ParcelInfo {
  shipmentGroupId: string;
  vendorName: string;
  fulfillmentMode: string;
  status: string;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
}

export interface TrackingData {
  orderNumber: string;
  status: string;
  placedAt?: string;
  currency?: string;
  parcels: ParcelInfo[];
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  onClose,
  initialOrderRef,
}) => {
  const [orderRef, setOrderRef] = useState(initialOrderRef || 'MG-783921-NG');
  const [searchedRef, setSearchedRef] = useState(initialOrderRef || 'MG-783921-NG');
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialOrderRef) {
      setOrderRef(initialOrderRef);
      setSearchedRef(initialOrderRef);
    }
  }, [initialOrderRef]);

  useEffect(() => {
    if (!isOpen || !searchedRef.trim()) return;

    let isCurrent = true;
    const fetchTracking = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/tracking/${encodeURIComponent(searchedRef.trim())}`);
        if (res.ok) {
          const json = await res.json();
          if (isCurrent && json.data) {
            setTrackingData(json.data);
          }
        }
      } catch (err) {
        console.warn('Tracking query fallback note:', err);
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    fetchTracking();
    return () => {
      isCurrent = false;
    };
  }, [isOpen, searchedRef]);

  if (!isOpen) return null;

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderRef.trim()) {
      setSearchedRef(orderRef.trim());
    }
  };

  const primaryParcel = trackingData?.parcels?.[0];
  const orderStatus = trackingData?.status || 'confirmed';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl z-10 overflow-hidden border border-[#EAE3D9] text-[#1D1917]"
          >
            {/* Header */}
            <div className="p-5 border-b border-[#EAE3D9] flex items-center justify-between bg-[#FAF7F2]">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#EAE3D9] text-[#B5532E] flex items-center justify-center font-bold text-sm">
                  <i className="fas fa-location-crosshairs"></i>
                </span>
                <div>
                  <h3 className="apple-heading font-bold text-base text-[#1D1917] leading-tight">
                    Live Order & Parcel Tracking
                  </h3>
                  <p className="text-xs text-[#78716C]">Real-time dispatch milestones & delivery status</p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.92 }}
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg text-[#78716C] hover:text-[#1D1917] hover:bg-[#EAE3D9]/50 flex items-center justify-center transition-colors border-0 bg-transparent cursor-pointer"
              >
                <i className="fas fa-times"></i>
              </motion.button>
            </div>

            {/* Input Bar */}
            <div className="p-5 border-b border-[#EAE3D9] bg-white">
              <form onSubmit={handleTrack} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter order reference (e.g. MNG-329525-B04D)"
                  value={orderRef}
                  onChange={(e) => setOrderRef(e.target.value)}
                  className="flex-1 px-4 py-2 text-xs bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B5532E] font-mono uppercase text-[#1D1917]"
                />
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-[#B5532E] hover:bg-[#8F3B1F] text-white text-xs font-bold rounded-xl transition-colors border-0 cursor-pointer shadow-xs disabled:opacity-50 apple-pressable"
                >
                  {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Track'}
                </motion.button>
              </form>
            </div>

            {/* Tracking Timeline */}
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D9] text-xs">
                <div>
                  <span className="text-[#78716C] text-[10px] block uppercase font-bold tracking-wider">Tracking Reference</span>
                  <strong className="text-sm font-extrabold text-[#B5532E] font-mono">{searchedRef}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[#78716C] text-[10px] block uppercase font-bold tracking-wider">Courier Partner</span>
                  <strong className="text-xs text-[#4F6B3A] font-bold">
                    {primaryParcel?.carrier || 'Manga Express'}
                  </strong>
                </div>
              </div>

              {/* Vendor Parcel Card */}
              {primaryParcel && (
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EAE3D9] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-box text-[#B5532E]"></i>
                    <span className="text-[#1D1917] font-medium">Parcel from <strong>{primaryParcel.vendorName}</strong></span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#4F6B3A]/10 text-[#4F6B3A]">
                    {primaryParcel.status.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>
              )}

              {/* Stepper with Apple Defined Elements */}
              <div className="space-y-4 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#EAE3D9]">
                {/* Step 1: Placed */}
                <div className="flex items-start gap-4 relative">
                  <span className="w-7 h-7 rounded-full bg-[#4F6B3A] text-white flex items-center justify-center text-xs flex-shrink-0 z-10 shadow-xs">
                    <i className="fas fa-check"></i>
                  </span>
                  <div>
                    <h5 className="font-bold text-xs text-[#1D1917]">Order Placed & Payment Verified</h5>
                    <p className="text-[11px] text-[#78716C]">Payment confirmed securely for verified seller dispatch.</p>
                    <span className="text-[10px] text-[#4F6B3A] font-medium">Completed</span>
                  </div>
                </div>

                {/* Step 2: Quality Inspection */}
                <div className="flex items-start gap-4 relative">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 z-10 shadow-xs ${
                    orderStatus === 'confirmed' || orderStatus === 'in_transit' || orderStatus === 'delivered'
                      ? 'bg-[#4F6B3A] text-white'
                      : 'bg-[#EAE3D9] text-[#78716C]'
                  }`}>
                    <i className="fas fa-check"></i>
                  </span>
                  <div>
                    <h5 className="font-bold text-xs text-[#1D1917]">Quality Check & Vendor Packing</h5>
                    <p className="text-[11px] text-[#78716C]">
                      {primaryParcel ? `Verified by ${primaryParcel.vendorName}` : 'Inspected by verified merchant'}.
                    </p>
                    <span className="text-[10px] text-[#4F6B3A] font-medium">Verified</span>
                  </div>
                </div>

                {/* Step 3: Transit */}
                <div className="flex items-start gap-4 relative">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 z-10 shadow-xs ${
                    orderStatus === 'in_transit'
                      ? 'bg-[#3E5C76] text-white'
                      : orderStatus === 'delivered'
                      ? 'bg-[#4F6B3A] text-white'
                      : 'bg-[#D9A441] text-white'
                  }`}>
                    <i className="fas fa-truck-fast"></i>
                  </span>
                  <div>
                    <h5 className="font-bold text-xs text-[#1D1917]">Dispatch & Transit Hub</h5>
                    <p className="text-[11px] text-[#78716C]">
                      Assigned tracking {primaryParcel?.trackingNumber || searchedRef} via Manga Express.
                    </p>
                    <span className="text-[10px] text-[#3E5C76] font-bold">In Progress</span>
                  </div>
                </div>

                {/* Step 4: Final Delivery */}
                <div className={`flex items-start gap-4 relative ${orderStatus === 'delivered' ? '' : 'opacity-60'}`}>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 z-10 ${
                    orderStatus === 'delivered' ? 'bg-[#4F6B3A] text-white' : 'bg-[#EAE3D9] text-[#78716C]'
                  }`}>
                    <i className="fas fa-box-open"></i>
                  </span>
                  <div>
                    <h5 className="font-bold text-xs text-[#1D1917]">Doorstep Delivery & Handover</h5>
                    <p className="text-[11px] text-[#78716C]">Courier delivers to destination. Same-day delivery for Kaduna orders.</p>
                    <span className="text-[10px] text-[#78716C]">
                      {primaryParcel?.estimatedDelivery || 'Tomorrow, by 5:00 PM'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#FAF7F2] border-t border-[#EAE3D9] flex items-center justify-between text-xs text-[#78716C]">
              <span className="text-[11px]">Direct Support: 0700-62642-NG</span>
              <motion.button
                whileTap={{ scale: 0.94 }}
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-[#EAE3D9] hover:bg-[#DCD4C8] text-[#1D1917] font-semibold transition-colors border-0 cursor-pointer text-xs apple-pressable"
              >
                Close
              </motion.button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
