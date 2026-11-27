import * as React from 'react';
import {
  Wrench,
  RotateCcw,
  Package,
  Search,
  Scale,
  FileText,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Send,
} from 'lucide-react';

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
      reason: 'Dual-verified balance adjustment for duplicated fee posting',
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Banner */}
      <div
        className="admin-card"
        style={{
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            className="squircle"
            style={{
              width: '38px',
              height: '38px',
              backgroundColor: 'var(--accent-primary-glow)',
              color: 'var(--accent-primary)',
            }}
          >
            <Wrench size={19} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, fontFamily: 'Fraunces, Georgia, serif', color: 'var(--text-primary)' }}>
              Operational Recovery & Administrative Interventions
            </h3>
            <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
              Dual-control authorized tools for transaction re-delivery, inventory release, search synchronization, and balanced adjustments.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="status-pill warn">Audit Log Enforced</span>
          <span className="status-pill good">Zero Variance Verified</span>
        </div>
      </div>

      {notification && (
        <div
          className={`status-pill ${notification.type === 'success' ? 'good' : 'bad'}`}
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            fontSize: '12.5px',
            fontWeight: 600,
          }}
        >
          {notification.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Tool Selection Tabs */}
      <div className="segmented-control" style={{ alignSelf: 'flex-start', flexWrap: 'wrap' }}>
        {[
          { id: 'outbox' as const, label: 'Replay Outbox Event', icon: RotateCcw },
          { id: 'reservation' as const, label: 'Release Inventory Hold', icon: Package },
          { id: 'search' as const, label: 'Sync Search Index', icon: Search },
          { id: 'ledger' as const, label: 'Dual-Control Balance', icon: Scale },
          { id: 'logs' as const, label: `Audit Trail (${auditLogs.length})`, icon: FileText },
        ].map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => setActiveTool(tool.id)}
              className={`segmented-pill ${activeTool === tool.id ? 'active' : ''}`}
            >
              <Icon size={14} />
              <span>{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* Outbox Tool Form */}
      {activeTool === 'outbox' && (
        <div className="admin-card" style={{ padding: '24px' }}>
          <h4 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Fraunces, Georgia, serif' }}>
            Event Redelivery & Notification Resend
          </h4>
          <p style={{ margin: '0 0 16px', fontSize: '12px', color: 'var(--text-muted)' }}>
            Re-enqueues transaction notifications or order updates that encountered downstream carrier timeout, ensuring reliable customer receipt.
          </p>
          <form onSubmit={handleReplayOutbox} style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '580px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Event Reference Identifier:
              </label>
              <input
                type="text"
                value={outboxEventId}
                onChange={(e) => setOutboxEventId(e.target.value)}
                placeholder="e.g. evt-4819-order-confirmed"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-line)', backgroundColor: 'var(--bg-well)', color: 'var(--text-primary)', fontSize: '12.5px', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Operational Justification (Logged to Audit Trail):
              </label>
              <textarea
                value={outboxReason}
                onChange={(e) => setOutboxReason(e.target.value)}
                placeholder="Document why manual redelivery is required..."
                rows={3}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-line)', backgroundColor: 'var(--bg-well)', color: 'var(--text-primary)', fontSize: '12.5px', outline: 'none', fontFamily: 'inherit' }}
              />
            </div>
            <div>
              <button
                type="submit"
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'var(--accent-primary)',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Re-enqueue Event
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reservation Tool Form */}
      {activeTool === 'reservation' && (
        <div className="admin-card" style={{ padding: '24px' }}>
          <h4 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Fraunces, Georgia, serif' }}>
            Release Uncompleted Checkout Inventory Hold
          </h4>
          <p style={{ margin: '0 0 16px', fontSize: '12px', color: 'var(--text-muted)' }}>
            Unlocks temporary inventory holds associated with abandoned checkout sessions exceeding the 30-minute window, returning stock to the merchant's live catalog.
          </p>
          <form onSubmit={handleReleaseReservation} style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '580px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Hold Reference Identifier:
              </label>
              <input
                type="text"
                value={reservationId}
                onChange={(e) => setReservationId(e.target.value)}
                placeholder="e.g. res-8812-cart-abandoned"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-line)', backgroundColor: 'var(--bg-well)', color: 'var(--text-primary)', fontSize: '12.5px', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Confirmation Reason:
              </label>
              <textarea
                value={reservationReason}
                onChange={(e) => setReservationReason(e.target.value)}
                placeholder="Confirm that the checkout session was abandoned or timed out..."
                rows={3}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-line)', backgroundColor: 'var(--bg-well)', color: 'var(--text-primary)', fontSize: '12.5px', outline: 'none', fontFamily: 'inherit' }}
              />
            </div>
            <div>
              <button
                type="submit"
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'var(--status-bad)',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Release Stock to Catalog
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search Refresh Tool Form */}
      {activeTool === 'search' && (
        <div className="admin-card" style={{ padding: '24px' }}>
          <h4 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Fraunces, Georgia, serif' }}>
            Catalog Search Listing Synchronization
          </h4>
          <p style={{ margin: '0 0 16px', fontSize: '12px', color: 'var(--text-muted)' }}>
            Synchronizes merchant price updates, stock levels, or specifications with the customer search index for instantaneous discovery.
          </p>
          <form onSubmit={handleRefreshSearch} style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '580px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Product SKU or Item Identifier:
              </label>
              <input
                type="text"
                value={searchProductId}
                onChange={(e) => setSearchProductId(e.target.value)}
                placeholder="e.g. prod-9941-smart-watch"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-line)', backgroundColor: 'var(--bg-well)', color: 'var(--text-primary)', fontSize: '12.5px', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Sync Reason:
              </label>
              <textarea
                value={searchReason}
                onChange={(e) => setSearchReason(e.target.value)}
                placeholder="Document reason for search index re-alignment..."
                rows={3}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-line)', backgroundColor: 'var(--bg-well)', color: 'var(--text-primary)', fontSize: '12.5px', outline: 'none', fontFamily: 'inherit' }}
              />
            </div>
            <div>
              <button
                type="submit"
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'var(--accent-primary)',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Synchronize Listing
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ledger Reversal Tool Form */}
      {activeTool === 'ledger' && (
        <div className="admin-card" style={{ padding: '24px' }}>
          <h4 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Fraunces, Georgia, serif' }}>
            Dual-Control Financial Balance Correction
          </h4>
          <p style={{ margin: '0 0 16px', fontSize: '12px', color: 'var(--text-muted)' }}>
            Appends an audited balancing adjustment to correct an erroneous posting. Requires dual supervisor sign-off to ensure financial integrity.
          </p>
          <form onSubmit={handleReverseLedger} style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '580px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Transaction Reference:
              </label>
              <input
                type="text"
                value={ledgerTxId}
                onChange={(e) => setLedgerTxId(e.target.value)}
                placeholder="e.g. tx-2291-duplicate-fee"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-line)', backgroundColor: 'var(--bg-well)', color: 'var(--text-primary)', fontSize: '12.5px', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Authorizing Supervisor Email (Dual Verification):
              </label>
              <input
                type="email"
                value={ledgerCheckerId}
                onChange={(e) => setLedgerCheckerId(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-line)', backgroundColor: 'var(--bg-well)', color: 'var(--text-primary)', fontSize: '12.5px', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Financial Explanation & Audit Note:
              </label>
              <textarea
                value={ledgerReason}
                onChange={(e) => setLedgerReason(e.target.value)}
                placeholder="Explain the accounting discrepancy and justification for the adjustment..."
                rows={3}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-line)', backgroundColor: 'var(--bg-well)', color: 'var(--text-primary)', fontSize: '12.5px', outline: 'none', fontFamily: 'inherit' }}
              />
            </div>
            <div>
              <button
                type="submit"
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'var(--status-bad)',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Authorize & Post Balancing Entry
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Forensic Audit Log */}
      {activeTool === 'logs' && (
        <div className="admin-table-container">
          <div
            style={{
              padding: '14px 18px',
              borderBottom: '1px solid var(--border-line)',
              backgroundColor: 'var(--bg-well)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <FileText size={16} color="var(--accent-primary)" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Immutable Administrative Audit Trail
            </span>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Log Reference</th>
                <th>Action</th>
                <th>Target Entity</th>
                <th>Authorized Operator</th>
                <th>Audit Justification</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <span className="tabular-nums" style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                      {log.id}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{log.action}</td>
                  <td>
                    <span className="status-pill neutral" style={{ fontSize: '10.5px' }}>
                      {log.targetType}: {log.targetId}
                    </span>
                  </td>
                  <td style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{log.actorId}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{log.reason}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
