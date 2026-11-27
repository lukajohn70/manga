import * as React from 'react';
import { AuthClient, calculateTotpCode, DEMO_CREDENTIALS } from '@manga/api-client';
import {
  DollarSign,
  TrendingUp,
  Package,
  Building2,
  ShieldCheck,
  Truck,
  Ticket,
  ExternalLink,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  RefreshCw,
  Eye,
} from 'lucide-react';

import { AdminSidebar, AdminTab, NokTriangleIcon } from './components/AdminSidebar.js';
import { AdminHeader } from './components/AdminHeader.js';
import { CommandPalette } from './components/CommandPalette.js';
import { KpiCard } from './components/KpiCard.js';
import { SplineAreaChart } from './components/SplineAreaChart.js';
import { OrdersManager } from './components/OrdersManager.js';
import { AdminOrder } from './components/OrderDrawer.js';
import { CouponManager, PlatformCoupon } from './components/CouponManager.js';
import { VendorRegistry, VendorAccreditation } from './components/VendorRegistry.js';
import { LedgerExplorer } from './components/LedgerExplorer.js';
import { DisputeCenter } from './components/DisputeCenter.js';
import { RepairTools } from './components/RepairTools.js';
import { AdminAuthScreen } from './components/AdminAuthScreen.js';

export function App() {
  const authClient = React.useMemo(() => new AuthClient('http://localhost:3003'), []);

  // Theme state: dark (Obsidian Bento) vs light (Warm Clay)
  const [theme, setTheme] = React.useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('manga_admin_theme');
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('manga_admin_theme', theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Sidebar collapse state
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState<boolean>(false);

  // Command palette modal state (⌘K)
  const [commandPaletteOpen, setCommandPaletteOpen] = React.useState<boolean>(false);

  // Session state
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

  // Auth form states
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

  // Active navigation tab
  const [activeTab, setActiveTab] = React.useState<AdminTab>('overview');

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

  const handleUpdateOrderStatus = (orderId: string, newStatus: AdminOrder['trackingStatus']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, trackingStatus: newStatus } : o))
    );
    const target = orders.find((o) => o.id === orderId);
    showToast(
      `Order ${target?.orderRef || orderId} advanced to ${newStatus.toUpperCase()}. Notification pushed to merchant and customer.`,
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

  const handleCreateCoupon = (coupon: Omit<PlatformCoupon, 'id' | 'redemptions'>) => {
    const newCoupon: PlatformCoupon = {
      ...coupon,
      id: `cpn-${Date.now()}`,
      redemptions: 0,
    };
    setCoupons([newCoupon, ...coupons]);
  };

  const handleToggleCoupon = (couponId: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === couponId ? { ...c, isActive: !c.isActive } : c))
    );
    const target = coupons.find((c) => c.id === couponId);
    showToast(
      `Coupon ${target?.code} is now ${!target?.isActive ? 'ACTIVE' : 'DISABLED'}.`,
      'info'
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
    const target = vendors.find((v) => v.id === vendorId);
    showToast(`Granted +${amount} AI Studio Credits to ${target?.businessName}.`, 'success');
  };

  const handleAdminLogout = () => {
    setAdminSession(null);
    try {
      localStorage.removeItem('manga_admin_session');
    } catch {}
    showToast('Signed out of Administrator Console.', 'info');
  };

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminAuthError(null);
    setAuthLoading(true);

    try {
      const pass = adminPassword || 'AdminPass123!';
      const res = await authClient.login(adminEmail, pass, 'ADMIN');

      if ('require2fa' in res && res.require2fa) {
        setChallengeToken(res.challengeToken || null);
        if (res.totpSecret) setTotpSecret(res.totpSecret);
        if (res.testOtp) setTestOtp(res.testOtp);
        setAuthStep('2fa');
      } else if ('token' in res) {
        const session = {
          email: res.user.email,
          role: 'ADMIN' as const,
          operatorName: res.user.name,
          token: String((res as any).token),
        };
        setAdminSession(session);
        try {
          localStorage.setItem('manga_admin_session', JSON.stringify(session));
        } catch {}
      }
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

  // Keyboard shortcut listener for Command Palette (⌘K) and Sidebar toggle (⌘B)
  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setSidebarCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Login view when unauthenticated
  if (!adminSession) {
    return (
      <AdminAuthScreen
        loginEmail={adminEmail}
        setLoginEmail={setAdminEmail}
        loginPassword={adminPassword}
        setLoginPassword={setAdminPassword}
        authStep={authStep}
        setAuthStep={setAuthStep}
        twoFaMethod={twoFaMethod}
        setTwoFaMethod={setTwoFaMethod}
        twoFaCode={twoFaCode}
        setTwoFaCode={setTwoFaCode}
        authError={adminAuthError}
        authLoading={authLoading}
        onSubmitLogin={handleAdminLoginSubmit}
        onSubmit2fa={handleAdminVerify2faSubmit}
        totpSecret={totpSecret}
        testOtp={testOtp}
        calculateTotpCode={calculateTotpCode}
        showToast={showToast}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--bg-app)' }}>
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          className={`status-pill ${toastMessage.type === 'success' ? 'good' : toastMessage.type === 'error' ? 'bad' : 'info'}`}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            padding: '12px 18px',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-lg)',
            fontSize: '12.5px',
            fontWeight: 700,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'slideUpFade 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <CheckCircle2 size={16} />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Studio Collapsible Sidebar (Kovra Style) */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        ordersCount={orders.length}
        disputesCount={1}
        merchantsCount={vendors.length}
        couponsCount={coupons.length}
        operatorEmail={adminSession.email}
        onLogout={handleAdminLogout}
      />

      {/* Main Container */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        
        {/* Sticky Breadcrumb Header (Kovra Style) */}
        <AdminHeader
          activeTab={activeTab}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
          onRefresh={() => showToast('Platform metrics refreshed & verified with Providus Escrow pool.', 'info')}
        />

        {/* Content Body */}
        <main style={{ flex: 1, padding: '24px 28px', maxWidth: '1600px', width: '100%', margin: '0 auto' }}>
          
          {/* TAB 1: OVERVIEW CONTROL TOWER */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Control Tower Headline */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '14px',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '3px 10px',
                      borderRadius: '999px',
                      backgroundColor: 'var(--accent-primary-glow)',
                      border: '1px solid var(--border-accent)',
                      color: 'var(--accent-primary)',
                      fontSize: '11px',
                      fontWeight: 700,
                      marginBottom: '6px',
                    }}
                  >
                    <ShieldCheck size={12} color="var(--accent-primary)" />
                    <span>MANGA Central Control Tower & Settlement Governance</span>
                  </div>
                  <h1
                    style={{
                      margin: 0,
                      fontSize: '26px',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      fontFamily: 'Fraunces, Georgia, serif',
                      letterSpacing: '-0.025em',
                      lineHeight: 1.15,
                    }}
                  >
                    Platform Governance, GMV Velocity & Courier Operations
                  </h1>
                  <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                    Live double-entry escrow settlement, multi-carrier dispatch progression, and merchant CAC accreditation.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <div className="status-pill good" style={{ padding: '6px 12px', fontSize: '11.5px' }}>
                    <span>Providus Escrow Active</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast('Syncing state across worker nodes...', 'info')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: 'var(--bg-card)',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-line)',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                    }}
                  >
                    <RefreshCw size={13} color="var(--text-muted)" />
                    <span>Auto-sync: 30s</span>
                  </button>
                </div>
              </div>

              {/* 4 Executive KPI Cards (Solvik & Kovra Style) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <KpiCard
                  title="Gross Merchandise (GMV)"
                  value="₦18,450,000"
                  subtitle="Paystack & Providus settled"
                  trendText="+14.2% vs last week"
                  trendType="good"
                  icon={DollarSign}
                  isHero={true}
                  sparklineData={[12, 14, 13, 16, 18, 17, 21]}
                />

                <KpiCard
                  title="Take-Rate Commission (15%)"
                  value="₦2,767,500"
                  subtitle="Platform Net Operating Margin"
                  trendText="+18.4% MoM"
                  trendType="good"
                  icon={TrendingUp}
                  iconBg="var(--status-good-bg)"
                  iconColor="var(--status-good)"
                  sparklineData={[4, 5, 5.5, 6.2, 7, 7.8, 8.5]}
                />

                <KpiCard
                  title="Total Orders Processed"
                  value="1,284"
                  subtitle="1,042 Physical • 242 Digital"
                  trendText="+9.8% volume"
                  trendType="good"
                  icon={Package}
                  iconBg="var(--status-info-bg)"
                  iconColor="var(--status-info)"
                  sparklineData={[80, 85, 92, 90, 105, 115, 128]}
                />

                <KpiCard
                  title="Accredited Merchants"
                  value={String(vendors.length)}
                  subtitle="100% CAC Audited & Verified"
                  trendText="4 Pending Review"
                  trendType="neutral"
                  icon={Building2}
                  iconBg="var(--accent-gold-soft)"
                  iconColor="var(--accent-gold)"
                  sparklineData={[36, 40, 42, 44, 46, 47, 48]}
                />
              </div>

              {/* 12-Column Bento Grid: Spline Area Chart (8-col) + Operations Panel (4-col) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
                
                {/* 8-col Spline Chart */}
                <div style={{ gridColumn: 'span 2' }}>
                  <SplineAreaChart />
                </div>

                {/* 4-col Operations & Delivery Metrics Panel */}
                <div className="admin-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Fraunces, Georgia, serif' }}>
                      Marketplace Trust & SLA Breakdown
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>On-Time Courier Dispatch</span>
                          <strong className="tabular-nums" style={{ color: 'var(--status-good)' }}>98.4%</strong>
                        </div>
                        <div style={{ height: '6px', borderRadius: '999px', backgroundColor: 'var(--border-line)', overflow: 'hidden' }}>
                          <div style={{ width: '98.4%', height: '100%', backgroundColor: 'var(--status-good)', borderRadius: '999px' }} />
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Escrow In-Flight Protection</span>
                          <strong className="tabular-nums" style={{ color: 'var(--accent-primary)' }}>₦8,320,000</strong>
                        </div>
                        <div style={{ height: '6px', borderRadius: '999px', backgroundColor: 'var(--border-line)', overflow: 'hidden' }}>
                          <div style={{ width: '75%', height: '100%', backgroundColor: 'var(--accent-primary)', borderRadius: '999px' }} />
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Merchant Dispute Rate</span>
                          <strong className="tabular-nums" style={{ color: 'var(--status-good)' }}>0.4% (Below 1% target)</strong>
                        </div>
                        <div style={{ height: '6px', borderRadius: '999px', backgroundColor: 'var(--border-line)', overflow: 'hidden' }}>
                          <div style={{ width: '4%', height: '100%', backgroundColor: 'var(--status-good)', borderRadius: '999px' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-line-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Providus Bank Liquidity</span>
                      <span className="status-pill good" style={{ fontSize: '10px' }}>Balanced</span>
                    </div>
                    <div className="tabular-nums" style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                      ₦42,190,450.00
                    </div>
                  </div>
                </div>

              </div>

              {/* Recent Orders Preview Card */}
              <div className="admin-card" style={{ padding: '20px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '14px',
                    paddingBottom: '10px',
                    borderBottom: '1px solid var(--border-line)',
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Fraunces, Georgia, serif' }}>
                      Live Courier Dispatches & Shipments
                    </h3>
                    <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      Latest customer orders currently routed through regional hubs.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--accent-primary)',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <span>View all {orders.length} orders</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order Ref</th>
                        <th>Customer & Route</th>
                        <th>Merchant</th>
                        <th>Items & Total</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 4).map((ord) => (
                        <tr key={ord.id}>
                          <td>
                            <span className="tabular-nums" style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent-primary)' }}>
                              {ord.orderRef}
                            </span>
                            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{ord.createdAt}</div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{ord.customerName}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{ord.destinationState}</div>
                          </td>
                          <td>
                            <div style={{ color: 'var(--text-primary)' }}>{ord.vendorStore}</div>
                            <div style={{ fontSize: '10.5px', color: 'var(--status-info)' }}>{ord.courier}</div>
                          </td>
                          <td>
                            <div className="tabular-nums" style={{ fontWeight: 800 }}>₦{ord.totalNgn.toLocaleString()}</div>
                            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {ord.itemSummary}
                            </div>
                          </td>
                          <td>
                            <span className={`status-pill ${ord.trackingStatus === 'delivered' ? 'good' : 'info'}`}>
                              {ord.trackingStatus}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              type="button"
                              onClick={() => setActiveTab('orders')}
                              style={{
                                padding: '4px 8px',
                                borderRadius: '6px',
                                border: '1px solid var(--border-line)',
                                backgroundColor: 'var(--bg-well)',
                                color: 'var(--text-primary)',
                                fontSize: '11px',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              Manage →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: COURIER & ORDERS */}
          {activeTab === 'orders' && (
            <OrdersManager
              orders={orders}
              onUpdateStatus={handleUpdateOrderStatus}
              onShowToast={showToast}
            />
          )}

          {/* TAB 3: DISPUTE ADJUDICATION CENTER */}
          {activeTab === 'disputes' && <DisputeCenter />}

          {/* TAB 4: MERCHANT ACCREDITATION REGISTRY */}
          {activeTab === 'vendors' && (
            <VendorRegistry
              vendors={vendors}
              onGrantCredits={handleGrantBonusCredits}
              onShowToast={showToast}
            />
          )}

          {/* TAB 5: FINANCIAL LEDGER & SETTLEMENT EXPLORER */}
          {activeTab === 'ledger' && <LedgerExplorer onShowToast={showToast} />}

          {/* TAB 6: PROMOS & COUPONS */}
          {activeTab === 'coupons' && (
            <CouponManager
              coupons={coupons}
              onCreateCoupon={handleCreateCoupon}
              onToggleCoupon={handleToggleCoupon}
              onShowToast={showToast}
            />
          )}

          {/* TAB 7: PLATFORM DIAGNOSTICS & REPAIRS */}
          {activeTab === 'repairs' && <RepairTools />}

        </main>
      </div>

      {/* Global Command Palette Modal (⌘K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setCommandPaletteOpen(false);
        }}
      />
    </div>
  );
}
