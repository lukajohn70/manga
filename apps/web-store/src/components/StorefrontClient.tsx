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
  Phone,
  MessageCircle,
  Tag,
  Zap,
  Package,
  Layers,
  Award,
  SlidersHorizontal,
  ChevronRight,
  Headphones,
  Smartphone,
  Laptop,
  ShoppingBasket,
  Shirt,
  Sparkle,
  Copy,
  CheckCheck,
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
  category: 'smartphones' | 'computing' | 'audio' | 'fashion' | 'beauty' | 'groceries';
  brand: string;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  originalPriceFormatted: string;
  discountPercent: number;
  isFlashDeal?: boolean;
  flashClaimedPercent?: number;
  scarcityCount?: number;
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
    title: 'Apple iPhone 15 Pro Max 256GB - Natural Titanium (100% Genuine Apple)',
    category: 'smartphones',
    brand: 'Apple',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 312,
    originalPriceFormatted: '₦1,850,000.00',
    discountPercent: 11,
    isFlashDeal: true,
    flashClaimedPercent: 86,
    scarcityCount: 3,
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
        warehouseLocation: 'Ikeja Commercial Hub, Lagos',
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
    isFlashDeal: true,
    flashClaimedPercent: 74,
    scarcityCount: 4,
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
    isFlashDeal: false,
    scarcityCount: 5,
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
    isFlashDeal: true,
    flashClaimedPercent: 91,
    scarcityCount: 2,
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
    isFlashDeal: false,
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
    isFlashDeal: true,
    flashClaimedPercent: 68,
    scarcityCount: 8,
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
  // Navigation & Category States
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [searchDepartmentScope, setSearchDepartmentScope] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [searchSuggestionsOpen, setSearchSuggestionsOpen] = React.useState<boolean>(false);
  const [deliveryLocation, setDeliveryLocation] = React.useState<string>('Lagos (Lekki & Island)');
  const [locationPickerOpen, setLocationPickerOpen] = React.useState<boolean>(false);
  const [announcementDismissed, setAnnouncementDismissed] = React.useState<boolean>(false);
  const [codeCopied, setCodeCopied] = React.useState<boolean>(false);

  // Cart & Wishlist States
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState<boolean>(false);
  const [wishlist, setWishlist] = React.useState<string[]>(['prod-001']);
  const [isWishlistOpen, setIsWishlistOpen] = React.useState<boolean>(false);
  const [voucherCode, setVoucherCode] = React.useState<string>('');
  const [appliedDiscountMinor, setAppliedDiscountMinor] = React.useState<bigint>(0n);

  // Modal Dialogs
  const [selectedProductForOffers, setSelectedProductForOffers] = React.useState<ProductItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState<boolean>(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = React.useState<boolean>(false);
  const [trackingSearchCode, setTrackingSearchCode] = React.useState<string>('TRK-881294-MNG');
  const [isWhatsAppOpen, setIsWhatsAppOpen] = React.useState<boolean>(false);
  const [orderConfirmed, setOrderConfirmed] = React.useState<any | null>(null);

  // Checkout Specifics
  const [checkoutStep, setCheckoutStep] = React.useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = React.useState<'card' | 'bank_transfer'>('card');
  const [deliveryMethod, setDeliveryMethod] = React.useState<'doorstep' | 'pickup'>('doorstep');
  const [isProcessingCheckout, setIsProcessingCheckout] = React.useState<boolean>(false);
  const [cardOtpSimulated, setCardOtpSimulated] = React.useState<boolean>(false);
  const [simulatedOtpValue, setSimulatedOtpValue] = React.useState<string>('');

  // Toast System
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Flash Sale Countdown Timer (Simulated Live)
  const [timeLeft, setTimeLeft] = React.useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 4,
    minutes: 18,
    seconds: 42,
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Autocomplete Suggestions
  const searchSuggestions = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    return CATALOG_PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 4);
  }, [searchQuery]);

  // Filter Catalog
  const filteredProducts = React.useMemo(() => {
    return CATALOG_PRODUCTS.filter((product) => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Wishlist Toggle
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('Item removed from your Saved Wishlist.');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to your Wishlist! Access it anytime from the top bar.');
        return [...prev, productId];
      }
    });
  };

  // Add to Cart
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
    showToast(`Added to cart: ${product.title} (${chosenOffer.vendorName})`);
    setIsCartOpen(true);
    setSearchSuggestionsOpen(false);
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

  // Group Cart items by Merchant into independent Shipment Groups
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

  // Financial Calculations
  const cartSubtotalMinor = React.useMemo(() => {
    return cart.reduce((acc, item) => acc + item.priceMinor * BigInt(item.quantity), 0n);
  }, [cart]);

  const freeDeliveryThresholdMinor = 5000000n; // ₦50,000
  const isFreeDeliveryQualified = cartSubtotalMinor >= freeDeliveryThresholdMinor;
  const amountNeededForFreeDelivery = freeDeliveryThresholdMinor > cartSubtotalMinor ? freeDeliveryThresholdMinor - cartSubtotalMinor : 0n;
  const freeDeliveryProgressPercent = Math.min(100, Number((cartSubtotalMinor * 100n) / freeDeliveryThresholdMinor));

  const statutoryVatMinor = (cartSubtotalMinor * 75n) / 1000n; // 7.5%
  const parcelCount = Object.keys(shipmentGroups).length;
  const shippingFeeMinor = isFreeDeliveryQualified
    ? 0n
    : parcelCount > 0
    ? BigInt(parcelCount) * 250000n // ₦2,500 per merchant parcel
    : 0n;

  const grandTotalMinor = cartSubtotalMinor - appliedDiscountMinor + statutoryVatMinor + shippingFeeMinor;

  const formatNaira = (minor: bigint) => {
    const major = Number(minor) / 100;
    return `₦${major.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (voucherCode.trim().toUpperCase() === 'MANGAEXPRESS') {
      if (cartSubtotalMinor >= 5000000n) {
        setAppliedDiscountMinor(350000n); // ₦3,500 off
        showToast('Promo code MANGAEXPRESS applied! You saved ₦3,500.00.');
      } else {
        showToast('Code MANGAEXPRESS requires a minimum order of ₦50,000.');
      }
    } else {
      showToast('Invalid voucher code. Please check and try again.');
    }
  };

  const copyPromoCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('MANGAEXPRESS');
      setCodeCopied(true);
      showToast('Copied code MANGAEXPRESS to clipboard!');
      setTimeout(() => setCodeCopied(false), 2500);
    }
  };

  const executeOrderCheckout = () => {
    if (paymentMethod === 'card' && !cardOtpSimulated) {
      setCardOtpSimulated(true);
      return;
    }

    setIsProcessingCheckout(true);
    setTimeout(() => {
      setIsProcessingCheckout(false);
      setCardOtpSimulated(false);
      setOrderConfirmed({
        orderNumber: `MNG-2611-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        placedAt: new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }),
        packages: Object.entries(shipmentGroups).map(([vId, group], index) => ({
          packageNumber: index + 1,
          merchantName: group.vendorName,
          originLocation: group.location,
          carrier: group.carrier,
          trackingNumber: `TRK-${Math.floor(100000 + Math.random() * 900000)}-MNG`,
          itemCount: group.items.reduce((s, i) => s + i.quantity, 0),
          estimatedArrival: index === 0 ? 'Tomorrow by 2:00 PM' : 'Thursday by 12:00 PM',
        })),
        grandTotalFormatted: formatNaira(grandTotalMinor),
        paymentMethodName: paymentMethod === 'card' ? 'Debit Card (Protected by 3D Secure)' : 'Dedicated Bank Transfer (Wema Bank Virtual Account)',
      });
      setCart([]);
      setIsCheckoutOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', color: '#0F172A', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* 1. TOP PROMOTIONAL ANNOUNCEMENT TICKER (Borrowed from Glows Collection & Zavora) */}
      {!announcementDismissed && (
        <div
          style={{
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            fontSize: '12px',
            padding: '7px 16px',
            borderBottom: '1px solid #1E293B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span
              style={{
                backgroundColor: '#E11D48',
                color: '#FFFFFF',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              FLASH OFFER
            </span>
            <span style={{ color: '#E2E8F0' }}>
              Save <strong>₦3,500</strong> on orders above ₦50,000 + Free Express Delivery across Lagos & Abuja with code:
            </span>
            <button
              onClick={copyPromoCode}
              style={{
                backgroundColor: 'rgba(255,255,255,0.12)',
                border: '1px dashed #F59E0B',
                color: '#FDE68A',
                padding: '2px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 700,
                fontFamily: 'monospace',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {codeCopied ? <CheckCheck size={12} color="#10B981" /> : <Copy size={12} />}
              MANGAEXPRESS
            </button>
          </div>
          <button
            onClick={() => setAnnouncementDismissed(true)}
            aria-label="Dismiss banner"
            style={{
              position: 'absolute',
              right: '16px',
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 2. TOP UTILITY TRUST & SERVICE BAR (Amazon / Konga / Jumia / Zavora Style) */}
      <div
        style={{
          backgroundColor: '#020617',
          color: '#94A3B8',
          fontSize: '11px',
          borderBottom: '1px solid #1E293B',
          padding: '6px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#FDE68A', fontWeight: 700 }}>
            <Award size={13} color="#F59E0B" /> Manga Official Mall (100% Genuine Certified)
          </span>
          <span style={{ color: '#334155' }}>|</span>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              onClick={() => setLocationPickerOpen(!locationPickerOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: '#CBD5E1',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                padding: 0,
              }}
            >
              <MapPin size={12} color="#E11D48" />
              <span>Deliver to:</span>
              <strong style={{ color: '#FFFFFF' }}>{deliveryLocation}</strong>
              <ChevronDown size={11} />
            </button>
            {locationPickerOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '6px',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
                  border: '1px solid #E2E8F0',
                  padding: '6px',
                  zIndex: 60,
                  minWidth: '220px',
                }}
              >
                {[
                  'Lagos (Lekki & Island)',
                  'Lagos (Mainland & Ikeja)',
                  'Abuja (FCT Maitama & Wuse)',
                  'Port Harcourt (Rivers)',
                  'Ibadan (Oyo State)',
                ].map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setDeliveryLocation(loc);
                      setLocationPickerOpen(false);
                      showToast(`Delivery destination updated to ${loc}`);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 10px',
                      background: loc === deliveryLocation ? '#F1F5F9' : 'none',
                      border: 'none',
                      borderRadius: '5px',
                      fontSize: '12px',
                      fontWeight: loc === deliveryLocation ? 700 : 500,
                      cursor: 'pointer',
                      color: loc === deliveryLocation ? '#E11D48' : '#334155',
                    }}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => setIsTrackingModalOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#CBD5E1',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              padding: 0,
            }}
          >
            <Truck size={12} color="#38BDF8" />
            <span>Track Order</span>
          </button>
          <span style={{ color: '#334155' }}>|</span>
          <a
            href="tel:07006264264"
            style={{ color: '#CBD5E1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Headphones size={12} color="#10B981" />
            <span>Help: 0700-MANGA-NG</span>
          </a>
          <span style={{ color: '#334155' }}>|</span>
          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#FDE68A', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Building size={12} />
            <span>Sell on Manga</span>
          </a>
          <span style={{ color: '#334155' }}>|</span>
          <a
            href="http://localhost:3002"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#E11D48', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <ShieldCheck size={12} />
            <span>Admin</span>
          </a>
          <span style={{ color: '#334155' }}>•</span>
          <span style={{ color: '#FFFFFF', fontWeight: 800 }}>NGN (₦)</span>
        </div>
      </div>

      {/* 3. MAIN NAVIGATION BAR (Amazon / Zavora Mega Search & Cart) */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          padding: '12px 24px',
        }}
      >
        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          
          {/* Logo & Mall Certification */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <span
              style={{
                fontSize: '24px',
                fontWeight: 900,
                color: '#E11D48',
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}
            >
              MANGA
            </span>
            <span
              style={{
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                fontSize: '10px',
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: '4px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              MALL
            </span>
          </div>

          {/* Mega Search Bar with Category Scope & Instant Suggestions */}
          <div style={{ flex: 1, maxWidth: '720px', position: 'relative' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#F1F5F9',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                overflow: 'hidden',
                transition: 'border-color 0.15s ease',
              }}
            >
              {/* Category Scope Selector */}
              <select
                value={searchDepartmentScope}
                onChange={(e) => setSearchDepartmentScope(e.target.value)}
                style={{
                  backgroundColor: '#E2E8F0',
                  border: 'none',
                  borderRight: '1px solid #CBD5E1',
                  padding: '10px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#334155',
                  outline: 'none',
                  cursor: 'pointer',
                  maxWidth: '140px',
                }}
              >
                <option value="all">All Departments</option>
                <option value="smartphones">Phones & Tablets</option>
                <option value="computing">Laptops & PC</option>
                <option value="audio">Audio & Sound</option>
                <option value="fashion">Fashion & Style</option>
                <option value="beauty">Beauty & Glow</option>
                <option value="groceries">Supermarket</option>
              </select>

              {/* Text Input */}
              <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchSuggestionsOpen(true);
                  }}
                  onFocus={() => setSearchSuggestionsOpen(true)}
                  placeholder="Search over 50,000 genuine products, verified brands, electronics, fashion..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '13px',
                    outline: 'none',
                    color: '#0F172A',
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0 8px' }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Search Submit Button */}
              <button
                type="button"
                style={{
                  backgroundColor: '#E11D48',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '10px 18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Search size={16} />
              </button>
            </div>

            {/* Instant Search Suggestions Dropdown */}
            {searchSuggestionsOpen && searchSuggestions.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '6px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
                  border: '1px solid #E2E8F0',
                  padding: '8px',
                  zIndex: 70,
                }}
              >
                <div style={{ padding: '4px 8px', fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                  Matching Catalog Products
                </div>
                {searchSuggestions.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      setSearchSuggestionsOpen(false);
                      setSelectedProductForOffers(prod);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      backgroundColor: '#FFFFFF',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={prod.imageUrl} alt={prod.title} style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{prod.title}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>
                          {prod.winningOffer.vendorName} • <strong style={{ color: '#E11D48' }}>{prod.winningOffer.priceFormatted}</strong>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(prod, prod.winningOffer);
                      }}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#0F172A',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Utilities */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
            {/* Account Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '17px',
                  backgroundColor: '#F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#475569',
                }}
              >
                <CheckCircle2 size={16} color="#10B981" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '10px', color: '#64748B' }}>Welcome, Chidi</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  My Account <ChevronDown size={11} />
                </span>
              </div>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              style={{
                position: 'relative',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Heart size={20} color={wishlist.length > 0 ? '#E11D48' : '#64748B'} fill={wishlist.length > 0 ? '#E11D48' : 'none'} />
              <span style={{ fontSize: '12px', fontWeight: 600 }} className="hidden md:inline">Saved</span>
              {wishlist.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    left: '20px',
                    backgroundColor: '#E11D48',
                    color: '#FFFFFF',
                    borderRadius: '10px',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '1px 5px',
                    lineHeight: 1,
                  }}
                >
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 14px',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
              }}
            >
              <div style={{ position: 'relative' }}>
                <ShoppingBag size={18} />
                {cart.length > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-8px',
                      backgroundColor: '#E11D48',
                      color: '#FFFFFF',
                      borderRadius: '10px',
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '2px 5px',
                      lineHeight: 1,
                    }}
                  >
                    {cart.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <span style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Cart</span>
                <span style={{ fontSize: '12px', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                  {formatNaira(cartSubtotalMinor)}
                </span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* 4. DEPARTMENT & PROMOTIONAL BAR (Konga / Jumia / Amazon Megamenu) */}
      <nav
        style={{
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          borderBottom: '1px solid #1E293B',
          padding: '0 24px',
        }}
      >
        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflowX: 'auto' }}>
          {/* Department Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {[
              { id: 'all', label: 'All Products', icon: Layers },
              { id: 'smartphones', label: 'Phones & Tablets', icon: Smartphone },
              { id: 'computing', label: 'Laptops & Computing', icon: Laptop },
              { id: 'audio', label: 'Audio & Sound', icon: Headphones },
              { id: 'fashion', label: 'Fashion & Style', icon: Shirt },
              { id: 'beauty', label: 'Beauty & Glow', icon: Sparkle },
              { id: 'groceries', label: 'Supermarket & Bulk', icon: ShoppingBasket },
            ].map((cat) => {
              const IconComp = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSearchQuery('');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '11px 14px',
                    background: 'none',
                    border: 'none',
                    color: isActive ? '#FFFFFF' : '#94A3B8',
                    fontSize: '12px',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    borderBottom: isActive ? '3px solid #E11D48' : '3px solid transparent',
                  }}
                >
                  <IconComp size={13} color={isActive ? '#E11D48' : '#64748B'} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Special Promotional Badges (Lightning Deals / Official Stores) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '16px' }}>
            <button
              onClick={() => {
                const el = document.getElementById('flash-deals-strip');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                backgroundColor: 'rgba(225, 29, 72, 0.2)',
                border: '1px solid rgba(225, 29, 72, 0.4)',
                color: '#FDA4AF',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                whiteSpace: 'nowrap',
              }}
            >
              <Zap size={12} color="#E11D48" />
              <span>Flash Sales</span>
            </button>
            <span style={{ fontSize: '11px', color: '#38BDF8', fontWeight: 600, whiteSpace: 'nowrap' }}>
              Express Delivery (24-48h)
            </span>
          </div>
        </div>
      </nav>

      {/* 5. HERO PROMOTIONAL SHOWCASE BANNER (Amazon / Jumia / Zavora High-Impact Showcase) */}
      <section
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #020617 0%, #0F172A 50%, #1E1B4B 100%)',
          color: '#FFFFFF',
          padding: '40px 24px',
          overflow: 'hidden',
          borderBottom: '1px solid #1E293B',
        }}
      >
        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'center' }}>
          {/* Left Hero Pitch */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(225, 29, 72, 0.15)',
                border: '1px solid rgba(225, 29, 72, 0.35)',
                padding: '4px 12px',
                borderRadius: '20px',
                color: '#FDA4AF',
                fontSize: '12px',
                fontWeight: 700,
                marginBottom: '16px',
              }}
            >
              <Sparkles size={13} color="#E11D48" />
              <span>Nigeria's Authentic Multi-Vendor Digital Marketplace</span>
            </div>

            <h1
              style={{
                fontSize: '38px',
                fontWeight: 900,
                lineHeight: 1.15,
                margin: '0 0 16px 0',
                letterSpacing: '-0.02em',
              }}
            >
              Everything you need.<br />
              <span style={{ color: '#FDE68A' }}>One authentic place.</span>
            </h1>

            <p style={{ fontSize: '15px', color: '#CBD5E1', lineHeight: 1.6, margin: '0 0 24px 0', maxWidth: '540px' }}>
              Shop genuine flagship smartphones, ultra-fast laptops, premium audio, lifestyle fashion, and bulk provisions — delivered nationwide with instant escrow buyer protection.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  window.scrollTo({ top: 600, behavior: 'smooth' });
                }}
                style={{
                  backgroundColor: '#E11D48',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 10px 15px -3px rgba(225, 29, 72, 0.3)',
                }}
              >
                <span>Explore All Departments</span>
                <ArrowRight size={15} />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('flash-deals-strip');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Zap size={14} color="#F59E0B" />
                <span>Today's Flash Deals</span>
              </button>
            </div>

            {/* Micro Trust Proofs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '32px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>100%</div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>Genuine Brands Only</div>
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#FDE68A' }}>24 - 48 Hrs</div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>Express Dispatch</div>
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#10B981' }}>7 Days</div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>Escrow Return Window</div>
              </div>
            </div>
          </div>

          {/* Right Hero Spotlight Product Card */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                padding: '20px',
                maxWidth: '420px',
                width: '100%',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', height: '220px', backgroundColor: '#020617' }}>
                <img
                  src={CATALOG_PRODUCTS[0].imageUrl}
                  alt={CATALOG_PRODUCTS[0].title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    backgroundColor: '#E11D48',
                    color: '#FFFFFF',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                  }}
                >
                  Featured Spotlight
                </span>
                <span
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: '#0F172A',
                    color: '#38BDF8',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                  }}
                >
                  Manga Express
                </span>
              </div>

              <div style={{ fontSize: '12px', color: '#38BDF8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                {CATALOG_PRODUCTS[0].brand}
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 10px 0', color: '#FFFFFF', lineHeight: 1.3 }}>
                {CATALOG_PRODUCTS[0].title}
              </h3>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
                <span style={{ fontSize: '22px', fontWeight: 900, color: '#FDE68A', fontVariantNumeric: 'tabular-nums' }}>
                  {CATALOG_PRODUCTS[0].winningOffer.priceFormatted}
                </span>
                <span style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'line-through' }}>
                  {CATALOG_PRODUCTS[0].originalPriceFormatted}
                </span>
                <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>
                  -{CATALOG_PRODUCTS[0].discountPercent}%
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setSelectedProductForOffers(CATALOG_PRODUCTS[0])}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Compare All Sellers
                </button>
                <button
                  onClick={() => handleAddToCart(CATALOG_PRODUCTS[0], CATALOG_PRODUCTS[0].winningOffer)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#E11D48',
                    border: 'none',
                    color: '#FFFFFF',
                    borderRadius: '8px',
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
        </div>
      </section>

      {/* 6. LIGHTNING DEALS & FLASH SALES STRIP (Zavora & Jumia Flash Sales Portal) */}
      <section
        id="flash-deals-strip"
        style={{
          maxWidth: '1360px',
          margin: '32px auto 0',
          padding: '0 24px',
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
          }}
        >
          {/* Flash Sales Header with Countdown Clock */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #F1F5F9', paddingBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#FFF1F2',
                  color: '#E11D48',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Zap size={18} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                  Lightning Flash Deals
                </h2>
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  Limited-quantity stock directly authorized by national distributors
                </span>
              </div>
            </div>

            {/* Countdown Timer Display */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} color="#E11D48" /> Time Remaining:
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <span style={{ backgroundColor: '#0F172A', color: '#FFFFFF', padding: '3px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span style={{ color: '#0F172A', fontWeight: 800 }}>:</span>
                <span style={{ backgroundColor: '#0F172A', color: '#FFFFFF', padding: '3px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span style={{ color: '#0F172A', fontWeight: 800 }}>:</span>
                <span style={{ backgroundColor: '#E11D48', color: '#FFFFFF', padding: '3px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>
          </div>

          {/* Flash Deals Horizontal Carousel/Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {CATALOG_PRODUCTS.filter((p) => p.isFlashDeal).map((item) => (
              <div
                key={`flash-${item.id}`}
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '12px',
                  backgroundColor: '#FFFFFF',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ position: 'relative', height: '140px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#F8FAFC', marginBottom: '10px' }}>
                    <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: '6px', left: '6px', backgroundColor: '#E11D48', color: '#FFFFFF', fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                      -{item.discountPercent}%
                    </span>
                  </div>

                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>{item.brand}</div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '2px 0 8px 0', color: '#0F172A', lineHeight: 1.3, height: '34px', overflow: 'hidden' }}>
                    {item.title}
                  </h4>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>
                      {item.winningOffer.priceFormatted}
                    </span>
                    <span style={{ fontSize: '11px', color: '#94A3B8', textDecoration: 'line-through' }}>
                      {item.originalPriceFormatted}
                    </span>
                  </div>

                  {/* Claim Progress Bar */}
                  {item.flashClaimedPercent && (
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748B', marginBottom: '3px' }}>
                        <span>Claimed: <strong>{item.flashClaimedPercent}%</strong></span>
                        <span style={{ color: '#E11D48', fontWeight: 700 }}>Only {item.scarcityCount} left</span>
                      </div>
                      <div style={{ height: '5px', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${item.flashClaimedPercent}%`,
                            backgroundColor: '#E11D48',
                            borderRadius: '3px',
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleAddToCart(item, item.winningOffer)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Grab Deal
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. OFFICIAL BRAND STORES MALL (Jumia Official Stores & Konga Mall) */}
      <section style={{ maxWidth: '1360px', margin: '28px auto 0', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
              Official Brand Stores
            </h3>
            <span style={{ fontSize: '12px', color: '#64748B' }}>
              Direct distributor accreditation with full manufacturer warranties
            </span>
          </div>
          <span style={{ fontSize: '12px', color: '#E11D48', fontWeight: 700, cursor: 'pointer' }}>
            View All Brands →
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
          {[
            { name: 'Apple Authorized', category: 'Smartphones & Tablets', color: '#0F172A' },
            { name: 'Sony Nigeria', category: 'Audio & Visual', color: '#1E293B' },
            { name: 'Samsung Official', category: 'Galaxy Series & Home', color: '#1E3A8A' },
            { name: 'Logitech Workspace', category: 'Ergonomic Computing', color: '#064E3B' },
            { name: 'Olori Botanicals', category: 'African Skincare', color: '#831843' },
            { name: 'AfroThreads Couture', category: 'African Luxury Wear', color: '#701A75' },
          ].map((brand) => (
            <div
              key={brand.name}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                padding: '14px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#E11D48')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#E2E8F0')}
            >
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginBottom: '3px' }}>
                {brand.name}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>{brand.category}</div>
              <div style={{ marginTop: '6px', display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '10px', color: '#10B981', fontWeight: 700 }}>
                <CheckCircle2 size={11} /> 100% Genuine
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. MAIN PRODUCT CATALOG GRID WITH AMAZON-STYLE BUY-BOX CARDS */}
      <main style={{ maxWidth: '1360px', margin: '32px auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
              {selectedCategory === 'all'
                ? 'Curated Products & Verified Offers'
                : `Department: ${selectedCategory.toUpperCase()}`}
            </h2>
            <span style={{ fontSize: '13px', color: '#64748B' }}>
              Showing {filteredProducts.length} items ranked by Manga Buy-Box Landed Price Algorithm
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '12px', color: '#64748B' }}>Delivery City:</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', backgroundColor: '#FFFFFF', padding: '6px 12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              {deliveryLocation}
            </span>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '20px' }}>
          {filteredProducts.map((product) => {
            const isWishlisted = wishlist.includes(product.id);
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
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
                  transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                }}
              >
                <div>
                  {/* Image Container with Wishlist & Badges */}
                  <div style={{ position: 'relative', height: '220px', backgroundColor: '#F8FAFC', overflow: 'hidden' }}>
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {/* Discount Tag */}
                    <span
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        backgroundColor: '#E11D48',
                        color: '#FFFFFF',
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      -{product.discountPercent}%
                    </span>

                    {/* Manga Express Tag */}
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '10px',
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        color: '#38BDF8',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <Truck size={11} /> Next-Day Delivery
                    </span>

                    {/* Wishlist Heart Button */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      aria-label="Save item to wishlist"
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '20px',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                    >
                      <Heart size={16} color={isWishlisted ? '#E11D48' : '#64748B'} fill={isWishlisted ? '#E11D48' : 'none'} />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                        {product.brand}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: '#D97706', fontWeight: 700 }}>
                        <Star size={12} fill="#D97706" color="#D97706" />
                        <span>{product.rating} ({product.reviewsCount})</span>
                      </div>
                    </div>

                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: '0 0 10px 0', lineHeight: 1.4, minHeight: '40px' }}>
                      {product.title}
                    </h3>

                    {/* Price Breakdown */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>
                        {product.winningOffer.priceFormatted}
                      </span>
                      <span style={{ fontSize: '12px', color: '#94A3B8', textDecoration: 'line-through' }}>
                        {product.originalPriceFormatted}
                      </span>
                    </div>

                    {/* Amazon-Style Buy-Box Winner Badge */}
                    <div
                      style={{
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        padding: '10px',
                        fontSize: '11px',
                        marginBottom: '14px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ color: '#475569' }}>
                          Sold by: <strong style={{ color: '#0F172A' }}>{product.winningOffer.vendorName}</strong>
                        </span>
                        <span style={{ color: '#10B981', fontWeight: 700, fontSize: '10px' }}>
                          {product.winningOffer.fulfillmentScorePercent}% Rating
                        </span>
                      </div>
                      <div style={{ color: '#64748B' }}>
                        Dispatched from: {product.winningOffer.warehouseLocation}
                      </div>
                      <div style={{ color: '#059669', fontWeight: 600, marginTop: '3px' }}>
                        SLA: Dispatches within {product.winningOffer.dispatchHours} hours
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div style={{ padding: '0 16px 16px 16px', display: 'flex', gap: '8px' }}>
                  {product.otherOffers.length > 0 && (
                    <button
                      onClick={() => setSelectedProductForOffers(product)}
                      style={{
                        flex: 1,
                        padding: '9px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        color: '#334155',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Compare ({product.otherOffers.length + 1})
                    </button>
                  )}
                  <button
                    onClick={() => handleAddToCart(product, product.winningOffer)}
                    style={{
                      flex: 1,
                      padding: '9px',
                      backgroundColor: '#E11D48',
                      border: 'none',
                      color: '#FFFFFF',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                    }}
                  >
                    <ShoppingBag size={14} /> Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* 9. AMAZON-STYLE BUY-BOX MULTI-VENDOR COMPARISON MODAL */}
      {selectedProductForOffers && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              border: '1px solid #E2E8F0',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>
                  Merchant Offer Matrix & Buy-Box Breakdown
                </h3>
                <span style={{ fontSize: '12px', color: '#64748B' }}>{selectedProductForOffers.title}</span>
              </div>
              <button
                onClick={() => setSelectedProductForOffers(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#475569', marginBottom: '16px' }}>
              Manga independently ranks offers based on <strong>landed price</strong>, <strong>dispatch SLA</strong>, and <strong>merchant fulfillment history</strong>. You can choose any competing seller below:
            </p>

            {/* Winning Offer Card */}
            <div
              style={{
                border: '2px solid #E11D48',
                borderRadius: '10px',
                padding: '16px',
                backgroundColor: '#FFF1F2',
                marginBottom: '14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ backgroundColor: '#E11D48', color: '#FFFFFF', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>
                  ★ Recommended Buy-Box Winner
                </span>
                <span style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>
                  {selectedProductForOffers.winningOffer.priceFormatted}
                </span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>
                {selectedProductForOffers.winningOffer.vendorName}
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                Origin: {selectedProductForOffers.winningOffer.warehouseLocation} • Carrier: {selectedProductForOffers.winningOffer.shippingCarrier}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                <span style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>
                  ✓ Guaranteed dispatch in {selectedProductForOffers.winningOffer.dispatchHours} hours
                </span>
                <button
                  onClick={() => {
                    handleAddToCart(selectedProductForOffers, selectedProductForOffers.winningOffer);
                    setSelectedProductForOffers(null);
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#E11D48',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Select Winner Offer
                </button>
              </div>
            </div>

            {/* Other Competing Offers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedProductForOffers.otherOffers.map((offer) => (
                <div
                  key={offer.vendorId}
                  style={{
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '14px',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#0F172A' }}>{offer.vendorName}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>
                      {offer.warehouseLocation} • {offer.fulfillmentScorePercent}% Fulfillment Score
                    </div>
                    <div style={{ fontSize: '11px', color: '#334155', marginTop: '2px' }}>
                      Dispatches in {offer.dispatchHours} hours via {offer.shippingCarrier}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', fontVariantNumeric: 'tabular-nums', marginBottom: '6px' }}>
                      {offer.priceFormatted}
                    </div>
                    <button
                      onClick={() => {
                        handleAddToCart(selectedProductForOffers, offer);
                        setSelectedProductForOffers(null);
                      }}
                      style={{
                        padding: '6px 14px',
                        backgroundColor: '#0F172A',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Choose Seller
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 10. MULTI-VENDOR SLIDE-OVER CART DRAWER (Amazon / Zavora / Glows Collection) */}
      {isCartOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            zIndex: 90,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: '480px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-10px 0 25px -5px rgba(0,0,0,0.2)',
            }}
          >
            {/* Cart Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingBag size={20} color="#E11D48" />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                  Your Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Free Shipping Progress Indicator (Amazon / Zavora Style) */}
            <div style={{ padding: '12px 20px', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: '#334155', fontWeight: 600 }}>
                  {isFreeDeliveryQualified ? (
                    <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={13} /> You unlocked FREE Express Delivery!
                    </span>
                  ) : (
                    <span>Add <strong>{formatNaira(amountNeededForFreeDelivery)}</strong> more for <strong>FREE Delivery</strong></span>
                  )}
                </span>
                <span style={{ fontWeight: 700, color: '#64748B' }}>{freeDeliveryProgressPercent}%</span>
              </div>
              <div style={{ height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${freeDeliveryProgressPercent}%`,
                    backgroundColor: isFreeDeliveryQualified ? '#10B981' : '#E11D48',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>

            {/* Cart Items Segregated by Merchant Parcel Containers (§6.1) */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: '#64748B' }}>
                  <ShoppingBag size={48} color="#CBD5E1" style={{ margin: '0 auto 12px' }} />
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '15px' }}>Your shopping cart is empty.</p>
                  <p style={{ fontSize: '13px', marginTop: '4px' }}>Explore authentic products across our official brand mall.</p>
                </div>
              ) : (
                Object.entries(shipmentGroups).map(([vendorId, group], index) => (
                  <div
                    key={vendorId}
                    style={{
                      border: '1px solid #E2E8F0',
                      borderRadius: '10px',
                      marginBottom: '16px',
                      overflow: 'hidden',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    {/* Parcel Group Header */}
                    <div style={{ backgroundColor: '#F1F5F9', padding: '8px 12px', borderBottom: '1px solid #E2E8F0', fontSize: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontWeight: 700, color: '#0F172A' }}>Package {index + 1} of {parcelCount}:</span>{' '}
                        <span style={{ color: '#475569' }}>Dispatched by {group.vendorName}</span>
                      </div>
                      <span style={{ color: '#059669', fontWeight: 600 }}>{group.carrier}</span>
                    </div>

                    {/* Parcel Items */}
                    <div style={{ padding: '12px' }}>
                      {group.items.map((item) => (
                        <div
                          key={`${item.productId}-${item.vendorId}`}
                          style={{
                            display: 'flex',
                            gap: '12px',
                            marginBottom: '12px',
                            paddingBottom: '12px',
                            borderBottom: '1px solid #F8FAFC',
                          }}
                        >
                          <img src={item.imageUrl} alt={item.title} style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '6px' }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', lineHeight: 1.3 }}>{item.title}</div>
                            <div style={{ fontSize: '12px', fontWeight: 800, color: '#E11D48', marginTop: '4px', fontVariantNumeric: 'tabular-nums' }}>
                              {item.priceFormatted}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '4px' }}>
                                <button
                                  onClick={() => handleUpdateQuantity(item.productId, item.vendorId, -1)}
                                  style={{ padding: '2px 8px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                                >
                                  -
                                </button>
                                <span style={{ padding: '2px 8px', fontSize: '12px', fontWeight: 700 }}>{item.quantity}</span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.productId, item.vendorId, 1)}
                                  style={{ padding: '2px 8px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => handleUpdateQuantity(item.productId, item.vendorId, -item.quantity)}
                                style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}

              {/* Promo Voucher Input */}
              {cart.length > 0 && (
                <form onSubmit={handleApplyVoucher} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    placeholder="Enter coupon (e.g. MANGAEXPRESS)"
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '8px 14px',
                      backgroundColor: '#0F172A',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Cart Footer Financial Breakdown */}
            {cart.length > 0 && (
              <div style={{ padding: '16px 20px', borderTop: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px', color: '#64748B' }}>
                  <span>Items Subtotal:</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: '#0F172A' }}>{formatNaira(cartSubtotalMinor)}</span>
                </div>
                {appliedDiscountMinor > 0n && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px', color: '#059669' }}>
                    <span>Promo Discount (MANGAEXPRESS):</span>
                    <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>-{formatNaira(appliedDiscountMinor)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px', color: '#64748B' }}>
                  <span>Statutory VAT (7.5%):</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: '#0F172A' }}>{formatNaira(statutoryVatMinor)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '10px', color: '#64748B' }}>
                  <span>Shipping ({parcelCount} {parcelCount === 1 ? 'Package' : 'Packages'}):</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: isFreeDeliveryQualified ? '#059669' : '#0F172A' }}>
                    {isFreeDeliveryQualified ? 'FREE' : formatNaira(shippingFeeMinor)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 900, borderTop: '1px solid #E2E8F0', paddingTop: '10px', marginBottom: '14px' }}>
                  <span>Grand Total:</span>
                  <span style={{ color: '#E11D48', fontVariantNumeric: 'tabular-nums' }}>{formatNaira(grandTotalMinor)}</span>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#E11D48',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Lock size={15} /> Proceed to Secure Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 11. 3-STEP ACCORDION CHECKOUT MODAL (Zavora / Glows Collection Style) */}
      {isCheckoutOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              maxWidth: '640px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              border: '1px solid #E2E8F0',
            }}
          >
            {/* Checkout Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} color="#E11D48" />
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>
                  Manga Escrow Checkout
                </h3>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Stepper Progress */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
              <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: checkoutStep >= 1 ? '#0F172A' : '#F1F5F9', color: checkoutStep >= 1 ? '#FFFFFF' : '#64748B', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>
                1. Delivery Address
              </div>
              <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: checkoutStep >= 2 ? '#0F172A' : '#F1F5F9', color: checkoutStep >= 2 ? '#FFFFFF' : '#64748B', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>
                2. Shipping Speed
              </div>
              <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: checkoutStep === 3 ? '#0F172A' : '#F1F5F9', color: checkoutStep === 3 ? '#FFFFFF' : '#64748B', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>
                3. Secure Payment
              </div>
            </div>

            {/* STEP 1: DELIVERY ADDRESS */}
            {checkoutStep === 1 && (
              <div>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                  Recipient & Nationwide Delivery Details
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Full Name:
                    </label>
                    <input
                      type="text"
                      defaultValue="Chidi Okonkwo"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Phone Number (For Carrier SMS / Driver Handover):
                    </label>
                    <input
                      type="tel"
                      defaultValue="+234 803 123 4567"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Street Address & Landmark:
                    </label>
                    <input
                      type="text"
                      defaultValue="24 Admiralty Way, Lekki Phase 1 (Opposite Filmhouse Cinema)"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                        State:
                      </label>
                      <select style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}>
                        <option>Lagos State</option>
                        <option>Abuja FCT</option>
                        <option>Rivers State</option>
                        <option>Oyo State</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                        Delivery Option:
                      </label>
                      <select
                        value={deliveryMethod}
                        onChange={(e) => setDeliveryMethod(e.target.value as any)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                      >
                        <option value="doorstep">Doorstep Delivery (Home/Office)</option>
                        <option value="pickup">Nearest Carrier Pickup Station</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                    <button
                      onClick={() => setCheckoutStep(2)}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#E11D48',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Continue to Shipping Review →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: SHIPPING SPEED & CONSIGNMENT REVIEW */}
            {checkoutStep === 2 && (
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                  Review {parcelCount} Dispatched Consignment Packages
                </h4>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 14px 0' }}>
                  Because Manga is a multi-vendor marketplace, items will arrive in secure, independent packages directly from each merchant's regional distribution hub:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
                  {Object.entries(shipmentGroups).map(([vId, group], idx) => (
                    <div key={vId} style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                        <span>Package {idx + 1}: {group.vendorName}</span>
                        <span style={{ color: '#059669' }}>Estimated: Tomorrow by 2:00 PM</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>
                        Origin: {group.location} • Carrier: {group.carrier}
                      </div>
                      <div style={{ fontSize: '12px', marginTop: '6px', color: '#334155' }}>
                        {group.items.map((i) => `${i.quantity}x ${i.title}`).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button
                    onClick={() => setCheckoutStep(1)}
                    style={{ padding: '8px 16px', background: 'none', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                  >
                    ← Back to Address
                  </button>
                  <button
                    onClick={() => setCheckoutStep(3)}
                    style={{ padding: '10px 20px', backgroundColor: '#E11D48', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Continue to Payment →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT METHOD */}
            {checkoutStep === 3 && (
              <div>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                  Select Escrow-Protected Payment Method
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: '8px',
                      border: paymentMethod === 'card' ? '2px solid #E11D48' : '1px solid #E2E8F0',
                      backgroundColor: paymentMethod === 'card' ? '#FFF1F2' : '#FFFFFF',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#0F172A' }}>
                        Debit / Credit Card (Mastercard, Visa, Verve)
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>
                        Secured with 256-bit SSL encryption and mandatory 3D Secure bank OTP
                      </div>
                    </div>
                    <CreditCard size={18} color="#E11D48" />
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: '8px',
                      border: paymentMethod === 'bank_transfer' ? '2px solid #E11D48' : '1px solid #E2E8F0',
                      backgroundColor: paymentMethod === 'bank_transfer' ? '#FFF1F2' : '#FFFFFF',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#0F172A' }}>
                        Instant Bank Transfer (Dedicated Virtual Account)
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>
                        Instant account allocation via Wema Bank. Instant confirmation upon transfer
                      </div>
                    </div>
                    <Building size={18} color="#059669" />
                  </label>
                </div>

                {/* Card Inputs Form */}
                {paymentMethod === 'card' && !cardOtpSimulated && (
                  <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '18px' }}>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                        Card Number:
                      </label>
                      <input
                        type="text"
                        defaultValue="5399 4100 8821 9904"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', fontFamily: 'monospace', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                          Expiry (MM/YY):
                        </label>
                        <input
                          type="text"
                          defaultValue="11/28"
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                          CVV:
                        </label>
                        <input
                          type="password"
                          defaultValue="782"
                          maxLength={4}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Card 3DS Simulated Dialog */}
                {cardOtpSimulated && (
                  <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '16px', marginBottom: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1E40AF', fontWeight: 700, fontSize: '13px', marginBottom: '6px' }}>
                      <Lock size={15} /> 3D Secure Verification
                    </div>
                    <p style={{ fontSize: '12px', color: '#3B82F6', margin: '0 0 10px 0' }}>
                      Please enter the 6-digit one-time password sent to your registered phone number (+234 803 *** 4567):
                    </p>
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP (e.g. 881294)"
                      value={simulatedOtpValue}
                      onChange={(e) => setSimulatedOtpValue(e.target.value)}
                      style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #93C5FD', fontSize: '14px', letterSpacing: '3px', fontWeight: 700, width: '180px' }}
                    />
                  </div>
                )}

                {/* Bank Transfer Simulated Account */}
                {paymentMethod === 'bank_transfer' && (
                  <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '14px', marginBottom: '18px' }}>
                    <div style={{ fontSize: '12px', color: '#166534', fontWeight: 700, marginBottom: '6px' }}>
                      Transfer exact amount ({formatNaira(grandTotalMinor)}) to:
                    </div>
                    <div style={{ fontSize: '13px', color: '#0F172A' }}>
                      Bank: <strong>Wema Bank PLC</strong><br />
                      Account Number: <strong style={{ fontSize: '16px', fontFamily: 'monospace', letterSpacing: '1px' }}>8819 204 112</strong><br />
                      Beneficiary: <strong>MANGA ESCROW / CHIDI OKONKWO</strong>
                    </div>
                    <span style={{ fontSize: '11px', color: '#15803D', marginTop: '6px', display: 'block' }}>
                      Account expires in 30 minutes. Payment verifies automatically.
                    </span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    onClick={() => {
                      setCardOtpSimulated(false);
                      setCheckoutStep(2);
                    }}
                    style={{ padding: '8px 16px', background: 'none', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                  >
                    ← Back to Review
                  </button>

                  <button
                    onClick={executeOrderCheckout}
                    disabled={isProcessingCheckout}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#E11D48',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    {isProcessingCheckout ? (
                      'Securing Order...'
                    ) : cardOtpSimulated ? (
                      'Verify & Confirm Payment'
                    ) : (
                      `Pay ${formatNaira(grandTotalMinor)}`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 12. ORDER CONFIRMATION BANNER / SCREEN (Post-Checkout Success) */}
      {orderConfirmed && (
        <section style={{ maxWidth: '900px', margin: '32px auto', padding: '0 24px' }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid #A7F3D0',
              padding: '28px',
              boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '22px',
                  backgroundColor: '#ECFDF5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
                  Order Confirmed & Escrow Secured!
                </h2>
                <span style={{ fontSize: '13px', color: '#64748B' }}>
                  Order Reference: <strong>#{orderConfirmed.orderNumber}</strong> • Placed at {orderConfirmed.placedAt}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.5, margin: '0 0 20px 0' }}>
              Your payment of <strong>{orderConfirmed.grandTotalFormatted}</strong> has been secured in the Manga Escrow Account. Funds will only be disbursed to merchants once you inspect and accept your delivery.
            </p>

            {/* Individual Consignment Packages */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {orderConfirmed.packages.map((pkg: any) => (
                <div
                  key={pkg.packageNumber}
                  style={{
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '14px',
                    backgroundColor: '#F8FAFC',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 800, fontSize: '13px', color: '#0F172A' }}>
                      Package #{pkg.packageNumber}: {pkg.merchantName}
                    </span>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                      Carrier: {pkg.carrier} • Tracking Code: <code style={{ color: '#0F172A', fontWeight: 700 }}>{pkg.trackingNumber}</code>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '12px', color: '#059669', fontWeight: 700 }}>
                      Estimated Arrival: {pkg.estimatedArrival}
                    </span>
                    <div>
                      <button
                        onClick={() => {
                          setTrackingSearchCode(pkg.trackingNumber);
                          setIsTrackingModalOpen(true);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#2563EB',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          marginTop: '4px',
                        }}
                      >
                        Live Carrier Tracking →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setOrderConfirmed(null)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 13. LIVE ORDER TRACKING MODAL (Zavora track_order.php & Glows Collection OrderTracking.tsx) */}
      {isTrackingModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              maxWidth: '640px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              border: '1px solid #E2E8F0',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={20} color="#E11D48" />
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>
                  Live Parcel Delivery Tracker
                </h3>
              </div>
              <button
                onClick={() => setIsTrackingModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Tracking Search Input */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input
                type="text"
                value={trackingSearchCode}
                onChange={(e) => setTrackingSearchCode(e.target.value)}
                placeholder="Enter Manga Tracking Number (e.g. TRK-881294-MNG)"
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                }}
              />
              <button
                style={{
                  padding: '9px 16px',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Locate Parcel
              </button>
            </div>

            {/* Active Consignment Overview */}
            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '8px', padding: '14px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                  Waybill #{trackingSearchCode}
                </span>
                <span style={{ backgroundColor: '#ECFDF5', color: '#065F46', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', border: '1px solid #A7F3D0' }}>
                  In Transit — On Schedule
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#475569' }}>
                Carrier: <strong>GIG Logistics Express Priority</strong> • Route: <strong>Lagos Mainland Hub → Lekki Phase 1</strong>
              </div>
              <div style={{ fontSize: '12px', color: '#059669', fontWeight: 600, marginTop: '4px' }}>
                Estimated Delivery: Tomorrow by 2:00 PM
              </div>
            </div>

            {/* 5-Stage Milestone Stepper (Zavora & Glows Collection Pattern) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingLeft: '12px', borderLeft: '2px solid #E2E8F0', marginLeft: '12px' }}>
              {[
                { title: 'Proof of Delivery Completed', desc: 'Awaiting courier handover to security / resident', completed: false, current: false, time: 'Pending' },
                { title: 'Out for Final Delivery with Courier', desc: 'Driver assigned: Fez Express Rider 04 (Lekki Corridor)', completed: false, current: true, time: 'Today, 2:30 PM' },
                { title: 'Arrived at Regional Distribution Hub', desc: 'Processed at Victoria Island Sort Facility', completed: true, current: false, time: 'Today, 09:15 AM' },
                { title: 'Item Packed & Barcode Verified', desc: 'Slot Systems Direct warehouse staff confirmed serial SKU', completed: true, current: false, time: 'Yesterday, 04:20 PM' },
                { title: 'Order Placed & Escrow Secured', desc: 'Customer payment received into Manga clearing ledger', completed: true, current: false, time: 'Yesterday, 03:45 PM' },
              ].map((step, sIdx) => (
                <div key={sIdx} style={{ position: 'relative', paddingLeft: '16px' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: '-23px',
                      top: '0px',
                      width: '14px',
                      height: '14px',
                      borderRadius: '7px',
                      backgroundColor: step.completed ? '#10B981' : step.current ? '#E11D48' : '#CBD5E1',
                      border: '2px solid #FFFFFF',
                    }}
                  />
                  <div style={{ fontSize: '13px', fontWeight: 700, color: step.current ? '#E11D48' : '#0F172A' }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>{step.desc}</div>
                  <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>{step.time}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button
                onClick={() => setIsTrackingModalOpen(false)}
                style={{ padding: '8px 16px', backgroundColor: '#0F172A', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
              >
                Close Tracker
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 14. SAVED WISHLIST DRAWER (Zavora & Glows Collection Style) */}
      {isWishlistOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            zIndex: 90,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: '440px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-10px 0 25px -5px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Heart size={20} color="#E11D48" fill="#E11D48" />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                  Saved Wishlist ({wishlist.length})
                </h3>
              </div>
              <button
                onClick={() => setIsWishlistOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              {wishlist.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: '#64748B' }}>
                  <Heart size={44} color="#CBD5E1" style={{ margin: '0 auto 12px' }} />
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '15px' }}>Your Wishlist is empty.</p>
                  <p style={{ fontSize: '12px', marginTop: '4px' }}>Click the heart icon on any product to save it for later.</p>
                </div>
              ) : (
                wishlist.map((id) => {
                  const item = CATALOG_PRODUCTS.find((p) => p.id === id);
                  if (!item) return null;
                  return (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        borderBottom: '1px solid #F1F5F9',
                        paddingBottom: '14px',
                        marginBottom: '14px',
                        alignItems: 'center',
                      }}
                    >
                      <img src={item.imageUrl} alt={item.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', lineHeight: 1.3 }}>{item.title}</div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#E11D48', marginTop: '3px' }}>
                          {item.winningOffer.priceFormatted}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                          <button
                            onClick={() => {
                              handleAddToCart(item, item.winningOffer);
                              toggleWishlist(item.id);
                            }}
                            style={{
                              padding: '4px 10px',
                              backgroundColor: '#E11D48',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Move to Cart
                          </button>
                          <button
                            onClick={() => toggleWishlist(item.id)}
                            style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* 15. FLOATING WHATSAPP SHOPPING CONCIERGE (Glows Collection WhatsAppConciergeButton) */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 60 }}>
        {isWhatsAppOpen ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.25)',
              border: '1px solid #E2E8F0',
              width: '320px',
              overflow: 'hidden',
              marginBottom: '12px',
            }}
          >
            {/* Header */}
            <div style={{ backgroundColor: '#075E54', color: '#FFFFFF', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '16px', backgroundColor: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageCircle size={18} color="#FFFFFF" />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800 }}>Manga Shopping Concierge</div>
                  <div style={{ fontSize: '10px', color: '#A7F3D0' }}>Online • Replies within 2 mins</div>
                </div>
              </div>
              <button
                onClick={() => setIsWhatsAppOpen(false)}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '14px', backgroundColor: '#ECE5DD' }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', color: '#0F172A', maxWidth: '85%', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                Hello Chidi! Looking for assistance with product authentication, delivery timelines in Lagos, or bulk discounts?
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ padding: '10px 12px', backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
              <a
                href="https://wa.me/2347006264264?text=Hi%20Manga%20Concierge,%20I%20need%20help%20with%20an%20order"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  padding: '9px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                <MessageCircle size={14} /> Open Chat on WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsWhatsAppOpen(true)}
            aria-label="Open Shopping Concierge"
            style={{
              backgroundColor: '#25D366',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '28px',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 10px 20px -3px rgba(37, 211, 102, 0.4)',
            }}
          >
            <MessageCircle size={18} />
            <span>Chat with Concierge</span>
          </button>
        )}
      </div>

      {/* 16. TRUST PILLARS & FOOTER (Konga / Jumia / Zavora Style) */}
      <footer style={{ backgroundColor: '#020617', color: '#CBD5E1', borderTop: '1px solid #1E293B', marginTop: '60px' }}>
        {/* 4 Trust Pillars */}
        <div style={{ borderBottom: '1px solid #1E293B', padding: '32px 24px' }}>
          <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <ShieldCheck size={28} color="#E11D48" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', marginBottom: '3px' }}>
                  Escrow Buyer Protection
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                  Your money is safely locked in platform escrow until you inspect and accept your delivery.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Award size={28} color="#F59E0B" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', marginBottom: '3px' }}>
                  100% Genuine Certified
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                  Only authorized national distributors and verified Tier-2 merchants are allowed to list.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Truck size={28} color="#38BDF8" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', marginBottom: '3px' }}>
                  Nationwide Express Logistics
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                  Next-day dispatch via GIG Logistics, Red Star Express, and Fez Delivery across 36 states.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Headphones size={28} color="#10B981" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', marginBottom: '3px' }}>
                  Dedicated Lagos Support
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                  Call our toll-free line 0700-MANGA-NG or reach our WhatsApp Concierge 7 days a week.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Directory & Copyright Links */}
        <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '36px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#E11D48', marginBottom: '10px' }}>
              MANGA
            </div>
            <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.6, margin: '0 0 12px 0' }}>
              Nigeria's independent high-density e-commerce marketplace engineered for authentic consumer electronics, lifestyle fashion, and verified home essentials.
            </p>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              © 2026 Manga Technologies Limited. All rights reserved.
            </div>
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
              Customer Hub
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
              <span onClick={() => setIsTrackingModalOpen(true)} style={{ cursor: 'pointer', color: '#94A3B8' }}>Track Your Order</span>
              <span style={{ color: '#94A3B8' }}>Escrow Guarantee Terms</span>
              <span style={{ color: '#94A3B8' }}>Returns & Refund Policy</span>
              <span style={{ color: '#94A3B8' }}>Frequently Asked Questions</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
              Merchant Services
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
              <a href="http://localhost:3001" target="_blank" rel="noreferrer" style={{ color: '#FDE68A', textDecoration: 'none' }}>
                Vendor Operations Console
              </a>
              <span style={{ color: '#94A3B8' }}>Merchant Accreditation Tiers</span>
              <span style={{ color: '#94A3B8' }}>Fulfillment & Barcode Scanning SLA</span>
              <span style={{ color: '#94A3B8' }}>NUBAN Payout Schedules</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
              Payment Methods
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {['Mastercard', 'Visa', 'Verve', 'Paystack', 'Wema Bank', 'OPay'].map((g) => (
                <span key={g} style={{ backgroundColor: '#1E293B', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, color: '#E2E8F0' }}>
                  {g}
                </span>
              ))}
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              256-bit SSL Bank-Grade Encryption
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
