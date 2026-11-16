'use client';

import * as React from 'react';
import {
  ShoppingBag,
  Search,
  ShieldCheck,
  Truck,
  MapPin,
  Check,
  X,
  ChevronDown,
  Lock,
  Clock,
  AlertTriangle,
  ArrowRight,
  Star,
  Heart,
  CheckCircle2,
  ExternalLink,
  CreditCard,
  Building,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';

export interface MerchantOffer {
  vendorId: string;
  vendorName: string;
  vendorTier: 'gold' | 'silver' | 'bronze';
  priceMinor: bigint;
  priceFormatted: string;
  dispatchHours: number;
  fulfillmentScorePercent: number;
  shippingCarrier: string;
  warehouseLocation: string;
  stockAvailable: number;
}

export interface ProductItem {
  id: string;
  title: string;
  category: string;
  brand: string;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  originalPriceFormatted: string;
  discountPercent: number;
  winningOffer: MerchantOffer;
  otherOffers: MerchantOffer[];
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
  warehouseLocation: string;
  carrier: string;
}

export const CATALOG_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-001',
    title: 'Apple iPhone 15 Pro Max 256GB - Natural Titanium',
    category: 'smartphones',
    brand: 'Apple',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 312,
    originalPriceFormatted: '₦1,850,000.00',
    discountPercent: 11,
    winningOffer: {
      vendorId: 'ven-slot',
      vendorName: 'Slot Systems Direct',
      vendorTier: 'gold',
      priceMinor: 165000000n,
      priceFormatted: '₦1,650,000.00',
      dispatchHours: 24,
      fulfillmentScorePercent: 99.4,
      shippingCarrier: 'GIG Logistics Priority Air',
      warehouseLocation: 'Victoria Island Hub, Lagos',
      stockAvailable: 14,
    },
    otherOffers: [
      {
        vendorId: 'ven-apex',
        vendorName: 'Apex Electronics Nigeria',
        vendorTier: 'gold',
        priceMinor: 167500000n,
        priceFormatted: '₦1,675,000.00',
        dispatchHours: 24,
        fulfillmentScorePercent: 98.2,
        shippingCarrier: 'Red Star Express',
        warehouseLocation: 'Ikeja Warehouse, Lagos',
        stockAvailable: 8,
      },
      {
        vendorId: 'ven-alaba',
        vendorName: 'Alaba Gadgets Hub',
        vendorTier: 'silver',
        priceMinor: 163500000n,
        priceFormatted: '₦1,635,000.00',
        dispatchHours: 48,
        fulfillmentScorePercent: 94.1,
        shippingCarrier: 'Fez Delivery',
        warehouseLocation: 'Ojo Logistics Yard, Lagos',
        stockAvailable: 5,
      },
    ],
  },
  {
    id: 'prod-002',
    title: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones - Midnight Black',
    category: 'audio',
    brand: 'Sony',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewsCount: 184,
    originalPriceFormatted: '₦550,000.00',
    discountPercent: 12,
    winningOffer: {
      vendorId: 'ven-apex',
      vendorName: 'Apex Electronics Nigeria',
      vendorTier: 'gold',
      priceMinor: 48500000n,
      priceFormatted: '₦485,000.00',
      dispatchHours: 24,
      fulfillmentScorePercent: 98.7,
      shippingCarrier: 'Red Star Express',
      warehouseLocation: 'Ikeja Commercial Hub, Lagos',
      stockAvailable: 11,
    },
    otherOffers: [
      {
        vendorId: 'ven-slot',
        vendorName: 'Slot Systems Direct',
        vendorTier: 'gold',
        priceMinor: 49500000n,
        priceFormatted: '₦495,000.00',
        dispatchHours: 24,
        fulfillmentScorePercent: 99.2,
        shippingCarrier: 'GIG Logistics Priority',
        warehouseLocation: 'Victoria Island Hub, Lagos',
        stockAvailable: 7,
      },
    ],
  },
  {
    id: 'prod-003',
    title: 'AfroThreads Hand-Woven Aso-Oke Agbada 3-Piece Ensemble (Royal Indigo)',
    category: 'fashion',
    brand: 'AfroThreads',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 96,
    originalPriceFormatted: '₦150,000.00',
    discountPercent: 20,
    winningOffer: {
      vendorId: 'ven-afro',
      vendorName: 'AfroThreads Couture',
      vendorTier: 'gold',
      priceMinor: 12000000n,
      priceFormatted: '₦120,000.00',
      dispatchHours: 48,
      fulfillmentScorePercent: 97.8,
      shippingCarrier: 'Fez Delivery Priority',
      warehouseLocation: 'Lekki Phase 1 Atelier, Lagos',
      stockAvailable: 6,
    },
    otherOffers: [],
  },
  {
    id: 'prod-004',
    title: 'Logitech MX Master 3S Wireless Performance Ergonomic Mouse - Graphite',
    category: 'computing',
    brand: 'Logitech',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 240,
    originalPriceFormatted: '₦165,000.00',
    discountPercent: 12,
    winningOffer: {
      vendorId: 'ven-slot',
      vendorName: 'Slot Systems Direct',
      vendorTier: 'gold',
      priceMinor: 14500000n,
      priceFormatted: '₦145,000.00',
      dispatchHours: 24,
      fulfillmentScorePercent: 99.4,
      shippingCarrier: 'GIG Logistics Express',
      warehouseLocation: 'Victoria Island Hub, Lagos',
      stockAvailable: 26,
    },
    otherOffers: [
      {
        vendorId: 'ven-apex',
        vendorName: 'Apex Electronics Nigeria',
        vendorTier: 'gold',
        priceMinor: 14800000n,
        priceFormatted: '₦148,000.00',
        dispatchHours: 24,
        fulfillmentScorePercent: 98.5,
        shippingCarrier: 'Red Star Express',
        warehouseLocation: 'Ikeja Commercial Hub, Lagos',
        stockAvailable: 15,
      },
    ],
  },
  {
    id: 'prod-005',
    title: 'Olori Botanicals Pure Cold-Pressed African Shea Butter & Vitamin C Glow Serum',
    category: 'beauty',
    brand: 'Olori',
    imageUrl: 'https://images.unsplash.com/photo-1608248597359-57321a5eb23b?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewsCount: 88,
    originalPriceFormatted: '₦28,000.00',
    discountPercent: 21,
    winningOffer: {
      vendorId: 'ven-olori',
      vendorName: 'Olori Botanicals Skin Lab',
      vendorTier: 'gold',
      priceMinor: 2200000n,
      priceFormatted: '₦22,000.00',
      dispatchHours: 24,
      fulfillmentScorePercent: 98.9,
      shippingCarrier: 'GIG Logistics Express',
      warehouseLocation: 'Ikoyi Clean Room, Lagos',
      stockAvailable: 45,
    },
    otherOffers: [],
  },
  {
    id: 'prod-006',
    title: 'SuperMart Bulk Royal Basmati Long-Grain Rice (25kg Heavy Sachet)',
    category: 'groceries',
    brand: 'SuperMart',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewsCount: 165,
    originalPriceFormatted: '₦88,000.00',
    discountPercent: 15,
    winningOffer: {
      vendorId: 'ven-supermart',
      vendorName: 'SuperMart Direct Fresh',
      vendorTier: 'gold',
      priceMinor: 7500000n,
      priceFormatted: '₦75,000.00',
      dispatchHours: 12,
      fulfillmentScorePercent: 99.6,
      shippingCarrier: 'SuperMart Direct Fleet',
      warehouseLocation: 'Victoria Island Distribution Center, Lagos',
      stockAvailable: 60,
    },
    otherOffers: [],
  },
];

export const StorefrontClient: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [deliveryLocation, setDeliveryLocation] = React.useState<string>('Lagos (Lekki & Island)');
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = React.useState<ProductItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState<boolean>(false);
  const [orderConfirmed, setOrderConfirmed] = React.useState<any | null>(null);
  const [paymentMethod, setPaymentMethod] = React.useState<'card' | 'bank_transfer'>('card');
  const [isProcessingCheckout, setIsProcessingCheckout] = React.useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = React.useState<string | null>(null);

  // Filter products by category & search
  const filteredProducts = CATALOG_PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const showToast = (message: string) => {
    setFeedbackMessage(message);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const handleAddToCart = (product: ProductItem, chosenOffer: MerchantOffer) => {
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
          warehouseLocation: chosenOffer.warehouseLocation,
          carrier: chosenOffer.shippingCarrier,
        },
      ];
    });
    showToast(`Added "${product.title}" to your cart from ${chosenOffer.vendorName}`);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, vendorId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId && item.vendorId === vendorId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Segregate cart into independent Vendor Shipment Groups (§6.1)
  const shipmentGroups = React.useMemo(() => {
    const map: Record<string, { vendorName: string; location: string; carrier: string; items: CartItem[]; subtotalMinor: bigint }> = {};
    for (const item of cart) {
      if (!map[item.vendorId]) {
        map[item.vendorId] = {
          vendorName: item.vendorName,
          location: item.warehouseLocation,
          carrier: item.carrier,
          items: [],
          subtotalMinor: 0n,
        };
      }
      map[item.vendorId].items.push(item);
      map[item.vendorId].subtotalMinor += item.priceMinor * BigInt(item.quantity);
    }
    return map;
  }, [cart]);

  // Financial Ledger Math (Exact minor units, 0 floating point errors)
  const cartSubtotalMinor = React.useMemo(() => {
    return cart.reduce((acc, item) => acc + item.priceMinor * BigInt(item.quantity), 0n);
  }, [cart]);

  const vatMinor = (cartSubtotalMinor * 75n) / 1000n; // 7.5% statutory VAT
  const shippingFeeMinor = Object.keys(shipmentGroups).length > 0 ? BigInt(Object.keys(shipmentGroups).length) * 250000n : 0n; // ₦2,500 per package
  const grandTotalMinor = cartSubtotalMinor + vatMinor + shippingFeeMinor;

  const formatNaira = (minor: bigint) => {
    const major = Number(minor) / 100;
    return `₦${major.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const executeOrderCheckout = () => {
    setIsProcessingCheckout(true);
    setTimeout(() => {
      setIsProcessingCheckout(false);
      setOrderConfirmed({
        orderNumber: `MNG-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
        placedAt: new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }),
        packages: Object.entries(shipmentGroups).map(([vId, group], index) => ({
          packageNumber: index + 1,
          merchantName: group.vendorName,
          originLocation: group.location,
          carrier: group.carrier,
          trackingNumber: `TRK-${Math.floor(100000 + Math.random() * 900000)}-MNG`,
          itemCount: group.items.reduce((s, i) => s + i.quantity, 0),
          estimatedArrival: index === 0 ? 'Tomorrow by 4:00 PM' : 'Thursday by 2:00 PM',
        })),
        grandTotalFormatted: formatNaira(grandTotalMinor),
        paymentMethodName: paymentMethod === 'card' ? 'Debit Card (Protected by 3DS)' : 'Dedicated Bank Transfer (Wema Bank Virtual Account)',
      });
      setCart([]);
      setIsCheckoutOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1100);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', color: '#0F172A', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Toast Feedback Notification */}
      {feedbackMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 100,
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            padding: '12px 18px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 500,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            border: '1px solid #1E293B',
          }}
        >
          <CheckCircle2 size={16} color="#10B981" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Top Utility Bar */}
      <div
        style={{
          backgroundColor: '#020617',
          color: '#94A3B8',
          fontSize: '12px',
          borderBottom: '1px solid #1E293B',
          padding: '6px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#CBD5E1' }}>
            <MapPin size={13} color="#E11D48" />
            <span>Delivery Destination:</span>
            <strong style={{ color: '#FFFFFF' }}>{deliveryLocation}</strong>
          </div>
          <span style={{ color: '#334155' }}>|</span>
          <span style={{ color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={13} />
            Manga Escrow Buyer Protection Guaranteed
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#CBD5E1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}
          >
            <Building size={13} />
            <span>Merchant Operations</span>
            <ExternalLink size={11} color="#64748B" />
          </a>
          <a
            href="http://localhost:3002"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#CBD5E1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}
          >
            <Lock size={13} />
            <span>Admin Governance</span>
            <ExternalLink size={11} color="#64748B" />
          </a>
        </div>
      </div>

      {/* Universal Sticky Header */}
      <header
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            padding: '12px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          {/* Brand Mark */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', cursor: 'pointer' }}>
            <span style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.04em', color: '#0F172A' }}>
              MANGA
            </span>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#E11D48',
                display: 'inline-block',
              }}
            />
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', color: '#64748B', marginLeft: '4px' }}>
              MARKETPLACE
            </span>
          </div>

          {/* Search Command Input */}
          <div style={{ flex: 1, maxWidth: '680px', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
              <Search size={18} color="#94A3B8" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 100,000+ authentic products across verified Nigerian merchants..."
              style={{
                width: '100%',
                height: '44px',
                padding: '0 80px 0 42px',
                borderRadius: '8px',
                border: '1.5px solid #E2E8F0',
                fontSize: '14px',
                color: '#0F172A',
                backgroundColor: '#FFFFFF',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 150ms ease, box-shadow 150ms ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#E11D48';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(225, 29, 72, 0.12)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                }}
              >
                <X size={16} />
              </button>
            ) : (
              <span
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  color: '#94A3B8',
                  backgroundColor: '#F1F5F9',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  border: '1px solid #E2E8F0',
                  pointerEvents: 'none',
                }}
              >
                ⌘K
              </span>
            )}
          </div>

          {/* Right Header Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: '#ECFDF5', borderRadius: '6px' }}>
              <Truck size={15} color="#059669" />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#065F46' }}>Next-Day Dispatch</span>
            </div>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                height: '42px',
                padding: '0 16px',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'background-color 150ms ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1E293B')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0F172A')}
            >
              <ShoppingBag size={17} color="#FFFFFF" />
              <span>Cart</span>
              <span
                style={{
                  backgroundColor: '#E11D48',
                  color: '#FFFFFF',
                  borderRadius: '999px',
                  padding: '2px 7px',
                  fontSize: '11px',
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </button>
          </div>
        </div>

        {/* Category Horizon Chips Bar */}
        <div style={{ borderTop: '1px solid #F1F5F9', backgroundColor: '#FFFFFF' }}>
          <div
            style={{
              maxWidth: '1360px',
              margin: '0 auto',
              padding: '8px 32px',
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
            }}
          >
            {[
              { id: 'all', label: 'All Categories' },
              { id: 'smartphones', label: 'Smartphones & Tablets' },
              { id: 'audio', label: 'Audio & Premium Sound' },
              { id: 'computing', label: 'Laptops & Workstations' },
              { id: 'fashion', label: 'Authentic African Couture' },
              { id: 'beauty', label: 'Clean Botanical Skincare' },
              { id: 'groceries', label: 'Pantry & Bulk Groceries' },
            ].map((category) => {
              const active = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  style={{
                    height: '32px',
                    padding: '0 14px',
                    borderRadius: '16px',
                    border: active ? '1px solid #0F172A' : '1px solid #E2E8F0',
                    backgroundColor: active ? '#0F172A' : '#FFFFFF',
                    color: active ? '#FFFFFF' : '#475569',
                    fontSize: '13px',
                    fontWeight: active ? 600 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 120ms ease',
                  }}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1360px', margin: '0 auto', padding: '24px 32px' }}>
        {/* Order Confirmed Screen */}
        {orderConfirmed && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1.5px solid #10B981',
              padding: '24px',
              marginBottom: '32px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.08)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={24} color="#059669" />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>
                    Order Confirmed: {orderConfirmed.orderNumber}
                  </h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748B' }}>
                    Placed at {orderConfirmed.placedAt} • Payment Secured: {orderConfirmed.paymentMethodName} • Total:{' '}
                    <strong style={{ color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{orderConfirmed.grandTotalFormatted}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOrderConfirmed(null)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Individual Package Logistics breakdown */}
            <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
              {orderConfirmed.packages.map((pkg: any) => (
                <div
                  key={pkg.packageNumber}
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '14px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                    <span>Package {pkg.packageNumber}: {pkg.merchantName}</span>
                    <span style={{ color: '#059669' }}>Escrow Active</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>
                    Dispatched from: {pkg.originLocation}
                  </div>
                  <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#0284C7', marginTop: '4px' }}>
                    Tracking: <strong>{pkg.trackingNumber}</strong> ({pkg.carrier})
                  </div>
                  <div style={{ fontSize: '11px', color: '#059669', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} />
                    <span>Estimated Arrival: {pkg.estimatedArrival}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Editorial Value Proposition Hero */}
        <section
          style={{
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            borderRadius: '16px',
            padding: '32px 40px',
            marginBottom: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
            boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.1)',
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                backgroundColor: 'rgba(225, 29, 72, 0.15)',
                border: '1px solid rgba(225, 29, 72, 0.3)',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#FDA4AF',
                marginBottom: '12px',
              }}
            >
              <Sparkles size={12} color="#FDA4AF" />
              <span>Verified Multi-Merchant Marketplace</span>
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 10px 0', letterSpacing: '-0.02em', lineHeight: '1.25' }}>
              Authentic Brands, Verified Merchants & Guaranteed Buy-Box Landed Prices
            </h1>
            <p style={{ margin: 0, fontSize: '14px', color: '#94A3B8', lineHeight: '1.5' }}>
              Shop directly from accredited distributors across Nigeria. Every order features zero floating-point escrow protection, transparent fulfillment routing, and guaranteed next-day dispatch.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '260px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#CBD5E1' }}>
              <ShieldCheck size={16} color="#10B981" />
              <span>Accredited Merchant KYC Tiers</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#CBD5E1' }}>
              <Truck size={16} color="#38BDF8" />
              <span>Real-Time Carrier Lane Tracking</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#CBD5E1' }}>
              <Lock size={16} color="#F59E0B" />
              <span>Full Escrow Buyer Protection</span>
            </div>
          </div>
        </section>

        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0', color: '#0F172A', letterSpacing: '-0.01em' }}>
              Curated Catalog Offers ({filteredProducts.length})
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
              Sorted by Buy-Box algorithm factoring landed pricing, dispatch speed, and fulfillment reliability
            </p>
          </div>
          <div style={{ fontSize: '12px', color: '#64748B' }}>
            Prices include statutory 7.5% VAT & delivery estimates
          </div>
        </div>

        {/* Responsive Product Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '20px',
          }}
        >
          {filteredProducts.map((product) => {
            const hasAlternativeOffers = product.otherOffers.length > 0;
            return (
              <div
                key={product.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px -6px rgba(15, 23, 42, 0.08)';
                  e.currentTarget.style.borderColor = '#CBD5E1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                {/* Image Viewport */}
                <div style={{ position: 'relative', height: '220px', backgroundColor: '#F8FAFC' }}>
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: '#E11D48',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    -{product.discountPercent}%
                  </div>
                  <button
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.92)',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#64748B',
                    }}
                  >
                    <Heart size={15} />
                  </button>
                </div>

                {/* Card Content Body */}
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Brand & Reviews */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {product.brand}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, color: '#0F172A' }}>
                      <Star size={12} fill="#F59E0B" color="#F59E0B" />
                      <span>{product.rating}</span>
                      <span style={{ color: '#94A3B8', fontWeight: 400 }}>({product.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#0F172A',
                      lineHeight: '1.35',
                      margin: '0 0 10px 0',
                      minHeight: '38px',
                    }}
                  >
                    {product.title}
                  </h3>

                  {/* Pricing Stack */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '19px', fontWeight: 800, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>
                      {product.winningOffer.priceFormatted}
                    </span>
                    <span style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'line-through', fontVariantNumeric: 'tabular-nums' }}>
                      {product.originalPriceFormatted}
                    </span>
                  </div>

                  {/* Buy-Box Merchant Citation */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#334155', marginBottom: '6px' }}>
                    <ShieldCheck size={14} color="#059669" />
                    <span>Sold by <strong>{product.winningOffer.vendorName}</strong></span>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '1px 5px',
                        borderRadius: '3px',
                        backgroundColor: '#FEF3C7',
                        color: '#92400E',
                        textTransform: 'uppercase',
                      }}
                    >
                      {product.winningOffer.vendorTier}
                    </span>
                  </div>

                  {/* Delivery Promise */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#059669', marginBottom: '14px' }}>
                    <Truck size={14} color="#059669" />
                    <span>Dispatches in {product.winningOffer.dispatchHours}h via {product.winningOffer.shippingCarrier}</span>
                  </div>

                  {/* Alternative Offers Toggle Link */}
                  {hasAlternativeOffers && (
                    <button
                      onClick={() => setSelectedProduct(product)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#E11D48',
                        fontSize: '12px',
                        fontWeight: 600,
                        textAlign: 'left',
                        padding: 0,
                        cursor: 'pointer',
                        marginBottom: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span>Compare {product.otherOffers.length} other seller offers</span>
                      <ArrowRight size={13} />
                    </button>
                  )}

                  {/* Action Buttons */}
                  <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setSelectedProduct(product)}
                      style={{
                        flex: 1,
                        height: '36px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#334155',
                        cursor: 'pointer',
                      }}
                    >
                      Compare
                    </button>
                    <button
                      onClick={() => handleAddToCart(product, product.winningOffer)}
                      style={{
                        flex: 2,
                        height: '36px',
                        backgroundColor: '#0F172A',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'background-color 150ms ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E11D48')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0F172A')}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Buy-Box Comparison Sheet Modal */}
      {selectedProduct && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {selectedProduct.brand} • SKU Comparison
                </span>
                <h3 style={{ margin: '4px 0 6px 0', fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>
                  {selectedProduct.title}
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
                  Select your preferred merchant based on landed price, dispatch speed, and verified fulfillment history
                </p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Merchant Offers Comparison Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
              {[selectedProduct.winningOffer, ...selectedProduct.otherOffers].map((offer, index) => {
                const isWinner = index === 0;
                return (
                  <div
                    key={offer.vendorId}
                    style={{
                      border: isWinner ? '2px solid #E11D48' : '1px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '16px',
                      backgroundColor: isWinner ? '#FDF4F4' : '#FFFFFF',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                          {offer.vendorName}
                        </span>
                        {isWinner && (
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              backgroundColor: '#E11D48',
                              color: '#FFFFFF',
                              padding: '2px 6px',
                              borderRadius: '4px',
                            }}
                          >
                            BUY-BOX WINNER
                          </span>
                        )}
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '1px 5px',
                            borderRadius: '3px',
                            backgroundColor: '#F1F5F9',
                            color: '#475569',
                            textTransform: 'uppercase',
                          }}
                        >
                          {offer.vendorTier} Tier
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                        Dispatch SLA: <strong>Within {offer.dispatchHours} hours</strong> • Carrier: {offer.shippingCarrier}
                      </div>
                      <div style={{ fontSize: '12px', color: '#059669', marginTop: '2px' }}>
                        Fulfillment Track Record: {offer.fulfillmentScorePercent}% On-Time Handover
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>
                        {offer.priceFormatted}
                      </div>
                      <button
                        onClick={() => {
                          handleAddToCart(selectedProduct, offer);
                          setSelectedProduct(null);
                        }}
                        style={{
                          marginTop: '8px',
                          padding: '8px 16px',
                          backgroundColor: isWinner ? '#E11D48' : '#0F172A',
                          color: '#FFFFFF',
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
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Slide-Over Grouped Cart Drawer (§6.1) */}
      {isCartOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(3px)',
            zIndex: 70,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: '460px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-8px 0 32px rgba(15, 23, 42, 0.15)',
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: '16px 24px',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingBag size={18} color="#0F172A" />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
                  Review Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Body: Structured by Independent Parcels */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#94A3B8' }}>
                  <ShoppingBag size={48} strokeWidth={1.25} color="#CBD5E1" style={{ margin: '0 auto 12px auto' }} />
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#475569' }}>Your cart is empty</p>
                  <p style={{ margin: '6px 0 0 0', fontSize: '13px' }}>Explore authentic deals from verified merchants</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {Object.entries(shipmentGroups).map(([vId, group], idx) => (
                    <div
                      key={vId}
                      style={{
                        border: '1px solid #E2E8F0',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      {/* Parcel Container Header */}
                      <div
                        style={{
                          backgroundColor: '#F8FAFC',
                          borderBottom: '1px solid #E2E8F0',
                          padding: '10px 14px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '12px',
                        }}
                      >
                        <span style={{ fontWeight: 700, color: '#0F172A' }}>
                          Parcel {idx + 1}: Fulfilled by {group.vendorName}
                        </span>
                        <span style={{ color: '#059669', fontWeight: 600 }}>Direct Dispatch</span>
                      </div>

                      {/* Line Items */}
                      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {group.items.map((item) => (
                          <div key={`${item.productId}-${item.vendorId}`} style={{ display: 'flex', gap: '12px' }}>
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #E2E8F0' }}
                            />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', lineHeight: '1.3' }}>
                                {item.title}
                              </div>
                              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: '2px', fontVariantNumeric: 'tabular-nums' }}>
                                {item.priceFormatted}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '4px', overflow: 'hidden' }}>
                                  <button
                                    onClick={() => handleUpdateQuantity(item.productId, item.vendorId, -1)}
                                    style={{ width: '26px', height: '24px', border: 'none', background: '#F8FAFC', cursor: 'pointer', fontSize: '13px' }}
                                  >
                                    -
                                  </button>
                                  <span style={{ width: '28px', textAlign: 'center', fontSize: '12px', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => handleUpdateQuantity(item.productId, item.vendorId, 1)}
                                    style={{ width: '26px', height: '24px', border: 'none', background: '#F8FAFC', cursor: 'pointer', fontSize: '13px' }}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Immutable Financial Breakdown */}
            {cart.length > 0 && (
              <div style={{ borderTop: '1px solid #E2E8F0', padding: '20px 24px', backgroundColor: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748B', marginBottom: '6px' }}>
                  <span>Items Subtotal:</span>
                  <span style={{ color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{formatNaira(cartSubtotalMinor)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748B', marginBottom: '6px' }}>
                  <span>Statutory VAT (7.5%):</span>
                  <span style={{ color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{formatNaira(vatMinor)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748B', marginBottom: '10px' }}>
                  <span>Carrier Delivery ({Object.keys(shipmentGroups).length} parcels):</span>
                  <span style={{ color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>{formatNaira(shippingFeeMinor)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800, color: '#0F172A', borderTop: '1px solid #E2E8F0', paddingTop: '10px', marginBottom: '16px' }}>
                  <span>Escrow Total:</span>
                  <span style={{ color: '#E11D48', fontVariantNumeric: 'tabular-nums' }}>{formatNaira(grandTotalMinor)}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#059669', marginBottom: '14px' }}>
                  <ShieldCheck size={14} color="#059669" />
                  <span>Funds held in secure escrow until you inspect and accept your packages.</span>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  style={{
                    width: '100%',
                    height: '46px',
                    backgroundColor: '#E11D48',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'background-color 150ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#BE123C')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#E11D48')}
                >
                  Proceed to Secure Checkout →
                </button>
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
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>
                  Secure Escrow Checkout
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748B' }}>
                  Review your delivery address and preferred Nigerian payment provider
                </p>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Delivery Address */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Delivery Address:
                </label>
                <input
                  type="text"
                  defaultValue="24 Admiralty Way, Lekki Phase 1, Lagos State"
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 12px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    color: '#0F172A',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                  Payment Method:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    style={{
                      padding: '14px',
                      borderRadius: '8px',
                      border: paymentMethod === 'card' ? '2px solid #E11D48' : '1px solid #E2E8F0',
                      backgroundColor: paymentMethod === 'card' ? '#FDF4F4' : '#FFFFFF',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '13px', color: '#0F172A' }}>
                      <CreditCard size={16} color={paymentMethod === 'card' ? '#E11D48' : '#64748B'} />
                      <span>Debit Card (3DS)</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>Visa, Mastercard, Verve</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('bank_transfer')}
                    style={{
                      padding: '14px',
                      borderRadius: '8px',
                      border: paymentMethod === 'bank_transfer' ? '2px solid #E11D48' : '1px solid #E2E8F0',
                      backgroundColor: paymentMethod === 'bank_transfer' ? '#FDF4F4' : '#FFFFFF',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '13px', color: '#0F172A' }}>
                      <Building size={16} color={paymentMethod === 'bank_transfer' ? '#E11D48' : '#64748B'} />
                      <span>Instant Bank Transfer</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>Direct Wema Virtual Account</span>
                  </button>
                </div>
              </div>

              {/* Package Summary Box */}
              <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span>Separate Merchant Packages:</span>
                  <strong>{Object.keys(shipmentGroups).length} parcels</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                  <span>Total Payable:</span>
                  <span style={{ color: '#E11D48', fontVariantNumeric: 'tabular-nums' }}>{formatNaira(grandTotalMinor)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                onClick={executeOrderCheckout}
                disabled={isProcessingCheckout}
                style={{
                  width: '100%',
                  height: '48px',
                  backgroundColor: '#E11D48',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: isProcessingCheckout ? 'not-allowed' : 'pointer',
                  opacity: isProcessingCheckout ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background-color 150ms ease',
                }}
              >
                <Lock size={16} />
                <span>
                  {isProcessingCheckout ? 'Securing Escrow & Reserving Stock...' : `Authorize ${formatNaira(grandTotalMinor)} & Place Order`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
