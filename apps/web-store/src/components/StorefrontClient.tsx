'use client';

import * as React from 'react';
import {
  Header,
} from './Header';
import {
  CategoryNav,
} from './CategoryNav';
import {
  HeroBanner,
} from './HeroBanner';
import {
  FlashDeals,
} from './FlashDeals';
import {
  ProductSections,
} from './ProductSections';
import {
  TrustBar,
} from './TrustBar';
import {
  Footer,
} from './Footer';
import {
  CartDrawer,
  CartItem,
} from './CartDrawer';
import {
  BuyBoxModal,
} from './BuyBoxModal';
import {
  CheckoutModal,
} from './CheckoutModal';
import {
  Product,
  VendorOffer,
  FEATURED_PRODUCTS,
  FLASH_DEALS,
} from '../data/mockProducts';
import { CheckCircle2, X, MessageCircle, Truck } from 'lucide-react';

export function StorefrontClient() {
  // 1. Cart & Wishlist State
  const [cartItems, setCartItems] = React.useState<CartItem[]>([
    {
      product: FEATURED_PRODUCTS[1], // Logitech MX Master 3S
      quantity: 1,
      selectedVendorName: FEATURED_PRODUCTS[1].primaryVendor.name,
      pricePerUnit: FEATURED_PRODUCTS[1].currentPrice,
    },
  ]);
  const [wishlistIds, setWishlistIds] = React.useState<Set<string>>(new Set(['prod-1', 'deal-2']));
  const [selectedCity, setSelectedCity] = React.useState('Lagos');
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  // 2. Modals & Drawers State
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = React.useState(false);
  const [buyBoxProduct, setBuyBoxProduct] = React.useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);
  const [confirmedOrder, setConfirmedOrder] = React.useState<string | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 3. Cart Actions
  const handleAddToCart = (product: Product, selectedOffer?: VendorOffer | null) => {
    const vendorName = selectedOffer ? selectedOffer.vendorName : product.primaryVendor.name;
    const unitPrice = selectedOffer ? selectedOffer.price : product.currentPrice;

    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id && i.selectedVendorName === vendorName);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.selectedVendorName === vendorName
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, quantity: 1, selectedVendorName: vendorName, pricePerUnit: unitPrice }];
    });
    showToast(`Added "${product.title.slice(0, 32)}..." to cart`);
  };

  const handleUpdateQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity: newQty } : i))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  // 4. Wishlist Actions
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
        showToast(`Removed from saved items`);
      } else {
        next.add(product.id);
        showToast(`Saved to wishlist`);
      }
      return next;
    });
  };

  // 5. Buy-Box Offer Select
  const handleSelectOffer = (product: Product, offer: VendorOffer | null) => {
    handleAddToCart(product, offer);
    setBuyBoxProduct(null);
  };

  // 6. Search Filter
  const handleSearch = (query: string, category: string) => {
    showToast(`Searching for "${query || category}"...`);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cartItems.reduce((sum, item) => sum + item.pricePerUnit * item.quantity, 0);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F4F5F7', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#1E293B',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: 1200,
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={16} color="#4ADE80" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header & Navigation */}
      <Header
        cartCount={totalCartCount}
        cartTotalNgn={totalCartPrice}
        wishlistCount={wishlistIds.size}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onSearch={handleSearch}
        selectedCity={selectedCity}
        onSelectCity={(city) => {
          setSelectedCity(city);
          showToast(`Delivery location set to ${city}`);
        }}
      />

      {/* 2. Department Category Navigation & Visual Strip */}
      <CategoryNav
        selectedCategory={selectedCategory}
        onSelectCategory={(slug) => {
          setSelectedCategory(slug);
          showToast(`Viewing category: ${slug}`);
        }}
      />

      {/* 3. Hero Promotional Banners */}
      <HeroBanner onExploreDeals={() => showToast('Scrolling to hot flash deals')} />

      {/* 4. Daily Flash Deals */}
      <FlashDeals
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        wishlistIds={wishlistIds}
        onCompareOffers={(prod) => setBuyBoxProduct(prod)}
      />

      {/* 5. Curated Shelves & Products */}
      <ProductSections
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        wishlistIds={wishlistIds}
        onCompareOffers={(prod) => setBuyBoxProduct(prod)}
      />

      {/* 6. Marketplace Trust Bar */}
      <TrustBar />

      {/* 7. Comprehensive E-Commerce Footer */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Buy-Box Multi-Vendor Comparison Modal */}
      <BuyBoxModal
        isOpen={buyBoxProduct !== null}
        product={buyBoxProduct}
        onClose={() => setBuyBoxProduct(null)}
        onSelectOffer={handleSelectOffer}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        selectedCity={selectedCity}
        onOrderSuccess={(orderNum) => {
          setIsCheckoutOpen(false);
          setCartItems([]);
          setConfirmedOrder(orderNum);
        }}
      />

      {/* Order Confirmation Modal */}
      {confirmedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '1.25rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '2.5rem',
              maxWidth: '480px',
              textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              border: '1px solid #E2E8F0',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
              }}
            >
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: '1.5rem', fontWeight: 900, color: '#0F172A' }}>
              Order Placed Successfully!
            </h3>
            <p style={{ margin: '0 0 1rem', fontSize: '14px', color: '#64748B' }}>
              Order Reference: <strong style={{ color: '#C2410C' }}>#{confirmedOrder}</strong>
            </p>
            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', fontSize: '12px', color: '#334155', textAlign: 'left', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#15803D', marginBottom: '4px' }}>
                <Truck size={14} /> Manga Express Tracking Active
              </div>
              <div>Estimated Delivery: <strong>Tomorrow, 10:00 – 17:00</strong></div>
              <div>Delivery to: <strong>{selectedCity} Central</strong></div>
            </div>
            <button
              onClick={() => setConfirmedOrder(null)}
              style={{
                width: '100%',
                backgroundColor: '#C2410C',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Concierge Help Button */}
      <a
        href="https://wa.me/2347006264264?text=Hello%20Manga%20Support,%20I%20have%20an%20inquiry%20regarding%20an%20order"
        target="_blank"
        rel="noreferrer"
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          backgroundColor: '#25D366',
          color: '#FFFFFF',
          borderRadius: '30px',
          padding: '10px 18px',
          boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none',
          fontSize: '13px',
          fontWeight: 700,
          zIndex: 900,
        }}
      >
        <MessageCircle size={18} />
        <span>WhatsApp Concierge</span>
      </a>
    </div>
  );
}
