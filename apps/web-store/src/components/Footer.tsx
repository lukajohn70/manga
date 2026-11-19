'use client';

import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
    <footer className="bg-[#2A2320] text-[#F6EDE0] py-14 border-t border-[#F6EDE0]/10">
        <div className="container mx-auto px-4 lg:px-8">
          
          {/* 1. Value Proposition Strip (Manga Palette) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 sm:p-7 rounded-2xl bg-white/5 border border-white/10 mb-12 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#B5532E]/25 text-[#D9A441] flex items-center justify-center flex-shrink-0 text-lg">
                <i className="fas fa-shield-halved"></i>
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-white">Verified Marketplace Sellers</h4>
                <p className="text-[11px] sm:text-xs text-[#E7D5BC]/80 mt-0.5">
                  All merchants undergo strict identity and document verification before listing.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#4F6B3A]/30 text-[#4F6B3A] flex items-center justify-center flex-shrink-0 text-lg">
                <i className="fas fa-truck-fast"></i>
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-white">Same-Day Delivery in Kaduna</h4>
                <p className="text-[11px] sm:text-xs text-[#E7D5BC]/80 mt-0.5">
                  Same-day delivery is possible for orders within Kaduna, with reliable delivery nationwide.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#B5532E]/25 text-[#B5532E] flex items-center justify-center flex-shrink-0 text-lg">
                <i className="fas fa-rotate-left"></i>
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-white">Buyer Protection Guarantee</h4>
                <p className="text-[11px] sm:text-xs text-[#E7D5BC]/80 mt-0.5">
                  Secure payments and hassle-free returns on eligible verified orders.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Newsletter Subscription Bar */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#B5532E]/30 via-white/5 to-[#D9A441]/20 border border-white/10 mb-12 flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D9A441] block mb-1">
                <i className="fas fa-gift mr-1"></i> Exclusive Shopping Privileges
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-display text-white">Subscribe to MARKETSQUARE Flash Drops</h3>
              <p className="text-[#E7D5BC] text-xs sm:text-sm mt-1">
                Receive early VIP access to flash sales, exclusive discount vouchers, and new tech launches.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row w-full lg:w-auto max-w-md gap-2">
              <input
                type="email"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B5532E]"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-[#B5532E] hover:bg-[#8F3B1F] text-white font-bold text-xs sm:text-sm rounded-xl transition-transform hover:scale-105 shadow-lg whitespace-nowrap border-0 cursor-pointer"
              >
                {subscribed ? '✓ Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>

          {/* 3. Four Major Marketplace Information Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12 text-xs sm:text-sm">
            
            {/* Brand Info */}
            <div className="col-span-2">
              <Link href="/">
                <img src="/images/logo-white.svg" alt="MANGA MARKETSQUARE" className="h-8 sm:h-9 w-auto mb-4 block" />
              </Link>
              <p className="text-[#E7D5BC]/80 text-xs sm:text-sm leading-relaxed mb-4 max-w-sm">
                MANGA MARKETSQUARE is a premier modern commerce platform engineered to deliver authentic consumer electronics, computing gear, fashion, home appliances, and production-ready digital software to discerning consumers worldwide.
              </p>
              <div className="flex items-center gap-3 text-xs text-[#E7D5BC]">
                <a href="tel:0700928672" className="hover:text-[#D9A441] transition-colors">
                  <i className="fas fa-phone mr-1.5 text-[#D9A441]"></i>0700-928-672
                </a>
                <span>•</span>
                <a href="mailto:support@marketsquare.ng" className="hover:text-[#D9A441] transition-colors">
                  <i className="fas fa-envelope mr-1.5 text-[#B5532E]"></i>support@marketsquare.ng
                </a>
              </div>
            </div>

            {/* Buying on Manga */}
            <div>
              <h4 className="font-bold text-white mb-4 text-xs tracking-wider uppercase text-[#E7D5BC]">Customer Care</h4>
              <ul className="space-y-2.5 text-[#E7D5BC]/70 text-xs list-none p-0 m-0">
                <li>
                  <Link href="/track-order" className="hover:text-white transition-colors">
                    Track Your Order
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="hover:text-white transition-colors">
                    Shop All Departments
                  </Link>
                </li>
                <li>
                  <Link href="/official-stores" className="hover:text-white transition-colors">
                    Official Brand Stores
                  </Link>
                </li>
                <li>
                  <Link href="/flash-sales" className="hover:text-white transition-colors">
                    Flash Sales & Deals
                  </Link>
                </li>
                <li>
                  <Link href="/wishlist" className="hover:text-white transition-colors">
                    Saved Wishlist Items
                  </Link>
                </li>
              </ul>
            </div>

            {/* Selling on Manga */}
            <div>
              <h4 className="font-bold text-white mb-4 text-xs tracking-wider uppercase text-[#E7D5BC]">Seller Hub</h4>
              <ul className="space-y-2.5 text-[#E7D5BC]/70 text-xs list-none p-0 m-0">
                <li>
                  <Link href="/sell" className="hover:text-[#D9A441] transition-colors font-semibold text-[#D9A441]">
                    Become a Verified Seller
                  </Link>
                </li>
                <li>
                  <Link href="/sell#register" className="hover:text-white transition-colors text-[#E7D5BC]/70">
                    Seller Partner Registration
                  </Link>
                </li>
                <li>
                  <Link href="/sell#benefits" className="hover:text-white transition-colors text-[#E7D5BC]/70">
                    Merchant Benefits & Escrow
                  </Link>
                </li>
                <li>
                  <Link href="/sell#faq" className="hover:text-white transition-colors text-[#E7D5BC]/70">
                    Merchant Quality Standards & FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Popular Departments */}
            <div>
              <h4 className="font-bold text-white mb-4 text-xs tracking-wider uppercase text-[#E7D5BC]">Top Categories</h4>
              <ul className="space-y-2.5 text-[#E7D5BC]/70 text-xs list-none p-0 m-0">
                <li>
                  <Link href="/shop?category=computing" className="hover:text-white transition-colors">
                    Phones & Computing
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=electronics" className="hover:text-white transition-colors">
                    Electronics & Audio
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=fashion" className="hover:text-white transition-colors">
                    Fashion & Streetwear
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=home" className="hover:text-white transition-colors">
                    Home Appliances
                  </Link>
                </li>
                <li>
                  <Link href="/shop?type=digital" className="hover:text-white transition-colors">
                    Digital UI Kits & Code
                  </Link>
                </li>
              </ul>
            </div>

          </div>

          {/* 4. Payment Methods & Compliance Footer Strip */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#E7D5BC]/70 text-center md:text-left">
            <div>
              <div>&copy; {new Date().getFullYear()} MANGA MARKETSQUARE. All rights reserved. Same-Day Delivery in Kaduna.</div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-[11px] text-[#E7D5BC]/60 mt-1.5">
                <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <span>•</span>
                <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
                <span>•</span>
                <Link href="/escrow-agreement" className="hover:text-white transition-colors">Buyer Protection Policy</Link>
                <span>•</span>
                <Link href="/return-policy" className="hover:text-white transition-colors">7-Day Return Policy</Link>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 text-xs">
              <span className="text-[#E7D5BC]/70 mr-1">Secured Payments:</span>
              <span className="px-2.5 py-1 bg-white/10 rounded font-semibold text-white">Paystack</span>
              <span className="px-2.5 py-1 bg-white/10 rounded font-semibold text-white">Mastercard</span>
              <span className="px-2.5 py-1 bg-white/10 rounded font-semibold text-white">Visa</span>
              <span className="px-2.5 py-1 bg-white/10 rounded font-semibold text-white">Verve</span>
              <span className="px-2.5 py-1 bg-white/10 rounded font-semibold text-white">Bank Transfer</span>
            </div>
          </div>

        </div>
      </footer>
  );
};
