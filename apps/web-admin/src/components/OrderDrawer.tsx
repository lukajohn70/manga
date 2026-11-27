import * as React from 'react';
import {
  X,
  Truck,
  ShieldCheck,
  User,
  MapPin,
  Phone,
  Mail,
  Package,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  ChevronRight,
  Printer,
  RotateCw,
} from 'lucide-react';

export interface AdminOrder {
  id: string;
  orderRef: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  destinationState: string;
  vendorStore: string;
  totalNgn: number;
  itemSummary: string;
  paymentStatus: 'paid' | 'escrow_held' | 'refunded';
  trackingStatus: 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  courier: string;
}

interface OrderDrawerProps {
  order: AdminOrder | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: AdminOrder['trackingStatus']) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const OrderDrawer: React.FC<OrderDrawerProps> = ({
  order,
  onClose,
  onUpdateStatus,
  onShowToast,
}) => {
  if (!order) return null;

  const milestones = [
    { title: 'Order Confirmed', time: order.createdAt, done: true },
    {
      title: 'Merchant Packing & Escrow Hold',
      time: order.trackingStatus !== 'confirmed' ? 'Escrow Locked in Providus' : 'Pending',
      done: order.trackingStatus !== 'confirmed',
    },
    {
      title: 'Handover to Courier',
      time: ['shipped', 'delivered'].includes(order.trackingStatus) ? order.courier : 'Awaiting Pickup',
      done: ['shipped', 'delivered'].includes(order.trackingStatus),
    },
    {
      title: 'Doorstep Delivery & Signed Release',
      time: order.trackingStatus === 'delivered' ? 'Completed & Funds Released' : 'Pending Transit',
      done: order.trackingStatus === 'delivered',
    },
  ];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    onShowToast(`Copied ${label} to clipboard!`, 'info');
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="drawer-panel">
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-well)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              className="squircle"
              style={{
                width: '38px',
                height: '38px',
                backgroundColor: 'var(--accent-primary-glow)',
                color: 'var(--accent-primary)',
              }}
            >
              <Truck size={19} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="tabular-nums" style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {order.orderRef}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(order.orderRef, 'Order Reference')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="Copy reference"
                >
                  <Copy size={13} />
                </button>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Created {order.createdAt}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Status & Escrow Summary Box */}
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-line)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Order Value</span>
              <div
                className="tabular-nums"
                style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  fontFamily: 'Fraunces, Georgia, serif',
                  color: 'var(--text-primary)',
                  margin: '2px 0',
                }}
              >
                ₦{order.totalNgn.toLocaleString()}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span className={`status-pill ${order.paymentStatus === 'paid' ? 'good' : 'warn'}`}>
                  {order.paymentStatus === 'paid' ? 'Paid (In Escrow)' : 'Escrow Held'}
                </span>
                <span className={`status-pill ${order.trackingStatus === 'delivered' ? 'good' : 'info'}`}>
                  {order.trackingStatus.toUpperCase()}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Advance Milestone</span>
              <select
                value={order.trackingStatus}
                onChange={(e) => onUpdateStatus(order.id, e.target.value as any)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-line)',
                  backgroundColor: 'var(--bg-well)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing / Packing</option>
                <option value="shipped">In Transit (Shipped)</option>
                <option value="delivered">Delivered & Signed</option>
                <option value="cancelled">Cancelled / Refund</option>
              </select>
            </div>
          </div>

          {/* Delivery & Logistics Timeline */}
          <div>
            <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Fulfillment & Waybill Milestones
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
              {milestones.map((m, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: m.done ? 'var(--status-good-bg)' : 'var(--bg-well)',
                      color: m.done ? 'var(--status-good)' : 'var(--text-faint)',
                      border: `1px solid ${m.done ? 'var(--status-good-border)' : 'var(--border-line)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {m.done ? <CheckCircle2 size={13} /> : idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 600, color: m.done ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {m.title}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>{m.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer & Destination Card */}
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-line)',
            }}
          >
            <h4 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={15} color="var(--accent-primary)" />
              <span>Customer Information</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Name:</span>
                <strong style={{ color: 'var(--text-primary)' }}>{order.customerName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Email:</span>
                <span style={{ color: 'var(--text-secondary)' }}>{order.customerEmail}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Phone:</span>
                <span className="tabular-nums" style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{order.customerPhone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Destination:</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{order.destinationState}</span>
              </div>
            </div>
          </div>

          {/* Merchant & Item Summary */}
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-line)',
            }}
          >
            <h4 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Package size={15} color="var(--status-info)" />
              <span>Merchant & Cargo Manifest</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Fulfillment Store:</span>
                <strong style={{ color: 'var(--text-primary)' }}>{order.vendorStore}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Assigned Courier:</span>
                <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>{order.courier}</span>
              </div>
              <div style={{ marginTop: '6px', padding: '10px', borderRadius: '8px', backgroundColor: 'var(--bg-well)', border: '1px solid var(--border-line)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                  Item Description
                </span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {order.itemSummary}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Quick Action Buttons */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-line)',
            backgroundColor: 'var(--bg-well)',
            display: 'flex',
            justifyContent: 'space-between',
            gap: '10px',
          }}
        >
          <button
            type="button"
            onClick={() => onShowToast(`Waybill manifest for ${order.orderRef} sent to printer.`, 'success')}
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
            <Printer size={14} />
            <span>Print Waybill</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onUpdateStatus(order.id, 'delivered');
              onClose();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'var(--accent-primary)',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <CheckCircle2 size={14} />
            <span>Mark Delivered & Release Escrow</span>
          </button>
        </div>
      </div>
    </>
  );
};
