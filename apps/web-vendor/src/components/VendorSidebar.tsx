import * as React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Wallet,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  ShieldCheck,
  Store,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export type VendorTab =
  | 'overview'
  | 'products'
  | 'orders'
  | 'inventory'
  | 'payouts'
  | 'store_settings';

interface VendorSidebarProps {
  activeTab: VendorTab;
  onSelectTab: (tab: VendorTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  newOrdersCount: number;
  productsCount: number;
  lowStockCount: number;
  storeName: string;
  vendorEmail: string;
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

export const VendorSidebar: React.FC<VendorSidebarProps> = ({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  newOrdersCount,
  productsCount,
  lowStockCount,
  storeName,
  vendorEmail,
  onLogout,
}) => {
  const navSections = [
    {
      title: 'Storefront',
      items: [
        {
          id: 'overview' as VendorTab,
          label: 'Overview & Sales',
          icon: LayoutDashboard,
          badge: undefined,
          badgeType: undefined,
        },
        {
          id: 'products' as VendorTab,
          label: 'Products & Catalog',
          icon: Package,
          badge: productsCount > 0 ? String(productsCount) : undefined,
          badgeType: 'neutral' as const,
        },
        {
          id: 'orders' as VendorTab,
          label: 'Customer Orders',
          icon: ShoppingBag,
          badge: newOrdersCount > 0 ? `${newOrdersCount} new` : undefined,
          badgeType: 'warn' as const,
        },
      ],
    },
    {
      title: 'Operations & Finances',
      items: [
        {
          id: 'inventory' as VendorTab,
          label: 'Inventory & Stock',
          icon: Layers,
          badge: lowStockCount > 0 ? `${lowStockCount} low` : 'Healthy',
          badgeType: lowStockCount > 0 ? ('bad' as const) : ('good' as const),
        },
        {
          id: 'payouts' as VendorTab,
          label: 'Earnings & Payouts',
          icon: Wallet,
          badge: 'Active',
          badgeType: 'good' as const,
        },
        {
          id: 'store_settings' as VendorTab,
          label: 'Store Profile & Settings',
          icon: Settings,
          badge: undefined,
          badgeType: undefined,
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
      {/* Brand & Store Header */}
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
              className="squircle"
              style={{
                width: '38px',
                height: '38px',
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
                      fontSize: '16px',
                      fontWeight: 800,
                      fontFamily: 'Fraunces, Georgia, serif',
                      letterSpacing: '-0.02em',
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    MANGA
                  </span>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--accent-primary-glow)',
                      color: 'var(--accent-primary)',
                      border: '1px solid var(--border-accent)',
                    }}
                  >
                    MERCHANT
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '150px',
                  }}
                  title={storeName}
                >
                  {storeName}
                </span>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              onClick={onToggleCollapse}
              title="Collapse sidebar (⌘B)"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PanelLeftClose size={17} />
            </button>
          )}
        </div>

        {/* Storefront Status Banner */}
        {!collapsed && (
          <div
            style={{
              padding: '12px 18px',
              borderBottom: '1px solid var(--border-line-subtle)',
              backgroundColor: 'var(--bg-well)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--status-good)',
                  boxShadow: '0 0 8px var(--status-good)',
                }}
              />
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Store Live & Verified
              </span>
            </div>
            <a
              href="#preview"
              onClick={(e) => {
                e.preventDefault();
                alert(`Viewing live storefront: manga.ng/stores/apex-tech`);
              }}
              style={{
                color: 'var(--accent-primary)',
                fontSize: '10.5px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                fontWeight: 600,
              }}
              title="Open public store URL"
            >
              <span>Visit</span>
              <ExternalLink size={10} />
            </a>
          </div>
        )}

        {/* Navigation Sections */}
        <div style={{ padding: collapsed ? '12px 8px' : '16px 12px' }}>
          {navSections.map((sec, secIdx) => (
            <div key={sec.title} style={{ marginBottom: secIdx === 0 ? '20px' : '0' }}>
              {!collapsed && (
                <div
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--text-faint)',
                    padding: '0 10px 8px',
                  }}
                >
                  {sec.title}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {sec.items.map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectTab(item.id)}
                      className={`vendor-nav-item ${isActive ? 'active' : ''}`}
                      title={collapsed ? item.label : undefined}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: collapsed ? 'center' : 'space-between',
                        padding: collapsed ? '10px' : '9px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        backgroundColor: isActive ? 'var(--bg-card)' : 'transparent',
                        color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icon size={18} style={{ flexShrink: 0, color: isActive ? 'var(--accent-primary)' : 'inherit' }} />
                        {!collapsed && (
                          <span
                            style={{
                              fontSize: '13px',
                              fontWeight: isActive ? 700 : 500,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {item.label}
                          </span>
                        )}
                      </div>

                      {!collapsed && item.badge && (
                        <span
                          className={`status-pill ${item.badgeType || 'neutral'}`}
                          style={{
                            fontSize: '10px',
                            padding: '2px 6px',
                            lineHeight: 1.2,
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / User Profile & Logout */}
      <div
        style={{
          padding: collapsed ? '12px 8px' : '16px 14px',
          borderTop: '1px solid var(--border-line)',
          backgroundColor: 'var(--bg-well)',
        }}
      >
        {collapsed ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onToggleCollapse}
              title="Expand sidebar (⌘B)"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '6px',
              }}
            >
              <PanelLeftOpen size={18} />
            </button>
            <button
              onClick={onLogout}
              title="Sign Out"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--status-bad)',
                cursor: 'pointer',
                padding: '6px',
              }}
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                <div
                  className="squircle"
                  style={{
                    width: '34px',
                    height: '34px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-line-strong)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 800,
                    color: 'var(--accent-primary)',
                    flexShrink: 0,
                  }}
                >
                  {storeName.charAt(0)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {storeName}
                  </span>
                  <span
                    style={{
                      fontSize: '10.5px',
                      color: 'var(--text-muted)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {vendorEmail}
                  </span>
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Log Out of Merchant Console"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--status-bad)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
