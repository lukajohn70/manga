'use client';

import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  const queryValue = searchQuery !== undefined && searchQuery !== '' ? searchQuery : internalQuery;

  const suggestions = [
    'iPhone 16 Pro Max',
    'Sony WH-1000XM5',
    'MacBook Air M3',
    'DeLonghi Dedica',
    'Samsung Galaxy S24 Ultra',
    'Figma UI Kit Pro',
    'Kano Leather Rucksack',
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
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noreferrer"
              className="text-[#D9A441] hover:underline transition-colors inline-flex items-center gap-1 font-bold"
            >
              <i className="fas fa-shop text-[11px]"></i>
              <span>Sell on MANGA</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main High-Conversion Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E7D5BC] shadow-2xs">
        <div className="container mx-auto px-4 lg:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Brand Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center hover:opacity-95 transition-opacity">
            <img src="/images/logo.svg" alt="MANGA MARKETSQUARE" className="h-7 sm:h-9 w-auto block" />
          </Link>

          {/* Large Center Search Bar with Instant Suggestions */}
          <div className="hidden md:flex flex-1 max-w-2xl relative">
            <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
              <input
                type="text"
                autoComplete="off"
                placeholder="Search genuine electronics, computing, fashion, living, software..."
                value={queryValue}
                onChange={(e) => {
                  if (onSearchChange) onSearchChange(e.target.value);
                  setInternalQuery(e.target.value);
                  setShowSearchSuggestions(true);
                }}
                onFocus={() => setShowSearchSuggestions(true)}
                className="w-full pl-11 pr-28 py-2.5 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E] focus:border-transparent transition-all shadow-inner text-[#2A2320]"
              />
              <i className="fas fa-search absolute left-4 text-[#8C8279] text-sm"></i>
              <button
                type="submit"
                className="absolute right-1.5 px-5 py-1.5 bg-[#B5532E] hover:bg-[#8F3B1F] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border-0 cursor-pointer shadow-xs"
              >
                <span>Search</span>
              </button>
            </form>

            {/* Dynamic Search Autocomplete Suggestions Dropdown */}
            {showSearchSuggestions && suggestions.length > 0 && (
              <div
                className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#E7D5BC] rounded-xl shadow-2xl z-50 overflow-hidden text-xs"
                onMouseLeave={() => setShowSearchSuggestions(false)}
              >
                <div className="p-2 bg-[#FAF6F0] border-b border-[#E7D5BC] text-[10px] uppercase font-bold text-[#8C8279] tracking-wider">
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
                    className="w-full text-left px-4 py-2.5 hover:bg-[#F6EDE0]/70 text-[#2A2320] hover:text-[#B5532E] flex items-center justify-between border-0 bg-transparent cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <i className="fas fa-arrow-trend-up text-[#8C8279] text-[10px]"></i>
                      <span>{item}</span>
                    </span>
                    <span className="text-[10px] text-[#8C8279]">Search</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Header Action Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-4 flex-shrink-0">

            {/* Customer Account Dropdown */}
            <div className="relative" onMouseLeave={() => setShowAccountMenu(false)}>
              <button
                type="button"
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                onMouseEnter={() => setShowAccountMenu(true)}
                className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl text-[#2A2320] hover:text-[#B5532E] hover:bg-[#F6EDE0]/50 transition-colors bg-transparent border-0 cursor-pointer"
              >
                {storeContext?.user ? (
                  <span className="w-7 h-7 rounded-full bg-[#4F6B3A]/15 text-[#4F6B3A] flex items-center justify-center font-black text-xs border border-[#4F6B3A]/30">
                    {storeContext.user.name.charAt(0)}
                  </span>
                ) : (
                  <i className="far fa-user text-base sm:text-lg text-[#2A2320]"></i>
                )}
                <span className="hidden lg:inline text-xs font-bold leading-tight text-left">
                  {storeContext?.user ? `Hi, ${storeContext.user.name.split(' ')[0]}` : 'Sign In'}
                  <br />
                  <span className="text-[11px] font-normal text-[#8C8279]">
                    {storeContext?.user ? 'Buyer Account' : 'Account & Orders'}{' '}
                    <i className="fas fa-chevron-down text-[9px] ml-0.5"></i>
                  </span>
                </span>
              </button>

              {/* Hover Dropdown Menu */}
              {showAccountMenu && (
                <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-[#E7D5BC] rounded-2xl shadow-2xl p-2.5 z-50 text-xs">
                  {storeContext?.user ? (
                    <>
                      <div className="p-2.5 bg-[#FAF6F0] rounded-xl border border-[#E7D5BC]/60 mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-[#2A2320] text-xs truncate">
                            {storeContext.user.name}
                          </span>
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#4F6B3A]/15 text-[#4F6B3A] border border-[#4F6B3A]/30">
                            Verified Buyer
                          </span>
                        </div>
                        <p className="text-[11px] text-[#8C8279] truncate">{storeContext.user.email}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setShowAccountMenu(false);
                          router.push('/account');
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#2A2320] hover:bg-[#F6EDE0]/70 hover:text-[#B5532E] font-medium border-0 bg-transparent cursor-pointer"
                      >
                        <i className="fas fa-id-card text-[#8C8279]"></i> Account Dashboard
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowAccountMenu(false);
                          router.push('/account#orders');
                        }}
                        className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-[#2A2320] hover:bg-[#F6EDE0]/70 hover:text-[#B5532E] font-medium border-0 bg-transparent cursor-pointer"
                      >
                        <span className="flex items-center gap-2.5">
                          <i className="fas fa-box text-[#8C8279]"></i> My Orders
                        </span>
                        {storeContext.orders?.length > 0 && (
                          <span className="text-[10px] bg-[#FAF6F0] border border-[#E7D5BC] px-1.5 py-0.5 rounded font-bold text-[#8C8279]">
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
                        className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-[#2A2320] hover:bg-[#F6EDE0]/70 hover:text-[#B5532E] font-medium border-0 bg-transparent cursor-pointer"
                      >
                        <span className="flex items-center gap-2.5">
                          <i className="fas fa-heart text-[#8C8279]"></i> Saved Wishlist
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
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#2A2320] hover:bg-[#F6EDE0]/70 hover:text-[#B5532E] font-medium border-0 bg-transparent cursor-pointer"
                      >
                        <i className="fas fa-location-crosshairs text-[#8C8279]"></i> Track Any Shipment
                      </button>

                      <div className="border-t border-[#E7D5BC]/60 my-1"></div>

                      <button
                        type="button"
                        onClick={() => {
                          setShowAccountMenu(false);
                          storeContext.logoutCustomer();
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#B3261E] hover:bg-red-50 font-bold border-0 bg-transparent cursor-pointer transition-colors"
                      >
                        <i className="fas fa-arrow-right-from-bracket"></i> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="p-2 text-center border-b border-[#E7D5BC]/60 mb-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowAccountMenu(false);
                            router.push('/account/login');
                          }}
                          className="block w-full py-2 bg-[#B5532E] text-white font-bold rounded-xl hover:bg-[#8F3B1F] transition-colors mb-2 border-0 cursor-pointer text-xs shadow-xs"
                        >
                          Sign In to Buyer Account
                        </button>
                        <p className="text-[#8C8279] text-[11px]">
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
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#2A2320] hover:bg-[#F6EDE0]/70 hover:text-[#B5532E] font-medium border-0 bg-transparent cursor-pointer"
                      >
                        <i className="fas fa-box text-[#8C8279]"></i> Track An Order
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowAccountMenu(false);
                          handleWishlistClick();
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#2A2320] hover:bg-[#F6EDE0]/70 hover:text-[#B5532E] font-medium border-0 bg-transparent cursor-pointer"
                      >
                        <i className="fas fa-heart text-[#8C8279]"></i> Saved Wishlist ({activeWishlistCount})
                      </button>

                      <div className="border-t border-[#E7D5BC]/60 my-1"></div>

                      <a
                        href="http://localhost:3001"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#B5532E] hover:bg-[#F6EDE0]/70 font-bold"
                      >
                        <i className="fas fa-store text-[#B5532E]"></i> Merchant Seller Console
                      </a>
                    </>
                  )}
                </div>
              )}
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
              <span
                id="header-wishlist-badge"
                className={`bg-[#B5532E] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full ml-0.5 leading-none min-w-[1.25rem] text-center ${
                  activeWishlistCount > 0 ? 'inline-block' : 'hidden'
                }`}
              >
                {activeWishlistCount}
              </span>
            </button>

            {/* Shopping Cart Button (Terracotta to Laterite gradient with Ochre Count Pill & Catch Ripple Target) */}
            <button
              id="header-cart-button"
              type="button"
              onClick={handleCartClick}
              className="relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#B5532E] to-[#8F3B1F] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all border-0 cursor-pointer"
            >
              <div id="header-cart-ripple-container" className="absolute inset-0 pointer-events-none"></div>
              <i className="fas fa-bag-shopping text-sm text-[#F6EDE0]"></i>
              <span className="hidden sm:inline">Cart</span>
              <span
                id="header-cart-badge"
                className="bg-[#D9A441] text-[#2A2320] text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center"
              >
                {activeCartCount}
              </span>
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
              className="w-full pl-9 pr-20 py-2 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E] focus:border-transparent transition-all shadow-inner text-[#2A2320]"
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
            <div className="relative" onMouseLeave={() => setShowDepartmentMenu(false)}>
              <button
                type="button"
                onClick={() => setShowDepartmentMenu(!showDepartmentMenu)}
                onMouseEnter={() => setShowDepartmentMenu(true)}
                className="text-[#2A2320] hover:text-[#B5532E] flex items-center gap-2 font-black flex-shrink-0 bg-[#F6EDE0] px-3 py-1 rounded-lg border-0 cursor-pointer text-xs transition-colors"
              >
                <i className="fas fa-bars-staggered text-xs text-[#B5532E]"></i>
                <span>All Departments</span>
                <i className="fas fa-chevron-down text-[9px] text-[#8C8279]"></i>
              </button>

              {/* Rich Flyout Megamenu */}
              {showDepartmentMenu && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-white border border-[#E7D5BC] rounded-2xl shadow-2xl p-2 z-50">
                  <button
                    type="button"
                    onClick={() => { handleCategoryNav('computing'); setShowDepartmentMenu(false); }}
                    className="w-full text-left flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F6EDE0]/60 text-[#2A2320] transition-colors border-0 bg-transparent cursor-pointer"
                  >
                    <span className="w-8 h-8 rounded-lg bg-[#F6EDE0] text-[#B5532E] flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-laptop text-xs"></i>
                    </span>
                    <div>
                      <p className="font-bold text-xs text-[#2A2320]">Phones & Computing</p>
                      <p className="text-[11px] text-[#8C8279] font-normal">Smartphones, Laptops, Tablets</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { handleCategoryNav('electronics'); setShowDepartmentMenu(false); }}
                    className="w-full text-left flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F6EDE0]/60 text-[#2A2320] transition-colors border-0 bg-transparent cursor-pointer"
                  >
                    <span className="w-8 h-8 rounded-lg bg-[#3E5C76]/10 text-[#3E5C76] flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-headphones text-xs"></i>
                    </span>
                    <div>
                      <p className="font-bold text-xs text-[#2A2320]">Electronics & Audio</p>
                      <p className="text-[11px] text-[#8C8279] font-normal">Headphones, 4K TVs, Soundbars</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { handleCategoryNav('fashion'); setShowDepartmentMenu(false); }}
                    className="w-full text-left flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F6EDE0]/60 text-[#2A2320] transition-colors border-0 bg-transparent cursor-pointer"
                  >
                    <span className="w-8 h-8 rounded-lg bg-[#B5532E]/10 text-[#B5532E] flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-shirt text-xs"></i>
                    </span>
                    <div>
                      <p className="font-bold text-xs text-[#2A2320]">Fashion & Streetwear</p>
                      <p className="text-[11px] text-[#8C8279] font-normal">Men, Women, Watches, Hoodies</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { handleCategoryNav('home'); setShowDepartmentMenu(false); }}
                    className="w-full text-left flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F6EDE0]/60 text-[#2A2320] transition-colors border-0 bg-transparent cursor-pointer"
                  >
                    <span className="w-8 h-8 rounded-lg bg-[#D9A441]/15 text-[#D9A441] flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-couch text-xs"></i>
                    </span>
                    <div>
                      <p className="font-bold text-xs text-[#2A2320]">Home & Appliances</p>
                      <p className="text-[11px] text-[#8C8279] font-normal">Espresso Makers, Kitchen, Living</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { handleCategoryNav('digital'); setShowDepartmentMenu(false); }}
                    className="w-full text-left flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F6EDE0]/60 text-[#2A2320] transition-colors border-0 bg-transparent cursor-pointer"
                  >
                    <span className="w-8 h-8 rounded-lg bg-[#4F6B3A]/15 text-[#4F6B3A] flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-code text-xs"></i>
                    </span>
                    <div>
                      <p className="font-bold text-xs text-[#2A2320]">Software & Digital Assets</p>
                      <p className="text-[11px] text-[#8C8279] font-normal">Figma Kits, SaaS Templates</p>
                    </div>
                  </button>
                </div>
              )}
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
              className="text-[#B3261E] hover:text-[#8F3B1F] flex items-center gap-1.5 flex-shrink-0 font-black animate-pulse"
            >
              <i className="fas fa-bolt"></i>
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
