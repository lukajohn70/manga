'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('manga_cookie_consent');
      if (!consent) {
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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-label="Cookie Preferences"
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.96 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50"
        >
          <div className="apple-glass-dark text-white p-5 sm:p-6 rounded-2xl shadow-2xl border border-white/10">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 text-[#D9A441] flex items-center justify-center flex-shrink-0 text-base border border-white/10">
                <i className="fas fa-cookie-bite"></i>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-white mb-1 tracking-tight">
                  Cookie &amp; Privacy Preferences
                </h4>
                <p className="text-xs text-white/70 leading-relaxed mb-4">
                  We use essential cookies to maintain your bag, verify CSRF security, and process secure orders. Read our{' '}
                  <Link href="/cookie-policy" className="text-[#D9A441] underline hover:text-white transition-colors">
                    Cookie Policy
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy-policy" className="text-[#D9A441] underline hover:text-white transition-colors">
                    Privacy Policy
                  </Link>.
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    type="button"
                    onClick={handleEssentialOnly}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 text-xs font-semibold border border-white/10 transition-colors cursor-pointer apple-pressable"
                  >
                    Essential Only
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    type="button"
                    onClick={handleAcceptAll}
                    className="px-4 py-2 rounded-xl bg-[#B5532E] hover:bg-[#8F3B1F] text-white text-xs font-bold transition-colors shadow-xs border-0 cursor-pointer flex items-center gap-1.5 apple-pressable"
                  >
                    <span>Accept All</span>
                    <i className="fas fa-check text-[10px]"></i>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
