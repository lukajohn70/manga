'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl z-10 overflow-hidden border border-[#E7D5BC] text-[#2A2320]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E7D5BC]/60 flex items-center justify-between bg-[#FAF6F0]">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-[#F6EDE0] text-[#B5532E] flex items-center justify-center font-bold text-sm">
              <i className="fas fa-location-crosshairs"></i>
            </span>
            <div>
              <h3 className="font-display font-black text-base text-[#2A2320] leading-tight">
                Live Order & Parcel Tracking
              </h3>
              <p className="text-xs text-[#8C8279]">Real-time dispatch milestones & delivery status</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-[#8C8279] hover:text-[#2A2320] hover:bg-[#F6EDE0] flex items-center justify-center transition-colors border-0 bg-transparent cursor-pointer"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-5 border-b border-[#E7D5BC]/40 bg-white">
          <form onSubmit={handleTrack} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter order reference (e.g. MNG-329525-B04D)"
              value={orderRef}
              onChange={(e) => setOrderRef(e.target.value)}
              className="flex-1 px-4 py-2 text-xs bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B5532E] font-mono uppercase text-[#2A2320]"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#B5532E] hover:bg-[#8F3B1F] text-white text-xs font-bold rounded-xl transition-colors border-0 cursor-pointer shadow-2xs disabled:opacity-50"
            >
              {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Track'}
            </button>
          </form>
        </div>

        {/* Tracking Timeline */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F6EDE0]/50 border border-[#E7D5BC] text-xs">
            <div>
              <span className="text-[#8C8279] text-[10px] block uppercase font-bold tracking-wider">Tracking Reference</span>
              <strong className="text-sm font-black text-[#B5532E] font-mono">{searchedRef}</strong>
            </div>
            <div className="text-right">
              <span className="text-[#8C8279] text-[10px] block uppercase font-bold tracking-wider">Courier Partner</span>
              <strong className="text-xs text-[#4F6B3A] font-bold">
                {primaryParcel?.carrier || 'Manga Express Nationwide'}
              </strong>
            </div>
          </div>

          {/* Vendor Parcel Card */}
          {primaryParcel && (
            <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#E7D5BC]/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <i className="fas fa-box text-[#B5532E]"></i>
                <span className="text-[#2A2320] font-medium">Parcel from <strong>{primaryParcel.vendorName}</strong></span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#4F6B3A]/15 text-[#4F6B3A]">
                {primaryParcel.status.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>
          )}

          {/* Stepper with Manga Defined Colors */}
          <div className="space-y-4 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E7D5BC]">
            {/* Step 1: Placed */}
            <div className="flex items-start gap-4 relative">
              <span className="w-7 h-7 rounded-full bg-[#4F6B3A] text-white flex items-center justify-center text-xs flex-shrink-0 z-10 shadow-2xs">
                <i className="fas fa-check"></i>
              </span>
              <div>
                <h5 className="font-bold text-xs text-[#2A2320]">Order Placed & Payment Verified</h5>
                <p className="text-[11px] text-[#8C8279]">Payment confirmed securely for verified seller dispatch.</p>
                <span className="text-[10px] text-[#4F6B3A] font-medium">Completed</span>
              </div>
            </div>

            {/* Step 2: Quality Inspection */}
            <div className="flex items-start gap-4 relative">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 z-10 shadow-2xs ${
                orderStatus === 'confirmed' || orderStatus === 'in_transit' || orderStatus === 'delivered'
                  ? 'bg-[#4F6B3A] text-white'
                  : 'bg-[#E7D5BC] text-[#8C8279]'
              }`}>
                <i className="fas fa-check"></i>
              </span>
              <div>
                <h5 className="font-bold text-xs text-[#2A2320]">Quality Check & Vendor Packing</h5>
                <p className="text-[11px] text-[#8C8279]">
                  {primaryParcel ? `Verified by ${primaryParcel.vendorName}` : 'Inspected by verified merchant'}.
                </p>
                <span className="text-[10px] text-[#4F6B3A] font-medium">Verified</span>
              </div>
            </div>

            {/* Step 3: Transit */}
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
                <h5 className="font-bold text-xs text-[#2A2320]">Dispatch & Transit Hub</h5>
                <p className="text-[11px] text-[#8C8279]">
                  Assigned tracking {primaryParcel?.trackingNumber || searchedRef} via Manga Express Fleet.
                </p>
                <span className="text-[10px] text-[#3E5C76] font-bold">In Progress</span>
              </div>
            </div>

            {/* Step 4: Final Delivery */}
            <div className={`flex items-start gap-4 relative ${orderStatus === 'delivered' ? '' : 'opacity-60'}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 z-10 ${
                orderStatus === 'delivered' ? 'bg-[#4F6B3A] text-white' : 'bg-[#E7D5BC] text-[#8C8279]'
              }`}>
                <i className="fas fa-box-open"></i>
              </span>
              <div>
                <h5 className="font-bold text-xs text-[#2A2320]">Doorstep Delivery & Handover</h5>
                <p className="text-[11px] text-[#8C8279]">Courier delivers to destination. Same-day delivery for Kaduna orders.</p>
                <span className="text-[10px] text-[#8C8279]">
                  {primaryParcel?.estimatedDelivery || 'Tomorrow, by 5:00 PM'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF6F0] border-t border-[#E7D5BC]/60 flex items-center justify-between text-xs text-[#8C8279]">
          <span className="text-[11px]">Direct Support: 0700-62642-NG</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#E7D5BC]/60 hover:bg-[#E7D5BC] text-[#2A2320] font-bold transition-colors border-0 cursor-pointer text-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
