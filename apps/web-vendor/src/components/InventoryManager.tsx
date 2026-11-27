import * as React from 'react';
import { Layers, AlertTriangle, CheckCircle2, Search, Plus, Minus, Package } from 'lucide-react';

export interface InventoryItem {
  sku: string;
  name: string;
  category: string;
  stockAvailable: number;
  stockReserved: number;
  unitPriceNgn: number;
  lowStockThreshold: number;
}

interface InventoryManagerProps {
  inventory: InventoryItem[];
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({ inventory, onShowToast }) => {
  const [items, setItems] = React.useState<InventoryItem[]>(inventory);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleAdjustStock = (sku: string, delta: number) => {
    setItems((prev) =>
      prev.map((it) =>
        it.sku === sku
          ? { ...it, stockAvailable: Math.max(0, it.stockAvailable + delta) }
          : it
      )
    );
    const target = items.find((it) => it.sku === sku);
    onShowToast(`Updated live stock for ${target?.name || sku} (${delta > 0 ? `+${delta}` : delta}).`, 'info');
  };

  const filtered = items.filter((it) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      it.name.toLowerCase().includes(q) ||
      it.sku.toLowerCase().includes(q) ||
      it.category.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Title & Stats */}
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
              <Layers size={17} />
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
              Real-Time Stock & SKU Availability Registry
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
            Synchronized storefront availability, active checkout reservations, and threshold alerts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="status-pill good">{items.length} SKUs Listed</span>
          <span className="status-pill warn">
            {items.filter((it) => it.stockAvailable <= it.lowStockThreshold).length} Low Stock Alert
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className="vendor-card"
        style={{
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
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
            placeholder="Search SKU, product title, category..."
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
              width: '280px',
              fontFamily: 'inherit',
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="vendor-table-container">
        <table className="vendor-table">
          <thead>
            <tr>
              <th>Product & Category</th>
              <th>SKU Reference</th>
              <th>Available Stock</th>
              <th>Reserved in Carts</th>
              <th>Unit Price (NGN)</th>
              <th>Stock Status</th>
              <th style={{ textAlign: 'right' }}>Quick Adjust</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => {
              const isLow = item.stockAvailable <= item.lowStockThreshold;
              return (
                <tr key={item.sku}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.category}</div>
                  </td>

                  <td>
                    <code className="tabular-nums" style={{ fontFamily: 'monospace', color: 'var(--accent-primary)', fontWeight: 700 }}>
                      {item.sku}
                    </code>
                  </td>

                  <td>
                    <div className="tabular-nums" style={{ fontSize: '15px', fontWeight: 800, color: isLow ? 'var(--status-warn)' : 'var(--text-primary)' }}>
                      {item.stockAvailable} units
                    </div>
                  </td>

                  <td>
                    <div className="tabular-nums" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
                      {item.stockReserved} on hold
                    </div>
                  </td>

                  <td>
                    <div className="tabular-nums" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      ₦{item.unitPriceNgn.toLocaleString()}
                    </div>
                  </td>

                  <td>
                    {isLow ? (
                      <span className="status-pill warn">
                        <AlertTriangle size={12} /> Low Stock (≤{item.lowStockThreshold})
                      </span>
                    ) : (
                      <span className="status-pill good">
                        <CheckCircle2 size={12} /> Optimal ({item.stockAvailable})
                      </span>
                    )}
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => handleAdjustStock(item.sku, -1)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-line)',
                          backgroundColor: 'var(--bg-well)',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Minus size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdjustStock(item.sku, 10)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-line)',
                          backgroundColor: 'var(--bg-well)',
                          color: 'var(--accent-primary)',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        +10
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
