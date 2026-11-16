import * as React from 'react';
import { Button, Badge } from '@manga/ui';
import { Camera, Printer, Building2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SlaTimerBadge } from './components/SlaTimerBadge.js';
import { BarcodeScannerModal } from './components/BarcodeScannerModal.js';
import { ShippingLabelModal } from './components/ShippingLabelModal.js';

interface VendorOrderItem {
  id: string;
  orderNumber: string;
  shipmentGroupId: string;
  status: 'pending_vendor_accept' | 'accepted' | 'packing' | 'ready_to_ship' | 'in_transit' | 'delivered';
  itemTitle: string;
  sku: string;
  qty: number;
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

export function App() {
  const [activeTab, setActiveTab] = React.useState<'needs_action' | 'pack_scan' | 'ready_to_ship' | 'all'>('needs_action');

  // Seeded mock orders representing live vendor queue
  const [orders, setOrders] = React.useState<VendorOrderItem[]>([
    {
      id: 'sg-1',
      orderNumber: 'MNG-2611-48K2F',
      shipmentGroupId: 'sg-1',
      status: 'pending_vendor_accept',
      itemTitle: 'Sony WH-1000XM5 Noise Cancelling Headphones',
      sku: 'SONY-WH1000-BLK',
      qty: 1,
      acceptDeadline: new Date(Date.now() + 14 * 3600 * 1000).toISOString(),
      shipDeadline: new Date(Date.now() + 38 * 3600 * 1000).toISOString(),
      recipientAddress: {
        recipientName: 'Chidi Okonkwo',
        phone: '+234 803 123 4567',
        streetAddress: '24 Admiralty Way, Lekki Phase 1',
        city: 'Lagos',
        stateOrProvince: 'Lagos State',
      },
    },
    {
      id: 'sg-2',
      orderNumber: 'MNG-2611-19B8C',
      shipmentGroupId: 'sg-2',
      status: 'accepted',
      itemTitle: 'Logitech MX Master 3S Wireless Mouse',
      sku: 'LOGI-MX3S-GRY',
      qty: 2,
      acceptDeadline: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      shipDeadline: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
      recipientAddress: {
        recipientName: 'Amina Bello',
        phone: '+234 809 988 7766',
        streetAddress: '15 Gana Street, Maitama',
        city: 'Abuja',
        stateOrProvince: 'FCT',
      },
    },
    {
      id: 'sg-3',
      orderNumber: 'MNG-2611-77Z1D',
      shipmentGroupId: 'sg-3',
      status: 'ready_to_ship',
      itemTitle: 'Apple iPad Air 11-inch M2 128GB',
      sku: 'APPL-IPAD-M2-128',
      qty: 1,
      acceptDeadline: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      shipDeadline: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
      recipientAddress: {
        recipientName: 'Tunde Bakare',
        phone: '+234 802 233 4455',
        streetAddress: '8 Commercial Avenue, Yaba',
        city: 'Lagos',
        stateOrProvince: 'Lagos State',
      },
      trackingNumber: 'TRK-881294-MNG',
      weightG: 950,
    },
  ]);

  // Modal states
  const [scanningOrder, setScanningOrder] = React.useState<VendorOrderItem | null>(null);
  const [labelOrder, setLabelOrder] = React.useState<VendorOrderItem | null>(null);

  // Actions
  const handleAcceptOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'accepted' } : o))
    );
  };

  const handleScanComplete = (scannedSku: string, weightG: number) => {
    if (!scanningOrder) return;
    const trackingNumber = `TRK-${Date.now().toString().slice(-6)}-EXP`;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === scanningOrder.id
          ? {
              ...o,
              status: 'ready_to_ship',
              trackingNumber,
              weightG,
            }
          : o
      )
    );

    const updated = {
      ...scanningOrder,
      status: 'ready_to_ship' as const,
      trackingNumber,
      weightG,
    };
    setScanningOrder(null);
    setLabelOrder(updated); // immediately open print label dialog
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'needs_action') return o.status === 'pending_vendor_accept';
    if (activeTab === 'pack_scan') return o.status === 'accepted' || o.status === 'packing';
    if (activeTab === 'ready_to_ship') return o.status === 'ready_to_ship';
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Top Navbar */}
      <header
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '0.875rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '18px', fontWeight: 900, color: '#e11d48', letterSpacing: '-0.02em' }}>MANGA</div>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>Vendor Operations Portal</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#ecfdf5', color: '#065f46', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, border: '1px solid #a7f3d0' }}>
            <Building2 size={13} />
            Apex Electronics Ltd (Tier 2 Verified)
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Badge variant="success">Fulfillment SLA Active</Badge>
          <span style={{ fontSize: '13px', color: '#64748b' }}>Hub: Lagos Central</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
        {/* KPI Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>PENDING ACCEPTANCE</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#e11d48', marginTop: '4px', fontVariantNumeric: 'tabular-nums' }}>
              {orders.filter((o) => o.status === 'pending_vendor_accept').length}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Requires merchant acknowledgment</div>
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>READY FOR PACK & SCAN</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#d97706', marginTop: '4px', fontVariantNumeric: 'tabular-nums' }}>
              {orders.filter((o) => o.status === 'accepted').length}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Accepted orders awaiting item scan</div>
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>READY FOR CARRIER PICKUP</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#2563eb', marginTop: '4px', fontVariantNumeric: 'tabular-nums' }}>
              {orders.filter((o) => o.status === 'ready_to_ship').length}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Labeled parcels staged for handover</div>
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>ON-TIME DISPATCH RATE</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#059669', marginTop: '4px', fontVariantNumeric: 'tabular-nums' }}>
              98.4%
            </div>
            <div style={{ fontSize: '12px', color: '#059669', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={13} /> Tier 2 SLA Standard Met
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setActiveTab('needs_action')}
            style={{
              padding: '10px 16px',
              border: 'none',
              background: 'none',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              borderBottom: activeTab === 'needs_action' ? '2px solid #e11d48' : '2px solid transparent',
              color: activeTab === 'needs_action' ? '#e11d48' : '#64748b',
            }}
          >
            Needs Action ({orders.filter((o) => o.status === 'pending_vendor_accept').length})
          </button>
          <button
            onClick={() => setActiveTab('pack_scan')}
            style={{
              padding: '10px 16px',
              border: 'none',
              background: 'none',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              borderBottom: activeTab === 'pack_scan' ? '2px solid #e11d48' : '2px solid transparent',
              color: activeTab === 'pack_scan' ? '#e11d48' : '#64748b',
            }}
          >
            Pack & Scan ({orders.filter((o) => o.status === 'accepted' || o.status === 'packing').length})
          </button>
          <button
            onClick={() => setActiveTab('ready_to_ship')}
            style={{
              padding: '10px 16px',
              border: 'none',
              background: 'none',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              borderBottom: activeTab === 'ready_to_ship' ? '2px solid #e11d48' : '2px solid transparent',
              color: activeTab === 'ready_to_ship' ? '#e11d48' : '#64748b',
            }}
          >
            Ready to Ship ({orders.filter((o) => o.status === 'ready_to_ship').length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '10px 16px',
              border: 'none',
              background: 'none',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              borderBottom: activeTab === 'all' ? '2px solid #e11d48' : '2px solid transparent',
              color: activeTab === 'all' ? '#e11d48' : '#64748b',
            }}
          >
            All Orders ({orders.length})
          </button>
        </div>

        {/* Order Cards Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredOrders.length === 0 ? (
            <div style={{ backgroundColor: '#ffffff', padding: '3rem', textAlign: 'center', borderRadius: '10px', border: '1px solid #e2e8f0', color: '#64748b' }}>
              No shipments found in this queue.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  padding: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>Order #{order.orderNumber}</span>
                    <Badge variant={order.status === 'ready_to_ship' ? 'success' : order.status === 'accepted' ? 'warning' : 'info'}>
                      {order.status.replace(/_/g, ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div style={{ fontSize: '14px', color: '#334155', fontWeight: 600 }}>
                    {order.qty}x {order.itemTitle}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>
                    Catalog SKU: <code style={{ color: '#0f172a', fontWeight: 600 }}>{order.sku}</code> • Destination: {order.recipientAddress.city}, {order.recipientAddress.stateOrProvince}
                  </div>
                </div>

                {/* Right side: SLA Timer + Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {order.status === 'pending_vendor_accept' && (
                    <>
                      <SlaTimerBadge label="Accept SLA" deadlineIso={order.acceptDeadline} />
                      <Button variant="primary" size="sm" onClick={() => handleAcceptOrder(order.id)}>
                        Accept Order
                      </Button>
                    </>
                  )}

                  {order.status === 'accepted' && (
                    <>
                      <SlaTimerBadge label="Ship SLA" deadlineIso={order.shipDeadline} />
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setScanningOrder(order)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Camera size={14} /> Pack & Scan SKU
                      </Button>
                    </>
                  )}

                  {order.status === 'ready_to_ship' && (
                    <>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        Tracking: <strong style={{ color: '#0f172a' }}>{order.trackingNumber}</strong>
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setLabelOrder(order)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Printer size={14} /> Print Label
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Modals */}
      {scanningOrder && (
        <BarcodeScannerModal
          isOpen={true}
          orderNumber={scanningOrder.orderNumber}
          expectedSku={scanningOrder.sku}
          itemTitle={scanningOrder.itemTitle}
          onClose={() => setScanningOrder(null)}
          onScanComplete={handleScanComplete}
        />
      )}

      {labelOrder && (
        <ShippingLabelModal
          isOpen={true}
          orderNumber={labelOrder.orderNumber}
          trackingNumber={labelOrder.trackingNumber || 'TRK-DEMO-001'}
          carrierName="Manga Express Logistics"
          weightG={labelOrder.weightG || 650}
          recipientAddress={labelOrder.recipientAddress}
          onClose={() => setLabelOrder(null)}
        />
      )}
    </div>
  );
}
