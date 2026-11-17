import * as React from 'react';
import { ArrowUp, ShieldCheck, PhoneCall, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{ backgroundColor: '#0F172A', color: '#CBD5E1', marginTop: '4rem', fontSize: '13px' }}>
      {/* Back to Top */}
      <div
        onClick={scrollToTop}
        style={{
          backgroundColor: '#1E293B',
          textAlign: 'center',
          padding: '12px',
          cursor: 'pointer',
          color: '#E2E8F0',
          fontWeight: 700,
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
        }}
      >
        <span>Back to Top</span>
        <ArrowUp size={14} />
      </div>

      {/* Main 4-Column Directory */}
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '3.5rem 2rem 2.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '32px',
        }}
      >
        {/* Column 1: Need Help */}
        <div>
          <h4 style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: 800, margin: '0 0 16px 0', letterSpacing: '-0.01em' }}>
            Customer Care & Help
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><a href="#help" style={{ color: '#94A3B8' }}>Help Center & FAQs</a></li>
            <li><a href="#track" style={{ color: '#94A3B8' }}>Track Your Order</a></li>
            <li><a href="#returns" style={{ color: '#94A3B8' }}>7-Day Return Policy</a></li>
            <li><a href="#disputes" style={{ color: '#94A3B8' }}>Dispute Resolution Desk</a></li>
            <li><a href="#escrow" style={{ color: '#94A3B8' }}>How Escrow Protection Works</a></li>
          </ul>
        </div>

        {/* Column 2: About Manga */}
        <div>
          <h4 style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: 800, margin: '0 0 16px 0', letterSpacing: '-0.01em' }}>
            About Manga Marketplace
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><a href="#about" style={{ color: '#94A3B8' }}>About Manga</a></li>
            <li><a href="#careers" style={{ color: '#94A3B8' }}>Careers at Manga</a></li>
            <li><a href="#terms" style={{ color: '#94A3B8' }}>Terms & Conditions</a></li>
            <li><a href="#privacy" style={{ color: '#94A3B8' }}>Privacy Policy</a></li>
            <li><a href="#press" style={{ color: '#94A3B8' }}>Press & Media</a></li>
          </ul>
        </div>

        {/* Column 3: Make Money */}
        <div>
          <h4 style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: 800, margin: '0 0 16px 0', letterSpacing: '-0.01em' }}>
            Make Money on Manga
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <a href="http://localhost:3001" target="_blank" rel="noreferrer" style={{ color: '#FDBA74', fontWeight: 700 }}>
                Sell on Manga (Merchant Hub)
              </a>
            </li>
            <li><a href="#logistics" style={{ color: '#94A3B8' }}>Become a Logistics Partner</a></li>
            <li><a href="#affiliate" style={{ color: '#94A3B8' }}>Manga Affiliate Program</a></li>
            <li><a href="#vendor-policy" style={{ color: '#94A3B8' }}>Seller Code of Conduct</a></li>
          </ul>
        </div>

        {/* Column 4: Contact & Payment Partners */}
        <div>
          <h4 style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: 800, margin: '0 0 16px 0', letterSpacing: '-0.01em' }}>
            Payment & Delivery
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '12px', color: '#94A3B8' }}>
              Accepted Payment Gateways:
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ backgroundColor: '#1E293B', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', color: '#E2E8F0', fontWeight: 600 }}>Mastercard</span>
              <span style={{ backgroundColor: '#1E293B', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', color: '#E2E8F0', fontWeight: 600 }}>Visa</span>
              <span style={{ backgroundColor: '#1E293B', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', color: '#E2E8F0', fontWeight: 600 }}>Verve</span>
              <span style={{ backgroundColor: '#1E293B', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', color: '#E2E8F0', fontWeight: 600 }}>Providus Virtual</span>
            </div>

            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px' }}>
              Logistics Network:
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ backgroundColor: '#1E293B', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', color: '#4ADE80', fontWeight: 600 }}>Manga Express</span>
              <span style={{ backgroundColor: '#1E293B', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', color: '#E2E8F0', fontWeight: 600 }}>GIG Logistics</span>
              <span style={{ backgroundColor: '#1E293B', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', color: '#E2E8F0', fontWeight: 600 }}>Red Star Express</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div
        style={{
          borderTop: '1px solid #1E293B',
          padding: '1.5rem 2rem',
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px',
          color: '#64748B',
        }}
      >
        <div>
          &copy; 2026 Manga Technologies Limited. Nigeria's Online Multi-Vendor Marketplace. All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>RC 1948201</span>
          <span>Lagos • Abuja • Port Harcourt • Kano</span>
        </div>
      </div>
    </footer>
  );
};
