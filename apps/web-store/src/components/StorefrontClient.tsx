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

// ==========================================
// NOK MOTIFS (Section 1.5 of Design Prompt)
// ==========================================
const NokTriangleEye: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({
  size = 20,
  color = '#B5532E',
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
  >
    <path
      d="M12 3L21 19H3L12 3Z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="13.5" r="2.5" fill={color} />
    <path d="M7 16H17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const NokCoilPattern: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({
  size = 24,
  color = '#D9A441',
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
  >
    <path
      d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"
      stroke={color}
      strokeWidth="1.75"
    />
    <path
      d="M12 6a6 6 0 1 1 -5.6 8.2"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
    />
    <path
      d="M12 2a10 10 0 1 1 -9.5 13.2"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>
);

// ==========================================
// DATA MODELS
// ==========================================
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
  deliveryPromiseDate: string;
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

// Curated Nigerian Catalog with Nok Heritage & Authentic Electronics
export const CATALOG_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-001',
    title: 'Apple iPhone 15 Pro Max 256GB - Natural Titanium (Direct Distributor)',
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
    deliveryPromiseDate: 'Arrives Tomorrow by 2:00 PM',
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
    deliveryPromiseDate: 'Arrives Tomorrow by 4:00 PM',
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
    deliveryPromiseDate: 'Arrives Thursday by 12:00 PM',
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
    deliveryPromiseDate: 'Arrives Tomorrow by 1:00 PM',
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
    deliveryPromiseDate: 'Arrives Wednesday by 3:00 PM',
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
    deliveryPromiseDate: 'Arrives Tomorrow by 11:00 AM',
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
  const [wishlist, setWishlist] = React.useState<string[]>(['prod-001', 'prod-003']);
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

  // Financial Calculations (Exact minor units)
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
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F6EDE0', // Clay Cream (§1.2)
        color: '#2A2320',           // Iron (§1.2)
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 100,
            backgroundColor: '#2A2320',
            color: '#F6EDE0',
            padding: '12px 18px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            boxShadow: '0 8px 24px rgba(42, 35, 32, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            border: '1px solid #8F3B1F',
          }}
        >
          <CheckCircle2 size={16} color="#4F6B3A" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP PROMOTIONAL ANNOUNCEMENT TICKER (Section 1.2 & Section 3.1) */}
      {!announcementDismissed && (
        <div
          style={{
            backgroundColor: '#2A2320', // Iron
            color: '#F6EDE0',           // Clay Cream
            fontSize: '12px',
            padding: '7px 16px',
            borderBottom: '1px solid rgba(231, 213, 188, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span
              style={{
                backgroundColor: '#B5532E', // Terracotta
                color: '#FFFFFF',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              NOK HERITAGE SALE
            </span>
            <span>
              Save <strong>₦3,500</strong> on orders above ₦50,000 + Free Express Delivery across Lagos & Abuja with code:
            </span>
            <button
              onClick={copyPromoCode}
              style={{
                backgroundColor: 'rgba(217, 164, 65, 0.15)', // Ochre tint
                border: '1px dashed #D9A441',
                color: '#D9A441',
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
              {codeCopied ? <CheckCheck size={12} color="#4F6B3A" /> : <Copy size={12} />}
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
              color: '#8C8279',
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

      {/* 2. TOP UTILITY TRUST & SERVICE BAR (Section 1.2 & Section 3.1) */}
      <div
        style={{
          backgroundColor: '#1E1815', // Dark Iron
          color: '#E7D5BC',           // Dry Sand
          fontSize: '11px',
          borderBottom: '1px solid rgba(231, 213, 188, 0.1)',
          padding: '6px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#D9A441', fontWeight: 700 }}>
            <NokTriangleEye size={14} color="#D9A441" /> Manga Official Mall (100% Genuine Certified)
          </span>
          <span style={{ color: '#4A3F39' }}>|</span>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              onClick={() => setLocationPickerOpen(!locationPickerOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: '#E7D5BC',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                padding: 0,
              }}
            >
              <MapPin size={12} color="#B5532E" />
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
                  color: '#2A2320',
                  borderRadius: '8px',
                  boxShadow: '0 8px 24px rgba(42, 35, 32, 0.15)',
                  border: '1px solid #E7D5BC',
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
                      background: loc === deliveryLocation ? '#F6EDE0' : 'none',
                      border: 'none',
                      borderRadius: '5px',
                      fontSize: '12px',
                      fontWeight: loc === deliveryLocation ? 700 : 500,
                      cursor: 'pointer',
                      color: loc === deliveryLocation ? '#B5532E' : '#2A2320',
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
              color: '#E7D5BC',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              padding: 0,
            }}
          >
            <Truck size={12} color="#D9A441" />
            <span>Track Order</span>
          </button>
          <span style={{ color: '#4A3F39' }}>|</span>
          <a
            href="tel:07006264264"
            style={{ color: '#E7D5BC', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Headphones size={12} color="#4F6B3A" />
            <span>Help: 0700-MANGA-NG</span>
          </a>
          <span style={{ color: '#4A3F39' }}>|</span>
          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#D9A441', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Building size={12} />
            <span>Sell on Manga</span>
          </a>
          <span style={{ color: '#4A3F39' }}>|</span>
          <a
            href="http://localhost:3002"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#B5532E', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <ShieldCheck size={12} />
            <span>Admin</span>
          </a>
          <span style={{ color: '#4A3F39' }}>•</span>
          <span style={{ color: '#FFFFFF', fontWeight: 800 }}>NGN (₦)</span>
        </div>
      </div>

      {/* 3. MAIN NAVIGATION BAR (Paper Surface with Terracotta & Iron Accents) */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: '#FFFFFF', // Paper
          borderBottom: '1px solid #E7D5BC',
          boxShadow: '0 1px 2px rgba(42, 35, 32, 0.06)',
          padding: '12px 24px',
        }}
      >
        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          
          {/* Logo & Nok Heritage Lockup */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <NokTriangleEye size={24} color="#B5532E" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: 'Fraunces, Georgia, serif',
                  fontSize: '26px',
                  fontWeight: 900,
                  color: '#2A2320', // Iron
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                }}
              >
                Manga<span style={{ color: '#B5532E' }}>.</span>
              </span>
              <span style={{ fontSize: '9px', fontWeight: 700, color: '#8C8279', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                NOK HERITAGE MALL
              </span>
            </div>
          </div>

          {/* Search Bar with Department Scope & Autocomplete */}
          <div style={{ flex: 1, maxWidth: '720px', position: 'relative' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#F6EDE0', // Clay Cream
                borderRadius: '8px',
                border: '1.5px solid #E7D5BC',
                overflow: 'hidden',
                transition: 'border-color 0.15s ease',
              }}
            >
              <select
                value={searchDepartmentScope}
                onChange={(e) => setSearchDepartmentScope(e.target.value)}
                style={{
                  backgroundColor: '#E7D5BC',
                  border: 'none',
                  borderRight: '1px solid #D8C3A5',
                  padding: '10px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#2A2320',
                  outline: 'none',
                  cursor: 'pointer',
                  maxWidth: '140px',
                }}
              >
                <option value="all">All Departments</option>
                <option value="smartphones">Phones & Tablets</option>
                <option value="computing">Laptops & PC</option>
                <option value="audio">Audio & Sound</option>
                <option value="fashion">Fashion & Textiles</option>
                <option value="beauty">Beauty & Glow</option>
                <option value="groceries">Supermarket</option>
              </select>

              <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchSuggestionsOpen(true);
                  }}
                  onFocus={() => setSearchSuggestionsOpen(true)}
                  placeholder="Search authentic electronics, Nok craft, verified textiles, smartphones..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '13px',
                    outline: 'none',
                    color: '#2A2320',
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{ background: 'none', border: 'none', color: '#8C8279', cursor: 'pointer', padding: '0 8px' }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <button
                type="button"
                style={{
                  backgroundColor: '#B5532E', // Terracotta
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

            {/* Instant Search Suggestions */}
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
                  boxShadow: '0 8px 24px rgba(42, 35, 32, 0.12)',
                  border: '1px solid #E7D5BC',
                  padding: '8px',
                  zIndex: 70,
                }}
              >
                <div style={{ padding: '4px 8px', fontSize: '11px', fontWeight: 700, color: '#8C8279', textTransform: 'uppercase' }}>
                  Matching Verified Products
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
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={prod.imageUrl} alt={prod.title} style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#2A2320' }}>{prod.title}</div>
                        <div style={{ fontSize: '11px', color: '#8C8279' }}>
                          {prod.winningOffer.vendorName} • <strong style={{ color: '#B5532E' }}>{prod.winningOffer.priceFormatted}</strong>
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
                        backgroundColor: '#2A2320',
                        color: '#F6EDE0',
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
                  backgroundColor: '#F6EDE0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4F6B3A',
                }}
              >
                <CheckCircle2 size={16} color="#4F6B3A" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '10px', color: '#8C8279' }}>Welcome, Chidi</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#2A2320', display: 'flex', alignItems: 'center', gap: '2px' }}>
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
                color: '#2A2320',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Heart size={20} color={wishlist.length > 0 ? '#B5532E' : '#8C8279'} fill={wishlist.length > 0 ? '#B5532E' : 'none'} />
              <span style={{ fontSize: '12px', fontWeight: 600 }} className="hidden md:inline">Saved</span>
              {wishlist.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    left: '20px',
                    backgroundColor: '#B5532E',
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
                backgroundColor: '#2A2320', // Iron
                color: '#F6EDE0',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 14px',
                cursor: 'pointer',
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
                      backgroundColor: '#B5532E',
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
                <span style={{ fontSize: '10px', color: '#D9A441', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Cart</span>
                <span style={{ fontSize: '12px', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                  {formatNaira(cartSubtotalMinor)}
                </span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* 4. DEPARTMENT BAR (Warm Clay & Iron Sub-Header) */}
      <nav
        style={{
          backgroundColor: '#2A2320', // Iron
          color: '#F6EDE0',
          borderBottom: '1px solid rgba(231, 213, 188, 0.1)',
          padding: '0 24px',
        }}
      >
        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflowX: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {[
              { id: 'all', label: 'All Craft & Goods', icon: Layers },
              { id: 'smartphones', label: 'Phones & Tablets', icon: Smartphone },
              { id: 'computing', label: 'Laptops & Computing', icon: Laptop },
              { id: 'audio', label: 'Audio & Sound', icon: Headphones },
              { id: 'fashion', label: 'Textiles & Aso-Oke', icon: Shirt },
              { id: 'beauty', label: 'Oils & Shea Botanicals', icon: Sparkle },
              { id: 'groceries', label: 'Supermarket Provisions', icon: ShoppingBasket },
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
                    color: isActive ? '#FFFFFF' : '#E7D5BC',
                    fontSize: '12px',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    borderBottom: isActive ? '3px solid #B5532E' : '3px solid transparent',
                  }}
                >
                  <IconComp size={13} color={isActive ? '#B5532E' : '#8C8279'} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '16px' }}>
            <button
              onClick={() => {
                const el = document.getElementById('flash-deals-strip');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                backgroundColor: 'rgba(181, 83, 46, 0.25)',
                border: '1px solid rgba(181, 83, 46, 0.5)',
                color: '#F8ECE7',
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
              <Zap size={12} color="#D9A441" />
              <span>Kiln Flash Deals</span>
            </button>
            <span style={{ fontSize: '11px', color: '#D9A441', fontWeight: 600, whiteSpace: 'nowrap' }}>
              Express 24-48h Delivery
            </span>
          </div>
        </div>
      </nav>

      {/* 5. HERO SHOWCASE: "From the Kiln to Your Door" (Section 1.1 & Section 3.3) */}
      <section
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #1E1815 0%, #2A2320 60%, #4A2216 100%)', // Fired clay & Iron
          color: '#FFFFFF',
          padding: '44px 24px',
          overflow: 'hidden',
          borderBottom: '2px solid #8F3B1F',
        }}
      >
        {/* Subtle Nok Coil Ambient Ornament */}
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', opacity: 0.06, pointerEvents: 'none' }}>
          <NokCoilPattern size={400} color="#F6EDE0" />
        </div>

        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', alignItems: 'center', position: 'relative', zIndex: 10 }}>
          {/* Left Hero Story & Value Proposition */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(181, 83, 46, 0.2)',
                border: '1px solid rgba(217, 164, 65, 0.4)',
                padding: '4px 12px',
                borderRadius: '20px',
                color: '#D9A441', // Ochre Gold
                fontSize: '12px',
                fontWeight: 700,
                marginBottom: '16px',
              }}
            >
              <NokTriangleEye size={13} color="#D9A441" />
              <span>Manga — Originating from Ancient Nok Metal & Clay Heritage</span>
            </div>

            <h1
              style={{
                fontFamily: 'Fraunces, Georgia, serif',
                fontSize: '40px',
                fontWeight: 800,
                lineHeight: 1.15,
                margin: '0 0 16px 0',
                letterSpacing: '-0.02em',
                color: '#F6EDE0', // Clay Cream
              }}
            >
              From the kiln to your door.<br />
              <span style={{ color: '#D9A441' }}>Craft, technology & trust.</span>
            </h1>

            <p style={{ fontSize: '15px', color: '#E7D5BC', lineHeight: 1.65, margin: '0 0 24px 0', maxWidth: '520px' }}>
              Shop genuine flagship devices, hand-woven luxury textiles, organic shea botanicals, and certified computing — delivered nationwide with immutable escrow buyer protection.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  window.scrollTo({ top: 680, behavior: 'smooth' });
                }}
                style={{
                  backgroundColor: '#B5532E', // Terracotta
                  color: '#FFFFFF',
                  border: '1px solid #8F3B1F',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(181, 83, 46, 0.3)',
                }}
              >
                <span>Explore All Departments</span>
                <ArrowRight size={15} />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('heritage-story');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  backgroundColor: 'rgba(246, 237, 224, 0.08)',
                  color: '#F6EDE0',
                  border: '1px solid rgba(231, 213, 188, 0.3)',
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
                <NokTriangleEye size={14} color="#D9A441" />
                <span>The Manga Heritage Story</span>
              </button>
            </div>

            {/* Micro Trust Proofs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '32px', paddingTop: '20px', borderTop: '1px solid rgba(231, 213, 188, 0.15)' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'Fraunces, serif' }}>100%</div>
                <div style={{ fontSize: '11px', color: '#E7D5BC' }}>Genuine Certified Brands</div>
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#D9A441', fontFamily: 'Fraunces, serif' }}>24 - 48 Hrs</div>
                <div style={{ fontSize: '11px', color: '#E7D5BC' }}>Express Nationwide Dispatch</div>
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#4F6B3A', fontFamily: 'Fraunces, serif' }}>7 Days</div>
                <div style={{ fontSize: '11px', color: '#E7D5BC' }}>Escrow Return Protection</div>
              </div>
            </div>
          </div>

          {/* Right Hero Spotlight Product Card */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                backgroundColor: '#FFFFFF', // Paper
                borderRadius: '16px',
                padding: '20px',
                maxWidth: '420px',
                width: '100%',
                boxShadow: '0 12px 32px rgba(42, 35, 32, 0.25)',
                border: '1px solid #E7D5BC',
                color: '#2A2320',
              }}
            >
              <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', height: '220px', backgroundColor: '#F6EDE0' }}>
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
                    backgroundColor: '#B5532E', // Terracotta
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
                    backgroundColor: '#2A2320',
                    color: '#D9A441',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: '1px solid #8F3B1F',
                  }}
                >
                  Manga Express
                </span>
              </div>

              <div style={{ fontSize: '11px', color: '#B5532E', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                {CATALOG_PRODUCTS[0].brand}
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 10px 0', color: '#2A2320', lineHeight: 1.35 }}>
                {CATALOG_PRODUCTS[0].title}
              </h3>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
                <span style={{ fontSize: '22px', fontWeight: 900, color: '#B5532E', fontVariantNumeric: 'tabular-nums' }}>
                  {CATALOG_PRODUCTS[0].winningOffer.priceFormatted}
                </span>
                <span style={{ fontSize: '13px', color: '#8C8279', textDecoration: 'line-through' }}>
                  {CATALOG_PRODUCTS[0].originalPriceFormatted}
                </span>
                <span style={{ fontSize: '11px', color: '#4F6B3A', fontWeight: 700 }}>
                  -{CATALOG_PRODUCTS[0].discountPercent}%
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setSelectedProductForOffers(CATALOG_PRODUCTS[0])}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#F6EDE0',
                    border: '1px solid #D8C3A5',
                    color: '#2A2320',
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
                    backgroundColor: '#B5532E',
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

      {/* 6. FLASH SALES / KILN DEALS STRIP (Section 1.2 Status: Ember & Terracotta) */}
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
            backgroundColor: '#FFFFFF', // Paper
            borderRadius: '12px',
            border: '1px solid #E7D5BC',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(42, 35, 32, 0.05)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #F6EDE0', paddingBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  backgroundColor: '#FBE8E7', // Ember tint
                  color: '#B3261E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Zap size={18} />
              </div>
              <div>
                <h2 style={{ fontFamily: 'Fraunces, serif', margin: 0, fontSize: '19px', fontWeight: 800, color: '#2A2320' }}>
                  Fired Kiln Flash Deals
                </h2>
                <span style={{ fontSize: '12px', color: '#8C8279' }}>
                  Limited allocations directly released from certified national hubs
                </span>
              </div>
            </div>

            {/* Countdown Timer */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#8F3B1F', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} color="#B5532E" /> Ending in:
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <span style={{ backgroundColor: '#2A2320', color: '#F6EDE0', padding: '3px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span style={{ color: '#2A2320', fontWeight: 800 }}>:</span>
                <span style={{ backgroundColor: '#2A2320', color: '#F6EDE0', padding: '3px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span style={{ color: '#2A2320', fontWeight: 800 }}>:</span>
                <span style={{ backgroundColor: '#B5532E', color: '#FFFFFF', padding: '3px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>
          </div>

          {/* Flash Deals Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {CATALOG_PRODUCTS.filter((p) => p.isFlashDeal).map((item) => (
              <div
                key={`flash-${item.id}`}
                style={{
                  border: '1px solid #E7D5BC',
                  borderRadius: '10px',
                  padding: '12px',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ position: 'relative', height: '140px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#F6EDE0', marginBottom: '10px' }}>
                    <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: '6px', left: '6px', backgroundColor: '#B3261E', color: '#FFFFFF', fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                      -{item.discountPercent}%
                    </span>
                  </div>

                  <div style={{ fontSize: '11px', color: '#8C8279', fontWeight: 600 }}>{item.brand}</div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '2px 0 8px 0', color: '#2A2320', lineHeight: 1.3, height: '34px', overflow: 'hidden' }}>
                    {item.title}
                  </h4>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 800, color: '#B5532E', fontVariantNumeric: 'tabular-nums' }}>
                      {item.winningOffer.priceFormatted}
                    </span>
                    <span style={{ fontSize: '11px', color: '#8C8279', textDecoration: 'line-through' }}>
                      {item.originalPriceFormatted}
                    </span>
                  </div>

                  {/* Claim Progress Bar */}
                  {item.flashClaimedPercent && (
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#8C8279', marginBottom: '3px' }}>
                        <span>Claimed: <strong>{item.flashClaimedPercent}%</strong></span>
                        <span style={{ color: '#B3261E', fontWeight: 700 }}>Only {item.scarcityCount} left</span>
                      </div>
                      <div style={{ height: '5px', backgroundColor: '#E7D5BC', borderRadius: '3px', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${item.flashClaimedPercent}%`,
                            backgroundColor: '#B5532E',
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
                    backgroundColor: '#B5532E',
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

      {/* 7. THE MANGA ORIGIN STORY (Section 3.16 of Design Prompt) */}
      <section
        id="heritage-story"
        style={{
          maxWidth: '1360px',
          margin: '36px auto 0',
          padding: '0 24px',
        }}
      >
        <div
          style={{
            backgroundColor: '#2A2320', // Iron
            color: '#F6EDE0',
            borderRadius: '16px',
            padding: '36px 32px',
            border: '2px solid #8F3B1F',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#D9A441', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              <NokCoilPattern size={16} color="#D9A441" /> The Manga Origin
            </div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', fontWeight: 800, margin: '0 0 12px 0', color: '#F6EDE0' }}>
              Crafted in Nok. Verified for Nigeria.
            </h2>
            <p style={{ fontSize: '14px', color: '#E7D5BC', lineHeight: 1.6, margin: 0 }}>
              Over two thousand years ago, the Nok civilization of Central Nigeria pioneered world-famous terracotta sculpture and iron metallurgy. Manga draws upon this ancient standard of precision: every vendor is vetted, every transaction is safeguarded by escrow, and every parcel is tracked from the artisan's hands to your doorstep.
            </p>
          </div>

          {/* 5 Journey Milestones */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {[
              { step: '01', title: 'Authentic Makers', desc: 'Direct accreditation of authorized electronics distributors and certified textile artisans.', icon: Building },
              { step: '02', title: 'Double-Entry Escrow', desc: 'Your payment remains locked in automated escrow until confirmed delivery and physical inspection.', icon: ShieldCheck },
              { step: '03', title: 'Regional Sorting Hubs', desc: 'Pre-dispatch barcode scanning and physical QC in Lekki, Ikeja, and Abuja.', icon: Package },
              { step: '04', title: 'Monitored Corridors', desc: 'Nationwide transit with live milestones via GIG Logistics, Red Star, and Fez Delivery.', icon: Truck },
              { step: '05', title: 'Signed Handover', desc: 'Proof-of-delivery confirmed via security pin or signature with 7-day return guarantee.', icon: Award },
            ].map((milestone) => {
              const Icon = milestone.icon;
              return (
                <div
                  key={milestone.step}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(231, 213, 188, 0.2)',
                    borderRadius: '10px',
                    padding: '18px',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: 800, color: '#D9A441' }}>
                      {milestone.step}
                    </span>
                    <Icon size={18} color="#B5532E" />
                  </div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 6px 0', color: '#FFFFFF' }}>
                    {milestone.title}
                  </h4>
                  <p style={{ fontSize: '12px', color: '#E7D5BC', lineHeight: 1.45, margin: 0 }}>
                    {milestone.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. MAIN PRODUCT CATALOG GRID WITH HONEST PROMISES (§3.4 & §3.6) */}
      <main style={{ maxWidth: '1360px', margin: '36px auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontFamily: 'Fraunces, serif', margin: 0, fontSize: '24px', fontWeight: 800, color: '#2A2320' }}>
              {selectedCategory === 'all'
                ? 'Curated Marketplace Goods'
                : `Department: ${selectedCategory.toUpperCase()}`}
            </h2>
            <span style={{ fontSize: '13px', color: '#8C8279' }}>
              Showing {filteredProducts.length} verified products ranked by Manga Landed Price Algorithm
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#8C8279' }}>Destination:</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#2A2320', backgroundColor: '#FFFFFF', padding: '6px 12px', borderRadius: '6px', border: '1px solid #E7D5BC' }}>
              {deliveryLocation}
            </span>
          </div>
        </div>

        {/* Product Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '22px' }}>
          {filteredProducts.map((product) => {
            const isWishlisted = wishlist.includes(product.id);
            return (
              <div
                key={product.id}
                style={{
                  backgroundColor: '#FFFFFF', // Paper
                  borderRadius: '12px',
                  border: '1px solid #E7D5BC',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px rgba(42, 35, 32, 0.05)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
              >
                <div>
                  {/* Image Container with Badges */}
                  <div style={{ position: 'relative', height: '220px', backgroundColor: '#F6EDE0', overflow: 'hidden' }}>
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        backgroundColor: '#B5532E',
                        color: '#FFFFFF',
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      -{product.discountPercent}%
                    </span>

                    {/* Delivery Promise Chip (§2 Commerce Components) */}
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '10px',
                        backgroundColor: 'rgba(42, 35, 32, 0.9)',
                        color: '#D9A441',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Truck size={11} color="#D9A441" /> {product.deliveryPromiseDate}
                    </span>

                    <button
                      onClick={() => toggleWishlist(product.id)}
                      aria-label="Save item to wishlist"
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E7D5BC',
                        borderRadius: '20px',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(42, 35, 32, 0.1)',
                      }}
                    >
                      <Heart size={16} color={isWishlisted ? '#B5532E' : '#8C8279'} fill={isWishlisted ? '#B5532E' : 'none'} />
                    </button>
                  </div>

                  {/* Details */}
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#8C8279', textTransform: 'uppercase' }}>
                        {product.brand}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: '#D9A441', fontWeight: 700 }}>
                        <Star size={12} fill="#D9A441" color="#D9A441" />
                        <span>{product.rating} ({product.reviewsCount})</span>
                      </div>
                    </div>

                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#2A2320', margin: '0 0 10px 0', lineHeight: 1.4, minHeight: '40px' }}>
                      {product.title}
                    </h3>

                    {/* Price Block */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '20px', fontWeight: 900, color: '#B5532E', fontVariantNumeric: 'tabular-nums' }}>
                        {product.winningOffer.priceFormatted}
                      </span>
                      <span style={{ fontSize: '12px', color: '#8C8279', textDecoration: 'line-through' }}>
                        {product.originalPriceFormatted}
                      </span>
                    </div>

                    {/* Seller Trust & Promise Box */}
                    <div
                      style={{
                        backgroundColor: '#F6EDE0',
                        border: '1px solid #E7D5BC',
                        borderRadius: '8px',
                        padding: '10px',
                        fontSize: '11px',
                        marginBottom: '14px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                        <span style={{ color: '#2A2320' }}>
                          Sold by: <strong style={{ color: '#8F3B1F' }}>{product.winningOffer.vendorName}</strong>
                        </span>
                        <span style={{ color: '#4F6B3A', fontWeight: 700 }}>
                          {product.winningOffer.fulfillmentScorePercent}% Rating
                        </span>
                      </div>
                      <div style={{ color: '#8C8279' }}>
                        Origin: {product.winningOffer.warehouseLocation}
                      </div>
                      <div style={{ color: '#4F6B3A', fontWeight: 600, marginTop: '2px' }}>
                        ✓ Dispatch guaranteed in {product.winningOffer.dispatchHours}h
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
                        border: '1px solid #D8C3A5',
                        color: '#2A2320',
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
                      backgroundColor: '#B5532E',
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

      {/* 9. BUY-BOX MODAL: Expandable Multi-Merchant Matrix (§2 & §3.6) */}
      {selectedProductForOffers && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(42, 35, 32, 0.65)',
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
              boxShadow: '0 20px 40px rgba(42, 35, 32, 0.25)',
              border: '1px solid #E7D5BC',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #E7D5BC', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontFamily: 'Fraunces, serif', margin: 0, fontSize: '18px', fontWeight: 800, color: '#2A2320' }}>
                  Merchant Offer Matrix & Buy-Box Breakdown
                </h3>
                <span style={{ fontSize: '12px', color: '#8C8279' }}>{selectedProductForOffers.title}</span>
              </div>
              <button
                onClick={() => setSelectedProductForOffers(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8C8279', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#2A2320', marginBottom: '16px' }}>
              Manga independently ranks offers based on <strong>landed price</strong>, <strong>dispatch SLA</strong>, and <strong>merchant fulfillment history</strong>. You can choose any competing seller below:
            </p>

            {/* Winning Offer Card */}
            <div
              style={{
                border: '2px solid #B5532E',
                borderRadius: '10px',
                padding: '16px',
                backgroundColor: '#F8ECE7',
                marginBottom: '14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ backgroundColor: '#B5532E', color: '#FFFFFF', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>
                  ★ Recommended Buy-Box Winner
                </span>
                <span style={{ fontSize: '18px', fontWeight: 900, color: '#B5532E', fontVariantNumeric: 'tabular-nums' }}>
                  {selectedProductForOffers.winningOffer.priceFormatted}
                </span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#2A2320' }}>
                {selectedProductForOffers.winningOffer.vendorName}
              </div>
              <div style={{ fontSize: '12px', color: '#8C8279', marginTop: '2px' }}>
                Origin: {selectedProductForOffers.winningOffer.warehouseLocation} • Carrier: {selectedProductForOffers.winningOffer.shippingCarrier}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                <span style={{ fontSize: '12px', color: '#4F6B3A', fontWeight: 600 }}>
                  ✓ Guaranteed dispatch in {selectedProductForOffers.winningOffer.dispatchHours} hours
                </span>
                <button
                  onClick={() => {
                    handleAddToCart(selectedProductForOffers, selectedProductForOffers.winningOffer);
                    setSelectedProductForOffers(null);
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#B5532E',
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
                    border: '1px solid #E7D5BC',
                    borderRadius: '8px',
                    padding: '14px',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#2A2320' }}>{offer.vendorName}</div>
                    <div style={{ fontSize: '11px', color: '#8C8279' }}>
                      {offer.warehouseLocation} • {offer.fulfillmentScorePercent}% Fulfillment Score
                    </div>
                    <div style={{ fontSize: '11px', color: '#2A2320', marginTop: '2px' }}>
                      Dispatches in {offer.dispatchHours}h via {offer.shippingCarrier}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#B5532E', fontVariantNumeric: 'tabular-nums', marginBottom: '6px' }}>
                      {offer.priceFormatted}
                    </div>
                    <button
                      onClick={() => {
                        handleAddToCart(selectedProductForOffers, offer);
                        setSelectedProductForOffers(null);
                      }}
                      style={{
                        padding: '6px 14px',
                        backgroundColor: '#2A2320',
                        color: '#F6EDE0',
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

      {/* 10. MULTI-VENDOR CART DRAWER (§3.8) */}
      {isCartOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(42, 35, 32, 0.65)',
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
              boxShadow: '-8px 0 24px rgba(42, 35, 32, 0.2)',
            }}
          >
            {/* Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E7D5BC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingBag size={20} color="#B5532E" />
                <h3 style={{ fontFamily: 'Fraunces, serif', margin: 0, fontSize: '17px', fontWeight: 800, color: '#2A2320' }}>
                  Your Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8C8279', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div style={{ padding: '12px 20px', backgroundColor: '#F6EDE0', borderBottom: '1px solid #E7D5BC' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: '#2A2320', fontWeight: 600 }}>
                  {isFreeDeliveryQualified ? (
                    <span style={{ color: '#4F6B3A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={13} /> You unlocked FREE Express Delivery!
                    </span>
                  ) : (
                    <span>Add <strong>{formatNaira(amountNeededForFreeDelivery)}</strong> more for <strong>FREE Delivery</strong></span>
                  )}
                </span>
                <span style={{ fontWeight: 700, color: '#8C8279' }}>{freeDeliveryProgressPercent}%</span>
              </div>
              <div style={{ height: '6px', backgroundColor: '#E7D5BC', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${freeDeliveryProgressPercent}%`,
                    backgroundColor: isFreeDeliveryQualified ? '#4F6B3A' : '#B5532E',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>

            {/* Cart Items Segregated by Parcel Containers */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: '#8C8279' }}>
                  <ShoppingBag size={48} color="#D8C3A5" style={{ margin: '0 auto 12px' }} />
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '15px', color: '#2A2320' }}>Your cart is empty.</p>
                  <p style={{ fontSize: '13px', marginTop: '4px' }}>Explore authentic goods crafted across Nigeria.</p>
                </div>
              ) : (
                Object.entries(shipmentGroups).map(([vendorId, group], index) => (
                  <div
                    key={vendorId}
                    style={{
                      border: '1px solid #E7D5BC',
                      borderRadius: '10px',
                      marginBottom: '16px',
                      overflow: 'hidden',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <div style={{ backgroundColor: '#F6EDE0', padding: '8px 12px', borderBottom: '1px solid #E7D5BC', fontSize: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontWeight: 700, color: '#2A2320' }}>Package {index + 1} of {parcelCount}:</span>{' '}
                        <span style={{ color: '#8F3B1F' }}>{group.vendorName}</span>
                      </div>
                      <span style={{ color: '#4F6B3A', fontWeight: 600 }}>{group.carrier}</span>
                    </div>

                    <div style={{ padding: '12px' }}>
                      {group.items.map((item) => (
                        <div
                          key={`${item.productId}-${item.vendorId}`}
                          style={{
                            display: 'flex',
                            gap: '12px',
                            marginBottom: '12px',
                            paddingBottom: '12px',
                            borderBottom: '1px solid #F6EDE0',
                          }}
                        >
                          <img src={item.imageUrl} alt={item.title} style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '6px' }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#2A2320', lineHeight: 1.3 }}>{item.title}</div>
                            <div style={{ fontSize: '12px', fontWeight: 800, color: '#B5532E', marginTop: '4px', fontVariantNumeric: 'tabular-nums' }}>
                              {item.priceFormatted}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #D8C3A5', borderRadius: '4px' }}>
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
                                style={{ background: 'none', border: 'none', color: '#8C8279', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}
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

              {/* Promo Voucher */}
              {cart.length > 0 && (
                <form onSubmit={handleApplyVoucher} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    placeholder="Coupon code (e.g. MANGAEXPRESS)"
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #E7D5BC',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '8px 14px',
                      backgroundColor: '#2A2320',
                      color: '#F6EDE0',
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

            {/* Financial Summary */}
            {cart.length > 0 && (
              <div style={{ padding: '16px 20px', borderTop: '1px solid #E7D5BC', backgroundColor: '#F6EDE0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px', color: '#8C8279' }}>
                  <span>Items Subtotal:</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: '#2A2320' }}>{formatNaira(cartSubtotalMinor)}</span>
                </div>
                {appliedDiscountMinor > 0n && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px', color: '#4F6B3A' }}>
                    <span>Promo Discount (MANGAEXPRESS):</span>
                    <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>-{formatNaira(appliedDiscountMinor)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px', color: '#8C8279' }}>
                  <span>Statutory VAT (7.5%):</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: '#2A2320' }}>{formatNaira(statutoryVatMinor)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '10px', color: '#8C8279' }}>
                  <span>Shipping ({parcelCount} {parcelCount === 1 ? 'Package' : 'Packages'}):</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: isFreeDeliveryQualified ? '#4F6B3A' : '#2A2320' }}>
                    {isFreeDeliveryQualified ? 'FREE' : formatNaira(shippingFeeMinor)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 900, borderTop: '1px solid #E7D5BC', paddingTop: '10px', marginBottom: '14px' }}>
                  <span>Grand Total:</span>
                  <span style={{ color: '#B5532E', fontVariantNumeric: 'tabular-nums' }}>{formatNaira(grandTotalMinor)}</span>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#B5532E',
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
                  <Lock size={15} /> Proceed to Escrow Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 11. 3-STEP ACCORDION CHECKOUT (§3.9) */}
      {isCheckoutOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(42, 35, 32, 0.65)',
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
              boxShadow: '0 20px 40px rgba(42, 35, 32, 0.25)',
              border: '1px solid #E7D5BC',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E7D5BC', paddingBottom: '14px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} color="#B5532E" />
                <h3 style={{ fontFamily: 'Fraunces, serif', margin: 0, fontSize: '18px', fontWeight: 800, color: '#2A2320' }}>
                  Manga Escrow Protected Checkout
                </h3>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8C8279', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Stepper */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
              <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: checkoutStep >= 1 ? '#2A2320' : '#F6EDE0', color: checkoutStep >= 1 ? '#F6EDE0' : '#8C8279', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>
                1. Delivery Address
              </div>
              <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: checkoutStep >= 2 ? '#2A2320' : '#F6EDE0', color: checkoutStep >= 2 ? '#F6EDE0' : '#8C8279', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>
                2. Shipping Speed
              </div>
              <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: checkoutStep === 3 ? '#2A2320' : '#F6EDE0', color: checkoutStep === 3 ? '#F6EDE0' : '#8C8279', fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>
                3. Secure Payment
              </div>
            </div>

            {/* STEP 1: DELIVERY ADDRESS */}
            {checkoutStep === 1 && (
              <div>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 700, color: '#2A2320' }}>
                  Recipient & Nationwide Delivery Details
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#2A2320', marginBottom: '4px' }}>
                      Full Name:
                    </label>
                    <input
                      type="text"
                      defaultValue="Chidi Okonkwo"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #E7D5BC', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#2A2320', marginBottom: '4px' }}>
                      Phone Number (For Carrier SMS / Driver Handover):
                    </label>
                    <input
                      type="tel"
                      defaultValue="+234 803 123 4567"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #E7D5BC', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#2A2320', marginBottom: '4px' }}>
                      Street Address & Landmark:
                    </label>
                    <input
                      type="text"
                      defaultValue="24 Admiralty Way, Lekki Phase 1 (Opposite Filmhouse Cinema)"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #E7D5BC', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#2A2320', marginBottom: '4px' }}>
                        State:
                      </label>
                      <select style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #E7D5BC', fontSize: '13px' }}>
                        <option>Lagos State</option>
                        <option>Abuja FCT</option>
                        <option>Rivers State</option>
                        <option>Oyo State</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#2A2320', marginBottom: '4px' }}>
                        Delivery Option:
                      </label>
                      <select
                        value={deliveryMethod}
                        onChange={(e) => setDeliveryMethod(e.target.value as any)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #E7D5BC', fontSize: '13px' }}
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
                        backgroundColor: '#B5532E',
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
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 700, color: '#2A2320' }}>
                  Review {parcelCount} Dispatched Consignment Packages
                </h4>
                <p style={{ fontSize: '12px', color: '#8C8279', margin: '0 0 14px 0' }}>
                  Items arrive in secure, independent packages directly from each merchant's regional distribution hub:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
                  {Object.entries(shipmentGroups).map(([vId, group], idx) => (
                    <div key={vId} style={{ backgroundColor: '#F6EDE0', border: '1px solid #E7D5BC', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: '#2A2320', marginBottom: '4px' }}>
                        <span>Package {idx + 1}: {group.vendorName}</span>
                        <span style={{ color: '#4F6B3A' }}>Estimated: Tomorrow by 2:00 PM</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#8C8279' }}>
                        Origin: {group.location} • Carrier: {group.carrier}
                      </div>
                      <div style={{ fontSize: '12px', marginTop: '6px', color: '#2A2320' }}>
                        {group.items.map((i) => `${i.quantity}x ${i.title}`).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button
                    onClick={() => setCheckoutStep(1)}
                    style={{ padding: '8px 16px', background: 'none', border: '1px solid #E7D5BC', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                  >
                    ← Back to Address
                  </button>
                  <button
                    onClick={() => setCheckoutStep(3)}
                    style={{ padding: '10px 20px', backgroundColor: '#B5532E', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Continue to Payment →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT METHOD */}
            {checkoutStep === 3 && (
              <div>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 700, color: '#2A2320' }}>
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
                      border: paymentMethod === 'card' ? '2px solid #B5532E' : '1px solid #E7D5BC',
                      backgroundColor: paymentMethod === 'card' ? '#F8ECE7' : '#FFFFFF',
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
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#2A2320' }}>
                        Debit / Credit Card (Mastercard, Visa, Verve)
                      </div>
                      <div style={{ fontSize: '11px', color: '#8C8279' }}>
                        Secured with 256-bit SSL encryption and mandatory 3D Secure bank OTP
                      </div>
                    </div>
                    <CreditCard size={18} color="#B5532E" />
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: '8px',
                      border: paymentMethod === 'bank_transfer' ? '2px solid #B5532E' : '1px solid #E7D5BC',
                      backgroundColor: paymentMethod === 'bank_transfer' ? '#F8ECE7' : '#FFFFFF',
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
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#2A2320' }}>
                        Instant Bank Transfer (Dedicated Virtual Account)
                      </div>
                      <div style={{ fontSize: '11px', color: '#8C8279' }}>
                        Instant account allocation via Wema Bank. Instant confirmation upon transfer
                      </div>
                    </div>
                    <Building size={18} color="#4F6B3A" />
                  </label>
                </div>

                {/* Card Inputs */}
                {paymentMethod === 'card' && !cardOtpSimulated && (
                  <div style={{ backgroundColor: '#F6EDE0', padding: '14px', borderRadius: '8px', border: '1px solid #E7D5BC', marginBottom: '18px' }}>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#2A2320', marginBottom: '4px' }}>
                        Card Number:
                      </label>
                      <input
                        type="text"
                        defaultValue="5399 4100 8821 9904"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D8C3A5', fontSize: '13px', fontFamily: 'monospace', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#2A2320', marginBottom: '4px' }}>
                          Expiry (MM/YY):
                        </label>
                        <input
                          type="text"
                          defaultValue="11/28"
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D8C3A5', fontSize: '13px', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#2A2320', marginBottom: '4px' }}>
                          CVV:
                        </label>
                        <input
                          type="password"
                          defaultValue="782"
                          maxLength={4}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D8C3A5', fontSize: '13px', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Card OTP Verification */}
                {cardOtpSimulated && (
                  <div style={{ backgroundColor: '#F8ECE7', border: '1px solid #EDC8BA', borderRadius: '8px', padding: '16px', marginBottom: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8F3B1F', fontWeight: 700, fontSize: '13px', marginBottom: '6px' }}>
                      <Lock size={15} /> 3D Secure Verification
                    </div>
                    <p style={{ fontSize: '12px', color: '#2A2320', margin: '0 0 10px 0' }}>
                      Please enter the 6-digit one-time password sent to your registered phone number (+234 803 *** 4567):
                    </p>
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP (e.g. 881294)"
                      value={simulatedOtpValue}
                      onChange={(e) => setSimulatedOtpValue(e.target.value)}
                      style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #B5532E', fontSize: '14px', letterSpacing: '3px', fontWeight: 700, width: '180px' }}
                    />
                  </div>
                )}

                {/* Bank Transfer Simulated Account */}
                {paymentMethod === 'bank_transfer' && (
                  <div style={{ backgroundColor: '#EBF2E6', border: '1px solid #D0DEC7', borderRadius: '8px', padding: '14px', marginBottom: '18px' }}>
                    <div style={{ fontSize: '12px', color: '#4F6B3A', fontWeight: 700, marginBottom: '6px' }}>
                      Transfer exact amount ({formatNaira(grandTotalMinor)}) to:
                    </div>
                    <div style={{ fontSize: '13px', color: '#2A2320' }}>
                      Bank: <strong>Wema Bank PLC</strong><br />
                      Account Number: <strong style={{ fontSize: '16px', fontFamily: 'monospace', letterSpacing: '1px' }}>8819 204 112</strong><br />
                      Beneficiary: <strong>MANGA ESCROW / CHIDI OKONKWO</strong>
                    </div>
                    <span style={{ fontSize: '11px', color: '#4F6B3A', marginTop: '6px', display: 'block' }}>
                      Account expires in 30 minutes. Payment verifies automatically upon transfer.
                    </span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    onClick={() => {
                      setCardOtpSimulated(false);
                      setCheckoutStep(2);
                    }}
                    style={{ padding: '8px 16px', background: 'none', border: '1px solid #E7D5BC', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                  >
                    ← Back to Review
                  </button>

                  <button
                    onClick={executeOrderCheckout}
                    disabled={isProcessingCheckout}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#B5532E',
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

      {/* 12. ORDER CONFIRMATION SCREEN (§3.10) */}
      {orderConfirmed && (
        <section style={{ maxWidth: '900px', margin: '32px auto', padding: '0 24px' }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid #D0DEC7',
              padding: '28px',
              boxShadow: '0 8px 24px rgba(79, 107, 58, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '22px',
                  backgroundColor: '#EBF2E6',
                  color: '#4F6B3A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h2 style={{ fontFamily: 'Fraunces, serif', margin: 0, fontSize: '20px', fontWeight: 800, color: '#2A2320' }}>
                  Order Confirmed & Escrow Secured!
                </h2>
                <span style={{ fontSize: '13px', color: '#8C8279' }}>
                  Order Reference: <strong>#{orderConfirmed.orderNumber}</strong> • Placed at {orderConfirmed.placedAt}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: '#2A2320', lineHeight: 1.5, margin: '0 0 20px 0' }}>
              Your payment of <strong>{orderConfirmed.grandTotalFormatted}</strong> is safely locked in platform escrow. Funds will only be disbursed to merchants once you inspect and accept your delivery.
            </p>

            {/* Individual Consignment Packages */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {orderConfirmed.packages.map((pkg: any) => (
                <div
                  key={pkg.packageNumber}
                  style={{
                    border: '1px solid #E7D5BC',
                    borderRadius: '8px',
                    padding: '14px',
                    backgroundColor: '#F6EDE0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 800, fontSize: '13px', color: '#2A2320' }}>
                      Package #{pkg.packageNumber}: {pkg.merchantName}
                    </span>
                    <div style={{ fontSize: '12px', color: '#8C8279', marginTop: '2px' }}>
                      Carrier: {pkg.carrier} • Tracking Code: <code style={{ color: '#B5532E', fontWeight: 700 }}>{pkg.trackingNumber}</code>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '12px', color: '#4F6B3A', fontWeight: 700 }}>
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
                          color: '#B5532E',
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
                  backgroundColor: '#2A2320',
                  color: '#F6EDE0',
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

      {/* 13. LIVE PARCEL TRACKING MODAL (Section 1.2 Tracking Colours) */}
      {isTrackingModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(42, 35, 32, 0.65)',
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
              boxShadow: '0 20px 40px rgba(42, 35, 32, 0.25)',
              border: '1px solid #E7D5BC',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E7D5BC', paddingBottom: '14px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={20} color="#B5532E" />
                <h3 style={{ fontFamily: 'Fraunces, serif', margin: 0, fontSize: '18px', fontWeight: 800, color: '#2A2320' }}>
                  Live Parcel Delivery Timeline
                </h3>
              </div>
              <button
                onClick={() => setIsTrackingModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8C8279', padding: '4px' }}
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
                  border: '1px solid #E7D5BC',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                }}
              />
              <button
                style={{
                  padding: '9px 16px',
                  backgroundColor: '#2A2320',
                  color: '#F6EDE0',
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

            {/* Consignment Status Box */}
            <div style={{ backgroundColor: '#F6EDE0', borderRadius: '8px', padding: '14px', border: '1px solid #E7D5BC', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#2A2320' }}>
                  Waybill #{trackingSearchCode}
                </span>
                <span style={{ backgroundColor: '#EBF1F6', color: '#3E5C76', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', border: '1px solid #CADAE6' }}>
                  In Transit with GIG Logistics
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#2A2320' }}>
                Carrier: <strong>GIG Logistics Express Priority Air</strong> • Origin: <strong>Ikeja Logistics Hub, Lagos</strong>
              </div>
              <div style={{ fontSize: '12px', color: '#4F6B3A', fontWeight: 600, marginTop: '4px' }}>
                Estimated Delivery: Tomorrow by 2:00 PM
              </div>
            </div>

            {/* 5-Stage Stepper using exact Design Prompt tracking colours */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingLeft: '12px', borderLeft: '2px solid #E7D5BC', marginLeft: '12px' }}>
              {[
                { title: 'Delivered — Signed by Recipient', desc: 'Awaiting courier final handover and signature', statusColor: '#4F6B3A', state: 'pending', time: 'Expected Tomorrow' },
                { title: 'Out with Courier for Final Delivery', desc: 'Assigned to GIG Courier Unit 12 (Lekki Phase 1 corridor)', statusColor: '#D9A441', state: 'active', time: 'Today, 2:30 PM' },
                { title: 'Arrived at Regional Sort Center', desc: 'Processed at Victoria Island Distribution Hub', statusColor: '#3E5C76', state: 'completed', time: 'Today, 09:15 AM' },
                { title: 'Package Dispatched by Merchant', desc: 'Left Slot Systems Direct warehouse hands', statusColor: '#3E5C76', state: 'completed', time: 'Yesterday, 04:20 PM' },
                { title: 'Label Created & Escrow Secured', desc: 'Waybill generated and customer payment verified in ledger', statusColor: '#8C8279', state: 'completed', time: 'Yesterday, 03:45 PM' },
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
                      backgroundColor: step.state === 'completed' ? '#4F6B3A' : step.state === 'active' ? '#D9A441' : '#8C8279',
                      border: '2px solid #FFFFFF',
                    }}
                  />
                  <div style={{ fontSize: '13px', fontWeight: 700, color: step.state === 'active' ? '#B5532E' : '#2A2320' }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: '11px', color: '#8C8279' }}>{step.desc}</div>
                  <div style={{ fontSize: '10px', color: '#8C8279', marginTop: '2px' }}>{step.time}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button
                onClick={() => setIsTrackingModalOpen(false)}
                style={{ padding: '8px 16px', backgroundColor: '#2A2320', color: '#F6EDE0', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
              >
                Close Timeline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 14. SAVED WISHLIST DRAWER (§3.13) */}
      {isWishlistOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(42, 35, 32, 0.65)',
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
              boxShadow: '-8px 0 24px rgba(42, 35, 32, 0.2)',
            }}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E7D5BC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Heart size={20} color="#B5532E" fill="#B5532E" />
                <h3 style={{ fontFamily: 'Fraunces, serif', margin: 0, fontSize: '17px', fontWeight: 800, color: '#2A2320' }}>
                  Saved Items ({wishlist.length})
                </h3>
              </div>
              <button
                onClick={() => setIsWishlistOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8C8279', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              {wishlist.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: '#8C8279' }}>
                  <Heart size={44} color="#D8C3A5" style={{ margin: '0 auto 12px' }} />
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '15px', color: '#2A2320' }}>Your Wishlist is empty.</p>
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
                        borderBottom: '1px solid #F6EDE0',
                        paddingBottom: '14px',
                        marginBottom: '14px',
                        alignItems: 'center',
                      }}
                    >
                      <img src={item.imageUrl} alt={item.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#2A2320', lineHeight: 1.3 }}>{item.title}</div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#B5532E', marginTop: '3px' }}>
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
                              backgroundColor: '#B5532E',
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
                            style={{ background: 'none', border: 'none', color: '#8C8279', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}
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

      {/* 15. FLOATING WHATSAPP CONCIERGE */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 60 }}>
        {isWhatsAppOpen ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              boxShadow: '0 12px 32px rgba(42, 35, 32, 0.25)',
              border: '1px solid #E7D5BC',
              width: '320px',
              overflow: 'hidden',
              marginBottom: '12px',
            }}
          >
            <div style={{ backgroundColor: '#2A2320', color: '#F6EDE0', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '16px', backgroundColor: '#B5532E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageCircle size={18} color="#FFFFFF" />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, fontFamily: 'Fraunces, serif' }}>Manga Concierge</div>
                  <div style={{ fontSize: '10px', color: '#D9A441' }}>Lagos Support • Online</div>
                </div>
              </div>
              <button
                onClick={() => setIsWhatsAppOpen(false)}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '14px', backgroundColor: '#F6EDE0' }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', color: '#2A2320', maxWidth: '85%', boxShadow: '0 1px 2px rgba(42,35,32,0.08)' }}>
                Welcome to Manga! Inquiring about delivery timelines across Lagos and Abuja, product authenticity, or bulk discounts?
              </div>
            </div>

            <div style={{ padding: '10px 12px', backgroundColor: '#FFFFFF', borderTop: '1px solid #E7D5BC' }}>
              <a
                href="https://wa.me/2347006264264?text=Hi%20Manga%20Concierge,%20I%20need%20assistance%20with%20an%20order"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  backgroundColor: '#B5532E',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  padding: '9px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                <MessageCircle size={14} /> Chat with Concierge
              </a>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsWhatsAppOpen(true)}
            aria-label="Open Shopping Concierge"
            style={{
              backgroundColor: '#2A2320',
              color: '#F6EDE0',
              border: '2px solid #B5532E',
              borderRadius: '28px',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(42, 35, 32, 0.25)',
            }}
          >
            <MessageCircle size={18} color="#D9A441" />
            <span>Manga Concierge</span>
          </button>
        )}
      </div>

      {/* 16. TRUST PILLARS & NOK FOOTER (Section 1.2 & Section 3.1) */}
      <footer style={{ backgroundColor: '#1E1815', color: '#E7D5BC', borderTop: '2px solid #8F3B1F', marginTop: '64px' }}>
        {/* 4 Pillars */}
        <div style={{ borderBottom: '1px solid rgba(231, 213, 188, 0.1)', padding: '32px 24px' }}>
          <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <ShieldCheck size={28} color="#B5532E" />
              <div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '15px', fontWeight: 800, color: '#FFFFFF', marginBottom: '3px' }}>
                  Escrow Buyer Protection
                </div>
                <div style={{ fontSize: '12px', color: '#E7D5BC' }}>
                  Your money is safely locked in platform escrow until you inspect and accept your delivery.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Award size={28} color="#D9A441" />
              <div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '15px', fontWeight: 800, color: '#FFFFFF', marginBottom: '3px' }}>
                  100% Genuine Certified
                </div>
                <div style={{ fontSize: '12px', color: '#E7D5BC' }}>
                  Only authorized national distributors and verified Tier-2 merchants are allowed to list.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Truck size={28} color="#D9A441" />
              <div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '15px', fontWeight: 800, color: '#FFFFFF', marginBottom: '3px' }}>
                  Nationwide Express Logistics
                </div>
                <div style={{ fontSize: '12px', color: '#E7D5BC' }}>
                  Next-day dispatch via GIG Logistics, Red Star Express, and Fez Delivery across 36 states.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Headphones size={28} color="#4F6B3A" />
              <div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '15px', fontWeight: 800, color: '#FFFFFF', marginBottom: '3px' }}>
                  Dedicated Lagos Support
                </div>
                <div style={{ fontSize: '12px', color: '#E7D5BC' }}>
                  Call our toll-free line 0700-MANGA-NG or reach our WhatsApp Concierge 7 days a week.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Directory Links */}
        <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '36px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <NokTriangleEye size={20} color="#B5532E" />
              <span style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: 900, color: '#F6EDE0' }}>
                Manga<span style={{ color: '#B5532E' }}>.</span>
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#E7D5BC', lineHeight: 1.6, margin: '0 0 12px 0' }}>
              Nigeria's independent high-density e-commerce marketplace named after Manga in Nok, drawing on terracotta craftsmanship and iron-age precision.
            </p>
            <div style={{ fontSize: '11px', color: '#8C8279' }}>
              © 2026 Manga Technologies Limited. All rights reserved.
            </div>
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
              Customer Hub
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
              <span onClick={() => setIsTrackingModalOpen(true)} style={{ cursor: 'pointer', color: '#E7D5BC' }}>Track Your Order</span>
              <span style={{ color: '#E7D5BC' }}>Escrow Guarantee Terms</span>
              <span style={{ color: '#E7D5BC' }}>Returns & Refund Policy</span>
              <span style={{ color: '#E7D5BC' }}>Nok Heritage Story</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
              Merchant Services
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
              <a href="http://localhost:3001" target="_blank" rel="noreferrer" style={{ color: '#D9A441', textDecoration: 'none' }}>
                Vendor Operations Console
              </a>
              <span style={{ color: '#E7D5BC' }}>Merchant Accreditation Tiers</span>
              <span style={{ color: '#E7D5BC' }}>Fulfillment & Barcode Scanning SLA</span>
              <span style={{ color: '#E7D5BC' }}>NUBAN Payout Schedules</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
              Payment Methods
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {['Mastercard', 'Visa', 'Verve', 'Paystack', 'Wema Bank', 'OPay'].map((g) => (
                <span key={g} style={{ backgroundColor: '#2A2320', border: '1px solid #4A3F39', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, color: '#E7D5BC' }}>
                  {g}
                </span>
              ))}
            </div>
            <div style={{ fontSize: '11px', color: '#8C8279' }}>
              256-bit SSL Bank-Grade Encryption
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
