'use client';

import * as React from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col font-sans text-[#2A2320]">
      <Header />

      <main className="flex-1 container mx-auto px-4 lg:px-8 py-8 sm:py-12 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#8C8279] mb-6">
          <Link href="/" className="hover:text-[#B5532E] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#2A2320] font-semibold">Privacy Policy</span>
        </nav>

        {/* Header Banner */}
        <div className="bg-white rounded-2xl border border-[#E7D5BC] p-6 sm:p-10 mb-8 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF7ED] border border-[#F3E2CB] text-[#B5532E] text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-[#B5532E]" />
            NDPR & GDPR Compliant Data Governance
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-display text-[#2A2320] tracking-tight mb-3">
            MANGA MARKETSQUARE Privacy Policy
          </h1>
          <p className="text-sm text-[#8C8279]">
            Last updated: November 17, 2026 • Effective Date: January 1, 2026
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-2xl border border-[#E7D5BC] p-6 sm:p-10 space-y-8 text-sm sm:text-base leading-relaxed text-[#4A3E39] shadow-xs">
          
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#2A2320] mb-3 flex items-center gap-2">
              <span className="text-[#B5532E]">1.</span> Introduction & Scope
            </h2>
            <p>
              Welcome to <strong>MANGA MARKETSQUARE</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to safeguarding your personal data and respecting your privacy rights under the Nigeria Data Protection Act (NDPA), the Nigeria Data Protection Regulation (NDPR), and applicable global data protection frameworks.
            </p>
            <p className="mt-3">
              This Privacy Policy explains how we collect, process, store, and protect your information when you access our multi-category storefront, native mobile application, merchant hub, and payment checkout systems.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#2A2320] mb-3 flex items-center gap-2">
              <span className="text-[#B5532E]">2.</span> Data We Collect
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Identity & Profile Data:</strong> Full name, verified email address, phone number, and delivery addresses.</li>
              <li><strong>Transaction Data:</strong> Order reference IDs, purchased SKUs, billing amounts, and delivery instructions. Payment card details are tokenized directly via PCI-DSS Level 1 certified processors (Paystack/Flutterwave) and never stored on our application servers.</li>
              <li><strong>Device & Telemetry Data:</strong> IP address, operating system, browser version, and session interaction metrics.</li>
              <li><strong>Merchant Verification Data (Sellers Only):</strong> Business registration documents, Tax Identification Numbers (TIN), bank account verification, and physical warehouse/store coordinates.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#2A2320] mb-3 flex items-center gap-2">
              <span className="text-[#B5532E]">3.</span> How We Use Your Information
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Processing customer orders, dispatch logistics, and courier fulfillment.</li>
              <li>Enabling same-day delivery for eligible orders within Kaduna.</li>
              <li>Verifying seller identity and preventing fraudulent listings.</li>
              <li>Sending automated SMS/email delivery tracking updates and order receipts.</li>
              <li>Complying with statutory consumer protection obligations under Nigerian law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#2A2320] mb-3 flex items-center gap-2">
              <span className="text-[#B5532E]">4.</span> Data Protection & Disclosure
            </h2>
            <p>
              We only share delivery-relevant information (recipient name, address, and contact number) with assigned courier drivers. We never sell your personal data to third-party advertisers.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#2A2320] mb-3 flex items-center gap-2">
              <span className="text-[#B5532E]">5.</span> Your Rights & Access
            </h2>
            <p>
              Under NDPA, you have the right to request a copy of your personal data, request correction of inaccurate records, opt out of marketing communications, or request complete account closure and data deletion via your <strong>Account &rarr; Close Account</strong> setting or by contacting our Data Protection Officer at <a href="mailto:privacy@manga.ng" className="text-[#B5532E] font-bold hover:underline">privacy@manga.ng</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#2A2320] mb-3 flex items-center gap-2">
              <span className="text-[#B5532E]">6.</span> Contact
            </h2>
            <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#E7D5BC] text-xs sm:text-sm">
              <p className="font-bold text-[#2A2320]">MANGA MARKETSQUARE Legal & Compliance Desk</p>
              <p className="mt-1 text-[#B5532E] font-semibold">Email: legal@manga.ng • support@manga.ng</p>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
