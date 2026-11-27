import * as React from 'react';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string;
  subtitle: string;
  trendText?: string;
  trendType?: 'good' | 'warn' | 'bad' | 'neutral';
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  isHero?: boolean;
  sparklineData?: number[];
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  trendText,
  trendType = 'good',
  icon: Icon,
  iconBg = 'var(--bg-well)',
  iconColor = 'var(--accent-primary)',
  isHero = false,
  sparklineData,
  onClick,
}) => {
  // Render clean SVG sparkline
  const renderSparkline = () => {
    if (!sparklineData || sparklineData.length < 2) return null;

    const width = 84;
    const height = 32;
    const min = Math.min(...sparklineData);
    const max = Math.max(...sparklineData);
    const range = max - min || 1;

    const points = sparklineData.map((d, i) => {
      const x = (i / (sparklineData.length - 1)) * (width - 4) + 2;
      const y = height - 4 - ((d - min) / range) * (height - 8);
      return `${x},${y}`;
    });

    const pathD = `M ${points.join(' L ')}`;
    const areaD = `M ${points[0]} L ${points.join(' L ')} L ${width - 2},${height} L 2,${height} Z`;

    const strokeColor = isHero
      ? '#ffffff'
      : trendType === 'good'
      ? 'var(--status-good)'
      : trendType === 'warn'
      ? 'var(--status-warn)'
      : 'var(--accent-primary)';

    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={`grad-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={isHero ? 0.35 : 0.22} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#grad-${title.replace(/\s+/g, '')})`} />
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  if (isHero) {
    return (
      <div
        className="admin-hero-card"
        onClick={onClick}
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          cursor: onClick ? 'pointer' : 'default',
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'rgba(255, 255, 255, 0.85)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {title}
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
              <Icon size={18} />
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
            {value}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <div>
            {trendText && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  color: '#ffffff',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                <TrendingUp size={12} />
                <span>{trendText}</span>
              </div>
            )}
            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.8)', marginTop: '4px' }}>
              {subtitle}
            </div>
          </div>

          <div>{renderSparkline()}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="admin-card admin-card-interactive"
      onClick={onClick}
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {title}
          </span>
          <div
            className="squircle"
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: iconBg,
              color: iconColor,
            }}
          >
            <Icon size={18} />
          </div>
        </div>

        <div
          className="tabular-nums"
          style={{
            fontSize: '25px',
            fontWeight: 800,
            fontFamily: 'Fraunces, Georgia, serif',
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
          }}
        >
          {value}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginTop: '14px',
          paddingTop: '10px',
          borderTop: '1px solid var(--border-line-subtle)',
        }}
      >
        <div>
          {trendText && (
            <div
              className={`status-pill ${trendType}`}
              style={{
                fontSize: '11px',
                padding: '2px 8px',
                marginBottom: '4px',
              }}
            >
              {trendType === 'bad' ? <TrendingDown size={11} /> : <TrendingUp size={11} />}
              <span>{trendText}</span>
            </div>
          )}
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{subtitle}</div>
        </div>

        <div>{renderSparkline()}</div>
      </div>
    </div>
  );
};
