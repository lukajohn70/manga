'use client';

import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RollingNumber } from '@manga/ui';

export interface CartItem {
  id: string;
  name: string;
  seller: string;
  priceNgn: number;
  priceUsd: number;
  image?: string;
  type: 'physical' | 'digital';
  quantity: number;
}

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedCheckout: () => void;
  currency: 'NGN' | 'USD';
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onProceedCheckout,
  currency,
}) => {
  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD_NGN = 40000;
  const subtotalNgn = items.reduce((sum, item) => sum + item.priceNgn * item.quantity, 0);
  const subtotalUsd = items.reduce((sum, item) => sum + item.priceUsd * item.quantity, 0);

  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_NGN - subtotalNgn);
  const shippingPercent = Math.min(100, Math.round((subtotalNgn / FREE_SHIPPING_THRESHOLD_NGN) * 100));

  const discountNgn = Math.round((subtotalNgn * discountPercent) / 100);
  const discountUsd = Math.round((subtotalUsd * discountPercent) / 100);

  const hasPhysical = items.some((i) => i.type === 'physical');
  const deliveryFeeNgn = hasPhysical && amountToFreeShipping > 0 ? 3500 : 0;
  const deliveryFeeUsd = hasPhysical && amountToFreeShipping > 0 ? 3 : 0;

  const totalNgn = subtotalNgn - discountNgn + deliveryFeeNgn;
  const totalUsd = subtotalUsd - discountUsd + deliveryFeeUsd;

  const formatPrice = (ngn: number, usd: number) => {
    return currency === 'NGN' ? `₦${ngn.toLocaleString()}` : `$${usd.toLocaleString()}`;
  };

  // Group items by seller
  const sellerGroups = items.reduce((acc, item) => {
    if (!acc[item.seller]) {
      acc[item.seller] = [];
    }
    acc[item.seller].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (coupon.trim().toUpperCase() === 'MANGA10' || coupon.trim().toUpperCase() === 'ZAVORA10') {
      setDiscountPercent(10);
      setCouponSuccess('10% VIP Discount Applied!');
    } else {
      setCouponError('Invalid coupon code. Try MANGA10');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer: Apple Spring Sheet */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
        className="relative w-full max-w-md bg-[#FAF7F2] h-full shadow-2xl flex flex-col z-10 overflow-hidden text-[#1D1917]"
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE3D9] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-[#FAF7F2] text-[#B5532E] flex items-center justify-center font-bold text-sm border border-[#EAE3D9]">
              <i className="fas fa-bag-shopping"></i>
            </span>
            <div>
              <h2 className="apple-heading font-bold text-base sm:text-lg text-[#1D1917] leading-tight tracking-tight">
                Shopping Bag
              </h2>
              <p className="text-[11px] text-[#78716C] font-normal">
                {items.length} unique item{items.length !== 1 ? 's' : ''} in your parcel
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-[#78716C] hover:text-[#1D1917] hover:bg-[#FAF7F2] flex items-center justify-center transition-colors border-0 bg-transparent cursor-pointer apple-pressable"
          >
            <i className="fas fa-times text-sm"></i>
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div className="p-3.5 bg-[#FAF6F0] border-b border-[#E7D5BC]/60 text-xs">
          <div className="flex items-center justify-between mb-1.5 font-semibold text-[11px]">
            {amountToFreeShipping <= 0 ? (
              <span className="text-[#4F6B3A] flex items-center gap-1 font-bold">
                <i className="fas fa-check-circle"></i> FREE Express Nationwide Delivery Unlocked!
              </span>
            ) : (
              <span className="text-[#2A2320]">
                Add <strong className="text-[#B5532E]">{currency === 'NGN' ? `₦${amountToFreeShipping.toLocaleString()}` : `$${Math.ceil(amountToFreeShipping / 1400)}`}</strong> for <strong className="text-[#B5532E]">FREE Express Delivery</strong>
              </span>
            )}
            <span className="text-[#8C8279] font-bold">{shippingPercent}%</span>
          </div>
          <div className="w-full bg-[#E7D5BC]/50 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#B5532E] to-[#D9A441] h-2 rounded-full transition-all duration-300"
              style={{ width: `${shippingPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Scrollable Cart Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-[#F6EDE0] text-[#B5532E] flex items-center justify-center text-2xl mx-auto mb-3">
                <i className="fas fa-bag-shopping"></i>
              </div>
              <h3 className="font-bold text-[#2A2320] text-sm mb-1">Your cart is empty</h3>
              <p className="text-xs text-[#8C8279] max-w-xs mx-auto mb-4">
                Explore authentic electronics, smartphones, fashion, and digital software on Manga.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-[#B5532E] text-white text-xs font-bold rounded-xl hover:bg-[#8F3B1F] transition-colors border-0 cursor-pointer shadow-xs"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            Object.entries(sellerGroups).map(([sellerName, sellerItems]) => (
              <div key={sellerName} className="rounded-2xl border border-[#E7D5BC]/80 p-4 bg-white shadow-2xs">
                
                {/* Seller Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-[#E7D5BC]/40 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#F6EDE0] text-[#B5532E] flex items-center justify-center text-[10px]">
                      <i className="fas fa-store"></i>
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-[#2A2320] leading-none">{sellerName}</h4>
                      <span className="text-[10px] text-[#4F6B3A] font-semibold">
                        <i className="fas fa-check-circle text-[8px]"></i> Fulfilled by Manga Express
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#8C8279] font-medium">
                    {sellerItems.length} item{sellerItems.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Items in this seller parcel */}
                <div className="divide-y divide-[#E7D5BC]/40">
                  {sellerItems.map((item) => (
                    <div key={item.id} className="py-3 flex items-start gap-3">
                      <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-[#E7D5BC]/60">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs bg-[#F6EDE0] text-[#B5532E] font-bold">
                            DIGITAL
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${item.type === 'digital' ? 'bg-[#3E5C76]/15 text-[#3E5C76]' : 'bg-[#F6EDE0] text-[#B5532E]'} mb-0.5`}>
                          {item.type === 'digital' ? 'Instant Download' : 'Physical Delivery'}
                        </span>
                        <h5 className="font-bold text-xs text-[#2A2320] truncate">{item.name}</h5>
                        <p className="text-xs font-black text-[#B5532E] mt-0.5">
                          {formatPrice(item.priceNgn, item.priceUsd)}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          {/* Qty Stepper */}
                          {item.type === 'physical' ? (
                            <div className="flex items-center border border-[#E7D5BC] rounded-lg overflow-hidden bg-[#FAF6F0] h-6">
                              <button
                                type="button"
                                onClick={() => onUpdateQty(item.id, Math.max(1, item.quantity - 1))}
                                className="w-6 h-full flex items-center justify-center text-[#8C8279] hover:bg-[#E7D5BC]/60 font-bold text-xs border-0 bg-transparent cursor-pointer"
                              >
                                -
                              </button>
                              <span className="w-7 text-center text-xs font-bold text-[#2A2320]">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                                className="w-6 h-full flex items-center justify-center text-[#8C8279] hover:bg-[#E7D5BC]/60 font-bold text-xs border-0 bg-transparent cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-[#8C8279] font-medium">Qty: 1</span>
                          )}

                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.id)}
                            className="text-[11px] text-[#B3261E] hover:text-[#8F3B1F] font-medium flex items-center gap-1 border-0 bg-transparent cursor-pointer"
                          >
                            <i className="far fa-trash-alt text-[10px]"></i>
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))
          )}

          {/* Coupon Code Strip */}
          {items.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E7D5BC]/80">
              <span className="text-[11px] font-bold text-[#2A2320] block mb-1.5">
                <i className="fas fa-tag text-[#B5532E] mr-1"></i> Have a promo code? (Try: MANGA10)
              </span>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter MANGA10"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#E7D5BC] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B5532E] uppercase font-mono text-[#2A2320]"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#B5532E] hover:bg-[#8F3B1F] text-white text-xs font-bold rounded-xl transition-colors border-0 cursor-pointer shadow-2xs"
                >
                  Apply
                </button>
              </form>
              {couponSuccess && (
                <p className="text-[11px] text-[#4F6B3A] font-bold mt-1.5 flex items-center gap-1">
                  <i className="fas fa-check-circle"></i> {couponSuccess}
                </p>
              )}
              {couponError && (
                <p className="text-[11px] text-[#B3261E] font-bold mt-1.5 flex items-center gap-1">
                  <i className="fas fa-circle-exclamation"></i> {couponError}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer & Checkout Button */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#E7D5BC]/60 bg-white space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#8C8279]">
                <span>Subtotal</span>
                <span className="font-bold text-[#2A2320]">{formatPrice(subtotalNgn, subtotalUsd)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-[#4F6B3A] font-bold">
                  <span>Discount ({discountPercent}%)</span>
                  <span>-{formatPrice(discountNgn, discountUsd)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#8C8279]">
                <span>Nationwide Shipping</span>
                <span className="font-bold text-[#2A2320]">
                  {deliveryFeeNgn === 0 ? (
                    <span className="text-[#4F6B3A] uppercase font-bold text-[11px]">FREE</span>
                  ) : (
                    formatPrice(deliveryFeeNgn, deliveryFeeUsd)
                  )}
                </span>
              </div>
              <div className="pt-2 border-t border-[#E7D5BC]/40 flex justify-between text-sm sm:text-base font-black text-[#2A2320]">
                <span>Total Due</span>
                <span className="text-[#B5532E]">
                  <RollingNumber
                    value={(currency === 'NGN' ? totalNgn : totalUsd).toLocaleString()}
                    prefix={currency === 'NGN' ? '₦' : '$'}
                  />
                </span>
              </div>
            </div>

            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.25 }}
              onClick={onProceedCheckout}
              className="w-full py-3.5 bg-[#B5532E] hover:bg-[#A04523] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 border-0 cursor-pointer apple-pressable"
            >
              <i className="fas fa-lock text-xs text-[#FAF7F2]"></i>
              <span>Proceed to Checkout</span>
              <i className="fas fa-arrow-right text-xs opacity-75"></i>
            </motion.button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-[#78716C] font-normal">
              <i className="fas fa-shield-halved text-[#4F6B3A]"></i>
              <span>256-bit SSL Paystack Secure Payment</span>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
};
