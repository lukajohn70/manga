import * as React from 'react';
import { Ticket, Plus, Check, Copy, ToggleLeft, ToggleRight, Sparkles, TrendingUp } from 'lucide-react';

export interface PlatformCoupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpendNgn: number;
  redemptions: number;
  maxRedemptions: number;
  isActive: boolean;
  description: string;
}

interface CouponManagerProps {
  coupons: PlatformCoupon[];
  onCreateCoupon: (coupon: Omit<PlatformCoupon, 'id' | 'redemptions'>) => void;
  onToggleCoupon: (id: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const CouponManager: React.FC<CouponManagerProps> = ({
  coupons,
  onCreateCoupon,
  onToggleCoupon,
  onShowToast,
}) => {
  const [code, setCode] = React.useState('');
  const [type, setType] = React.useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = React.useState(15);
  const [minSpend, setMinSpend] = React.useState(30000);
  const [maxRedemptions, setMaxRedemptions] = React.useState(300);
  const [description, setDescription] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    onCreateCoupon({
      code: code.trim().toUpperCase(),
      discountType: type,
      discountValue: Number(value),
      minSpendNgn: Number(minSpend),
      maxRedemptions: Number(maxRedemptions),
      isActive: true,
      description:
        description.trim() ||
        `${value}${type === 'percentage' ? '%' : ' NGN'} platform promotional discount`,
    });

    setCode('');
    setDescription('');
    onShowToast(`Coupon ${code.toUpperCase()} published live to checkout!`, 'success');
  };

  const handleCopyCode = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    onShowToast(`Coupon code ${couponCode} copied!`, 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
            <Ticket size={17} />
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
            Promotional Coupons & Voucher Governance
          </h2>
        </div>
        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
          Create verified voucher campaigns, set threshold rules, and track real-time redemption volume.
        </p>
      </div>

      {/* 2-Column Bento: Left Create + Live Preview, Right Active Coupons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        
        {/* Creator Card */}
        <div className="admin-card" style={{ padding: '20px' }}>
          <h3
            style={{
              margin: '0 0 14px',
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={16} color="var(--accent-gold)" />
            <span>Issue New Platform Promo Voucher</span>
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                Promo Voucher Code
              </label>
              <input
                type="text"
                required
                placeholder="e.g. NOKSPECIAL2026"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-line)',
                  backgroundColor: 'var(--bg-well)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: 700,
                  outline: 'none',
                  textTransform: 'uppercase',
                  fontFamily: 'monospace',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Discount Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-line)',
                    backgroundColor: 'var(--bg-well)',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    outline: 'none',
                  }}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed NGN (₦)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Discount Value {type === 'percentage' ? '(%)' : '(₦)'}
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-line)',
                    backgroundColor: 'var(--bg-well)',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Minimum Order (₦)
                </label>
                <input
                  type="number"
                  value={minSpend}
                  onChange={(e) => setMinSpend(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-line)',
                    backgroundColor: 'var(--bg-well)',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Max Redemptions
                </label>
                <input
                  type="number"
                  value={maxRedemptions}
                  onChange={(e) => setMaxRedemptions(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-line)',
                    backgroundColor: 'var(--bg-well)',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                Description & Campaign Notes
              </label>
              <input
                type="text"
                placeholder="e.g. 20% discount on tech items for launch campaign"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-line)',
                  backgroundColor: 'var(--bg-well)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: '6px',
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'var(--accent-primary)',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Plus size={15} />
              <span>Publish Coupon to Checkout API</span>
            </button>
          </form>
        </div>

        {/* Active Coupons List */}
        <div className="admin-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              paddingBottom: '10px',
              borderBottom: '1px solid var(--border-line)',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Active Promo Vouchers ({coupons.length})
            </h3>
            <span className="status-pill good" style={{ fontSize: '10.5px' }}>
              Live on Storefront
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
            {coupons.map((c) => {
              const usagePercent = Math.min(100, Math.round((c.redemptions / c.maxRedemptions) * 100));
              return (
                <div
                  key={c.id}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    backgroundColor: c.isActive ? 'var(--bg-well)' : 'var(--bg-card)',
                    border: `1px solid ${c.isActive ? 'var(--border-line-strong)' : 'var(--border-line-subtle)'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        className="tabular-nums"
                        style={{
                          fontSize: '14px',
                          fontWeight: 800,
                          fontFamily: 'monospace',
                          color: c.isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                        }}
                      >
                        {c.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(c.code)}
                        title="Copy code"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: '2px',
                        }}
                      >
                        <Copy size={12} />
                      </button>
                      <span
                        className={`status-pill ${c.discountType === 'percentage' ? 'good' : 'info'}`}
                        style={{ fontSize: '10px', padding: '1px 6px' }}
                      >
                        {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₦${c.discountValue.toLocaleString()} OFF`}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleCoupon(c.id)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-line)',
                        backgroundColor: c.isActive ? 'var(--status-good-bg)' : 'var(--bg-well)',
                        color: c.isActive ? 'var(--status-good)' : 'var(--text-muted)',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </div>

                  <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                    {c.description} &bull; Min spend: ₦{c.minSpendNgn.toLocaleString()}
                  </p>

                  {/* Progress Meter Bar (Kovra Style) */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      <span>Redemptions</span>
                      <span className="tabular-nums">
                        {c.redemptions} / {c.maxRedemptions} ({usagePercent}%)
                      </span>
                    </div>
                    <div
                      style={{
                        height: '6px',
                        width: '100%',
                        borderRadius: '999px',
                        backgroundColor: 'var(--border-line)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${usagePercent}%`,
                          borderRadius: '999px',
                          backgroundColor: usagePercent > 80 ? 'var(--status-warn)' : 'var(--accent-primary)',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
