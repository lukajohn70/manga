import * as React from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, Building2, Truck, Lock } from 'lucide-react';
import { CartItem } from './CartDrawer';

export interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  selectedCity: string;
  onOrderSuccess: (orderNumber: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  selectedCity,
  onOrderSuccess,
}) => {
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [recipientName, setRecipientName] = React.useState('Chidi Okonkwo');
  const [phone, setPhone] = React.useState('+234 803 123 4567');
  const [streetAddress, setStreetAddress] = React.useState('14 Admiralty Way, Lekki Phase 1');
  const [paymentMethod, setPaymentMethod] = React.useState<'card' | 'bank_transfer' | 'escrow_pod'>('card');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.pricePerUnit * item.quantity, 0);
  const deliveryFee = subtotal >= 30000 ? 0 : 2500;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const generatedOrderNumber = `MNG-${Date.now().toString().slice(-6)}`;
      onOrderSuccess(generatedOrderNumber);
    }, 1200);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1.25rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '640px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '1.75rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #E2E8F0',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
              Secure Escrow Checkout
            </h3>
            <span style={{ fontSize: '12px', color: '#15803D', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <Lock size={12} /> 256-Bit SSL Encrypted & Escrow Protected
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close checkout"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748B',
              padding: '4px',
              borderRadius: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
          <div
            onClick={() => setStep(1)}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '6px',
              backgroundColor: step === 1 ? '#FFF7ED' : '#F8FAFC',
              border: step === 1 ? '1.5px solid #C2410C' : '1px solid #E2E8F0',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 700,
              color: step === 1 ? '#C2410C' : '#64748B',
            }}
          >
            1. Delivery Address
          </div>
          <div
            onClick={() => setStep(2)}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '6px',
              backgroundColor: step === 2 ? '#FFF7ED' : '#F8FAFC',
              border: step === 2 ? '1.5px solid #C2410C' : '1px solid #E2E8F0',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 700,
              color: step === 2 ? '#C2410C' : '#64748B',
            }}
          >
            2. Review Items
          </div>
          <div
            onClick={() => setStep(3)}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '6px',
              backgroundColor: step === 3 ? '#FFF7ED' : '#F8FAFC',
              border: step === 3 ? '1.5px solid #C2410C' : '1px solid #E2E8F0',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 700,
              color: step === 3 ? '#C2410C' : '#64748B',
            }}
          >
            3. Payment
          </div>
        </div>

        {/* Step 1: Address */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Full Name:
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Nigerian Phone Number:
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Delivery Street Address:
              </label>
              <input
                type="text"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Delivery Destination City:
              </label>
              <input
                type="text"
                value={selectedCity}
                disabled
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', color: '#64748B', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <button
              onClick={() => setStep(2)}
              style={{
                marginTop: '1rem',
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
              Continue to Item Review
            </button>
          </div>
        )}

        {/* Step 2: Item Review */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {items.map((i) => (
                <div key={i.product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '13px' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#0F172A' }}>{i.quantity}x {i.product.title}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>Sold by: {i.selectedVendorName}</div>
                  </div>
                  <div style={{ fontWeight: 800, color: '#0F172A' }}>
                    ₦{(i.pricePerUnit * i.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ backgroundColor: '#F0FDF4', padding: '12px 14px', borderRadius: '8px', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Truck size={20} color="#15803D" />
              <div style={{ fontSize: '12px', color: '#166534' }}>
                <strong>Manga Express Priority Delivery:</strong> Package staged for dispatch within 24 hours.
              </div>
            </div>

            <button
              onClick={() => setStep(3)}
              style={{
                marginTop: '1rem',
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
              Continue to Payment (₦{total.toLocaleString()})
            </button>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '8px',
                  border: paymentMethod === 'card' ? '2px solid #C2410C' : '1px solid #E2E8F0',
                  backgroundColor: paymentMethod === 'card' ? '#FFF7ED' : '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                />
                <CreditCard size={20} color="#C2410C" />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                    Debit / Credit Card (Mastercard, Visa, Verve)
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>
                    Secured with CBN-compliant 3D-Secure One-Time Password.
                  </div>
                </div>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '8px',
                  border: paymentMethod === 'bank_transfer' ? '2px solid #C2410C' : '1px solid #E2E8F0',
                  backgroundColor: paymentMethod === 'bank_transfer' ? '#FFF7ED' : '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={() => setPaymentMethod('bank_transfer')}
                />
                <Building2 size={20} color="#C2410C" />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                    Instant Bank Transfer (Providus / Wema Virtual Account)
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>
                    Instant account verification with zero transaction charges.
                  </div>
                </div>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '8px',
                  border: paymentMethod === 'escrow_pod' ? '2px solid #C2410C' : '1px solid #E2E8F0',
                  backgroundColor: paymentMethod === 'escrow_pod' ? '#FFF7ED' : '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'escrow_pod'}
                  onChange={() => setPaymentMethod('escrow_pod')}
                />
                <ShieldCheck size={20} color="#C2410C" />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                    Pay on Delivery with Manga Escrow Hold
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>
                    Inspect package upon arrival. Funds released only when satisfied.
                  </div>
                </div>
              </label>
            </div>

            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '12px', marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>
                <span>Amount to Pay</span>
                <span style={{ color: '#C2410C' }}>₦{total.toLocaleString()}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  backgroundColor: '#C2410C',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: 800,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                {isSubmitting ? 'Securing Transaction...' : `Authorize & Pay ₦${total.toLocaleString()}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
