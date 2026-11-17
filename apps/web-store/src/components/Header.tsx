import * as React from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  MapPin,
  ChevronDown,
  HelpCircle,
  Truck,
  ShieldCheck,
  Store,
  PhoneCall,
} from 'lucide-react';

export interface HeaderProps {
  cartCount: number;
  cartTotalNgn: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onSearch: (query: string, category: string) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
}

export const CITIES = ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano', 'Enugu', 'Kaduna', 'Benin City'];

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartTotalNgn,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onSearch,
  selectedCity,
  onSelectCity,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchCategory, setSearchCategory] = React.useState('All');
  const [showCityDropdown, setShowCityDropdown] = React.useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = React.useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery, searchCategory);
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      {/* 1. Top Utility Strip */}
      <div
        style={{
          backgroundColor: '#1E293B',
          color: '#E2E8F0',
          fontSize: '12px',
          padding: '6px 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* City Destination Switcher */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              style={{
                background: 'none',
                border: 'none',
                color: '#E2E8F0',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                fontSize: '12px',
                padding: '2px 0',
              }}
            >
              <MapPin size={13} color="#F97316" />
              <span>Deliver to: <strong style={{ color: '#FFFFFF' }}>{selectedCity}</strong></span>
              <ChevronDown size={12} />
            </button>

            {showCityDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '6px',
                  backgroundColor: '#FFFFFF',
                  color: '#1E293B',
                  borderRadius: '6px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  padding: '8px 0',
                  minWidth: '160px',
                  zIndex: 200,
                  border: '1px solid #E2E8F0',
                }}
              >
                <div style={{ padding: '6px 14px', fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                  Select Delivery City
                </div>
                {CITIES.map((city) => (
                  <div
                    key={city}
                    onClick={() => {
                      onSelectCity(city);
                      setShowCityDropdown(false);
                    }}
                    style={{
                      padding: '8px 14px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      backgroundColor: city === selectedCity ? '#FFF7ED' : 'transparent',
                      color: city === selectedCity ? '#C2410C' : '#1E293B',
                      fontWeight: city === selectedCity ? 600 : 400,
                    }}
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>

          <span style={{ color: '#475569' }}>|</span>

          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <ShieldCheck size={13} color="#22C55E" />
            <span>Escrow Protected Marketplace</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              color: '#FDBA74',
              fontWeight: 600,
              fontSize: '12px',
            }}
          >
            <Store size={13} />
            <span>Sell on Manga</span>
          </a>

          <span style={{ color: '#475569' }}>|</span>

          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <PhoneCall size={12} color="#94A3B8" />
            <span>Support: <strong>0700-62642-64</strong></span>
          </span>

          <span style={{ color: '#475569' }}>|</span>

          <span style={{ fontWeight: 600, color: '#F1F5F9' }}>₦ NGN</span>
        </div>
      </div>

      {/* 2. Main Search & Brand Bar */}
      <div
        style={{
          padding: '12px 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          maxWidth: '1440px',
          margin: '0 auto',
        }}
      >
        {/* Brand Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div
            style={{
              backgroundColor: '#C2410C',
              color: '#FFFFFF',
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '20px',
              letterSpacing: '-0.03em',
            }}
          >
            M
          </div>
          <div>
            <div
              style={{
                fontSize: '24px',
                fontWeight: 900,
                color: '#1E293B',
                letterSpacing: '-0.04em',
                lineHeight: 1,
              }}
            >
              MANGA<span style={{ color: '#C2410C' }}>.</span>
            </div>
            <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Marketplace
            </div>
          </div>
        </a>

        {/* High-Conversion Mega Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            flex: 1,
            maxWidth: '720px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '8px',
            border: '2px solid #C2410C',
            overflow: 'hidden',
            backgroundColor: '#FFFFFF',
          }}
        >
          {/* Category Dropdown */}
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            style={{
              padding: '10px 12px',
              border: 'none',
              backgroundColor: '#F8FAFC',
              borderRight: '1px solid #CBD5E1',
              color: '#334155',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="All">All Categories</option>
            <option value="Phones & Tablets">Phones & Tablets</option>
            <option value="Electronics & Audio">Electronics & Audio</option>
            <option value="Computers & Laptops">Computers & Laptops</option>
            <option value="Men's Fashion">Men's Fashion</option>
            <option value="Women's Fashion">Women's Fashion</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Beauty & Personal Care">Beauty & Personal Care</option>
          </select>

          {/* Search Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search millions of products, brands, tech & deals..."
            style={{
              flex: 1,
              padding: '10px 16px',
              border: 'none',
              fontSize: '14px',
              outline: 'none',
              color: '#0F172A',
            }}
          />

          {/* Search Action Button */}
          <button
            type="submit"
            style={{
              backgroundColor: '#C2410C',
              color: '#FFFFFF',
              border: 'none',
              padding: '0 22px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            <Search size={18} />
          </button>
        </form>

        {/* Right Header Controls (Account, Saved, Cart) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Account Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowAccountDropdown(!showAccountDropdown)}
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                padding: '4px',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#475569',
                }}
              >
                <User size={18} />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Hello, Sign in</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  Account <ChevronDown size={12} />
                </div>
              </div>
            </button>

            {showAccountDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  padding: '14px',
                  minWidth: '220px',
                  zIndex: 200,
                  border: '1px solid #E2E8F0',
                }}
              >
                <button
                  style={{
                    width: '100%',
                    backgroundColor: '#C2410C',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 0',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginBottom: '12px',
                  }}
                >
                  Sign In
                </button>
                <div style={{ fontSize: '12px', color: '#64748B', textAlign: 'center', marginBottom: '12px' }}>
                  New customer? <strong style={{ color: '#C2410C', cursor: 'pointer' }}>Register here</strong>
                </div>
                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '13px', color: '#334155', cursor: 'pointer', padding: '4px 0' }}>Your Orders</div>
                  <div style={{ fontSize: '13px', color: '#334155', cursor: 'pointer', padding: '4px 0' }}>Saved Wishlist</div>
                  <div style={{ fontSize: '13px', color: '#334155', cursor: 'pointer', padding: '4px 0' }}>Escrow & Refunds</div>
                  <div style={{ fontSize: '13px', color: '#334155', cursor: 'pointer', padding: '4px 0' }}>Customer Help Desk</div>
                </div>
              </div>
            )}
          </div>

          {/* Wishlist Link */}
          <button
            onClick={onOpenWishlist}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              color: '#334155',
              padding: '6px',
              position: 'relative',
            }}
          >
            <div style={{ position: 'relative' }}>
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-8px',
                    backgroundColor: '#C2410C',
                    color: '#FFFFFF',
                    borderRadius: '10px',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '1px 5px',
                  }}
                >
                  {wishlistCount}
                </span>
              )}
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Saved</span>
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={onOpenCart}
            style={{
              backgroundColor: '#C2410C',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            <div style={{ position: 'relative' }}>
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-10px',
                    backgroundColor: '#FEF08A',
                    color: '#713F12',
                    borderRadius: '10px',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '1px 6px',
                  }}
                >
                  {cartCount}
                </span>
              )}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '11px', opacity: 0.85, lineHeight: 1 }}>Cart</div>
              <div style={{ fontSize: '13px', fontWeight: 800, lineHeight: 1.2 }}>
                ₦{cartTotalNgn.toLocaleString()}
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
