import * as React from 'react';
import { Badge, Button } from '@manga/ui';
import { AuthClient, calculateTotpCode, DEMO_CREDENTIALS } from '@manga/api-client';
import {
  LayoutDashboard,
  Scale,
  Building2,
  BookOpen,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  ExternalLink,
  DollarSign,
  TrendingUp,
  Download,
  Package,
  Truck,
  Ticket,
  Sparkles,
  Users,
  Search,
  Plus,
  RefreshCw,
  Clock,
  ArrowUpRight,
  Eye,
  Check,
  Sliders,
  Filter,
} from 'lucide-react';
import { DisputeCenter } from './components/DisputeCenter.js';
import { RepairTools } from './components/RepairTools.js';

function NokTriangleIcon({ size = 18, color = '#B5532E' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L22 20H2L12 3Z" fill={color} />
      <circle cx="12" cy="13" r="2.5" fill="#F6EDE0" />
    </svg>
  );
}

interface VendorAccreditation {
  id: string;
  businessName: string;
  cacNumber: string;
  tinNumber: string;
  bankAccount: string;
  tier: 'Tier 1 Premier' | 'Tier 2 Verified' | 'Tier 3 Probation';
  onTimeRate: string;
  disputeRate: string;
  kycStatus: 'verified' | 'pending_review' | 'flagged';
  hubLocation: string;
  aiCredits: number;
}

interface AdminOrder {
  id: string;
  orderRef: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  destinationState: string;
  vendorStore: string;
  totalNgn: number;
  itemSummary: string;
  paymentStatus: 'paid' | 'escrow_held' | 'refunded';
  trackingStatus: 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  courier: string;
}

interface PlatformCoupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpendNgn: number;
  redemptions: number;
  maxRedemptions: number;
  isActive: boolean;
  description: string;
}

export function App() {
  const authClient = React.useMemo(() => new AuthClient('http://localhost:3003'), []);

  const [adminSession, setAdminSession] = React.useState<{
    email: string;
    role: 'ADMIN';
    operatorName: string;
    token?: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('manga_admin_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.role === 'ADMIN') return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [authStep, setAuthStep] = React.useState<'credentials' | '2fa'>('credentials');
  const [adminEmail, setAdminEmail] = React.useState('admin@manga.ng');
  const [adminPassword, setAdminPassword] = React.useState('');
  const [twoFaMethod, setTwoFaMethod] = React.useState<'google_authenticator' | 'email'>('google_authenticator');
  const [twoFaCode, setTwoFaCode] = React.useState('');
  const [challengeToken, setChallengeToken] = React.useState<string | null>(null);
  const [totpSecret, setTotpSecret] = React.useState('MFRGGZDFMZTWQ2LK');
  const [testOtp, setTestOtp] = React.useState<string | null>(null);
  const [adminAuthError, setAdminAuthError] = React.useState<string | null>(null);
  const [authLoading, setAuthLoading] = React.useState(false);

  // Active Tab state: defaults to overview Control Tower
  const [activeTab, setActiveTab] = React.useState<
    'overview' | 'disputes' | 'vendors' | 'ledger' | 'repairs'
  >('overview');

  // Toast feedback state
  const [toastMessage, setToastMessage] = React.useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Orders State (Courier Dispatch & Fulfillment)
  const [orders, setOrders] = React.useState<AdminOrder[]>([
    {
      id: 'ord-101',
      orderRef: 'MNG-2611-48K2F',
      customerName: 'Chidi Okonkwo',
      customerEmail: 'chidi.o@gmail.com',
      customerPhone: '+234 803 123 4567',
      destinationState: 'Lagos State (Lekki Phase 1)',
      vendorStore: 'Apex Electronics Ltd',
      totalNgn: 450000,
      itemSummary: 'Sony WH-1000XM5 Wireless ANC Headphones (Black)',
      paymentStatus: 'paid',
      trackingStatus: 'processing',
      createdAt: '2026-11-18 14:22',
      courier: 'Marketsquare Express Fleet',
    },
    {
      id: 'ord-102',
      orderRef: 'MNG-2611-19B8C',
      customerName: 'Amina Bello',
      customerEmail: 'amina.b@yahoo.com',
      customerPhone: '+234 809 988 7766',
      destinationState: 'Abuja FCT (Maitama)',
      vendorStore: 'Super Mart Nigeria',
      totalNgn: 270000,
      itemSummary: 'Logitech MX Master 3S Ergonomic Mouse x 2',
      paymentStatus: 'paid',
      trackingStatus: 'confirmed',
      createdAt: '2026-11-18 15:40',
      courier: 'GIG Logistics Direct',
    },
    {
      id: 'ord-103',
      orderRef: 'MNG-2611-77Z1D',
      customerName: 'Tunde Bakare',
      customerEmail: 'tbakare@techcorp.ng',
      customerPhone: '+234 802 233 4455',
      destinationState: 'Kaduna (Barnawa Metro)',
      vendorStore: 'Kaduna Craft & Terracotta Guild',
      totalNgn: 890000,
      itemSummary: 'Apple iPad Air 11-inch M2 Wi-Fi 128GB Space Gray',
      paymentStatus: 'paid',
      trackingStatus: 'shipped',
      createdAt: '2026-11-17 11:15',
      courier: 'Kaduna Express Sameday Courier',
    },
    {
      id: 'ord-104',
      orderRef: 'MNG-2611-90E3A',
      customerName: 'Ngozi Eze',
      customerEmail: 'ngozi.eze@outlook.com',
      customerPhone: '+234 818 445 9900',
      destinationState: 'Rivers State (Port Harcourt)',
      vendorStore: 'Apex Electronics Ltd',
      totalNgn: 145000,
      itemSummary: 'Anker 737 Power Bank (PowerCore 24K 140W)',
      paymentStatus: 'paid',
      trackingStatus: 'delivered',
      createdAt: '2026-11-16 09:30',
      courier: 'DHL Express Nigeria',
    },
    {
      id: 'ord-105',
      orderRef: 'MNG-2611-33X8P',
      customerName: 'Ibrahim Danladi',
      customerEmail: 'i.danladi@kanostore.ng',
      customerPhone: '+234 805 771 2233',
      destinationState: 'Kano (Nassarawa GRA)',
      vendorStore: 'Horizon Devices Global',
      totalNgn: 320000,
      itemSummary: 'Dell UltraSharp 27" 4K USB-C Hub Monitor',
      paymentStatus: 'escrow_held',
      trackingStatus: 'processing',
      createdAt: '2026-11-18 16:05',
      courier: 'Speedaf Logistics Hub',
    },
  ]);

  const [orderFilter, setOrderFilter] = React.useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = React.useState<string>('');

  // Handle Order Status Advance
  const handleUpdateOrderStatus = (orderId: string, newStatus: AdminOrder['trackingStatus']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, trackingStatus: newStatus } : o))
    );
    const target = orders.find((o) => o.id === orderId);
    showToast(
      `Order ${target?.orderRef || orderId} advanced to ${newStatus.toUpperCase()}. Notification pushed to customer and merchant.`,
      'success'
    );
  };

  // Coupons State
  const [coupons, setCoupons] = React.useState<PlatformCoupon[]>([
    {
      id: 'cpn-1',
      code: 'NOKLAUNCH20',
      discountType: 'percentage',
      discountValue: 20,
      minSpendNgn: 50000,
      redemptions: 142,
      maxRedemptions: 500,
      isActive: true,
      description: 'Platform Launch: 20% discount on first verified purchase',
    },
    {
      id: 'cpn-2',
      code: 'KADUNAFREESHIP',
      discountType: 'fixed',
      discountValue: 15000,
      minSpendNgn: 100000,
      redemptions: 89,
      maxRedemptions: 250,
      isActive: true,
      description: 'Free same-day doorstep shipping subsidy for Kaduna orders',
    },
    {
      id: 'cpn-3',
      code: 'PRODEV50',
      discountType: 'percentage',
      discountValue: 50,
      minSpendNgn: 25000,
      redemptions: 310,
      maxRedemptions: 1000,
      isActive: true,
      description: 'Software & Codebase Flash Promotion: 50% off digital licenses',
    },
  ]);

  const [newCouponCode, setNewCouponCode] = React.useState('');
  const [newCouponType, setNewCouponType] = React.useState<'percentage' | 'fixed'>('percentage');
  const [newCouponValue, setNewCouponValue] = React.useState(15);
  const [newCouponMinSpend, setNewCouponMinSpend] = React.useState(30000);
  const [newCouponDesc, setNewCouponDesc] = React.useState('');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    const newCoupon: PlatformCoupon = {
      id: `cpn-${Date.now()}`,
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      discountValue: Number(newCouponValue),
      minSpendNgn: Number(newCouponMinSpend),
      redemptions: 0,
      maxRedemptions: 200,
      isActive: true,
      description: newCouponDesc.trim() || `${newCouponValue}${newCouponType === 'percentage' ? '%' : ' NGN'} platform promotional discount`,
    };
    setCoupons([newCoupon, ...coupons]);
    setNewCouponCode('');
    setNewCouponDesc('');
    showToast(`Coupon code ${newCoupon.code} created and published live across storefront!`, 'success');
  };

  const handleToggleCoupon = (couponId: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === couponId ? { ...c, isActive: !c.isActive } : c))
    );
  };

  // Seeded mock accredited vendors
  const [vendors, setVendors] = React.useState<VendorAccreditation[]>([
    {
      id: 'VND-001',
      businessName: 'Apex Electronics Ltd',
      cacNumber: 'RC 1849204',
      tinNumber: '24910294-0001',
      bankAccount: 'Access Bank • 0129489412',
      tier: 'Tier 2 Verified',
      onTimeRate: '98.4%',
      disputeRate: '0.4%',
      kycStatus: 'verified',
      hubLocation: 'Lagos Central Sort',
      aiCredits: 25,
    },
    {
      id: 'VND-002',
      businessName: 'Super Mart Nigeria',
      cacNumber: 'RC 1492019',
      tinNumber: '19482014-0001',
      bankAccount: 'Zenith Bank • 2084920184',
      tier: 'Tier 2 Verified',
      onTimeRate: '96.2%',
      disputeRate: '1.1%',
      kycStatus: 'verified',
      hubLocation: 'Abuja Distribution Hub',
      aiCredits: 12,
    },
    {
      id: 'VND-003',
      businessName: 'Kaduna Craft & Terracotta Guild',
      cacNumber: 'BN 2948102',
      tinNumber: '92018491-0001',
      bankAccount: 'First Bank • 3091827401',
      tier: 'Tier 1 Premier',
      onTimeRate: '99.1%',
      disputeRate: '0.0%',
      kycStatus: 'verified',
      hubLocation: 'Kaduna Nok Artisan Hub',
      aiCredits: 50,
    },
    {
      id: 'VND-004',
      businessName: 'Horizon Devices Global',
      cacNumber: 'RC 3918290',
      tinNumber: 'Pending Upload',
      bankAccount: 'GTBank • 0192837461',
      tier: 'Tier 3 Probation',
      onTimeRate: '89.4%',
      disputeRate: '3.8%',
      kycStatus: 'pending_review',
      hubLocation: 'Port Harcourt Sort',
      aiCredits: 5,
    },
  ]);

  const handleGrantBonusCredits = (vendorId: string, amount: number) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, aiCredits: v.aiCredits + amount } : v))
    );
    showToast(`Granted ${amount} Studio credits to merchant #${vendorId}.`, 'success');
  };

  const handleAdminLogout = () => {
    setAdminSession(null);
    try {
      localStorage.removeItem('manga_admin_session');
    } catch {}
  };

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminAuthError(null);
    setAuthLoading(true);

    try {
      const pass = adminPassword || 'AdminPass123!';
      const res = await authClient.login(adminEmail, pass, 'ADMIN');
      setChallengeToken(res.challengeToken);
      setTotpSecret(res.totpSecret);
      setTestOtp(res.testOtp || null);
      setAuthStep('2fa');
      setTwoFaCode('');
    } catch (err: any) {
      setAdminAuthError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAdminVerify2faSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challengeToken) {
      setAuthStep('credentials');
      return;
    }

    setAdminAuthError(null);
    setAuthLoading(true);

    try {
      const res = await authClient.verify2fa(challengeToken, twoFaMethod, twoFaCode);
      const session = {
        email: res.user.email,
        role: 'ADMIN' as const,
        operatorName: res.user.name,
        token: res.token,
      };
      setAdminSession(session);
      setAuthStep('credentials');
      try {
        localStorage.setItem('manga_admin_session', JSON.stringify(session));
      } catch {}
    } catch (err: any) {
      setAdminAuthError(err.message || 'Invalid 2FA verification code. Please check your authenticator or email.');
    } finally {
      setAuthLoading(false);
    }
  };

  if (!adminSession) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#1E1815', color: '#F6EDE0', fontFamily: 'Inter, -apple-system, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ maxWidth: '460px', width: '100%', backgroundColor: '#2A2320', borderRadius: '16px', border: '1px solid #3E3430', padding: '2rem', boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#1E1815', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '1px solid #3E3430' }}>
            <NokTriangleIcon size={24} color="#B5532E" />
          </div>
          <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '20px', fontWeight: 800, color: '#F6EDE0', marginBottom: '0.25rem' }}>
            MANGA MARKETSQUARE Operations Console
          </h1>
          <p style={{ fontSize: '11px', color: '#D5C7B8', marginBottom: '1.25rem' }}>
            OWASP ASVS Level 2 Strict RBAC • Required Role: <strong style={{ color: '#D9A441' }}>ADMIN</strong>
          </p>

          {adminAuthError && (
            <div style={{ padding: '10px 12px', backgroundColor: '#3B1817', border: '1px solid #771D1D', borderRadius: '8px', color: '#F87171', fontSize: '11px', marginBottom: '1rem', textAlign: 'left', fontWeight: 600 }}>
              {adminAuthError}
            </div>
          )}

          {authStep === 'credentials' ? (
            <form onSubmit={handleAdminLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', textAlign: 'left' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#D5C7B8', marginBottom: '4px' }}>
                  Administrator Email
                </label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@manga.ng"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #3E3430', backgroundColor: '#1E1815', color: '#FFFFFF', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#D5C7B8' }}>
                    Password
                  </label>
                  <span style={{ fontSize: '10px', color: '#8C8279' }}>Seed: AdminPass123!</span>
                </div>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #3E3430', backgroundColor: '#1E1815', color: '#FFFFFF', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ padding: '8px 10px', backgroundColor: '#1E1815', borderRadius: '6px', border: '1px dashed #4F382E', fontSize: '10px', color: '#D5C7B8' }}>
                <span style={{ color: '#D9A441', fontWeight: 700 }}>Role Isolation Notice:</span> Only accounts with role <strong>ADMIN</strong> are granted access. Shopper (BUYER) and Merchant (VENDOR) logins are rejected with 403 Forbidden.
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={authLoading}
                style={{ width: '100%', backgroundColor: '#B5532E', color: '#FFFFFF', padding: '10px', fontSize: '12px', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: authLoading ? 'not-allowed' : 'pointer', marginTop: '0.25rem' }}
              >
                {authLoading ? 'Verifying Credentials...' : 'Proceed to 2FA Authentication →'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleAdminVerify2faSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', textAlign: 'left' }}>
              <div style={{ padding: '10px', backgroundColor: '#1E1815', borderRadius: '8px', border: '1px solid #3E3430', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#F6EDE0', marginBottom: '2px' }}>
                  Two-Factor Authentication (2FA)
                </div>
                <div style={{ fontSize: '10px', color: '#8C8279' }}>
                  Account: <strong style={{ color: '#D9A441' }}>{adminEmail}</strong>
                </div>
              </div>

              {/* 2FA Method Switcher */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', backgroundColor: '#1E1815', padding: '4px', borderRadius: '8px' }}>
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
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#D5C7B8', marginBottom: '4px' }}>
                  {twoFaMethod === 'google_authenticator'
                    ? 'Enter 6-Digit Google Authenticator Code'
                    : `Enter 6-Digit Code sent to ${adminEmail}`}
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={twoFaCode}
                  onChange={(e) => setTwoFaCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #B5532E', backgroundColor: '#1E1815', color: '#FFFFFF', fontSize: '18px', textAlign: 'center', letterSpacing: '6px', outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }}
                />
              </div>

              {/* Interactive Helper Pill for instant verification */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', backgroundColor: '#1E1815', borderRadius: '6px', fontSize: '10px', color: '#8C8279' }}>
                <span>
                  {twoFaMethod === 'google_authenticator' ? 'Live TOTP:' : 'Active OTP:'}{' '}
                  <strong style={{ color: '#D9A441' }}>
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
                  style={{ flex: 1, padding: '9px', fontSize: '11px', color: '#D5C7B8', borderColor: '#3E3430', backgroundColor: 'transparent' }}
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

          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #3E3430', fontSize: '11px', color: '#8C8279' }}>
            <p style={{ marginBottom: '8px' }}>Manga Customer Storefront</p>
            <a href="http://localhost:3000" style={{ color: '#D9A441', fontWeight: 700, textDecoration: 'none' }}>
              ← Return to Customer Storefront (Port 3000)
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Filtered orders
  const displayedOrders = orders.filter((o) => {
    if (orderFilter !== 'all' && o.trackingStatus !== orderFilter) return false;
    if (orderSearchQuery) {
      const q = orderSearchQuery.toLowerCase();
      return (
        o.orderRef.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.vendorStore.toLowerCase().includes(q) ||
        o.itemSummary.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAF6F0', fontFamily: 'Inter, -apple-system, sans-serif', color: '#2A2320' }}>
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: toastMessage.type === 'success' ? '#1E1815' : '#B3261E',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            fontSize: '12px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 9999,
            border: '1px solid #D9A441',
          }}
        >
          <CheckCircle2 size={16} color="#D9A441" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Admin Bar */}
      <header
        style={{
          backgroundColor: '#1E1815',
          color: '#F6EDE0',
          padding: '0.85rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 12px rgba(42, 35, 32, 0.2)',
          borderBottom: '1px solid #3E3430',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <NokTriangleIcon size={24} color="#B5532E" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: '#FAF6F0',
                  letterSpacing: '0.04em',
                  fontFamily: 'Fraunces, Georgia, serif',
                  lineHeight: 1,
                }}
              >
                MANGA
              </span>
              <span style={{ fontSize: '8px', fontWeight: 800, color: '#D9A441', letterSpacing: '0.15em', marginTop: '2px' }}>
                MARKETSQUARE CONTROL TOWER
              </span>
            </div>
          </div>
          <span style={{ color: '#5A4E47' }}>|</span>
          <span style={{ fontSize: '13px', color: '#D5C7B8', fontWeight: 500 }}>
            Marketplace Operations, Courier Dispatch & Governance
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#2A2320',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              color: '#4F6B3A',
              border: '1px solid #3E3430',
              fontWeight: 700,
            }}
          >
            <ShieldCheck size={13} color="#4F6B3A" />
            <span style={{ color: '#F6EDE0' }}>ROLE: ADMIN</span>
          </div>
          <Badge variant="warning">MFA Active</Badge>
          <span style={{ fontSize: '12px', color: '#D5C7B8' }}>
            Operator: <strong style={{ color: '#F6EDE0' }}>{adminSession.email}</strong>
          </span>

          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#D9A441',
              backgroundColor: '#2A2320',
              border: '1px solid #3E3430',
              borderRadius: '6px',
              padding: '5px 10px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>Storefront</span>
            <ExternalLink size={11} />
          </a>

          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#FAF6F0',
              backgroundColor: '#2A2320',
              border: '1px solid #3E3430',
              borderRadius: '6px',
              padding: '5px 10px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>Vendor Hub</span>
            <ExternalLink size={11} />
          </a>

          <button
            type="button"
            onClick={handleAdminLogout}
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#F87171',
              backgroundColor: '#2A2320',
              border: '1px solid #771D1D',
              borderRadius: '6px',
              padding: '5px 10px',
              cursor: 'pointer',
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Navigation Sub-header (Tabs with Clear Visual Hierarchy) */}
      <nav
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E7D5BC',
          padding: '0 2rem',
          display: 'flex',
          gap: '1.5rem',
          boxShadow: '0 2px 4px rgba(42, 35, 32, 0.03)',
        }}
      >
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '14px 4px',
            border: 'none',
            background: 'none',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderBottom: activeTab === 'overview' ? '3px solid #B5532E' : '3px solid transparent',
            color: activeTab === 'overview' ? '#B5532E' : '#8C8279',
          }}
        >
          <LayoutDashboard size={16} /> Operations Control Tower
        </button>
        <button
          onClick={() => setActiveTab('disputes')}
          style={{
            padding: '14px 4px',
            border: 'none',
            background: 'none',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderBottom: activeTab === 'disputes' ? '3px solid #B5532E' : '3px solid transparent',
            color: activeTab === 'disputes' ? '#B5532E' : '#8C8279',
          }}
        >
          <Scale size={16} /> Dispute Mediation & Evidence
        </button>
        <button
          onClick={() => setActiveTab('vendors')}
          style={{
            padding: '14px 4px',
            border: 'none',
            background: 'none',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderBottom: activeTab === 'vendors' ? '3px solid #B5532E' : '3px solid transparent',
            color: activeTab === 'vendors' ? '#B5532E' : '#8C8279',
          }}
        >
          <Building2 size={16} /> Merchant Accreditation & Tiers
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          style={{
            padding: '14px 4px',
            border: 'none',
            background: 'none',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderBottom: activeTab === 'ledger' ? '3px solid #B5532E' : '3px solid transparent',
            color: activeTab === 'ledger' ? '#B5532E' : '#8C8279',
          }}
        >
          <BookOpen size={16} /> Financial Ledger & Payouts
        </button>
        <button
          onClick={() => setActiveTab('repairs')}
          style={{
            padding: '14px 4px',
            border: 'none',
            background: 'none',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderBottom: activeTab === 'repairs' ? '3px solid #B5532E' : '3px solid transparent',
            color: activeTab === 'repairs' ? '#B5532E' : '#8C8279',
          }}
        >
          <Wrench size={16} /> Operations & System Recovery
        </button>
      </nav>

      {/* Main Container */}
      <main style={{ maxWidth: '1320px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        
        {/* ======================================================== */}
        {/* TAB 1: OPERATIONS CONTROL TOWER (ZAVORA ARCHITECTURE)    */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Control Tower Headline */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', borderRadius: '999px', backgroundColor: '#F6EDE0', border: '1px solid #E7D5BC', color: '#B5532E', fontSize: '11px', fontWeight: 700, marginBottom: '6px' }}>
                  <ShieldCheck size={12} color="#B5532E" />
                  <span>MANGA Central Marketplace Operations Console</span>
                </div>
                <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#2A2320', fontFamily: 'Fraunces, Georgia, serif', letterSpacing: '-0.02em' }}>
                  Platform Control Tower & Logistics Hub
                </h1>
                <p style={{ margin: '4px 0 0', color: '#8C8279', fontSize: '13px' }}>
                  Real-time GMV settlement, live courier dispatch transitions, and platform voucher governance.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#FFFFFF', padding: '6px 12px', borderRadius: '8px', border: '1px solid #E7D5BC', fontSize: '12px', fontWeight: 600, color: '#4F6B3A' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4F6B3A' }}></span>
                  <span>Providus Escrow Active</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#FFFFFF', padding: '6px 12px', borderRadius: '8px', border: '1px solid #E7D5BC', fontSize: '12px', fontWeight: 600, color: '#2A2320' }}>
                  <RefreshCw size={13} color="#8C8279" />
                  <span>Auto-sync: 30s</span>
                </div>
              </div>
            </div>

            {/* 1. Executive Marketplace Metrics (5 KPI Cards with Zavora High Visual Hierarchy) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              
              <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E7D5BC', boxShadow: '0 2px 6px rgba(42, 35, 32, 0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#8C8279', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Gross Merchandise (GMV)
                  </span>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FAF6F0', color: '#B5532E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <DollarSign size={16} />
                  </div>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#2A2320', fontFamily: 'Fraunces, Georgia, serif' }}>
                  ₦18,450,000
                </div>
                <div style={{ fontSize: '11px', color: '#4F6B3A', fontWeight: 600, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={12} />
                  <span>+14.2% vs last week (Paystack Verified)</span>
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E7D5BC', boxShadow: '0 2px 6px rgba(42, 35, 32, 0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#8C8279', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Take-Rate Commission (15%)
                  </span>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#F0F6EE', color: '#4F6B3A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp size={16} />
                  </div>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#4F6B3A', fontFamily: 'Fraunces, Georgia, serif' }}>
                  ₦2,767,500
                </div>
                <div style={{ fontSize: '11px', color: '#8C8279', fontWeight: 500, marginTop: '6px' }}>
                  Platform Net Operating Margin
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E7D5BC', boxShadow: '0 2px 6px rgba(42, 35, 32, 0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#8C8279', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Total Orders Processed
                  </span>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#F4F0FF', color: '#6B46C1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Package size={16} />
                  </div>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#2A2320', fontFamily: 'Fraunces, Georgia, serif' }}>
                  1,284
                </div>
                <div style={{ fontSize: '11px', color: '#2A2320', fontWeight: 600, marginTop: '6px' }}>
                  1,042 Physical • 242 Digital Licenses
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E7D5BC', boxShadow: '0 2px 6px rgba(42, 35, 32, 0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#8C8279', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Verified Merchants
                  </span>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FEF7ED', color: '#D9A441', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 size={16} />
                  </div>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#2A2320', fontFamily: 'Fraunces, Georgia, serif' }}>
                  48
                </div>
                <div style={{ fontSize: '11px', color: '#4F6B3A', fontWeight: 600, marginTop: '6px' }}>
                  100% CAC Audited & Accredited
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E7D5BC', boxShadow: '0 2px 6px rgba(42, 35, 32, 0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#8C8279', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Escrow In-Flight
                  </span>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FEF2F2', color: '#B3261E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={16} />
                  </div>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#B5532E', fontFamily: 'Fraunces, Georgia, serif' }}>
                  ₦8,320,000
                </div>
                <div style={{ fontSize: '11px', color: '#8C8279', fontWeight: 500, marginTop: '6px' }}>
                  Held in Trust Pending Handover
                </div>
              </div>

            </div>

            {/* 2. Courier Dispatch & Order Fulfillment Management (Zavora Style) */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E7D5BC', padding: '1.5rem', boxShadow: '0 2px 6px rgba(42, 35, 32, 0.04)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #E7D5BC' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#2A2320', fontFamily: 'Fraunces, Georgia, serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Truck size={20} color="#B5532E" />
                    <span>Courier Dispatch & Live Order Fulfillment Manager</span>
                  </h2>
                  <p style={{ margin: '3px 0 0', color: '#8C8279', fontSize: '12px' }}>
                    Update live courier tracking milestones, review order payloads, and broadcast delivery events.
                  </p>
                </div>

                {/* Filter and Search Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#8C8279' }} />
                    <input
                      type="text"
                      placeholder="Search order ref, customer, item..."
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      style={{
                        padding: '6px 12px 6px 30px',
                        borderRadius: '8px',
                        border: '1px solid #E7D5BC',
                        fontSize: '12px',
                        outline: 'none',
                        width: '220px',
                        backgroundColor: '#FAF6F0',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', backgroundColor: '#FAF6F0', padding: '2px', borderRadius: '8px', border: '1px solid #E7D5BC' }}>
                    {(['all', 'confirmed', 'processing', 'shipped', 'delivered'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setOrderFilter(status)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          border: 'none',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          backgroundColor: orderFilter === status ? '#B5532E' : 'transparent',
                          color: orderFilter === status ? '#FFFFFF' : '#8C8279',
                          textTransform: 'capitalize',
                        }}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Orders Table */}
              <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF6F0', borderBottom: '1px solid #E7D5BC', color: '#8C8279', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <th style={{ padding: '10px 14px', fontWeight: 700 }}>Order Ref</th>
                      <th style={{ padding: '10px 14px', fontWeight: 700 }}>Customer & Destination</th>
                      <th style={{ padding: '10px 14px', fontWeight: 700 }}>Merchant Entity</th>
                      <th style={{ padding: '10px 14px', fontWeight: 700 }}>Items & Total</th>
                      <th style={{ padding: '10px 14px', fontWeight: 700 }}>Payment</th>
                      <th style={{ padding: '10px 14px', fontWeight: 700 }}>Tracking Milestone</th>
                      <th style={{ padding: '10px 14px', fontWeight: 700 }}>Quick Milestone Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#8C8279', fontStyle: 'italic' }}>
                          No orders matched the filter criteria.
                        </td>
                      </tr>
                    ) : (
                      displayedOrders.map((ord) => (
                        <tr key={ord.id} style={{ borderBottom: '1px solid #F0E6D8' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 700, fontFamily: 'monospace', color: '#B5532E' }}>
                            {ord.orderRef}
                            <div style={{ fontSize: '10px', color: '#8C8279', fontWeight: 400 }}>{ord.createdAt}</div>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontWeight: 700, color: '#2A2320' }}>{ord.customerName}</div>
                            <div style={{ fontSize: '11px', color: '#8C8279' }}>{ord.destinationState}</div>
                            <div style={{ fontSize: '10px', color: '#8C8279', fontFamily: 'monospace' }}>{ord.customerPhone}</div>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontWeight: 600, color: '#2A2320' }}>{ord.vendorStore}</div>
                            <div style={{ fontSize: '10px', color: '#4F6B3A' }}>Carrier: {ord.courier}</div>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontWeight: 800, color: '#2A2320' }}>₦{ord.totalNgn.toLocaleString()}</div>
                            <div style={{ fontSize: '11px', color: '#8C8279', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {ord.itemSummary}
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '3px 8px',
                                borderRadius: '999px',
                                fontSize: '10px',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                backgroundColor: ord.paymentStatus === 'paid' ? '#F0F6EE' : '#FEF7ED',
                                color: ord.paymentStatus === 'paid' ? '#4F6B3A' : '#D9A441',
                                border: ord.paymentStatus === 'paid' ? '1px solid #C2D6BC' : '1px solid #FAD7A0',
                              }}
                            >
                              {ord.paymentStatus === 'paid' ? 'Paid (Escrow)' : 'Escrow Held'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '3px 8px',
                                borderRadius: '999px',
                                fontSize: '10px',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                backgroundColor:
                                  ord.trackingStatus === 'delivered'
                                    ? '#F0F6EE'
                                    : ord.trackingStatus === 'shipped'
                                    ? '#EFF6FF'
                                    : ord.trackingStatus === 'processing'
                                    ? '#FEF7ED'
                                    : '#FAF6F0',
                                color:
                                  ord.trackingStatus === 'delivered'
                                    ? '#4F6B3A'
                                    : ord.trackingStatus === 'shipped'
                                    ? '#1D4ED8'
                                    : ord.trackingStatus === 'processing'
                                    ? '#D9A441'
                                    : '#8C8279',
                              }}
                            >
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }}></span>
                              <span>{ord.trackingStatus}</span>
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <select
                                value={ord.trackingStatus}
                                onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid #E7D5BC',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  backgroundColor: '#FFFFFF',
                                  color: '#2A2320',
                                  cursor: 'pointer',
                                }}
                              >
                                <option value="confirmed">Confirmed</option>
                                <option value="processing">Processing / Packing</option>
                                <option value="shipped">In Transit (Shipped)</option>
                                <option value="delivered">Delivered & Signed</option>
                                <option value="cancelled">Cancelled / Refund</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>

            {/* 3. Promotional Coupons & Discount Governance (Zavora Style) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
              
              {/* Left: Create Platform Coupon */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E7D5BC', padding: '1.5rem', boxShadow: '0 2px 6px rgba(42, 35, 32, 0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #E7D5BC' }}>
                  <Ticket size={18} color="#B5532E" />
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#2A2320', fontFamily: 'Fraunces, Georgia, serif' }}>
                    Issue Promotional Coupon Voucher
                  </h3>
                </div>

                <form onSubmit={handleCreateCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#2A2320', marginBottom: '4px' }}>
                      Coupon Promo Code (e.g. KADUNA2026)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. NOKSPECIAL15"
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E7D5BC', fontSize: '12px', outline: 'none', textTransform: 'uppercase', fontWeight: 700 }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#2A2320', marginBottom: '4px' }}>
                        Discount Type
                      </label>
                      <select
                        value={newCouponType}
                        onChange={(e) => setNewCouponType(e.target.value as any)}
                        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #E7D5BC', fontSize: '12px' }}
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (₦)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#2A2320', marginBottom: '4px' }}>
                        Discount Value {newCouponType === 'percentage' ? '(%)' : '(₦)'}
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={newCouponValue}
                        onChange={(e) => setNewCouponValue(Number(e.target.value))}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E7D5BC', fontSize: '12px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#2A2320', marginBottom: '4px' }}>
                      Minimum Order Spend (₦)
                    </label>
                    <input
                      type="number"
                      value={newCouponMinSpend}
                      onChange={(e) => setNewCouponMinSpend(Number(e.target.value))}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E7D5BC', fontSize: '12px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#2A2320', marginBottom: '4px' }}>
                      Description & Terms
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 15% discount for verified buyers on tech accessories"
                      value={newCouponDesc}
                      onChange={(e) => setNewCouponDesc(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E7D5BC', fontSize: '12px' }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#B5532E',
                      color: '#FFFFFF',
                      padding: '10px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      marginTop: '4px',
                    }}
                  >
                    <Plus size={14} />
                    <span>Publish Coupon to Storefront</span>
                  </button>
                </form>
              </div>

              {/* Right: Active Platform Coupons */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E7D5BC', padding: '1.5rem', boxShadow: '0 2px 6px rgba(42, 35, 32, 0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #E7D5BC' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Ticket size={18} color="#4F6B3A" />
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#2A2320', fontFamily: 'Fraunces, Georgia, serif' }}>
                      Active Platform Coupons ({coupons.length})
                    </h3>
                  </div>
                  <span style={{ fontSize: '11px', color: '#8C8279', fontWeight: 600 }}>Checkout API Synced</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {coupons.map((c) => (
                    <div
                      key={c.id}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: '1px solid #E7D5BC',
                        backgroundColor: c.isActive ? '#FAF6F0' : '#F5F5F5',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '13px', color: c.isActive ? '#B5532E' : '#8C8279' }}>
                            {c.code}
                          </span>
                          <span
                            style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: 700,
                              backgroundColor: c.discountType === 'percentage' ? '#F0F6EE' : '#EFF6FF',
                              color: c.discountType === 'percentage' ? '#4F6B3A' : '#1D4ED8',
                            }}
                          >
                            {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₦${c.discountValue.toLocaleString()} OFF`}
                          </span>
                        </div>
                        <p style={{ margin: '3px 0 0', fontSize: '11px', color: '#8C8279' }}>
                          {c.description} &bull; Min spend: ₦{c.minSpendNgn.toLocaleString()}
                        </p>
                        <div style={{ fontSize: '10px', color: '#8C8279', marginTop: '2px' }}>
                          Redeemed: <strong>{c.redemptions}</strong> / {c.maxRedemptions} uses
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleCoupon(c.id)}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '6px',
                          border: '1px solid #E7D5BC',
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: c.isActive ? '#FFFFFF' : '#E5E5E5',
                          color: c.isActive ? '#4F6B3A' : '#8C8279',
                          cursor: 'pointer',
                        }}
                      >
                        {c.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: DISPUTES MEDIATION & EVIDENCE                     */}
        {/* ======================================================== */}
        {activeTab === 'disputes' && <DisputeCenter />}

        {/* ======================================================== */}
        {/* TAB 3: MERCHANT ACCREDITATION & TIERS (ZAVORA UPGRADE)   */}
        {/* ======================================================== */}
        {activeTab === 'vendors' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#2A2320', fontFamily: 'Fraunces, Georgia, serif' }}>
                  Merchant Accreditation & Compliance Registry
                </h2>
                <p style={{ margin: '4px 0 0', color: '#8C8279', fontSize: '13px' }}>
                  Statutory CAC incorporation audits, TIN compliance, and SLA fulfillment tier allocation.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Badge variant="success">CAC Verified: 98%</Badge>
                <Badge variant="neutral">Active Sellers: {vendors.length}</Badge>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E7D5BC', overflow: 'hidden', boxShadow: '0 2px 4px rgba(42, 35, 32, 0.04)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#FAF6F0', borderBottom: '1px solid #E7D5BC', color: '#8C8279', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>Merchant Entity</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>Statutory Registrations</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>NUBAN Bank Account</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>Performance Tier</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>AI Studio Balance</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right' }}>Audit Status</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((vnd) => (
                    <tr key={vnd.id} style={{ borderBottom: '1px solid #F0E6D8' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700, color: '#2A2320' }}>{vnd.businessName}</div>
                        <div style={{ fontSize: '12px', color: '#8C8279' }}>Hub: {vnd.hubLocation}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ color: '#2A2320', fontWeight: 600 }}>{vnd.cacNumber}</div>
                        <div style={{ fontSize: '12px', color: '#8C8279' }}>TIN: {vnd.tinNumber}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ color: '#2A2320' }}>{vnd.bankAccount}</div>
                        <span style={{ fontSize: '11px', color: '#4F6B3A', backgroundColor: '#F0F6EE', padding: '2px 6px', borderRadius: '4px' }}>
                          NIBSS Name Match 100%
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <Badge
                          variant={
                            vnd.tier === 'Tier 1 Premier'
                              ? 'success'
                              : vnd.tier === 'Tier 2 Verified'
                              ? 'neutral'
                              : 'warning'
                          }
                        >
                          {vnd.tier}
                        </Badge>
                        <div style={{ fontSize: '11px', color: '#8C8279', marginTop: '4px' }}>
                          On-Time: <strong style={{ color: '#4F6B3A' }}>{vnd.onTimeRate}</strong>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 700, color: '#B5532E', fontSize: '12px' }}>
                            {vnd.aiCredits} Credits
                          </span>
                          <button
                            type="button"
                            onClick={() => handleGrantBonusCredits(vnd.id, 10)}
                            style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: '#FAF6F0',
                              border: '1px solid #E7D5BC',
                              fontSize: '10px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              color: '#2A2320',
                            }}
                          >
                            +10 Grant
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        {vnd.kycStatus === 'verified' ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#4F6B3A', fontWeight: 600, fontSize: '12px' }}>
                            <CheckCircle2 size={14} /> Accredited
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#D9A441', fontWeight: 600, fontSize: '12px' }}>
                            <AlertCircle size={14} /> Review Required
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: FINANCIAL LEDGER & SETTLEMENT EXPLORER            */}
        {/* ======================================================== */}
        {activeTab === 'ledger' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#2A2320', fontFamily: 'Fraunces, Georgia, serif' }}>
                  Financial Ledger & Settlement Audit Explorer
                </h2>
                <p style={{ margin: '4px 0 0', color: '#8C8279', fontSize: '13px' }}>
                  Double-entry balanced books, platform escrow protection accounts, and automated NIBSS disbursement batches.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button variant="secondary" size="sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Download size={13} /> Export Ledger (CSV)
                </Button>
                <Button variant="primary" size="sm" style={{ backgroundColor: '#B5532E', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RefreshCw size={13} /> Run Ledger Integrity Scan
                </Button>
              </div>
            </div>

            {/* 3 Metric Cards for Settlement */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E7D5BC', boxShadow: '0 2px 4px rgba(42, 35, 32, 0.04)' }}>
                <div style={{ fontSize: '11px', color: '#8C8279', fontWeight: 700, textTransform: 'uppercase' }}>
                  Total Platform Volume Processed
                </div>
                <div style={{ fontSize: '30px', fontWeight: 800, color: '#2A2320', margin: '6px 0', fontFamily: 'Fraunces, Georgia, serif' }}>
                  ₦18,450,000.00
                </div>
                <div style={{ fontSize: '12px', color: '#4F6B3A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={13} /> +14.2% Month-over-Month
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E7D5BC', boxShadow: '0 2px 4px rgba(42, 35, 32, 0.04)' }}>
                <div style={{ fontSize: '11px', color: '#8C8279', fontWeight: 700, textTransform: 'uppercase' }}>
                  Providus Escrow Vault Pool
                </div>
                <div style={{ fontSize: '30px', fontWeight: 800, color: '#B5532E', margin: '6px 0', fontFamily: 'Fraunces, Georgia, serif' }}>
                  ₦8,320,000.00
                </div>
                <div style={{ fontSize: '12px', color: '#8C8279' }}>
                  Merchant Escrow + Platform Commission Balance
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E7D5BC', boxShadow: '0 2px 4px rgba(42, 35, 32, 0.04)' }}>
                <div style={{ fontSize: '11px', color: '#8C8279', fontWeight: 700, textTransform: 'uppercase' }}>
                  Double-Entry Ledger Variance
                </div>
                <div style={{ fontSize: '30px', fontWeight: 800, color: '#4F6B3A', margin: '6px 0', fontFamily: 'Fraunces, Georgia, serif' }}>
                  ₦0.00
                </div>
                <div style={{ fontSize: '12px', color: '#4F6B3A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={13} /> Perfect Ledger Equilibrium (0 Variance)
                </div>
              </div>
            </div>

            {/* Recent journal entries table */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E7D5BC', overflow: 'hidden', boxShadow: '0 2px 4px rgba(42, 35, 32, 0.04)' }}>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #E7D5BC', backgroundColor: '#FAF6F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#2A2320', fontFamily: 'Fraunces, Georgia, serif' }}>
                  Audited Journal Transactions (Double-Entry Feed)
                </h4>
                <span style={{ fontSize: '11px', color: '#4F6B3A', fontWeight: 600 }}>Cryptographic Hash Chained</span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E7D5BC', color: '#8C8279', fontSize: '11px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '10px 16px' }}>Tx Hash / Ref</th>
                    <th style={{ padding: '10px 16px' }}>Description</th>
                    <th style={{ padding: '10px 16px' }}>Debit Account</th>
                    <th style={{ padding: '10px 16px' }}>Credit Account</th>
                    <th style={{ padding: '10px 16px', textAlign: 'right' }}>Amount (NGN)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #F0E6D8' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#B5532E' }}>tx-9018-escrow-hold</td>
                    <td style={{ padding: '12px 16px', color: '#2A2320' }}>Order #MNG-2611-48K2F Checkout Payment</td>
                    <td style={{ padding: '12px 16px', color: '#8C8279' }}>1010 Providus Operating Pool</td>
                    <td style={{ padding: '12px 16px', color: '#8C8279' }}>2020 Buyer Escrow Sub-ledger</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#4F6B3A' }}>₦450,000.00</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #F0E6D8' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#B5532E' }}>tx-9017-escrow-disburse</td>
                    <td style={{ padding: '12px 16px', color: '#2A2320' }}>Order #MNG-2611-77Z1D Delivery Confirmed</td>
                    <td style={{ padding: '12px 16px', color: '#8C8279' }}>2020 Buyer Escrow Sub-ledger</td>
                    <td style={{ padding: '12px 16px', color: '#8C8279' }}>2030 Merchant Payable (Apex)</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#4F6B3A' }}>₦890,000.00</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #F0E6D8' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#B5532E' }}>tx-9016-fee-recognize</td>
                    <td style={{ padding: '12px 16px', color: '#2A2320' }}>Platform Take Rate (15% Commission)</td>
                    <td style={{ padding: '12px 16px', color: '#8C8279' }}>2030 Merchant Payable (Apex)</td>
                    <td style={{ padding: '12px 16px', color: '#8C8279' }}>4010 Marketplace Fee Revenue</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#2A2320' }}>₦133,500.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: SYSTEM RECOVERY & REPAIR TOOLS                    */}
        {/* ======================================================== */}
        {activeTab === 'repairs' && <RepairTools />}
      </main>
    </div>
  );
}
