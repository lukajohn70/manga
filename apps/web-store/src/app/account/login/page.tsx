'use client';

import * as React from 'react';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '../../../context/StoreContext';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loginCustomer, cartCount, wishlistCount } = useStore();

  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'lookup'>(initialTab);

  // Sign In Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Quick Order Lookup
  const [orderRef, setOrderRef] = useState('');

  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect to /account
  useEffect(() => {
    if (user) {
      router.push('/account');
    }
  }, [user, router]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setError('Please provide a valid email address.');
      return;
    }
    setError(null);
    loginCustomer(loginEmail, loginEmail.split('@')[0]);
    router.push('/account');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      setError('Please provide your full name and email address.');
      return;
    }
    setError(null);
    loginCustomer(regEmail, regName, regPhone);
    router.push('/account');
  };

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderRef.trim()) {
      setError('Please provide an order number.');
      return;
    }
    router.push(`/track-order?ref=${encodeURIComponent(orderRef.trim())}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#2A2320]">
      <Header cartCount={cartCount} wishlistCount={wishlistCount} />

      <main className="flex-1 py-12 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md w-full">
          
          {/* Card */}
          <div className="bg-white rounded-3xl border border-[#E7D5BC] shadow-xl p-6 sm:p-8">
            
            {/* Header Icon & Title */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#F6EDE0] text-[#B5532E] flex items-center justify-center text-xl mx-auto mb-3 shadow-2xs">
                <i className="fas fa-user-shield"></i>
              </div>
              <h1 className="text-xl sm:text-2xl font-black font-display text-[#2A2320]">
                MARKETSQUARE Buyer Portal
              </h1>
              <p className="text-xs text-[#8C8279] mt-1">
                Access your orders, saved addresses, and protected purchases.
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <i className="fas fa-circle-exclamation text-red-500"></i>
                <span>{error}</span>
              </div>
            )}

            {/* Tab Switcher */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-[#FAF6F0] rounded-2xl border border-[#E7D5BC] mb-6 text-xs font-bold text-center">
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setError(null); }}
                className={`py-2 rounded-xl transition-all cursor-pointer border-0 ${
                  activeTab === 'login'
                    ? 'bg-[#B5532E] text-white shadow-xs'
                    : 'bg-transparent text-[#8C8279] hover:text-[#2A2320]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('register'); setError(null); }}
                className={`py-2 rounded-xl transition-all cursor-pointer border-0 ${
                  activeTab === 'register'
                    ? 'bg-[#B5532E] text-white shadow-xs'
                    : 'bg-transparent text-[#8C8279] hover:text-[#2A2320]'
                }`}
              >
                Register
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('lookup'); setError(null); }}
                className={`py-2 rounded-xl transition-all cursor-pointer border-0 ${
                  activeTab === 'lookup'
                    ? 'bg-[#B5532E] text-white shadow-xs'
                    : 'bg-transparent text-[#8C8279] hover:text-[#2A2320]'
                }`}
              >
                Find Order
              </button>
            </div>

            {/* TAB 1: SIGN IN */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#2A2320] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. buyer@manga.ng"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs text-[#2A2320] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E] transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[#2A2320]">Password</label>
                    <span className="text-[11px] text-[#8C8279] hover:text-[#B5532E] cursor-pointer">
                      Forgot?
                    </span>
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs text-[#2A2320] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E] transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#B5532E] hover:bg-[#8F3B1F] text-white font-bold text-xs rounded-xl shadow-md transition-all border-0 cursor-pointer flex items-center justify-center gap-2"
                >
                  <i className="fas fa-lock text-[#D9A441]"></i>
                  <span>Sign In as Customer</span>
                </button>
              </form>
            )}

            {/* TAB 2: REGISTER */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#2A2320] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amina Bello"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs text-[#2A2320] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A2320] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. amina@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs text-[#2A2320] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A2320] mb-1">
                    Phone Number (for SMS Delivery Updates)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 800 000 0000"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs text-[#2A2320] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A2320] mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Create a strong password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs text-[#2A2320] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E] transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#B5532E] hover:bg-[#8F3B1F] text-white font-bold text-xs rounded-xl shadow-md transition-all border-0 cursor-pointer flex items-center justify-center gap-2"
                >
                  <i className="fas fa-user-plus text-[#D9A441]"></i>
                  <span>Create Free Buyer Account</span>
                </button>
              </form>
            )}

            {/* TAB 3: FIND ORDER */}
            {activeTab === 'lookup' && (
              <form onSubmit={handleLookupSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#2A2320] mb-1">
                    Order Reference ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MNG-2611-48K2F"
                    value={orderRef}
                    onChange={(e) => setOrderRef(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs text-[#2A2320] font-mono uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E] transition-all"
                  />
                </div>

                <p className="text-[11px] text-[#8C8279]">
                  Check live dispatch and courier tracking checkpoints without logging into an account.
                </p>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#2A2320] hover:bg-[#B5532E] text-white font-bold text-xs rounded-xl shadow-md transition-all border-0 cursor-pointer flex items-center justify-center gap-2"
                >
                  <i className="fas fa-location-crosshairs text-[#D9A441]"></i>
                  <span>Track Live Shipment</span>
                </button>
              </form>
            )}

            {/* Role Separation Notice Strip */}
            <div className="mt-6 pt-5 border-t border-[#E7D5BC]/60 p-3 bg-[#FAF6F0] rounded-2xl text-[11px] text-[#8C8279] space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#2A2320]">
                <i className="fas fa-shield-halved text-[#4F6B3A]"></i>
                <span>Role-Based Access Enforcement</span>
              </div>
              <p>
                This portal is for <strong>Buyers & Shoppers</strong>. If you are a merchant selling goods, enter via the{' '}
                <a
                  href="http://localhost:3001"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#B5532E] font-bold underline"
                >
                  Vendor Console
                </a>.
              </p>
            </div>

          </div>

        </div>
      </main>

      <Footer cartCount={cartCount} wishlistCount={wishlistCount} />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#8C8279]">Loading sign in portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}
