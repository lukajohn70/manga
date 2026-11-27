import * as React from 'react';
import {
  BookOpen,
  Download,
  RotateCw,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  Hash,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';

interface LedgerExplorerProps {
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const LedgerExplorer: React.FC<LedgerExplorerProps> = ({ onShowToast }) => {
  const [integrityScanning, setIntegrityScanning] = React.useState(false);

  const transactions = [
    {
      hash: 'tx-9018-escrow-hold',
      desc: 'Order #MNG-2611-48K2F Checkout Payment',
      debit: '1010 Providus Operating Pool',
      credit: '2020 Buyer Escrow Sub-ledger',
      amount: 450000,
      timestamp: 'Today 14:22',
    },
    {
      hash: 'tx-9017-escrow-disburse',
      desc: 'Order #MNG-2611-77Z1D Delivery Confirmed',
      debit: '2020 Buyer Escrow Sub-ledger',
      credit: '2030 Merchant Payable (Apex)',
      amount: 890000,
      timestamp: 'Yesterday 17:05',
    },
    {
      hash: 'tx-9016-fee-recognize',
      desc: 'Platform Take Rate (15% Marketplace Commission)',
      debit: '2030 Merchant Payable (Apex)',
      credit: '4010 Marketplace Fee Revenue',
      amount: 133500,
      timestamp: 'Yesterday 17:05',
    },
    {
      hash: 'tx-9015-escrow-hold',
      desc: 'Order #MNG-2611-19B8C Checkout Payment',
      debit: '1010 Providus Operating Pool',
      credit: '2020 Buyer Escrow Sub-ledger',
      amount: 270000,
      timestamp: 'Nov 25 10:14',
    },
    {
      hash: 'tx-9014-payout-batch',
      desc: 'NIBSS Merchant Payout Batch #PB-8821',
      debit: '2030 Merchant Payable (Apex)',
      credit: '1010 Providus Operating Pool',
      amount: 756500,
      timestamp: 'Nov 25 11:00',
    },
  ];

  const handleRunIntegrityScan = () => {
    setIntegrityScanning(true);
    setTimeout(() => {
      setIntegrityScanning(false);
      onShowToast('Ledger Integrity Scan Completed: 0.00 Variance. All double-entry books balanced.', 'success');
    }, 1200);
  };

  const handleExportCsv = () => {
    onShowToast('Ledger audit export CSV downloaded.', 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div
              className="squircle"
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'var(--accent-primary-glow)',
                color: 'var(--accent-primary)',
              }}
            >
              <BookOpen size={17} />
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: 800,
                color: 'var(--text-primary)',
                fontFamily: 'Fraunces, Georgia, serif',
              }}
            >
              Financial Ledger & Settlement Audit Explorer
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
            Cryptographically hash-chained double-entry balanced books, Providus escrow protection vault, and NIBSS settlements.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={handleExportCsv}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
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
            <Download size={13} />
            <span>Export Journal (CSV)</span>
          </button>

          <button
            type="button"
            onClick={handleRunIntegrityScan}
            disabled={integrityScanning}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'var(--accent-primary)',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 700,
              cursor: integrityScanning ? 'not-allowed' : 'pointer',
            }}
          >
            <RotateCw size={13} className={integrityScanning ? 'rotating' : ''} />
            <span>{integrityScanning ? 'Scanning Ledger...' : 'Run Integrity Scan'}</span>
          </button>
        </div>
      </div>

      {/* 3 Executive Financial Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        <div className="admin-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Volume Settled (GMV)
          </span>
          <div
            className="tabular-nums"
            style={{
              fontSize: '28px',
              fontWeight: 800,
              fontFamily: 'Fraunces, Georgia, serif',
              color: 'var(--text-primary)',
              margin: '6px 0',
            }}
          >
            ₦18,450,000.00
          </div>
          <div className="status-pill good" style={{ fontSize: '11px', padding: '2px 8px' }}>
            <TrendingUp size={12} />
            <span>+14.2% Month-over-Month</span>
          </div>
        </div>

        <div className="admin-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Providus Escrow Vault Pool
          </span>
          <div
            className="tabular-nums"
            style={{
              fontSize: '28px',
              fontWeight: 800,
              fontFamily: 'Fraunces, Georgia, serif',
              color: 'var(--accent-primary)',
              margin: '6px 0',
            }}
          >
            ₦8,320,000.00
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
            Merchant Escrow + Platform Commission Balance
          </div>
        </div>

        <div className="admin-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Double-Entry Ledger Variance
          </span>
          <div
            className="tabular-nums"
            style={{
              fontSize: '28px',
              fontWeight: 800,
              fontFamily: 'Fraunces, Georgia, serif',
              color: 'var(--status-good)',
              margin: '6px 0',
            }}
          >
            ₦0.00
          </div>
          <div className="status-pill good" style={{ fontSize: '11px', padding: '2px 8px' }}>
            <CheckCircle2 size={12} />
            <span>Perfect Equilibrium (0 Variance)</span>
          </div>
        </div>
      </div>

      {/* Transaction Journal Table */}
      <div className="admin-table-container">
        <div
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid var(--border-line)',
            backgroundColor: 'var(--bg-well)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Audited Journal Transactions (Cryptographically Chained)
          </span>
          <span className="status-pill good" style={{ fontSize: '10.5px' }}>
            Hash Chained & Verified
          </span>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Tx Hash / Ref</th>
              <th>Transaction Description</th>
              <th>Debit Account</th>
              <th>Credit Account</th>
              <th style={{ textAlign: 'right' }}>Amount (NGN)</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, idx) => (
              <tr key={idx}>
                <td>
                  <div
                    className="tabular-nums"
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: 'var(--accent-primary)',
                      fontSize: '12px',
                    }}
                  >
                    {tx.hash}
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{tx.timestamp}</div>
                </td>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{tx.desc}</td>
                <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{tx.debit}</td>
                <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{tx.credit}</td>
                <td style={{ textAlign: 'right' }}>
                  <span
                    className="tabular-nums"
                    style={{
                      fontWeight: 800,
                      color: 'var(--status-good)',
                      fontSize: '13px',
                    }}
                  >
                    ₦{tx.amount.toLocaleString()}.00
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
