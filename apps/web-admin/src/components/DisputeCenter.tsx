import * as React from 'react';
import { Button, Badge } from '@manga/ui';

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
      reason: 'Package arrived with broken screen. Inner packaging lacked bubble wrap protection.',
      deadlineIso: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
      evidenceCount: 3,
      trackingNumber: 'TRK-881294-MNG',
      trackingStatus: 'Delivered (Signed by Security)',
      evidenceItems: [
        {
          id: 'ev-1',
          party: 'buyer',
          kind: 'photo',
          uri: 'https://cdn.manga.internal/evidence/dsp-101/broken-screen.jpg',
          notes: 'High-res photo showing cracked OLED panel upon box opening.',
          date: '2 hours ago',
        },
        {
          id: 'ev-2',
          party: 'carrier',
          kind: 'document',
          uri: 'https://cdn.manga.internal/evidence/dsp-101/pod-slip.pdf',
          notes: 'Carrier POD slip noted external box dent upon delivery handover.',
          date: '5 hours ago',
        },
        {
          id: 'ev-3',
          party: 'vendor',
          kind: 'photo',
          uri: 'https://cdn.manga.internal/evidence/dsp-101/pre-pack-qc.jpg',
          notes: 'Vendor pre-dispatch QC photo showing intact screen before packing.',
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
      reason: 'Received Logitech MX Anywhere instead of requested MX Master 3S.',
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
          notes: 'Photo of retail box showing model MX Anywhere 3.',
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
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
            ⚖️ Marketplace Dispute Center & Mediation
          </h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>
            Audited mediation workflow with automated evidence bundling and double-entry ledger execution.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Badge variant="warning">
            {disputes.filter((d) => d.status === 'opened' || d.status === 'awaiting_evidence').length} Active Cases
          </Badge>
          <Badge variant="success">SLA: 48h Resolution Target</Badge>
        </div>
      </div>

      {/* Main Table */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Case ID & Order</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Type & Claim</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Parties Involved</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Evidence</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {disputes.map((dsp) => (
              <tr key={dsp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{dsp.id}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Order #{dsp.orderNumber}</div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 600 }}>{dsp.type.replace(/_/g, ' ').toUpperCase()}</div>
                  <div style={{ fontSize: '13px', color: '#be123c', fontWeight: 700 }}>{dsp.claimedAmountFormatted}</div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div><strong>Buyer:</strong> {dsp.buyerName}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}><strong>Vendor:</strong> {dsp.vendorName}</div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ backgroundColor: '#e2e8f0', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                    📁 {dsp.evidenceCount} Files Uploaded
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <Badge
                    variant={
                      dsp.status === 'opened'
                        ? 'warning'
                        : dsp.status === 'awaiting_evidence'
                        ? 'info'
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
            backgroundColor: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '720px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.75rem',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
                  ⚖️ Dispute Review: #{selectedCase.id}
                </h3>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Order #{selectedCase.orderNumber} • Claim: {selectedCase.claimedAmountFormatted}</span>
              </div>
              <button
                onClick={() => setDecisionModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}
              >
                ×
              </button>
            </div>

            {/* Evidence Bundle Section */}
            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#475569', fontWeight: 700, textTransform: 'uppercase' }}>
                Automated Evidence Bundle (§8.6)
              </h4>
              <div style={{ fontSize: '13px', marginBottom: '6px' }}>
                <strong>Buyer Stated Claim:</strong> "{selectedCase.reason}"
              </div>
              <div style={{ fontSize: '13px', marginBottom: '10px' }}>
                <strong>Carrier Scan & POD:</strong> {selectedCase.trackingStatus} (Tracking: <code>{selectedCase.trackingNumber}</code>)
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
                      backgroundColor: '#ffffff',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 700, textTransform: 'uppercase', marginRight: '6px' }}>
                        [{ev.party} - {ev.kind}]:
                      </span>
                      <span>{ev.notes}</span>
                    </div>
                    <a
                      href={ev.uri}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}
                    >
                      View File ↗
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Adjudication Outcome Decision Radio */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                Select Binding Mediation Ruling (§8.6):
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="outcome"
                    checked={selectedOutcome === 'buyer'}
                    onChange={() => setSelectedOutcome('buyer')}
                  />
                  <div>
                    <div style={{ fontWeight: 600, color: '#be123c' }}>Rule in Buyer's Favor (Full Refund from Vendor)</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Executes ledger debit on vendor_payable, credits buyer. Deducts vendor health score.</div>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="outcome"
                    checked={selectedOutcome === 'guarantee'}
                    onChange={() => setSelectedOutcome('guarantee')}
                  />
                  <div>
                    <div style={{ fontWeight: 600, color: '#3b82f6' }}>Settle via Platform Guarantee Fund</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Compensates buyer from platform reserves without penalizing vendor (e.g. carrier damaged in transit).</div>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="outcome"
                    checked={selectedOutcome === 'vendor'}
                    onChange={() => setSelectedOutcome('vendor')}
                  />
                  <div>
                    <div style={{ fontWeight: 600, color: '#15803d' }}>Rule in Vendor's Favor (Dismiss Claim)</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Valid POD verified; buyer remorse or unfounded defect. Releases hold to vendor.</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Rationale Input */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                Audited Mediation Rationale (Required for Ledger Execution):
              </label>
              <textarea
                rows={3}
                value={resolutionRationale}
                onChange={(e) => setResolutionRationale(e.target.value)}
                placeholder="Explain the factual basis for this ruling and policy cited..."
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Footer Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button variant="ghost" onClick={() => setDecisionModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={!resolutionRationale.trim()}
                onClick={handleResolve}
              >
                Execute Ledger Settlement & Close Case
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
