import * as React from 'react';
import {
  DollarSign,
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  Clock,
  ArrowUpRight,
  Plus,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { VendorOrderItem } from './OrdersQueueView.js';

interface StoreOverviewProps {
  storeName: string;
  totalSalesNgn: number;
  orders: VendorOrderItem[];
  productsCount: number;
  onNavigateTab: (tab: any) => void;
  onAddNewProduct: () => void;
}

export const StoreOverview: React.FC<StoreOverviewProps> = ({
  storeName,
  totalSalesNgn,
  orders,
  productsCount,
  onNavigateTab,
  onAddNewProduct,
}) => {
  const [timeRange, setTimeRange] = React.useState<'7D' | '30D' | '90D'>('7D');
  const [hoveredPoint, setHoveredPoint] = React.useState<{ x: number; y: number; label: string; value: number } | null>(null);

  // Simulated chart data points based on time range
  const chartData = React.useMemo(() => {
    if (timeRange === '7D') {
      return [
        { label: 'Mon', value: 180000 },
        { label: 'Tue', value: 320000 },
        { label: 'Wed', value: 240000 },
        { label: 'Thu', value: 490000 },
        { label: 'Fri', value: 380000 },
        { label: 'Sat', value: 650000 },
        { label: 'Sun', value: totalSalesNgn },
      ];
    } else if (timeRange === '30D') {
      return [
        { label: 'W1', value: 1200000 },
        { label: 'W2', value: 1850000 },
        { label: 'W3', value: 1640000 },
        { label: 'W4', value: 2450000 },
      ];
    } else {
      return [
        { label: 'Oct', value: 5400000 },
        { label: 'Nov', value: 6800000 },
        { label: 'Dec', value: 8900000 },
      ];
    }
  }, [timeRange, totalSalesNgn]);

  const maxVal = Math.max(...chartData.map((d) => d.value), 1);
  const minVal = 0;
  const chartWidth = 640;
  const chartHeight = 180;
  const paddingX = 30;
  const paddingY = 24;

  const points = chartData.map((d, index) => {
    const x = paddingX + (index / (chartData.length - 1)) * (chartWidth - paddingX * 2);
    const normalizedY = (d.value - minVal) / (maxVal - minVal || 1);
    const y = chartHeight - paddingY - normalizedY * (chartHeight - paddingY * 2);
    return { x, y, ...d };
  });

  // Generate cubic bezier curve
  const pathData = React.useMemo(() => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx1 = p0.x + (p1.x - p0.x) * 0.45;
      const cy1 = p0.y;
      const cx2 = p0.x + (p1.x - p0.x) * 0.55;
      const cy2 = p1.y;
      d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p1.x} ${p1.y}`;
    }
    return d;
  }, [points]);

  const areaPath = React.useMemo(() => {
    if (points.length === 0) return '';
    const last = points[points.length - 1];
    const first = points[0];
    return `${pathData} L ${last.x} ${chartHeight - paddingY} L ${first.x} ${chartHeight - paddingY} Z`;
  }, [pathData, points, chartHeight, paddingY]);

  const pendingAcceptanceCount = orders.filter((o) => o.status === 'pending_vendor_accept').length;
  const inProcessingCount = orders.filter((o) => o.status === 'accepted' || o.status === 'packing').length;
  const readyToShipCount = orders.filter((o) => o.status === 'ready_to_ship').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome Banner & Quick Action */}
      <div
        className="vendor-card"
        style={{
          padding: '24px 28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-card-hover) 100%)',
          border: '1px solid var(--border-line-strong)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            className="squircle"
            style={{
              width: '52px',
              height: '52px',
              backgroundColor: 'var(--accent-primary-glow)',
              color: 'var(--accent-primary)',
              border: '1px solid var(--border-accent)',
              fontSize: '22px',
              fontWeight: 800,
            }}
          >
            A
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2
                style={{
                  fontFamily: 'Fraunces, Georgia, serif',
                  fontSize: '22px',
                  fontWeight: 800,
                  margin: 0,
                  color: 'var(--text-primary)',
                }}
              >
                {storeName}
              </h2>
              <span className="status-pill good" style={{ fontSize: '10px', padding: '2px 8px' }}>
                <ShieldCheck size={12} /> CAC Verified Merchant
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Manga Storefront &bull; Kaduna Hub &bull; Public Link:{' '}
              <a
                href="#preview"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Opening customer storefront: manga.ng/stores/apex-tech');
                }}
                style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}
              >
                manga.ng/stores/apex-tech <ExternalLink size={11} style={{ display: 'inline', verticalAlign: 'middle' }} />
              </a>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => onNavigateTab('orders')}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Clock size={14} />
            <span>Fulfill Orders ({pendingAcceptanceCount + inProcessingCount})</span>
          </button>
          <button
            onClick={onAddNewProduct}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={15} />
            <span>+ Add New Product</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px' }}>
        {/* Card 1: Gross Sales */}
        <div className="vendor-hero-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Store Gross Sales
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
              color: '#ffffff',
              lineHeight: 1.1,
            }}
          >
            ₦{totalSalesNgn.toLocaleString()}
          </div>
          <div style={{ marginTop: '16px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>Providus Escrow Locked</span>
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
              <TrendingUp size={11} /> +14.2%
            </span>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="vendor-card vendor-card-interactive" onClick={() => onNavigateTab('orders')} style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Active Customer Orders
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
              <ShoppingBag size={18} />
            </div>
          </div>
          <div
            className="tabular-nums"
            style={{
              fontSize: '28px',
              fontWeight: 800,
              fontFamily: 'Fraunces, Georgia, serif',
              color: 'var(--text-primary)',
            }}
          >
            {orders.length}
          </div>
          <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', color: 'var(--text-muted)' }}>
            <span>{pendingAcceptanceCount} awaiting acceptance</span>
            <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Manage &rarr;</span>
          </div>
        </div>

        {/* Card 3: Active Products */}
        <div className="vendor-card vendor-card-interactive" onClick={() => onNavigateTab('products')} style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Listed Products
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
              <Package size={18} />
            </div>
          </div>
          <div
            className="tabular-nums"
            style={{
              fontSize: '28px',
              fontWeight: 800,
              fontFamily: 'Fraunces, Georgia, serif',
              color: 'var(--text-primary)',
            }}
          >
            {productsCount}
          </div>
          <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', color: 'var(--text-muted)' }}>
            <span>All live on Manga Store</span>
            <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>View Catalog &rarr;</span>
          </div>
        </div>

        {/* Card 4: Store Traffic & Conversion */}
        <div className="vendor-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Store Impressions & Traffic
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
              <Users size={18} />
            </div>
          </div>
          <div
            className="tabular-nums"
            style={{
              fontSize: '28px',
              fontWeight: 800,
              fontFamily: 'Fraunces, Georgia, serif',
              color: 'var(--text-primary)',
            }}
          >
            1,428
          </div>
          <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', color: 'var(--text-muted)' }}>
            <span>Conversion rate: <strong style={{ color: 'var(--status-good)' }}>3.8%</strong></span>
            <span style={{ color: 'var(--status-good)', fontWeight: 700 }}>+8.4% this week</span>
          </div>
        </div>
      </div>

      {/* Sales Velocity Spline Chart (Solvik Style) */}
      <div className="vendor-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3
              style={{
                fontFamily: 'Fraunces, Georgia, serif',
                fontSize: '18px',
                fontWeight: 800,
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              Store Sales Velocity
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
              Gross revenue generated across all verified customer checkouts
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="tab-pill-group">
              {(['7D', '30D', '90D'] as const).map((r) => (
                <button
                  key={r}
                  className={`tab-pill ${timeRange === r ? 'active' : ''}`}
                  onClick={() => setTimeRange(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SVG Spline Chart */}
        <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            style={{ width: '100%', height: '200px', overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="vendorSplineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Subtle horizontal grid lines */}
            {[0.25, 0.5, 0.75, 1].map((pct) => {
              const y = chartHeight - paddingY - pct * (chartHeight - paddingY * 2);
              return (
                <line
                  key={pct}
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke="var(--border-line-subtle)"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Gradient Area */}
            <path d={areaPath} fill="url(#vendorSplineGrad)" />

            {/* Spline Stroke */}
            <path
              d={pathData}
              fill="none"
              stroke="var(--accent-primary)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Points */}
            {points.map((pt, i) => (
              <g
                key={i}
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredPoint?.label === pt.label ? 6 : 4}
                  fill="var(--bg-card)"
                  stroke="var(--accent-primary)"
                  strokeWidth="2.5"
                  style={{ transition: 'r 0.15s ease' }}
                />
                <text
                  x={pt.x}
                  y={chartHeight - 6}
                  textAnchor="middle"
                  fill="var(--text-muted)"
                  fontSize="11"
                  fontFamily="Urbanist, sans-serif"
                >
                  {pt.label}
                </text>
              </g>
            ))}
          </svg>

          {/* Interactive Hover Tooltip */}
          {hoveredPoint && (
            <div
              style={{
                position: 'absolute',
                top: `${hoveredPoint.y - 44}px`,
                left: `${(hoveredPoint.x / chartWidth) * 100}%`,
                transform: 'translateX(-50%)',
                backgroundColor: 'var(--bg-popover)',
                border: '1px solid var(--border-line-strong)',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '11.5px',
                boxShadow: 'var(--shadow-md)',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
                zIndex: 10,
              }}
            >
              <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{hoveredPoint.label}</div>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                ₦{hoveredPoint.value.toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bento Grid: Recent Orders & Top Selling Products */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Recent Orders Box */}
        <div className="vendor-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3
              style={{
                fontFamily: 'Fraunces, Georgia, serif',
                fontSize: '17px',
                fontWeight: 800,
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              Recent Customer Orders
            </h3>
            <button
              onClick={() => onNavigateTab('orders')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-primary)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>View All</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {orders.slice(0, 4).map((order) => (
              <div
                key={order.id}
                onClick={() => onNavigateTab('orders')}
                style={{
                  padding: '12px 14px',
                  backgroundColor: 'var(--bg-well)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-line)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-well)')}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {order.orderNumber}
                    </span>
                    <span
                      className={`status-pill ${
                        order.status === 'pending_vendor_accept'
                          ? 'warn'
                          : order.status === 'ready_to_ship'
                          ? 'good'
                          : 'info'
                      }`}
                      style={{ fontSize: '10px', padding: '1px 6px' }}
                    >
                      {order.status === 'pending_vendor_accept'
                        ? 'New Order'
                        : order.status === 'ready_to_ship'
                        ? 'Ready to Dispatch'
                        : 'Processing'}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {order.recipientAddress.recipientName} &bull; {order.recipientAddress.city}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div className="tabular-nums" style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    ₦{order.priceNgn.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Qty: {order.qty}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Products Box */}
        <div className="vendor-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3
              style={{
                fontFamily: 'Fraunces, Georgia, serif',
                fontSize: '17px',
                fontWeight: 800,
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              Top Performing Products
            </h3>
            <button
              onClick={() => onNavigateTab('products')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-primary)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>Manage Catalog</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              {
                title: 'Apple iPad Air 11-inch M2 Wi-Fi 128GB',
                sku: 'APPL-IPAD-M2-128',
                salesCount: 8,
                revenueNgn: 7120000,
                stock: 2,
              },
              {
                title: 'Sony WH-1000XM5 ANC Wireless Headphones',
                sku: 'SONY-WH1000-BLK',
                salesCount: 12,
                revenueNgn: 5400000,
                stock: 14,
              },
              {
                title: 'Dell UltraSharp 27" 4K USB-C Hub Monitor',
                sku: 'DELL-U2723QE',
                salesCount: 6,
                revenueNgn: 1920000,
                stock: 6,
              },
              {
                title: 'Anker 737 Power Bank (PowerCore 24K 140W)',
                sku: 'ANKR-737-24K',
                salesCount: 11,
                revenueNgn: 1595000,
                stock: 19,
              },
            ].map((p, idx) => (
              <div
                key={p.sku}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  backgroundColor: 'var(--bg-well)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-line-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-line)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 800,
                      color: idx === 0 ? 'var(--accent-gold)' : 'var(--text-muted)',
                    }}
                  >
                    #{idx + 1}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '12.5px',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        maxWidth: '220px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {p.title}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {p.salesCount} sold &bull; {p.stock} in stock
                    </div>
                  </div>
                </div>

                <div className="tabular-nums" style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  ₦{p.revenueNgn.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
