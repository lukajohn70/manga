import * as React from 'react';
import {
  Search,
  LayoutDashboard,
  Truck,
  Scale,
  Building2,
  BookOpen,
  Ticket,
  Wrench,
  ArrowRight,
  ExternalLink,
  Command,
} from 'lucide-react';
import { AdminTab } from './AdminSidebar.js';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: AdminTab) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
}) => {
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'overview' as AdminTab,
      category: 'Navigation',
      title: 'Platform Control Tower Overview',
      subtitle: 'GMV metrics, take-rate, live fulfillment stats',
      icon: LayoutDashboard,
    },
    {
      id: 'orders' as AdminTab,
      category: 'Navigation',
      title: 'Courier Dispatch & Order Fulfillment',
      subtitle: 'Manage orders, update courier waybills, batch dispatch',
      icon: Truck,
    },
    {
      id: 'disputes' as AdminTab,
      category: 'Navigation',
      title: 'Dispute Adjudication Center',
      subtitle: 'Review buyer/merchant evidence, escrow refund ruling',
      icon: Scale,
    },
    {
      id: 'vendors' as AdminTab,
      category: 'Navigation',
      title: 'Merchant Accreditation (CAC / TIN Registry)',
      subtitle: 'Statutory compliance, bank match, AI studio credits',
      icon: Building2,
    },
    {
      id: 'ledger' as AdminTab,
      category: 'Navigation',
      title: 'Double-Entry Financial Ledger',
      subtitle: 'Double-entry audit logs, Providus escrow vault balance',
      icon: BookOpen,
    },
    {
      id: 'coupons' as AdminTab,
      category: 'Navigation',
      title: 'Promotional Coupons & Voucher Governance',
      subtitle: 'Issue discount codes, toggle active promotions',
      icon: Ticket,
    },
    {
      id: 'repairs' as AdminTab,
      category: 'Navigation',
      title: 'System Diagnostics & Repair Tools',
      subtitle: 'Outbox event replay, stuck reservation release, cache sync',
      icon: Wrench,
    },
  ];

  const filtered = actions.filter((a) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      a.subtitle.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-line)',
            backgroundColor: 'var(--bg-well)',
          }}
        >
          <Search size={18} color="var(--accent-primary)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, page, or action..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
            }}
          />
          <kbd
            style={{
              padding: '3px 6px',
              borderRadius: '5px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-line)',
              fontSize: '11px',
              color: 'var(--text-muted)',
              fontFamily: 'monospace',
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '10px' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No matches found for "{query}".
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {filtered.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectTab(item.id);
                      onClose();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background-color 0.15s ease',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--bg-well)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        className="squircle"
                        style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: 'var(--accent-primary-glow)',
                          color: 'var(--accent-primary)',
                        }}
                      >
                        <Icon size={16} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>{item.title}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.subtitle}</span>
                      </div>
                    </div>

                    <ArrowRight size={14} color="var(--text-faint)" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div
          style={{
            padding: '10px 16px',
            borderTop: '1px solid var(--border-line)',
            backgroundColor: 'var(--bg-well)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11px',
            color: 'var(--text-muted)',
          }}
        >
          <span>Use arrow keys or click to navigate</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span>Select ↵</span>
            <span>Close Esc</span>
          </div>
        </div>
      </div>
    </div>
  );
};
