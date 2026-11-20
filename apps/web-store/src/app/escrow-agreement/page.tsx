'use client';

import * as React from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export default function BuyerProtectionAgreementPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-sans text-[#1D1917]">
      <Header />

      <main className="flex-1 container mx-auto px-4 lg:px-8 py-8 sm:py-12 max-w-4xl">
        <nav className="flex items-center gap-2 text-xs text-[#78716C] mb-6">
          <Link href="/" className="hover:text-[#1D1917] transition-colors">Home</Link>
          <span className="text-[#C5BDB5]">/</span>
          <span className="text-[#1D1917] font-semibold">Buyer Protection Agreement</span>
        </nav>

        <div className="bg-white rounded-3xl border border-[#EAE3D9] p-6 sm:p-10 mb-8 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4F6B3A]/10 border border-[#4F6B3A]/20 text-[#4F6B3A] text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4F6B3A]" />
            100% Verified Sellers • Genuine Commerce Guarantee
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold apple-heading text-[#1D1917] tracking-tight mb-3">
            MANGA MARKETSQUARE Buyer Protection Agreement
          </h1>
          <p className="text-sm text-[#78716C]">
            Zero-Risk Commerce Guarantee for Discerning Buyers & Verified Sellers
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[#EAE3D9] p-6 sm:p-10 space-y-8 text-sm sm:text-base leading-relaxed text-[#1D1917]/85 shadow-xs">
          
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#1D1917] mb-3 flex items-center gap-2">
              <span className="text-[#4F6B3A]">1.</span> 100% Verified Sellers Promise
            </h2>
            <p>
              Every merchant operating on <strong>MANGA MARKETSQUARE</strong> undergoes thorough identity and registration checks before listing products. We strictly prohibit unauthorized or unverified third-party vendors.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#1D1917] mb-3 flex items-center gap-2">
              <span className="text-[#4F6B3A]">2.</span> Same-Day Delivery in Kaduna
            </h2>
            <p>
              We guarantee that <strong>same-day delivery is possible for orders placed within Kaduna</strong>. For destinations outside Kaduna, we provide dependable courier dispatch nationwide with real-time tracking numbers.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D9]">
                <div className="font-bold text-sm text-[#B5532E] mb-1">Within Kaduna</div>
                <p className="text-xs text-[#78716C]">Same-day courier delivery available for local Kaduna residential and business orders.</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D9]">
                <div className="font-bold text-sm text-[#4F6B3A] mb-1">Nationwide</div>
                <p className="text-xs text-[#78716C]">Reliable nationwide delivery with certified courier partners across Nigeria.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#1D1917] mb-3 flex items-center gap-2">
              <span className="text-[#4F6B3A]">3.</span> 7-Day Return & Replacement Policy
            </h2>
            <p>
              If a product arrives damaged, defective, or differing from the confirmed listing specifications, buyers are entitled to a full replacement or refund within 7 calendar days of delivery.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#1D1917] mb-3 flex items-center gap-2">
              <span className="text-[#4F6B3A]">4.</span> Secure Payments
            </h2>
            <p>
              All online transactions are processed through 256-bit SSL encrypted PCI-DSS Level 1 compliant payment partners (Paystack / Cards / Bank Transfer).
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
