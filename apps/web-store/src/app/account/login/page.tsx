'use client';

import * as React from 'react';
import { useState, useEffect, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '../../../context/StoreContext';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { calculateTotpCode, DEMO_CREDENTIALS } from '@manga/api-client';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loginCustomer, cartCount, wishlistCount } = useStore();

  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'lookup'>(initialTab);

  // Sign In Flow State
  const [authStep, setAuthStep] = useState<'credentials' | '2fa'>('credentials');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [twoFaMethod, setTwoFaMethod] = useState<'google_authenticator' | 'email'>('google_authenticator');
  const [twoFaCode, setTwoFaCode] = useState('');
  const [challengeToken, setChallengeToken] = useState<string | null>(null);
  const [totpSecret, setTotpSecret] = useState('JBSWY3DPEHPK3PXP');
  const [testOtp, setTestOtp] = useState<string | null>(null);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Quick Order Lookup
  const [orderRef, setOrderRef] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to /account
  useEffect(() => {
    if (user) {
      router.push('/account');
    }
  }, [user, router]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError('Please provide your email address and password.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: loginEmail.trim(),
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed. Please check your credentials.');
      }

      setChallengeToken(data.challengeToken || 'chal_' + Date.now());
      setTotpSecret(data.totpSecret || 'JBSWY3DPEHPK3PXP');
      setTestOtp(data.testOtp || null);
      setAuthStep('2fa');
      setTwoFaCode('');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2faSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challengeToken) {
      setAuthStep('credentials');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify-2fa',
          email: loginEmail,
          code: twoFaCode,
          totpSecret,
          challengeToken,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invalid 2FA verification code. Please check your authenticator or email.');
      }

      loginCustomer(
        data.user.email,
        data.user.name,
        data.user.phone || '+234 800 000 0000',
        data.user.role || 'BUYER',
        data.token
      );
      if (data.user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/account');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid 2FA verification code. Please check your authenticator or email.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setError('Please provide your full name, email address, and a secure password.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          email: regEmail,
          password: regPassword,
          name: regName,
          phone: regPhone,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed.');
      }

      loginCustomer(regEmail, regName, regPhone || '+234 800 000 0000', 'BUYER');
      router.push('/account');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
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
                Access your orders, saved addresses, and escrow-protected purchases.
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
                onClick={() => { setActiveTab('login'); setAuthStep('credentials'); setError(null); }}
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
              authStep === 'credentials' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#2A2320] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Enter your registered email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs text-[#2A2320] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E] transition-all"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-[#2A2320]">Password</label>
                    </div>
                    <input
                      type="password"
                      required
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs text-[#2A2320] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E] transition-all"
                    />
                  </div>

                  <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#E7D5BC] text-[11px] text-[#8C8279] space-y-1">
                    <span className="font-bold text-[#2A2320] block">2-Factor Authentication Protected:</span>
                    <span>Sign-in requires primary password verification followed by Google Authenticator TOTP or Email OTP.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#B5532E] hover:bg-[#8F3B1F] text-white font-bold text-xs rounded-xl shadow-md transition-all border-0 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-shield-alt text-[#D9A441]"></i>
                    <span>{loading ? 'Verifying...' : 'Proceed to 2FA Authentication →'}</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerify2faSubmit} className="space-y-4">
                  <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#E7D5BC] text-center">
                    <div className="text-xs font-bold text-[#2A2320]">Two-Factor Authentication</div>
                    <div className="text-[11px] text-[#8C8279]">Account: <strong>{loginEmail}</strong></div>
                  </div>

                  {/* 2FA Method Selector */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-[#FAF6F0] rounded-xl border border-[#E7D5BC]">
                    <button
                      type="button"
                      onClick={() => { setTwoFaMethod('google_authenticator'); setTwoFaCode(''); }}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all border-0 cursor-pointer ${
                        twoFaMethod === 'google_authenticator'
                          ? 'bg-[#B5532E] text-white shadow-xs'
                          : 'bg-transparent text-[#8C8279]'
                      }`}
                    >
                      Google Authenticator
                    </button>
                    <button
                      type="button"
                      onClick={() => { setTwoFaMethod('email'); setTwoFaCode(''); }}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all border-0 cursor-pointer ${
                        twoFaMethod === 'email'
                          ? 'bg-[#B5532E] text-white shadow-xs'
                          : 'bg-transparent text-[#8C8279]'
                      }`}
                    >
                      Email OTP Code
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2A2320] mb-1">
                      {twoFaMethod === 'google_authenticator'
                        ? 'Enter 6-Digit Google Authenticator TOTP Code'
                        : `Enter 6-Digit Code sent to ${loginEmail}`}
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="000000"
                      value={twoFaCode}
                      onChange={(e) => setTwoFaCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-2.5 bg-[#FAF6F0] border-2 border-[#B5532E] rounded-xl text-center text-lg font-mono tracking-widest text-[#2A2320] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>

                  {/* Interactive Helper Pill for instant verification */}
                  <div className="flex items-center justify-between p-2 bg-[#FAF6F0] rounded-xl border border-[#E7D5BC] text-[11px] text-[#8C8279]">
                    <span>
                      {twoFaMethod === 'google_authenticator' ? 'Live TOTP:' : 'Active OTP:'}{' '}
                      <strong className="text-[#B5532E]">
                        {twoFaMethod === 'google_authenticator' ? calculateTotpCode(totpSecret) : (testOtp || '882194')}
                      </strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const code = twoFaMethod === 'google_authenticator' ? calculateTotpCode(totpSecret) : (testOtp || '882194');
                        setTwoFaCode(code);
                      }}
                      className="text-[#B5532E] font-bold cursor-pointer hover:underline border-0 bg-transparent p-0"
                    >
                      (Click to Autofill)
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAuthStep('credentials')}
                      className="flex-1 py-2.5 bg-[#FAF6F0] hover:bg-[#E7D5BC] text-[#8C8279] hover:text-[#2A2320] font-bold text-xs rounded-xl border border-[#E7D5BC] transition-all cursor-pointer"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading || twoFaCode.length !== 6}
                      className={`flex-2 py-2.5 font-bold text-xs rounded-xl transition-all border-0 ${
                        loading || twoFaCode.length !== 6
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-[#B5532E] hover:bg-[#8F3B1F] text-white shadow-md cursor-pointer'
                      }`}
                    >
                      {loading ? 'Verifying 2FA...' : 'Complete Sign In'}
                    </button>
                  </div>
                </form>
              )
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
                  disabled={loading}
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
                <Link
                  href="/sell"
                  className="text-[#B5532E] font-bold underline hover:text-[#8F3B1F]"
                >
                  Seller Partner Portal
                </Link>. Platform operations administrators can access the{' '}
                <Link
                  href="/admin"
                  className="text-[#B5532E] font-bold underline hover:text-[#8F3B1F]"
                >
                  Operations Hub
                </Link>.
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
