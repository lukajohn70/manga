'use client';

import * as React from 'react';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { useStore } from '../../../context/StoreContext';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';

function getCsrfTokenFromCookie(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(/(?:^|;\s*)manga_csrf=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

function MerchantLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loginCustomer, cartCount, wishlistCount } = useStore();

  const redirectTarget = searchParams.get('redirect') || '/sell';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roleMismatch, setRoleMismatch] = useState(false);

  // If already logged in as VENDOR or ADMIN, redirect straight to merchant console
  useEffect(() => {
    if (user && (user.role === 'VENDOR' || user.role === 'ADMIN')) {
      router.push(redirectTarget);
    }
  }, [user, router, redirectTarget]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide your merchant account email and password.');
      return;
    }
    setError(null);
    setRoleMismatch(false);
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
          action: 'merchant-login',
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (data.roleMismatch) {
          setRoleMismatch(true);
        }
        throw new Error(data.message || 'Merchant authentication failed. Please verify your credentials.');
      }

      loginCustomer(
        data.user.email,
        data.user.name,
        data.user.phone || '+234 800 000 0000',
        data.user.role,
        data.token
      );

      router.push(redirectTarget);
    } catch (err: any) {
      setError(err.message || 'Merchant authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1D1917]">
      <Header cartCount={cartCount} wishlistCount={wishlistCount} />

      <main className="flex-1 py-10 sm:py-16 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md w-full">
          {/* Merchant Portal Card */}
          <div className="bg-white rounded-3xl border border-[#EAE3D9] shadow-sm p-6 sm:p-8">
            
            {/* Header Badge & Icon */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-[#1A1513] text-[#D9A441] flex items-center justify-center text-2xl mx-auto mb-3 border border-white/10 shadow-md">
                <i className="fas fa-store"></i>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#EAE3D9] text-[#B5532E] text-[11px] font-bold uppercase tracking-wider mb-2">
                <i className="fas fa-crown text-[10px] text-[#D9A441]"></i>
                <span>Merchant Partner Program</span>
              </div>
              <h1 className="apple-heading text-xl sm:text-2xl font-bold text-[#1D1917] tracking-tight">
                Merchant Sign In
              </h1>
              <p className="apple-subhead text-xs text-[#78716C] mt-1.5 leading-relaxed font-normal">
                Sign in to manage catalog items, fulfill customer orders, and inspect automated Paystack escrow disbursements.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                <i className="fas fa-circle-exclamation text-rose-500 mt-0.5 flex-shrink-0"></i>
                <div className="flex-1 leading-snug">
                  <div>{error}</div>
                  {roleMismatch && (
                    <div className="mt-2.5 pt-2 border-t border-rose-200 flex flex-col gap-1.5">
                      <Link
                        href="/sell#register"
                        className="font-bold text-[#B5532E] hover:underline inline-flex items-center gap-1"
                      >
                        <i className="fas fa-arrow-right text-[10px]"></i>
                        <span>Register this account as a merchant store</span>
                      </Link>
                      <Link
                        href="/account/login"
                        className="text-[#78716C] hover:text-[#1D1917] inline-flex items-center gap-1"
                      >
                        <i className="fas fa-user text-[10px]"></i>
                        <span>Sign in to standard shopper account</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Merchant Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1D1917] mb-1.5">
                  Merchant Account Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. store@business.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl text-xs text-[#1D1917] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E] transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#1D1917]">Password</label>
                  <Link
                    href="/account/login?tab=forgot"
                    className="text-[11px] text-[#B5532E] hover:underline font-semibold no-underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter merchant password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl text-xs text-[#1D1917] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E] transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1D1917] bg-transparent border-0 cursor-pointer text-xs p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 px-6 bg-[#B5532E] hover:bg-[#A04523] text-white font-bold text-xs rounded-xl shadow-xs transition-colors border-0 cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-50 apple-pressable"
              >
                <i className="fas fa-store text-xs text-[#D9A441]"></i>
                <span>{loading ? 'Authenticating Merchant...' : 'Sign In as Merchant Partner →'}</span>
              </motion.button>
            </form>

            {/* Bottom Merchant Options */}
            <div className="mt-6 pt-5 border-t border-[#EAE3D9] text-center space-y-3">
              <p className="text-xs text-[#78716C]">
                Don’t have a merchant account?{' '}
                <Link
                  href="/sell#register"
                  className="text-[#B5532E] font-bold hover:underline no-underline"
                >
                  Register your store on Manga
                </Link>
              </p>

              <div className="pt-1 flex items-center justify-center gap-4 text-[11px] text-[#78716C]">
                <Link
                  href="/account/login"
                  className="hover:text-[#B5532E] font-medium no-underline inline-flex items-center gap-1.5"
                >
                  <i className="fas fa-bag-shopping text-[10px]"></i>
                  <span>Shopper / Buyer Sign In</span>
                </Link>
                <span>•</span>
                <Link
                  href="/sell"
                  className="hover:text-[#1D1917] font-medium no-underline inline-flex items-center gap-1.5"
                >
                  <span>Merchant Benefits & FAQ</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer cartCount={cartCount} wishlistCount={wishlistCount} />
    </div>
  );
}

export default function MerchantLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
          <div className="w-8 h-8 border-2 border-[#EAE3D9] border-t-[#B5532E] rounded-full animate-spin"></div>
        </div>
      }
    >
      <MerchantLoginContent />
    </Suspense>
  );
}
