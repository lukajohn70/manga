import * as React from 'react';
import { Button } from '@manga/ui';

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
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: { facingMode: 'environment' } })
          .then((s) => {
            stream = s;
            if (videoRef.current) {
              videoRef.current.srcObject = s;
              videoRef.current.play().catch(() => {});
            }
          })
          .catch((err) => {
            setCameraError('Camera access unavailable. Use manual scanner entry below.');
            setCameraActive(false);
          });
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
          maxWidth: '520px',
          padding: '1.5rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
            📦 Pack & Scan Order #{orderNumber}
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

        <p style={{ margin: '0.75rem 0', color: '#475569', fontSize: '14px' }}>
          Verify item: <strong>{itemTitle}</strong> (Expected SKU: <code>{expectedSku}</code>)
        </p>

        {/* Viewfinder area */}
        <div
          style={{
            position: 'relative',
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            height: '200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94a3b8',
            overflow: 'hidden',
            marginBottom: '1rem',
          }}
        >
          {cameraActive ? (
            <video
              ref={videoRef}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              muted
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📷</div>
              <div style={{ fontSize: '13px' }}>
                {cameraError || 'Camera Scanner (Chrome / Android PWA supported)'}
              </div>
              <Button
                variant="secondary"
                size="sm"
                style={{ marginTop: '10px' }}
                onClick={() => {
                  setCameraError(null);
                  setCameraActive(true);
                }}
              >
                Enable Camera
              </Button>
            </div>
          )}

          {cameraActive && (
            <div
              style={{
                position: 'absolute',
                border: '2px solid #22c55e',
                borderRadius: '8px',
                width: '70%',
                height: '50%',
                boxShadow: '0 0 15px rgba(34, 197, 94, 0.4)',
              }}
            />
          )}
        </div>

        {/* Form inputs */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              Scanned Item SKU / Barcode:
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
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              Packed Parcel Weight (Grams):
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
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
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
