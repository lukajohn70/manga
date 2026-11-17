import * as React from 'react';
import { X, Star, Store, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Product, VendorOffer } from '../data/mockProducts';

export interface BuyBoxModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectOffer: (product: Product, offer: VendorOffer | null) => void;
}

export const BuyBoxModal: React.FC<BuyBoxModalProps> = ({
  product,
  isOpen,
  onClose,
  onSelectOffer,
}) => {
  if (!isOpen || !product) return null;

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
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '1.75rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #E2E8F0',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#C2410C', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Multi-Vendor Marketplace Buy-Box
            </div>
            <h3 style={{ margin: '4px 0 0', fontSize: '1.125rem', fontWeight: 800, color: '#0F172A' }}>
              Compare Verified Merchant Offers
            </h3>
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
              {product.title}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
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

        {/* Featured Primary Winner Offer */}
        <div
          style={{
            backgroundColor: '#FFF7ED',
            borderRadius: '10px',
            border: '2px solid #C2410C',
            padding: '1.25rem',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span
              style={{
                backgroundColor: '#C2410C',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '4px',
              }}
            >
              FEATURED BUY-BOX WINNER
            </span>
            <span style={{ fontSize: '12px', color: '#15803D', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} /> Escrow Protected
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Store size={15} color="#C2410C" />
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                  {product.primaryVendor.name}
                </span>
                <span style={{ fontSize: '11px', color: '#64748B' }}>({product.primaryVendor.city})</span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#F59E0B', fontWeight: 700 }}>
                  <Star size={12} fill="#F59E0B" /> {product.primaryVendor.rating}
                </span>
                <span>•</span>
                <span>Condition: <strong>Brand New</strong></span>
                <span>•</span>
                <span style={{ color: '#15803D', fontWeight: 600 }}>Next-Day Delivery</span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A' }}>
                ₦{product.currentPrice.toLocaleString()}
              </div>
              <button
                onClick={() => {
                  onSelectOffer(product, null);
                  onClose();
                }}
                style={{
                  marginTop: '6px',
                  backgroundColor: '#C2410C',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Choose This Offer
              </button>
            </div>
          </div>
        </div>

        {/* Other Sellers Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Other Verified Merchant Offers ({product.otherOffers.length})
          </div>

          {product.otherOffers.map((offer) => (
            <div
              key={offer.vendorId}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                    {offer.vendorName}
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>({offer.dispatchCity})</span>
                  {offer.isVerified && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#15803D', fontSize: '11px', fontWeight: 600 }}>
                      <CheckCircle2 size={12} /> Verified
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#F59E0B', fontWeight: 700 }}>
                    <Star size={12} fill="#F59E0B" /> {offer.vendorRating}
                  </span>
                  <span>•</span>
                  <span>Condition: <strong>{offer.condition}</strong></span>
                  <span>•</span>
                  <span>Delivery: {offer.deliveryTime}</span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                  ₦{offer.price.toLocaleString()}
                </div>
                <button
                  onClick={() => {
                    onSelectOffer(product, offer);
                    onClose();
                  }}
                  style={{
                    marginTop: '6px',
                    backgroundColor: '#F8FAFC',
                    color: '#0F172A',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
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
  );
};
