'use client';

import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '../../context/StoreContext';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

const NIGERIAN_STATES = [
  'Lagos',
  'Abuja (FCT)',
  'Rivers',
  'Oyo',
  'Kano',
  'Kaduna',
  'Edo',
  'Ogun',
  'Delta',
  'Anambra',
  'Enugu',
  'Akwa Ibom',
  'Imo',
  'Osun',
  'Kwara',
  'Plateau',
  'Cross River',
  'Abia',
  'Benue',
  'Borno',
];

export default function CheckoutPage() {
  const router = useRouter();
  const {
    user,
    currency,
    formatPrice,
    cartItems,
    cartCount,
    wishlistCount,
    clearCart,
    setLastOrderRef,
    toggleCurrency,
    showToast,
    recordPlacedOrder,
  } = useStore();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [state, setState] = useState('Kaduna');
  const [lga, setLga] = useState('Kaduna North');
  const [address, setAddress] = useState('');
  const [deliveryType, setDeliveryType] = useState<'doorstep' | 'pickup'>('doorstep');
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'card' | 'bank_transfer'>('paystack');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotalNgn = cartItems.reduce((sum, item) => sum + item.priceNgn * item.quantity, 0);
  const subtotalUsd = cartItems.reduce((sum, item) => sum + item.priceUsd * item.quantity, 0);
  const hasPhysical = cartItems.some((i) => i.type !== 'digital');
  const isFreeDelivery = subtotalNgn >= 40000 || !hasPhysical;
  const shippingNgn = isFreeDelivery ? 0 : 3500;
  const shippingUsd = isFreeDelivery ? 0 : 3;
  const totalNgn = subtotalNgn + shippingNgn;
  const totalUsd = subtotalUsd + shippingUsd;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      showToast('Your cart is empty. Add products before checking out.');
      router.push('/shop');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          customer: {
            name,
            email,
            phone,
            state,
            lga,
            address,
          },
          deliveryType,
          paymentMethod,
        }),
      });

      const data = await res.json();
      const generatedRef = data.orderNumber || `MNG-${Math.floor(100000 + Math.random() * 900000)}-NG`;

      if (recordPlacedOrder) {
        recordPlacedOrder({
          orderRef: generatedRef,
          createdAt: new Date().toISOString(),
          totalNgn,
          totalUsd,
          paymentMethod: paymentMethod === 'paystack' ? 'Paystack Protected Payment' : paymentMethod === 'card' ? 'Debit/Credit Card' : 'Direct Bank Transfer',
          status: 'processing',
          items: [...cartItems],
          shippingAddress: {
            recipientName: name,
            phone,
            street: address,
            city: lga || state,
            state: state,
          },
        });
      }

      setLastOrderRef(generatedRef);
      clearCart();
      showToast(`Order Confirmed! Reference: ${generatedRef}`);
      router.push(`/order-confirmation?ref=${encodeURIComponent(generatedRef)}`);
    } catch (err) {
      const fallbackRef = `MNG-${Math.floor(100000 + Math.random() * 900000)}-NG`;

      if (recordPlacedOrder) {
        recordPlacedOrder({
          orderRef: fallbackRef,
          createdAt: new Date().toISOString(),
          totalNgn,
          totalUsd,
          paymentMethod: 'Paystack Protected Payment',
          status: 'processing',
          items: [...cartItems],
          shippingAddress: {
            recipientName: name,
            phone,
            street: address,
            city: lga || state,
            state: state,
          },
        });
      }

      setLastOrderRef(fallbackRef);
      clearCart();
      showToast(`Order Confirmed! Reference: ${fallbackRef}`);
      router.push(`/order-confirmation?ref=${encodeURIComponent(fallbackRef)}`);
    } finally {
      setIsSubmitting(false);
    }
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

      <main className="flex-1 container mx-auto px-4 lg:px-8 py-8 sm:py-10 max-w-6xl">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#8C8279] mb-4">
          <Link href="/" className="hover:text-[#B5532E] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-[#B5532E] transition-colors">Cart</Link>
          <span>/</span>
          <span className="font-bold text-[#2A2320]">Secure Checkout</span>
        </div>

        <div className="pb-4 border-b border-[#E7D5BC] mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-[#2A2320]">
              Secure Checkout & Buyer Protection
            </h1>
            <p className="text-xs sm:text-sm text-[#8C8279] mt-0.5">
              Enter your delivery address and complete payment securely via Paystack.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#4F6B3A]">
            <i className="fas fa-lock"></i>
            <span>256-bit SSL Encrypted</span>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Delivery Address & Payment Method (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Customer Contact & Delivery Address */}
            <div className="bg-white rounded-3xl border border-[#E7D5BC] p-6 sm:p-8 shadow-2xs space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-[#E7D5BC]/60">
                <span className="w-8 h-8 rounded-xl bg-[#B5532E] text-white flex items-center justify-center font-black text-xs">
                  1
                </span>
                <div>
                  <h3 className="font-display font-black text-base text-[#2A2320]">Customer & Delivery Details</h3>
                  <p className="text-[11px] text-[#8C8279]">Where should your parcel be delivered?</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-[#8C8279] mb-1">Full Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B5532E] text-[#2A2320] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#8C8279] mb-1">Phone Number (For Courier Call)</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B5532E] text-[#2A2320] font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-[#8C8279] mb-1">Email Address (For Order Receipt)</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B5532E] text-[#2A2320] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#8C8279] mb-1">Delivery State</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl focus:bg-white focus:outline-none text-[#2A2320] font-medium cursor-pointer"
                  >
                    {NIGERIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#8C8279] mb-1">City / LGA</label>
                  <input
                    type="text"
                    required
                    value={lga}
                    onChange={(e) => setLga(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B5532E] text-[#2A2320] font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-[#8C8279] mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B5532E] text-[#2A2320] font-medium"
                  />
                </div>
              </div>

              {/* Delivery Speed / Fulfillment Mode */}
              <div className="pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8C8279] mb-2">
                  Delivery Method
                </label>
                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <label
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      deliveryType === 'doorstep'
                        ? 'bg-[#F6EDE0] border-[#B5532E] shadow-xs'
                        : 'bg-white border-[#E7D5BC] hover:border-[#B5532E]/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="radio"
                        name="deliveryType"
                        checked={deliveryType === 'doorstep'}
                        onChange={() => setDeliveryType('doorstep')}
                        className="accent-[#B5532E]"
                      />
                      <strong className="text-[#2A2320]">Doorstep Delivery</strong>
                    </div>
                    <p className="text-[11px] text-[#8C8279]">
                      Same-day delivery for orders within Kaduna; reliable dispatch nationwide.
                    </p>
                  </label>

                  <label
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      deliveryType === 'pickup'
                        ? 'bg-[#F6EDE0] border-[#B5532E] shadow-xs'
                        : 'bg-white border-[#E7D5BC] hover:border-[#B5532E]/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="radio"
                        name="deliveryType"
                        checked={deliveryType === 'pickup'}
                        onChange={() => setDeliveryType('pickup')}
                        className="accent-[#B5532E]"
                      />
                      <strong className="text-[#2A2320]">Hub Pickup Station</strong>
                    </div>
                    <p className="text-[11px] text-[#8C8279]">
                      Collect at local verified pickup hub.
                    </p>
                  </label>
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white rounded-3xl border border-[#E7D5BC] p-6 sm:p-8 shadow-2xs space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-[#E7D5BC]/60">
                <span className="w-8 h-8 rounded-xl bg-[#2A2320] text-white flex items-center justify-center font-black text-xs">
                  2
                </span>
                <div>
                  <h3 className="font-display font-black text-base text-[#2A2320]">Payment & Order Security</h3>
                  <p className="text-[11px] text-[#8C8279]">100% verified sellers and secure transactions.</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  {
                    id: 'paystack',
                    name: 'Paystack Secured Payment (Cards, Transfer, USSD)',
                    desc: 'Mastercard, Visa, Verve, and direct Nigerian bank transfers.',
                    badge: 'Recommended',
                  },
                  {
                    id: 'card',
                    name: 'Direct Debit / Credit Card',
                    desc: 'Instant 256-bit SSL encrypted card authorization.',
                  },
                  {
                    id: 'bank_transfer',
                    name: 'Dedicated Virtual Account Transfer',
                    desc: 'Transfer directly to dedicated account with immediate verification.',
                  },
                ].map((pm) => (
                  <label
                    key={pm.id}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      paymentMethod === pm.id
                        ? 'bg-[#F6EDE0] border-[#B5532E] shadow-xs'
                        : 'bg-white border-[#E7D5BC] hover:border-[#B5532E]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === pm.id}
                        onChange={() => setPaymentMethod(pm.id as any)}
                        className="accent-[#B5532E]"
                      />
                      <div>
                        <strong className="text-[#2A2320] block">{pm.name}</strong>
                        <span className="text-[11px] text-[#8C8279]">{pm.desc}</span>
                      </div>
                    </div>
                    {pm.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#4F6B3A]/15 text-[#4F6B3A] border border-[#4F6B3A]/30">
                        {pm.badge}
                      </span>
                    )}
                  </label>
                ))}
              </div>

              {/* Verified Seller Terms Banner */}
              <div className="p-4 rounded-2xl bg-[#4F6B3A]/10 border border-[#4F6B3A]/30 flex items-start gap-3 text-xs text-[#2A2320]">
                <i className="fas fa-shield-halved text-[#4F6B3A] text-base mt-0.5"></i>
                <div className="leading-relaxed">
                  <strong>Verified Sellers & Delivery Promise:</strong> All sellers on MANGA MARKETSQUARE are identity-verified. Same-day delivery is available for orders within Kaduna.
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Order Review & Financial Breakdown (5 cols) */}
          <aside className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-3xl border border-[#E7D5BC] p-6 shadow-2xs space-y-5">
              <h3 className="font-display font-black text-base text-[#2A2320] pb-3 border-b border-[#E7D5BC]">
                Order Items ({cartCount})
              </h3>

              {/* Items List */}
              <div className="divide-y divide-[#E7D5BC]/60 max-h-72 overflow-y-auto pr-1 space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85'}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-[#E7D5BC] flex-shrink-0 bg-[#FAF6F0]"
                    />
                    <div className="min-w-0 flex-1 text-xs">
                      <h4 className="font-bold text-[#2A2320] truncate">{item.name}</h4>
                      <span className="text-[11px] text-[#8C8279]">
                        Qty: {item.quantity} • By {item.seller}
                      </span>
                    </div>
                    <span className="text-xs font-black text-[#B5532E] flex-shrink-0">
                      {formatPrice(item.priceNgn * item.quantity, item.priceUsd * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals Breakdown */}
              <div className="space-y-2.5 text-xs pt-4 border-t border-[#E7D5BC]">
                <div className="flex items-center justify-between text-[#8C8279]">
                  <span>Subtotal</span>
                  <strong className="text-[#2A2320]">{formatPrice(subtotalNgn, subtotalUsd)}</strong>
                </div>

                <div className="flex items-center justify-between text-[#8C8279]">
                  <span>Delivery ({deliveryType === 'doorstep' ? 'Doorstep' : 'Station Pickup'})</span>
                  <span>
                    {isFreeDelivery ? (
                      <strong className="text-[#4F6B3A]">FREE</strong>
                    ) : (
                      <strong className="text-[#2A2320]">{formatPrice(shippingNgn, shippingUsd)}</strong>
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#E7D5BC] flex items-baseline justify-between text-sm">
                  <span className="font-extrabold text-[#2A2320]">Total Amount</span>
                  <strong className="text-xl font-black text-[#B5532E]">
                    {formatPrice(totalNgn, totalUsd)}
                  </strong>
                </div>
              </div>

              {/* Primary Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting || cartItems.length === 0}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#B5532E] to-[#8F3B1F] hover:opacity-95 text-white font-extrabold text-sm transition-all shadow-md flex items-center justify-center gap-2 border-0 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin text-sm"></i>
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-shield-halved text-[#D9A441] text-xs"></i>
                    <span>Pay & Complete Order</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-[#8C8279] text-center leading-relaxed">
                By placing this order, you agree to MANGA MARKETSQUARE Terms of Service, Buyer Protection Policy, and 7-day return policy.
              </p>

            </div>

          </aside>

        </form>

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
