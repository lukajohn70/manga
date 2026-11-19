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
  role: 'BUYER' | 'VENDOR' | 'ADMIN';
  token?: string;
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
  loginCustomer: (
    email: string,
    name?: string,
    phone?: string,
    role?: 'BUYER' | 'VENDOR' | 'ADMIN',
    token?: string
  ) => void;
  logoutCustomer: () => void;
  clearAllUserData: () => void;
  updateCustomerProfile: (data: Partial<CustomerUser>) => void;
  recordPlacedOrder: (order: PlacedOrder) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const INITIAL_CART: CartItem[] = [];
const INITIAL_WISHLIST: string[] = [];
const SEED_ORDERS: PlacedOrder[] = [];

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
      if (savedCart) {
        try {
          const items: CartItem[] = JSON.parse(savedCart);
          // Purge stale mock products from prior demo seeds
          const hasLegacyMock = items.some(
            (i) =>
              !i.id ||
              i.id.startsWith('66666666') ||
              i.id === '1' ||
              i.name?.toLowerCase().includes('sony') ||
              i.name?.toLowerCase().includes('figma') ||
              i.name?.toLowerCase().includes('saas') ||
              i.seller?.toLowerCase().includes('sony audio') ||
              i.seller?.toLowerCase().includes('designcraft') ||
              i.offerId?.startsWith('88888888')
          );
          if (hasLegacyMock) {
            localStorage.removeItem('manga_cart');
            setCartItems([]);
          } else {
            setCartItems(items);
          }
        } catch {
          localStorage.removeItem('manga_cart');
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }

      const savedWishlist = localStorage.getItem('manga_wishlist');
      if (savedWishlist) {
        try {
          const wish: string[] = JSON.parse(savedWishlist);
          const cleanWish = Array.isArray(wish)
            ? wish.filter(
                (id) =>
                  typeof id === 'string' &&
                  id.length >= 10 &&
                  !id.startsWith('66666666') &&
                  !id.startsWith('88888888') &&
                  id !== '1' &&
                  id !== '2' &&
                  id !== '3'
              )
            : [];
          if (cleanWish.length !== wish.length) {
            localStorage.setItem('manga_wishlist', JSON.stringify(cleanWish));
          }
          setWishlist(cleanWish);
        } catch {
          localStorage.removeItem('manga_wishlist');
          setWishlist([]);
        }
      }

      const savedCurr = localStorage.getItem('manga_currency');
      if (savedCurr === 'NGN' || savedCurr === 'USD') setCurrency(savedCurr);

      const savedOrder = localStorage.getItem('manga_last_order');
      if (savedOrder) setLastOrderRef(savedOrder);

      const savedUser = localStorage.getItem('manga_customer_user');
      if (savedUser) {
        try {
          const u = JSON.parse(savedUser);
          const isDummy =
            !u?.email ||
            u.email.includes('buyer@manga.ng') ||
            u.email.includes('admin@manga.ng') ||
            u.email.includes('vendor@manga.ng') ||
            u.email.includes('chidi') ||
            u.email.includes('demo');

          if (isDummy) {
            localStorage.removeItem('manga_customer_user');
            localStorage.removeItem('manga_customer_orders');
            localStorage.removeItem('manga_wishlist');
            setUser(null);
            setOrders([]);
            setWishlist([]);
          } else {
            setUser(u);
            if (u.email) {
              fetch(`/api/orders?email=${encodeURIComponent(u.email)}`)
                .then((r) => (r.ok ? r.json() : null))
                .then((d) => {
                  if (d?.orders && d.orders.length > 0) {
                    setOrders(d.orders);
                  }
                })
                .catch(() => {});
            }
          }
        } catch {
          localStorage.removeItem('manga_customer_user');
          localStorage.removeItem('manga_wishlist');
          setUser(null);
          setWishlist([]);
        }
      } else {
        localStorage.removeItem('manga_wishlist');
        setWishlist([]);
      }

      const savedOrders = localStorage.getItem('manga_customer_orders');
      if (savedOrders) {
        try {
          setOrders(JSON.parse(savedOrders));
        } catch {
          localStorage.removeItem('manga_customer_orders');
        }
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
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2200);
  };

  const loginCustomer = (
    email: string,
    name?: string,
    phone?: string,
    role: 'BUYER' | 'VENDOR' | 'ADMIN' = 'BUYER',
    token?: string
  ) => {
    const formattedName = name && name.trim() ? name.trim() : email.split('@')[0];
    const customer: CustomerUser = {
      id: `usr-${Date.now().toString(36)}`,
      name: formattedName.charAt(0).toUpperCase() + formattedName.slice(1),
      email: email.trim().toLowerCase(),
      phone: phone || '',
      role,
      token,
      defaultAddress: undefined,
    };
    setUser(customer);

    // Sync real buyer orders from database
    fetch(`/api/orders?email=${encodeURIComponent(customer.email)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.orders && d.orders.length > 0) {
          setOrders(d.orders);
        }
      })
      .catch(() => {});

    showToast(`Welcome back, ${customer.name}! Authenticated as [${role}].`);
  };

  const logoutCustomer = () => {
    setUser(null);
    setOrders([]);
    setWishlist([]);
    try {
      fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      }).catch(() => {});
      localStorage.removeItem('manga_customer_user');
      localStorage.removeItem('manga_customer_token');
      localStorage.removeItem('manga_customer_orders');
      localStorage.removeItem('manga_wishlist');
      localStorage.removeItem('manga_last_order');
    } catch {}
    showToast('Signed out of account');
  };

  const clearAllUserData = () => {
    setUser(null);
    setOrders([]);
    setCartItems([]);
    setWishlist([]);
    setLastOrderRef(null);
    try {
      localStorage.removeItem('manga_customer_user');
      localStorage.removeItem('manga_customer_orders');
      localStorage.removeItem('manga_cart');
      localStorage.removeItem('manga_wishlist');
      localStorage.removeItem('manga_last_order');
    } catch {}
    showToast('All cached sessions and data cleared');
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
    if (!user) {
      if (typeof window !== 'undefined') {
        window.location.href = '/account/login?redirect=' + encodeURIComponent(window.location.pathname);
      }
      return;
    }
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
        clearAllUserData,
        updateCustomerProfile,
        recordPlacedOrder,
      }}
    >
      {children}
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
