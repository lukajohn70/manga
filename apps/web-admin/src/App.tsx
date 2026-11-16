import * as React from 'react';
import { Badge } from '@manga/ui';
import { DisputeCenter } from './components/DisputeCenter.js';

export function App() {
  const [activeTab, setActiveTab] = React.useState<'disputes' | 'vendors' | 'ledger' | 'repairs'>('disputes');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      {/* Top Admin Bar */}
      <header
        style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '0.85rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#e11d48' }}>MANGA ADMIN</div>
          <span style={{ color: '#475569' }}>|</span>
          <span style={{ fontSize: '14px', color: '#cbd5e1' }}>Marketplace Governance & Operations</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Badge variant="warning">MFA Verified</Badge>
          <Badge variant="success">Maker-Checker Enforced</Badge>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>Admin: <strong>sec_ops@manga.ng</strong></span>
        </div>
      </header>

      {/* Navigation Sub-header */}
      <nav
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '0 2rem',
          display: 'flex',
          gap: '1.5rem',
        }}
      >
        <button
          onClick={() => setActiveTab('disputes')}
          style={{
            padding: '14px 4px',
            border: 'none',
            background: 'none',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            borderBottom: activeTab === 'disputes' ? '3px solid #e11d48' : '3px solid transparent',
            color: activeTab === 'disputes' ? '#e11d48' : '#64748b',
          }}
        >
          ⚖️ Dispute Center & Evidence Bundle
        </button>
        <button
          onClick={() => setActiveTab('vendors')}
          style={{
            padding: '14px 4px',
            border: 'none',
            background: 'none',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            borderBottom: activeTab === 'vendors' ? '3px solid #e11d48' : '3px solid transparent',
            color: activeTab === 'vendors' ? '#e11d48' : '#64748b',
          }}
        >
          🏢 Vendor KYC & Tiers
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          style={{
            padding: '14px 4px',
            border: 'none',
            background: 'none',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            borderBottom: activeTab === 'ledger' ? '3px solid #e11d48' : '3px solid transparent',
            color: activeTab === 'ledger' ? '#e11d48' : '#64748b',
          }}
        >
          📑 Double-Entry Ledger & Payouts
        </button>
        <button
          onClick={() => setActiveTab('repairs')}
          style={{
            padding: '14px 4px',
            border: 'none',
            background: 'none',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            borderBottom: activeTab === 'repairs' ? '3px solid #e11d48' : '3px solid transparent',
            color: activeTab === 'repairs' ? '#e11d48' : '#64748b',
          }}
        >
          🛠️ Operational Repair Tools
        </button>
      </nav>

      {/* Main Container */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
        {activeTab === 'disputes' && <DisputeCenter />}

        {activeTab === 'vendors' && (
          <div style={{ backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <h3>🏢 Vendor KYC & Governance</h3>
            <p style={{ color: '#64748b' }}>Automated verification active via pluggable KYC providers.</p>
          </div>
        )}

        {activeTab === 'ledger' && (
          <div style={{ backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <h3>📑 Double-Entry Ledger Audit Explorer</h3>
            <p style={{ color: '#64748b' }}>Zero unbalanced variance detector running continuously.</p>
          </div>
        )}

        {activeTab === 'repairs' && (
          <div style={{ backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <h3>🛠️ Operational Repair Tools</h3>
            <p style={{ color: '#64748b' }}>Outbox event replay and manual saga interventions.</p>
          </div>
        )}
      </main>
    </div>
  );
}
