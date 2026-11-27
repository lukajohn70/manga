import * as React from 'react';
import { AuthClient, calculateTotpCode } from '@manga/api-client';
import {
  DollarSign,
  TrendingUp,
  Package,
  Building2,
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

import { VendorSidebar, VendorTab, NokTriangleIcon } from './components/VendorSidebar.js';
import { VendorHeader } from './components/VendorHeader.js';
import { StoreOverview } from './components/StoreOverview.js';
import { ProductCatalog, VendorProduct } from './components/ProductCatalog.js';
import { OrdersQueueView, VendorOrderItem } from './components/OrdersQueueView.js';
import { InventoryManager, InventoryItem } from './components/InventoryManager.js';
import { PayoutsWallet } from './components/PayoutsWallet.js';
import { StoreSettings } from './components/StoreSettings.js';
import { VendorAuthScreen } from './components/VendorAuthScreen.js';
import { BarcodeScannerModal } from './components/BarcodeScannerModal.js';
import { ShippingLabelModal } from './components/ShippingLabelModal.js';

export function App() {
  const authClient = React.useMemo(() => new AuthClient('http://localhost:3003'), []);

  // Theme state
  const [theme, setTheme] = React.useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('manga_vendor_theme');
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('manga_vendor_theme', theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Sidebar collapse
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState<boolean>(false);

  // Store name state
  const [storeName, setStoreName] = React.useState<string>('Apex Electronics Ltd');

  // Vendor session state
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

  // Auth form states
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

  // Active navigation tab
  const [activeTab, setActiveTab] = React.useState<VendorTab>('overview');

  // Product Add Modal
  const [isAddProductModalOpen, setIsAddProductModalOpen] = React.useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = React.useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Products State
  const [products, setProducts] = React.useState<VendorProduct[]>([
    {
      id: 'prod-1',
      sku: 'SONY-WH1000-BLK',
      title: 'Sony WH-1000XM5 Wireless ANC Headphones (Black)',
      category: 'Audio & Acoustics',
      priceNgn: 450000,
      compareAtPriceNgn: 520000,
      stock: 14,
      lowStockThreshold: 3,
      isActive: true,
      salesCount: 12,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80',
      createdAt: '2026-11-01',
    },
    {
      id: 'prod-2',
      sku: 'LOGI-MX3S-GRY',
      title: 'Logitech MX Master 3S Ergonomic Wireless Mouse',
      category: 'Computer Peripherals',
      priceNgn: 135000,
      compareAtPriceNgn: 160000,
      stock: 28,
      lowStockThreshold: 5,
      isActive: true,
      salesCount: 19,
      imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=200&auto=format&fit=crop&q=80',
      createdAt: '2026-11-05',
    },
    {
      id: 'prod-3',
      sku: 'APPL-IPAD-M2-128',
      title: 'Apple iPad Air 11-inch M2 Wi-Fi 128GB Space Gray',
      category: 'Tablets & Slate Devices',
      priceNgn: 890000,
      compareAtPriceNgn: 950000,
      stock: 2,
      lowStockThreshold: 3,
      isActive: true,
      salesCount: 8,
      imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&auto=format&fit=crop&q=80',
      createdAt: '2026-11-10',
    },
    {
      id: 'prod-4',
      sku: 'ANKR-737-24K',
      title: 'Anker 737 Power Bank (PowerCore 24K 140W)',
      category: 'Power & Charging Accessories',
      priceNgn: 145000,
      compareAtPriceNgn: 175000,
      stock: 19,
      lowStockThreshold: 4,
      isActive: true,
      salesCount: 11,
      imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200&auto=format&fit=crop&q=80',
      createdAt: '2026-11-15',
    },
    {
      id: 'prod-5',
      sku: 'DELL-U2723QE',
      title: 'Dell UltraSharp 27" 4K USB-C Hub Monitor (U2723QE)',
      category: 'Displays & Monitors',
      priceNgn: 320000,
      compareAtPriceNgn: 380000,
      stock: 6,
      lowStockThreshold: 2,
      isActive: true,
      salesCount: 6,
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&auto=format&fit=crop&q=80',
      createdAt: '2026-11-20',
    },
  ]);

  const handleAddProduct = (newProd: Omit<VendorProduct, 'id' | 'salesCount' | 'createdAt'>) => {
    const item: VendorProduct = {
      ...newProd,
      id: `prod-${Date.now()}`,
      salesCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProducts((prev) => [item, ...prev]);
    showToast(`Added "${newProd.title}" to store catalog!`, 'success');
  };

  const handleUpdateProduct = (id: string, updates: Partial<VendorProduct>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    showToast('Product updated successfully.', 'info');
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed from catalog.', 'info');
  };

  // Orders State
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
      shipDeadline: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      recipientAddress: {
        recipientName: 'Tunde Bakare',
        phone: '+234 802 233 4455',
        streetAddress: 'Barnawa Shopping Complex Suite 12',
        city: 'Kaduna',
        stateOrProvince: 'Kaduna State',
      },
      trackingNumber: 'TRK-981240-EXP',
      weightG: 462,
    },
    {
      id: 'sg-4',
      orderNumber: 'MNG-2611-90E3A',
      shipmentGroupId: 'sg-4',
      status: 'ready_to_ship',
      itemTitle: 'Anker 737 Power Bank (PowerCore 24K 140W)',
      sku: 'ANKR-737-24K',
      qty: 1,
      priceNgn: 145000,
      acceptDeadline: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      shipDeadline: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      recipientAddress: {
        recipientName: 'Ngozi Eze',
        phone: '+234 818 445 9900',
        streetAddress: '8 Olu Obasanjo Road',
        city: 'Port Harcourt',
        stateOrProvince: 'Rivers State',
      },
      trackingNumber: 'TRK-981241-EXP',
      weightG: 630,
    },
    {
      id: 'sg-5',
      orderNumber: 'MNG-2611-33X8P',
      shipmentGroupId: 'sg-5',
      status: 'packing',
      itemTitle: 'Dell UltraSharp 27" 4K USB-C Hub Monitor (U2723QE)',
      sku: 'DELL-U2723QE',
      qty: 1,
      priceNgn: 320000,
      acceptDeadline: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
      shipDeadline: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
      recipientAddress: {
        recipientName: 'Ibrahim Danladi',
        phone: '+234 805 771 2233',
        streetAddress: '4 Bompai Road, Nassarawa GRA',
        city: 'Kano',
        stateOrProvince: 'Kano State',
      },
    },
  ]);

  // Inventory list derived or managed
  const inventoryItems: InventoryItem[] = products.map((p) => ({
    sku: p.sku,
    name: p.title,
    category: p.category,
    stockAvailable: p.stock,
    stockReserved: 1,
    unitPriceNgn: p.priceNgn,
    lowStockThreshold: p.lowStockThreshold,
  }));

  // Modals state
  const [scanningOrder, setScanningOrder] = React.useState<VendorOrderItem | null>(null);
  const [labelOrder, setLabelOrder] = React.useState<VendorOrderItem | null>(null);

  // Accept Order Handler
  const handleAcceptOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'accepted' } : o))
    );
    showToast('Customer order accepted! Preparing shipment packing.', 'success');
  };

  // Barcode Scan Completion Handler
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
    setLabelOrder(updated);
    showToast(`Order packed and weighed (${weightG}g)! Ready to print shipping label.`, 'success');
  };

  const handleVendorLogout = () => {
    setVendorSession(null);
    try {
      localStorage.removeItem('manga_vendor_session');
    } catch {}
    showToast('Signed out of Merchant Console.', 'info');
  };

  const handleVendorLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const pass = loginPassword || 'VendorPass123!';
      const res = await authClient.login(loginEmail, pass, 'VENDOR');

      if ('require2fa' in res && res.require2fa) {
        setChallengeToken(res.challengeToken || null);
        if (res.totpSecret) setTotpSecret(res.totpSecret);
        if (res.testOtp) setTestOtp(res.testOtp);
        setAuthStep('2fa');
      } else if ('token' in res) {
        const session = {
          email: res.user.email,
          storeName: storeName,
          role: 'VENDOR' as const,
          token: String((res as any).token),
        };
        setVendorSession(session);
        try {
          localStorage.setItem('manga_vendor_session', JSON.stringify(session));
        } catch {}
      }
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
        storeName: storeName,
        role: 'VENDOR' as const,
        token: res.token,
      };
      setVendorSession(session);
      setAuthStep('credentials');
      try {
        localStorage.setItem('manga_vendor_session', JSON.stringify(session));
      } catch {}
    } catch (err: any) {
      setAuthError(err.message || 'Invalid 2FA verification code.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Keyboard shortcut listener for Sidebar toggle (⌘B)
  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setSidebarCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const totalSalesNgn = orders.reduce((acc, curr) => acc + curr.priceNgn, 0);
  const lowStockCount = products.filter((p) => p.stock <= p.lowStockThreshold).length;
  const newOrdersCount = orders.filter((o) => o.status === 'pending_vendor_accept').length;

  // Login view when unauthenticated
  if (!vendorSession) {
    return (
      <VendorAuthScreen
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        authStep={authStep}
        setAuthStep={setAuthStep}
        twoFaMethod={twoFaMethod}
        setTwoFaMethod={setTwoFaMethod}
        twoFaCode={twoFaCode}
        setTwoFaCode={setTwoFaCode}
        authError={authError}
        authLoading={authLoading}
        onSubmitLogin={handleVendorLoginSubmit}
        onSubmit2fa={handleVendorVerify2faSubmit}
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
          }}
        >
          <CheckCircle2 size={16} />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Studio Collapsible Sidebar (Solvik & Kovra Style) */}
      <VendorSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        newOrdersCount={newOrdersCount}
        productsCount={products.length}
        lowStockCount={lowStockCount}
        storeName={storeName}
        vendorEmail={vendorSession.email}
        onLogout={handleVendorLogout}
      />

      {/* Main Container */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        
        {/* Sticky Breadcrumb Header */}
        <VendorHeader
          activeTab={activeTab}
          storeName={storeName}
          theme={theme}
          onToggleTheme={toggleTheme}
          onRefresh={() => showToast('Store orders & catalog synced with Manga network.', 'info')}
        />

        {/* Content Body */}
        <main style={{ flex: 1, padding: '24px 28px', maxWidth: '1600px', width: '100%', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* TAB CONTENT */}
            {activeTab === 'overview' && (
              <StoreOverview
                storeName={storeName}
                totalSalesNgn={totalSalesNgn}
                orders={orders}
                productsCount={products.length}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onAddNewProduct={() => {
                  setActiveTab('products');
                  setIsAddProductModalOpen(true);
                }}
              />
            )}

            {activeTab === 'products' && (
              <ProductCatalog
                products={products}
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
                isAddModalOpen={isAddProductModalOpen}
                setIsAddModalOpen={setIsAddProductModalOpen}
              />
            )}

            {activeTab === 'orders' && (
              <OrdersQueueView
                orders={orders}
                activeFilter="all"
                onFilterChange={() => {}}
                onAcceptOrder={handleAcceptOrder}
                onOpenScanner={(ord) => setScanningOrder(ord)}
                onOpenLabel={(ord) => setLabelOrder(ord)}
              />
            )}

            {activeTab === 'inventory' && (
              <InventoryManager inventory={inventoryItems} onShowToast={showToast} />
            )}

            {activeTab === 'payouts' && (
              <PayoutsWallet onShowToast={showToast} />
            )}

            {activeTab === 'store_settings' && (
              <StoreSettings
                storeName={storeName}
                onUpdateStoreName={setStoreName}
                showToast={showToast}
              />
            )}

          </div>
        </main>
      </div>

      {/* Barcode Scanner Modal */}
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

      {/* Printable Shipping Label Modal */}
      {labelOrder && (
        <ShippingLabelModal
          isOpen={true}
          trackingNumber={labelOrder.trackingNumber || 'TRK-981240-EXP'}
          orderNumber={labelOrder.orderNumber}
          carrierName="Manga Marketsquare Express Fleet"
          weightG={labelOrder.weightG || 650}
          recipientAddress={labelOrder.recipientAddress}
          onClose={() => setLabelOrder(null)}
        />
      )}

    </div>
  );
}
