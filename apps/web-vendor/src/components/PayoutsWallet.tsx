import * as React from 'react';
import {
  Wallet,
  Download,
  CheckCircle2,
  TrendingUp,
  Building2,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

interface PayoutsWalletProps {
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const PayoutsWallet: React.FC<PayoutsWalletProps> = ({ onShowToast }) => {
  const transactions = [
    {
      ref: 'TX-9017-DISBURSE',
      order: 'MNG-2611-77Z1D',
      desc: 'iPad Air 11" Delivery Confirmed & Escrow Released',
      gross: 890000,
      fee: 133500,
      net: 756500,
      status: 'cleared',
      date: 'Yesterday 17:05',
    },
    {
      ref: 'TX-9014-NIBSS-PAYOUT',
      order: 'Batch PB-8821',
      desc: 'NIBSS Merchant Bank Transfer (Access Bank • 0129489412)',
      gross: 756500,
      fee: 0,
      net: 756500,
      status: 'cleared',
      date: 'Nov 25 11:00',
    },
    {
      ref: 'TX-9018-ESCROW-LOCK',
      order: 'MNG-2611-48K2F',
      desc: 'Sony WH-1000XM5 Headphone Order Held in Trust',
      gross: 450000,
      fee: 67500,
      net: 382500,
      status: 'pending_handover',
      date: 'Today 14:22',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Title */}
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
              <Wallet size={17} />
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
              Merchant Escrow Wallet & Settlement Ledger
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
            Providus Bank Escrow Vault protection, automated take-rate deduction (15%), and same-day NIBSS settlements.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onShowToast('Exported settlement journal to CSV.', 'info')}
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
          <span>Export Settlements (CSV)</span>
        </button>
      </div>

      {/* 3 Executive Financial Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        <div className="vendor-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Available for Disbursement
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
            ₦1,420,500.00
          </div>
          <div className="status-pill good" style={{ fontSize: '10.5px' }}>
            <CheckCircle2 size={12} /> Next NIBSS Batch: Today 18:00
          </div>
        </div>

        <div className="vendor-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            In Escrow (Transit Protected)
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
            ₦382,500.00
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
            Releases upon courier delivery signature
          </div>
        </div>

        <div className="vendor-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Designated NUBAN Payout Account
          </span>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 800,
              fontFamily: 'Fraunces, Georgia, serif',
              color: 'var(--text-primary)',
              margin: '6px 0',
            }}
          >
            Access Bank &bull; 0129489412
          </div>
          <div className="status-pill good" style={{ fontSize: '10.5px' }}>
            <ShieldCheck size={12} /> NIBSS 100% Name Match Verified
          </div>
        </div>
      </div>

      {/* Settlement Table */}
      <div className="vendor-table-container">
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
            Audited Escrow Settlements & Transfers
          </span>
          <span className="status-pill good" style={{ fontSize: '10.5px' }}>
            Providus Bank Synced
          </span>
        </div>

        <table className="vendor-table">
          <thead>
            <tr>
              <th>Transaction Ref & Date</th>
              <th>Order Ref</th>
              <th>Description</th>
              <th>Gross Value</th>
              <th>Platform Take-Rate (15%)</th>
              <th style={{ textAlign: 'right' }}>Net Payable (NGN)</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, idx) => (
              <tr key={idx}>
                <td>
                  <div className="tabular-nums" style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-primary)', fontSize: '12px' }}>
                    {tx.ref}
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{tx.date}</div>
                </td>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{tx.order}</td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{tx.desc}</td>
                <td className="tabular-nums" style={{ fontWeight: 600 }}>₦{tx.gross.toLocaleString()}</td>
                <td className="tabular-nums" style={{ color: 'var(--text-muted)' }}>-₦{tx.fee.toLocaleString()}</td>
                <td style={{ textAlign: 'right' }}>
                  <span className="tabular-nums" style={{ fontWeight: 800, color: tx.status === 'cleared' ? 'var(--status-good)' : 'var(--accent-primary)', fontSize: '13px' }}>
                    ₦{tx.net.toLocaleString()}.00
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
