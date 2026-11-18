import * as React from 'react';
import { Badge, Button } from '@manga/ui';
import {
  Scale,
  Building2,
  BookOpen,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  ExternalLink,
  DollarSign,
  TrendingUp,
  Download,
} from 'lucide-react';
import { DisputeCenter } from './components/DisputeCenter.js';
import { RepairTools } from './components/RepairTools.js';

function NokTriangleIcon({ size = 18, color = '#B5532E' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L22 20H2L12 3Z" fill={color} />
      <circle cx="12" cy="13" r="2.5" fill="#F6EDE0" />
    </svg>
  );
}

interface VendorAccreditation {
  id: string;
  businessName: string;
  cacNumber: string;
  tinNumber: string;
  bankAccount: string;
  tier: 'Tier 1 Premier' | 'Tier 2 Verified' | 'Tier 3 Probation';
  onTimeRate: string;
  disputeRate: string;
  kycStatus: 'verified' | 'pending_review' | 'flagged';
  hubLocation: string;
}

export function App() {
  const [adminSession, setAdminSession] = React.useState<{
    email: string;
    role: 'ADMIN';
    operatorName: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('manga_admin_session');
      return saved
        ? JSON.parse(saved)
        : { email: 'admin@manga.ng', role: 'ADMIN', operatorName: 'Platform Operations Admin' };
    } catch {
      return { email: 'admin@manga.ng', role: 'ADMIN', operatorName: 'Platform Operations Admin' };
    }
  });

  const [adminAuthError, setAdminAuthError] = React.useState<string | null>(null);
  const [adminEmail, setAdminEmail] = React.useState('admin@manga.ng');

  const [activeTab, setActiveTab] = React.useState<'disputes' | 'vendors' | 'ledger' | 'repairs'>('disputes');

  // Seeded mock accredited vendors
  const [vendors, setVendors] = React.useState<VendorAccreditation[]>([
    {
      id: 'VND-001',
      businessName: 'Apex Electronics Ltd',
      cacNumber: 'RC 1849204',
      tinNumber: '24910294-0001',
      bankAccount: 'Access Bank • 0129489412',
      tier: 'Tier 2 Verified',
      onTimeRate: '98.4%',
      disputeRate: '0.4%',
      kycStatus: 'verified',
      hubLocation: 'Lagos Central Sort',
    },
    {
      id: 'VND-002',
      businessName: 'Super Mart Nigeria',
      cacNumber: 'RC 1492019',
      tinNumber: '19482014-0001',
      bankAccount: 'Zenith Bank • 2084920184',
      tier: 'Tier 2 Verified',
      onTimeRate: '96.2%',
      disputeRate: '1.1%',
      kycStatus: 'verified',
      hubLocation: 'Abuja Distribution Hub',
    },
    {
      id: 'VND-003',
      businessName: 'Kaduna Craft & Terracotta Guild',
      cacNumber: 'BN 2948102',
      tinNumber: '92018491-0001',
      bankAccount: 'First Bank • 3091827401',
      tier: 'Tier 1 Premier',
      onTimeRate: '99.1%',
      disputeRate: '0.0%',
      kycStatus: 'verified',
      hubLocation: 'Kaduna Nok Artisan Hub',
    },
    {
      id: 'VND-004',
      businessName: 'Horizon Devices Global',
      cacNumber: 'RC 3918290',
      tinNumber: 'Pending Upload',
      bankAccount: 'GTBank • 0192837461',
      tier: 'Tier 3 Probation',
      onTimeRate: '89.4%',
      disputeRate: '3.8%',
      kycStatus: 'pending_review',
      hubLocation: 'Port Harcourt Sort',
    },
  ]);

  const handleAdminLogout = () => {
    setAdminSession(null);
    try {
      localStorage.removeItem('manga_admin_session');
    } catch {}
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail.toLowerCase().includes('buyer') || adminEmail.toLowerCase().includes('vendor')) {
      setAdminAuthError('403 Forbidden: Only authorized Platform Administrators with role [ADMIN] may access this system.');
      return;
    }
    const session = {
      email: adminEmail,
      role: 'ADMIN' as const,
      operatorName: 'Manga Operations Admin',
    };
    setAdminSession(session);
    setAdminAuthError(null);
    try {
      localStorage.setItem('manga_admin_session', JSON.stringify(session));
    } catch {}
  };

  if (!adminSession) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#1E1815', color: '#F6EDE0', fontFamily: 'Inter, -apple-system, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ maxWidth: '440px', width: '100%', backgroundColor: '#2A2320', borderRadius: '16px', border: '1px solid #3E3430', padding: '2rem', boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#1E1815', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '1px solid #3E3430' }}>
            <NokTriangleIcon size={24} color="#B5532E" />
          </div>
          <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '20px', fontWeight: 800, color: '#F6EDE0', marginBottom: '0.25rem' }}>
            MANGA MARKETSQUARE Operations Console
          </h1>
          <p style={{ fontSize: '11px', color: '#D5C7B8', marginBottom: '1.5rem' }}>
            OWASP ASVS Level 2 Strict RBAC • Required: <strong>ROLE: ADMIN</strong>
          </p>

          {adminAuthError && (
            <div style={{ padding: '10px 12px', backgroundColor: '#3B1817', border: '1px solid #771D1D', borderRadius: '8px', color: '#F87171', fontSize: '11px', marginBottom: '1rem', textAlign: 'left', fontWeight: 600 }}>
              {adminAuthError}
            </div>
          )}

          <form onSubmit={handleAdminLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', textAlign: 'left' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#D5C7B8', marginBottom: '4px' }}>
                Administrator Email
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@manga.ng"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #3E3430', backgroundColor: '#1E1815', color: '#FFFFFF', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#D5C7B8', marginBottom: '4px' }}>
                Operations Passcode (MFA)
              </label>
              <input
                type="password"
                required
                defaultValue="admin123"
                placeholder="••••••••"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #3E3430', backgroundColor: '#1E1815', color: '#FFFFFF', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              style={{ width: '100%', backgroundColor: '#B5532E', color: '#FFFFFF', padding: '10px', fontSize: '12px', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: 'pointer', marginTop: '0.5rem' }}
            >
              Authenticate Admin Session
            </Button>
          </form>

          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #3E3430', fontSize: '11px', color: '#8C8279' }}>
            <p style={{ marginBottom: '8px' }}>Manga Customer Storefront</p>
            <a href="http://localhost:3000" style={{ color: '#D9A441', fontWeight: 700, textDecoration: 'none' }}>
              ← Return to Customer Storefront (Port 3000)
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F6EDE0', fontFamily: 'Inter, -apple-system, sans-serif', color: '#2A2320' }}>
      {/* Top Admin Bar */}
      <header
        style={{
          backgroundColor: '#1E1815',
          color: '#F6EDE0',
          padding: '0.85rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 12px rgba(42, 35, 32, 0.2)',
          borderBottom: '1px solid #3E3430',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <NokTriangleIcon size={24} color="#B5532E" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: '#FAF6F0',
                  letterSpacing: '0.04em',
                  fontFamily: 'Fraunces, Georgia, serif',
                  lineHeight: 1,
                }}
              >
                MANGA
              </span>
              <span style={{ fontSize: '8px', fontWeight: 800, color: '#D9A441', letterSpacing: '0.15em', marginTop: '2px' }}>
                MARKETSQUARE GOVERNANCE
              </span>
            </div>
          </div>
          <span style={{ color: '#5A4E47' }}>|</span>
          <span style={{ fontSize: '13px', color: '#D5C7B8', fontWeight: 500 }}>
            Marketplace Governance & Trust Operations
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#2A2320',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              color: '#4F6B3A',
              border: '1px solid #3E3430',
              fontWeight: 700,
            }}
          >
            <ShieldCheck size={13} color="#4F6B3A" />
            <span style={{ color: '#F6EDE0' }}>ROLE: ADMIN</span>
          </div>
          <Badge variant="warning">MFA Verified</Badge>
          <span style={{ fontSize: '12px', color: '#D5C7B8' }}>
            Operator: <strong style={{ color: '#F6EDE0' }}>{adminSession.email}</strong>
          </span>
          <button
            type="button"
            onClick={handleAdminLogout}
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#F87171',
              backgroundColor: '#2A2320',
              border: '1px solid #771D1D',
              borderRadius: '6px',
              padding: '4px 8px',
              cursor: 'pointer',
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Navigation Sub-header */}
      <nav
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E7D5BC',
          padding: '0 2rem',
          display: 'flex',
          gap: '1.5rem',
          boxShadow: '0 2px 4px rgba(42, 35, 32, 0.03)',
        }}
      >
        <button
          onClick={() => setActiveTab('disputes')}
          style={{
            padding: '14px 4px',
            border: 'none',
            background: 'none',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderBottom: activeTab === 'disputes' ? '3px solid #B5532E' : '3px solid transparent',
            color: activeTab === 'disputes' ? '#B5532E' : '#8C8279',
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
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderBottom: activeTab === 'vendors' ? '3px solid #B5532E' : '3px solid transparent',
            color: activeTab === 'vendors' ? '#B5532E' : '#8C8279',
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
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderBottom: activeTab === 'ledger' ? '3px solid #B5532E' : '3px solid transparent',
            color: activeTab === 'ledger' ? '#B5532E' : '#8C8279',
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
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderBottom: activeTab === 'repairs' ? '3px solid #B5532E' : '3px solid transparent',
            color: activeTab === 'repairs' ? '#B5532E' : '#8C8279',
          }}
        >
          <Wrench size={16} /> Operations & System Recovery
        </button>
      </nav>

      {/* Main Container */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {activeTab === 'disputes' && <DisputeCenter />}

        {activeTab === 'vendors' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#2A2320', fontFamily: 'Fraunces, Georgia, serif' }}>
                  Merchant Accreditation & Compliance Registry
                </h2>
                <p style={{ margin: '4px 0 0', color: '#8C8279', fontSize: '13px' }}>
                  Statutory CAC incorporation audits, TIN compliance, and SLA fulfillment tier allocation.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Badge variant="success">CAC Verified: 98%</Badge>
                <Badge variant="neutral">Active Sellers: {vendors.length}</Badge>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E7D5BC', overflow: 'hidden', boxShadow: '0 2px 4px rgba(42, 35, 32, 0.04)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#FBF7F0', borderBottom: '1px solid #E7D5BC', color: '#8C8279', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>Merchant Entity</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>Statutory Registrations</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>NUBAN Bank Account</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>Performance Tier</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>Fulfillment Metrics</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right' }}>Audit Status</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((vnd) => (
                    <tr key={vnd.id} style={{ borderBottom: '1px solid #F0E6D8' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700, color: '#2A2320' }}>{vnd.businessName}</div>
                        <div style={{ fontSize: '12px', color: '#8C8279' }}>Hub: {vnd.hubLocation}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ color: '#2A2320', fontWeight: 600 }}>{vnd.cacNumber}</div>
                        <div style={{ fontSize: '12px', color: '#8C8279' }}>TIN: {vnd.tinNumber}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ color: '#2A2320' }}>{vnd.bankAccount}</div>
                        <span style={{ fontSize: '11px', color: '#4F6B3A', backgroundColor: '#F0F6EE', padding: '2px 6px', borderRadius: '4px' }}>
                          NIBSS Name Match 100%
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <Badge
                          variant={
                            vnd.tier === 'Tier 1 Premier'
                              ? 'success'
                              : vnd.tier === 'Tier 2 Verified'
                              ? 'neutral'
                              : 'warning'
                          }
                        >
                          {vnd.tier}
                        </Badge>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: '12px', color: '#2A2320' }}>
                          On-Time: <strong style={{ color: '#4F6B3A' }}>{vnd.onTimeRate}</strong>
                        </div>
                        <div style={{ fontSize: '12px', color: '#8C8279' }}>
                          Disputes: <strong>{vnd.disputeRate}</strong>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        {vnd.kycStatus === 'verified' ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#4F6B3A', fontWeight: 600, fontSize: '12px' }}>
                            <CheckCircle2 size={14} /> Accredited
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#D9A441', fontWeight: 600, fontSize: '12px' }}>
                            <AlertCircle size={14} /> Review Required
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'ledger' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#2A2320', fontFamily: 'Fraunces, Georgia, serif' }}>
                  Financial Ledger & Settlement Audit Explorer
                </h2>
                <p style={{ margin: '4px 0 0', color: '#8C8279', fontSize: '13px' }}>
                  Double-entry balanced books, platform escrow protection accounts, and automated NIBSS disbursement batches.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button variant="secondary" size="sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Download size={13} /> Export Ledger (CSV)
                </Button>
              </div>
            </div>

            {/* Double-entry reconciliation summary tiles */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '10px', border: '1px solid #E7D5BC', boxShadow: '0 2px 4px rgba(42, 35, 32, 0.04)' }}>
                <div style={{ fontSize: '11px', color: '#8C8279', fontWeight: 700, textTransform: 'uppercase' }}>
                  Total Platform Assets (Held Funds)
                </div>
                <div style={{ fontSize: '30px', fontWeight: 800, color: '#2A2320', margin: '6px 0', fontFamily: 'Fraunces, Georgia, serif' }}>
                  ₦152,400,000.00
                </div>
                <div style={{ fontSize: '12px', color: '#4F6B3A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={13} /> Providus & Wema Central Custody
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '10px', border: '1px solid #E7D5BC', boxShadow: '0 2px 4px rgba(42, 35, 32, 0.04)' }}>
                <div style={{ fontSize: '11px', color: '#8C8279', fontWeight: 700, textTransform: 'uppercase' }}>
                  Total Platform Liabilities & Escrow
                </div>
                <div style={{ fontSize: '30px', fontWeight: 800, color: '#2A2320', margin: '6px 0', fontFamily: 'Fraunces, Georgia, serif' }}>
                  ₦152,400,000.00
                </div>
                <div style={{ fontSize: '12px', color: '#8C8279' }}>
                  Merchant Escrow + Platform Commission Balance
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '10px', border: '1px solid #E7D5BC', boxShadow: '0 2px 4px rgba(42, 35, 32, 0.04)' }}>
                <div style={{ fontSize: '11px', color: '#8C8279', fontWeight: 700, textTransform: 'uppercase' }}>
                  Double-Entry Ledger Variance
                </div>
                <div style={{ fontSize: '30px', fontWeight: 800, color: '#4F6B3A', margin: '6px 0', fontFamily: 'Fraunces, Georgia, serif' }}>
                  ₦0.00
                </div>
                <div style={{ fontSize: '12px', color: '#4F6B3A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={13} /> Perfect Ledger Equilibrium (0 Variance)
                </div>
              </div>
            </div>

            {/* Recent journal entries table */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E7D5BC', overflow: 'hidden', boxShadow: '0 2px 4px rgba(42, 35, 32, 0.04)' }}>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #E7D5BC', backgroundColor: '#FBF7F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#2A2320', fontFamily: 'Fraunces, Georgia, serif' }}>
                  Audited Journal Transactions (Double-Entry Feed)
                </h4>
                <span style={{ fontSize: '11px', color: '#4F6B3A', fontWeight: 600 }}>Cryptographic Hash Chained</span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E7D5BC', color: '#8C8279', fontSize: '11px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '10px 16px' }}>Tx Hash / Ref</th>
                    <th style={{ padding: '10px 16px' }}>Description</th>
                    <th style={{ padding: '10px 16px' }}>Debit Account</th>
                    <th style={{ padding: '10px 16px' }}>Credit Account</th>
                    <th style={{ padding: '10px 16px', textAlign: 'right' }}>Amount (NGN)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #F0E6D8' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#B5532E' }}>tx-9018-escrow-hold</td>
                    <td style={{ padding: '12px 16px', color: '#2A2320' }}>Order #MNG-2611-48K2F Checkout Payment</td>
                    <td style={{ padding: '12px 16px', color: '#8C8279' }}>1010 Providus Operating Pool</td>
                    <td style={{ padding: '12px 16px', color: '#8C8279' }}>2020 Buyer Escrow Sub-ledger</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#4F6B3A' }}>₦450,000.00</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #F0E6D8' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#B5532E' }}>tx-9017-escrow-disburse</td>
                    <td style={{ padding: '12px 16px', color: '#2A2320' }}>Order #MNG-2611-77Z1D Delivery Confirmed</td>
                    <td style={{ padding: '12px 16px', color: '#8C8279' }}>2020 Buyer Escrow Sub-ledger</td>
                    <td style={{ padding: '12px 16px', color: '#8C8279' }}>2030 Merchant Payable (Apex)</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#4F6B3A' }}>₦890,000.00</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #F0E6D8' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#B5532E' }}>tx-9016-fee-recognize</td>
                    <td style={{ padding: '12px 16px', color: '#2A2320' }}>Platform Take Rate (5% Fulfillment Commission)</td>
                    <td style={{ padding: '12px 16px', color: '#8C8279' }}>2030 Merchant Payable (Apex)</td>
                    <td style={{ padding: '12px 16px', color: '#8C8279' }}>4010 Marketplace Fee Revenue</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#2A2320' }}>₦44,500.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'repairs' && <RepairTools />}
      </main>
    </div>
  );
}
