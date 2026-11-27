import * as React from 'react';
import {
  ChevronRight,
  Sun,
  Moon,
  ExternalLink,
  RotateCw,
  Bell,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { VendorTab } from './VendorSidebar.js';

interface VendorHeaderProps {
  activeTab: VendorTab;
  storeName: string;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onRefresh: () => void;
}

export const VendorHeader: React.FC<VendorHeaderProps> = ({
  activeTab,
  storeName,
  theme,
  onToggleTheme,
  onRefresh,
}) => {
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(2);

  const notifications = [
    {
      id: 'vn-1',
      title: 'New Customer Order Received',
      detail: 'Order #MNG-2611-48K2F requires fulfillment.',
      time: '18m ago',
      type: 'warn',
    },
    {
      id: 'vn-2',
      title: 'Escrow Settlement Cleared',
      detail: '₦1,649,000 ready for withdrawal to Providus Bank.',
      time: '2h ago',
      type: 'good',
    },
  ];

  const tabLabels: Record<VendorTab, string> = {
    overview: 'Store Overview & Sales Analytics',
    products: 'Product Catalog & Listings',
    orders: 'Customer Orders & Fulfillment',
    inventory: 'Real-Time Stock & Low-Stock Alerts',
    payouts: 'Escrow Wallet & Payout Settlement',
    store_settings: 'Store Profile & Hub Settings',
  };

  return (
    <header
      style={{
        minHeight: '72px',
        backgroundColor: 'var(--bg-topbar)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-line)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        gap: '16px',
        flexWrap: 'wrap',
      }}
    >
      {/* Left: Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flexShrink: 1 }}>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
          }}
        >
          {storeName}
        </span>
        <ChevronRight size={14} color="var(--text-faint)" />
        <span
          style={{
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          }}
        >
          {tabLabels[activeTab]}
        </span>

        {/* SLA Status Pill */}
        <div
          className="status-pill good"
          style={{
            marginLeft: '8px',
            fontSize: '10.5px',
            padding: '3px 9px',
            flexShrink: 0,
          }}
        >
          <ShieldCheck size={12} />
          <span>Providus Escrow Active</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        {/* Refresh button */}
        <button
          onClick={onRefresh}
          className="btn btn-secondary"
          title="Refresh store metrics"
          style={{
            padding: '8px 10px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
          }}
        >
          <RotateCw size={13} />
          <span style={{ display: 'inline' }}>Sync</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className="btn btn-secondary"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          style={{
            padding: '8px 10px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
          }}
        >
          {theme === 'dark' ? (
            <>
              <Sun size={14} style={{ color: 'var(--accent-gold)' }} />
              <span style={{ display: 'inline' }}>Light</span>
            </>
          ) : (
            <>
              <Moon size={14} style={{ color: 'var(--accent-primary)' }} />
              <span style={{ display: 'inline' }}>Dark</span>
            </>
          )}
        </button>

        {/* Public Storefront Link */}
        <a
          href="#preview"
          onClick={(e) => {
            e.preventDefault();
            alert(`Opening customer-facing storefront: manga.ng/stores/apex-tech`);
          }}
          className="btn btn-secondary"
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: 'var(--accent-primary)',
            textDecoration: 'none',
          }}
          title="Open customer-facing storefront"
        >
          <ExternalLink size={13} />
          <span>Visit Store</span>
        </a>

        {/* Notifications Popover */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setNotificationsOpen((prev) => !prev);
              if (unreadCount > 0) setUnreadCount(0);
            }}
            className="btn btn-secondary"
            style={{
              padding: '8px 10px',
              borderRadius: '8px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Merchant Notifications"
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  backgroundColor: 'var(--accent-primary)',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: 800,
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div
              className="vendor-card"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '320px',
                padding: '16px',
                zIndex: 60,
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-line-strong)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border-line)',
                }}
              >
                <span style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Store Notifications
                </span>
                <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Providus Escrow</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: '10px',
                      backgroundColor: 'var(--bg-well)',
                      borderRadius: '8px',
                      border: '1px solid var(--border-line-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {n.title}
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--text-faint)' }}>{n.time}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>{n.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
