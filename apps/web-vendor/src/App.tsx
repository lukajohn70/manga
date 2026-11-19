import * as React from 'react';
import { Button, Badge } from '@manga/ui';
import { AuthClient, calculateTotpCode, DEMO_CREDENTIALS } from '@manga/api-client';
import {
  Camera,
  Printer,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Package,
  Layers,
  Wallet,
  Clock,
  Truck,
  TrendingUp,
  AlertCircle,
  FileCheck2,
  RefreshCw,
} from 'lucide-react';
import { SlaTimerBadge } from './components/SlaTimerBadge.js';
import { BarcodeScannerModal } from './components/BarcodeScannerModal.js';
import { ShippingLabelModal } from './components/ShippingLabelModal.js';

interface VendorOrderItem {
  id: string;
  orderNumber: string;
  shipmentGroupId: string;
  status: 'pending_vendor_accept' | 'accepted' | 'packing' | 'ready_to_ship' | 'in_transit' | 'delivered';
  itemTitle: string;
  sku: string;
  qty: number;
  priceNgn: number;
  acceptDeadline: string;
  shipDeadline: string;
  recipientAddress: {
    recipientName: string;
    phone: string;
    streetAddress: string;
    city: string;
    stateOrProvince: string;
  };
  trackingNumber?: string;
  weightG?: number;
}

interface InventoryItem {
  sku: string;
  name: string;
  category: string;
  stockAvailable: number;
  stockReserved: number;
  unitPriceNgn: number;
  lowStockThreshold: number;
}

function NokTriangleIcon({ size = 18, color = '#B5532E' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L22 20H2L12 3Z" fill={color} />
      <circle cx="12" cy="13" r="2.5" fill="#F6EDE0" />
    </svg>
  );
}

export function App() {
  const authClient = React.useMemo(() => new AuthClient('http://localhost:3003'), []);

  const [vendorSession, setVendorSession] = React.useState<{
    email: string;
    storeName: string;
    role: 'VENDOR';
    token?: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('manga_vendor_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.role === 'VENDOR') return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [authStep, setAuthStep] = React.useState<'credentials' | '2fa'>('credentials');
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [authLoading, setAuthLoading] = React.useState(false);
  const [loginEmail, setLoginEmail] = React.useState('vendor@manga.ng');
  const [loginPassword, setLoginPassword] = React.useState('');
  const [twoFaMethod, setTwoFaMethod] = React.useState<'google_authenticator' | 'email'>('google_authenticator');
  const [twoFaCode, setTwoFaCode] = React.useState('');
  const [challengeToken, setChallengeToken] = React.useState<string | null>(null);
  const [totpSecret, setTotpSecret] = React.useState('KRSXG5CTMVRXEZLU');
  const [testOtp, setTestOtp] = React.useState<string | null>(null);

  const [activeTab, setActiveTab] = React.useState<
    'needs_action' | 'pack_scan' | 'ready_to_ship' | 'all' | 'inventory' | 'payouts'
  >('needs_action');

  // Seeded mock orders representing live vendor queue
  const [orders, setOrders] = React.useState<VendorOrderItem[]>([
    {
      id: 'sg-1',
      orderNumber: 'MNG-2611-48K2F',
      shipmentGroupId: 'sg-1',
      status: 'pending_vendor_accept',
      itemTitle: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones (Black)',
      sku: 'SONY-WH1000-BLK',
      qty: 1,
      priceNgn: 450000,
      acceptDeadline: new Date(Date.now() + 14 * 3600 * 1000).toISOString(),
      shipDeadline: new Date(Date.now() + 38 * 3600 * 1000).toISOString(),
      recipientAddress: {
        recipientName: 'Chidi Okonkwo',
        phone: '+234 803 123 4567',
        streetAddress: '24 Admiralty Way, Lekki Phase 1',
        city: 'Lagos',
        stateOrProvince: 'Lagos State',
      },
    },
    {
      id: 'sg-2',
      orderNumber: 'MNG-2611-19B8C',
      shipmentGroupId: 'sg-2',
      status: 'accepted',
      itemTitle: 'Logitech MX Master 3S Ergonomic Wireless Mouse',
      sku: 'LOGI-MX3S-GRY',
      qty: 2,
      priceNgn: 135000,
      acceptDeadline: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      shipDeadline: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
      recipientAddress: {
        recipientName: 'Amina Bello',
        phone: '+234 809 988 7766',
        streetAddress: '15 Gana Street, Maitama',
        city: 'Abuja',
        stateOrProvince: 'FCT',
      },
    },
    {
      id: 'sg-3',
      orderNumber: 'MNG-2611-77Z1D',
      shipmentGroupId: 'sg-3',
      status: 'ready_to_ship',
      itemTitle: 'Apple iPad Air 11-inch M2 Wi-Fi 128GB Space Gray',
      sku: 'APPL-IPAD-M2-128',
      qty: 1,
      priceNgn: 890000,
      acceptDeadline: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      shipDeadline: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
      recipientAddress: {
        recipientName: 'Tunde Bakare',
        phone: '+234 802 233 4455',
        streetAddress: '8 Commercial Avenue, Sabo',
        city: 'Yaba, Lagos',
        stateOrProvince: 'Lagos State',
      },
      trackingNumber: 'TRK-881294-MNG',
      weightG: 950,
    },
    {
      id: 'sg-4',
      orderNumber: 'MNG-2611-90E3A',
      shipmentGroupId: 'sg-4',
      status: 'in_transit',
      itemTitle: 'Anker 737 Power Bank (PowerCore 24K 140W)',
      sku: 'ANK-737-PWR-24K',
      qty: 1,
      priceNgn: 145000,
      acceptDeadline: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      shipDeadline: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      recipientAddress: {
        recipientName: 'Ngozi Eze',
        phone: '+234 818 445 9900',
        streetAddress: '12 Old Aba Road',
        city: 'Port Harcourt',
        stateOrProvince: 'Rivers State',
      },
      trackingNumber: 'TRK-552190-MNG',
      weightG: 630,
    },
  ]);

  // Seeded inventory
  const [inventory] = React.useState<InventoryItem[]>([
    {
      sku: 'SONY-WH1000-BLK',
      name: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones (Black)',
      category: 'Audio & Acoustics',
      stockAvailable: 14,
      stockReserved: 1,
      unitPriceNgn: 450000,
      lowStockThreshold: 5,
    },
    {
      sku: 'LOGI-MX3S-GRY',
      name: 'Logitech MX Master 3S Ergonomic Wireless Mouse',
      category: 'Productivity Hardware',
      stockAvailable: 28,
      stockReserved: 2,
      unitPriceNgn: 135000,
      lowStockThreshold: 10,
    },
    {
      sku: 'APPL-IPAD-M2-128',
      name: 'Apple iPad Air 11-inch M2 Wi-Fi 128GB Space Gray',
      category: 'Computing & Tablets',
      stockAvailable: 4,
      stockReserved: 1,
      unitPriceNgn: 890000,
      lowStockThreshold: 5,
    },
    {
      sku: 'ANK-737-PWR-24K',
      name: 'Anker 737 Power Bank (PowerCore 24K 140W)',
      category: 'Power & Charging',
      stockAvailable: 19,
      stockReserved: 1,
      unitPriceNgn: 145000,
      lowStockThreshold: 8,
    },
  ]);

  // Modal states
  const [scanningOrder, setScanningOrder] = React.useState<VendorOrderItem | null>(null);
  const [labelOrder, setLabelOrder] = React.useState<VendorOrderItem | null>(null);

  // Actions
  const handleAcceptOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'accepted' } : o))
    );
  };

  const handleScanComplete = (scannedSku: string, weightG: number) => {
    if (!scanningOrder) return;
    const trackingNumber = `TRK-${Date.now().toString().slice(-6)}-EXP`;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === scanningOrder.id
          ? {
              ...o,
              status: 'ready_to_ship',
              trackingNumber,
              weightG,
            }
          : o
      )
    );

    const updated = {
      ...scanningOrder,
      status: 'ready_to_ship' as const,
      trackingNumber,
      weightG,
    };
    setScanningOrder(null);
    setLabelOrder(updated); // immediately open print label dialog
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'needs_action') return o.status === 'pending_vendor_accept';
    if (activeTab === 'pack_scan') return o.status === 'accepted' || o.status === 'packing';
    if (activeTab === 'ready_to_ship') return o.status === 'ready_to_ship';
    return true;
  });

  const handleVendorLogout = () => {
    setVendorSession(null);
    try {
      localStorage.removeItem('manga_vendor_session');
    } catch {}
  };

  const handleVendorLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const pass = loginPassword || 'VendorPass123!';
      const res = await authClient.login(loginEmail, pass, 'VENDOR');
      setChallengeToken(res.challengeToken);
      setTotpSecret(res.totpSecret);
      setTestOtp(res.testOtp || null);
      setAuthStep('2fa');
      setTwoFaCode('');
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVendorVerify2faSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challengeToken) {
      setAuthStep('credentials');
      return;
    }

    setAuthError(null);
    setAuthLoading(true);

    try {
      const res = await authClient.verify2fa(challengeToken, twoFaMethod, twoFaCode);
      const session = {
        email: res.user.email,
        storeName: res.user.name || 'Apex Electronics Ltd',
        role: 'VENDOR' as const,
        token: res.token,
      };
      setVendorSession(session);
      setAuthStep('credentials');
      try {
        localStorage.setItem('manga_vendor_session', JSON.stringify(session));
      } catch {}
    } catch (err: any) {
      setAuthError(err.message || 'Invalid 2FA verification code. Please check your authenticator or email.');
    } finally {
      setAuthLoading(false);
    }
  };

  if (!vendorSession) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F6EDE0', color: '#2A2320', fontFamily: 'Inter, -apple-system, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ maxWidth: '460px', width: '100%', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E7D5BC', padding: '2rem', boxShadow: '0 8px 24px rgba(42, 35, 32, 0.08)', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#FEF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <NokTriangleIcon size={24} color="#B5532E" />
          </div>
          <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '22px', fontWeight: 800, color: '#B5532E', marginBottom: '0.25rem' }}>
            MANGA MARKETSQUARE Merchant Console
          </h1>
          <p style={{ fontSize: '12px', color: '#8C8279', marginBottom: '1.25rem' }}>
            Role-Based Access Guard • Required Role: <strong style={{ color: '#B5532E' }}>VENDOR</strong>
          </p>

          {authError && (
            <div style={{ padding: '10px 12px', backgroundColor: '#FDF2F2', border: '1px solid #F8B4B4', borderRadius: '8px', color: '#9B1C1C', fontSize: '11px', marginBottom: '1rem', textAlign: 'left', fontWeight: 600 }}>
              {authError}
            </div>
          )}

          {authStep === 'credentials' ? (
            <form onSubmit={handleVendorLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', textAlign: 'left' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#2A2320', marginBottom: '4px' }}>
                  Merchant Account Email
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="vendor@manga.ng"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E7D5BC', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#2A2320' }}>
                    Password
                  </label>
                  <span style={{ fontSize: '10px', color: '#8C8279' }}>Seed: VendorPass123!</span>
                </div>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter merchant password"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E7D5BC', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ padding: '8px 10px', backgroundColor: '#FAF6F0', borderRadius: '6px', border: '1px dashed #D9A441', fontSize: '10px', color: '#8C8279' }}>
                <span style={{ color: '#B5532E', fontWeight: 700 }}>Role Isolation Notice:</span> Only accounts with role <strong>VENDOR</strong> are granted access to merchant orders, warehouse scans, and payout ledgers. Shopper (BUYER) accounts are rejected with 403 Forbidden.
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={authLoading}
                style={{ width: '100%', backgroundColor: '#B5532E', color: '#FFFFFF', padding: '10px', fontSize: '12px', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: authLoading ? 'not-allowed' : 'pointer', marginTop: '0.25rem' }}
              >
                {authLoading ? 'Verifying Merchant...' : 'Proceed to 2FA Authentication →'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVendorVerify2faSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', textAlign: 'left' }}>
              <div style={{ padding: '10px', backgroundColor: '#FAF6F0', borderRadius: '8px', border: '1px solid #E7D5BC', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#2A2320', marginBottom: '2px' }}>
                  Merchant Two-Factor Verification
                </div>
                <div style={{ fontSize: '10px', color: '#8C8279' }}>
                  Account: <strong style={{ color: '#B5532E' }}>{loginEmail}</strong>
                </div>
              </div>

              {/* 2FA Method Selector */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', backgroundColor: '#FAF6F0', padding: '4px', borderRadius: '8px' }}>
                <button
                  type="button"
                  onClick={() => { setTwoFaMethod('google_authenticator'); setTwoFaCode(''); }}
                  style={{
                    padding: '6px 8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: twoFaMethod === 'google_authenticator' ? '#B5532E' : 'transparent',
                    color: twoFaMethod === 'google_authenticator' ? '#FFFFFF' : '#8C8279',
                  }}
                >
                  Authenticator App
                </button>
                <button
                  type="button"
                  onClick={() => { setTwoFaMethod('email'); setTwoFaCode(''); }}
                  style={{
                    padding: '6px 8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: twoFaMethod === 'email' ? '#B5532E' : 'transparent',
                    color: twoFaMethod === 'email' ? '#FFFFFF' : '#8C8279',
                  }}
                >
                  Email OTP Code
                </button>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#2A2320', marginBottom: '4px' }}>
                  {twoFaMethod === 'google_authenticator'
                    ? 'Enter 6-Digit Google Authenticator Code'
                    : `Enter 6-Digit Code dispatched to ${loginEmail}`}
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={twoFaCode}
                  onChange={(e) => setTwoFaCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #B5532E', backgroundColor: '#FAF6F0', color: '#2A2320', fontSize: '18px', textAlign: 'center', letterSpacing: '6px', outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }}
                />
              </div>

              {/* Interactive Helper Pill for instant verification */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: '#FAF6F0', borderRadius: '6px', fontSize: '10px', color: '#8C8279' }}>
                <span>
                  {twoFaMethod === 'google_authenticator' ? 'Live TOTP:' : 'Active OTP:'}{' '}
                  <strong style={{ color: '#B5532E' }}>
                    {twoFaMethod === 'google_authenticator' ? calculateTotpCode(totpSecret) : (testOtp || '882194')}
                  </strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const code = twoFaMethod === 'google_authenticator' ? calculateTotpCode(totpSecret) : (testOtp || '882194');
                    setTwoFaCode(code);
                  }}
                  style={{ background: 'none', border: 'none', color: '#B5532E', cursor: 'pointer', fontSize: '10px', fontWeight: 700 }}
                >
                  (Click to Autofill)
                </button>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '0.25rem' }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAuthStep('credentials')}
                  style={{ flex: 1, padding: '9px', fontSize: '11px', color: '#8C8279', borderColor: '#E7D5BC', backgroundColor: 'transparent' }}
                >
                  ← Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={authLoading || twoFaCode.length !== 6}
                  style={{ flex: 2, backgroundColor: '#B5532E', color: '#FFFFFF', padding: '9px', fontSize: '11px', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: authLoading || twoFaCode.length !== 6 ? 'not-allowed' : 'pointer' }}
                >
                  {authLoading ? 'Verifying 2FA...' : 'Complete Sign In'}
                </Button>
              </div>
            </form>
          )}

          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #E7D5BC', fontSize: '11px', color: '#8C8279' }}>
            <p style={{ marginBottom: '8px' }}>Are you a shopper / customer?</p>
            <a href="http://localhost:3000" style={{ color: '#B5532E', fontWeight: 700, textDecoration: 'none' }}>
              ← Return to Customer Storefront (Port 3000)
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F6EDE0', color: '#2A2320', fontFamily: 'Inter, -apple-system, sans-serif' }}>
      {/* Top Nok Terracotta Bar */}
      <div
        style={{
          backgroundColor: '#B5532E',
          color: '#F6EDE0',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.04em',
          padding: '6px 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <NokTriangleIcon size={12} color="#F6EDE0" />
          <span>MANGA MARKETSQUARE VENDOR HUB • NOK TERRACOTTA FULFILLMENT NETWORK</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>Carrier Handover Window: <strong>14:00 – 17:30 Daily</strong></span>
          <span>SLA Guarantee: <strong>48h Dispatch</strong></span>
        </div>
      </div>

      {/* Main Vendor Header */}
      <header
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E7D5BC',
          padding: '0.875rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(42, 35, 32, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <NokTriangleIcon size={26} color="#B5532E" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: 'Fraunces, Georgia, serif',
                  fontSize: '20px',
                  fontWeight: 800,
                  color: '#B5532E',
                  letterSpacing: '0.04em',
                  lineHeight: 1,
                }}
              >
                MANGA
              </span>
              <span style={{ fontSize: '8px', fontWeight: 800, color: '#D9A441', letterSpacing: '0.15em', marginTop: '2px' }}>
                MARKETSQUARE
              </span>
            </div>
          </div>
          <span style={{ color: '#E7D5BC', fontSize: '18px' }}>/</span>
          <span style={{ fontWeight: 700, color: '#2A2320', fontSize: '14px', letterSpacing: '0.02em' }}>
            Merchant Fulfillment Console
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#F0F6EE',
              color: '#4F6B3A',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              border: '1px solid #C2D6BC',
            }}
          >
            <Building2 size={13} />
            Apex Electronics Ltd (Tier 2 Verified)
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FEF7ED',
              color: '#8F3B1F',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 700,
              border: '1px solid #FAD7A0',
            }}
          >
            <ShieldCheck size={13} color="#8F3B1F" />
            <span>ROLE: VENDOR</span>
          </div>

          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#B5532E',
              textDecoration: 'none',
              padding: '5px 10px',
              borderRadius: '6px',
              backgroundColor: '#FAF6F0',
              border: '1px solid #E7D5BC',
            }}
          >
            Buyer Storefront ↗
          </a>

          <button
            type="button"
            onClick={handleVendorLogout}
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#B3261E',
              backgroundColor: '#FFFFFF',
              border: '1px solid #F8B4B4',
              borderRadius: '6px',
              padding: '5px 10px',
              cursor: 'pointer',
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* KPI Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              padding: '1.25rem',
              borderRadius: '10px',
              border: '1px solid #E7D5BC',
              boxShadow: '0 2px 4px rgba(42, 35, 32, 0.04)',
              borderTop: '3px solid #B3261E',
            }}
          >
            <div style={{ fontSize: '11px', color: '#8C8279', fontWeight: 700, letterSpacing: '0.05em' }}>
              PENDING ACCEPTANCE
            </div>
            <div
              style={{
                fontSize: '30px',
                fontWeight: 800,
                color: '#B3261E',
                marginTop: '4px',
                fontFamily: 'Fraunces, Georgia, serif',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {orders.filter((o) => o.status === 'pending_vendor_accept').length}
            </div>
            <div style={{ fontSize: '12px', color: '#8C8279', marginTop: '4px' }}>Requires merchant acknowledgment</div>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              padding: '1.25rem',
              borderRadius: '10px',
              border: '1px solid #E7D5BC',
              boxShadow: '0 2px 4px rgba(42, 35, 32, 0.04)',
              borderTop: '3px solid #D9A441',
            }}
          >
            <div style={{ fontSize: '11px', color: '#8C8279', fontWeight: 700, letterSpacing: '0.05em' }}>
              READY FOR PACK & SCAN
            </div>
            <div
              style={{
                fontSize: '30px',
                fontWeight: 800,
                color: '#D9A441',
                marginTop: '4px',
                fontFamily: 'Fraunces, Georgia, serif',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {orders.filter((o) => o.status === 'accepted' || o.status === 'packing').length}
            </div>
            <div style={{ fontSize: '12px', color: '#8C8279', marginTop: '4px' }}>Awaiting item scan & tare weight</div>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              padding: '1.25rem',
              borderRadius: '10px',
              border: '1px solid #E7D5BC',
              boxShadow: '0 2px 4px rgba(42, 35, 32, 0.04)',
              borderTop: '3px solid #3E5C76',
            }}
          >
            <div style={{ fontSize: '11px', color: '#8C8279', fontWeight: 700, letterSpacing: '0.05em' }}>
              STAGED FOR CARRIER PICKUP
            </div>
            <div
              style={{
                fontSize: '30px',
                fontWeight: 800,
                color: '#3E5C76',
                marginTop: '4px',
                fontFamily: 'Fraunces, Georgia, serif',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {orders.filter((o) => o.status === 'ready_to_ship').length}
            </div>
            <div style={{ fontSize: '12px', color: '#8C8279', marginTop: '4px' }}>Labeled parcels staged at dispatch desk</div>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              padding: '1.25rem',
              borderRadius: '10px',
              border: '1px solid #E7D5BC',
              boxShadow: '0 2px 4px rgba(42, 35, 32, 0.04)',
              borderTop: '3px solid #4F6B3A',
            }}
          >
            <div style={{ fontSize: '11px', color: '#8C8279', fontWeight: 700, letterSpacing: '0.05em' }}>
              ON-TIME DISPATCH RATE
            </div>
            <div
              style={{
                fontSize: '30px',
                fontWeight: 800,
                color: '#4F6B3A',
                marginTop: '4px',
                fontFamily: 'Fraunces, Georgia, serif',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              98.4%
            </div>
            <div style={{ fontSize: '12px', color: '#4F6B3A', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={13} /> Tier 2 SLA Benchmark Met
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '4px', borderBottom: '2px solid #E7D5BC', marginBottom: '1.5rem', backgroundColor: '#FFFFFF', borderRadius: '8px 8px 0 0', padding: '0 8px' }}>
          <button
            onClick={() => setActiveTab('needs_action')}
            style={{
              padding: '12px 18px',
              border: 'none',
              background: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              borderBottom: activeTab === 'needs_action' ? '3px solid #B5532E' : '3px solid transparent',
              color: activeTab === 'needs_action' ? '#B5532E' : '#8C8279',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Clock size={15} />
            Needs Action ({orders.filter((o) => o.status === 'pending_vendor_accept').length})
          </button>
          <button
            onClick={() => setActiveTab('pack_scan')}
            style={{
              padding: '12px 18px',
              border: 'none',
              background: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              borderBottom: activeTab === 'pack_scan' ? '3px solid #B5532E' : '3px solid transparent',
              color: activeTab === 'pack_scan' ? '#B5532E' : '#8C8279',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Camera size={15} />
            Pack & Scan ({orders.filter((o) => o.status === 'accepted' || o.status === 'packing').length})
          </button>
          <button
            onClick={() => setActiveTab('ready_to_ship')}
            style={{
              padding: '12px 18px',
              border: 'none',
              background: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              borderBottom: activeTab === 'ready_to_ship' ? '3px solid #B5532E' : '3px solid transparent',
              color: activeTab === 'ready_to_ship' ? '#B5532E' : '#8C8279',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Truck size={15} />
            Ready to Ship ({orders.filter((o) => o.status === 'ready_to_ship').length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '12px 18px',
              border: 'none',
              background: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              borderBottom: activeTab === 'all' ? '3px solid #B5532E' : '3px solid transparent',
              color: activeTab === 'all' ? '#B5532E' : '#8C8279',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Package size={15} />
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            style={{
              padding: '12px 18px',
              border: 'none',
              background: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              borderBottom: activeTab === 'inventory' ? '3px solid #B5532E' : '3px solid transparent',
              color: activeTab === 'inventory' ? '#B5532E' : '#8C8279',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Layers size={15} />
            Catalog & Stock
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            style={{
              padding: '12px 18px',
              border: 'none',
              background: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              borderBottom: activeTab === 'payouts' ? '3px solid #B5532E' : '3px solid transparent',
              color: activeTab === 'payouts' ? '#B5532E' : '#8C8279',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Wallet size={15} />
            Escrow & Payouts
          </button>
        </div>

        {/* Tab 1-4: Orders Queue */}
        {(activeTab === 'needs_action' ||
          activeTab === 'pack_scan' ||
          activeTab === 'ready_to_ship' ||
          activeTab === 'all') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredOrders.length === 0 ? (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '3.5rem 2rem',
                  textAlign: 'center',
                  borderRadius: '10px',
                  border: '1px solid #E7D5BC',
                  color: '#8C8279',
                }}
              >
                <CheckCircle2 size={36} color="#4F6B3A" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ margin: 0, color: '#2A2320', fontFamily: 'Fraunces, Georgia, serif', fontSize: '18px' }}>
                  Queue Clear
                </h3>
                <p style={{ margin: '6px 0 0', fontSize: '13px' }}>
                  There are currently no shipments awaiting attention in this stage.
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    border: '1px solid #E7D5BC',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 2px 4px rgba(42, 35, 32, 0.04)',
                  }}
                >
                  <div style={{ maxWidth: '65%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 800, fontSize: '15px', color: '#2A2320' }}>
                        Order #{order.orderNumber}
                      </span>
                      <Badge
                        variant={
                          order.status === 'ready_to_ship' || order.status === 'delivered'
                            ? 'success'
                            : order.status === 'accepted' || order.status === 'packing'
                            ? 'warning'
                            : order.status === 'in_transit'
                            ? 'neutral'
                            : 'error'
                        }
                      >
                        {order.status.replace(/_/g, ' ').toUpperCase()}
                      </Badge>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#B5532E' }}>
                        ₦{(order.priceNgn * order.qty).toLocaleString()}
                      </span>
                    </div>

                    <div style={{ fontSize: '14px', color: '#2A2320', fontWeight: 600, lineHeight: 1.4 }}>
                      {order.qty}x {order.itemTitle}
                    </div>

                    <div style={{ fontSize: '12px', color: '#8C8279', marginTop: '6px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                      <span>
                        Catalog SKU: <code style={{ color: '#2A2320', fontWeight: 600 }}>{order.sku}</code>
                      </span>
                      <span>•</span>
                      <span>
                        Destination:{' '}
                        <strong style={{ color: '#2A2320' }}>
                          {order.recipientAddress.city}, {order.recipientAddress.stateOrProvince}
                        </strong>
                      </span>
                      <span>•</span>
                      <span>Recipient: {order.recipientAddress.recipientName} ({order.recipientAddress.phone})</span>
                    </div>
                  </div>

                  {/* Right side: SLA Timer + Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {order.status === 'pending_vendor_accept' && (
                      <>
                        <SlaTimerBadge label="Accept SLA" deadlineIso={order.acceptDeadline} />
                        <Button variant="primary" size="sm" onClick={() => handleAcceptOrder(order.id)}>
                          Accept Order
                        </Button>
                      </>
                    )}

                    {order.status === 'accepted' && (
                      <>
                        <SlaTimerBadge label="Ship SLA" deadlineIso={order.shipDeadline} />
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setScanningOrder(order)}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Camera size={14} /> Pack & Scan SKU
                        </Button>
                      </>
                    )}

                    {order.status === 'ready_to_ship' && (
                      <>
                        <div style={{ textAlign: 'right', marginRight: '6px' }}>
                          <div style={{ fontSize: '11px', color: '#8C8279' }}>Waybill Tracking</div>
                          <strong style={{ color: '#2A2320', fontSize: '13px' }}>{order.trackingNumber}</strong>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setLabelOrder(order)}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Printer size={14} /> Print Waybill
                        </Button>
                      </>
                    )}

                    {order.status === 'in_transit' && (
                      <div
                        style={{
                          backgroundColor: '#F0F4F8',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid #D0DCE5',
                          fontSize: '12px',
                          color: '#3E5C76',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Truck size={14} /> In Transit ({order.trackingNumber})
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 5: Catalog & Inventory */}
        {activeTab === 'inventory' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E7D5BC', overflow: 'hidden', boxShadow: '0 2px 4px rgba(42, 35, 32, 0.04)' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E7D5BC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontFamily: 'Fraunces, Georgia, serif', fontSize: '18px', color: '#2A2320' }}>
                  Merchant Catalog & Buffer Stocks
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#8C8279' }}>
                  Live stock sync with Manga Buy-Box allocation engine
                </p>
              </div>
              <Button variant="secondary" size="sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <RefreshCw size={13} /> Sync ERP Catalog
              </Button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#FBF7F0', borderBottom: '1px solid #E7D5BC', color: '#8C8279', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '12px 18px' }}>SKU & Title</th>
                  <th style={{ padding: '12px 18px' }}>Category</th>
                  <th style={{ padding: '12px 18px' }}>Unit Price (NGN)</th>
                  <th style={{ padding: '12px 18px' }}>Available Stock</th>
                  <th style={{ padding: '12px 18px' }}>Reserved (In Orders)</th>
                  <th style={{ padding: '12px 18px' }}>Stock Health</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.sku} style={{ borderBottom: '1px solid #F0E6D8' }}>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 600, color: '#2A2320' }}>{item.name}</div>
                      <code style={{ fontSize: '11px', color: '#B5532E' }}>{item.sku}</code>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#8C8279' }}>{item.category}</td>
                    <td style={{ padding: '14px 18px', fontWeight: 700, color: '#2A2320' }}>
                      ₦{item.unitPriceNgn.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: 700, color: item.stockAvailable <= item.lowStockThreshold ? '#B3261E' : '#4F6B3A' }}>
                      {item.stockAvailable} units
                    </td>
                    <td style={{ padding: '14px 18px', color: '#8C8279' }}>
                      {item.stockReserved} units
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      {item.stockAvailable <= item.lowStockThreshold ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#B3261E', backgroundColor: '#FDF2F2', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                          <AlertCircle size={12} /> Low Stock Alert
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#4F6B3A', backgroundColor: '#F0F6EE', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                          <CheckCircle2 size={12} /> Healthy Buffer
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 6: Escrow & Payouts */}
        {activeTab === 'payouts' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '10px', border: '1px solid #E7D5BC', boxShadow: '0 2px 4px rgba(42, 35, 32, 0.04)' }}>
                <div style={{ fontSize: '12px', color: '#8C8279', fontWeight: 700 }}>AVAILABLE FOR SETTLEMENT</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#4F6B3A', margin: '6px 0', fontFamily: 'Fraunces, Georgia, serif' }}>
                  ₦1,420,500.00
                </div>
                <div style={{ fontSize: '12px', color: '#8C8279' }}>
                  Settles automatically into Access Bank ending in <strong style={{ color: '#2A2320' }}>*9412</strong>
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '10px', border: '1px solid #E7D5BC', boxShadow: '0 2px 4px rgba(42, 35, 32, 0.04)' }}>
                <div style={{ fontSize: '12px', color: '#8C8279', fontWeight: 700 }}>HELD IN PLATFORM ESCROW</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#D9A441', margin: '6px 0', fontFamily: 'Fraunces, Georgia, serif' }}>
                  ₦385,000.00
                </div>
                <div style={{ fontSize: '12px', color: '#8C8279' }}>
                  Released upon buyer delivery confirmation & 72h return clearance
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '10px', border: '1px solid #E7D5BC', boxShadow: '0 2px 4px rgba(42, 35, 32, 0.04)' }}>
                <div style={{ fontSize: '12px', color: '#8C8279', fontWeight: 700 }}>NEXT AUTOMATED PAYOUT</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#2A2320', margin: '6px 0', fontFamily: 'Fraunces, Georgia, serif' }}>
                  Friday 16:00
                </div>
                <div style={{ fontSize: '12px', color: '#4F6B3A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FileCheck2 size={13} /> NIBSS Instant Settlement Enabled
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E7D5BC', padding: '1.5rem', boxShadow: '0 2px 4px rgba(42, 35, 32, 0.04)' }}>
              <h3 style={{ margin: '0 0 1rem', fontFamily: 'Fraunces, Georgia, serif', fontSize: '18px', color: '#2A2320' }}>
                Recent Settlement Batches
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#FBF7F0', borderRadius: '6px', border: '1px solid #E7D5BC', fontSize: '13px' }}>
                  <div>
                    <strong>Batch #MNG-PAY-2611-002</strong> — 12 Delivered Orders
                    <div style={{ color: '#8C8279', fontSize: '12px' }}>Processed on Nov 14, 2026 at 16:02 WAT</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: '#4F6B3A' }}>+₦2,180,000.00</div>
                    <span style={{ fontSize: '11px', color: '#4F6B3A', backgroundColor: '#F0F6EE', padding: '2px 6px', borderRadius: '4px' }}>
                      Settled via NIBSS
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#FBF7F0', borderRadius: '6px', border: '1px solid #E7D5BC', fontSize: '13px' }}>
                  <div>
                    <strong>Batch #MNG-PAY-2611-001</strong> — 8 Delivered Orders
                    <div style={{ color: '#8C8279', fontSize: '12px' }}>Processed on Nov 07, 2026 at 16:00 WAT</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: '#4F6B3A' }}>+₦1,450,000.00</div>
                    <span style={{ fontSize: '11px', color: '#4F6B3A', backgroundColor: '#F0F6EE', padding: '2px 6px', borderRadius: '4px' }}>
                      Settled via NIBSS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {scanningOrder && (
        <BarcodeScannerModal
          isOpen={true}
          orderNumber={scanningOrder.orderNumber}
          expectedSku={scanningOrder.sku}
          itemTitle={scanningOrder.itemTitle}
          onClose={() => setScanningOrder(null)}
          onScanComplete={handleScanComplete}
        />
      )}

      {labelOrder && (
        <ShippingLabelModal
          isOpen={true}
          orderNumber={labelOrder.orderNumber}
          trackingNumber={labelOrder.trackingNumber || 'TRK-DEMO-001'}
          carrierName="Manga Express Logistics"
          weightG={labelOrder.weightG || 650}
          recipientAddress={labelOrder.recipientAddress}
          onClose={() => setLabelOrder(null)}
        />
      )}
    </div>
  );
}
