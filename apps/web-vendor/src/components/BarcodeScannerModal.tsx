import * as React from 'react';
import { Button } from '@manga/ui';
import { Package, Camera, X, AlertCircle } from 'lucide-react';

export interface BarcodeScannerModalProps {
  isOpen: boolean;
  orderNumber: string;
  expectedSku: string;
  itemTitle: string;
  onClose: () => void;
  onScanComplete: (scannedBarcode: string, weightG: number) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  orderNumber,
  expectedSku,
  itemTitle,
  onClose,
  onScanComplete,
}) => {
  const [manualBarcode, setManualBarcode] = React.useState(expectedSku);
  const [weightG, setWeightG] = React.useState<number>(650);
  const [cameraActive, setCameraActive] = React.useState<boolean>(false);
  const [cameraError, setCameraError] = React.useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  React.useEffect(() => {
    let stream: MediaStream | null = null;

    if (isOpen && cameraActive) {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: { facingMode: 'environment' } })
          .then((s) => {
            stream = s;
            if (videoRef.current) {
              videoRef.current.srcObject = s;
              videoRef.current.play().catch(() => {});
            }
          })
          .catch(() => {
            setCameraError('Camera access unavailable. Please enter the barcode manually below.');
            setCameraActive(false);
          });
      } else {
        setCameraError('Camera scanning is not supported in this browser environment.');
        setCameraActive(false);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isOpen, cameraActive]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onScanComplete(manualBarcode, weightG);
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
          maxWidth: '520px',
          padding: '1.75rem',
          boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#ffe4e6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#e11d48',
              }}
            >
              <Package size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>
                Pack & Verify Order #{orderNumber}
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                Pre-dispatch barcode scanning and parcel tare weight verification
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

        {/* Item Summary Card */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '10px 14px',
            marginBottom: '1rem',
            fontSize: '13px',
          }}
        >
          <div style={{ color: '#0f172a', fontWeight: 600 }}>{itemTitle}</div>
          <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>
            Expected Catalog SKU: <code style={{ color: '#0f172a', fontWeight: 600 }}>{expectedSku}</code>
          </div>
        </div>

        {/* Optical Scanner / Camera Viewfinder */}
        <div
          style={{
            position: 'relative',
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            height: '180px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94a3b8',
            overflow: 'hidden',
            marginBottom: '1.25rem',
            border: '1px solid #1e293b',
          }}
        >
          {cameraActive ? (
            <video
              ref={videoRef}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              muted
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '1.25rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '24px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px',
                  color: '#94a3b8',
                }}
              >
                <Camera size={24} />
              </div>
              <div style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: 500 }}>
                {cameraError ? (
                  <span style={{ color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                    <AlertCircle size={14} /> {cameraError}
                  </span>
                ) : (
                  'Optical Barcode Reader (Supported on Camera Devices)'
                )}
              </div>
              {!cameraError && (
                <button
                  type="button"
                  onClick={() => {
                    setCameraError(null);
                    setCameraActive(true);
                  }}
                  style={{
                    marginTop: '10px',
                    padding: '6px 14px',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Enable Device Camera
                </button>
              )}
            </div>
          )}

          {cameraActive && (
            <div
              style={{
                position: 'absolute',
                border: '2px solid #10b981',
                borderRadius: '8px',
                width: '65%',
                height: '45%',
                boxShadow: '0 0 16px rgba(16, 185, 129, 0.45)',
              }}
            />
          )}
        </div>

        {/* Verification Inputs Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>
              Scanned SKU or EAN/UPC Barcode:
            </label>
            <input
              type="text"
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'monospace',
                backgroundColor: '#ffffff',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>
              Packed Parcel Tare Weight (Grams):
            </label>
            <input
              type="number"
              value={weightG}
              onChange={(e) => setWeightG(parseInt(e.target.value, 10) || 0)}
              min={50}
              max={50000}
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                boxSizing: 'border-box',
                backgroundColor: '#ffffff',
              }}
            />
            <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
              Used for carrier billing reconciliation and delivery manifest dispatch.
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button variant="ghost" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Confirm & Generate Label
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
