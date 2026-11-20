'use client';

import * as React from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-sans text-[#1D1917]">
      <Header />

      <main className="flex-1 container mx-auto px-4 lg:px-8 py-8 sm:py-12 max-w-4xl">
        <nav className="flex items-center gap-2 text-xs text-[#78716C] mb-6">
          <Link href="/" className="hover:text-[#1D1917] transition-colors">Home</Link>
          <span className="text-[#C5BDB5]">/</span>
          <span className="text-[#1D1917] font-semibold">Return & Refund Policy</span>
        </nav>

        <div className="bg-white rounded-3xl border border-[#EAE3D9] p-6 sm:p-10 mb-8 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#EAE3D9] text-[#B5532E] text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B5532E]" />
            7-Day Hassle-Free Returns
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold apple-heading text-[#1D1917] tracking-tight mb-3">
            MANGA MARKETSQUARE Return Policy
          </h1>
          <p className="text-sm text-[#78716C]">
            Transparent returns backed by 100% verified seller guarantees
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[#EAE3D9] p-6 sm:p-10 space-y-8 text-sm sm:text-base leading-relaxed text-[#1D1917]/85 shadow-xs">
          
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#1D1917] mb-3 flex items-center gap-2">
              <span className="text-[#B5532E]">1.</span> 7-Day Return Guarantee
            </h2>
            <p>
              We want you to be 100% satisfied with your purchases. Any item purchased on MANGA MARKETSQUARE from verified merchants may be returned within <strong>7 calendar days</strong> from the delivery date, provided it is unused and in its original retail packaging.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#1D1917] mb-3 flex items-center gap-2">
              <span className="text-[#B5532E]">2.</span> Eligible Return Reasons
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Item delivered is defective, malfunctioning, or damaged in transit.</li>
              <li>Item received differs from product specifications.</li>
              <li>Wrong item, size, color, or missing components delivered.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#1D1917] mb-3 flex items-center gap-2">
              <span className="text-[#B5532E]">3.</span> Return Process & Pickup
            </h2>
            <p>
              Initiating a return is simple: go to your <strong>Account &rarr; Orders</strong>, select the order, and tap &quot;Request Return / Help&quot;. For orders within Kaduna, our local courier fleet can arrange doorstep pickup.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
