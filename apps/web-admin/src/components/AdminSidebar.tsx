import * as React from 'react';
import {
  LayoutDashboard,
  Truck,
  Scale,
  Building2,
  BookOpen,
  Ticket,
  Wrench,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  ShieldCheck,
  CircleDot,
} from 'lucide-react';

export type AdminTab =
  | 'overview'
  | 'orders'
  | 'disputes'
  | 'vendors'
  | 'ledger'
  | 'coupons'
  | 'repairs';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  ordersCount: number;
  disputesCount: number;
  merchantsCount: number;
  couponsCount: number;
  operatorEmail: string;
  onLogout: () => void;
}

export function NokTriangleIcon({ size = 18, color = '#B5532E' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L22 20H2L12 3Z" fill={color} />
      <circle cx="12" cy="13" r="2.5" fill="var(--bg-app, #FAF6F0)" />
    </svg>
  );
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  ordersCount,
  disputesCount,
  merchantsCount,
  couponsCount,
  operatorEmail,
  onLogout,
}) => {
  const navSections = [
    {
      title: 'Operations',
      items: [
        {
          id: 'overview' as AdminTab,
          label: 'Overview',
          icon: LayoutDashboard,
          badge: 'Live',
          badgeType: 'good' as const,
        },
        {
          id: 'orders' as AdminTab,
          label: 'Courier & Orders',
          icon: Truck,
          badge: ordersCount > 0 ? String(ordersCount) : undefined,
          badgeType: 'info' as const,
        },
        {
          id: 'disputes' as AdminTab,
          label: 'Dispute Center',
          icon: Scale,
          badge: disputesCount > 0 ? `${disputesCount} Case` : undefined,
          badgeType: 'warn' as const,
        },
      ],
    },
    {
      title: 'Governance & Finance',
      items: [
        {
          id: 'vendors' as AdminTab,
          label: 'Merchants (CAC)',
          icon: Building2,
          badge: String(merchantsCount),
          badgeType: 'neutral' as const,
        },
        {
          id: 'ledger' as AdminTab,
          label: 'Ledger & Escrow',
          icon: BookOpen,
          badge: '₦8.3M',
          badgeType: 'good' as const,
        },
        {
          id: 'coupons' as AdminTab,
          label: 'Promos & Coupons',
          icon: Ticket,
          badge: String(couponsCount),
          badgeType: 'neutral' as const,
        },
      ],
    },
    {
      title: 'Platform Diagnostics',
      items: [
        {
          id: 'repairs' as AdminTab,
          label: 'Repair & Tools',
          icon: Wrench,
          badge: 'Ready',
          badgeType: 'neutral' as const,
        },
      ],
    },
  ];

  return (
    <aside
      style={{
        width: collapsed ? '78px' : '260px',
        minWidth: collapsed ? '78px' : '260px',
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-line)',
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width 0.22s cubic-bezier(0.16, 1, 0.3, 1), min-width 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: 50,
        userSelect: 'none',
      }}
    >
      {/* Brand Header */}
      <div>
        <div
          style={{
            height: '72px',
            padding: collapsed ? '0 18px' : '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            borderBottom: '1px solid var(--border-line)',
          }}
        >
          <div
            onClick={() => onSelectTab('overview')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-line-strong)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)',
                flexShrink: 0,
              }}
            >
              <NokTriangleIcon size={20} color="var(--accent-primary, #b5532e)" />
            </div>

            {!collapsed && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      fontSize: '18px',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      fontFamily: 'Fraunces, Georgia, serif',
                      lineHeight: 1.1,
                      letterSpacing: '0.02em',
                    }}
                  >
                    MANGA
                  </span>
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 800,
                      backgroundColor: 'var(--accent-primary-glow)',
                      color: 'var(--accent-primary)',
                      padding: '2px 5px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-accent)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    PRO
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '9.5px',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginTop: '2px',
                  }}
                >
                  Control Tower
                </span>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              type="button"
              onClick={onToggleCollapse}
              title="Collapse sidebar (⌘B)"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.15s, background-color 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.backgroundColor = 'var(--bg-well)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <PanelLeftClose size={16} />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <div style={{ padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {navSections.map((sec, secIdx) => (
            <div key={secIdx}>
              {!collapsed ? (
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--text-faint)',
                    padding: '0 12px 6px',
                  }}
                >
                  {sec.title}
                </div>
              ) : (
                <div style={{ height: '1px', backgroundColor: 'var(--border-line)', margin: '4px 10px 10px' }} />
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectTab(item.id)}
                      title={collapsed ? item.label : undefined}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: collapsed ? 'center' : 'space-between',
                        padding: collapsed ? '10px' : '9px 12px',
                        borderRadius: '10px',
                        border: '1px solid',
                        borderColor: isActive ? 'var(--border-accent)' : 'transparent',
                        backgroundColor: isActive
                          ? 'var(--accent-primary-glow)'
                          : 'transparent',
                        color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        fontWeight: isActive ? 700 : 500,
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        position: 'relative',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'var(--bg-well)';
                          e.currentTarget.style.color = 'var(--text-primary)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icon size={17} strokeWidth={isActive ? 2.3 : 1.9} />
                        {!collapsed && <span>{item.label}</span>}
                      </div>

                      {!collapsed && item.badge && (
                        <span
                          className={`status-pill ${item.badgeType}`}
                          style={{
                            padding: '1px 7px',
                            fontSize: '10.5px',
                            borderRadius: '999px',
                            fontWeight: 700,
                          }}
                        >
                          {item.badge}
                        </span>
                      )}

                      {collapsed && item.badge && item.badgeType === 'warn' && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--status-warn)',
                            boxShadow: '0 0 0 2px var(--bg-sidebar)',
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Profile & Collapse Button */}
      <div
        style={{
          padding: '12px',
          borderTop: '1px solid var(--border-line)',
          backgroundColor: 'var(--bg-well)',
        }}
      >
        {collapsed ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={onToggleCollapse}
              title="Expand sidebar"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PanelLeftOpen size={17} />
            </button>
            <button
              type="button"
              onClick={onLogout}
              title="Log out"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--status-bad)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 8px',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-line)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', overflow: 'hidden' }}>
                <div
                  className="squircle"
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'var(--accent-primary)',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  OP
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Manga Operator
                    </span>
                    <CircleDot size={10} color="var(--status-good)" />
                  </div>
                  <span
                    style={{
                      fontSize: '10px',
                      color: 'var(--text-muted)',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      maxWidth: '120px',
                    }}
                  >
                    {operatorEmail}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onLogout}
                title="Sign out of Admin Session"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.15s, background-color 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--status-bad)';
                  e.currentTarget.style.backgroundColor = 'var(--status-bad-bg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <LogOut size={15} />
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 4px',
                fontSize: '10px',
                color: 'var(--text-faint)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={11} color="var(--status-good)" />
                <span>RBAC: Level 2 Admin</span>
              </div>
              <span style={{ fontFamily: 'monospace' }}>v2.4.0</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
