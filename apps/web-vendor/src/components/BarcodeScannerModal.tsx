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
          boxShadow: '0 20px 25px -5px rgba(42, 35, 32, 0.2), 0 8px 10px -6px rgba(42, 35, 32, 0.1)',
          border: '1px solid #E7D5BC',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
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
              <Package size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#2A2320', fontFamily: 'Fraunces, Georgia, serif' }}>
                Pack & Verify Order #{orderNumber}
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#8C8279' }}>
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

        {/* Item Summary Card */}
        <div
          style={{
            backgroundColor: '#FBF7F0',
            border: '1px solid #E7D5BC',
            borderRadius: '8px',
            padding: '10px 14px',
            marginBottom: '1rem',
            fontSize: '13px',
          }}
        >
          <div style={{ color: '#2A2320', fontWeight: 600 }}>{itemTitle}</div>
          <div style={{ color: '#8C8279', fontSize: '12px', marginTop: '2px' }}>
            Expected Catalog SKU: <code style={{ color: '#B5532E', fontWeight: 600 }}>{expectedSku}</code>
          </div>
        </div>

        {/* Optical Scanner / Camera Viewfinder */}
        <div
          style={{
            position: 'relative',
            backgroundColor: '#1E1815',
            borderRadius: '8px',
            height: '180px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#8C8279',
            overflow: 'hidden',
            marginBottom: '1.25rem',
            border: '1px solid #3E3430',
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
                  color: '#D9A441',
                }}
              >
                <Camera size={24} />
              </div>
              <div style={{ fontSize: '13px', color: '#F6EDE0', fontWeight: 500 }}>
                {cameraError ? (
                  <span style={{ color: '#F8B4B4', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
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
                    backgroundColor: 'rgba(181, 83, 46, 0.35)',
                    border: '1px solid #B5532E',
                    borderRadius: '6px',
                    color: '#F6EDE0',
                    fontSize: '12px',
                    fontWeight: 600,
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
                border: '2px solid #4F6B3A',
                borderRadius: '8px',
                width: '65%',
                height: '45%',
                boxShadow: '0 0 16px rgba(79, 107, 58, 0.45)',
              }}
            />
          )}
        </div>

        {/* Verification Inputs Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#2A2320', marginBottom: '6px' }}>
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
                border: '1px solid #E7D5BC',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'monospace',
                backgroundColor: '#ffffff',
                color: '#2A2320',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#2A2320', marginBottom: '6px' }}>
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
                border: '1px solid #E7D5BC',
                fontSize: '14px',
                boxSizing: 'border-box',
                backgroundColor: '#ffffff',
                color: '#2A2320',
              }}
            />
            <span style={{ fontSize: '11px', color: '#8C8279', marginTop: '4px', display: 'block' }}>
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
