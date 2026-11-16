import * as React from 'react';
import { Button } from '@manga/ui';
import { Tag, Printer, X } from 'lucide-react';

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
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '540px',
          padding: '1.75rem',
          boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563eb',
              }}
            >
              <Tag size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>
                Standard Carrier Shipping Label
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                Ready for thermal printing (4x6 format) or laser sticker sheet
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
              padding: '4px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Printable Label Box */}
        <div
          id="printable-shipping-label"
          style={{
            border: '2px solid #0f172a',
            padding: '1.25rem',
            borderRadius: '6px',
            backgroundColor: '#ffffff',
            marginBottom: '1.5rem',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0f172a', paddingBottom: '8px', marginBottom: '12px' }}>
            <span style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a', letterSpacing: '0.05em' }}>MANGA LOGISTICS</span>
            <span style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>{carrierName}</span>
          </div>

          <div style={{ fontSize: '12px', marginBottom: '12px', color: '#0f172a' }}>
            <strong style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569' }}>SHIP TO:</strong>
            <div style={{ fontWeight: 700, fontSize: '14px', marginTop: '2px' }}>{recipientAddress.recipientName}</div>
            <div style={{ marginTop: '2px' }}>{recipientAddress.streetAddress}</div>
            <div>{recipientAddress.city}, {recipientAddress.stateOrProvince}</div>
            <div style={{ marginTop: '2px', fontWeight: 600 }}>TEL: {recipientAddress.phone}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '8px', fontSize: '11px', marginBottom: '12px', color: '#334155' }}>
            <span>Order: <strong>#{orderNumber}</strong></span>
            <span>Weight: <strong>{weightG}g</strong></span>
            <span>Routing: <strong>EXPRESS PRIORITY</strong></span>
          </div>

          {/* Barcode representation */}
          <div style={{ textAlign: 'center', borderTop: '2px solid #0f172a', paddingTop: '12px' }}>
            <div
              style={{
                letterSpacing: '5px',
                fontSize: '26px',
                fontWeight: 900,
                transform: 'scaleY(1.5)',
                margin: '8px 0',
                color: '#0f172a',
              }}
            >
              ||||| | |||| ||| || |||||| | |||||
            </div>
            <div style={{ fontWeight: 700, fontSize: '13px', letterSpacing: '2px', color: '#0f172a' }}>
              {trackingNumber}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Printer size={16} /> Print Shipping Label
          </Button>
        </div>
      </div>
    </div>
  );
};
