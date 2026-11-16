import * as React from 'react';
import { Button } from '@manga/ui';

export interface ShippingLabelModalProps {
  isOpen: boolean;
  trackingNumber: string;
  orderNumber: string;
  carrierName: string;
  weightG: number;
  recipientAddress: {
    recipientName: string;
    phone: string;
    streetAddress: string;
    city: string;
    stateOrProvince: string;
  };
  onClose: () => void;
}

export const ShippingLabelModal: React.FC<ShippingLabelModalProps> = ({
  isOpen,
  trackingNumber,
  orderNumber,
  carrierName,
  weightG,
  recipientAddress,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '540px',
          padding: '1.5rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
            🏷️ Official Shipping Label
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#64748b',
            }}
          >
            ×
          </button>
        </div>

        {/* Printable Label Box */}
        <div
          id="printable-shipping-label"
          style={{
            border: '2px dashed #0f172a',
            padding: '1.25rem',
            borderRadius: '8px',
            backgroundColor: '#fafafa',
            marginBottom: '1.5rem',
            fontFamily: 'monospace',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0f172a', paddingBottom: '8px', marginBottom: '12px' }}>
            <span style={{ fontWeight: 800, fontSize: '16px' }}>MANGA LOGISTICS</span>
            <span style={{ fontWeight: 700 }}>{carrierName}</span>
          </div>

          <div style={{ fontSize: '12px', marginBottom: '12px' }}>
            <strong>SHIP TO:</strong>
            <div style={{ fontWeight: 700, fontSize: '14px', marginTop: '2px' }}>{recipientAddress.recipientName}</div>
            <div>{recipientAddress.streetAddress}</div>
            <div>{recipientAddress.city}, {recipientAddress.stateOrProvince}</div>
            <div>TEL: {recipientAddress.phone}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #cbd5e1', paddingTop: '8px', fontSize: '12px', marginBottom: '12px' }}>
            <span>Order: <strong>#{orderNumber}</strong></span>
            <span>Weight: <strong>{weightG}g</strong></span>
            <span>Service: <strong>EXPRESS</strong></span>
          </div>

          {/* Barcode representation */}
          <div style={{ textAlign: 'center', borderTop: '2px solid #0f172a', paddingTop: '12px' }}>
            <div
              style={{
                letterSpacing: '5px',
                fontSize: '28px',
                fontFamily: 'Courier New, monospace',
                fontWeight: 900,
                transform: 'scaleY(1.6)',
                margin: '8px 0',
              }}
            >
              ||||| | |||| ||| || |||||| | |||||
            </div>
            <div style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '2px' }}>
              {trackingNumber}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePrint}>
            🖨️ Print Shipping Label
          </Button>
        </div>
      </div>
    </div>
  );
};
