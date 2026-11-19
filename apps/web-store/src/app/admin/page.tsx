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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'tables' | 'products'>('overview');

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
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
  }, []);

  const [purging, setPurging] = useState(false);
  const [purgeResult, setPurgeResult] = useState<string | null>(null);

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

  const handleAdminQuickLogin = () => {
    loginCustomer('lukajohn70@gmail.com', 'Luka John', '+234 800 000 0000', 'ADMIN');
  };

  const isLocalDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

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
                {isAdmin ? (
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
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAdminQuickLogin}
                      className="px-4 py-2.5 rounded-xl bg-[#B5532E] hover:bg-[#8F3B1F] text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
                    >
                      <i className="fas fa-key"></i>
                      <span>Sign In as Luka John (Admin)</span>
                    </button>
                    <button
                      type="button"
                      disabled={purging}
                      onClick={handlePurgeDatabase}
                      className="px-4 py-2.5 rounded-xl bg-rose-600/90 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <i className={`fas ${purging ? 'fa-spinner fa-spin' : 'fa-trash-can'}`}></i>
                      <span>{purging ? 'Purging...' : 'Purge Database'}</span>
                    </button>
                  </div>
                )}
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
                <span>{diagnostics?.connected ? 'Online & Responsive' : 'Connecting...'}</span>
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
              Catalog Sample
            </button>
          </div>

          {/* Tab 1: System Diagnostics */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-[#E7D5BC] shadow-xs space-y-4">
                <h3 className="text-sm font-black text-[#1A1512]">Database Connection Information</h3>

                {loading ? (
                  <div className="text-xs text-[#8C8279] py-4 flex items-center gap-2">
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Probing database connection...</span>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E7D5BC] flex items-center justify-between">
                      <span className="font-bold text-[#8C8279]">PostgreSQL Version:</span>
                      <span className="font-mono text-[#1A1512] text-[11px] truncate max-w-md">
                        {diagnostics?.version || 'N/A'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E7D5BC] flex items-center justify-between">
                      <span className="font-bold text-[#8C8279]">Sanitized Connection Endpoint:</span>
                      <span className="font-mono text-[#1A1512] text-[11px]">
                        {diagnostics?.host || '127.0.0.1:5432'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E7D5BC] flex items-center justify-between">
                      <span className="font-bold text-[#8C8279]">API Diagnostics Route:</span>
                      <a
                        href="/api/setup"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#B5532E] font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <span>Inspect Raw JSON</span>
                        <i className="fas fa-arrow-up-right-from-square text-[10px]"></i>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Operation Links */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  href="/shop"
                  className="p-5 rounded-2xl bg-white border border-[#E7D5BC] hover:border-[#B5532E] transition shadow-xs group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#B5532E]/10 text-[#B5532E] flex items-center justify-center font-bold">
                      <i className="fas fa-store"></i>
                    </div>
                    <div>
                      <h4 className="font-black text-xs text-[#1A1512] group-hover:text-[#B5532E]">
                        Storefront Catalog
                      </h4>
                      <p className="text-[11px] text-[#8C8279]">Browse live customer marketplace</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/sell"
                  className="p-5 rounded-2xl bg-white border border-[#E7D5BC] hover:border-[#B5532E] transition shadow-xs group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#D9A441]/10 text-[#D9A441] flex items-center justify-center font-bold">
                      <i className="fas fa-handshake"></i>
                    </div>
                    <div>
                      <h4 className="font-black text-xs text-[#1A1512] group-hover:text-[#B5532E]">
                        Merchant Onboarding
                      </h4>
                      <p className="text-[11px] text-[#8C8279]">Vendor registration & portal</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/account"
                  className="p-5 rounded-2xl bg-white border border-[#E7D5BC] hover:border-[#B5532E] transition shadow-xs group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1A1512]/10 text-[#1A1512] flex items-center justify-center font-bold">
                      <i className="fas fa-user-shield"></i>
                    </div>
                    <div>
                      <h4 className="font-black text-xs text-[#1A1512] group-hover:text-[#B5532E]">
                        Account Profile
                      </h4>
                      <p className="text-[11px] text-[#8C8279]">Orders, addresses & security</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          )}

          {/* Tab 2: PostgreSQL Tables */}
          {activeTab === 'tables' && (
            <div className="bg-white rounded-3xl border border-[#E7D5BC] p-6 shadow-xs">
              <h3 className="text-sm font-black text-[#1A1512] mb-4">PostgreSQL Schema Tables</h3>
              {diagnostics?.tableCounts ? (
                <div className="divide-y divide-[#E7D5BC]/60">
                  {Object.entries(diagnostics.tableCounts).map(([tableName, count]) => (
                    <div key={tableName} className="py-3 flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-[#1A1512]">{tableName}</span>
                      <span className="px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E7D5BC] font-mono font-black text-[#B5532E]">
                        {count} {count === 1 ? 'row' : 'rows'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-[#8C8279]">No table metrics loaded.</div>
              )}
            </div>
          )}

          {/* Tab 3: Catalog Sample */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-3xl border border-[#E7D5BC] p-6 shadow-xs">
              <h3 className="text-sm font-black text-[#1A1512] mb-4">Sample Seeded Products</h3>
              {diagnostics?.sampleProducts && diagnostics.sampleProducts.length > 0 ? (
                <div className="divide-y divide-[#E7D5BC]/60">
                  {diagnostics.sampleProducts.map((p) => (
                    <div key={p.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                      <div>
                        <div className="font-bold text-[#1A1512]">{p.title}</div>
                        <div className="text-[11px] text-[#8C8279]">
                          {p.category} • Sold by {p.seller}
                        </div>
                      </div>
                      <div className="font-mono font-black text-[#B5532E] shrink-0">
                        ₦{Number(p.price_ngn).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-[#8C8279]">No sample products returned.</div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer cartCount={cartCount} wishlistCount={wishlistCount} />
    </div>
  );
}
