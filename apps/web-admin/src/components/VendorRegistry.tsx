import * as React from 'react';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Coins,
  Search,
  ExternalLink,
  Award,
  Zap,
} from 'lucide-react';

export interface VendorAccreditation {
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
  aiCredits: number;
}

interface VendorRegistryProps {
  vendors: VendorAccreditation[];
  onGrantCredits: (vendorId: string, amount: number) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const VendorRegistry: React.FC<VendorRegistryProps> = ({
  vendors,
  onGrantCredits,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [tierFilter, setTierFilter] = React.useState<string>('all');

  const filtered = vendors.filter((v) => {
    if (tierFilter !== 'all' && v.tier !== tierFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        v.businessName.toLowerCase().includes(q) ||
        v.cacNumber.toLowerCase().includes(q) ||
        v.hubLocation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Title & Stats */}
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
              <Building2 size={17} />
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
              Merchant Accreditation & Statutory Registry
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
            CAC incorporation records, TIN compliance, NIBSS bank account audits, and SLA delivery tiers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="status-pill good">98% CAC Verified</span>
          <span className="status-pill neutral">{vendors.length} Active Sellers</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className="admin-card"
        style={{
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ position: 'relative' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            placeholder="Search merchants, CAC, hub..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '7px 12px 7px 30px',
              borderRadius: '8px',
              border: '1px solid var(--border-line)',
              backgroundColor: 'var(--bg-well)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              outline: 'none',
              width: '260px',
              fontFamily: 'inherit',
            }}
          />
        </div>

        <div className="segmented-control">
          {[
            { id: 'all', label: 'All Tiers' },
            { id: 'Tier 1 Premier', label: 'Tier 1 Premier' },
            { id: 'Tier 2 Verified', label: 'Tier 2 Verified' },
            { id: 'Tier 3 Probation', label: 'Tier 3 Probation' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTierFilter(t.id)}
              className={`segmented-pill ${tierFilter === t.id ? 'active' : ''}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Registry Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Merchant Entity & Hub</th>
              <th>Statutory Registrations</th>
              <th>NUBAN Bank Account</th>
              <th>Performance & On-Time Rate</th>
              <th>AI Studio Balance</th>
              <th style={{ textAlign: 'right' }}>Audit Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((vnd) => (
              <tr key={vnd.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      className="squircle"
                      style={{
                        width: '34px',
                        height: '34px',
                        backgroundColor: 'var(--bg-well)',
                        border: '1px solid var(--border-line)',
                        color: 'var(--accent-primary)',
                        fontSize: '12px',
                        fontWeight: 800,
                      }}
                    >
                      {vnd.businessName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{vnd.businessName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Hub: {vnd.hubLocation}</div>
                    </div>
                  </div>
                </td>

                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                    {vnd.cacNumber}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>TIN: {vnd.tinNumber}</div>
                </td>

                <td>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{vnd.bankAccount}</div>
                  <span className="status-pill good" style={{ fontSize: '9.5px', padding: '1px 6px', marginTop: '2px' }}>
                    NIBSS 100% Match
                  </span>
                </td>

                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      className={`status-pill ${
                        vnd.tier === 'Tier 1 Premier'
                          ? 'good'
                          : vnd.tier === 'Tier 2 Verified'
                          ? 'info'
                          : 'warn'
                      }`}
                      style={{ fontSize: '10.5px' }}
                    >
                      {vnd.tier}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    On-Time: <strong style={{ color: 'var(--status-good)' }}>{vnd.onTimeRate}</strong> &bull; Disputes: {vnd.disputeRate}
                  </div>
                </td>

                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="tabular-nums" style={{ fontWeight: 800, color: 'var(--accent-primary)', fontSize: '12.5px' }}>
                      {vnd.aiCredits} Credits
                    </span>
                    <button
                      type="button"
                      onClick={() => onGrantCredits(vnd.id, 10)}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-line)',
                        backgroundColor: 'var(--bg-well)',
                        color: 'var(--text-primary)',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <Zap size={11} color="var(--accent-gold)" />
                      <span>+10</span>
                    </button>
                  </div>
                </td>

                <td style={{ textAlign: 'right' }}>
                  {vnd.kycStatus === 'verified' ? (
                    <span className="status-pill good">
                      <CheckCircle2 size={12} />
                      <span>Accredited</span>
                    </span>
                  ) : (
                    <span className="status-pill warn">
                      <AlertCircle size={12} />
                      <span>Review Required</span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
