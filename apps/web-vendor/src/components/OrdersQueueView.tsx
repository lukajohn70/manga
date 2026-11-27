import * as React from 'react';
import {
  Clock,
  Camera,
  Truck,
  Package,
  Search,
  List,
  LayoutGrid,
  Check,
  CheckCircle2,
  Printer,
  MapPin,
  Tag,
} from 'lucide-react';
import { SlaTimerBadge } from './SlaTimerBadge.js';

export interface VendorOrderItem {
  id: string;
  orderNumber: string;
  shipmentGroupId: string;
  status: 'pending_vendor_accept' | 'accepted' | 'packing' | 'ready_to_ship' | 'in_transit' | 'delivered';
  itemTitle: string;
  sku: string;
  qty: number;
  priceNgn: number;
  acceptDeadline: string;
  shipDeadline: string;
  recipientAddress: {
    recipientName: string;
    phone: string;
    streetAddress: string;
    city: string;
    stateOrProvince: string;
  };
  trackingNumber?: string;
  weightG?: number;
}

interface OrdersQueueViewProps {
  orders: VendorOrderItem[];
  activeFilter: 'needs_action' | 'pack_scan' | 'ready_to_ship' | 'all';
  onFilterChange: (filter: 'needs_action' | 'pack_scan' | 'ready_to_ship' | 'all') => void;
  onAcceptOrder: (orderId: string) => void;
  onOpenScanner: (order: VendorOrderItem) => void;
  onOpenLabel: (order: VendorOrderItem) => void;
}

export const OrdersQueueView: React.FC<OrdersQueueViewProps> = ({
  orders,
  activeFilter,
  onFilterChange,
  onAcceptOrder,
  onOpenScanner,
  onOpenLabel,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'table' | 'grid'>('table');

  const filteredOrders = orders.filter((o) => {
    if (activeFilter === 'needs_action' && o.status !== 'pending_vendor_accept') return false;
    if (activeFilter === 'pack_scan' && !(o.status === 'accepted' || o.status === 'packing')) return false;
    if (activeFilter === 'ready_to_ship' && o.status !== 'ready_to_ship') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.itemTitle.toLowerCase().includes(q) ||
        o.sku.toLowerCase().includes(q) ||
        o.recipientAddress.recipientName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Filter and View Mode Toolbar */}
      <div
        className="vendor-card"
        style={{
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
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
              placeholder="Search order ref, SKU, customer..."
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

          {/* Segmented Filter Pills with Counts */}
          <div className="segmented-control">
            {[
              { id: 'needs_action' as const, label: `Needs Action (${orders.filter((o) => o.status === 'pending_vendor_accept').length})` },
              { id: 'pack_scan' as const, label: `Pack & Scan (${orders.filter((o) => o.status === 'accepted' || o.status === 'packing').length})` },
              { id: 'ready_to_ship' as const, label: `Ready to Ship (${orders.filter((o) => o.status === 'ready_to_ship').length})` },
              { id: 'all' as const, label: `All Orders (${orders.length})` },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => onFilterChange(st.id)}
                className={`segmented-pill ${activeFilter === st.id ? 'active' : ''}`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode Toggle */}
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
        <div className="vendor-table-container">
          <table className="vendor-table">
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Item & SKU</th>
                <th>Recipient & City</th>
                <th>Escrow Amount</th>
                <th>SLA Deadline</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Fulfillment Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id}>
                    <td>
                      <span className="tabular-nums" style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent-primary)', fontSize: '12.5px' }}>
                        {ord.orderNumber}
                      </span>
                      {ord.trackingNumber && (
                        <div style={{ fontSize: '10.5px', color: 'var(--status-info)', fontFamily: 'monospace' }}>
                          {ord.trackingNumber}
                        </div>
                      )}
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{ord.itemTitle}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        SKU: <code style={{ fontFamily: 'monospace', color: 'var(--accent-gold)' }}>{ord.sku}</code> &bull; Qty: {ord.qty}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{ord.recipientAddress.recipientName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <MapPin size={11} color="var(--accent-primary)" />
                        <span>{ord.recipientAddress.city}, {ord.recipientAddress.stateOrProvince}</span>
                      </div>
                    </td>

                    <td>
                      <div className="tabular-nums" style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '14px' }}>
                        ₦{ord.priceNgn.toLocaleString()}
                      </div>
                      <span className="status-pill good" style={{ fontSize: '9.5px', padding: '1px 5px' }}>
                        Providus Escrow
                      </span>
                    </td>

                    <td>
                      {ord.status === 'pending_vendor_accept' && (
                        <SlaTimerBadge label="Accept" deadlineIso={ord.acceptDeadline} />
                      )}
                      {(ord.status === 'accepted' || ord.status === 'packing') && (
                        <SlaTimerBadge label="Ship" deadlineIso={ord.shipDeadline} />
                      )}
                      {ord.status === 'ready_to_ship' && (
                        <span className="status-pill good">
                          <CheckCircle2 size={12} /> Staged for Courier
                        </span>
                      )}
                    </td>

                    <td>
                      <span
                        className={`status-pill ${
                          ord.status === 'ready_to_ship'
                            ? 'good'
                            : ord.status === 'accepted' || ord.status === 'packing'
                            ? 'info'
                            : 'warn'
                        }`}
                      >
                        {ord.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      {ord.status === 'pending_vendor_accept' && (
                        <button
                          type="button"
                          onClick={() => onAcceptOrder(ord.id)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: 'var(--accent-primary)',
                            color: '#ffffff',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Check size={13} /> Accept Order
                        </button>
                      )}

                      {(ord.status === 'accepted' || ord.status === 'packing') && (
                        <button
                          type="button"
                          onClick={() => onOpenScanner(ord)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: 'var(--status-info)',
                            color: '#ffffff',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Camera size={13} /> Scan & Pack
                        </button>
                      )}

                      {ord.status === 'ready_to_ship' && (
                        <button
                          type="button"
                          onClick={() => onOpenLabel(ord)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-line)',
                            backgroundColor: 'var(--bg-well)',
                            color: 'var(--text-primary)',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Printer size={13} /> Print Label
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Bento Grid View */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="vendor-card vendor-card-interactive"
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
                      {ord.orderNumber}
                    </span>
                    <h3 style={{ margin: '4px 0 0', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {ord.itemTitle}
                    </h3>
                  </div>
                  <span className={`status-pill ${ord.status === 'ready_to_ship' ? 'good' : 'warn'}`}>
                    {ord.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div style={{ margin: '12px 0', padding: '10px', borderRadius: '8px', backgroundColor: 'var(--bg-well)', fontSize: '11.5px' }}>
                  <div style={{ color: 'var(--text-muted)' }}>Customer Destination:</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {ord.recipientAddress.recipientName} &bull; {ord.recipientAddress.city}, {ord.recipientAddress.stateOrProvince}
                  </div>
                  <div style={{ marginTop: '4px', color: 'var(--text-muted)' }}>
                    SKU: <strong>{ord.sku}</strong> &bull; Qty: <strong>{ord.qty}</strong>
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
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Escrow Total</span>
                  <div className="tabular-nums" style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    ₦{ord.priceNgn.toLocaleString()}
                  </div>
                </div>

                {ord.status === 'pending_vendor_accept' && (
                  <button
                    type="button"
                    onClick={() => onAcceptOrder(ord.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: 'var(--accent-primary)',
                      color: '#ffffff',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Accept →
                  </button>
                )}

                {(ord.status === 'accepted' || ord.status === 'packing') && (
                  <button
                    type="button"
                    onClick={() => onOpenScanner(ord)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: 'var(--status-info)',
                      color: '#ffffff',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Scan & Pack →
                  </button>
                )}

                {ord.status === 'ready_to_ship' && (
                  <button
                    type="button"
                    onClick={() => onOpenLabel(ord)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-line)',
                      backgroundColor: 'var(--bg-well)',
                      color: 'var(--text-primary)',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Print Label ↗
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
