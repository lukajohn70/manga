'use client';

import * as React from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col font-sans text-[#2A2320]">
      <Header />

      <main className="flex-1 container mx-auto px-4 lg:px-8 py-8 sm:py-12 max-w-4xl">
        <nav className="flex items-center gap-2 text-xs text-[#8C8279] mb-6">
          <Link href="/" className="hover:text-[#B5532E] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#2A2320] font-semibold">Terms of Service</span>
        </nav>

        <div className="bg-white rounded-2xl border border-[#E7D5BC] p-6 sm:p-10 mb-8 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF7ED] border border-[#F3E2CB] text-[#B5532E] text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-[#B5532E]" />
            Binding User & Verified Merchant Agreement
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-display text-[#2A2320] tracking-tight mb-3">
            MANGA MARKETSQUARE Terms of Service
          </h1>
          <p className="text-sm text-[#8C8279]">
            Last updated: November 17, 2026 • Valid for All Buyers & Verified Merchants
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E7D5BC] p-6 sm:p-10 space-y-8 text-sm sm:text-base leading-relaxed text-[#4A3E39] shadow-xs">
          
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#2A2320] mb-3 flex items-center gap-2">
              <span className="text-[#B5532E]">1.</span> Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or placing an order on <strong>MANGA MARKETSQUARE</strong> (web portal or native mobile applications), you agree to be legally bound by these Terms of Service, our Privacy Policy, and our Buyer Protection Policy. If you disagree with any part of these terms, you must discontinue use immediately.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#2A2320] mb-3 flex items-center gap-2">
              <span className="text-[#B5532E]">2.</span> Verified Sellers & Authenticity Guarantee
            </h2>
            <p>
              All sellers on MANGA MARKETSQUARE are identity-verified. Merchants strictly agree to:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>List only genuine, brand-new or certified refurbished products. Counterfeits result in immediate permanent suspension.</li>
              <li>Honor all valid warranty claims and authorized returns within 7 calendar days.</li>
              <li>Accurately fulfill customer orders with reliable dispatch.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#2A2320] mb-3 flex items-center gap-2">
              <span className="text-[#B5532E]">3.</span> Delivery Commitments
            </h2>
            <p>
              We promise that <strong>same-day delivery is possible for orders placed within Kaduna</strong>. For orders destined outside Kaduna, we provide dependable courier dispatch nationwide.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#2A2320] mb-3 flex items-center gap-2">
              <span className="text-[#B5532E]">4.</span> Prohibited Items & Activities
            </h2>
            <p>
              Users and merchants shall not list or attempt to purchase stolen electronics, unlicensed software, narcotics, restricted chemicals, or counterfeit currency. Any suspicious activity is promptly escalated to law enforcement.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#2A2320] mb-3 flex items-center gap-2">
              <span className="text-[#B5532E]">5.</span> Governing Law & Jurisdiction
            </h2>
            <p>
              These Terms are governed by and construed under the laws of the Federal Republic of Nigeria.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
