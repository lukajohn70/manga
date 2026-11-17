import * as React from 'react';
import { Button, Badge } from '@manga/ui';
import { Scale, FileText, X, ExternalLink, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export interface DisputeCaseModel {
  id: string;
  orderNumber: string;
  vendorName: string;
  buyerName: string;
  type: string;
  status: 'opened' | 'awaiting_evidence' | 'resolved_buyer_favor' | 'resolved_vendor_favor' | 'settled_by_platform';
  claimedAmountFormatted: string;
  reason: string;
  deadlineIso: string;
  evidenceCount: number;
  trackingNumber: string;
  trackingStatus: string;
  evidenceItems: Array<{
    id: string;
    party: 'buyer' | 'vendor' | 'carrier';
    kind: string;
    uri: string;
    notes: string;
    date: string;
  }>;
}

export const DisputeCenter: React.FC = () => {
  const [selectedCase, setSelectedCase] = React.useState<DisputeCaseModel | null>(null);
  const [decisionModalOpen, setDecisionModalOpen] = React.useState<boolean>(false);
  const [selectedOutcome, setSelectedOutcome] = React.useState<'buyer' | 'vendor' | 'guarantee'>('buyer');
  const [resolutionRationale, setResolutionRationale] = React.useState<string>('');

  const [disputes, setDisputes] = React.useState<DisputeCaseModel[]>([
    {
      id: 'dsp-101',
      orderNumber: 'MNG-2611-48K2F',
      vendorName: 'Apex Electronics Ltd',
      buyerName: 'Chidi Okonkwo',
      type: 'damaged_goods',
      status: 'opened',
      claimedAmountFormatted: '₦125,000.00',
      reason: 'Package arrived with cracked display panel upon unboxing. Inner cushioning appeared insufficient.',
      deadlineIso: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
      evidenceCount: 3,
      trackingNumber: 'TRK-881294-MNG',
      trackingStatus: 'Delivered (Handover Signed by Security)',
      evidenceItems: [
        {
          id: 'ev-1',
          party: 'buyer',
          kind: 'photo',
          uri: 'https://cdn.manga.internal/evidence/dsp-101/broken-screen.jpg',
          notes: 'High-resolution photo showing damaged OLED glass immediately after opening.',
          date: '2 hours ago',
        },
        {
          id: 'ev-2',
          party: 'carrier',
          kind: 'document',
          uri: 'https://cdn.manga.internal/evidence/dsp-101/pod-slip.pdf',
          notes: 'Carrier proof of delivery slip noted outer transit box indentation upon arrival.',
          date: '5 hours ago',
        },
        {
          id: 'ev-3',
          party: 'vendor',
          kind: 'photo',
          uri: 'https://cdn.manga.internal/evidence/dsp-101/pre-pack-qc.jpg',
          notes: 'Pre-dispatch quality assurance photograph showing intact merchandise before packaging.',
          date: '1 day ago',
        },
      ],
    },
    {
      id: 'dsp-102',
      orderNumber: 'MNG-2611-19B8C',
      vendorName: 'Super Mart Nigeria',
      buyerName: 'Amina Bello',
      type: 'wrong_item',
      status: 'awaiting_evidence',
      claimedAmountFormatted: '₦45,000.00',
      reason: 'Received Logitech MX Anywhere instead of the requested MX Master 3S model.',
      deadlineIso: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
      evidenceCount: 1,
      trackingNumber: 'TRK-552190-MNG',
      trackingStatus: 'Delivered',
      evidenceItems: [
        {
          id: 'ev-4',
          party: 'buyer',
          kind: 'photo',
          uri: 'https://cdn.manga.internal/evidence/dsp-102/wrong-barcode.jpg',
          notes: 'Photograph of delivered retail package showing MX Anywhere 3 barcode.',
          date: '1 day ago',
        },
      ],
    },
  ]);

  const handleResolve = () => {
    if (!selectedCase) return;

    let finalStatus: DisputeCaseModel['status'] = 'resolved_buyer_favor';
    if (selectedOutcome === 'vendor') finalStatus = 'resolved_vendor_favor';
    if (selectedOutcome === 'guarantee') finalStatus = 'settled_by_platform';

    setDisputes((prev) =>
      prev.map((d) => (d.id === selectedCase.id ? { ...d, status: finalStatus } : d))
    );

    setDecisionModalOpen(false);
    setSelectedCase(null);
    setResolutionRationale('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header & Filter Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
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
              <Scale size={20} />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#2A2320', fontFamily: 'Fraunces, Georgia, serif' }}>
              Marketplace Dispute Mediation Center
            </h2>
          </div>
          <p style={{ margin: '4px 0 0 46px', color: '#8C8279', fontSize: '13px' }}>
            Audited mediation workflow with verified buyer-merchant evidence bundles and automated escrow disposition.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Badge variant="warning">
            {disputes.filter((d) => d.status === 'opened' || d.status === 'awaiting_evidence').length} Active Inquiries
          </Badge>
          <Badge variant="success">Resolution SLA: 48 Hours</Badge>
        </div>
      </div>

      {/* Main Table */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E7D5BC', overflow: 'hidden', boxShadow: '0 2px 4px rgba(42, 35, 32, 0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#FBF7F0', borderBottom: '1px solid #E7D5BC', color: '#8C8279', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>
              <th style={{ padding: '12px 16px', fontWeight: 700 }}>Case ID & Order</th>
              <th style={{ padding: '12px 16px', fontWeight: 700 }}>Claim Type & Amount</th>
              <th style={{ padding: '12px 16px', fontWeight: 700 }}>Parties Involved</th>
              <th style={{ padding: '12px 16px', fontWeight: 700 }}>Documentation</th>
              <th style={{ padding: '12px 16px', fontWeight: 700 }}>Status</th>
              <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {disputes.map((dsp) => (
              <tr key={dsp.id} style={{ borderBottom: '1px solid #F0E6D8' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 700, color: '#2A2320' }}>{dsp.id}</div>
                  <div style={{ fontSize: '12px', color: '#8C8279' }}>Order #{dsp.orderNumber}</div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 600, color: '#2A2320' }}>{dsp.type.replace(/_/g, ' ').toUpperCase()}</div>
                  <div style={{ fontSize: '13px', color: '#B5532E', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                    {dsp.claimedAmountFormatted}
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ color: '#2A2320' }}><strong>Customer:</strong> {dsp.buyerName}</div>
                  <div style={{ fontSize: '12px', color: '#8C8279' }}><strong>Merchant:</strong> {dsp.vendorName}</div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#FBF7F0', border: '1px solid #E7D5BC', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, color: '#2A2320' }}>
                    <FileText size={12} color="#B5532E" />
                    {dsp.evidenceCount} Files Attached
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <Badge
                    variant={
                      dsp.status === 'opened'
                        ? 'warning'
                        : dsp.status === 'awaiting_evidence'
                        ? 'neutral'
                        : dsp.status === 'resolved_buyer_favor'
                        ? 'error'
                        : 'success'
                    }
                  >
                    {dsp.status.replace(/_/g, ' ').toUpperCase()}
                  </Badge>
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setSelectedCase(dsp);
                      setDecisionModalOpen(true);
                    }}
                  >
                    Review & Mediate
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mediation & Evidence Bundle Modal */}
      {decisionModalOpen && selectedCase && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(42, 35, 32, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '720px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.75rem',
              boxShadow: '0 25px 50px -12px rgba(42, 35, 32, 0.25)',
              border: '1px solid #E7D5BC',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E7D5BC', paddingBottom: '14px', marginBottom: '16px' }}>
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
                  <Scale size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800, color: '#2A2320', fontFamily: 'Fraunces, Georgia, serif' }}>
                    Case Adjudication #{selectedCase.id}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#8C8279' }}>
                    Order #{selectedCase.orderNumber} • Disputed Value: <strong style={{ color: '#B5532E' }}>{selectedCase.claimedAmountFormatted}</strong>
                  </span>
                </div>
              </div>
              <button
                onClick={() => setDecisionModalOpen(false)}
                aria-label="Close dialog"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8C8279', padding: '6px', borderRadius: '6px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Evidence Bundle Section */}
            <div style={{ backgroundColor: '#FBF7F0', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.25rem', border: '1px solid #E7D5BC' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#8C8279', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Verified Evidence Portfolio
              </h4>
              <div style={{ fontSize: '13px', marginBottom: '6px', color: '#2A2320' }}>
                <strong>Customer Claim:</strong> "{selectedCase.reason}"
              </div>
              <div style={{ fontSize: '13px', marginBottom: '12px', color: '#2A2320' }}>
                <strong>Carrier Delivery Record:</strong> {selectedCase.trackingStatus} (Tracking: <code style={{ fontWeight: 600, color: '#B5532E' }}>{selectedCase.trackingNumber}</code>)
              </div>

              {/* Uploaded Evidence Gallery */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedCase.evidenceItems.map((ev) => (
                  <div
                    key={ev.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: '#FFFFFF',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #E7D5BC',
                      fontSize: '12px',
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 700, textTransform: 'uppercase', marginRight: '6px', color: '#B5532E' }}>
                        [{ev.party} - {ev.kind}]:
                      </span>
                      <span style={{ color: '#2A2320' }}>{ev.notes}</span>
                    </div>
                    <a
                      href={ev.uri}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#B5532E', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}
                    >
                      View File <ExternalLink size={12} />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Adjudication Outcome Decision Radio */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#2A2320', marginBottom: '8px' }}>
                Select Binding Adjudication Ruling:
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '6px', border: selectedOutcome === 'buyer' ? '1px solid #B3261E' : '1px solid #E7D5BC', cursor: 'pointer', backgroundColor: selectedOutcome === 'buyer' ? '#FDF2F2' : '#FFFFFF' }}>
                  <input
                    type="radio"
                    name="outcome"
                    checked={selectedOutcome === 'buyer'}
                    onChange={() => setSelectedOutcome('buyer')}
                  />
                  <div>
                    <div style={{ fontWeight: 700, color: '#B3261E' }}>Rule in Customer's Favor (Full Merchant Refund)</div>
                    <div style={{ fontSize: '12px', color: '#8C8279' }}>Releases refund to buyer from merchant balance. Updates merchant compliance score.</div>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '6px', border: selectedOutcome === 'guarantee' ? '1px solid #D9A441' : '1px solid #E7D5BC', cursor: 'pointer', backgroundColor: selectedOutcome === 'guarantee' ? '#FEF7ED' : '#FFFFFF' }}>
                  <input
                    type="radio"
                    name="outcome"
                    checked={selectedOutcome === 'guarantee'}
                    onChange={() => setSelectedOutcome('guarantee')}
                  />
                  <div>
                    <div style={{ fontWeight: 700, color: '#8F3B1F' }}>Settle via Manga Buyer Protection Guarantee</div>
                    <div style={{ fontSize: '12px', color: '#8C8279' }}>Compensates buyer from platform guarantee reserves when transit damage occurred outside vendor fault.</div>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '6px', border: selectedOutcome === 'vendor' ? '1px solid #4F6B3A' : '1px solid #E7D5BC', cursor: 'pointer', backgroundColor: selectedOutcome === 'vendor' ? '#F0F6EE' : '#FFFFFF' }}>
                  <input
                    type="radio"
                    name="outcome"
                    checked={selectedOutcome === 'vendor'}
                    onChange={() => setSelectedOutcome('vendor')}
                  />
                  <div>
                    <div style={{ fontWeight: 700, color: '#4F6B3A' }}>Rule in Merchant's Favor (Dismiss Claim)</div>
                    <div style={{ fontSize: '12px', color: '#8C8279' }}>Valid proof of delivery verified without defect. Releases withheld payment to merchant.</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Rationale Input */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#2A2320', marginBottom: '6px' }}>
                Official Rationale & Policy Reference:
              </label>
              <textarea
                rows={3}
                value={resolutionRationale}
                onChange={(e) => setResolutionRationale(e.target.value)}
                placeholder="Detail the factual findings, evidence examined, and specific marketplace policy cited for this determination..."
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid #E7D5BC',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                  color: '#2A2320',
                  backgroundColor: '#FFFFFF',
                }}
              />
            </div>

            {/* Footer Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button variant="ghost" onClick={() => setDecisionModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={!resolutionRationale.trim()}
                onClick={handleResolve}
              >
                Execute Settlement & Close Case
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
