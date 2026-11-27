import * as React from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCw,
} from 'lucide-react';
import { AdminTab } from './AdminSidebar.js';

interface AdminHeaderProps {
  activeTab: AdminTab;
  onOpenCommandPalette: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onRefresh: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  onOpenCommandPalette,
  theme,
  onToggleTheme,
  onRefresh,
}) => {
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(3);

  const notifications = [
    {
      id: 'notif-1',
      title: 'Dispute Case Escalation',
      detail: 'Case #dsp-101 requires adjudication within 48h (Damaged goods).',
      time: '12m ago',
      type: 'warn',
    },
    {
      id: 'notif-2',
      title: 'Merchant CAC Verified',
      detail: 'Kaduna Craft Guild approved for Tier 1 Premier status.',
      time: '1h ago',
      type: 'good',
    },
    {
      id: 'notif-3',
      title: 'Courier Dispatch Outbox',
      detail: '14 orders batched for Marketsquare Express pickup.',
      time: '3h ago',
      type: 'info',
    },
  ];

  const tabLabels: Record<AdminTab, string> = {
    overview: 'Control Tower & Executive Overview',
    orders: 'Courier Dispatch & Order Fulfillment',
    disputes: 'Dispute Adjudication Center',
    vendors: 'Merchant Accreditation Registry',
    ledger: 'Double-Entry Financial Ledger',
    coupons: 'Promotional Coupons & Voucher Governance',
    repairs: 'Platform Diagnostics & Repair Tools',
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
      {/* Left: Breadcrumb Navigation (Kovra Style) */}
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
          Manga Operations
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

        {/* Live Escrow Badge */}
        <div
          className="status-pill good"
          style={{
            marginLeft: '8px',
            fontSize: '10.5px',
            padding: '3px 9px',
            flexShrink: 0,
          }}
        >
          <span>Providus Escrow Active</span>
        </div>
      </div>

      {/* Right: Search, Tools, Notifications, Theme, External Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        
        {/* Search trigger (⌘K) */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-line)',
            borderRadius: '10px',
            padding: '7px 12px',
            fontSize: '12px',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'border-color 0.15s, background-color 0.15s',
            fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-line-strong)';
            e.currentTarget.style.backgroundColor = 'var(--bg-card)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-line)';
            e.currentTarget.style.backgroundColor = 'var(--bg-input)';
          }}
        >
          <Search size={14} color="var(--text-muted)" />
          <span style={{ display: 'inline-block' }}>Search actions...</span>
          <kbd
            style={{
              padding: '2px 5px',
              backgroundColor: 'var(--bg-well)',
              border: '1px solid var(--border-line)',
              borderRadius: '4px',
              fontSize: '10px',
              fontFamily: 'monospace',
              color: 'var(--text-faint)',
            }}
          >
            ⌘K
          </kbd>
        </button>

        {/* Refresh button */}
        <button
          type="button"
          onClick={onRefresh}
          title="Refresh platform metrics"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            border: '1px solid var(--border-line)',
            backgroundColor: 'var(--bg-input)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.borderColor = 'var(--border-line-strong)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.borderColor = 'var(--border-line)';
          }}
        >
          <RotateCw size={15} />
        </button>

        {/* External links pills */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1px solid var(--border-line)',
              backgroundColor: 'var(--bg-input)',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--accent-gold)',
              textDecoration: 'none',
              transition: 'background-color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-card)';
              e.currentTarget.style.borderColor = 'var(--accent-gold)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-input)';
              e.currentTarget.style.borderColor = 'var(--border-line)';
            }}
          >
            <span>Storefront</span>
            <ExternalLink size={11} />
          </a>

          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1px solid var(--border-line)',
              backgroundColor: 'var(--bg-input)',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              transition: 'background-color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-card)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-input)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <span>Vendor Hub</span>
            <ExternalLink size={11} />
          </a>
        </div>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            border: '1px solid var(--border-line)',
            backgroundColor: 'var(--bg-input)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.borderColor = 'var(--border-line-strong)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.borderColor = 'var(--border-line)';
          }}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Notifications Popover Trigger */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            title="Notifications"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              border: '1px solid var(--border-line)',
              backgroundColor: notificationsOpen ? 'var(--bg-card-hover)' : 'var(--bg-input)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              transition: 'all 0.15s ease',
            }}
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  backgroundColor: 'var(--accent-primary)',
                  color: '#ffffff',
                  fontSize: '9px',
                  fontWeight: 800,
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 0 2px var(--bg-topbar)',
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel (Solvik & Kovra Style) */}
          {notificationsOpen && (
            <div
              style={{
                position: 'absolute',
                top: '46px',
                right: 0,
                width: '320px',
                backgroundColor: 'var(--bg-popover)',
                borderRadius: '14px',
                border: '1px solid var(--border-line-strong)',
                boxShadow: 'var(--shadow-lg)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                zIndex: 100,
                animation: 'slideUpFade 0.15s ease',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border-line)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Notifications
                  </span>
                  <span
                    className="status-pill warn"
                    style={{ fontSize: '9.5px', padding: '1px 6px' }}
                  >
                    {unreadCount} new
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setUnreadCount(0)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      fontSize: '11px',
                      color: 'var(--accent-primary)',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Mark read
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-well)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '3px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {n.title}
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{n.time}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                      {n.detail}
                    </p>
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
