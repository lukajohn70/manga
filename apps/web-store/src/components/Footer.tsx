'use client';

import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useStore } from '../context/StoreContext';

export interface FooterProps {
  onOpenCart?: () => void;
  onOpenWishlist?: () => void;
  onOpenTrackOrder?: () => void;
  onSelectCategory?: (cat: string) => void;
  cartCount?: number;
  wishlistCount?: number;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenCart,
  onOpenWishlist,
  onOpenTrackOrder,
  onSelectCategory,
  cartCount,
  wishlistCount,
}) => {
  const router = useRouter();
  let storeContext: any = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    storeContext = useStore();
  } catch {
    // Graceful fallback
  }

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmail('');
    }
  };

  const handleCartClick = () => {
    if (onOpenCart) onOpenCart();
    else router.push('/cart');
  };

  const handleWishlistClick = () => {
    if (onOpenWishlist) onOpenWishlist();
    else router.push('/wishlist');
  };

  const handleTrackClick = () => {
    if (onOpenTrackOrder) onOpenTrackOrder();
    else router.push('/track-order');
  };

  return (
    <footer className="bg-[#161311] text-white/90 py-16 border-t border-white/10">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* 1. Value Proposition Strip: Apple Translucent Dark Materials */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 p-6 sm:p-8 rounded-3xl bg-white/[0.04] border border-white/[0.08] mb-14 text-center sm:text-left backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/[0.08] text-[#E7D5BC] flex items-center justify-center flex-shrink-0 text-base border border-white/10">
              <i className="fas fa-shield-halved text-[#D9A441]" />
            </div>
            <div>
              <h4 className="font-semibold text-xs sm:text-sm text-white tracking-tight">Verified Marketplace Sellers</h4>
              <p className="text-[11px] sm:text-xs text-white/60 mt-1 leading-relaxed">
                All merchants undergo strict identity, tax, and document verification before listing.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/[0.08] text-[#E7D5BC] flex items-center justify-center flex-shrink-0 text-base border border-white/10">
              <i className="fas fa-truck-fast text-[#4F6B3A]" />
            </div>
            <div>
              <h4 className="font-semibold text-xs sm:text-sm text-white tracking-tight">Express Regional Delivery</h4>
              <p className="text-[11px] sm:text-xs text-white/60 mt-1 leading-relaxed">
                Same-day metro delivery in Kaduna, with direct insured courier transit nationwide.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/[0.08] text-[#E7D5BC] flex items-center justify-center flex-shrink-0 text-base border border-white/10">
              <i className="fas fa-rotate-left text-[#B5532E]" />
            </div>
            <div>
              <h4 className="font-semibold text-xs sm:text-sm text-white tracking-tight">Buyer Protection Guarantee</h4>
              <p className="text-[11px] sm:text-xs text-white/60 mt-1 leading-relaxed">
                Secure escrow payment release and hassle-free returns on eligible verified orders.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Newsletter Subscription: Clean Apple Translucent Glass Card */}
        <div className="p-6 sm:p-8 rounded-3xl apple-glass-dark mb-14 flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#E7D5BC] block mb-1">
              Direct Product Releases
            </span>
            <h3 className="apple-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
              Subscribe to Limited Drops
            </h3>
            <p className="apple-subhead text-white/70 text-xs sm:text-sm mt-1 font-normal">
              Receive early access to verified brand allocations and special hardware launches.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row w-full lg:w-auto max-w-md gap-2.5">
            <input
              type="email"
              placeholder="Enter your email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-white/[0.08] border border-white/15 rounded-xl text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#B5532E]/50 focus:border-transparent transition-all"
            />
            <motion.button
              type="submit"
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.25 }}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#B5532E] hover:bg-[#A04523] text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-xs whitespace-nowrap border-0 cursor-pointer apple-pressable"
            >
              {subscribed ? '✓ Subscribed' : 'Subscribe'}
            </motion.button>
          </form>
        </div>

        {/* 3. Marketplace Directory Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-14 text-xs sm:text-sm">
          
          {/* Brand Info */}
          <div className="col-span-2">
            <Link href="/" className="inline-block mb-4 apple-pressable">
              <img src="/images/logo-white.svg" alt="MANGA MARKETSQUARE" className="h-7 sm:h-8 w-auto block" />
            </Link>
            <p className="text-white/65 text-xs leading-relaxed mb-4 max-w-sm font-normal">
              MANGA MARKETSQUARE connects verified Nigerian manufacturers, official brand distributors, and creative developers directly with customers under transparent escrow protection.
            </p>
            <div className="flex items-center gap-3 text-xs text-white/60">
              <a href="tel:0700928672" className="hover:text-white transition-colors">
                <i className="fas fa-phone mr-1.5 text-[#D9A441]" />0700-928-672
              </a>
              <span>•</span>
              <a href="mailto:support@marketsquare.ng" className="hover:text-white transition-colors">
                <i className="fas fa-envelope mr-1.5 text-[#B5532E]" />support@marketsquare.ng
              </a>
            </div>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs tracking-wider uppercase">Customer Care</h4>
            <ul className="space-y-2 text-white/60 text-xs list-none p-0 m-0">
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors no-underline">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-colors no-underline">
                  Shop All Departments
                </Link>
              </li>
              <li>
                <Link href="/official-stores" className="hover:text-white transition-colors no-underline">
                  Official Brand Stores
                </Link>
              </li>
              <li>
                <Link href="/flash-sales" className="hover:text-white transition-colors no-underline">
                  Flash Sales & Deals
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-white transition-colors no-underline">
                  Saved Wishlist Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Seller Hub */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs tracking-wider uppercase">Seller Hub</h4>
            <ul className="space-y-2 text-white/60 text-xs list-none p-0 m-0">
              <li>
                <Link href="/sell" className="hover:text-[#D9A441] transition-colors font-medium text-[#E7D5BC] no-underline">
                  Become a Verified Seller
                </Link>
              </li>
              <li>
                <Link href="/sell#register" className="hover:text-white transition-colors no-underline">
                  Merchant Registration
                </Link>
              </li>
              <li>
                <Link href="/sell#benefits" className="hover:text-white transition-colors no-underline">
                  Escrow Guarantee
                </Link>
              </li>
              <li>
                <Link href="/sell#faq" className="hover:text-white transition-colors no-underline">
                  Quality Standards FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Departments */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs tracking-wider uppercase">Top Departments</h4>
            <ul className="space-y-2 text-white/60 text-xs list-none p-0 m-0">
              <li>
                <Link href="/shop?category=computing" className="hover:text-white transition-colors no-underline">
                  Phones & Computing
                </Link>
              </li>
              <li>
                <Link href="/shop?category=electronics" className="hover:text-white transition-colors no-underline">
                  Electronics & Audio
                </Link>
              </li>
              <li>
                <Link href="/shop?category=fashion" className="hover:text-white transition-colors no-underline">
                  Fashion & Streetwear
                </Link>
              </li>
              <li>
                <Link href="/shop?category=home" className="hover:text-white transition-colors no-underline">
                  Home & Living
                </Link>
              </li>
              <li>
                <Link href="/shop?type=digital" className="hover:text-white transition-colors no-underline">
                  Digital Licenses & Code
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* 4. Payment Methods & Legal Compliance Strip */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50 text-center md:text-left">
          <div>
            <div>&copy; {new Date().getFullYear()} MANGA MARKETSQUARE. All rights reserved. Same-Day Delivery in Kaduna.</div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-[11px] text-white/45 mt-1.5">
              <Link href="/privacy-policy" className="hover:text-white transition-colors no-underline">Privacy Policy</Link>
              <span>•</span>
              <Link href="/terms-of-service" className="hover:text-white transition-colors no-underline">Terms of Service</Link>
              <span>•</span>
              <Link href="/cookie-policy" className="hover:text-white transition-colors no-underline">Cookie Policy</Link>
              <span>•</span>
              <Link href="/escrow-agreement" className="hover:text-white transition-colors no-underline">Buyer Protection Policy</Link>
              <span>•</span>
              <Link href="/return-policy" className="hover:text-white transition-colors no-underline">7-Day Return Policy</Link>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-1.5 text-xs">
            <span className="text-white/40 mr-1">Secured by:</span>
            <span className="px-2 py-0.5 bg-white/[0.06] rounded text-[11px] font-medium text-white/80">Paystack</span>
            <span className="px-2 py-0.5 bg-white/[0.06] rounded text-[11px] font-medium text-white/80">Mastercard</span>
            <span className="px-2 py-0.5 bg-white/[0.06] rounded text-[11px] font-medium text-white/80">Visa</span>
            <span className="px-2 py-0.5 bg-white/[0.06] rounded text-[11px] font-medium text-white/80">Verve</span>
            <span className="px-2 py-0.5 bg-white/[0.06] rounded text-[11px] font-medium text-white/80">Direct Transfer</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
