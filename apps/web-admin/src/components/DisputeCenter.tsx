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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              className="squircle"
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: 'var(--accent-primary-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
                border: '1px solid var(--border-accent)',
              }}
            >
              <Scale size={19} />
            </div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Fraunces, Georgia, serif' }}>
              Marketplace Dispute Mediation Center
            </h2>
          </div>
          <p style={{ margin: '4px 0 0 46px', color: 'var(--text-muted)', fontSize: '12px' }}>
            Audited mediation workflow with verified buyer-merchant evidence bundles and automated escrow disposition.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="status-pill warn">
            {disputes.filter((d) => d.status === 'opened' || d.status === 'awaiting_evidence').length} Active Inquiries
          </span>
          <span className="status-pill good">Resolution SLA: 48 Hours</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Case ID & Order</th>
              <th>Claim Type & Amount</th>
              <th>Parties Involved</th>
              <th>Documentation</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {disputes.map((dsp) => (
              <tr key={dsp.id}>
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{dsp.id}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Order #{dsp.orderNumber}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{dsp.type.replace(/_/g, ' ').toUpperCase()}</div>
                  <div className="tabular-nums" style={{ fontSize: '13px', color: 'var(--accent-primary)', fontWeight: 700 }}>
                    {dsp.claimedAmountFormatted}
                  </div>
                </td>
                <td>
                  <div style={{ color: 'var(--text-primary)' }}><strong>Customer:</strong> {dsp.buyerName}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}><strong>Merchant:</strong> {dsp.vendorName}</div>
                </td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--bg-well)', border: '1px solid var(--border-line)', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    <FileText size={12} color="var(--accent-primary)" />
                    {dsp.evidenceCount} Files Attached
                  </span>
                </td>
                <td>
                  <span
                    className={`status-pill ${
                      dsp.status === 'opened'
                        ? 'warn'
                        : dsp.status === 'awaiting_evidence'
                        ? 'info'
                        : dsp.status === 'resolved_buyer_favor'
                        ? 'bad'
                        : 'good'
                    }`}
                  >
                    {dsp.status.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCase(dsp);
                      setDecisionModalOpen(true);
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: 'var(--accent-primary)',
                      color: '#ffffff',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Review & Mediate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mediation & Evidence Bundle Modal */}
      {decisionModalOpen && selectedCase && (
        <div
          className="modal-backdrop"
          onClick={() => setDecisionModalOpen(false)}
        >
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '720px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-line)', paddingBottom: '14px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  className="squircle"
                  style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: 'var(--accent-primary-glow)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-primary)',
                    border: '1px solid var(--border-accent)',
                  }}
                >
                  <Scale size={19} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Fraunces, Georgia, serif' }}>
                    Case Adjudication #{selectedCase.id}
                  </h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Order #{selectedCase.orderNumber} • Disputed Value: <strong style={{ color: 'var(--accent-primary)' }}>{selectedCase.claimedAmountFormatted}</strong>
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDecisionModalOpen(false)}
                aria-label="Close dialog"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '6px', borderRadius: '6px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Evidence Bundle Section */}
            <div style={{ backgroundColor: 'var(--bg-well)', padding: '16px', borderRadius: '10px', marginBottom: '16px', border: '1px solid var(--border-line)' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Verified Evidence Portfolio
              </h4>
              <div style={{ fontSize: '13px', marginBottom: '6px', color: 'var(--text-primary)' }}>
                <strong>Customer Claim:</strong> "{selectedCase.reason}"
              </div>
              <div style={{ fontSize: '13px', marginBottom: '12px', color: 'var(--text-primary)' }}>
                <strong>Carrier Delivery Record:</strong> {selectedCase.trackingStatus} (Tracking: <code style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{selectedCase.trackingNumber}</code>)
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
                      backgroundColor: 'var(--bg-card)',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-line)',
                      fontSize: '12px',
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 700, textTransform: 'uppercase', marginRight: '6px', color: 'var(--accent-primary)' }}>
                        [{ev.party} - {ev.kind}]:
                      </span>
                      <span style={{ color: 'var(--text-primary)' }}>{ev.notes}</span>
                    </div>
                    <a
                      href={ev.uri}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}
                    >
                      View File <ExternalLink size={12} />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Adjudication Outcome Decision Radio */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Select Binding Adjudication Ruling:
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', border: selectedOutcome === 'buyer' ? '1px solid var(--status-bad)' : '1px solid var(--border-line)', cursor: 'pointer', backgroundColor: selectedOutcome === 'buyer' ? 'var(--status-bad-bg)' : 'var(--bg-well)' }}>
                  <input
                    type="radio"
                    name="outcome"
                    checked={selectedOutcome === 'buyer'}
                    onChange={() => setSelectedOutcome('buyer')}
                  />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--status-bad)' }}>Rule in Customer's Favor (Full Merchant Refund)</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Releases refund to buyer from merchant balance. Updates merchant compliance score.</div>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', border: selectedOutcome === 'vendor' ? '1px solid var(--status-good)' : '1px solid var(--border-line)', cursor: 'pointer', backgroundColor: selectedOutcome === 'vendor' ? 'var(--status-good-bg)' : 'var(--bg-well)' }}>
                  <input
                    type="radio"
                    name="outcome"
                    checked={selectedOutcome === 'vendor'}
                    onChange={() => setSelectedOutcome('vendor')}
                  />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--status-good)' }}>Rule in Merchant's Favor (Dismiss Claim & Disburse)</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Affirms fulfillment proof. Escrow funds released to merchant payable account.</div>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', border: selectedOutcome === 'guarantee' ? '1px solid var(--accent-gold)' : '1px solid var(--border-line)', cursor: 'pointer', backgroundColor: selectedOutcome === 'guarantee' ? 'var(--accent-gold-soft)' : 'var(--bg-well)' }}>
                  <input
                    type="radio"
                    name="outcome"
                    checked={selectedOutcome === 'guarantee'}
                    onChange={() => setSelectedOutcome('guarantee')}
                  />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>Manga Marketsquare Platform Guarantee Settlement</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Platform covers customer loss under trust policy while merchant is credited.</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Rationale Input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
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
                  borderRadius: '8px',
                  border: '1px solid var(--border-line)',
                  fontSize: '12.5px',
                  boxSizing: 'border-box',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-well)',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Footer Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDecisionModalOpen(false)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-line)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!resolutionRationale.trim()}
                onClick={handleResolve}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'var(--accent-primary)',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: !resolutionRationale.trim() ? 'not-allowed' : 'pointer',
                  opacity: !resolutionRationale.trim() ? 0.6 : 1,
                }}
              >
                Execute Settlement & Close Case
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
