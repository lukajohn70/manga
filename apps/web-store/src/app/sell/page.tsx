'use client';

import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { useStore } from '../../context/StoreContext';
import { DEV_VENDOR_URL } from '../../lib/portal-urls';

export default function SellOnMangaPage() {
  const { user, logoutCustomer, cartCount, wishlistCount } = useStore();
  const isMerchantLoggedIn = Boolean(user && (user.role === 'VENDOR' || user.role === 'ADMIN'));

  // Registration form state
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Kaduna');
  const [category, setCategory] = useState('Electronics & Audio');
  const [notes, setNotes] = useState('');
  const [merchantAgreed, setMerchantAgreed] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // FAQ toggle state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantAgreed) {
      setErrorMessage('Please accept the Merchant Standards, Terms of Service, and Privacy Policy to register.');
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/vendor/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName,
          ownerName,
          email,
          phone,
          city,
          category,
          notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmissionSuccess(data.message || `Welcome aboard, ${businessName}! Your merchant account has been registered.`);
      } else {
        setErrorMessage(data.message || 'Failed to submit merchant registration. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLocalDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  const faqs = [
    {
      q: 'How do payouts work and how fast do I get paid?',
      a: 'All transactions on MANGA are backed by secure escrow. Once our dispatch fleet delivers an order and the buyer confirms receipt (or after 24 hours of successful delivery), your funds are disbursed directly to your designated Nigerian bank account via automated Paystack transfers.',
    },
    {
      q: 'Who handles shipping and customer deliveries?',
      a: 'MANGA Express Logistics handles pickup and last-mile delivery. When you receive an order notification, simply pack the item securely with the generated shipping slip. Our dispatch courier will pick it up directly from your physical store or warehouse in Kaduna, Abuja, Kano, or Lagos.',
    },
    {
      q: 'What are the merchant fees and commission rates?',
      a: 'New merchant partners enjoy 0% platform commission for their first 30 days! After the introductory period, standard category rates range between 3% to 7% depending on the department (Electronics, Fashion, Home Goods). There are zero monthly listing fees or hidden charges.',
    },
    {
      q: 'What do I need to start selling today?',
      a: 'All you need is a valid government ID or CAC business registration (for corporate entities), an active Nigerian bank account, and high-quality photos of the genuine items you wish to sell.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1D1917]">
      <Header cartCount={cartCount} wishlistCount={wishlistCount} />

      <main className="flex-1">
        {/* Local Dev Notice Banner */}
        {isLocalDev && (
          <div className="bg-[#1A1513] text-[#E7D5BC] px-4 py-2 text-xs flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
              <i className="fas fa-code text-[#D9A441]"></i>
              <span>
                <strong>Local Development Mode:</strong> You can also access the standalone Vite Merchant Console at{' '}
                <a href={DEV_VENDOR_URL} target="_blank" rel="noreferrer" className="underline font-bold text-white hover:text-[#D9A441]">
                  http://localhost:3001
                </a>.
              </span>
            </div>
          </div>
        )}

        {/* 1. Hero Section: Apple Dark Finish */}
        <section className="relative bg-[#1A1513] text-white py-16 lg:py-24 overflow-hidden border-b border-black/30">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background: 'radial-gradient(ellipse 70% 50% at 50% -15%, rgba(181, 83, 46, 0.28), rgba(26, 21, 19, 0) 80%)',
            }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#E7D5BC] text-xs font-semibold uppercase tracking-wider">
                  <i className="fas fa-crown text-[#D9A441]"></i>
                  <span>Merchant Partner Program</span>
                </div>

                <h1 className="apple-heading text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]">
                  Reach 50,000+ Active Shoppers on{' '}
                  <span className="text-[#E7D5BC]">MANGA</span>
                </h1>

                <p className="apple-subhead text-white/70 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                  Scale your business across Northern Nigeria and nationwide. Leverage our doorstep pickup logistics,
                  instant escrow payments, and dedicated merchant analytics to grow your revenue.
                </p>

                {/* Value Highlights */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                  <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-white tracking-tight">0%</div>
                    <div className="text-xs text-white/60 mt-0.5">Intro Commission (30 Days)</div>
                  </div>
                  <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-white tracking-tight">24h</div>
                    <div className="text-xs text-white/60 mt-0.5">Fast Escrow Disbursements</div>
                  </div>
                  <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-4 backdrop-blur-sm col-span-2 sm:col-span-1">
                    <div className="text-2xl font-bold text-white tracking-tight">Doorstep</div>
                    <div className="text-xs text-white/60 mt-0.5">Manga Logistics Pickup</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-4">
                  {isMerchantLoggedIn ? (
                    <>
                      <motion.a
                        href="#merchant-console"
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.25 }}
                        className="px-8 py-3.5 rounded-xl bg-[#B5532E] hover:bg-[#A04523] text-white font-semibold text-sm shadow-xs transition-colors inline-flex items-center gap-2 no-underline apple-pressable"
                      >
                        <i className="fas fa-store text-xs text-[#D9A441]"></i>
                        <span>Open Merchant Console</span>
                      </motion.a>

                      <button
                        type="button"
                        onClick={() => logoutCustomer()}
                        className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-sm transition-colors inline-flex items-center gap-2 cursor-pointer border-0 apple-pressable"
                      >
                        <span>Sign Out</span>
                        <i className="fas fa-arrow-right-from-bracket text-xs opacity-75"></i>
                      </button>
                    </>
                  ) : (
                    <>
                      <motion.a
                        href="#register"
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.25 }}
                        className="px-8 py-3.5 rounded-xl bg-[#B5532E] hover:bg-[#A04523] text-white font-semibold text-sm shadow-xs transition-colors inline-flex items-center gap-2 no-underline apple-pressable"
                      >
                        <span>Register Your Store</span>
                        <i className="fas fa-arrow-down text-xs opacity-75"></i>
                      </motion.a>

                      <Link
                        href="/merchant/login"
                        className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-sm transition-colors inline-flex items-center gap-2 no-underline apple-pressable"
                      >
                        <span>Merchant Sign In</span>
                        <i className="fas fa-arrow-right text-xs opacity-75"></i>
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Hero Graphic / Badge Card */}
              <div className="lg:col-span-5">
                <div className="apple-glass-dark border border-white/15 rounded-3xl p-6 sm:p-8 shadow-xl relative">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#B5532E] flex items-center justify-center text-white text-xl font-black shadow-md">
                        M
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">Verified Merchant Console</h3>
                        <p className="text-[11px] text-[#D9A441]">Northern Nigeria Gateway</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                      Live Network
                    </span>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-[#E7D5BC]">Coverage Hubs</span>
                      <span className="text-white font-bold">Kaduna • Kano • Abuja • Lagos</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-[#E7D5BC]">Platform Reliability</span>
                      <span className="text-white font-bold">99.9% Cloud Uptime</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-[#E7D5BC]">Disbursement Partner</span>
                      <span className="text-white font-bold">Paystack Escrow System</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-[#E7D5BC]">Rider Pickup Network</span>
                      <span className="text-white font-bold">Manga Dispatch Express</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 text-center">
                    <p className="text-[11px] text-[#E7D5BC]/70">
                      Zero setup fee • Automatic product indexing in Manga search
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Merchant Partner Console (Active Authenticated Partner View) */}
        {isMerchantLoggedIn && (
          <section id="merchant-console" className="py-12 bg-white border-b border-[#E7D5BC]/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Partner Profile Header Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF7F2] border border-[#E7D5BC] shadow-xs mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#B5532E] text-white flex items-center justify-center text-2xl font-black shadow-md flex-shrink-0">
                    <i className="fas fa-store"></i>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h2 className="text-xl sm:text-2xl font-black text-[#1D1917] tracking-tight">
                        {user?.name} Storefront
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-300 flex items-center gap-1">
                        <i className="fas fa-certificate text-emerald-600"></i> Verified Partner (Level 1)
                      </span>
                    </div>
                    <p className="text-xs text-[#78716C] flex flex-wrap items-center gap-3">
                      <span><i className="far fa-envelope mr-1 text-[#B5532E]"></i>{user?.email}</span>
                      <span>•</span>
                      <span><i className="fas fa-location-dot mr-1 text-[#4F6B3A]"></i>Northern Nigeria Logistics Network</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <Link
                    href="/account"
                    className="px-4 py-2.5 rounded-xl bg-white border border-[#EAE3D9] text-[#1D1917] hover:text-[#B5532E] text-xs font-semibold transition flex items-center gap-1.5 no-underline apple-pressable"
                  >
                    <i className="fas fa-bag-shopping text-[#78716C]"></i> Shopper Account
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="px-4 py-2.5 rounded-xl bg-[#161311] text-[#D9A441] border border-[#D9A441]/40 text-xs font-semibold transition flex items-center gap-1.5 no-underline apple-pressable"
                    >
                      <i className="fas fa-shield-halved text-[#D9A441]"></i> Admin Hub
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => logoutCustomer()}
                    className="px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[#B3261E] text-xs font-semibold transition cursor-pointer hover:bg-rose-100 apple-pressable border-0"
                  >
                    <i className="fas fa-arrow-right-from-bracket mr-1"></i> Sign Out
                  </button>
                </div>
              </div>

              {/* Operational KPI Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E7D5BC] shadow-xs">
                  <div className="flex items-center justify-between text-xs text-[#78716C] font-semibold mb-2">
                    <span>Store Status</span>
                    <i className="fas fa-circle-check text-emerald-600 text-sm"></i>
                  </div>
                  <div className="text-2xl font-black text-[#1D1917]">Live & Indexed</div>
                  <div className="text-[11px] text-[#78716C] mt-1">Catalog synchronized with Manga search</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E7D5BC] shadow-xs">
                  <div className="flex items-center justify-between text-xs text-[#78716C] font-semibold mb-2">
                    <span>Fulfillment SLA</span>
                    <i className="fas fa-truck-fast text-[#4F6B3A] text-sm"></i>
                  </div>
                  <div className="text-2xl font-black text-[#1D1917]">99.4% On-Time</div>
                  <div className="text-[11px] text-[#78716C] mt-1">Same-day courier dispatch pickup</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E7D5BC] shadow-xs">
                  <div className="flex items-center justify-between text-xs text-[#78716C] font-semibold mb-2">
                    <span>Escrow Settlement</span>
                    <i className="fas fa-shield-halved text-[#D9A441] text-sm"></i>
                  </div>
                  <div className="text-2xl font-black text-[#1D1917]">Paystack Auto</div>
                  <div className="text-[11px] text-[#78716C] mt-1">Disbursements paid within 24h</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E7D5BC] shadow-xs">
                  <div className="flex items-center justify-between text-xs text-[#78716C] font-semibold mb-2">
                    <span>Merchant Rating</span>
                    <i className="fas fa-star text-amber-500 text-sm"></i>
                  </div>
                  <div className="text-2xl font-black text-[#1D1917]">4.98 / 5.0</div>
                  <div className="text-[11px] text-[#78716C] mt-1">Top-tier customer satisfaction badge</div>
                </div>
              </div>

              {/* Operational Tools & Direct Desk */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E7D5BC] space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#B5532E]/10 text-[#B5532E] flex items-center justify-center text-lg font-bold">
                    <i className="fas fa-boxes-stacked"></i>
                  </div>
                  <h3 className="font-bold text-sm text-[#1D1917]">Catalog & Inventory</h3>
                  <p className="text-xs text-[#78716C] leading-relaxed">
                    List genuine items, set prices in Naira (₦), update available stock units, and configure product variants.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B5532E] hover:underline"
                  >
                    <span>Browse Marketplace Index</span> <i className="fas fa-arrow-right text-[10px]"></i>
                  </Link>
                </div>

                <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E7D5BC] space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#4F6B3A]/10 text-[#4F6B3A] flex items-center justify-center text-lg font-bold">
                    <i className="fas fa-truck-ramp-box"></i>
                  </div>
                  <h3 className="font-bold text-sm text-[#1D1917]">Manga Logistics Fleet</h3>
                  <p className="text-xs text-[#78716C] leading-relaxed">
                    Doorstep package collection in Kaduna, Kano, Abuja, and Lagos with automated barcode dispatch slips.
                  </p>
                  <Link
                    href="/track-order"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4F6B3A] hover:underline"
                  >
                    <span>Track Fleet Deliveries</span> <i className="fas fa-arrow-right text-[10px]"></i>
                  </Link>
                </div>

                <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E7D5BC] space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D9A441]/15 text-[#B5532E] flex items-center justify-center text-lg font-bold">
                    <i className="fas fa-headset"></i>
                  </div>
                  <h3 className="font-bold text-sm text-[#1D1917]">Dedicated Partner Desk</h3>
                  <p className="text-xs text-[#78716C] leading-relaxed">
                    Direct merchant support line for catalog bulk imports, dispatch scheduling, and payout queries.
                  </p>
                  <div className="pt-1 flex flex-col gap-1 text-xs font-bold text-[#1D1917]">
                    <a href="tel:0700928672" className="text-[#B5532E] hover:underline flex items-center gap-1.5">
                      <i className="fas fa-phone text-[10px]"></i> 0700 928 672
                    </a>
                    <a href="mailto:vendors@manga.jlm.com.ng" className="text-[#78716C] hover:underline flex items-center gap-1.5 font-normal">
                      <i className="far fa-envelope text-[10px]"></i> vendors@manga.jlm.com.ng
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 2. Key Merchant Benefits */}
        <section id="benefits" className="py-16 bg-white border-b border-[#E7D5BC]/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-xs uppercase tracking-widest text-[#B5532E] font-black mb-2">Why Partner With Us</h2>
              <h3 className="text-2xl sm:text-4xl font-black text-[#1A1512]">Everything You Need to Sell & Scale</h3>
              <p className="text-sm text-[#8C8279] mt-3">
                Focus on sourcing and manufacturing great products. We take care of shoppers, payment security, and deliveries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E7D5BC]/80 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#B5532E]/10 text-[#B5532E] flex items-center justify-center text-xl font-bold">
                  <i className="fas fa-truck-fast"></i>
                </div>
                <h4 className="font-black text-[#1A1512] text-base">Hassle-Free Logistics</h4>
                <p className="text-xs text-[#8C8279] leading-relaxed">
                  No need to negotiate with delivery riders. Manga Logistics couriers pick up orders directly from your store.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E7D5BC]/80 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#D9A441]/10 text-[#D9A441] flex items-center justify-center text-xl font-bold">
                  <i className="fas fa-shield-halved"></i>
                </div>
                <h4 className="font-black text-[#1A1512] text-base">Escrow-Backed Payouts</h4>
                <p className="text-xs text-[#8C8279] leading-relaxed">
                  Every order is paid upfront into escrow. Once delivered, payments disburse straight into your Nigerian bank account.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E7D5BC]/80 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#2A2320]/10 text-[#2A2320] flex items-center justify-center text-xl font-bold">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h4 className="font-black text-[#1A1512] text-base">Real-Time Insights</h4>
                <p className="text-xs text-[#8C8279] leading-relaxed">
                  Track revenue, best-selling inventory, order fulfillment velocity, and customer reviews in your merchant portal.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E7D5BC]/80 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl font-bold">
                  <i className="fas fa-headset"></i>
                </div>
                <h4 className="font-black text-[#1A1512] text-base">Dedicated Partner Support</h4>
                <p className="text-xs text-[#8C8279] leading-relaxed">
                  Get direct access to our Merchant Success desk in Kaduna & Lagos for onboarding assistance and catalog bulk uploads.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Simple 4-Step Process */}
        <section className="py-16 bg-[#F6EDE0]/40 border-b border-[#E7D5BC]/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-xs uppercase tracking-widest text-[#B5532E] font-black mb-2">How It Works</h2>
              <h3 className="text-2xl sm:text-3xl font-black text-[#1A1512]">From Application to First Sale</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              <div className="bg-white p-6 rounded-2xl border border-[#E7D5BC] shadow-xs relative">
                <span className="w-8 h-8 rounded-full bg-[#1A1512] text-white flex items-center justify-center text-xs font-black mb-4">
                  1
                </span>
                <h4 className="font-black text-sm text-[#1A1512] mb-1">Submit Application</h4>
                <p className="text-xs text-[#8C8279] leading-relaxed">
                  Fill out the registration form below with your store details and business contact information.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E7D5BC] shadow-xs relative">
                <span className="w-8 h-8 rounded-full bg-[#B5532E] text-white flex items-center justify-center text-xs font-black mb-4">
                  2
                </span>
                <h4 className="font-black text-sm text-[#1A1512] mb-1">List Your Catalog</h4>
                <p className="text-xs text-[#8C8279] leading-relaxed">
                  Upload your products, specify prices in Nigerian Naira (₦), variety options, and stock quantities.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E7D5BC] shadow-xs relative">
                <span className="w-8 h-8 rounded-full bg-[#D9A441] text-[#1A1512] flex items-center justify-center text-xs font-black mb-4">
                  3
                </span>
                <h4 className="font-black text-sm text-[#1A1512] mb-1">Fulfill Customer Orders</h4>
                <p className="text-xs text-[#8C8279] leading-relaxed">
                  When an order arrives, pack the item. Manga dispatch riders collect the package directly from your premises.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E7D5BC] shadow-xs relative">
                <span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black mb-4">
                  4
                </span>
                <h4 className="font-black text-sm text-[#1A1512] mb-1">Receive Escrow Payouts</h4>
                <p className="text-xs text-[#8C8279] leading-relaxed">
                  Earnings are deposited straight into your Nigerian bank account with complete transparent transaction receipts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Interactive Registration Form */}
        <section id="register" className="py-16 bg-white border-b border-[#E7D5BC]/60">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D9A441]/10 text-[#B5532E] font-black text-xs uppercase tracking-wider mb-2">
                <i className="fas fa-handshake"></i> Fast-Track Onboarding
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1A1512]">Register Your Store on Manga</h2>
              <p className="text-xs text-[#8C8279] mt-2">
                Join verified merchants across Nigeria. Fill out this brief form to activate your merchant account.
              </p>
            </div>

            {submissionSuccess ? (
              <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center text-2xl mx-auto shadow-md">
                  <i className="fas fa-check"></i>
                </div>
                <h3 className="text-xl font-black text-emerald-900">Application Approved & Verified!</h3>
                <p className="text-sm text-emerald-800 leading-relaxed max-w-md mx-auto">
                  {submissionSuccess}
                </p>
                <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href="/merchant/login"
                    className="px-6 py-3 rounded-xl bg-[#B5532E] hover:bg-[#8F3B1F] text-white font-bold text-xs shadow-md transition"
                  >
                    Proceed to Merchant Sign In
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmissionSuccess(null);
                      setBusinessName('');
                      setEmail('');
                    }}
                    className="px-6 py-3 rounded-xl bg-white border border-[#E7D5BC] text-[#2A2320] font-semibold text-xs hover:bg-[#FAF7F2] transition"
                  >
                    Register Another Store
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-[#FAF7F2] p-6 sm:p-10 rounded-3xl border border-[#E7D5BC] shadow-lg space-y-6">
                {errorMessage && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <i className="fas fa-triangle-exclamation"></i>
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1A1512] mb-1.5">
                      Store / Business Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Kaduna Artisan Audio Hub"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E7D5BC] bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-[#B5532E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A1512] mb-1.5">
                      Contact Person / Store Manager *
                    </label>
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="e.g. Ibrahim Aliyu"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E7D5BC] bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-[#B5532E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1A1512] mb-1.5">
                      Business Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. seller@kadunahub.ng"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E7D5BC] bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-[#B5532E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A1512] mb-1.5">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +234 803 123 4567"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E7D5BC] bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-[#B5532E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1A1512] mb-1.5">
                      Store City / Operating Hub *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E7D5BC] bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-[#B5532E]"
                    >
                      <option value="Kaduna">Kaduna</option>
                      <option value="Abuja (FCT)">Abuja (FCT)</option>
                      <option value="Kano">Kano</option>
                      <option value="Jos">Jos</option>
                      <option value="Lagos">Lagos</option>
                      <option value="Other Nigerian City">Other Nigerian City</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A1512] mb-1.5">
                      Primary Product Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E7D5BC] bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-[#B5532E]"
                    >
                      <option value="Electronics & Audio">Electronics & Audio</option>
                      <option value="Phones & Computing">Phones & Computing</option>
                      <option value="Fashion & Streetwear">Fashion & Streetwear</option>
                      <option value="Home & Appliances">Home & Appliances</option>
                      <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                      <option value="Groceries & Essentials">Groceries & Essentials</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1512] mb-1.5">
                    Store Description / Product Range (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Briefly describe what items you manufacture or sell..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E7D5BC] bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-[#B5532E]"
                  ></textarea>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E7D5BC] text-xs text-[#6B5E57] space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      required
                      checked={merchantAgreed}
                      onChange={(e) => setMerchantAgreed(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-[#E7D5BC] text-[#B5532E] focus:ring-[#B5532E] cursor-pointer"
                    />
                    <span className="text-xs text-[#2A2320] leading-relaxed">
                      I have read and agree to Manga's{' '}
                      <Link href="/terms-of-service" target="_blank" className="text-[#B5532E] font-bold underline hover:text-[#8F3B1F]">
                        Terms of Service
                      </Link>
                      ,{' '}
                      <Link href="/privacy-policy" target="_blank" className="text-[#B5532E] font-bold underline hover:text-[#8F3B1F]">
                        Privacy Policy
                      </Link>
                      , and{' '}
                      <Link href="/escrow-agreement" target="_blank" className="text-[#B5532E] font-bold underline hover:text-[#8F3B1F]">
                        Merchant Quality & Escrow Standards
                      </Link>
                      .
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !merchantAgreed}
                  className="w-full py-4 rounded-xl bg-[#B5532E] hover:bg-[#8F3B1F] text-white font-black text-sm shadow-lg shadow-[#B5532E]/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>Registering Merchant Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Merchant Registration</span>
                      <i className="fas fa-arrow-right"></i>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* 5. Frequently Asked Questions */}
        <section id="faq" className="py-16 bg-[#FAF7F2]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-xs uppercase tracking-widest text-[#B5532E] font-black mb-2">Have Questions?</h2>
              <h3 className="text-2xl sm:text-3xl font-black text-[#1A1512]">Frequently Asked Questions</h3>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={index} className="bg-white rounded-2xl border border-[#E7D5BC] overflow-hidden shadow-xs">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full px-6 py-4 text-left font-bold text-sm text-[#1A1512] flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F6EDE0]/40 transition"
                    >
                      <span>{faq.q}</span>
                      <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} text-xs text-[#8C8279]`}></i>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-xs text-[#8C8279] leading-relaxed border-t border-[#E7D5BC]/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-10 p-6 rounded-2xl bg-white border border-[#E7D5BC] text-center space-y-2">
              <h4 className="font-bold text-xs text-[#1A1512]">Need personalized merchant support?</h4>
              <p className="text-xs text-[#8C8279]">
                Call our Northern Merchant Desk at{' '}
                <a href="tel:0700928672" className="text-[#B5532E] font-bold hover:underline">
                  0700 928 672
                </a>{' '}
                or email{' '}
                <a href="mailto:vendors@manga.jlm.com.ng" className="text-[#B5532E] font-bold hover:underline">
                  vendors@manga.jlm.com.ng
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer cartCount={cartCount} wishlistCount={wishlistCount} />
    </div>
  );
}
