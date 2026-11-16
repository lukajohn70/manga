import * as React from 'react';
import { Button, Badge } from '@manga/ui';
import { Wrench, RotateCcw, Package, Search, Scale, FileText, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

export interface AuditLogItem {
  id: string;
  actorId: string;
  actorRole: string;
  action: string;
  targetType: string;
  targetId: string;
  reason: string;
  timestamp: string;
}

export const RepairTools: React.FC = () => {
  const [activeTool, setActiveTool] = React.useState<'outbox' | 'reservation' | 'search' | 'ledger' | 'logs'>('outbox');
  const [notification, setNotification] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form states
  const [outboxEventId, setOutboxEventId] = React.useState('');
  const [outboxReason, setOutboxReason] = React.useState('');

  const [reservationId, setReservationId] = React.useState('');
  const [reservationReason, setReservationReason] = React.useState('');

  const [searchProductId, setSearchProductId] = React.useState('');
  const [searchReason, setSearchReason] = React.useState('');

  const [ledgerTxId, setLedgerTxId] = React.useState('');
  const [ledgerCheckerId, setLedgerCheckerId] = React.useState('checker_lead@manga.ng');
  const [ledgerReason, setLedgerReason] = React.useState('');

  const [auditLogs, setAuditLogs] = React.useState<AuditLogItem[]>([
    {
      id: 'aud-901',
      actorId: 'admin_ops@manga.ng',
      actorRole: 'admin_support',
      action: 'REPLAY_OUTBOX_EVENT',
      targetType: 'outbox_event',
      targetId: 'evt-4819-order-confirmed',
      reason: 'Push notification timeout due to carrier webhook delay',
      timestamp: '10 minutes ago',
    },
    {
      id: 'aud-902',
      actorId: 'inventory_lead@manga.ng',
      actorRole: 'inventory_ops',
      action: 'RELEASE_STUCK_RESERVATION',
      targetType: 'inventory_reservation',
      targetId: 'res-8812-cart-abandoned',
      reason: 'Cart session expired past 30-minute hold window',
      timestamp: '35 minutes ago',
    },
    {
      id: 'aud-903',
      actorId: 'finance_maker@manga.ng',
      actorRole: 'finance_admin',
      action: 'REVERSE_LEDGER_TRANSACTION',
      targetType: 'ledger_transaction',
      targetId: 'tx-2291-duplicate-fee',
      reason: 'Reversing erroneous gateway surcharge posting',
      timestamp: '2 hours ago',
    },
  ]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleReplayOutbox = (e: React.FormEvent) => {
    e.preventDefault();
    if (!outboxEventId.trim() || !outboxReason.trim()) {
      showNotification('error', 'Please provide both the Event Reference Identifier and an operational reason for redelivery.');
      return;
    }
    const newLog: AuditLogItem = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      actorId: 'sec_ops@manga.ng',
      actorRole: 'admin_support',
      action: 'REPLAY_OUTBOX_EVENT',
      targetType: 'outbox_event',
      targetId: outboxEventId.trim(),
      reason: outboxReason.trim(),
      timestamp: 'Just now',
    };
    setAuditLogs([newLog, ...auditLogs]);
    showNotification('success', `Event ${outboxEventId} has been successfully re-queued for delivery.`);
    setOutboxEventId('');
    setOutboxReason('');
  };

  const handleReleaseReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservationId.trim() || !reservationReason.trim()) {
      showNotification('error', 'Please provide both the Reservation Reference and an operational explanation.');
      return;
    }
    const newLog: AuditLogItem = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      actorId: 'sec_ops@manga.ng',
      actorRole: 'inventory_ops',
      action: 'RELEASE_STUCK_RESERVATION',
      targetType: 'inventory_reservation',
      targetId: reservationId.trim(),
      reason: reservationReason.trim(),
      timestamp: 'Just now',
    };
    setAuditLogs([newLog, ...auditLogs]);
    showNotification('success', `Reservation ${reservationId} released. Stock has been restored to merchant available quantity.`);
    setReservationId('');
    setReservationReason('');
  };

  const handleRefreshSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchProductId.trim() || !searchReason.trim()) {
      showNotification('error', 'Please provide the Product Identifier and an operational reason.');
      return;
    }
    const newLog: AuditLogItem = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      actorId: 'sec_ops@manga.ng',
      actorRole: 'catalog_ops',
      action: 'REFRESH_SEARCH_INDEX',
      targetType: 'catalog_product',
      targetId: searchProductId.trim(),
      reason: searchReason.trim(),
      timestamp: 'Just now',
    };
    setAuditLogs([newLog, ...auditLogs]);
    showNotification('success', `Search index listing for product ${searchProductId} has been synchronized.`);
    setSearchProductId('');
    setSearchReason('');
  };

  const handleReverseLedger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ledgerTxId.trim() || !ledgerReason.trim() || !ledgerCheckerId.trim()) {
      showNotification('error', 'Dual-authorization requires supervisor email and detailed justification.');
      return;
    }
    const newLog: AuditLogItem = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      actorId: 'sec_ops@manga.ng',
      actorRole: 'finance_admin',
      action: 'REVERSE_LEDGER_TRANSACTION',
      targetType: 'ledger_transaction',
      targetId: ledgerTxId.trim(),
      reason: `${ledgerReason.trim()} (Dual-verified by: ${ledgerCheckerId.trim()})`,
      timestamp: 'Just now',
    };
    setAuditLogs([newLog, ...auditLogs]);
    showNotification('success', `Audited balancing adjustment posted for transaction ${ledgerTxId}. Account balances remain in zero-variance harmony.`);
    setLedgerTxId('');
    setLedgerReason('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Banner */}
      <div
        style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          borderRadius: '10px',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
            }}
          >
            <Wrench size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700 }}>
              Operational Recovery & Administrative Interventions
            </h3>
            <p style={{ margin: '3px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>
              Dual-control authorized tools for transaction re-delivery, inventory release, search synchronization, and balanced adjustments.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Badge variant="warning">Audit Log Enforced</Badge>
          <Badge variant="success">Zero Variance Verified</Badge>
        </div>
      </div>

      {notification && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: notification.type === 'success' ? '#ecfdf5' : '#fef2f2',
            color: notification.type === 'success' ? '#065f46' : '#991b1b',
            border: `1px solid ${notification.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
            fontSize: '14px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {notification.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Tool Selection Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
        <button
          onClick={() => setActiveTool('outbox')}
          style={{
            padding: '8px 14px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTool === 'outbox' ? '#0f172a' : '#f1f5f9',
            color: activeTool === 'outbox' ? '#ffffff' : '#475569',
            fontWeight: 600,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <RotateCcw size={14} /> Replay Notification Event
        </button>
        <button
          onClick={() => setActiveTool('reservation')}
          style={{
            padding: '8px 14px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTool === 'reservation' ? '#0f172a' : '#f1f5f9',
            color: activeTool === 'reservation' ? '#ffffff' : '#475569',
            fontWeight: 600,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Package size={14} /> Release Inventory Hold
        </button>
        <button
          onClick={() => setActiveTool('search')}
          style={{
            padding: '8px 14px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTool === 'search' ? '#0f172a' : '#f1f5f9',
            color: activeTool === 'search' ? '#ffffff' : '#475569',
            fontWeight: 600,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Search size={14} /> Sync Search Listing
        </button>
        <button
          onClick={() => setActiveTool('ledger')}
          style={{
            padding: '8px 14px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTool === 'ledger' ? '#0f172a' : '#f1f5f9',
            color: activeTool === 'ledger' ? '#ffffff' : '#475569',
            fontWeight: 600,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Scale size={14} /> Dual-Control Balance Adjustment
        </button>
        <button
          onClick={() => setActiveTool('logs')}
          style={{
            padding: '8px 14px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTool === 'logs' ? '#0f172a' : '#f1f5f9',
            color: activeTool === 'logs' ? '#ffffff' : '#475569',
            fontWeight: 600,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <FileText size={14} /> Immutable Audit Log ({auditLogs.length})
        </button>
      </div>

      {/* Outbox Tool Form */}
      {activeTool === 'outbox' && (
        <div style={{ backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
          <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
            Event Redelivery & Notification Resend
          </h4>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '13px', color: '#64748b' }}>
            Re-enqueues transaction notifications or order updates that encountered downstream carrier timeout, ensuring reliable customer receipt.
          </p>
          <form onSubmit={handleReplayOutbox} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '580px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                Event Reference Identifier:
              </label>
              <input
                type="text"
                value={outboxEventId}
                onChange={(e) => setOutboxEventId(e.target.value)}
                placeholder="e.g. evt-4819-order-confirmed"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                Operational Justification (Logged to Audit Trail):
              </label>
              <textarea
                value={outboxReason}
                onChange={(e) => setOutboxReason(e.target.value)}
                placeholder="Document why manual redelivery is required..."
                rows={3}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <Button variant="primary">Re-enqueue Event</Button>
            </div>
          </form>
        </div>
      )}

      {/* Reservation Tool Form */}
      {activeTool === 'reservation' && (
        <div style={{ backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
          <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
            Release Uncompleted Checkout Inventory Hold
          </h4>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '13px', color: '#64748b' }}>
            Unlocks temporary inventory holds associated with abandoned checkout sessions exceeding the 30-minute window, returning stock to the merchant's live catalog.
          </p>
          <form onSubmit={handleReleaseReservation} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '580px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                Hold Reference Identifier:
              </label>
              <input
                type="text"
                value={reservationId}
                onChange={(e) => setReservationId(e.target.value)}
                placeholder="e.g. res-8812-cart-abandoned"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                Confirmation Reason:
              </label>
              <textarea
                value={reservationReason}
                onChange={(e) => setReservationReason(e.target.value)}
                placeholder="Confirm that the checkout session was abandoned or timed out..."
                rows={3}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <Button variant="secondary" style={{ backgroundColor: '#be123c', color: '#ffffff' }}>Release Stock to Catalog</Button>
            </div>
          </form>
        </div>
      )}

      {/* Search Refresh Tool Form */}
      {activeTool === 'search' && (
        <div style={{ backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
          <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
            Catalog Search Listing Synchronization
          </h4>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '13px', color: '#64748b' }}>
            Synchronizes merchant price updates, stock levels, or specifications with the customer search index for instantaneous discovery.
          </p>
          <form onSubmit={handleRefreshSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '580px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                Product SKU or Item Identifier:
              </label>
              <input
                type="text"
                value={searchProductId}
                onChange={(e) => setSearchProductId(e.target.value)}
                placeholder="e.g. prod-9941-smart-watch"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                Sync Reason:
              </label>
              <textarea
                value={searchReason}
                onChange={(e) => setSearchReason(e.target.value)}
                placeholder="Document reason for search index re-alignment..."
                rows={3}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <Button variant="primary">Synchronize Listing</Button>
            </div>
          </form>
        </div>
      )}

      {/* Ledger Reversal Tool Form */}
      {activeTool === 'ledger' && (
        <div style={{ backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
          <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
            Dual-Control Financial Balance Correction
          </h4>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '13px', color: '#64748b' }}>
            Appends an audited balancing adjustment to correct an erroneous posting. Requires dual supervisor sign-off to ensure financial integrity.
          </p>
          <form onSubmit={handleReverseLedger} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '580px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                Transaction Reference:
              </label>
              <input
                type="text"
                value={ledgerTxId}
                onChange={(e) => setLedgerTxId(e.target.value)}
                placeholder="e.g. tx-2291-duplicate-fee"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                Authorizing Supervisor Email (Dual Verification):
              </label>
              <input
                type="email"
                value={ledgerCheckerId}
                onChange={(e) => setLedgerCheckerId(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                Financial Explanation & Audit Note:
              </label>
              <textarea
                value={ledgerReason}
                onChange={(e) => setLedgerReason(e.target.value)}
                placeholder="Explain the accounting discrepancy and justification for the adjustment..."
                rows={3}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <Button variant="secondary" style={{ backgroundColor: '#be123c', color: '#ffffff' }}>Authorize & Post Balancing Entry</Button>
            </div>
          </form>
        </div>
      )}

      {/* Forensic Audit Log */}
      {activeTool === 'logs' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={16} color="#0f172a" />
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Immutable Administrative Audit Trail</h4>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '10px 14px', fontWeight: 600 }}>Log Reference</th>
                <th style={{ padding: '10px 14px', fontWeight: 600 }}>Action</th>
                <th style={{ padding: '10px 14px', fontWeight: 600 }}>Target Entity</th>
                <th style={{ padding: '10px 14px', fontWeight: 600 }}>Authorized Operator</th>
                <th style={{ padding: '10px 14px', fontWeight: 600 }}>Audit Justification</th>
                <th style={{ padding: '10px 14px', fontWeight: 600 }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#64748b' }}>{log.id}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0f172a' }}>{log.action}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <Badge variant="neutral">{log.targetType}: {log.targetId}</Badge>
                  </td>
                  <td style={{ padding: '10px 14px', color: '#0369a1', fontWeight: 500 }}>{log.actorId}</td>
                  <td style={{ padding: '10px 14px', color: '#475569' }}>{log.reason}</td>
                  <td style={{ padding: '10px 14px', color: '#94a3b8' }}>{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
