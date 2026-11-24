'use client';

import * as React from 'react';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { useStore } from '../../../context/StoreContext';

function getCsrfTokenFromCookie(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(/(?:^|;\s*)manga_csrf=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loginCustomer } = useStore();

  const redirectTarget = searchParams.get('redirect') || '/admin';

  const [email, setEmail] = useState('lukajohn70@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated as ADMIN, redirect immediately
  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      router.push(redirectTarget);
    }
  }, [user, router, redirectTarget]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide administrative credentials.');
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
          action: 'admin-login',
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Access denied: Invalid administrator credentials.');
      }

      if (data.user?.role !== 'ADMIN') {
        throw new Error('Access denied: Administrator privileges required.');
      }

      loginCustomer(
        data.user.email,
        data.user.name,
        data.user.phone || '+234 800 000 0000',
        'ADMIN',
        data.token
      );

      router.push(redirectTarget);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify administrative credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#161311] text-white font-sans selection:bg-[#B5532E] selection:text-white">
      {/* Top Security Bar */}
      <div className="border-b border-white/10 px-4 py-3 flex items-center justify-between bg-black/40">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[11px] font-mono tracking-widest text-white/70 uppercase">
            Platform Gateway • Secure Environment
          </span>
          <span className="ml-auto text-[11px] font-mono text-white/40">
            Node: Production / Reverse Proxy
          </span>
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full">
          <div className="apple-glass-dark border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {/* Subtle Accent Glow */}
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                background: 'radial-gradient(circle at 50% 0%, #D9A441 0%, transparent 70%)',
              }}
            />

            <div className="relative z-10">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-white/10 text-[#D9A441] flex items-center justify-center text-2xl mx-auto mb-4 border border-white/10 shadow-inner">
                  <i className="fas fa-shield-halved"></i>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#D9A441] text-[11px] font-semibold uppercase tracking-wider mb-2 border border-white/10">
                  Restricted Operations Area
                </div>
                <h1 className="text-2xl font-bold apple-heading text-white tracking-tight">
                  Platform Operations Gate
                </h1>
                <p className="text-xs text-white/70 mt-2 leading-relaxed">
                  Enter authorized administrator credentials to manage database state, microservices, and system telemetry.
                </p>
              </div>

              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
                  <i className="fas fa-circle-exclamation text-rose-400 flex-shrink-0"></i>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    Administrator Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@manga.ng"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D9A441] focus:ring-1 focus:ring-[#D9A441] transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    Master Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D9A441] focus:ring-1 focus:ring-[#D9A441] transition-all font-mono pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white bg-transparent border-0 cursor-pointer text-xs p-1"
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#B5532E] hover:bg-[#A04523] text-white font-bold text-xs shadow-lg transition-colors border-0 cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-50 apple-pressable"
                >
                  <i className="fas fa-key text-[#D9A441]"></i>
                  <span>{loading ? 'Authenticating Operator...' : 'Authenticate Administrator Access →'}</span>
                </motion.button>
              </form>

              <div className="mt-6 pt-5 border-t border-white/10 text-center space-y-2">
                <Link
                  href="/"
                  className="text-xs text-white/60 hover:text-white no-underline transition-colors inline-flex items-center gap-1.5"
                >
                  <i className="fas fa-arrow-left text-[10px]"></i>
                  <span>Return to Manga Storefront</span>
                </Link>
                <p className="text-[10px] text-white/30 font-mono">
                  Unauthorized access attempts are monitored and logged.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#161311] text-white">
          <div className="w-8 h-8 border-2 border-white/20 border-t-[#D9A441] rounded-full animate-spin"></div>
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}
