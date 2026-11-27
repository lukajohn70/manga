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
          boxShadow: '0 20px 25px -5px rgba(42, 35, 32, 0.2), 0 8px 10px -6px rgba(42, 35, 32, 0.1)',
          border: '1px solid #E7D5BC',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#FDF4ED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#B5532E',
                border: '1px solid #F6D6C2',
              }}
            >
              <Tag size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#2A2320', fontFamily: 'Fraunces, Georgia, serif' }}>
                Standard Carrier Shipping Waybill
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#8C8279' }}>
                Thermal label (4x6 format) with Manga Express barcode routing
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
              color: '#8C8279',
              padding: '6px',
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
            border: '2px solid #2A2320',
            padding: '1.25rem',
            borderRadius: '6px',
            backgroundColor: '#ffffff',
            marginBottom: '1.5rem',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #2A2320', paddingBottom: '8px', marginBottom: '12px' }}>
            <span style={{ fontWeight: 800, fontSize: '15px', color: '#B5532E', letterSpacing: '0.05em' }}>MANGA EXPRESS LOGISTICS</span>
            <span style={{ fontWeight: 700, fontSize: '13px', color: '#2A2320' }}>{carrierName}</span>
          </div>

          <div style={{ fontSize: '12px', marginBottom: '12px', color: '#2A2320' }}>
            <strong style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8C8279' }}>SHIP TO:</strong>
            <div style={{ fontWeight: 700, fontSize: '14px', marginTop: '2px' }}>{recipientAddress.recipientName}</div>
            <div style={{ marginTop: '2px' }}>{recipientAddress.streetAddress}</div>
            <div>{recipientAddress.city}, {recipientAddress.stateOrProvince}</div>
            <div style={{ marginTop: '2px', fontWeight: 600 }}>TEL: {recipientAddress.phone}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E7D5BC', paddingTop: '8px', fontSize: '11px', marginBottom: '12px', color: '#2A2320' }}>
            <span>Order: <strong>#{orderNumber}</strong></span>
            <span>Weight: <strong>{weightG}g</strong></span>
            <span>Routing: <strong style={{ color: '#4F6B3A' }}>EXPRESS PRIORITY</strong></span>
          </div>

          {/* Barcode representation */}
          <div style={{ textAlign: 'center', borderTop: '2px solid #2A2320', paddingTop: '12px' }}>
            <div
              style={{
                letterSpacing: '3px',
                fontSize: '22px',
                fontWeight: 900,
                transform: 'scaleY(1.4)',
                margin: '8px 0',
                color: '#2A2320',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              ||||| | |||| ||| || |||||| | |||||
            </div>
            <div style={{ fontWeight: 700, fontSize: '13px', letterSpacing: '2px', color: '#2A2320' }}>
              {trackingNumber}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Printer size={16} /> Print Waybill
          </Button>
        </div>
      </div>
    </div>
  );
};
