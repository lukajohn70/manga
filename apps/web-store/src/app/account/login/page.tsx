'use client';

import * as React from 'react';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { useStore } from '../../../context/StoreContext';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { MangaLogo } from '../../../components/MangaLogo';

function getCsrfTokenFromCookie(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(/(?:^|;\s*)manga_csrf=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loginCustomer, cartCount, wishlistCount } = useStore();

  const redirectTarget = searchParams.get('redirect') || '/account';
  const urlToken = searchParams.get('token');
  const urlEmail = searchParams.get('email');

  // Toggle state for sliding panel
  const [isActive, setIsActive] = useState(searchParams.get('tab') === 'register');
  const [isForgotMode, setIsForgotMode] = useState(false);

  // Sign In State
  const [loginEmail, setLoginEmail] = useState(urlEmail || '');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') {
        router.push('/admin');
      } else if (user.role === 'VENDOR') {
        router.push('/sell');
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
    setSuccessMessage(null);
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
      } else if (data.user.role === 'VENDOR') {
        router.push('/sell');
      } else {
        router.push(redirectTarget);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Register Customer Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail.trim() || !regPassword.trim() || !regName.trim()) {
      setError('Please fill in your name, email, and password.');
      return;
    }
    setError(null);
    setSuccessMessage(null);
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
          name: regName.trim(),
          email: regEmail.trim(),
          phone: regPhone.trim() || '+234 800 000 0000',
          password: regPassword,
          role: 'BUYER',
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

      router.push(redirectTarget);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot password submit
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setError('Please provide your account email.');
      return;
    }
    setError(null);
    setSuccessMessage(null);
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
          email: forgotEmail.trim(),
        }),
      });

      const data = await res.json();
      setSuccessMessage(data.message || 'If an account exists, a password reset link has been dispatched.');
    } catch (err: any) {
      setError(err.message || 'Failed to request password reset.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoBuyer = () => {
    setLoginEmail('buyer@manga.ng');
    setLoginPassword('BuyerPass123!');
    setSuccessMessage('Demo shopper credentials prefilled.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1D1917]">
      <Header cartCount={cartCount} wishlistCount={wishlistCount} />

      <main className="flex-1 py-10 sm:py-14 flex items-center justify-center">
        <div className="auth-page-wrapper w-full max-w-5xl">
          <div className={`auth-container ${isActive ? 'active' : ''}`} id="customerAuthContainer">
            
            {/* =========================================================
                PANEL 1: SIGN UP (CREATE BUYER ACCOUNT)
                ========================================================= */}
            <div className="auth-form-container auth-sign-up">
              <form onSubmit={handleRegisterSubmit}>
                <div className="mb-3 text-center">
                  <MangaLogo height={34} />
                </div>

                <h2 className="text-xl font-extrabold text-[#1D1917] tracking-tight mb-1 font-serif">
                  Join Manga Marketsquare
                </h2>
                <p className="text-xs text-[#78716C] mb-3">
                  100% escrow protection & nationwide fast delivery
                </p>

                {/* Social Registration */}
                <div className="auth-social-icons">
                  <button
                    type="button"
                    className="auth-social-btn"
                    title="Sign up with Google"
                    onClick={() => {
                      setRegEmail('shopper@gmail.com');
                      setRegName('Chidi Okonkwo');
                      setSuccessMessage('Google Profile linked.');
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="auth-social-btn"
                    title="Sign up with Apple"
                    onClick={() => setSuccessMessage('Apple ID linked.')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.71-.93 2.74 1 .08 2.03-.49 2.65-1.24z"/>
                    </svg>
                  </button>
                </div>

                <span className="text-[11px] text-[#78716C] mb-2">
                  or register with your email address
                </span>

                {error && (
                  <div className="w-full p-2 mb-2 rounded-lg bg-red-50 text-red-700 text-xs text-left">
                    {error}
                  </div>
                )}

                <div className="auth-input-group">
                  <input
                    type="text"
                    required
                    className="auth-input"
                    placeholder="Full Legal Name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                  />
                </div>

                <div className="auth-input-group">
                  <input
                    type="email"
                    required
                    className="auth-input"
                    placeholder="Email Address"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                  />
                </div>

                <div className="auth-input-group">
                  <input
                    type="tel"
                    className="auth-input"
                    placeholder="Mobile Phone (+234 803 000 0000)"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                  />
                </div>

                <div className="auth-input-group">
                  <input
                    type="password"
                    required
                    className="auth-input"
                    placeholder="Password (minimum 8 characters)"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                  />
                </div>

                <button type="submit" disabled={loading} className="auth-submit-btn">
                  {loading ? 'Creating Account...' : 'Create Account & Start Shopping'}
                </button>
              </form>
            </div>

            {/* =========================================================
                PANEL 2: SIGN IN (BUYER ACCOUNT)
                ========================================================= */}
            <div className="auth-form-container auth-sign-in">
              {isForgotMode ? (
                <form onSubmit={handleForgotSubmit}>
                  <div className="mb-3 text-center">
                    <MangaLogo height={34} />
                  </div>

                  <h2 className="text-xl font-extrabold text-[#1D1917] tracking-tight mb-1 font-serif">
                    Reset Your Password
                  </h2>
                  <p className="text-xs text-[#78716C] mb-4">
                    Enter your email to receive a secure password reset link
                  </p>

                  {error && (
                    <div className="w-full p-2 mb-2 rounded-lg bg-red-50 text-red-700 text-xs text-left">
                      {error}
                    </div>
                  )}

                  {successMessage && (
                    <div className="w-full p-2 mb-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs text-left">
                      {successMessage}
                    </div>
                  )}

                  <div className="auth-input-group">
                    <input
                      type="email"
                      required
                      className="auth-input"
                      placeholder="Enter your account email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                    />
                  </div>

                  <button type="submit" disabled={loading} className="auth-submit-btn">
                    {loading ? 'Sending link...' : 'Send Reset Link'}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setIsForgotMode(false); setError(null); setSuccessMessage(null); }}
                    className="text-xs text-[#B5532E] font-semibold mt-4 hover:underline"
                  >
                    ← Return to Sign In
                  </button>
                </form>
              ) : (
                <form onSubmit={handleLoginSubmit}>
                  <div className="mb-3 text-center">
                    <MangaLogo height={34} />
                  </div>

                  <h2 className="text-xl font-extrabold text-[#1D1917] tracking-tight mb-1 font-serif">
                    Sign In to Manga
                  </h2>
                  <p className="text-xs text-[#78716C] mb-3">
                    Access your orders, track shipments & saved wishlist
                  </p>

                  {/* Social Login */}
                  <div className="auth-social-icons">
                    <button
                      type="button"
                      className="auth-social-btn"
                      title="Sign in with Google"
                      onClick={fillDemoBuyer}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="auth-social-btn"
                      title="Sign in with Apple"
                      onClick={fillDemoBuyer}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.71-.93 2.74 1 .08 2.03-.49 2.65-1.24z"/>
                      </svg>
                    </button>
                  </div>

                  <span className="text-[11px] text-[#78716C] mb-2">
                    or sign in with your email address
                  </span>

                  {error && (
                    <div className="w-full p-2 mb-2 rounded-lg bg-red-50 text-red-700 text-xs text-left">
                      {error}
                    </div>
                  )}

                  {successMessage && (
                    <div className="w-full p-2 mb-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs text-left">
                      {successMessage}
                    </div>
                  )}

                  <div className="auth-input-group">
                    <input
                      type="email"
                      required
                      className="auth-input"
                      placeholder="Email address (buyer@manga.ng)"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>

                  <div className="auth-input-group">
                    <input
                      type="password"
                      required
                      className="auth-input"
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>

                  <div className="w-full flex justify-between items-center text-xs mt-1 mb-2">
                    <button
                      type="button"
                      onClick={fillDemoBuyer}
                      className="text-[#D9A441] font-bold text-[11px] hover:underline"
                    >
                      Demo: Quick Buyer Sign-In
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsForgotMode(true); setError(null); setSuccessMessage(null); }}
                      className="text-[#78716C] text-[11px] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button type="submit" disabled={loading} className="auth-submit-btn">
                    {loading ? 'Signing In...' : 'Sign In to Account →'}
                  </button>
                </form>
              )}
            </div>

            {/* =========================================================
                SLIDING TOGGLE CONTAINER (CLAY GRADIENT OVERLAY)
                ========================================================= */}
            <div className="auth-toggle-container">
              <div className="auth-toggle">
                {/* Left Overlay Panel */}
                <div className="auth-toggle-panel auth-toggle-left">
                  <div className="mb-4">
                    <MangaLogo variant="light" height={36} />
                  </div>
                  <h1>Welcome Back!</h1>
                  <p>
                    Already have a Manga customer account? Sign in to view saved wishlist items, track orders, and checkout faster.
                  </p>
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={() => { setIsActive(false); setIsForgotMode(false); }}
                  >
                    Sign In
                  </button>
                </div>

                {/* Right Overlay Panel */}
                <div className="auth-toggle-panel auth-toggle-right">
                  <div className="mb-4">
                    <MangaLogo variant="light" height={36} />
                  </div>
                  <h1>Hello, Shopper!</h1>
                  <p>
                    New to Manga? Register today for verified genuine products, full Providus escrow buyer protection, and fast delivery.
                  </p>
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={() => { setIsActive(true); setIsForgotMode(false); }}
                  >
                    Create Account
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
