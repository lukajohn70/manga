'use client';

import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export default function CartPage() {
  const router = useRouter();
  const {
    currency,
    formatPrice,
    cartItems,
    cartCount,
    wishlistCount,
    updateQty,
    removeFromCart,
    clearCart,
    toggleCurrency,
    showToast,
  } = useStore();

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscountRate, setPromoDiscountRate] = useState<number>(0);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    if (clean === 'SQUARE10' || clean === 'MANGA10' || clean === 'MARKETSQUARE10') {
      setAppliedPromo('SQUARE10');
      setPromoDiscountRate(0.10);
      showToast('Promo code SQUARE10 applied: 10% discount!');
      setPromoCode('');
    } else if (clean === 'FREESHIP') {
      setAppliedPromo('FREESHIP');
      setPromoDiscountRate(0);
      showToast('Promo code FREESHIP applied: Free shipping on all parcels!');
      setPromoCode('');
    } else {
      showToast('Invalid promo code. Try SQUARE10 or FREESHIP.');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoDiscountRate(0);
    showToast('Promo code removed.');
  };

  // Group items by seller for multi-vendor parcel clarity
  const itemsBySeller = cartItems.reduce((acc, item) => {
    const key = item.seller || 'Official Vendor';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, typeof cartItems>);

  const subtotalNgn = cartItems.reduce((sum, item) => sum + item.priceNgn * item.quantity, 0);
  const subtotalUsd = cartItems.reduce((sum, item) => sum + item.priceUsd * item.quantity, 0);

  const hasPhysical = cartItems.some((i) => i.type !== 'digital');
  const isFreeDelivery = subtotalNgn >= 40000 || appliedPromo === 'FREESHIP' || !hasPhysical;
  const shippingNgn = isFreeDelivery ? 0 : 3500;
  const shippingUsd = isFreeDelivery ? 0 : 3;

  const discountNgn = Math.round(subtotalNgn * promoDiscountRate);
  const discountUsd = Math.round(subtotalUsd * promoDiscountRate);

  const totalNgn = Math.max(0, subtotalNgn - discountNgn + shippingNgn);
  const totalUsd = Math.max(0, subtotalUsd - discountUsd + shippingUsd);

  const freeDeliveryThreshold = 40000;
  const deliveryProgress = Math.min(100, Math.round((subtotalNgn / freeDeliveryThreshold) * 100));

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1D1917]">
      <Header
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onOpenCart={() => {}}
        onOpenWishlist={() => router.push('/wishlist')}
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
          <span className="font-semibold text-[#1D1917]">Bag & Cart</span>
        </div>

        <div className="flex items-center justify-between pb-4 border-b border-[#EAE3D9] mb-8">
          <div>
            <h1 className="apple-heading text-2xl sm:text-3xl font-bold text-[#1D1917] tracking-tight">
              Shopping Bag ({cartCount} {cartCount === 1 ? 'item' : 'items'})
            </h1>
            <p className="apple-subhead text-xs sm:text-sm text-[#78716C] mt-0.5 font-normal">
              Review your parcel groupings, adjust quantities, and apply vouchers.
            </p>
          </div>

          {cartItems.length > 0 && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={clearCart}
              className="text-xs font-semibold text-[#78716C] hover:text-[#B3261E] transition-colors bg-transparent border-0 cursor-pointer flex items-center gap-1.5 apple-pressable"
            >
              <i className="fas fa-trash-alt text-[10px]"></i>
              <span>Clear Bag</span>
            </motion.button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-[#EAE3D9] p-8 shadow-xs max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#FAF7F2] text-[#B5532E] flex items-center justify-center text-2xl mx-auto mb-4 border border-[#EAE3D9]">
              <i className="fas fa-bag-shopping"></i>
            </div>
            <h3 className="apple-heading font-bold text-xl text-[#1D1917] mb-2">Your Bag is Empty</h3>
            <p className="text-xs text-[#78716C] max-w-sm mx-auto mb-6 leading-relaxed">
              Looks like you haven't added anything to your cart yet. Explore authentic smartphones, laptops, audio, and digital licenses.
            </p>
            <Link
              href="/shop"
              className="px-7 py-3 rounded-xl bg-[#B5532E] hover:bg-[#A04523] text-white font-semibold text-xs transition-colors shadow-xs inline-flex items-center gap-2 no-underline apple-pressable"
            >
              <span>Explore Products</span>
              <i className="fas fa-arrow-right text-[10px] opacity-75"></i>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Cart Items & Multi-Vendor Groupings (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Free Delivery Meter */}
              {hasPhysical && (
                <div className="p-4 rounded-2xl bg-white border border-[#E7D5BC] shadow-2xs">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-[#2A2320] flex items-center gap-1.5">
                      <i className="fas fa-truck-fast text-[#4F6B3A]"></i>
                      {isFreeDelivery
                        ? 'You have qualified for FREE Express Delivery nationwide!'
                        : `Add ${formatPrice(freeDeliveryThreshold - subtotalNgn, Math.round((freeDeliveryThreshold - subtotalNgn) / 1400))} more to get Free Express Delivery`}
                    </span>
                    <span className="font-black text-[#4F6B3A]">{deliveryProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#FAF6F0] rounded-full overflow-hidden border border-[#E7D5BC]/60">
                    <div
                      className="h-full bg-gradient-to-r from-[#D9A441] to-[#4F6B3A] transition-all duration-500 rounded-full"
                      style={{ width: `${deliveryProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Multi-Vendor Parcel Breakdown */}
              {Object.entries(itemsBySeller).map(([sellerName, items], parcelIdx) => (
                <div
                  key={sellerName}
                  className="bg-white rounded-3xl border border-[#E7D5BC] shadow-2xs overflow-hidden"
                >
                  {/* Parcel Header */}
                  <div className="p-4 sm:p-5 bg-[#FAF6F0] border-b border-[#E7D5BC] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-[#B5532E]/15 text-[#B5532E] flex items-center justify-center text-xs font-bold">
                        {parcelIdx + 1}
                      </span>
                      <div>
                        <h4 className="font-bold text-xs text-[#2A2320]">
                          Parcel {parcelIdx + 1} of {Object.keys(itemsBySeller).length}: {sellerName}
                        </h4>
                        <span className="text-[10px] text-[#4F6B3A] font-medium">
                          <i className="fas fa-shield-halved mr-1"></i> 100% Verified Seller
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#8C8279] font-medium">
                      Estimated dispatch: 24h
                    </span>
                  </div>

                  {/* Parcel Items */}
                  <div className="divide-y divide-[#E7D5BC]/60 p-4 sm:p-6 space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85'}
                            alt={item.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-[#E7D5BC] flex-shrink-0 bg-[#FAF6F0]"
                          />
                          <div className="min-w-0 flex-1">
                            <Link
                              href={`/product/${item.id}`}
                              className="font-bold text-xs sm:text-sm text-[#2A2320] hover:text-[#B5532E] transition-colors line-clamp-2 block leading-snug"
                            >
                              {item.name}
                            </Link>
                            <span className="text-[11px] text-[#8C8279] block mt-1">
                              Unit Price: <strong>{formatPrice(item.priceNgn, item.priceUsd)}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Quantity and Actions */}
                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E7D5BC]/50">
                          {/* Stepper */}
                          <div className="flex items-center border border-[#E7D5BC] rounded-xl bg-[#FAF6F0] p-1">
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-lg bg-white text-[#2A2320] hover:bg-[#F6EDE0] font-bold text-xs flex items-center justify-center border-0 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-xs font-black text-[#2A2320]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-lg bg-white text-[#2A2320] hover:bg-[#F6EDE0] font-bold text-xs flex items-center justify-center border-0 cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          {/* Line total */}
                          <div className="text-right min-w-[90px]">
                            <span className="text-sm font-black text-[#B5532E] block">
                              {formatPrice(item.priceNgn * item.quantity, item.priceUsd * item.quantity)}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="text-[10px] text-[#8C8279] hover:text-[#B3261E] transition-colors font-medium bg-transparent border-0 cursor-pointer mt-0.5"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Continue Shopping CTA */}
              <div className="pt-2">
                <Link
                  href="/shop"
                  className="text-xs font-bold text-[#B5532E] hover:text-[#8F3B1F] inline-flex items-center gap-1.5 transition-colors"
                >
                  <i className="fas fa-arrow-left text-[10px]"></i>
                  <span>Continue Shopping More Categories</span>
                </Link>
              </div>

            </div>

            {/* Right Column: Order Summary & Voucher Checkout (4 cols) */}
            <aside className="lg:col-span-4 space-y-6">
              
              <div className="bg-white rounded-3xl border border-[#E7D5BC] p-6 shadow-2xs space-y-6">
                <h3 className="font-display font-black text-base text-[#2A2320] pb-3 border-b border-[#E7D5BC]">
                  Order Summary
                </h3>

                {/* Voucher Code Form */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8C8279] mb-1.5">
                    Promo Code / Voucher
                  </label>
                  {appliedPromo ? (
                    <div className="p-3 rounded-xl bg-[#4F6B3A]/10 border border-[#4F6B3A]/30 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-[#4F6B3A] block">{appliedPromo}</strong>
                        <span className="text-[10px] text-[#8C8279]">
                          {appliedPromo === 'FREESHIP' ? 'Free shipping applied' : '10% promotional discount applied'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="text-[10px] text-[#8C8279] hover:text-[#B3261E] font-bold bg-transparent border-0 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. MANGA10"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 px-3 py-2 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs font-mono uppercase focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B5532E] text-[#2A2320]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#2A2320] hover:bg-[#B5532E] text-white text-xs font-bold rounded-xl transition-colors border-0 cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                </div>

                {/* Financial Summary */}
                <div className="space-y-3 text-xs pt-3 border-t border-[#E7D5BC]/60">
                  <div className="flex items-center justify-between text-[#8C8279]">
                    <span>Items Subtotal</span>
                    <strong className="text-[#2A2320]">{formatPrice(subtotalNgn, subtotalUsd)}</strong>
                  </div>

                  {discountNgn > 0 && (
                    <div className="flex items-center justify-between text-[#4F6B3A]">
                      <span>Voucher Discount</span>
                      <strong>-{formatPrice(discountNgn, discountUsd)}</strong>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[#8C8279]">
                    <span>Estimated Shipping</span>
                    <span>
                      {isFreeDelivery ? (
                        <strong className="text-[#4F6B3A]">FREE</strong>
                      ) : (
                        <strong className="text-[#2A2320]">{formatPrice(shippingNgn, shippingUsd)}</strong>
                      )}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-[#E7D5BC] flex items-baseline justify-between text-sm">
                    <span className="font-extrabold text-[#2A2320]">Estimated Total</span>
                    <strong className="text-xl font-black text-[#B5532E]">
                      {formatPrice(totalNgn, totalUsd)}
                    </strong>
                  </div>
                </div>

                {/* Primary Proceed CTA with Spring Touch */}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.25 }}
                  onClick={() => router.push('/checkout')}
                  className="w-full py-3.5 rounded-xl bg-[#B5532E] hover:bg-[#A04523] text-white font-semibold text-sm transition-colors shadow-xs flex items-center justify-center gap-2 border-0 cursor-pointer apple-pressable"
                >
                  <i className="fas fa-lock text-[#FAF7F2] text-xs"></i>
                  <span>Proceed to Checkout</span>
                  <i className="fas fa-arrow-right text-xs opacity-75"></i>
                </motion.button>

                {/* Trust Signals */}
                <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#E7D5BC] space-y-2 text-[11px] text-[#8C8279]">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-shield-halved text-[#4F6B3A]"></i>
                    <span>256-bit SSL Secure Payment Protection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-rotate-left text-[#3E5C76]"></i>
                    <span>7 Days Free Replacement Guarantee</span>
                  </div>
                </div>

              </div>

            </aside>

          </div>
        )}

      </main>

      <Footer
        onOpenCart={() => {}}
        onOpenWishlist={() => router.push('/wishlist')}
        onOpenTrackOrder={() => router.push('/track-order')}
        onSelectCategory={(cat) => router.push(`/shop?category=${cat}`)}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
      />
    </div>
  );
}
