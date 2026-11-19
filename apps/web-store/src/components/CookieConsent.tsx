'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('manga_cookie_consent');
      if (!consent) {
        // Small delay so page renders smoothly first
        const timer = setTimeout(() => setIsVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore if localStorage unavailable
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem('manga_cookie_consent', 'accepted');
    } catch {}
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    try {
      localStorage.setItem('manga_cookie_consent', 'essential');
    } catch {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie Preferences"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
    >
      <div className="bg-[#2A2320] text-[#F6EDE0] p-5 sm:p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#B5532E]/30 text-[#D9A441] flex items-center justify-center flex-shrink-0 text-base">
            <i className="fas fa-cookie-bite"></i>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm text-white mb-1">
              Cookie &amp; Privacy Preferences
            </h4>
            <p className="text-xs text-[#E7D5BC]/80 leading-relaxed mb-4">
              We use essential cookies to maintain your shopping cart, ensure CSRF security, and process verified orders. Read our{' '}
              <Link href="/cookie-policy" className="text-[#D9A441] underline hover:text-white">
                Cookie Policy
              </Link>{' '}
              and{' '}
              <Link href="/privacy-policy" className="text-[#D9A441] underline hover:text-white">
                Privacy Policy
              </Link>{' '}
              to learn more.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleEssentialOnly}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#E7D5BC] text-xs font-semibold border border-white/10 transition cursor-pointer"
              >
                Essential Only
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-4 py-2 rounded-xl bg-[#B5532E] hover:bg-[#8F3B1F] text-white text-xs font-bold transition shadow-md border-0 cursor-pointer flex items-center gap-1.5"
              >
                <span>Accept All</span>
                <i className="fas fa-check text-[10px]"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
