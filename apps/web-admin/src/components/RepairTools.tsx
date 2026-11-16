import * as React from 'react';
import { Button, Badge } from '@manga/ui';

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
    if (!outboxEventId || !outboxReason) {
      showNotification('error', 'Please fill in both Outbox Event ID and Audit Reason');
      return;
    }
    const newLog: AuditLogItem = {
      id: `aud-${Date.now()}`,
      actorId: 'sec_ops@manga.ng',
      actorRole: 'admin_support',
      action: 'REPLAY_OUTBOX_EVENT',
      targetType: 'outbox_event',
      targetId: outboxEventId,
      reason: outboxReason,
      timestamp: 'Just now',
    };
    setAuditLogs([newLog, ...auditLogs]);
    showNotification('success', `Event ${outboxEventId} staged for immediate redelivery!`);
    setOutboxEventId('');
    setOutboxReason('');
  };

  const handleReleaseReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservationId || !reservationReason) {
      showNotification('error', 'Please fill in both Reservation ID and Audit Reason');
      return;
    }
    const newLog: AuditLogItem = {
      id: `aud-${Date.now()}`,
      actorId: 'sec_ops@manga.ng',
      actorRole: 'inventory_ops',
      action: 'RELEASE_STUCK_RESERVATION',
      targetType: 'inventory_reservation',
      targetId: reservationId,
      reason: reservationReason,
      timestamp: 'Just now',
    };
    setAuditLogs([newLog, ...auditLogs]);
    showNotification('success', `Reservation ${reservationId} released. Stock restored to available.`);
    setReservationId('');
    setReservationReason('');
  };

  const handleRefreshSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchProductId || !searchReason) {
      showNotification('error', 'Please fill in Product ID and Audit Reason');
      return;
    }
    const newLog: AuditLogItem = {
      id: `aud-${Date.now()}`,
      actorId: 'sec_ops@manga.ng',
      actorRole: 'catalog_ops',
      action: 'REFRESH_SEARCH_INDEX',
      targetType: 'catalog_product',
      targetId: searchProductId,
      reason: searchReason,
      timestamp: 'Just now',
    };
    setAuditLogs([newLog, ...auditLogs]);
    showNotification('success', `Search index force-refreshed for product ${searchProductId}!`);
    setSearchProductId('');
    setSearchReason('');
  };

  const handleReverseLedger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ledgerTxId || !ledgerReason || !ledgerCheckerId) {
      showNotification('error', 'Dual maker-checker verification required.');
      return;
    }
    const newLog: AuditLogItem = {
      id: `aud-${Date.now()}`,
      actorId: 'sec_ops@manga.ng',
      actorRole: 'finance_admin',
      action: 'REVERSE_LEDGER_TRANSACTION',
      targetType: 'ledger_transaction',
      targetId: ledgerTxId,
      reason: `${ledgerReason} (Approved by: ${ledgerCheckerId})`,
      timestamp: 'Just now',
    };
    setAuditLogs([newLog, ...auditLogs]);
    showNotification('success', `Balanced reversing transaction posted for tx ${ledgerTxId}.`);
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
          borderRadius: '8px',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
            🛠️ Operational Repair & Diagnostic Tools (§18)
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>
            Administrative saga interventions, event replay, inventory release, and audited ledger reversals.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Badge variant="warning">Audit Log Enforced</Badge>
          <Badge variant="success">Zero Unbalanced Variance</Badge>
        </div>
      </div>

      {notification && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '6px',
            backgroundColor: notification.type === 'success' ? '#ecfdf5' : '#fef2f2',
            color: notification.type === 'success' ? '#065f46' : '#991b1b',
            border: `1px solid ${notification.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          {notification.message}
        </div>
      )}

      {/* Tool Selection Tabs */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
        <button
          onClick={() => setActiveTool('outbox')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTool === 'outbox' ? '#0284c7' : '#f1f5f9',
            color: activeTool === 'outbox' ? '#ffffff' : '#475569',
            fontWeight: 600,
            fontSize: '13px',
          }}
        >
          📨 Replay Outbox Event
        </button>
        <button
          onClick={() => setActiveTool('reservation')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTool === 'reservation' ? '#0284c7' : '#f1f5f9',
            color: activeTool === 'reservation' ? '#ffffff' : '#475569',
            fontWeight: 600,
            fontSize: '13px',
          }}
        >
          📦 Release Stuck Reservation
        </button>
        <button
          onClick={() => setActiveTool('search')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTool === 'search' ? '#0284c7' : '#f1f5f9',
            color: activeTool === 'search' ? '#ffffff' : '#475569',
            fontWeight: 600,
            fontSize: '13px',
          }}
        >
          🔍 Force-Refresh Search Index
        </button>
        <button
          onClick={() => setActiveTool('ledger')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTool === 'ledger' ? '#0284c7' : '#f1f5f9',
            color: activeTool === 'ledger' ? '#ffffff' : '#475569',
            fontWeight: 600,
            fontSize: '13px',
          }}
        >
          ⚖️ Reverse Ledger Tx (Maker-Checker)
        </button>
        <button
          onClick={() => setActiveTool('logs')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTool === 'logs' ? '#0284c7' : '#f1f5f9',
            color: activeTool === 'logs' ? '#ffffff' : '#475569',
            fontWeight: 600,
            fontSize: '13px',
          }}
        >
          📋 Forensic Audit Trail ({auditLogs.length})
        </button>
      </div>

      {/* Outbox Tool Form */}
      {activeTool === 'outbox' && (
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>📨 Outbox Event Manual Replay</h4>
          <p style={{ margin: '0 0 1rem 0', fontSize: '13px', color: '#64748b' }}>
            Resets a failed or unconsumed domain event back to pending status in <code>outbox.events</code> for immediate worker fan-out.
          </p>
          <form onSubmit={handleReplayOutbox} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                Event UUID:
              </label>
              <input
                type="text"
                value={outboxEventId}
                onChange={(e) => setOutboxEventId(e.target.value)}
                placeholder="e.g. b8c4e019-33d1-419b-a01b-871d34e912ab"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                Reason for Replay (Logged in Audit Trail):
              </label>
              <textarea
                value={outboxReason}
                onChange={(e) => setOutboxReason(e.target.value)}
                placeholder="Explain why this event requires manual re-triggering..."
                rows={3}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <Button variant="primary">Replay Event</Button>
          </form>
        </div>
      )}

      {/* Reservation Tool Form */}
      {activeTool === 'reservation' && (
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>📦 Release Stuck Inventory Reservation</h4>
          <p style={{ margin: '0 0 1rem 0', fontSize: '13px', color: '#64748b' }}>
            Unlocks reserved stock held by an abandoned checkout session or broken saga, restoring inventory balance.
          </p>
          <form onSubmit={handleReleaseReservation} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                Reservation UUID:
              </label>
              <input
                type="text"
                value={reservationId}
                onChange={(e) => setReservationId(e.target.value)}
                placeholder="e.g. res-194124-abc"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                Reason for Release:
              </label>
              <textarea
                value={reservationReason}
                onChange={(e) => setReservationReason(e.target.value)}
                placeholder="Reason why this reservation is confirmed orphaned..."
                rows={3}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <Button variant="secondary" style={{ backgroundColor: '#dc2626', color: '#ffffff' }}>Release Stock</Button>
          </form>
        </div>
      )}

      {/* Search Refresh Tool Form */}
      {activeTool === 'search' && (
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>🔍 Force-Refresh Search Document</h4>
          <p style={{ margin: '0 0 1rem 0', fontSize: '13px', color: '#64748b' }}>
            Directly invokes the Typesense/OpenSearch indexing pipeline to sync stale catalog documents.
          </p>
          <form onSubmit={handleRefreshSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                Product ID / GTIN:
              </label>
              <input
                type="text"
                value={searchProductId}
                onChange={(e) => setSearchProductId(e.target.value)}
                placeholder="e.g. prod-9941-smart-watch"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                Reason for Force-Refresh:
              </label>
              <textarea
                value={searchReason}
                onChange={(e) => setSearchReason(e.target.value)}
                placeholder="Reason for triggering index update..."
                rows={3}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <Button variant="primary">Refresh Document</Button>
          </form>
        </div>
      )}

      {/* Ledger Reversal Tool Form */}
      {activeTool === 'ledger' && (
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>⚖️ Reverse Ledger Transaction (Maker-Checker Enforced)</h4>
          <p style={{ margin: '0 0 1rem 0', fontSize: '13px', color: '#64748b' }}>
            Appends an exact balancing reversal transaction (D ↔ C) maintaining ΣDebits = ΣCredits. Requires dual supervisor signoff.
          </p>
          <form onSubmit={handleReverseLedger} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                Transaction ID:
              </label>
              <input
                type="text"
                value={ledgerTxId}
                onChange={(e) => setLedgerTxId(e.target.value)}
                placeholder="e.g. tx-7782-capture-hold"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                Checker / Approver Email (MFA verified):
              </label>
              <input
                type="text"
                value={ledgerCheckerId}
                onChange={(e) => setLedgerCheckerId(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                Financial Justification:
              </label>
              <textarea
                value={ledgerReason}
                onChange={(e) => setLedgerReason(e.target.value)}
                placeholder="Specify error in original transaction and justification for reversal..."
                rows={3}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <Button variant="secondary" style={{ backgroundColor: '#dc2626', color: '#ffffff' }}>Execute Reversal</Button>
          </form>
        </div>
      )}

      {/* Forensic Audit Log */}
      {activeTool === 'logs' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
            <h4 style={{ margin: 0, fontSize: '15px' }}>📋 Immutable Administrative Audit Trail (§12.4)</h4>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left', borderBottom: '1px solid #cbd5e1' }}>
                <th style={{ padding: '10px 14px' }}>Log ID</th>
                <th style={{ padding: '10px 14px' }}>Action</th>
                <th style={{ padding: '10px 14px' }}>Target</th>
                <th style={{ padding: '10px 14px' }}>Actor</th>
                <th style={{ padding: '10px 14px' }}>Reason</th>
                <th style={{ padding: '10px 14px' }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#64748b' }}>{log.id}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>{log.action}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <Badge variant="neutral">{log.targetType}: {log.targetId}</Badge>
                  </td>
                  <td style={{ padding: '10px 14px', color: '#0369a1' }}>{log.actorId}</td>
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
