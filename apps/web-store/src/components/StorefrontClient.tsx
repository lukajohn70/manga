'use client';

import * as React from 'react';
import { Button, Badge } from '@manga/ui';

export interface ProductListing {
  id: string;
  title: string;
  category: string;
  brand: string;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  winningOffer: {
    vendorId: string;
    vendorName: string;
    vendorTier: 'gold' | 'silver' | 'bronze';
    priceMinor: bigint;
    priceFormatted: string;
    originalPriceFormatted: string;
    discountPercent: number;
    dispatchHours: number;
    shippingCarrier: string;
    stockAvailable: number;
  };
  otherOffersCount: number;
  allOffers: Array<{
    vendorId: string;
    vendorName: string;
    vendorTier: 'gold' | 'silver' | 'bronze';
    priceMinor: bigint;
    priceFormatted: string;
    dispatchHours: number;
    fulfillmentScorePercent: number;
  }>;
}

export interface CartItem {
  productId: string;
  title: string;
  imageUrl: string;
  vendorId: string;
  vendorName: string;
  priceMinor: bigint;
  priceFormatted: string;
  quantity: number;
}

export const SAMPLE_PRODUCTS: ProductListing[] = [
  {
    id: 'prod-001',
    title: 'Apple iPhone 15 Pro Max 256GB - Natural Titanium',
    category: 'electronics',
    brand: 'Apple',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 312,
    winningOffer: {
      vendorId: 'ven-slot',
      vendorName: 'Slot Systems Direct',
      vendorTier: 'gold',
      priceMinor: 165000000n,
      priceFormatted: '₦1,650,000.00',
      originalPriceFormatted: '₦1,850,000.00',
      discountPercent: 11,
      dispatchHours: 24,
      shippingCarrier: 'GIG Logistics',
      stockAvailable: 14,
    },
    otherOffersCount: 3,
    allOffers: [
      { vendorId: 'ven-slot', vendorName: 'Slot Systems Direct', vendorTier: 'gold', priceMinor: 165000000n, priceFormatted: '₦1,650,000.00', dispatchHours: 24, fulfillmentScorePercent: 99 },
      { vendorId: 'ven-apex', vendorName: 'Apex Electronics Ltd', vendorTier: 'gold', priceMinor: 167500000n, priceFormatted: '₦1,675,000.00', dispatchHours: 24, fulfillmentScorePercent: 98 },
      { vendorId: 'ven-alaba', vendorName: 'Alaba Gadgets Hub', vendorTier: 'silver', priceMinor: 164000000n, priceFormatted: '₦1,640,000.00', dispatchHours: 48, fulfillmentScorePercent: 94 },
    ],
  },
  {
    id: 'prod-002',
    title: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones - Black',
    category: 'electronics',
    brand: 'Sony',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewsCount: 184,
    winningOffer: {
      vendorId: 'ven-apex',
      vendorName: 'Apex Electronics Ltd',
      vendorTier: 'gold',
      priceMinor: 48500000n,
      priceFormatted: '₦485,000.00',
      originalPriceFormatted: '₦550,000.00',
      discountPercent: 12,
      dispatchHours: 24,
      shippingCarrier: 'Red Star Express',
      stockAvailable: 8,
    },
    otherOffersCount: 2,
    allOffers: [
      { vendorId: 'ven-apex', vendorName: 'Apex Electronics Ltd', vendorTier: 'gold', priceMinor: 48500000n, priceFormatted: '₦485,000.00', dispatchHours: 24, fulfillmentScorePercent: 98 },
      { vendorId: 'ven-slot', vendorName: 'Slot Systems Direct', vendorTier: 'gold', priceMinor: 49500000n, priceFormatted: '₦495,000.00', dispatchHours: 24, fulfillmentScorePercent: 99 },
    ],
  },
  {
    id: 'prod-003',
    title: 'AfroThreads Hand-Woven Aso-Oke Agbada Set (Royal Indigo)',
    category: 'fashion',
    brand: 'AfroThreads',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 96,
    winningOffer: {
      vendorId: 'ven-afro',
      vendorName: 'AfroThreads Couture',
      vendorTier: 'gold',
      priceMinor: 12000000n,
      priceFormatted: '₦120,000.00',
      originalPriceFormatted: '₦150,000.00',
      discountPercent: 20,
      dispatchHours: 48,
      shippingCarrier: 'Fez Delivery',
      stockAvailable: 5,
    },
    otherOffersCount: 1,
    allOffers: [
      { vendorId: 'ven-afro', vendorName: 'AfroThreads Couture', vendorTier: 'gold', priceMinor: 12000000n, priceFormatted: '₦120,000.00', dispatchHours: 48, fulfillmentScorePercent: 97 },
    ],
  },
  {
    id: 'prod-004',
    title: 'Logitech MX Master 3S Ergonomic Bluetooth Mouse - Graphite',
    category: 'electronics',
    brand: 'Logitech',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 240,
    winningOffer: {
      vendorId: 'ven-slot',
      vendorName: 'Slot Systems Direct',
      vendorTier: 'gold',
      priceMinor: 14500000n,
      priceFormatted: '₦145,000.00',
      originalPriceFormatted: '₦165,000.00',
      discountPercent: 12,
      dispatchHours: 24,
      shippingCarrier: 'GIG Logistics',
      stockAvailable: 22,
    },
    otherOffersCount: 2,
    allOffers: [
      { vendorId: 'ven-slot', vendorName: 'Slot Systems Direct', vendorTier: 'gold', priceMinor: 14500000n, priceFormatted: '₦145,000.00', dispatchHours: 24, fulfillmentScorePercent: 99 },
      { vendorId: 'ven-apex', vendorName: 'Apex Electronics Ltd', vendorTier: 'gold', priceMinor: 14800000n, priceFormatted: '₦148,000.00', dispatchHours: 24, fulfillmentScorePercent: 98 },
    ],
  },
  {
    id: 'prod-005',
    title: 'Olori Botanicals Pure African Raw Shea Butter & Glow Serum',
    category: 'beauty',
    brand: 'Olori',
    imageUrl: 'https://images.unsplash.com/photo-1608248597359-57321a5eb23b?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviewsCount: 88,
    winningOffer: {
      vendorId: 'ven-olori',
      vendorName: 'Olori Botanicals',
      vendorTier: 'gold',
      priceMinor: 2200000n,
      priceFormatted: '₦22,000.00',
      originalPriceFormatted: '₦28,000.00',
      discountPercent: 21,
      dispatchHours: 24,
      shippingCarrier: 'GIG Logistics',
      stockAvailable: 45,
    },
    otherOffersCount: 1,
    allOffers: [
      { vendorId: 'ven-olori', vendorName: 'Olori Botanicals', vendorTier: 'gold', priceMinor: 2200000n, priceFormatted: '₦22,000.00', dispatchHours: 24, fulfillmentScorePercent: 96 },
    ],
  },
  {
    id: 'prod-006',
    title: 'SuperMart Bulk Premium Basmati Rice (25kg Bag)',
    category: 'groceries',
    brand: 'SuperMart',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewsCount: 165,
    winningOffer: {
      vendorId: 'ven-supermart',
      vendorName: 'SuperMart Direct Fresh',
      vendorTier: 'gold',
      priceMinor: 7500000n,
      priceFormatted: '₦75,000.00',
      originalPriceFormatted: '₦88,000.00',
      discountPercent: 15,
      dispatchHours: 12,
      shippingCarrier: 'SuperMart Logistics',
      stockAvailable: 60,
    },
    otherOffersCount: 1,
    allOffers: [
      { vendorId: 'ven-supermart', vendorName: 'SuperMart Direct Fresh', vendorTier: 'gold', priceMinor: 7500000n, priceFormatted: '₦75,000.00', dispatchHours: 12, fulfillmentScorePercent: 99 },
    ],
  },
];

export const StorefrontClient: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [location, setLocation] = React.useState<string>('Lagos (Ikeja & Island)');
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = React.useState<ProductListing | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState<boolean>(false);
  const [orderConfirmed, setOrderConfirmed] = React.useState<any | null>(null);
  const [paymentMethod, setPaymentMethod] = React.useState<'card' | 'bank_transfer'>('card');
  const [isProcessingCheckout, setIsProcessingCheckout] = React.useState<boolean>(false);

  // Filter products
  const filteredProducts = SAMPLE_PRODUCTS.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Cart operations
  const addToCart = (product: ProductListing, offerIndex = 0) => {
    const chosenOffer = product.allOffers[offerIndex] || product.winningOffer;
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.productId === product.id && item.vendorId === chosenOffer.vendorId
      );
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id && item.vendorId === chosenOffer.vendorId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          title: product.title,
          imageUrl: product.imageUrl,
          vendorId: chosenOffer.vendorId,
          vendorName: chosenOffer.vendorName,
          priceMinor: chosenOffer.priceMinor,
          priceFormatted: chosenOffer.priceFormatted,
          quantity: 1,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, vendorId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId && item.vendorId === vendorId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Group cart items by Vendor Shipment Group (§6.1, §7.1)
  const groupedShipmentGroups = React.useMemo(() => {
    const groups: Record<string, { vendorName: string; items: CartItem[]; subtotalMinor: bigint }> = {};
    for (const item of cart) {
      if (!groups[item.vendorId]) {
        groups[item.vendorId] = {
          vendorName: item.vendorName,
          items: [],
          subtotalMinor: 0n,
        };
      }
      groups[item.vendorId].items.push(item);
      groups[item.vendorId].subtotalMinor += item.priceMinor * BigInt(item.quantity);
    }
    return groups;
  }, [cart]);

  // Financial calculations
  const cartSubtotalMinor = React.useMemo(() => {
    return cart.reduce((sum, item) => sum + item.priceMinor * BigInt(item.quantity), 0n);
  }, [cart]);

  const vatMinor = (cartSubtotalMinor * 75n) / 1000n; // 7.5% statutory VAT
  const shippingFeeMinor = Object.keys(groupedShipmentGroups).length > 0 ? BigInt(Object.keys(groupedShipmentGroups).length) * 250000n : 0n; // ₦2,500 per shipment group
  const grandTotalMinor = cartSubtotalMinor + vatMinor + shippingFeeMinor;

  const formatNaira = (minor: bigint) => {
    const major = Number(minor) / 100;
    return `₦${major.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleExecuteCheckout = () => {
    setIsProcessingCheckout(true);
    setTimeout(() => {
      setIsProcessingCheckout(false);
      setOrderConfirmed({
        orderNumber: `MNG-2611-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        placedAt: new Date().toLocaleTimeString(),
        shipmentGroups: Object.entries(groupedShipmentGroups).map(([vendorId, g], idx) => ({
          groupId: `sg-${idx + 1}`,
          vendorName: g.vendorName,
          itemCount: g.items.length,
          trackingNumber: `TRK-${Math.floor(100000 + Math.random() * 900000)}-MNG`,
          carrier: 'GIG Logistics Express',
          eta: 'Arriving in 24–48 hours',
        })),
        grandTotalFormatted: formatNaira(grandTotalMinor),
        paymentMethod: paymentMethod === 'card' ? 'Visa / Mastercard (3DS Verified)' : 'Wema Bank Virtual Account',
        ledgerTxId: `tx-post-${Date.now()}`,
      });
      setCart([]);
      setIsCheckoutOpen(false);
    }, 1200);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a' }}>
      {/* Top Banner & Portal Switcher */}
      <div
        style={{
          backgroundColor: '#090d16',
          color: '#cbd5e1',
          padding: '6px 1.5rem',
          fontSize: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #1e293b',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>🚀 <strong>Manga 2026 Platform</strong></span>
          <span style={{ color: '#475569' }}>|</span>
          <span>Delivery to: <strong style={{ color: '#38bdf8' }}>{location}</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#f59e0b', textDecoration: 'none', fontWeight: 600 }}
          >
            🏢 Vendor Portal (Port 3001) →
          </a>
          <a
            href="http://localhost:3002"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#e11d48', textDecoration: 'none', fontWeight: 600 }}
          >
            ⚖️ Admin Portal (Port 3002) →
          </a>
        </div>
      </div>

      {/* Primary Navigation Bar */}
      <header
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0.85rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#e11d48',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '20px',
              }}
            >
              M
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.5px', color: '#0f172a' }}>
                MANGA
              </div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, marginTop: '-2px' }}>
                MARKETPLACE
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ flex: 1, maxWidth: '650px', position: 'relative' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 100,000+ products across verified Nigerian vendors..."
              style={{
                width: '100%',
                padding: '10px 16px',
                paddingRight: '90px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            <button
              style={{
                position: 'absolute',
                right: '4px',
                top: '4px',
                bottom: '4px',
                padding: '0 16px',
                backgroundColor: '#e11d48',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Search
            </button>
          </div>

          {/* Right Header Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right', display: 'none', sm: 'block' } as any}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Fast Promise</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#059669' }}>⚡ Next-Day ETA</div>
            </div>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <span>🛒 Cart</span>
              <span
                style={{
                  backgroundColor: '#e11d48',
                  color: '#ffffff',
                  borderRadius: '10px',
                  padding: '1px 7px',
                  fontSize: '11px',
                  fontWeight: 800,
                }}
              >
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </button>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <div style={{ borderTop: '1px solid #f1f5f9', backgroundColor: '#ffffff' }}>
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '6px 1.5rem',
              display: 'flex',
              gap: '12px',
              overflowX: 'auto',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            {[
              { id: 'all', label: '🔥 All Deals' },
              { id: 'electronics', label: '📱 Electronics & Gadgets' },
              { id: 'fashion', label: '👗 Fashion & Apparel' },
              { id: 'beauty', label: '💄 Beauty & Skincare' },
              { id: 'groceries', label: '🛒 Groceries & Pantry' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: 'none',
                  backgroundColor: selectedCategory === cat.id ? '#0f172a' : '#f1f5f9',
                  color: selectedCategory === cat.id ? '#ffffff' : '#475569',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem' }}>
        {/* Order Confirmation Banner if just ordered */}
        {orderConfirmed && (
          <div
            style={{
              backgroundColor: '#ecfdf5',
              border: '2px solid #059669',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem',
              color: '#064e3b',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
                  🎉 Order Confirmed: {orderConfirmed.orderNumber}
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
                  Placed at {orderConfirmed.placedAt} • Paid via {orderConfirmed.paymentMethod} • Total:{' '}
                  <strong>{orderConfirmed.grandTotalFormatted}</strong>
                </p>
              </div>
              <button
                onClick={() => setOrderConfirmed(null)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#064e3b' }}
              >
                ✕
              </button>
            </div>
            <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
              {orderConfirmed.shipmentGroups.map((sg: any) => (
                <div key={sg.groupId} style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>📦 {sg.vendorName}</div>
                  <div style={{ fontSize: '12px', color: '#0284c7', fontFamily: 'monospace', margin: '4px 0' }}>
                    Tracking: <strong>{sg.trackingNumber}</strong>
                  </div>
                  <div style={{ fontSize: '11px', color: '#059669' }}>✓ Escrow Held • {sg.eta}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hero Flash Sale Banner */}
        <section
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
            color: '#ffffff',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div>
            <Badge variant="warning">⚡ 24-HOUR FLASH SALE</Badge>
            <h2 style={{ fontSize: '28px', fontWeight: 900, margin: '10px 0 6px 0', letterSpacing: '-0.5px' }}>
              Multi-Vendor Tech & Lifestyle Expo
            </h2>
            <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8', maxWidth: '520px' }}>
              Guaranteed Buy-Box landed pricing, zero floating-point escrow, and verified fast parcel delivery across Nigeria.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: '#cbd5e1' }}>Promise Guarantee:</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#38bdf8' }}>100% Refund Escrow Protection</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Audited Double-Entry Ledger</div>
          </div>
        </section>

        {/* Product Grid */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
            Featured Marketplace Deals ({filteredProducts.length})
          </h3>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            Showing verified vendor offers ranked by Buy-Box algorithm
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              {/* Product Image */}
              <div style={{ position: 'relative', height: '200px', backgroundColor: '#f1f5f9' }}>
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                  <Badge variant="success">-{product.winningOffer.discountPercent}%</Badge>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  {product.brand}
                </div>
                <h4
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    margin: '4px 0 8px 0',
                    lineHeight: '1.3',
                    minHeight: '36px',
                  }}
                >
                  {product.title}
                </h4>

                {/* Buy-Box Price */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0' }}>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#e11d48' }}>
                    {product.winningOffer.priceFormatted}
                  </span>
                  <span style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'line-through' }}>
                    {product.winningOffer.originalPriceFormatted}
                  </span>
                </div>

                {/* Vendor Winning Badge */}
                <div style={{ fontSize: '11px', color: '#475569', margin: '6px 0 10px 0' }}>
                  🏆 <strong>{product.winningOffer.vendorName}</strong> ({product.winningOffer.vendorTier.toUpperCase()})
                  {product.otherOffersCount > 0 && (
                    <button
                      onClick={() => setSelectedProduct(product)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#0284c7',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: 600,
                        marginLeft: '4px',
                        textDecoration: 'underline',
                      }}
                    >
                      +{product.otherOffersCount} other offers
                    </button>
                  )}
                </div>

                {/* Delivery Promise */}
                <div style={{ fontSize: '11px', color: '#059669', marginBottom: '12px' }}>
                  🚚 {product.winningOffer.shippingCarrier} • Dispatches in {product.winningOffer.dispatchHours}h
                </div>

                {/* Action Buttons */}
                <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setSelectedProduct(product)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      backgroundColor: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      color: '#334155',
                    }}
                  >
                    Compare
                  </button>
                  <button
                    onClick={() => addToCart(product, 0)}
                    style={{
                      flex: 2,
                      padding: '8px',
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Product Detail & Buy-Box Comparison Modal */}
      {selectedProduct && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '680px',
              width: '100%',
              padding: '1.75rem',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Badge variant="neutral">{selectedProduct.brand}</Badge>
                <h3 style={{ margin: '6px 0 4px 0', fontSize: '18px', fontWeight: 800 }}>
                  {selectedProduct.title}
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                  Buy-Box Comparison: Algorithmic ranking based on landed price, dispatch SLA & vendor tier
                </p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginTop: '1.25rem' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 10px 0', color: '#334155' }}>
                Verified Vendor Offers for this SKU:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedProduct.allOffers.map((offer, idx) => (
                  <div
                    key={offer.vendorId}
                    style={{
                      border: idx === 0 ? '2px solid #e11d48' : '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: idx === 0 ? '#fff1f2' : '#ffffff',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '14px' }}>{offer.vendorName}</span>
                        {idx === 0 && <Badge variant="error">Buy-Box Winner</Badge>}
                        <Badge variant="neutral">{offer.vendorTier.toUpperCase()}</Badge>
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                        Fulfillment: {offer.fulfillmentScorePercent}% • Dispatches within {offer.dispatchHours}h
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#e11d48' }}>
                        {offer.priceFormatted}
                      </div>
                      <button
                        onClick={() => {
                          addToCart(selectedProduct, idx);
                          setSelectedProduct(null);
                        }}
                        style={{
                          marginTop: '4px',
                          padding: '6px 14px',
                          backgroundColor: '#0f172a',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Select Offer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 60,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              width: '100%',
              maxWidth: '440px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: '1rem 1.25rem',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>
                Shopping Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
              </h3>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            {/* Cart Body: Grouped by Vendor Shipment Group (§6.1) */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>🛒</div>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Your cart is empty</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {Object.entries(groupedShipmentGroups).map(([vendorId, group]) => (
                    <div
                      key={vendorId}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '12px',
                        backgroundColor: '#f8fafc',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          color: '#0f172a',
                          borderBottom: '1px solid #e2e8f0',
                          paddingBottom: '6px',
                          marginBottom: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>📦 Parcel 1: {group.vendorName}</span>
                        <span style={{ color: '#059669' }}>Dispatched Directly</span>
                      </div>

                      {group.items.map((item) => (
                        <div
                          key={`${item.productId}-${item.vendorId}`}
                          style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: 600, lineHeight: '1.2' }}>
                              {item.title}
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: 800, color: '#e11d48', marginTop: '2px' }}>
                              {item.priceFormatted}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                              <button
                                onClick={() => updateQuantity(item.productId, item.vendorId, -1)}
                                style={{ width: '22px', height: '22px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}
                              >
                                -
                              </button>
                              <span style={{ fontSize: '12px', fontWeight: 700 }}>{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.vendorId, 1)}
                                style={{ width: '22px', height: '22px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div style={{ padding: '1.25rem', borderTop: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>
                  <span>Subtotal (minor units snapshot):</span>
                  <span>{formatNaira(cartSubtotalMinor)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>
                  <span>Statutory VAT (7.5% snapshot):</span>
                  <span>{formatNaira(vatMinor)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                  <span>Shipping ({Object.keys(groupedShipmentGroups).length} parcels):</span>
                  <span>{formatNaira(shippingFeeMinor)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800, color: '#0f172a', borderTop: '1px solid #e2e8f0', paddingTop: '8px', marginBottom: '1rem' }}>
                  <span>Grand Total:</span>
                  <span style={{ color: '#e11d48' }}>{formatNaira(grandTotalMinor)}</span>
                </div>
                <Button
                  variant="primary"
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  style={{ width: '100%', padding: '12px', fontWeight: 700 }}
                >
                  Proceed to Multi-Vendor Checkout →
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Multi-Vendor Checkout Modal */}
      {isCheckoutOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 70,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              padding: '1.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
                ⚡ Multi-Vendor Checkout (§6.1 Saga)
              </h3>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                  Delivery Address:
                </label>
                <input
                  type="text"
                  defaultValue="24 Admiralty Way, Lekki Phase 1, Lagos State"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                  Payment Method (Double-Entry Escrow Posting):
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: paymentMethod === 'card' ? '2px solid #e11d48' : '1px solid #cbd5e1',
                      backgroundColor: paymentMethod === 'card' ? '#fff1f2' : '#fff',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    💳 Debit Card (3DS)
                  </button>
                  <button
                    onClick={() => setPaymentMethod('bank_transfer')}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: paymentMethod === 'bank_transfer' ? '2px solid #e11d48' : '1px solid #cbd5e1',
                      backgroundColor: paymentMethod === 'bank_transfer' ? '#fff1f2' : '#fff',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    🏦 Bank Transfer (Wema)
                  </button>
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Shipment Parcels:</span>
                  <strong>{Object.keys(groupedShipmentGroups).length} independent parcels</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Total Payable:</span>
                  <strong style={{ color: '#e11d48' }}>{formatNaira(grandTotalMinor)}</strong>
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                  🔒 Double-entry ledger will post: <code>D: psp_clearing / C: buyer_funds_held</code> until delivery confirmation.
                </div>
              </div>

              <Button
                variant="primary"
                onClick={handleExecuteCheckout}
                disabled={isProcessingCheckout}
                style={{ width: '100%', padding: '12px', fontWeight: 700 }}
              >
                {isProcessingCheckout ? 'Processing Atomic Saga...' : `Pay ${formatNaira(grandTotalMinor)} & Place Order`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
