'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
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

export default function AdminHubPage() {
  const { user, loginCustomer, logoutCustomer, cartCount, wishlistCount } = useStore();
  const [diagnostics, setDiagnostics] = useState<SystemDiagnostics | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'tables' | 'products'>('overview');

  // Admin Login State
  const [emailInput, setEmailInput] = useState('lukajohn70@gmail.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Purge State
  const [purging, setPurging] = useState(false);
  const [purgeResult, setPurgeResult] = useState<string | null>(null);

  const isAdmin = user && user.role === 'ADMIN';

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

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput.trim()) {
      setAuthError('Please enter both administrator email and password.');
      return;
    }

    setAuthError(null);
    setAuthLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch('/api/setup?action=purge');
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
      <div className="min-h-screen flex flex-col bg-[#1A1512] text-white">
        <Header cartCount={cartCount} wishlistCount={wishlistCount} />

        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full bg-[#241D19] border border-[#D9A441]/30 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-[#B5532E]/20 text-[#D9A441] flex items-center justify-center text-2xl mx-auto mb-4 border border-[#D9A441]/40">
                <i className="fas fa-shield-halved"></i>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B5532E]/30 text-[#D9A441] text-[11px] font-bold uppercase tracking-wider mb-2">
                Restricted Operations Area
              </div>
              <h1 className="text-2xl font-black font-display text-white">
                Platform Operations Gate
              </h1>
              <p className="text-xs text-[#C5BCB3] mt-2 leading-relaxed">
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
                <label className="block text-xs font-bold text-[#E7D5BC] mb-1.5">
                  Administrator Email
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="e.g. lukajohn70@gmail.com"
                  className="w-full px-4 py-3 bg-[#1A1512] border border-[#4A3E38] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D9A441] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#E7D5BC] mb-1.5">
                  Admin Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full px-4 py-3 bg-[#1A1512] border border-[#4A3E38] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D9A441] transition"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3.5 bg-[#B5532E] hover:bg-[#8F3B1F] text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer border-0 mt-2"
              >
                <i className={`fas ${authLoading ? 'fa-spinner fa-spin' : 'fa-key'} text-[#D9A441]`}></i>
                <span>{authLoading ? 'Verifying Credentials...' : 'Authenticate as Administrator'}</span>
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#4A3E38] text-center">
              <Link
                href="/"
                className="text-xs text-[#8C8279] hover:text-[#E7D5BC] font-medium transition inline-flex items-center gap-1.5"
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
      <div className="min-h-screen flex flex-col bg-[#1A1512] text-white">
        <Header cartCount={cartCount} wishlistCount={wishlistCount} />

        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full bg-[#241D19] border border-rose-500/30 rounded-3xl p-8 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-2xl mx-auto mb-4 border border-rose-500/40">
              <i className="fas fa-lock"></i>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              403 Forbidden
            </div>
            <h1 className="text-2xl font-black font-display text-white mb-2">
              Administrator Privileges Required
            </h1>
            <p className="text-xs text-[#C5BCB3] leading-relaxed mb-6">
              You are currently authenticated as <strong className="text-white">{user.email}</strong> with role{' '}
              <span className="px-2 py-0.5 rounded bg-white/10 text-[#D9A441] font-mono font-bold">[{user.role}]</span>.
              Access to platform operations and database management is strictly restricted to authorized administrators.
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={logoutCustomer}
                className="w-full py-3 bg-[#B5532E] hover:bg-[#8F3B1F] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer border-0"
              >
                <i className="fas fa-right-from-bracket"></i>
                <span>Sign Out & Switch Account</span>
              </button>

              <Link
                href="/"
                className="block w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition text-center"
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
          <div className="bg-[#1A1512] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-[#D9A441]/30 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B5532E]/30 text-[#D9A441] text-xs font-bold uppercase tracking-wider">
                  <i className="fas fa-shield-halved"></i>
                  <span>Platform Operations Control Hub</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black">MANGA Platform Administration</h1>
                <p className="text-xs text-[#E7D5BC]">
                  PostgreSQL database status, microservice health, and platform governance.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Admin: {user.name} ({user.email})
                  </span>
                  <button
                    type="button"
                    disabled={purging}
                    onClick={handlePurgeDatabase}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-xs font-bold text-white border border-rose-400/30 cursor-pointer transition flex items-center gap-1.5"
                  >
                    <i className={`fas ${purging ? 'fa-spinner fa-spin' : 'fa-trash-can'}`}></i>
                    <span>{purging ? 'Purging DB...' : 'Purge All Products'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={logoutCustomer}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white border border-white/20 cursor-pointer transition"
                  >
                    Sign Out
                  </button>
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
            <div className="bg-white p-5 rounded-2xl border border-[#E7D5BC] shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8C8279]">Database Engine</span>
                <i className="fas fa-database text-[#B5532E]"></i>
              </div>
              <div className="text-lg font-black text-[#1A1512] mt-2">
                {diagnostics?.database || 'PostgreSQL'}
              </div>
              <div className="text-[11px] text-[#8C8279] mt-1 flex items-center gap-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    diagnostics?.connected ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                ></span>
                <span>{diagnostics?.connected ? 'Online & Responsive' : loading ? 'Connecting...' : 'Offline'}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E7D5BC] shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8C8279]">Active Master Products</span>
                <i className="fas fa-box text-[#D9A441]"></i>
              </div>
              <div className="text-lg font-black text-[#1A1512] mt-2">
                {diagnostics?.tableCounts?.['catalog.master_products'] ?? '-'}
              </div>
              <div className="text-[11px] text-[#8C8279] mt-1">
                In-stock catalog items
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E7D5BC] shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8C8279]">Verified Vendors</span>
                <i className="fas fa-store text-emerald-600"></i>
              </div>
              <div className="text-lg font-black text-[#1A1512] mt-2">
                {diagnostics?.tableCounts?.['vendor.vendors'] ?? '-'}
              </div>
              <div className="text-[11px] text-[#8C8279] mt-1">
                Registered merchant partners
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E7D5BC] shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8C8279]">Platform Categories</span>
                <i className="fas fa-tags text-indigo-600"></i>
              </div>
              <div className="text-lg font-black text-[#1A1512] mt-2">
                {diagnostics?.tableCounts?.['catalog.categories'] ?? '-'}
              </div>
              <div className="text-[11px] text-[#8C8279] mt-1">
                Active department nodes
              </div>
            </div>
          </div>

          {/* Diagnostics Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-[#E7D5BC] mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-xs font-bold border-b-2 transition cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-[#B5532E] text-[#B5532E]'
                  : 'border-transparent text-[#8C8279] hover:text-[#1A1512]'
              }`}
            >
              System Diagnostics
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tables')}
              className={`px-4 py-2 text-xs font-bold border-b-2 transition cursor-pointer ${
                activeTab === 'tables'
                  ? 'border-[#B5532E] text-[#B5532E]'
                  : 'border-transparent text-[#8C8279] hover:text-[#1A1512]'
              }`}
            >
              PostgreSQL Tables
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 text-xs font-bold border-b-2 transition cursor-pointer ${
                activeTab === 'products'
                  ? 'border-[#B5532E] text-[#B5532E]'
                  : 'border-transparent text-[#8C8279] hover:text-[#1A1512]'
              }`}
            >
              Live Catalog Sample
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
        </div>
      </main>

      <Footer cartCount={cartCount} wishlistCount={wishlistCount} />
    </div>
  );
}
