'use client';

import * as React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { triggerFlyToCart, triggerFlyToWishlist } from '../lib/flyAnimations';

export interface CartItem {
  id: string;
  name: string;
  seller: string;
  priceNgn: number;
  priceUsd: number;
  image?: string;
  type?: 'physical' | 'digital';
  quantity: number;
  offerId?: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'BUYER';
  defaultAddress?: {
    recipientName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
  };
}

export interface PlacedOrder {
  orderRef: string;
  createdAt: string;
  totalNgn: number;
  totalUsd: number;
  paymentMethod: string;
  status: 'processing' | 'dispatched' | 'in_transit' | 'delivered';
  items: CartItem[];
  shippingAddress: {
    recipientName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
  };
}

export interface StoreContextType {
  currency: 'NGN' | 'USD';
  toggleCurrency: () => void;
  cartItems: CartItem[];
  cartCount: number;
  wishlist: string[];
  wishlistCount: number;
  addToCart: (item: any, qty?: number, sourceEl?: HTMLElement | null) => void;
  updateQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (id: string, sourceEl?: HTMLElement | null, item?: any) => void;
  flyToCart: (sourceEl?: HTMLElement | null, item?: any) => void;
  flyToWishlist: (sourceEl?: HTMLElement | null, item?: any) => void;
  isInWishlist: (id: string) => boolean;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  lastOrderRef: string | null;
  setLastOrderRef: (ref: string | null) => void;
  formatPrice: (priceNgn: number, priceUsd: number) => string;

  // Customer RBAC & Auth Session
  user: CustomerUser | null;
  orders: PlacedOrder[];
  loginCustomer: (email: string, name?: string, phone?: string) => void;
  logoutCustomer: () => void;
  updateCustomerProfile: (data: Partial<CustomerUser>) => void;
  recordPlacedOrder: (order: PlacedOrder) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const INITIAL_CART: CartItem[] = [
  {
    id: '66666666-6666-6666-6666-666666666661',
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    seller: 'Sony Audio Official Store',
    priceNgn: 450000,
    priceUsd: 320,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
    type: 'physical',
    quantity: 1,
    offerId: '88888888-8888-8888-8888-888888888881',
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    name: 'SaaS UI Design System & Figma Pro Kit',
    seller: 'DesignCraft Labs',
    priceNgn: 45000,
    priceUsd: 32,
    type: 'digital',
    quantity: 1,
    offerId: '88888888-8888-8888-8888-888888888886',
  },
];

const INITIAL_WISHLIST = [
  '66666666-6666-6666-6666-666666666661',
  '66666666-6666-6666-6666-666666666662',
];

const SEED_ORDERS: PlacedOrder[] = [
  {
    orderRef: 'MNG-2611-48K2F',
    createdAt: '2026-11-16T14:30:00Z',
    totalNgn: 450000,
    totalUsd: 320,
    paymentMethod: 'Paystack Card (Mastercard •••• 4242)',
    status: 'in_transit',
    items: [
      {
        id: '66666666-6666-6666-6666-666666666661',
        name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
        seller: 'Sony Audio Official Store',
        priceNgn: 450000,
        priceUsd: 320,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
        type: 'physical',
        quantity: 1,
      },
    ],
    shippingAddress: {
      recipientName: 'Chidi Okonkwo',
      phone: '+234 803 123 4567',
      street: '24 Admiralty Way, Lekki Phase 1',
      city: 'Lagos',
      state: 'Lagos State',
    },
  },
  {
    orderRef: 'MNG-2611-19B8C',
    createdAt: '2026-11-12T10:15:00Z',
    totalNgn: 270000,
    totalUsd: 192,
    paymentMethod: 'Paystack Card (Visa •••• 8821)',
    status: 'delivered',
    items: [
      {
        id: '66666666-6666-6666-6666-666666666665',
        name: 'Logitech MX Master 3S Ergonomic Wireless Mouse',
        seller: 'Logitech Official Partner',
        priceNgn: 135000,
        priceUsd: 96,
        image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=85',
        type: 'physical',
        quantity: 2,
      },
    ],
    shippingAddress: {
      recipientName: 'Chidi Okonkwo',
      phone: '+234 803 123 4567',
      street: '24 Admiralty Way, Lekki Phase 1',
      city: 'Lagos',
      state: 'Lagos State',
    },
  },
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART);
  const [wishlist, setWishlist] = useState<string[]>(INITIAL_WISHLIST);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastOrderRef, setLastOrderRef] = useState<string | null>(null);

  // Authenticated Buyer Session
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [orders, setOrders] = useState<PlacedOrder[]>(SEED_ORDERS);

  // Restore saved state from localStorage on client mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('manga_cart');
      if (savedCart) setCartItems(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('manga_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedCurr = localStorage.getItem('manga_currency');
      if (savedCurr === 'NGN' || savedCurr === 'USD') setCurrency(savedCurr);

      const savedOrder = localStorage.getItem('manga_last_order');
      if (savedOrder) setLastOrderRef(savedOrder);

      const savedUser = localStorage.getItem('manga_customer_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      const savedOrders = localStorage.getItem('manga_customer_orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } catch {}
  }, []);

  // Save changes
  useEffect(() => {
    try {
      localStorage.setItem('manga_cart', JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('manga_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('manga_currency', currency);
    } catch {}
  }, [currency]);

  useEffect(() => {
    try {
      if (lastOrderRef) localStorage.setItem('manga_last_order', lastOrderRef);
    } catch {}
  }, [lastOrderRef]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('manga_customer_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('manga_customer_user');
      }
    } catch {}
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('manga_customer_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  const toggleCurrency = () => {
    setCurrency((c) => (c === 'NGN' ? 'USD' : 'NGN'));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loginCustomer = (email: string, name?: string, phone?: string) => {
    const formattedName = name && name.trim() ? name.trim() : email.split('@')[0];
    const customer: CustomerUser = {
      id: `usr-${Date.now().toString(36)}`,
      name: formattedName.charAt(0).toUpperCase() + formattedName.slice(1),
      email: email.trim().toLowerCase(),
      phone: phone || '+234 800 000 0000',
      role: 'BUYER',
      defaultAddress: {
        recipientName: formattedName,
        phone: phone || '+234 800 000 0000',
        street: '15 Victoria Island Blvd',
        city: 'Lagos',
        state: 'Lagos State',
      },
    };
    setUser(customer);
    showToast(`Welcome back, ${customer.name}!`);
  };

  const logoutCustomer = () => {
    setUser(null);
    showToast('Signed out of Marketsquare customer account');
  };

  const updateCustomerProfile = (data: Partial<CustomerUser>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
    showToast('Customer profile updated');
  };

  const recordPlacedOrder = (newOrder: PlacedOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setLastOrderRef(newOrder.orderRef);
  };

  const addToCart = (product: any, qty = 1, sourceEl?: HTMLElement | null) => {
    // Cinematic Parabolic Fly-to-Cart Arc
    triggerFlyToCart(sourceEl, product, () => {
      setCartItems((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
          );
        }
        return [
          ...prev,
          {
            id: product.id,
            name: product.title || product.name,
            seller: product.storeName || product.seller || 'Official Vendor',
            priceNgn: product.priceNgn,
            priceUsd: product.priceUsd,
            image: product.image,
            type: product.type || 'physical',
            quantity: qty,
            offerId: product.offerId,
          },
        ];
      });
    });
    showToast(`Added ${String(product.title || product.name).slice(0, 30)}... to cart`);
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    showToast('Item removed from cart');
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleWishlist = (id: string, sourceEl?: HTMLElement | null, item?: any) => {
    if (wishlist.includes(id)) {
      setWishlist((prev) => prev.filter((item) => item !== id));
      showToast('Removed from saved wishlist');
    } else {
      // Magnetic Pull Fly-to-Wishlist
      triggerFlyToWishlist(sourceEl, item || { id }, () => {
        setWishlist((prev) => (prev.includes(id) ? prev : [...prev, id]));
      });
      showToast('Saved to your wishlist');
    }
  };

  const flyToCart = (sourceEl?: HTMLElement | null, item?: any) => {
    triggerFlyToCart(sourceEl, item);
  };

  const flyToWishlist = (sourceEl?: HTMLElement | null, item?: any) => {
    triggerFlyToWishlist(sourceEl, item);
  };

  const isInWishlist = (id: string) => wishlist.includes(id);

  const formatPrice = (priceNgn: number, priceUsd: number) => {
    return currency === 'NGN'
      ? `₦${Number(priceNgn || 0).toLocaleString()}`
      : `$${Number(priceUsd || 0).toLocaleString()}`;
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <StoreContext.Provider
      value={{
        currency,
        toggleCurrency,
        cartItems,
        cartCount,
        wishlist,
        wishlistCount,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        toggleWishlist,
        flyToCart,
        flyToWishlist,
        isInWishlist,
        toastMessage,
        showToast,
        lastOrderRef,
        setLastOrderRef,
        formatPrice,
        user,
        orders,
        loginCustomer,
        logoutCustomer,
        updateCustomerProfile,
        recordPlacedOrder,
      }}
    >
      {children}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 bg-[#2A2320] text-white px-4 py-3 rounded-2xl shadow-2xl border border-[#E7D5BC]/30 flex items-center gap-3 text-xs animate-bounce font-medium pointer-events-none">
          <i className="fas fa-check-circle text-[#4F6B3A] text-sm"></i>
          <span>{toastMessage}</span>
        </div>
      )}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
