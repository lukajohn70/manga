'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { useStore } from '../../context/StoreContext';
import { DEV_ADMIN_URL } from '../../lib/portal-urls';

interface SystemDiagnostics {
  database?: string;
  connected?: boolean;
  version?: string;
  tableCounts?: Record<string, number>;
  sampleProducts?: Array<{ id: string; title: string; category: string; price_ngn: string; seller: string }>;
  host?: string;
  error?: string;
}

function getCsrfTokenFromCookie(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(/(?:^|;\s*)manga_csrf=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

export default function AdminHubPage() {
  const router = useRouter();
  const { user, loginCustomer, logoutCustomer, cartCount, wishlistCount } = useStore();
  const [diagnostics, setDiagnostics] = useState<SystemDiagnostics | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'tables' | 'products' | 'email'>('overview');

  // Admin Login State
  const [emailInput, setEmailInput] = useState('lukajohn70@gmail.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Purge State
  const [purging, setPurging] = useState(false);
  const [purgeResult, setPurgeResult] = useState<string | null>(null);

  // Mail Diagnostics State
  const [mailInfo, setMailInfo] = useState<any>(null);
  const [testRecipient, setTestRecipient] = useState('lukajohn70@gmail.com');
  const [testMailStatus, setTestMailStatus] = useState<{ loading: boolean; result?: string; error?: string }>({
    loading: false,
  });

  const isAdmin = user && user.role === 'ADMIN';

  // Redirect unauthenticated non-admins to dedicated Admin Login
  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      router.push('/admin/login');
    }
  }, [user, router]);

  // Fetch telemetry ONLY when authenticated as ADMIN
  useEffect(() => {
    if (!isAdmin) return;

    setLoading(true);
    fetch('/api/setup')
      .then((res) => res.json())
      .then((data) => {
        setDiagnostics(data);
      })
      .catch((err) => {
        setDiagnostics({
          connected: false,
          error: err.message,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isAdmin]);

  const fetchMailInfo = () => {
    fetch('/api/admin/email')
      .then((res) => res.json())
      .then((data) => setMailInfo(data))
      .catch((err) => setMailInfo({ success: false, error: err.message }));
  };

  useEffect(() => {
    if (isAdmin && activeTab === 'email') {
      fetchMailInfo();
    }
  }, [isAdmin, activeTab]);

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testRecipient.trim()) return;
    setTestMailStatus({ loading: true });
    try {
      const csrfToken = getCsrfTokenFromCookie();
      const res = await fetch('/api/admin/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
        },
        body: JSON.stringify({
          action: 'test-email',
          recipient: testRecipient.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTestMailStatus({ loading: false, result: data.message });
      } else {
        setTestMailStatus({ loading: false, error: data.message || data.error });
      }
    } catch (err: any) {
      setTestMailStatus({ loading: false, error: err.message });
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput.trim()) {
      setAuthError('Please enter both administrator email and password.');
      return;
    }

    setAuthError(null);
    setAuthLoading(true);

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
          email: emailInput.trim(),
          password: passwordInput,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invalid administrator credentials. Access denied.');
      }

      if (data.user?.role !== 'ADMIN') {
        throw new Error('Access denied. Administrator privileges required.');
      }

      loginCustomer(
        data.user.email,
        data.user.name,
        data.user.phone || '+234 800 000 0000',
        'ADMIN',
        data.token
      );
      setPasswordInput('');
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handlePurgeDatabase = async () => {
    if (!confirm('Are you sure you want to purge all products, orders, and dummy details from the database? This cannot be undone.')) {
      return;
    }
    setPurging(true);
    setPurgeResult(null);
    try {
      const csrfToken = getCsrfTokenFromCookie();
      const res = await fetch('/api/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
        },
        body: JSON.stringify({ action: 'purge' }),
      });
      const data = await res.json();
      setDiagnostics(data);
      setPurgeResult(data.purgeMessage || 'Database purged successfully! Luka John (lukajohn70@gmail.com) active.');
    } catch (err: any) {
      setPurgeResult('Purge error: ' + err.message);
    } finally {
      setPurging(false);
    }
  };

  const isLocalDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  // 1. GATE: Unauthenticated Visitors
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#161311] text-white font-sans">
        <Header cartCount={cartCount} wishlistCount={wishlistCount} />

        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full apple-glass-dark border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white/10 text-[#D9A441] flex items-center justify-center text-2xl mx-auto mb-4 border border-white/10">
                <i className="fas fa-shield-halved"></i>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#D9A441] text-[11px] font-semibold uppercase tracking-wider mb-2 border border-white/10">
                Restricted Operations Area
              </div>
              <h1 className="text-2xl font-bold apple-heading text-white">
                Platform Operations Gate
              </h1>
              <p className="text-xs text-white/70 mt-2 leading-relaxed">
                Enter authorized administrator credentials to manage database state, microservices, and system telemetry.
              </p>
            </div>

            {authError && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <i className="fas fa-circle-exclamation text-rose-400"></i>
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1.5">
                  Administrator Email
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="e.g. lukajohn70@gmail.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#D9A441] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1.5">
                  Admin Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#D9A441] transition-colors"
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                type="submit"
                disabled={authLoading}
                className="w-full py-3.5 bg-[#B5532E] hover:bg-[#8F3B1F] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border-0 mt-2 apple-pressable"
              >
                <i className={`fas ${authLoading ? 'fa-spinner fa-spin' : 'fa-key'} text-[#D9A441]`}></i>
                <span>{authLoading ? 'Verifying Credentials...' : 'Authenticate as Administrator'}</span>
              </motion.button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/10 text-center">
              <Link
                href="/"
                className="text-xs text-white/60 hover:text-white font-medium transition-colors inline-flex items-center gap-1.5"
              >
                <i className="fas fa-arrow-left text-[10px]"></i>
                <span>Return to Storefront</span>
              </Link>
            </div>
          </div>
        </main>

        <Footer cartCount={cartCount} wishlistCount={wishlistCount} />
      </div>
    );
  }

  // 2. GATE: Authenticated but Non-Admin (403 Forbidden)
  if (user && user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex flex-col bg-[#161311] text-white font-sans">
        <Header cartCount={cartCount} wishlistCount={wishlistCount} />

        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full apple-glass-dark border border-rose-500/30 rounded-3xl p-8 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-2xl mx-auto mb-4 border border-rose-500/40">
              <i className="fas fa-lock"></i>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-semibold uppercase tracking-wider mb-2">
              403 Forbidden
            </div>
            <h1 className="text-2xl font-bold apple-heading text-white mb-2">
              Administrator Privileges Required
            </h1>
            <p className="text-xs text-white/70 leading-relaxed mb-6">
              You are currently authenticated as <strong className="text-white">{user.email}</strong> with role{' '}
              <span className="px-2 py-0.5 rounded bg-white/10 text-[#D9A441] font-mono font-bold">[{user.role}]</span>.
              Access to platform operations and database management is strictly restricted to authorized administrators.
            </p>

            <div className="space-y-3">
              <motion.button
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={logoutCustomer}
                className="w-full py-3 bg-[#B5532E] hover:bg-[#8F3B1F] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border-0 apple-pressable"
              >
                <i className="fas fa-right-from-bracket"></i>
                <span>Sign Out & Switch Account</span>
              </motion.button>

              <Link
                href="/"
                className="block w-full py-3 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs rounded-xl transition-colors text-center border border-white/10"
              >
                Return to Storefront
              </Link>
            </div>
          </div>
        </main>

        <Footer cartCount={cartCount} wishlistCount={wishlistCount} />
      </div>
    );
  }

  // 3. AUTHORIZED: Admin Operations Hub
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2A2320]">
      <Header cartCount={cartCount} wishlistCount={wishlistCount} />

      <main className="flex-1">
        {/* Local Dev Notice */}
        {isLocalDev && (
          <div className="bg-[#1A1512] text-[#D9A441] px-4 py-2 text-xs flex items-center justify-between border-b border-[#D9A441]/30">
            <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
              <i className="fas fa-terminal"></i>
              <span>
                <strong>Local Development Mode:</strong> Standalone Vite Admin operations console available on port 3002:{' '}
                <a href={DEV_ADMIN_URL} target="_blank" rel="noreferrer" className="underline font-bold text-white hover:text-[#D9A441]">
                  http://localhost:3002
                </a>
              </span>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header Banner */}
          <div className="apple-glass-dark rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-white/10 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#D9A441] text-xs font-semibold uppercase tracking-wider border border-white/10">
                  <i className="fas fa-shield-halved"></i>
                  <span>Platform Operations Control Hub</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold apple-heading text-white">MANGA Platform Administration</h1>
                <p className="text-xs text-white/70">
                  PostgreSQL database status, microservice health, and platform governance.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Admin: {user.name} ({user.email})
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    type="button"
                    disabled={purging}
                    onClick={handlePurgeDatabase}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-xs font-semibold text-white border border-rose-400/30 cursor-pointer transition-colors flex items-center gap-1.5 apple-pressable"
                  >
                    <i className={`fas ${purging ? 'fa-spinner fa-spin' : 'fa-trash-can'}`}></i>
                    <span>{purging ? 'Purging DB...' : 'Purge All Products'}</span>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    type="button"
                    onClick={logoutCustomer}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white border border-white/10 cursor-pointer transition-colors apple-pressable"
                  >
                    Sign Out
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {purgeResult && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="fas fa-check-circle text-emerald-600"></i>
                <span className="font-semibold">{purgeResult}</span>
              </div>
              <button
                type="button"
                onClick={() => setPurgeResult(null)}
                className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Database Health Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-[#EAE3D9] shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#78716C]">Database Engine</span>
                <i className="fas fa-database text-[#B5532E]"></i>
              </div>
              <div className="text-lg font-bold text-[#1D1917] mt-2 tracking-tight">
                {diagnostics?.database || 'PostgreSQL'}
              </div>
              <div className="text-[11px] text-[#78716C] mt-1 flex items-center gap-1">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    diagnostics?.connected ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                ></span>
                <span>{diagnostics?.connected ? 'Online & Responsive' : loading ? 'Connecting...' : 'Offline'}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EAE3D9] shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#78716C]">Active Master Products</span>
                <i className="fas fa-box text-[#D9A441]"></i>
              </div>
              <div className="text-lg font-bold text-[#1D1917] mt-2 tracking-tight">
                {diagnostics?.tableCounts?.['catalog.master_products'] ?? '-'}
              </div>
              <div className="text-[11px] text-[#78716C] mt-1">
                In-stock catalog items
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EAE3D9] shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#78716C]">Verified Vendors</span>
                <i className="fas fa-store text-emerald-600"></i>
              </div>
              <div className="text-lg font-bold text-[#1D1917] mt-2 tracking-tight">
                {diagnostics?.tableCounts?.['vendor.vendors'] ?? '-'}
              </div>
              <div className="text-[11px] text-[#78716C] mt-1">
                Registered merchant partners
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EAE3D9] shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#78716C]">Platform Categories</span>
                <i className="fas fa-tags text-indigo-600"></i>
              </div>
              <div className="text-lg font-bold text-[#1D1917] mt-2 tracking-tight">
                {diagnostics?.tableCounts?.['catalog.categories'] ?? '-'}
              </div>
              <div className="text-[11px] text-[#78716C] mt-1">
                Active department nodes
              </div>
            </div>
          </div>

          {/* Diagnostics Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-[#EAE3D9] mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-[#B5532E] text-[#B5532E]'
                  : 'border-transparent text-[#78716C] hover:text-[#1D1917]'
              }`}
            >
              System Diagnostics
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tables')}
              className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'tables'
                  ? 'border-[#B5532E] text-[#B5532E]'
                  : 'border-transparent text-[#78716C] hover:text-[#1D1917]'
              }`}
            >
              PostgreSQL Tables
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'products'
                  ? 'border-[#B5532E] text-[#B5532E]'
                  : 'border-transparent text-[#78716C] hover:text-[#1D1917]'
              }`}
            >
              Live Catalog Sample
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('email')}
              className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'email'
                  ? 'border-[#B5532E] text-[#B5532E]'
                  : 'border-transparent text-[#78716C] hover:text-[#1D1917]'
              }`}
            >
              <i className="fas fa-envelope"></i>
              <span>Mailing System</span>
            </button>
          </div>

          {/* Tab 1: System Diagnostics */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-[#E7D5BC] shadow-xs">
                <h3 className="text-sm font-bold text-[#1A1512] mb-4 flex items-center gap-2">
                  <i className="fas fa-server text-[#B5532E]"></i>
                  <span>PostgreSQL Environment Status</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E7D5BC]/60 space-y-1">
                    <span className="text-[#8C8279] block">Server Connection Status</span>
                    <span className={`font-bold flex items-center gap-2 ${diagnostics?.connected ? 'text-emerald-700' : 'text-rose-700'}`}>
                      <i className={`fas ${diagnostics?.connected ? 'fa-circle-check text-emerald-500' : 'fa-circle-xmark text-rose-500'}`}></i>
                      <span>{diagnostics?.connected ? 'Connected (Authenticated over IPv4 127.0.0.1)' : 'Unreachable or Connection Refused'}</span>
                    </span>
                  </div>

                  <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E7D5BC]/60 space-y-1">
                    <span className="text-[#8C8279] block">Engine Version</span>
                    <span className="font-mono text-[11px] text-[#1A1512] font-semibold break-all">
                      {diagnostics?.version || 'Querying engine version...'}
                    </span>
                  </div>

                  <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E7D5BC]/60 space-y-1">
                    <span className="text-[#8C8279] block">Target Connection Host</span>
                    <span className="font-mono text-[11px] text-[#1A1512] font-semibold break-all">
                      {diagnostics?.host || 'postgres://gwylvxeo_manga_user:****@127.0.0.1:5432/gwylvxeo_manga'}
                    </span>
                  </div>

                  <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E7D5BC]/60 space-y-1">
                    <span className="text-[#8C8279] block">Primary System Administrator</span>
                    <span className="font-bold text-[#1A1512] flex items-center gap-1.5">
                      <i className="fas fa-user-shield text-[#B5532E]"></i>
                      <span>Luka John (lukajohn70@gmail.com)</span>
                    </span>
                  </div>
                </div>

                {diagnostics?.error && (
                  <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                    <strong>Connection Diagnostic Note:</strong> {diagnostics.error}
                  </div>
                )}
              </div>

              {/* Monorepo Architecture Notice */}
              <div className="bg-white p-6 rounded-2xl border border-[#E7D5BC] shadow-xs">
                <h3 className="text-sm font-bold text-[#1A1512] mb-3 flex items-center gap-2">
                  <i className="fas fa-network-wired text-[#D9A441]"></i>
                  <span>Architecture & Domain Routing</span>
                </h3>
                <p className="text-xs text-[#8C8279] leading-relaxed mb-4">
                  MANGA is built as an enterprise event-driven marketplace monorepo. On production, all microservices share the centralized PostgreSQL engine for zero-drift inventory, transactions, and role enforcement.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E7D5BC]">
                    <span className="font-bold text-[#1A1512] block">Web Storefront</span>
                    <span className="text-[#8C8279] text-[11px]">manga.jlm.com.ng (Next.js)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E7D5BC]">
                    <span className="font-bold text-[#1A1512] block">Merchant Portal</span>
                    <span className="text-[#8C8279] text-[11px]">manga.jlm.com.ng/sell</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E7D5BC]">
                    <span className="font-bold text-[#1A1512] block">Operations Console</span>
                    <span className="text-[#8C8279] text-[11px]">manga.jlm.com.ng/admin</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: PostgreSQL Tables */}
          {activeTab === 'tables' && (
            <div className="bg-white rounded-2xl border border-[#E7D5BC] shadow-xs overflow-hidden">
              <div className="p-5 border-b border-[#E7D5BC] flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#1A1512]">Database Table State</h3>
                <span className="text-xs text-[#8C8279]">Live row counts in production database</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF7F2] border-b border-[#E7D5BC] text-[#8C8279] font-bold">
                    <tr>
                      <th className="py-3 px-5">Schema.Table</th>
                      <th className="py-3 px-5">Description</th>
                      <th className="py-3 px-5 text-right">Row Count</th>
                      <th className="py-3 px-5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7D5BC]/60">
                    {diagnostics?.tableCounts &&
                      Object.entries(diagnostics.tableCounts).map(([tbl, count]) => (
                        <tr key={tbl} className="hover:bg-[#FAF7F2]/50 transition">
                          <td className="py-3 px-5 font-mono font-semibold text-[#1A1512]">{tbl}</td>
                          <td className="py-3 px-5 text-[#8C8279]">
                            {tbl.includes('master_products') && 'Core catalog items published to marketplace'}
                            {tbl.includes('categories') && 'Department taxonomy (Electronics, Phones, Fashion...)'}
                            {tbl.includes('variants') && 'SKUs, color/storage variants, barcodes'}
                            {tbl.includes('offers') && 'Merchant prices, stock quantity, SLA guarantees'}
                            {tbl.includes('vendors') && 'Registered partner seller profiles & CAC KYC'}
                            {tbl.includes('users') && 'Buyers, merchants, and platform administrators'}
                            {tbl.includes('orders') && 'Customer checkouts, transaction references, payments'}
                            {tbl.includes('shipments') && 'Logistics dispatch legs, tracking waybills'}
                          </td>
                          <td className="py-3 px-5 font-mono text-right font-bold text-[#1A1512]">
                            {count >= 0 ? count : 'Table missing'}
                          </td>
                          <td className="py-3 px-5 text-center">
                            {count >= 0 ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                Active
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                                Inactive
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Live Catalog Sample */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-2xl border border-[#E7D5BC] shadow-xs p-5">
              <h3 className="text-sm font-bold text-[#1A1512] mb-4">Sample Master Products in Database</h3>
              {diagnostics?.sampleProducts && diagnostics.sampleProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {diagnostics.sampleProducts.map((p) => (
                    <div key={p.id} className="p-4 rounded-xl border border-[#E7D5BC] bg-[#FAF7F2] space-y-2">
                      <div className="text-[11px] font-bold text-[#B5532E] uppercase">{p.category}</div>
                      <div className="text-xs font-bold text-[#1A1512] line-clamp-2">{p.title}</div>
                      <div className="text-xs text-[#8C8279]">Seller: {p.seller}</div>
                      <div className="text-sm font-black text-[#1A1512]">
                        ₦{Number(p.price_ngn).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-xs text-[#8C8279]">
                  <i className="fas fa-boxes-stacked text-3xl text-[#E7D5BC] mb-2 block"></i>
                  <span>No products currently in database (Clean purged state). New products will appear here when merchants list them.</span>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Mailing System */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              {/* Mailer Status Box */}
              <div className="bg-white rounded-2xl border border-[#E7D5BC] shadow-xs p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-[#1A1512] flex items-center gap-2">
                      <i className="fas fa-paper-plane text-[#B5532E]"></i>
                      <span>Manga Mailing System Status</span>
                    </h3>
                    <p className="text-xs text-[#8C8279] mt-0.5">
                      Handles buyer registration OTPs, password reset links, order receipts, and merchant onboarding.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        mailInfo?.connection?.connected
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : mailInfo?.configured
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {mailInfo?.connection?.connected
                        ? '● Live SMTP Connected'
                        : mailInfo?.configured
                        ? '▲ SMTP Configured (Unverified)'
                        : 'ℹ Simulated Mode Active'}
                    </span>
                    <button
                      type="button"
                      onClick={fetchMailInfo}
                      className="px-3 py-1 rounded-xl bg-[#FAF7F2] border border-[#E7D5BC] text-xs font-semibold text-[#2A2320] hover:bg-white transition cursor-pointer"
                    >
                      <i className="fas fa-arrows-rotate mr-1"></i> Refresh
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs mb-6">
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7D5BC]">
                    <div className="text-[11px] text-[#8C8279] font-bold uppercase mb-1">Transport Mode</div>
                    <div className="font-bold text-[#1A1512]">{mailInfo?.details?.mode || 'Loading...'}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7D5BC]">
                    <div className="text-[11px] text-[#8C8279] font-bold uppercase mb-1">SMTP Host &amp; Port</div>
                    <div className="font-bold text-[#1A1512] font-mono">
                      {mailInfo?.details?.host || 'Not set'}:{mailInfo?.details?.port || '465'}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7D5BC]">
                    <div className="text-[11px] text-[#8C8279] font-bold uppercase mb-1">Sender Address</div>
                    <div className="font-bold text-[#1A1512] truncate">
                      {mailInfo?.details?.fromAddress || 'support@jlm.com.ng'}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7D5BC]">
                    <div className="text-[11px] text-[#8C8279] font-bold uppercase mb-1">Auth Identity</div>
                    <div className="font-bold text-[#1A1512] truncate">
                      {mailInfo?.details?.user || 'None'}
                    </div>
                  </div>
                </div>

                {mailInfo?.connection?.error && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs mb-6">
                    <p className="font-bold flex items-center gap-1.5 mb-1">
                      <i className="fas fa-triangle-exclamation"></i>
                      <span>SMTP Notice:</span>
                    </p>
                    <p className="font-mono text-[11px]">{mailInfo.connection.error}</p>
                    <p className="mt-1 text-[11px]">
                      The platform automatically uses the resilient simulated mailer so verification OTPs and order receipts never fail while SMTP credentials are being configured.
                    </p>
                  </div>
                )}

                {/* Test Email Dispatch Form */}
                <form onSubmit={handleSendTestEmail} className="pt-4 border-t border-[#E7D5BC]/60">
                  <h4 className="text-xs font-bold text-[#1A1512] uppercase tracking-wider mb-2">
                    Send Live Diagnostic Test Email
                  </h4>
                  <div className="flex flex-col sm:flex-row items-stretch gap-2 max-w-xl">
                    <input
                      type="email"
                      required
                      value={testRecipient}
                      onChange={(e) => setTestRecipient(e.target.value)}
                      placeholder="e.g. lukajohn70@gmail.com"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-[#E7D5BC] bg-[#FAF7F2] text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E]"
                    />
                    <button
                      type="submit"
                      disabled={testMailStatus.loading}
                      className="px-6 py-2.5 bg-[#B5532E] hover:bg-[#8F3B1F] text-white text-xs font-bold rounded-xl border-0 cursor-pointer shadow-xs transition flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
                    >
                      <i className={`fas ${testMailStatus.loading ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
                      <span>{testMailStatus.loading ? 'Dispatching...' : 'Send Test Email'}</span>
                    </button>
                  </div>

                  {testMailStatus.result && (
                    <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                      <i className="fas fa-circle-check text-emerald-600"></i>
                      <span>{testMailStatus.result}</span>
                    </div>
                  )}

                  {testMailStatus.error && (
                    <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <i className="fas fa-circle-exclamation text-red-600"></i>
                      <span>{testMailStatus.error}</span>
                    </div>
                  )}
                </form>
              </div>

              {/* Configuration Guide */}
              <div className="bg-white rounded-2xl border border-[#E7D5BC] shadow-xs p-6">
                <h4 className="text-xs font-bold text-[#1A1512] uppercase tracking-wider mb-2 flex items-center gap-2">
                  <i className="fas fa-key text-[#D9A441]"></i>
                  <span>Production SMTP Environment Variables (.env)</span>
                </h4>
                <p className="text-xs text-[#8C8279] mb-3">
                  To connect your real cPanel webmail account or transactional SMTP relay, add these variables to your server environment or <code className="bg-[#FAF7F2] px-1 py-0.5 rounded text-[#2A2320]">.env</code>:
                </p>
                <pre className="p-4 rounded-xl bg-[#2A2320] text-[#F6EDE0] font-mono text-xs overflow-x-auto leading-relaxed">
{`# Manga Marketsquare SMTP Configuration
SMTP_HOST=mail.manga.jlm.com.ng
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=support@manga.jlm.com.ng
SMTP_PASS=YourSecureEmailPasswordHere
MAIL_FROM_NAME="MANGA MARKETSQUARE"
MAIL_FROM_ADDRESS=support@jlm.com.ng`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer cartCount={cartCount} wishlistCount={wishlistCount} />
    </div>
  );
}
