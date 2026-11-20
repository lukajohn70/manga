'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useStore, PlacedOrder } from '../../context/StoreContext';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export default function AccountPage() {
  const router = useRouter();
  const {
    user,
    orders,
    currency,
    formatPrice,
    cartCount,
    wishlistCount,
    wishlist,
    addToCart,
    logoutCustomer,
    updateCustomerProfile,
    toggleCurrency,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'addresses' | 'digital'>('overview');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [recipientName, setRecipientName] = useState(user?.defaultAddress?.recipientName || user?.name || '');
  const [phone, setPhone] = useState(user?.defaultAddress?.phone || user?.phone || '');
  const [street, setStreet] = useState(user?.defaultAddress?.street || '');
  const [city, setCity] = useState(user?.defaultAddress?.city || '');
  const [state, setState] = useState(user?.defaultAddress?.state || '');

  // Handle hash deep-linking (e.g. /account#orders)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      if (['overview', 'orders', 'addresses', 'digital'].includes(hash)) {
        setActiveTab(hash as any);
      }
    }
  }, []);

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerProfile({
      defaultAddress: {
        recipientName,
        phone,
        street,
        city,
        state,
      },
    });
    setIsEditingAddress(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1D1917]">
        <Header cartCount={cartCount} wishlistCount={wishlistCount} />
        <main className="flex-1 container mx-auto px-4 lg:px-8 py-16 flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#EAE3D9] shadow-xs text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] text-[#B5532E] flex items-center justify-center text-xl mx-auto mb-4 border border-[#EAE3D9]">
              <i className="far fa-user"></i>
            </div>
            <h2 className="apple-heading text-xl font-bold text-[#1D1917] mb-2 tracking-tight">
              Sign In to Your Account
            </h2>
            <p className="apple-subhead text-xs text-[#78716C] mb-6 leading-relaxed font-normal">
              Sign in with your buyer account to access order tracking, saved delivery addresses, and digital licenses.
            </p>
            <motion.div whileTap={{ scale: 0.97 }}>
              <Link
                href="/account/login"
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
        <Footer cartCount={cartCount} wishlistCount={wishlistCount} />
      </div>
    );
  }

  const activeShipments = orders.filter((o) =>
    ['processing', 'dispatched', 'in_transit'].includes(o.status)
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1D1917]">
      <Header cartCount={cartCount} wishlistCount={wishlistCount} />

      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 lg:px-8">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#78716C] mb-6">
            <Link href="/" className="hover:text-[#B5532E] no-underline text-[#78716C]">Home</Link>
            <span>/</span>
            <span className="font-semibold text-[#1D1917]">Buyer Account</span>
          </div>

          {/* User Hero Banner: Apple Dark Finish */}
          <div className="apple-glass-dark rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden border border-white/15">
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/10 text-white flex items-center justify-center text-2xl font-bold border border-white/15 shadow-inner">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="apple-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {user.name}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[#E7D5BC] border border-white/15 text-[10px] font-semibold tracking-wider">
                      {user.role === 'ADMIN' ? 'Platform Admin' : user.role === 'VENDOR' ? 'Merchant Partner' : 'Verified Buyer'}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 mt-1 font-normal">
                    {user.email} • {user.phone || '+234 803 123 4567'}
                  </p>
                  {user.role !== 'BUYER' && (
                    <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 bg-white/[0.08] rounded-lg text-[11px] text-[#E7D5BC] border border-white/10">
                      <i className="fas fa-arrow-up-right-from-square text-[10px]"></i>
                      <span>
                        Access your dedicated console:{' '}
                        <Link
                          href={user.role === 'ADMIN' ? '/admin' : '/sell'}
                          className="underline font-semibold text-white hover:text-[#E7D5BC]"
                        >
                          {user.role === 'ADMIN' ? 'Platform Operations Hub' : 'Merchant Partner Portal'}
                        </Link>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={logoutCustomer}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white transition-colors cursor-pointer flex items-center gap-1.5 apple-pressable"
                >
                  <i className="fas fa-arrow-right-from-bracket text-xs"></i>
                  <span>Sign Out</span>
                </motion.button>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/15 text-center sm:text-left">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#D9A441] block">Total Orders</span>
                <strong className="text-xl font-black text-white">{orders.length}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#D9A441] block">Active Shipments</span>
                <strong className="text-xl font-black text-white">{activeShipments}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#D9A441] block">Saved Wishlist</span>
                <strong className="text-xl font-black text-white">{wishlistCount}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#D9A441] block">Buyer Protection</span>
                <strong className="text-xl font-black text-[#4F6B3A] flex items-center justify-center sm:justify-start gap-1">
                  <i className="fas fa-shield-halved text-xs"></i> Active
                </strong>
              </div>
            </div>
          </div>

          {/* Account Portal Tabs & Content Grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar Navigation (3 cols) */}
            <aside className="lg:col-span-3 bg-white rounded-3xl border border-[#E7D5BC] p-3 shadow-2xs space-y-1">
              {[
                { id: 'overview', label: 'Account Overview', icon: 'fa-chart-pie' },
                { id: 'orders', label: `My Orders (${orders.length})`, icon: 'fa-box' },
                { id: 'addresses', label: 'Delivery Addresses', icon: 'fa-location-dot' },
                { id: 'digital', label: 'Digital Licenses & Vault', icon: 'fa-key' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    window.location.hash = tab.id;
                  }}
                  className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-between border-0 cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#B5532E] text-white shadow-sm'
                      : 'bg-transparent hover:bg-[#FAF6F0] text-[#2A2320]'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <i className={`fas ${tab.icon} text-xs ${activeTab === tab.id ? 'text-[#D9A441]' : 'text-[#8C8279]'}`}></i>
                    <span>{tab.label}</span>
                  </span>
                  <i className="fas fa-chevron-right text-[9px] opacity-70"></i>
                </button>
              ))}

              <div className="pt-2 border-t border-[#E7D5BC]/60 mt-2 space-y-1">
                <Link
                  href="/wishlist"
                  className="w-full text-left px-4 py-2.5 rounded-2xl font-medium text-xs text-[#2A2320] hover:bg-[#FAF6F0] hover:text-[#B5532E] flex items-center justify-between block"
                >
                  <span className="flex items-center gap-3">
                    <i className="fas fa-heart text-[#8C8279] text-xs"></i>
                    <span>Saved Wishlist ({wishlistCount})</span>
                  </span>
                  <i className="fas fa-arrow-up-right-from-square text-[9px] text-[#8C8279]"></i>
                </Link>

                <Link
                  href="/track-order"
                  className="w-full text-left px-4 py-2.5 rounded-2xl font-medium text-xs text-[#2A2320] hover:bg-[#FAF6F0] hover:text-[#B5532E] flex items-center justify-between block"
                >
                  <span className="flex items-center gap-3">
                    <i className="fas fa-truck-fast text-[#8C8279] text-xs"></i>
                    <span>Track Order by ID</span>
                  </span>
                  <i className="fas fa-arrow-up-right-from-square text-[9px] text-[#8C8279]"></i>
                </Link>
              </div>
            </aside>

            {/* Main Tab Content (9 cols) */}
            <div className="lg:col-span-9 space-y-6">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  
                  {/* Recent Orders Card */}
                  <div className="bg-white rounded-3xl border border-[#E7D5BC] p-6 shadow-2xs">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E7D5BC]/60">
                      <div>
                        <h2 className="text-base font-black text-[#2A2320] font-display">
                          Recent Orders & Shipments
                        </h2>
                        <p className="text-xs text-[#8C8279]">
                          Track live delivery progress across verified logistics partners.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('orders')}
                        className="text-xs font-bold text-[#B5532E] hover:underline"
                      >
                        View All ({orders.length}) →
                      </button>
                    </div>

                    <div className="space-y-4">
                      {orders.slice(0, 2).map((order) => (
                        <div
                          key={order.orderRef}
                          className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E7D5BC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <strong className="text-xs font-mono font-black text-[#B5532E]">
                                {order.orderRef}
                              </strong>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                                order.status === 'delivered'
                                  ? 'bg-[#4F6B3A]/15 text-[#4F6B3A]'
                                  : 'bg-[#D9A441]/20 text-[#8F3B1F]'
                              }`}>
                                {order.status.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-xs text-[#2A2320] font-semibold">
                              {order.items.map((i) => i.name).join(', ')}
                            </p>
                            <span className="text-[11px] text-[#8C8279]">
                              Placed {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} item(s) • Total: {formatPrice(order.totalNgn, order.totalUsd)}
                            </span>
                          </div>

                          <Link
                            href={`/track-order?ref=${encodeURIComponent(order.orderRef)}`}
                            className="px-4 py-2 rounded-xl bg-[#2A2320] hover:bg-[#B5532E] text-white font-bold text-xs transition-colors shadow-2xs whitespace-nowrap"
                          >
                            Track Live Status
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Address Card */}
                  <div className="bg-white rounded-3xl border border-[#E7D5BC] p-6 shadow-2xs">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E7D5BC]/60">
                      <div>
                        <h2 className="text-base font-black text-[#2A2320] font-display">
                          Default Delivery Address
                        </h2>
                        <p className="text-xs text-[#8C8279]">
                          Pre-filled at checkout for one-click express ordering.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('addresses')}
                        className="text-xs font-bold text-[#B5532E] hover:underline"
                      >
                        Manage Addresses →
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E7D5BC]">
                      <div className="flex items-center gap-2 font-bold text-xs text-[#2A2320] mb-1">
                        <i className="fas fa-location-dot text-[#B5532E]"></i>
                        <span>{user.defaultAddress?.recipientName || user.name}</span>
                        <span className="text-[10px] bg-white border border-[#E7D5BC] px-1.5 py-0.5 rounded font-normal text-[#8C8279]">Primary</span>
                      </div>
                      <p className="text-xs text-[#8C8279]">
                        {user.defaultAddress?.street
                          ? `${user.defaultAddress.street}, ${user.defaultAddress.city}, ${user.defaultAddress.state}`
                          : 'No delivery address saved yet. Add your address in the Addresses tab.'}
                      </p>
                      <p className="text-xs text-[#8C8279] mt-0.5 font-mono">
                        Phone: {user.defaultAddress?.phone || user.phone || 'Not provided'}
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: MY ORDERS */}
              {activeTab === 'orders' && (
                <div className="bg-white rounded-3xl border border-[#E7D5BC] p-6 shadow-2xs space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E7D5BC]/60">
                    <div>
                      <h2 className="text-base font-black text-[#2A2320] font-display">
                        Customer Orders History
                      </h2>
                      <p className="text-xs text-[#8C8279]">
                        Review past purchases, download invoices, and inspect real-time courier checkpoints.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#8C8279]">
                      {orders.length} Total Orders
                    </span>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <i className="fas fa-box-open text-4xl text-[#8C8279] mb-3"></i>
                      <p className="text-sm font-bold text-[#2A2320]">No orders found</p>
                      <Link href="/shop" className="text-xs font-bold text-[#B5532E] underline mt-1 block">
                        Browse marketplace products
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.orderRef}
                          className="p-5 rounded-2xl bg-[#FAF6F0] border border-[#E7D5BC] hover:border-[#B5532E]/40 transition-all space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-[#E7D5BC]/60">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-black text-[#B5532E]">
                                  {order.orderRef}
                                </span>
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  order.status === 'delivered'
                                    ? 'bg-[#4F6B3A]/20 text-[#4F6B3A]'
                                    : 'bg-[#D9A441]/25 text-[#8F3B1F]'
                                }`}>
                                  {order.status.replace('_', ' ')}
                                </span>
                              </div>
                              <span className="text-[11px] text-[#8C8279]">
                                Placed on {new Date(order.createdAt).toLocaleString()} • {order.paymentMethod}
                              </span>
                            </div>

                            <div className="text-left sm:text-right">
                              <span className="text-base font-black text-[#2A2320] block">
                                {formatPrice(order.totalNgn, order.totalUsd)}
                              </span>
                              <span className="text-[10px] text-[#4F6B3A] font-semibold">
                                Protected Order
                              </span>
                            </div>
                          </div>

                          {/* Items List */}
                          <div className="space-y-3">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-3">
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-12 h-12 rounded-xl object-cover border border-[#E7D5BC] flex-shrink-0"
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-bold text-[#2A2320] truncate">
                                    {item.name}
                                  </h4>
                                  <p className="text-[11px] text-[#8C8279]">
                                    Qty: {item.quantity} • Sold by {item.seller}
                                  </p>
                                </div>
                                <span className="text-xs font-bold text-[#2A2320]">
                                  {formatPrice(item.priceNgn * item.quantity, item.priceUsd * item.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Actions */}
                          <div className="pt-3 border-t border-[#E7D5BC]/60 flex flex-wrap items-center justify-between gap-3">
                            <span className="text-[11px] text-[#8C8279]">
                              <i className="fas fa-truck text-[#4F6B3A] mr-1"></i>
                              Delivery to {order.shippingAddress.city}, {order.shippingAddress.state}
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => window.print()}
                                className="px-3 py-1.5 rounded-lg bg-white border border-[#E7D5BC] text-xs font-bold text-[#2A2320] hover:bg-[#FAF6F0] transition-colors"
                              >
                                <i className="fas fa-print mr-1 text-[#8C8279]"></i> Invoice
                              </button>
                              <Link
                                href={`/track-order?ref=${encodeURIComponent(order.orderRef)}`}
                                className="px-4 py-1.5 rounded-lg bg-[#B5532E] hover:bg-[#8F3B1F] text-white text-xs font-bold transition-colors shadow-2xs"
                              >
                                <i className="fas fa-location-crosshairs mr-1"></i> Track Order
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: ADDRESSES */}
              {activeTab === 'addresses' && (
                <div className="bg-white rounded-3xl border border-[#E7D5BC] p-6 shadow-2xs space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E7D5BC]/60">
                    <div>
                      <h2 className="text-base font-black text-[#2A2320] font-display">
                        Manage Delivery Addresses
                      </h2>
                      <p className="text-xs text-[#8C8279]">
                        Store delivery destinations for faster, single-tap checkout.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditingAddress(!isEditingAddress)}
                      className="px-4 py-2 rounded-xl bg-[#FAF6F0] hover:bg-[#F6EDE0] text-[#B5532E] font-bold text-xs border border-[#E7D5BC] transition-colors"
                    >
                      {isEditingAddress ? 'Cancel' : 'Edit Primary Address'}
                    </button>
                  </div>

                  {isEditingAddress ? (
                    <form onSubmit={handleSaveAddress} className="space-y-4 max-w-lg">
                      <div>
                        <label className="block text-xs font-bold text-[#2A2320] mb-1">Recipient Name</label>
                        <input
                          type="text"
                          required
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs text-[#2A2320] focus:outline-none focus:ring-1 focus:ring-[#B5532E]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#2A2320] mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs text-[#2A2320] focus:outline-none focus:ring-1 focus:ring-[#B5532E]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#2A2320] mb-1">Street Address</label>
                        <input
                          type="text"
                          required
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs text-[#2A2320] focus:outline-none focus:ring-1 focus:ring-[#B5532E]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#2A2320] mb-1">City</label>
                          <input
                            type="text"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs text-[#2A2320] focus:outline-none focus:ring-1 focus:ring-[#B5532E]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#2A2320] mb-1">State</label>
                          <input
                            type="text"
                            required
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs text-[#2A2320] focus:outline-none focus:ring-1 focus:ring-[#B5532E]"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-[#B5532E] hover:bg-[#8F3B1F] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                      >
                        Save Delivery Address
                      </button>
                    </form>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-5 rounded-2xl bg-[#FAF6F0] border border-[#B5532E]/30 relative">
                        <span className="absolute top-4 right-4 text-[10px] bg-[#4F6B3A]/20 text-[#4F6B3A] font-bold px-2 py-0.5 rounded-full">
                          Default Shipping
                        </span>
                        <h4 className="font-bold text-xs text-[#2A2320] mb-1">
                          {user.defaultAddress?.recipientName || user.name}
                        </h4>
                        {user.defaultAddress?.street ? (
                          <p className="text-xs text-[#8C8279] leading-relaxed">
                            {user.defaultAddress.street}<br />
                            {user.defaultAddress.city}, {user.defaultAddress.state}<br />
                            Nigeria
                          </p>
                        ) : (
                          <p className="text-xs text-[#8C8279] italic leading-relaxed">
                            No default delivery address configured yet. Click Edit below to save your delivery location.
                          </p>
                        )}
                        <p className="text-xs font-mono text-[#8C8279] mt-2">
                          Phone: {user.defaultAddress?.phone || user.phone || 'Not provided'}
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-white border border-dashed border-[#E7D5BC] flex flex-col items-center justify-center text-center p-6">
                        <i className="fas fa-plus text-[#8C8279] text-xl mb-2"></i>
                        <span className="text-xs font-bold text-[#2A2320]">Add Secondary Address</span>
                        <p className="text-[11px] text-[#8C8279] mt-0.5">e.g. Office, Family, Workshop</p>
                        <button
                          type="button"
                          onClick={() => setIsEditingAddress(true)}
                          className="mt-3 px-4 py-1.5 bg-[#FAF6F0] hover:bg-[#F6EDE0] text-xs font-bold text-[#B5532E] rounded-xl border border-[#E7D5BC]"
                        >
                          Add Address
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: DIGITAL LICENSES */}
              {activeTab === 'digital' && (
                <div className="bg-white rounded-3xl border border-[#E7D5BC] p-6 shadow-2xs space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E7D5BC]/60">
                    <div>
                      <h2 className="text-base font-black text-[#2A2320] font-display">
                        Digital Software & Licenses Vault
                      </h2>
                      <p className="text-xs text-[#8C8279]">
                        Instant access to downloaded codebases, typography, and SaaS templates.
                      </p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#FAF6F0] border border-[#E7D5BC] space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase text-[#4F6B3A] bg-[#4F6B3A]/15 px-2 py-0.5 rounded-full border border-[#4F6B3A]/30">
                          Lifetime Commercial License
                        </span>
                        <h4 className="font-bold text-sm text-[#2A2320] mt-1">
                          SaaS UI Design System & Figma Pro Kit
                        </h4>
                        <p className="text-xs text-[#8C8279]">
                          Issued by DesignCraft Labs • Licensed to {user.name} ({user.email})
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold bg-white px-3 py-1.5 rounded-xl border border-[#E7D5BC] text-[#2A2320]">
                        LIC-MNG-9281-FGPRO
                      </span>
                    </div>

                    <div className="pt-3 border-t border-[#E7D5BC]/60 flex items-center justify-between">
                      <span className="text-[11px] text-[#8C8279]">
                        <i className="fas fa-check-circle text-[#4F6B3A] mr-1"></i> Verified Authentic License
                      </span>
                      <button
                        type="button"
                        onClick={() => alert('Initiating secure file download: manga-figma-pro-system-v2.fig')}
                        className="px-4 py-2 bg-[#B5532E] hover:bg-[#8F3B1F] text-white text-xs font-bold rounded-xl shadow-2xs flex items-center gap-1.5 border-0 cursor-pointer"
                      >
                        <i className="fas fa-download"></i>
                        <span>Download Asset (.FIG)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </main>

      <Footer cartCount={cartCount} wishlistCount={wishlistCount} />
    </div>
  );
}
