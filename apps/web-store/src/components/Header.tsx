'use client';

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';

export interface HeaderProps {
  cartCount?: number;
  wishlistCount?: number;
  onOpenCart?: () => void;
  onOpenWishlist?: () => void;
  onOpenTrackOrder?: () => void;
  onSelectCategory?: (cat: string) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  currency?: 'NGN' | 'USD';
  onToggleCurrency?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenTrackOrder,
  onSelectCategory,
  searchQuery = '',
  onSearchChange,
  currency,
  onToggleCurrency,
}) => {
  const router = useRouter();
  let storeContext: any = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    storeContext = useStore();
  } catch {
    // Graceful fallback if outside StoreProvider
  }

  const activeCartCount = cartCount !== undefined ? cartCount : (storeContext?.cartCount ?? 0);
  const activeWishlistCount = wishlistCount !== undefined ? wishlistCount : (storeContext?.wishlistCount ?? 0);
  const activeCurrency = currency || storeContext?.currency || 'NGN';
  const handleToggleCurrency = onToggleCurrency || storeContext?.toggleCurrency || (() => {});

  const [internalQuery, setInternalQuery] = useState(searchQuery);
  const [showDepartmentMenu, setShowDepartmentMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [isAccountPinned, setIsAccountPinned] = useState(false);
  const [isDeptPinned, setIsDeptPinned] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const accountMenuRef = useRef<HTMLDivElement>(null);
  const accountTimerRef = useRef<NodeJS.Timeout | null>(null);

  const deptMenuRef = useRef<HTMLDivElement>(null);
  const deptTimerRef = useRef<NodeJS.Timeout | null>(null);

  const openAccountMenu = () => {
    if (accountTimerRef.current) {
      clearTimeout(accountTimerRef.current);
      accountTimerRef.current = null;
    }
    setShowAccountMenu(true);
  };

  const closeAccountMenuWithDelay = () => {
    if (isAccountPinned) return;
    if (accountTimerRef.current) {
      clearTimeout(accountTimerRef.current);
    }
    accountTimerRef.current = setTimeout(() => {
      setShowAccountMenu(false);
      setIsAccountPinned(false);
    }, 400);
  };

  const toggleAccountMenu = () => {
    if (accountTimerRef.current) {
      clearTimeout(accountTimerRef.current);
      accountTimerRef.current = null;
    }
    if (showAccountMenu) {
      setShowAccountMenu(false);
      setIsAccountPinned(false);
    } else {
      setShowAccountMenu(true);
      setIsAccountPinned(true);
    }
  };

  const openDeptMenu = () => {
    if (deptTimerRef.current) {
      clearTimeout(deptTimerRef.current);
      deptTimerRef.current = null;
    }
    setShowDepartmentMenu(true);
  };

  const closeDeptMenuWithDelay = () => {
    if (isDeptPinned) return;
    if (deptTimerRef.current) {
      clearTimeout(deptTimerRef.current);
    }
    deptTimerRef.current = setTimeout(() => {
      setShowDepartmentMenu(false);
      setIsDeptPinned(false);
    }, 400);
  };

  const toggleDeptMenu = () => {
    if (deptTimerRef.current) {
      clearTimeout(deptTimerRef.current);
      deptTimerRef.current = null;
    }
    if (showDepartmentMenu) {
      setShowDepartmentMenu(false);
      setIsDeptPinned(false);
    } else {
      setShowDepartmentMenu(true);
      setIsDeptPinned(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setShowAccountMenu(false);
        setIsAccountPinned(false);
      }
      if (deptMenuRef.current && !deptMenuRef.current.contains(e.target as Node)) {
        setShowDepartmentMenu(false);
        setIsDeptPinned(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowAccountMenu(false);
        setIsAccountPinned(false);
        setShowDepartmentMenu(false);
        setIsDeptPinned(false);
        setShowSearchSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      if (accountTimerRef.current) clearTimeout(accountTimerRef.current);
      if (deptTimerRef.current) clearTimeout(deptTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  const queryValue = searchQuery !== undefined && searchQuery !== '' ? searchQuery : internalQuery;

  const suggestions = [
    'Smartphones & Accessories',
    'Laptops & Computing',
    'Audio & Headphones',
    'Home & Kitchen Appliances',
    'Fashion & Apparel',
    'Software & Digital Assets',
  ].filter((s) => s.toLowerCase().includes(queryValue.toLowerCase()));

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSearchSuggestions(false);
    if (queryValue.trim()) {
      router.push(`/shop?q=${encodeURIComponent(queryValue.trim())}`);
    } else {
      router.push('/shop');
    }
  };

  const handleCategoryNav = (cat: string) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    } else {
      router.push(cat === 'all' ? '/shop' : `/shop?category=${cat}`);
    }
  };

  const handleCartClick = () => {
    if (onOpenCart) onOpenCart();
    else router.push('/cart');
  };

  const handleWishlistClick = () => {
    if (!storeContext?.user) {
      router.push('/account/login?redirect=/wishlist');
      return;
    }
    if (onOpenWishlist) onOpenWishlist();
    else router.push('/wishlist');
  };

  const handleTrackClick = () => {
    if (onOpenTrackOrder) onOpenTrackOrder();
    else router.push('/track-order');
  };

  return (
    <>
      {/* 1. Top Utility & Trust Bar (Manga Iron #2A2320 + Ochre #D9A441) */}
      <div className="bg-[#2A2320] text-[#F6EDE0] text-xs py-1.5 px-3 sm:px-6 border-b border-[#F6EDE0]/10">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-1.5">
          <div className="flex items-center gap-2 sm:gap-4 text-center sm:text-left">
            <Link
              href="/official-stores"
              className="inline-flex items-center gap-1.5 font-bold text-[#D9A441] hover:underline"
            >
              <i className="fas fa-shield-halved text-xs"></i> MARKETSQUARE Mall
            </Link>
            <span className="hidden md:inline text-gray-500">|</span>
            <span className="hidden md:inline text-[#E7D5BC]">
              <i className="fas fa-truck-fast text-[#4F6B3A] mr-1"></i> Same-Day Delivery in Kaduna • 100% Verified Sellers
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-1 text-[#E7D5BC] text-[11px] sm:text-xs">
            <button
              type="button"
              onClick={handleTrackClick}
              className="hover:text-[#D9A441] transition-colors inline-flex items-center gap-1 bg-transparent border-0 text-[#E7D5BC] cursor-pointer"
            >
              <i className="fas fa-location-crosshairs text-[10px]"></i>
              <span>Track Order</span>
            </button>
            <span className="text-white/20">|</span>
            <a href="tel:0700928672" className="hover:text-[#D9A441] transition-colors inline-flex items-center gap-1 text-[#E7D5BC]">
              <i className="fas fa-headset text-[10px]"></i>
              <span>Help Center</span>
            </a>
            <span className="text-white/20">|</span>
            <Link
              href="/sell"
              className="text-[#D9A441] hover:underline transition-colors inline-flex items-center gap-1 font-bold"
            >
              <i className="fas fa-shop text-[11px]"></i>
              <span>Sell on MANGA</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main High-Conversion Navigation Bar (Apple Translucent Floating Chrome) */}
      <header
        className={`sticky top-0 z-50 apple-glass-nav transition-[box-shadow,border-color,background-color] duration-200 ease-out ${
          isScrolled
            ? 'shadow-[0_4px_20px_rgba(0,0,0,0.06)]'
            : 'shadow-[0_1px_3px_rgba(0,0,0,0.02)]'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8 py-3 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Brand Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center hover:opacity-90 transition-opacity apple-pressable">
            <img src="/images/logo.svg" alt="MANGA MARKETSQUARE" className="h-7 sm:h-8 w-auto block" />
          </Link>

          {/* Large Center Search Bar with Instant Suggestions */}
          <div className="hidden md:flex flex-1 max-w-2xl relative">
            <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
              <input
                type="text"
                autoComplete="off"
                placeholder="Search authentic electronics, computing, fashion, living, software..."
                value={queryValue}
                onChange={(e) => {
                  if (onSearchChange) onSearchChange(e.target.value);
                  setInternalQuery(e.target.value);
                  setShowSearchSuggestions(true);
                }}
                onFocus={() => setShowSearchSuggestions(true)}
                className="w-full pl-10 pr-24 py-2 bg-white/70 border border-[#EAE3D9] rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E]/30 focus:border-[#B5532E] transition-[border-color,box-shadow,background-color] duration-150 ease-out text-[#1D1917] placeholder:text-[#78716C]/70"
              />
              <i className="fas fa-search absolute left-3.5 text-[#78716C] text-xs"></i>
              <button
                type="submit"
                className="absolute right-1.5 px-4 py-1.5 bg-[#B5532E] hover:bg-[#A04523] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 border-0 cursor-pointer apple-pressable shadow-xs"
              >
                <span>Search</span>
              </button>
            </form>

            {/* Dynamic Search Autocomplete Suggestions Dropdown */}
            {showSearchSuggestions && suggestions.length > 0 && (
              <div
                className="absolute left-0 right-0 top-full mt-2 apple-glass-card rounded-2xl shadow-xl z-50 overflow-hidden text-xs"
                onMouseLeave={() => setShowSearchSuggestions(false)}
              >
                <div className="p-2.5 bg-black/[0.02] border-b border-[#EAE3D9]/60 text-[10px] uppercase font-semibold text-[#78716C] tracking-wider">
                  Quick Matching Suggestions
                </div>
                {suggestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      if (onSearchChange) onSearchChange(item);
                      setInternalQuery(item);
                      setShowSearchSuggestions(false);
                      router.push(`/shop?q=${encodeURIComponent(item)}`);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-[#FAF7F2] text-[#1D1917] hover:text-[#B5532E] flex items-center justify-between border-0 bg-transparent cursor-pointer transition-colors apple-pressable"
                  >
                    <span className="flex items-center gap-2">
                      <i className="fas fa-arrow-trend-up text-[#78716C] text-[10px]"></i>
                      <span>{item}</span>
                    </span>
                    <span className="text-[10px] text-[#78716C]">Search</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Header Action Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">

            {/* Customer Account Dropdown */}
            <div
              ref={accountMenuRef}
              className="relative"
              onMouseEnter={openAccountMenu}
              onMouseLeave={closeAccountMenuWithDelay}
            >
              <button
                type="button"
                onClick={toggleAccountMenu}
                className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl text-[#1D1917] hover:text-[#B5532E] hover:bg-black/[0.03] transition-colors bg-transparent border-0 cursor-pointer apple-pressable"
                aria-expanded={showAccountMenu}
                aria-haspopup="true"
              >
                {storeContext?.user ? (
                  <span className="w-7 h-7 rounded-full bg-[#4F6B3A]/15 text-[#4F6B3A] flex items-center justify-center font-bold text-xs border border-[#4F6B3A]/30">
                    {storeContext.user.name.charAt(0)}
                  </span>
                ) : (
                  <i className="far fa-user text-base sm:text-lg text-[#1D1917]"></i>
                )}
                <span className="hidden lg:inline text-xs font-semibold leading-tight text-left">
                  {storeContext?.user ? `Hi, ${storeContext.user.name.split(' ')[0]}` : 'Sign In'}
                  <br />
                  <span className="text-[11px] font-normal text-[#78716C]">
                    {storeContext?.user ? 'Buyer Account' : 'Account & Orders'}{' '}
                    <i className="fas fa-chevron-down text-[9px] ml-0.5"></i>
                  </span>
                </span>
              </button>

              {/* Hover Dropdown Menu with zero gap bridge */}
              <AnimatePresence>
                {showAccountMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.95 }}
                    transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                    style={{ transformOrigin: 'top right' }}
                    className="absolute right-0 top-full pt-2 w-64 z-50"
                    onMouseEnter={openAccountMenu}
                    onMouseLeave={closeAccountMenuWithDelay}
                  >
                    {/* Invisible protective bridge preventing cursor dropout during diagonal sweeps */}
                    <div className="absolute -top-3 -left-8 -right-4 h-5 pointer-events-auto bg-transparent" />
                    <div className="relative apple-glass-card border border-[#EAE3D9] rounded-2xl shadow-xl p-2.5 text-xs text-[#1D1917] bg-white">
                      {storeContext?.user ? (
                        <>
                          <div className="p-2.5 bg-[#FAF7F2] rounded-xl border border-[#EAE3D9] mb-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-[#1D1917] text-xs truncate">
                                {storeContext.user.name}
                              </span>
                              <span
                                className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                                  storeContext.user.role === 'ADMIN'
                                    ? 'bg-[#161311] text-[#D9A441] border-[#D9A441]/50'
                                    : storeContext.user.role === 'VENDOR'
                                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                    : 'bg-[#4F6B3A]/15 text-[#4F6B3A] border-[#4F6B3A]/30'
                                }`}
                              >
                                {storeContext.user.role === 'ADMIN'
                                  ? 'Admin'
                                  : storeContext.user.role === 'VENDOR'
                                  ? 'Merchant'
                                  : 'Buyer'}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#78716C] truncate">{storeContext.user.email}</p>
                          </div>

                          {storeContext.user.role === 'ADMIN' && (
                            <button
                              type="button"
                              onClick={() => {
                                setShowAccountMenu(false);
                                router.push('/admin');
                              }}
                              className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#B5532E] hover:bg-[#FAF7F2] font-semibold border-0 bg-transparent cursor-pointer transition-colors apple-pressable"
                            >
                              <i className="fas fa-shield-halved text-[#B5532E]"></i> Operations Console
                            </button>
                          )}

                          {(storeContext.user.role === 'VENDOR' || storeContext.user.role === 'ADMIN') && (
                            <button
                              type="button"
                              onClick={() => {
                                setShowAccountMenu(false);
                                router.push('/sell');
                              }}
                              className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#B5532E] hover:bg-[#FAF7F2] font-semibold border-0 bg-transparent cursor-pointer transition-colors apple-pressable"
                            >
                              <i className="fas fa-store text-[#B5532E]"></i> Merchant Partner Console
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setShowAccountMenu(false);
                              router.push('/account');
                            }}
                            className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#1D1917] hover:bg-[#FAF7F2] hover:text-[#B5532E] font-medium border-0 bg-transparent cursor-pointer transition-colors apple-pressable"
                          >
                            <i className="fas fa-id-card text-[#78716C]"></i> Account Dashboard
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setShowAccountMenu(false);
                              router.push('/account#orders');
                            }}
                            className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-[#1D1917] hover:bg-[#FAF7F2] hover:text-[#B5532E] font-medium border-0 bg-transparent cursor-pointer transition-colors apple-pressable"
                          >
                            <span className="flex items-center gap-2.5">
                              <i className="fas fa-box text-[#78716C]"></i> My Orders
                            </span>
                            {storeContext.orders?.length > 0 && (
                              <span className="text-[10px] bg-[#FAF7F2] border border-[#EAE3D9] px-1.5 py-0.5 rounded font-bold text-[#78716C]">
                                {storeContext.orders.length}
                              </span>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setShowAccountMenu(false);
                              handleWishlistClick();
                            }}
                            className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-[#1D1917] hover:bg-[#FAF7F2] hover:text-[#B5532E] font-medium border-0 bg-transparent cursor-pointer transition-colors apple-pressable"
                          >
                            <span className="flex items-center gap-2.5">
                              <i className="fas fa-heart text-[#78716C]"></i> Saved Wishlist
                            </span>
                            {activeWishlistCount > 0 && (
                              <span className="text-[10px] bg-[#B5532E] text-white px-1.5 py-0.5 rounded-full font-bold">
                                {activeWishlistCount}
                              </span>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setShowAccountMenu(false);
                              handleTrackClick();
                            }}
                            className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#1D1917] hover:bg-[#FAF7F2] hover:text-[#B5532E] font-medium border-0 bg-transparent cursor-pointer transition-colors apple-pressable"
                          >
                            <i className="fas fa-location-crosshairs text-[#78716C]"></i> Track Any Shipment
                          </button>

                          <div className="border-t border-[#EAE3D9] my-1"></div>

                          <button
                            type="button"
                            onClick={() => {
                              setShowAccountMenu(false);
                              storeContext.logoutCustomer();
                            }}
                            className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#B3261E] hover:bg-rose-50 font-bold border-0 bg-transparent cursor-pointer transition-colors apple-pressable"
                          >
                            <i className="fas fa-arrow-right-from-bracket"></i> Sign Out
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="p-2 text-center border-b border-[#EAE3D9] mb-2">
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              type="button"
                              onClick={() => {
                                setShowAccountMenu(false);
                                router.push('/account/login');
                              }}
                              className="block w-full py-2 bg-[#B5532E] text-white font-bold rounded-xl hover:bg-[#8F3B1F] transition-colors mb-2 border-0 cursor-pointer text-xs shadow-xs apple-pressable"
                            >
                              Sign In to Buyer Account
                            </motion.button>
                            <p className="text-[#78716C] text-[11px]">
                              New to Marketsquare?{' '}
                              <button
                                type="button"
                                onClick={() => {
                                  setShowAccountMenu(false);
                                  router.push('/account/login?tab=register');
                                }}
                                className="text-[#B5532E] font-bold cursor-pointer hover:underline border-0 bg-transparent p-0"
                              >
                                Register Free
                              </button>
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setShowAccountMenu(false);
                              handleTrackClick();
                            }}
                            className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#1D1917] hover:bg-[#FAF7F2] hover:text-[#B5532E] font-medium border-0 bg-transparent cursor-pointer transition-colors apple-pressable"
                          >
                            <i className="fas fa-box text-[#78716C]"></i> Track An Order
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setShowAccountMenu(false);
                              handleWishlistClick();
                            }}
                            className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#1D1917] hover:bg-[#FAF7F2] hover:text-[#B5532E] font-medium border-0 bg-transparent cursor-pointer transition-colors apple-pressable"
                          >
                            <i className="fas fa-heart text-[#78716C]"></i> Saved Wishlist ({activeWishlistCount})
                          </button>

                          <div className="border-t border-[#EAE3D9] my-1"></div>

                          <Link
                            href="/account/login?portal=merchant"
                            onClick={() => setShowAccountMenu(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#B5532E] hover:bg-[#FAF7F2] font-semibold transition-colors apple-pressable"
                          >
                            <i className="fas fa-store text-[#B5532E]"></i> Merchant Partner Sign In
                          </Link>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist Icon with Dynamic Counter & Catch Ripple Target */}
            <button
              id="header-wishlist-button"
              type="button"
              onClick={handleWishlistClick}
              title="Saved Wishlist"
              className="relative flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl text-[#2A2320] hover:text-[#B5532E] hover:bg-[#F6EDE0]/50 transition-colors bg-transparent border-0 cursor-pointer"
            >
              <div id="header-wishlist-ripple-container" className="absolute inset-0 pointer-events-none"></div>
              <i className={`${activeWishlistCount > 0 ? 'fas text-[#B5532E]' : 'far text-[#2A2320]'} fa-heart text-base transition-colors`}></i>
              <span className="hidden md:inline text-xs font-bold">Saved</span>
              <AnimatePresence mode="popLayout">
                {activeWishlistCount > 0 && (
                  <motion.span
                    key={activeWishlistCount}
                    id="header-wishlist-badge"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    transition={{ type: 'spring', bounce: 0.35, duration: 0.28 }}
                    className="bg-[#B5532E] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full ml-0.5 leading-none min-w-[1.25rem] text-center inline-block"
                  >
                    {activeWishlistCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Shopping Cart Button (Apple Restrained Style with Ochre Pill & Catch Target) */}
            <button
              id="header-cart-button"
              type="button"
              onClick={handleCartClick}
              className="relative flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-[#B5532E] hover:bg-[#A04523] text-white font-semibold text-xs shadow-xs transition-colors border-0 cursor-pointer apple-pressable"
            >
              <div id="header-cart-ripple-container" className="absolute inset-0 pointer-events-none"></div>
              <i className="fas fa-bag-shopping text-sm text-[#FAF7F2]"></i>
              <span className="hidden sm:inline">Bag</span>
              <AnimatePresence mode="popLayout">
                {activeCartCount > 0 && (
                  <motion.span
                    key={activeCartCount}
                    id="header-cart-badge"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    transition={{ type: 'spring', bounce: 0.35, duration: 0.28 }}
                    className="bg-[#D9A441] text-[#1D1917] text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center inline-block"
                  >
                    {activeCartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (Phone Viewports) */}
        <div className="md:hidden px-4 pb-2.5 pt-0.5">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search genuine brands, electronics, fashion..."
              value={queryValue}
              onChange={(e) => {
                if (onSearchChange) onSearchChange(e.target.value);
                setInternalQuery(e.target.value);
              }}
              className="w-full pl-9 pr-20 py-2 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E] focus:border-transparent transition-[border-color,box-shadow,background-color] duration-150 ease-out shadow-inner text-[#2A2320]"
            />
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8279] text-xs"></i>
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#B5532E] text-white rounded-lg text-[11px] font-bold border-0 cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        {/* 3. Megamenu & Category Departments Ribbon */}
        <div className="bg-white border-t border-[#E7D5BC]/60 overflow-x-auto text-xs font-semibold scrollbar-none w-full">
          <div className="container mx-auto px-4 lg:px-8 flex items-center space-x-4 sm:space-x-6 py-2 sm:py-2.5 whitespace-nowrap min-w-0">
            
            {/* Department Megamenu Trigger */}
            <div
              ref={deptMenuRef}
              className="relative"
              onMouseEnter={openDeptMenu}
              onMouseLeave={closeDeptMenuWithDelay}
            >
              <button
                type="button"
                onClick={toggleDeptMenu}
                className="text-[#1D1917] hover:text-[#B5532E] flex items-center gap-2 font-bold flex-shrink-0 bg-[#FAF7F2] hover:bg-[#EAE3D9]/60 px-3 py-1.5 rounded-xl border border-[#EAE3D9] cursor-pointer text-xs transition-colors apple-pressable"
                aria-expanded={showDepartmentMenu}
                aria-haspopup="true"
              >
                <i className="fas fa-bars-staggered text-xs text-[#B5532E]"></i>
                <span>All Departments</span>
                <i className="fas fa-chevron-down text-[9px] text-[#78716C]"></i>
              </button>

              {/* Rich Flyout Megamenu with zero gap bridge */}
              <AnimatePresence>
                {showDepartmentMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute left-0 top-full pt-2 w-72 z-50"
                    onMouseEnter={openDeptMenu}
                    onMouseLeave={closeDeptMenuWithDelay}
                  >
                    {/* Invisible protective bridge preventing cursor dropout during diagonal sweeps */}
                    <div className="absolute -top-3 -left-4 -right-8 h-5 pointer-events-auto bg-transparent" />
                    <div className="relative apple-glass-card border border-[#EAE3D9] rounded-2xl shadow-xl p-2 z-50 bg-white text-[#1D1917]">
                      <button
                        type="button"
                        onClick={() => { handleCategoryNav('computing'); setShowDepartmentMenu(false); }}
                        className="w-full text-left flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FAF7F2] text-[#1D1917] hover:text-[#B5532E] transition-colors border-0 bg-transparent cursor-pointer apple-pressable"
                      >
                        <span className="w-8 h-8 rounded-lg bg-[#FAF7F2] text-[#B5532E] border border-[#EAE3D9] flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-laptop text-xs"></i>
                        </span>
                        <div>
                          <p className="font-bold text-xs text-[#1D1917]">Phones & Computing</p>
                          <p className="text-[11px] text-[#78716C] font-normal">Smartphones, Laptops, Tablets</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => { handleCategoryNav('electronics'); setShowDepartmentMenu(false); }}
                        className="w-full text-left flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FAF7F2] text-[#1D1917] hover:text-[#B5532E] transition-colors border-0 bg-transparent cursor-pointer apple-pressable"
                      >
                        <span className="w-8 h-8 rounded-lg bg-[#3E5C76]/10 text-[#3E5C76] flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-headphones text-xs"></i>
                        </span>
                        <div>
                          <p className="font-bold text-xs text-[#1D1917]">Electronics & Audio</p>
                          <p className="text-[11px] text-[#78716C] font-normal">Headphones, 4K TVs, Soundbars</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => { handleCategoryNav('fashion'); setShowDepartmentMenu(false); }}
                        className="w-full text-left flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FAF7F2] text-[#1D1917] hover:text-[#B5532E] transition-colors border-0 bg-transparent cursor-pointer apple-pressable"
                      >
                        <span className="w-8 h-8 rounded-lg bg-[#B5532E]/10 text-[#B5532E] flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-shirt text-xs"></i>
                        </span>
                        <div>
                          <p className="font-bold text-xs text-[#1D1917]">Fashion & Streetwear</p>
                          <p className="text-[11px] text-[#78716C] font-normal">Men, Women, Watches, Hoodies</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => { handleCategoryNav('home'); setShowDepartmentMenu(false); }}
                        className="w-full text-left flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FAF7F2] text-[#1D1917] hover:text-[#B5532E] transition-colors border-0 bg-transparent cursor-pointer apple-pressable"
                      >
                        <span className="w-8 h-8 rounded-lg bg-[#D9A441]/15 text-[#8F3B1F] flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-couch text-xs"></i>
                        </span>
                        <div>
                          <p className="font-bold text-xs text-[#1D1917]">Home & Appliances</p>
                          <p className="text-[11px] text-[#78716C] font-normal">Espresso Makers, Kitchen, Living</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => { handleCategoryNav('digital'); setShowDepartmentMenu(false); }}
                        className="w-full text-left flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FAF7F2] text-[#1D1917] hover:text-[#B5532E] transition-colors border-0 bg-transparent cursor-pointer apple-pressable"
                      >
                        <span className="w-8 h-8 rounded-lg bg-[#4F6B3A]/15 text-[#4F6B3A] flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-code text-xs"></i>
                        </span>
                        <div>
                          <p className="font-bold text-xs text-[#1D1917]">Software & Digital Assets</p>
                          <p className="text-[11px] text-[#78716C] font-normal">Figma Kits, SaaS Templates</p>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <span className="text-[#E7D5BC]">|</span>

            {/* Quick Shopping Badges */}
            <Link
              href="/official-stores"
              className="text-[#2A2320] hover:text-[#B5532E] flex items-center gap-1.5 flex-shrink-0 font-bold"
            >
              <i className="fas fa-circle-check text-[#B5532E]"></i>
              <span>Official Brand Mall</span>
            </Link>

            <Link
              href="/flash-sales"
              className="text-[#B3261E] hover:text-[#8F3B1F] flex items-center gap-1.5 flex-shrink-0 font-bold"
            >
              <span>Flash Sales (Up to 60% OFF)</span>
            </Link>

            <Link
              href="/shop?express=true"
              className="text-[#2A2320] hover:text-[#B5532E] flex items-center gap-1.5 flex-shrink-0"
            >
              <i className="fas fa-truck-fast text-[#4F6B3A]"></i>
              <span>Marketsquare Express (Next-Day)</span>
            </Link>

            <Link
              href="/shop?type=digital"
              className="text-[#2A2320] hover:text-[#B5532E] flex items-center gap-1.5 flex-shrink-0"
            >
              <i className="fas fa-download text-[#3E5C76]"></i>
              <span>Digital Downloads</span>
            </Link>

            <Link
              href="/flash-sales"
              className="text-[#2A2320] hover:text-[#B5532E] flex-shrink-0"
            >
              Daily Deals
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};
