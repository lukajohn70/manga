'use client';

import * as React from 'react';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '../../../context/StoreContext';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';

function getCsrfTokenFromCookie(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(/(?:^|;\s*)manga_csrf=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loginCustomer, cartCount, wishlistCount } = useStore();

  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  const redirectTarget = searchParams.get('redirect') || '/account';
  const urlToken = searchParams.get('token');
  const urlEmail = searchParams.get('email');

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'lookup' | 'forgot' | 'reset'>(
    urlToken && urlEmail ? 'reset' : initialTab
  );

  // Sign In State
  const [loginEmail, setLoginEmail] = useState(urlEmail || '');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Password Reset State
  const [resetEmail, setResetEmail] = useState(urlEmail || '');
  const [resetToken, setResetToken] = useState(urlToken || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  // Quick Order Lookup
  const [orderRef, setOrderRef] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push(redirectTarget);
      }
    }
  }, [user, router, redirectTarget]);

  // Primary Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError('Please provide your email address and password.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const csrfToken = getCsrfTokenFromCookie();
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
        },
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
        router.push(redirectTarget);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Register
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setError('Please provide your full name, email address, and a secure password.');
      return;
    }
    if (regPassword.length < 8) {
      setError('Password must be at least 8 characters long and contain both letters and numbers.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const csrfToken = getCsrfTokenFromCookie();
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
        },
        body: JSON.stringify({
          action: 'register',
          email: regEmail.trim(),
          password: regPassword,
          name: regName.trim(),
          phone: regPhone.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed.');
      }

      loginCustomer(
        data.user.email,
        data.user.name,
        data.user.phone || '+234 800 000 0000',
        'BUYER',
        data.token
      );
      router.push('/account');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password (Request Expiring Link)
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setError('Please enter your account email address.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const csrfToken = getCsrfTokenFromCookie();
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
        },
        body: JSON.stringify({
          action: 'forgot-password',
          email: resetEmail.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Unable to request password reset link.');
      }

      setResetSuccessMessage(
        data.message || 'If an account exists with this email, a 15-minute password reset link has been dispatched.'
      );
      if (data.resetToken) {
        setResetToken(data.resetToken);
        setActiveTab('reset');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to request password reset.');
    } finally {
      setLoading(false);
    }
  };

  // Reset Password (Consume Token)
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetToken.trim() || !newPassword.trim()) {
      setError('Please enter the reset token and your new password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const csrfToken = getCsrfTokenFromCookie();
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
        },
        body: JSON.stringify({
          action: 'reset-password',
          email: resetEmail.trim(),
          token: resetToken.trim(),
          password: newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to reset password. Link may have expired.');
      }

      setResetSuccessMessage('Password reset successfully! Please sign in with your new password.');
      setActiveTab('login');
      setLoginPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Link may have expired.');
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
          <div className="bg-white rounded-3xl border border-[#E7D5BC] shadow-xl p-6 sm:p-8">
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

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <i className="fas fa-circle-exclamation text-red-500"></i>
                <span>{error}</span>
              </div>
            )}

            {resetSuccessMessage && (
              <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs flex items-center gap-2">
                <i className="fas fa-circle-check text-green-500"></i>
                <span>{resetSuccessMessage}</span>
              </div>
            )}

            {/* Tab Switcher */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-[#FAF6F0] rounded-2xl border border-[#E7D5BC] mb-6 text-xs font-bold text-center">
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setError(null); }}
                className={`py-2 rounded-xl transition-all cursor-pointer border-0 ${
                  activeTab === 'login' || activeTab === 'forgot' || activeTab === 'reset'
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
                    placeholder="Enter your registered email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs text-[#2A2320] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E] transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[#2A2320]">Password</label>
                    <button
                      type="button"
                      onClick={() => { setActiveTab('forgot'); setError(null); }}
                      className="text-[11px] text-[#B5532E] hover:underline bg-transparent border-0 cursor-pointer font-semibold"
                    >
                      Forgot Password?
                    </button>
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#B5532E] hover:bg-[#8F3B1F] text-white font-bold text-xs rounded-xl shadow-md transition-all border-0 cursor-pointer flex items-center justify-center gap-2"
                >
                  <i className="fas fa-lock text-[#D9A441]"></i>
                  <span>{loading ? 'Authenticating...' : 'Sign In to Account →'}</span>
                </button>
              </form>
            )}

            {/* TAB: FORGOT PASSWORD */}
            {activeTab === 'forgot' && (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#E7D5BC] text-[11px] text-[#8C8279]">
                  Enter your registered email address and we will dispatch a secure password reset link. Links automatically expire in <strong>15 minutes</strong>.
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A2320] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your account email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs text-[#2A2320] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E] transition-all"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setActiveTab('login'); setError(null); }}
                    className="flex-1 py-2.5 bg-[#FAF6F0] text-[#8C8279] hover:text-[#2A2320] font-bold text-xs rounded-xl border border-[#E7D5BC] transition-all cursor-pointer"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-2 py-2.5 bg-[#B5532E] hover:bg-[#8F3B1F] text-white font-bold text-xs rounded-xl shadow-md transition-all border-0 cursor-pointer"
                  >
                    {loading ? 'Dispatching Link...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            )}

            {/* TAB: RESET PASSWORD */}
            {activeTab === 'reset' && (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#E7D5BC] text-[11px] text-[#8C8279]">
                  Enter your verification reset token and set a new password. Single-use, valid for 15 minutes.
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A2320] mb-1">Reset Token</label>
                  <input
                    type="text"
                    required
                    placeholder="Paste 64-character token"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs font-mono text-[#2A2320] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A2320] mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs text-[#2A2320] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A2320] mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs text-[#2A2320] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#B5532E] hover:bg-[#8F3B1F] text-white font-bold text-xs rounded-xl shadow-md transition-all border-0 cursor-pointer"
                >
                  {loading ? 'Updating Password...' : 'Save New Password'}
                </button>
              </form>
            )}

            {/* TAB 2: REGISTER */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#2A2320] mb-1">Full Name</label>
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
                  <label className="block text-xs font-bold text-[#2A2320] mb-1">Email Address</label>
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
                  <label className="block text-xs font-bold text-[#2A2320] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+234 800 000 0000"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs text-[#2A2320] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A2320] mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="At least 8 characters (letters and numbers)"
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
                  <span>{loading ? 'Creating Account...' : 'Create Free Buyer Account'}</span>
                </button>
              </form>
            )}

            {/* TAB 3: FIND ORDER */}
            {activeTab === 'lookup' && (
              <form onSubmit={handleLookupSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#2A2320] mb-1">Order Reference ID</label>
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
                <Link href="/sell" className="text-[#B5532E] font-bold underline hover:text-[#8F3B1F]">
                  Seller Partner Portal
                </Link>. Platform operations administrators can access the{' '}
                <Link href="/admin" className="text-[#B5532E] font-bold underline hover:text-[#8F3B1F]">
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
