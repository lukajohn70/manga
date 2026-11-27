import * as React from 'react';
import { TrendingUp, Calendar, Layers } from 'lucide-react';

type TimeRange = '7D' | '30D' | '90D' | '12M';

interface SplineAreaChartProps {
  title?: string;
  subtitle?: string;
}

export const SplineAreaChart: React.FC<SplineAreaChartProps> = ({
  title = 'Platform GMV & Commission Settlement Velocity',
  subtitle = 'Verified escrow settlements processed across Providus & Paystack payment gateways',
}) => {
  const [range, setRange] = React.useState<TimeRange>('30D');
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);

  // Mock datasets for different ranges
  const datasets: Record<TimeRange, Array<{ label: string; gmv: number; commission: number }>> = {
    '7D': [
      { label: 'Mon', gmv: 2400000, commission: 360000 },
      { label: 'Tue', gmv: 2100000, commission: 315000 },
      { label: 'Wed', gmv: 2950000, commission: 442500 },
      { label: 'Thu', gmv: 3400000, commission: 510000 },
      { label: 'Fri', gmv: 4100000, commission: 615000 },
      { label: 'Sat', gmv: 4900000, commission: 735000 },
      { label: 'Sun', gmv: 3600000, commission: 540000 },
    ],
    '30D': [
      { label: 'Nov 01', gmv: 1850000, commission: 277500 },
      { label: 'Nov 05', gmv: 2400000, commission: 360000 },
      { label: 'Nov 10', gmv: 3100000, commission: 465000 },
      { label: 'Nov 15', gmv: 2800000, commission: 420000 },
      { label: 'Nov 20', gmv: 4500000, commission: 675000 },
      { label: 'Nov 24', gmv: 5200000, commission: 780000 },
      { label: 'Nov 27', gmv: 6100000, commission: 915000 },
    ],
    '90D': [
      { label: 'Sep W1', gmv: 9200000, commission: 1380000 },
      { label: 'Sep W3', gmv: 11500000, commission: 1725000 },
      { label: 'Oct W1', gmv: 13800000, commission: 2070000 },
      { label: 'Oct W3', gmv: 15400000, commission: 2310000 },
      { label: 'Nov W1', gmv: 17200000, commission: 2580000 },
      { label: 'Nov W3', gmv: 21500000, commission: 3225000 },
    ],
    '12M': [
      { label: 'Jan', gmv: 42000000, commission: 6300000 },
      { label: 'Mar', gmv: 58000000, commission: 8700000 },
      { label: 'May', gmv: 71000000, commission: 10650000 },
      { label: 'Jul', gmv: 89000000, commission: 13350000 },
      { label: 'Sep', gmv: 104000000, commission: 15600000 },
      { label: 'Nov', gmv: 132000000, commission: 19800000 },
    ],
  };

  const data = datasets[range];
  const maxGmv = Math.max(...data.map((d) => d.gmv)) * 1.15;

  // Chart Dimensions
  const svgWidth = 640;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 25;
  const chartW = svgWidth - paddingX * 2;
  const chartH = svgHeight - paddingY * 2;

  // Compute Coordinates
  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartW;
    const y = svgHeight - paddingY - (d.gmv / maxGmv) * chartH;
    return { x, y, ...d };
  });

  // Build Catmull-Rom or cubic Bezier spline
  const createSplinePath = (pts: Array<{ x: number; y: number }>) => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return d;
  };

  const lineD = createSplinePath(points);
  const areaD = `${lineD} L ${points[points.length - 1].x},${svgHeight - paddingY} L ${points[0].x},${svgHeight - paddingY} Z`;

  const totalGmv = data.reduce((acc, curr) => acc + curr.gmv, 0);
  const totalCommission = data.reduce((acc, curr) => acc + curr.commission, 0);

  return (
    <div className="admin-card" style={{ padding: '20px' }}>
      {/* Chart Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                fontFamily: 'Fraunces, Georgia, serif',
              }}
            >
              {title}
            </span>
            <span className="status-pill good" style={{ fontSize: '10px', padding: '1px 6px' }}>
              +18.4%
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{subtitle}</p>
        </div>

        {/* Time range switcher */}
        <div className="segmented-control">
          {(['7D', '30D', '90D', '12M'] as TimeRange[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setRange(r);
                setHoverIndex(null);
              }}
              className={`segmented-pill ${range === r ? 'active' : ''}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Highlighters */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '14px' }}>
        <div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Period Volume</span>
          <div className="tabular-nums" style={{ fontSize: '19px', fontWeight: 800, color: 'var(--text-primary)' }}>
            ₦{totalGmv.toLocaleString()}
          </div>
        </div>
        <div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Platform Take-Rate (15%)</span>
          <div className="tabular-nums" style={{ fontSize: '19px', fontWeight: 800, color: 'var(--accent-primary)' }}>
            ₦{totalCommission.toLocaleString()}
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: '100%', height: 'auto', display: 'block' }}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="splineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-primary, #b5532e)" stopOpacity="0.32" />
              <stop offset="60%" stopColor="var(--accent-primary, #b5532e)" stopOpacity="0.08" />
              <stop offset="100%" stopColor="var(--accent-primary, #b5532e)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Dotted horizontal grid lines */}
          {[0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = svgHeight - paddingY - pct * chartH;
            return (
              <line
                key={i}
                x1={paddingX}
                y1={y}
                x2={svgWidth - paddingX}
                y2={y}
                stroke="var(--border-line-subtle)"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            );
          })}

          {/* Gradient Area Fill */}
          <path d={areaD} fill="url(#splineGradient)" />

          {/* Main Spline Line */}
          <path
            d={lineD}
            fill="none"
            stroke="var(--accent-primary, #b5532e)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Interactive Hover Vertical Bar & Dot */}
          {points.map((pt, idx) => {
            const isHovered = hoverIndex === idx;
            return (
              <g
                key={idx}
                onMouseEnter={() => setHoverIndex(idx)}
                style={{ cursor: 'pointer' }}
              >
                {/* Transparent catch target */}
                <rect
                  x={pt.x - chartW / (points.length * 2)}
                  y={paddingY}
                  width={chartW / points.length}
                  height={chartH}
                  fill="transparent"
                />

                {isHovered && (
                  <line
                    x1={pt.x}
                    y1={paddingY}
                    x2={pt.x}
                    y2={svgHeight - paddingY}
                    stroke="var(--border-line-strong)"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                )}

                {/* Point circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 3.5}
                  fill={isHovered ? 'var(--accent-primary)' : 'var(--bg-card)'}
                  stroke="var(--accent-primary)"
                  strokeWidth="2.5"
                  style={{ transition: 'r 0.15s ease' }}
                />
              </g>
            );
          })}

          {/* X Axis labels */}
          {points.map((pt, idx) => (
            <text
              key={idx}
              x={pt.x}
              y={svgHeight - 6}
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill={hoverIndex === idx ? 'var(--text-primary)' : 'var(--text-muted)'}
              fontFamily="inherit"
            >
              {pt.label}
            </text>
          ))}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoverIndex !== null && points[hoverIndex] && (
          <div
            style={{
              position: 'absolute',
              top: `${(points[hoverIndex].y / svgHeight) * 100}%`,
              left: `${(points[hoverIndex].x / svgWidth) * 100}%`,
              transform: 'translate(-50%, -120%)',
              backgroundColor: 'var(--bg-popover)',
              border: '1px solid var(--border-line-strong)',
              borderRadius: '8px',
              padding: '6px 10px',
              boxShadow: 'var(--shadow-md)',
              pointerEvents: 'none',
              zIndex: 10,
              fontSize: '11px',
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              {points[hoverIndex].label}
            </div>
            <div style={{ color: 'var(--text-muted)', display: 'flex', gap: '8px' }}>
              <span>GMV: <strong style={{ color: 'var(--accent-primary)' }}>₦{points[hoverIndex].gmv.toLocaleString()}</strong></span>
              <span>Take: <strong style={{ color: 'var(--status-good)' }}>₦{points[hoverIndex].commission.toLocaleString()}</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
