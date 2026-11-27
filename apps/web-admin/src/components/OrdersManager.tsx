import * as React from 'react';
import {
  Truck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  LayoutGrid,
  List,
  Download,
  Send,
  MoreVertical,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Package,
  MapPin,
} from 'lucide-react';
import { AdminOrder, OrderDrawer } from './OrderDrawer.js';

interface OrdersManagerProps {
  orders: AdminOrder[];
  onUpdateStatus: (orderId: string, status: AdminOrder['trackingStatus']) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const OrdersManager: React.FC<OrdersManagerProps> = ({
  orders,
  onUpdateStatus,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<string>('all');
  const [viewMode, setViewMode] = React.useState<'table' | 'grid'>('table');
  const [selectedOrder, setSelectedOrder] = React.useState<AdminOrder | null>(null);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (filterStatus !== 'all' && o.trackingStatus !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        o.orderRef.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.destinationState.toLowerCase().includes(q) ||
        o.vendorStore.toLowerCase().includes(q) ||
        o.itemSummary.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredOrders.map((o) => o.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBatchDispatch = () => {
    selectedIds.forEach((id) => onUpdateStatus(id, 'shipped'));
    onShowToast(`Batch dispatched ${selectedIds.length} orders to courier transit!`, 'success');
    setSelectedIds([]);
  };

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Order Ref,Customer,Destination,Merchant,Amount,Payment,Milestone']
        .concat(
          filteredOrders.map(
            (o) =>
              `"${o.orderRef}","${o.customerName}","${o.destinationState}","${o.vendorStore}",${o.totalNgn},"${o.paymentStatus}","${o.trackingStatus}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `manga_courier_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast(`Exported ${filteredOrders.length} orders to CSV.`, 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Title & Toolbar */}
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
              <Truck size={17} />
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
              Courier Dispatch & Order Fulfillment Center
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
            Real-time waybill transitions, delivery SLA tracking, and escrow payout triggers.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={handleExportCsv}
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
            <span>Export Manifest (CSV)</span>
          </button>
        </div>
      </div>

      {/* Filter and View Bar (Solvik / Kovra Style) */}
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
        {/* Left: Search + Status Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Search Input */}
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
              placeholder="Filter by ref, customer, item..."
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
                width: '240px',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Status Filter Chips */}
          <div className="segmented-control">
            {[
              { id: 'all', label: `All (${orders.length})` },
              { id: 'confirmed', label: 'Confirmed' },
              { id: 'processing', label: 'Processing' },
              { id: 'shipped', label: 'In Transit' },
              { id: 'delivered', label: 'Delivered' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setFilterStatus(st.id)}
                className={`segmented-pill ${filterStatus === st.id ? 'active' : ''}`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: View Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            title="Table View"
            style={{
              padding: '6px',
              borderRadius: '6px',
              border: '1px solid var(--border-line)',
              backgroundColor: viewMode === 'table' ? 'var(--bg-card-hover)' : 'transparent',
              color: viewMode === 'table' ? 'var(--text-primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <List size={16} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            title="Bento Grid View"
            style={{
              padding: '6px',
              borderRadius: '6px',
              border: '1px solid var(--border-line)',
              backgroundColor: viewMode === 'grid' ? 'var(--bg-card-hover)' : 'transparent',
              color: viewMode === 'grid' ? 'var(--text-primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'table' ? (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '40px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={handleSelectAll}
                    style={{ cursor: 'pointer' }}
                  />
                </th>
                <th>Order Ref & Date</th>
                <th>Customer & Route</th>
                <th>Merchant & Carrier</th>
                <th>Cargo / Value</th>
                <th>Payment</th>
                <th>Milestone Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const isSelected = selectedIds.includes(ord.id);
                  return (
                    <tr
                      key={ord.id}
                      style={{
                        backgroundColor: isSelected ? 'var(--accent-primary-glow)' : undefined,
                      }}
                    >
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(ord.id)}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>

                      <td>
                        <div
                          className="tabular-nums"
                          style={{
                            fontWeight: 700,
                            fontFamily: 'monospace',
                            color: 'var(--accent-primary)',
                            fontSize: '12.5px',
                          }}
                        >
                          {ord.orderRef}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{ord.createdAt}</div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{ord.customerName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <MapPin size={11} color="var(--accent-primary)" />
                          <span>{ord.destinationState}</span>
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{ord.vendorStore}</div>
                        <div style={{ fontSize: '11px', color: 'var(--status-info)', fontWeight: 600 }}>
                          {ord.courier}
                        </div>
                      </td>

                      <td>
                        <div className="tabular-nums" style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                          ₦{ord.totalNgn.toLocaleString()}
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: 'var(--text-muted)',
                            maxWidth: '180px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {ord.itemSummary}
                        </div>
                      </td>

                      <td>
                        <span className={`status-pill ${ord.paymentStatus === 'paid' ? 'good' : 'warn'}`}>
                          {ord.paymentStatus === 'paid' ? 'Paid (Escrow)' : 'Held'}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`status-pill ${
                            ord.trackingStatus === 'delivered'
                              ? 'good'
                              : ord.trackingStatus === 'shipped'
                              ? 'info'
                              : ord.trackingStatus === 'processing'
                              ? 'warn'
                              : 'neutral'
                          }`}
                        >
                          {ord.trackingStatus}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(ord)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-line)',
                            backgroundColor: 'var(--bg-well)',
                            color: 'var(--text-primary)',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Inspect →
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Bento Cards View */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="admin-card admin-card-interactive"
              style={{
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="tabular-nums" style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent-primary)' }}>
                      {ord.orderRef}
                    </span>
                    <h3 style={{ margin: '4px 0 0', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {ord.customerName}
                    </h3>
                  </div>
                  <span className={`status-pill ${ord.trackingStatus === 'delivered' ? 'good' : 'info'}`}>
                    {ord.trackingStatus}
                  </span>
                </div>

                <div style={{ margin: '12px 0', padding: '10px', borderRadius: '8px', backgroundColor: 'var(--bg-well)', fontSize: '11.5px' }}>
                  <div style={{ color: 'var(--text-muted)' }}>Item Summary:</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{ord.itemSummary}</div>
                  <div style={{ marginTop: '4px', color: 'var(--text-muted)' }}>
                    Merchant: <strong>{ord.vendorStore}</strong>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '10px',
                  borderTop: '1px solid var(--border-line-subtle)',
                }}
              >
                <div>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Total Amount</span>
                  <div className="tabular-nums" style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    ₦{ord.totalNgn.toLocaleString()}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedOrder(ord)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-line)',
                    backgroundColor: 'var(--bg-well)',
                    color: 'var(--accent-primary)',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Inspect Order →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Bulk Action Bar (Kovra Style .selbar) */}
      {selectedIds.length > 0 && (
        <div className="bulk-action-bar">
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {selectedIds.length} orders selected
          </span>
          <button
            type="button"
            onClick={handleBatchDispatch}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'var(--accent-primary)',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Send size={13} />
            <span>Batch Dispatch</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedIds([])}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '11.5px',
              cursor: 'pointer',
            }}
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Slide-over Inspection Drawer */}
      <OrderDrawer
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={onUpdateStatus}
        onShowToast={onShowToast}
      />
    </div>
  );
};
