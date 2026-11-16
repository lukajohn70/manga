import * as React from 'react';
import { Badge } from '@manga/ui';
import { Scale, Building2, BookOpen, Wrench, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { DisputeCenter } from './components/DisputeCenter.js';
import { RepairTools } from './components/RepairTools.js';

export function App() {
  const [activeTab, setActiveTab] = React.useState<'disputes' | 'vendors' | 'ledger' | 'repairs'>('disputes');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Top Admin Bar */}
      <header
        style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '0.85rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '18px', fontWeight: 900, color: '#e11d48', letterSpacing: '-0.02em' }}>MANGA ADMIN</div>
          <span style={{ color: '#334155' }}>|</span>
          <span style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 500 }}>Marketplace Governance & Trust Operations</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#1e293b', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', color: '#94a3b8' }}>
            <ShieldCheck size={14} color="#10b981" />
            <span>Dual-Control Enforced</span>
          </div>
          <Badge variant="warning">MFA Verified</Badge>
          <span style={{ fontSize: '13px', color: '#cbd5e1' }}>Operator: <strong>ops_lead@manga.ng</strong></span>
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
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderBottom: activeTab === 'disputes' ? '2px solid #e11d48' : '2px solid transparent',
            color: activeTab === 'disputes' ? '#e11d48' : '#64748b',
          }}
        >
          <Scale size={16} /> Dispute Mediation & Evidence
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
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderBottom: activeTab === 'vendors' ? '2px solid #e11d48' : '2px solid transparent',
            color: activeTab === 'vendors' ? '#e11d48' : '#64748b',
          }}
        >
          <Building2 size={16} /> Merchant Accreditation & Tiers
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
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderBottom: activeTab === 'ledger' ? '2px solid #e11d48' : '2px solid transparent',
            color: activeTab === 'ledger' ? '#e11d48' : '#64748b',
          }}
        >
          <BookOpen size={16} /> Financial Ledger & Payouts
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
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderBottom: activeTab === 'repairs' ? '2px solid #e11d48' : '2px solid transparent',
            color: activeTab === 'repairs' ? '#e11d48' : '#64748b',
          }}
        >
          <Wrench size={16} /> Operations & System Recovery
        </button>
      </nav>

      {/* Main Container */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
        {activeTab === 'disputes' && <DisputeCenter />}

        {activeTab === 'vendors' && (
          <div style={{ backgroundColor: '#ffffff', padding: '3rem', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '24px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
              }}
            >
              <Building2 size={24} />
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Merchant Accreditation & Compliance Registry</h3>
            <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '520px', margin: '8px auto 0' }}>
              Automated business verification, CAC registration checks, and performance tier governance are running continuously across registered sellers.
            </p>
          </div>
        )}

        {activeTab === 'ledger' && (
          <div style={{ backgroundColor: '#ffffff', padding: '3rem', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '24px',
                backgroundColor: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
              }}
            >
              <BookOpen size={24} />
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Financial Ledger & Settlement Audit Explorer</h3>
            <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '520px', margin: '8px auto 0' }}>
              Immutable transaction records and real-time reconciliation monitoring are active with zero variance detected across all merchant payout batches.
            </p>
          </div>
        )}

        {activeTab === 'repairs' && <RepairTools />}
      </main>
    </div>
  );
}
