import * as React from 'react';
import { DollarSign, Clock, Truck, CheckCircle2, TrendingUp } from 'lucide-react';

interface VendorKpiCardsProps {
  needsActionCount: number;
  packScanCount: number;
  readyToShipCount: number;
  todaySalesNgn: number;
}

export const VendorKpiCards: React.FC<VendorKpiCardsProps> = ({
  needsActionCount,
  packScanCount,
  readyToShipCount,
  todaySalesNgn,
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
      
      {/* 1. Hero Revenue Card */}
      <div
        className="vendor-hero-card"
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Today's Escrow Sales
            </span>
            <div
              className="squircle"
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
              }}
            >
              <DollarSign size={18} />
            </div>
          </div>

          <div
            className="tabular-nums"
            style={{
              fontSize: '28px',
              fontWeight: 800,
              fontFamily: 'Fraunces, Georgia, serif',
              letterSpacing: '-0.02em',
              color: '#ffffff',
              lineHeight: 1.1,
            }}
          >
            ₦{todaySalesNgn.toLocaleString()}
          </div>
        </div>

        <div style={{ marginTop: '16px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>Held safely in Providus Escrow</span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              padding: '2px 7px',
              borderRadius: '999px',
              backgroundColor: 'rgba(255,255,255,0.25)',
              fontSize: '10.5px',
              fontWeight: 700,
            }}
          >
            <TrendingUp size={11} /> +12.5%
          </span>
        </div>
      </div>

      {/* 2. Needs Action KPI */}
      <div
        className="vendor-card vendor-card-interactive"
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Pending Acceptance
            </span>
            <div
              className="squircle"
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: 'var(--status-warn-bg)',
                color: 'var(--status-warn)',
              }}
            >
              <Clock size={18} />
            </div>
          </div>

          <div
            className="tabular-nums"
            style={{
              fontSize: '28px',
              fontWeight: 800,
              fontFamily: 'Fraunces, Georgia, serif',
              color: needsActionCount > 0 ? 'var(--status-warn)' : 'var(--text-primary)',
            }}
          >
            {needsActionCount}
          </div>
        </div>

        <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-line-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Orders awaiting vendor acceptance</span>
          <span className="status-pill warn" style={{ fontSize: '10px' }}>
            Action Required
          </span>
        </div>
      </div>

      {/* 3. Staged for Carrier Pickup */}
      <div
        className="vendor-card vendor-card-interactive"
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Staged for Pickup
            </span>
            <div
              className="squircle"
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: 'var(--status-info-bg)',
                color: 'var(--status-info)',
              }}
            >
              <Truck size={18} />
            </div>
          </div>

          <div
            className="tabular-nums"
            style={{
              fontSize: '28px',
              fontWeight: 800,
              fontFamily: 'Fraunces, Georgia, serif',
              color: 'var(--status-info)',
            }}
          >
            {readyToShipCount}
          </div>
        </div>

        <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-line-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Labeled parcels at dispatch desk</span>
          <span className="status-pill info" style={{ fontSize: '10px' }}>
            Carrier Ready
          </span>
        </div>
      </div>

      {/* 4. On-Time Dispatch SLA */}
      <div
        className="vendor-card vendor-card-interactive"
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              On-Time Dispatch Rate
            </span>
            <div
              className="squircle"
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: 'var(--status-good-bg)',
                color: 'var(--status-good)',
              }}
            >
              <CheckCircle2 size={18} />
            </div>
          </div>

          <div
            className="tabular-nums"
            style={{
              fontSize: '28px',
              fontWeight: 800,
              fontFamily: 'Fraunces, Georgia, serif',
              color: 'var(--status-good)',
            }}
          >
            98.4%
          </div>
        </div>

        <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-line-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Tier 2 SLA benchmark exceeded</span>
          <span className="status-pill good" style={{ fontSize: '10px' }}>
            Tier 1 Eligible
          </span>
        </div>
      </div>

    </div>
  );
};
