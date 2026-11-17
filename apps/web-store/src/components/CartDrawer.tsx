import * as React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, Store } from 'lucide-react';
import { Product } from '../data/mockProducts';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVendorName: string;
  pricePerUnit: number;
}

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, newQty: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.pricePerUnit * item.quantity, 0);
  const freeShippingThreshold = 30000;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const deliveryFee = isFreeShipping ? 0 : 2500;
  const total = subtotal + deliveryFee;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(3px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100vh',
          backgroundColor: '#FFFFFF',
          boxShadow: '-10px 0 25px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800, color: '#0F172A' }}>
              Your Shopping Cart ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h3>
            <span style={{ fontSize: '11px', color: '#15803D', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
              <ShieldCheck size={12} /> Escrow Protected Checkout
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close cart"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748B',
              padding: '6px',
              borderRadius: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div style={{ backgroundColor: '#F8FAFC', padding: '10px 1.5rem', borderBottom: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
            <span style={{ color: '#334155', fontWeight: 600 }}>
              {isFreeShipping ? 'You unlocked Free Express Delivery!' : `Add ₦${(freeShippingThreshold - subtotal).toLocaleString()} for Free Delivery`}
            </span>
            <span style={{ fontWeight: 700, color: '#15803D' }}>{isFreeShipping ? 'FREE' : '₦2,500'}</span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%`,
                height: '100%',
                backgroundColor: isFreeShipping ? '#15803D' : '#C2410C',
                borderRadius: '3px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Items List (Scrollable) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748B' }}>
              <div style={{ width: '54px', height: '54px', borderRadius: '50%', backgroundColor: '#F1F5F9', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Truck size={24} color="#94A3B8" />
              </div>
              <h4 style={{ margin: '0 0 6px', fontSize: '15px', color: '#1E293B', fontWeight: 700 }}>
                Your cart is empty
              </h4>
              <p style={{ margin: 0, fontSize: '13px' }}>
                Explore flash deals and top products to start shopping!
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #F1F5F9',
                }}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: '#F8FAFC',
                    flexShrink: 0,
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Details */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', lineHeight: 1.3, marginBottom: '3px' }}>
                    {item.product.title}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                    <Store size={11} /> Sold by: <strong style={{ color: '#334155' }}>{item.selectedVendorName}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                      ₦{(item.pricePerUnit * item.quantity).toLocaleString()}
                    </div>

                    {/* Quantity Stepper */}
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '6px' }}>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        style={{
                          width: '28px',
                          height: '28px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#475569',
                        }}
                      >
                        <Minus size={13} />
                      </button>
                      <span style={{ fontSize: '12px', fontWeight: 700, padding: '0 8px', color: '#0F172A' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        style={{
                          width: '28px',
                          height: '28px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#475569',
                        }}
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      aria-label="Remove item"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#94A3B8',
                        padding: '4px',
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer with Price Breakdown and Checkout Button */}
        {items.length > 0 && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748B', marginBottom: '6px' }}>
              <span>Subtotal</span>
              <span style={{ color: '#0F172A', fontWeight: 600 }}>₦{subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748B', marginBottom: '10px' }}>
              <span>Delivery Fee</span>
              <span style={{ color: isFreeShipping ? '#15803D' : '#0F172A', fontWeight: 600 }}>
                {isFreeShipping ? 'FREE' : `₦${deliveryFee.toLocaleString()}`}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '17px', fontWeight: 900, color: '#0F172A', marginBottom: '1rem', borderTop: '1px solid #F1F5F9', paddingTop: '8px' }}>
              <span>Total</span>
              <span style={{ color: '#C2410C' }}>₦{total.toLocaleString()}</span>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              style={{
                width: '100%',
                backgroundColor: '#C2410C',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(194, 65, 12, 0.3)',
              }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
