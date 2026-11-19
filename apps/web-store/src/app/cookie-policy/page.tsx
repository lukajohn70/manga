'use client';

import * as React from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col font-sans text-[#2A2320]">
      <Header />

      <main className="flex-1 container mx-auto px-4 lg:px-8 py-8 sm:py-12 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#8C8279] mb-6">
          <Link href="/" className="hover:text-[#B5532E] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#2A2320] font-semibold">Cookie Policy</span>
        </nav>

        {/* Header Banner */}
        <div className="bg-white rounded-2xl border border-[#E7D5BC] p-6 sm:p-10 mb-8 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF7ED] border border-[#F3E2CB] text-[#B5532E] text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-[#B5532E]" />
            Transparency & Consent Governance
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-display text-[#2A2320] tracking-tight mb-3">
            MANGA MARKETSQUARE Cookie Policy
          </h1>
          <p className="text-sm text-[#8C8279]">
            Last updated: November 19, 2026 • Effective Date: January 1, 2026
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-2xl border border-[#E7D5BC] p-6 sm:p-10 space-y-8 text-sm sm:text-base leading-relaxed text-[#4A3E39] shadow-xs">
          
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#2A2320] mb-3 flex items-center gap-2">
              <span className="text-[#B5532E]">1.</span> What Are Cookies?
            </h2>
            <p>
              Cookies are compact text files placed on your device (computer, tablet, or mobile phone) when you browse <strong>MANGA MARKETSQUARE</strong>. Cookies allow our platform to recognize your device, preserve your shopping cart state, maintain secure authentication sessions, and offer you a seamless, personalized marketplace experience.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#2A2320] mb-3 flex items-center gap-2">
              <span className="text-[#B5532E]">2.</span> Categories of Cookies We Use
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#FAF6F0] border border-[#E7D5BC]">
                <h3 className="font-bold text-sm text-[#2A2320] mb-1 flex items-center gap-2">
                  <i className="fas fa-shield-halved text-[#4F6B3A]"></i>
                  <span>Strictly Necessary / Essential Cookies</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#6B5E57] leading-relaxed">
                  These cookies are vital for the core operation of Manga. They allow you to log in securely, navigate between pages without losing items in your shopping cart, and protect against Cross-Site Request Forgery (CSRF). Because they are essential to service delivery, they cannot be disabled.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF6F0] border border-[#E7D5BC]">
                <h3 className="font-bold text-sm text-[#2A2320] mb-1 flex items-center gap-2">
                  <i className="fas fa-sliders text-[#B5532E]"></i>
                  <span>Functional & Preference Cookies</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#6B5E57] leading-relaxed">
                  Functional cookies remember your display choices, regional delivery settings (such as Kaduna Express fulfillment), currency displays, and saved wishlist collections across browsing sessions.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF6F0] border border-[#E7D5BC]">
                <h3 className="font-bold text-sm text-[#2A2320] mb-1 flex items-center gap-2">
                  <i className="fas fa-chart-line text-[#D9A441]"></i>
                  <span>Performance & Analytics Cookies</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#6B5E57] leading-relaxed">
                  These aggregated, anonymized cookies help us understand how shoppers interact with our catalog, identify broken links, measure page load speeds, and optimize user experience across both desktop and mobile devices.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#2A2320] mb-3 flex items-center gap-2">
              <span className="text-[#B5532E]">3.</span> Third-Party Service Providers & Payment Gateways
            </h2>
            <p>
              When you complete a purchase, our PCI-DSS Level 1 certified payment partners (such as Paystack and direct bank transfer gateways) may set secure, encrypted cookies to verify 3D-Secure card authentication, detect fraudulent attempts, and finalize financial settlement. Manga does not store your card details on local servers.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#2A2320] mb-3 flex items-center gap-2">
              <span className="text-[#B5532E]">4.</span> How You Can Manage or Withdraw Consent
            </h2>
            <p>
              You maintain complete autonomy over cookie preferences:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong>On-Site Cookie Banner:</strong> Use our Cookie Consent banner upon your first visit to select &quot;Accept All&quot; or choose &quot;Essential Only&quot;.
              </li>
              <li>
                <strong>Browser Settings:</strong> Most modern browsers (Chrome, Safari, Firefox, Edge) allow you to refuse or delete cookies via your browser&apos;s Privacy or Security settings. Note that disabling essential cookies may prevent you from logging in or placing orders.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-[#2A2320] mb-3 flex items-center gap-2">
              <span className="text-[#B5532E]">5.</span> Contact the Privacy Desk
            </h2>
            <p>
              If you have inquiries regarding our cookie governance or data privacy practices, please contact our Data Protection Officer:
            </p>
            <div className="mt-3 bg-[#FAF6F0] p-4 rounded-xl border border-[#E7D5BC] text-xs sm:text-sm">
              <p className="font-bold text-[#2A2320]">MANGA MARKETSQUARE Privacy & Compliance Office</p>
              <p className="mt-1 text-[#B5532E] font-semibold">
                Email: <a href="mailto:privacy@manga.ng" className="hover:underline">privacy@manga.ng</a> • <a href="mailto:support@marketsquare.ng" className="hover:underline">support@marketsquare.ng</a>
              </p>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
