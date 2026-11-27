import * as React from 'react';
import {
  Search,
  Plus,
  Filter,
  LayoutGrid,
  List as ListIcon,
  Tag,
  DollarSign,
  Package,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Edit2,
  Trash2,
  ExternalLink,
  Sparkles,
  Layers,
  ArrowUpDown,
  X,
} from 'lucide-react';

export interface VendorProduct {
  id: string;
  sku: string;
  title: string;
  category: string;
  priceNgn: number;
  compareAtPriceNgn?: number;
  stock: number;
  lowStockThreshold: number;
  isActive: boolean;
  imageUrl?: string;
  salesCount: number;
  createdAt: string;
}

interface ProductCatalogProps {
  products: VendorProduct[];
  onAddProduct: (product: Omit<VendorProduct, 'id' | 'salesCount' | 'createdAt'>) => void;
  onUpdateProduct: (id: string, updates: Partial<VendorProduct>) => void;
  onDeleteProduct: (id: string) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  isAddModalOpen,
  setIsAddModalOpen,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');
  const [viewMode, setViewMode] = React.useState<'table' | 'bento'>('table');
  const [selectedStatus, setSelectedStatus] = React.useState<'ALL' | 'ACTIVE' | 'DRAFT' | 'LOW_STOCK'>('ALL');

  // New product form state
  const [formTitle, setFormTitle] = React.useState('');
  const [formCategory, setFormCategory] = React.useState('Audio & Acoustics');
  const [formSku, setFormSku] = React.useState('');
  const [formPrice, setFormPrice] = React.useState('');
  const [formComparePrice, setFormComparePrice] = React.useState('');
  const [formStock, setFormStock] = React.useState('10');
  const [formThreshold, setFormThreshold] = React.useState('3');
  const [formImageUrl, setFormImageUrl] = React.useState('');

  const categories = ['All', 'Audio & Acoustics', 'Computer Peripherals', 'Tablets & Slate Devices', 'Power & Charging Accessories', 'Displays & Monitors'];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'ALL' ||
      (selectedStatus === 'ACTIVE' && p.isActive) ||
      (selectedStatus === 'DRAFT' && !p.isActive) ||
      (selectedStatus === 'LOW_STOCK' && p.stock <= p.lowStockThreshold);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formPrice) return;

    const generatedSku = formSku || `SKU-${Date.now().toString().slice(-6)}`;
    onAddProduct({
      title: formTitle,
      category: formCategory,
      sku: generatedSku,
      priceNgn: Number(formPrice) || 50000,
      compareAtPriceNgn: formComparePrice ? Number(formComparePrice) : undefined,
      stock: Number(formStock) || 0,
      lowStockThreshold: Number(formThreshold) || 3,
      isActive: true,
      imageUrl: formImageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80',
    });

    // Reset and close
    setFormTitle('');
    setFormSku('');
    setFormPrice('');
    setFormComparePrice('');
    setFormStock('10');
    setFormThreshold('3');
    setFormImageUrl('');
    setIsAddModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header & Main Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: 'Fraunces, Georgia, serif',
              fontSize: '22px',
              fontWeight: 800,
              color: 'var(--text-primary)',
              margin: '0 0 4px',
            }}
          >
            Product Catalog
          </h2>
          <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Manage the merchandise, prices, stock availability, and listings shown on your Manga Storefront.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={16} />
          <span>+ Add New Product</span>
        </button>
      </div>

      {/* Filter Bar & View Toggle */}
      <div
        className="vendor-card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        {/* Search & Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-line-strong)',
              borderRadius: '8px',
              padding: '6px 12px',
              width: '260px',
            }}
          >
            <Search size={14} style={{ color: 'var(--text-muted)', marginRight: '8px' }} />
            <input
              type="text"
              placeholder="Search by title or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '12.5px',
                width: '100%',
                outline: 'none',
              }}
            />
            {searchQuery && (
              <X
                size={13}
                style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
                onClick={() => setSearchQuery('')}
              />
            )}
          </div>

          <div className="tab-pill-group" style={{ overflowX: 'auto', maxWidth: '100%' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`tab-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                style={{ whiteSpace: 'nowrap', fontSize: '11.5px' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="tab-pill-group">
            <button
              className={`tab-pill ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <ListIcon size={14} />
            </button>
            <button
              className={`tab-pill ${viewMode === 'bento' ? 'active' : ''}`}
              onClick={() => setViewMode('bento')}
              title="Bento Grid View"
            >
              <LayoutGrid size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Product Content (Table or Bento) */}
      {filteredProducts.length === 0 ? (
        <div
          className="vendor-card"
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            color: 'var(--text-muted)',
          }}
        >
          <Package size={36} style={{ color: 'var(--text-faint)', margin: '0 auto 12px' }} />
          <h4 style={{ margin: '0 0 6px', color: 'var(--text-primary)', fontSize: '16px' }}>No products match your criteria</h4>
          <p style={{ margin: '0 0 16px', fontSize: '12px' }}>Try clearing the search or category filter to view your inventory.</p>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="vendor-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="vendor-table">
              <thead>
                <tr>
                  <th style={{ width: '40px', textAlign: 'center' }}>#</th>
                  <th>Product Details</th>
                  <th>Category</th>
                  <th>Selling Price</th>
                  <th>Stock Units</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p, idx) => {
                  const isLow = p.stock <= p.lowStockThreshold;
                  return (
                    <tr key={p.id}>
                      <td style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                        {idx + 1}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            className="squircle"
                            style={{
                              width: '44px',
                              height: '44px',
                              backgroundColor: 'var(--bg-well)',
                              border: '1px solid var(--border-line-strong)',
                              overflow: 'hidden',
                              flexShrink: 0,
                            }}
                          >
                            {p.imageUrl ? (
                              <img
                                src={p.imageUrl}
                                alt={p.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => {
                                  // Fallback icon if image fails
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <Package size={20} style={{ color: 'var(--accent-primary)' }} />
                            )}
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: '13.5px',
                                fontWeight: 700,
                                color: 'var(--text-primary)',
                                maxWidth: '300px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {p.title}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                              SKU: {p.sku}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          style={{
                            fontSize: '11px',
                            color: 'var(--text-secondary)',
                            backgroundColor: 'var(--bg-well)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-line)',
                          }}
                        >
                          {p.category}
                        </span>
                      </td>

                      <td>
                        <div>
                          <span
                            className="tabular-nums"
                            style={{
                              fontSize: '13.5px',
                              fontWeight: 800,
                              color: 'var(--text-primary)',
                            }}
                          >
                            ₦{p.priceNgn.toLocaleString()}
                          </span>
                          {p.compareAtPriceNgn && (
                            <span
                              className="tabular-nums"
                              style={{
                                fontSize: '11px',
                                color: 'var(--text-muted)',
                                textDecoration: 'line-through',
                                marginLeft: '6px',
                              }}
                            >
                              ₦{p.compareAtPriceNgn.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            className={`tabular-nums ${isLow ? 'status-pill bad' : 'status-pill good'}`}
                            style={{ fontSize: '11.5px', padding: '2px 8px' }}
                          >
                            {p.stock} units {isLow && '(Low)'}
                          </span>
                          <button
                            onClick={() => onUpdateProduct(p.id, { stock: p.stock + 5 })}
                            style={{
                              background: 'none',
                              border: '1px solid var(--border-line-strong)',
                              borderRadius: '4px',
                              color: 'var(--text-secondary)',
                              fontSize: '10px',
                              padding: '2px 6px',
                              cursor: 'pointer',
                            }}
                            title="Quick add +5 stock"
                          >
                            +5
                          </button>
                        </div>
                      </td>

                      <td>
                        <button
                          onClick={() => onUpdateProduct(p.id, { isActive: !p.isActive })}
                          className={`status-pill ${p.isActive ? 'good' : 'neutral'}`}
                          style={{
                            cursor: 'pointer',
                            border: 'none',
                            fontSize: '11px',
                            padding: '3px 9px',
                          }}
                        >
                          {p.isActive ? '● Live on Store' : '○ Draft Hidden'}
                        </button>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                          <button
                            onClick={() => {
                              const newPrice = prompt(`Enter new price in Naira for ${p.title}:`, String(p.priceNgn));
                              if (newPrice && !isNaN(Number(newPrice))) {
                                onUpdateProduct(p.id, { priceNgn: Number(newPrice) });
                              }
                            }}
                            style={{
                              background: 'none',
                              border: '1px solid var(--border-line)',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              color: 'var(--text-secondary)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '11px',
                            }}
                            title="Edit Price"
                          >
                            <Edit2 size={12} />
                            <span>Price</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove "${p.title}" from your store?`)) {
                                onDeleteProduct(p.id);
                              }
                            }}
                            style={{
                              background: 'none',
                              border: '1px solid var(--border-line)',
                              borderRadius: '6px',
                              padding: '4px 6px',
                              color: 'var(--status-bad)',
                              cursor: 'pointer',
                            }}
                            title="Delete Product"
                          >
                            <Trash2 size={12} />
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
      ) : (
        /* BENTO GRID VIEW */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {filteredProducts.map((p) => {
            const isLow = p.stock <= p.lowStockThreshold;
            return (
              <div
                key={p.id}
                className="vendor-card vendor-card-interactive"
                style={{
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div
                      className="squircle"
                      style={{
                        width: '54px',
                        height: '54px',
                        backgroundColor: 'var(--bg-well)',
                        border: '1px solid var(--border-line-strong)',
                        overflow: 'hidden',
                      }}
                    >
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <Package size={24} style={{ color: 'var(--accent-primary)' }} />
                      )}
                    </div>

                    <button
                      onClick={() => onUpdateProduct(p.id, { isActive: !p.isActive })}
                      className={`status-pill ${p.isActive ? 'good' : 'neutral'}`}
                      style={{ cursor: 'pointer', border: 'none', fontSize: '10.5px' }}
                    >
                      {p.isActive ? 'Live' : 'Draft'}
                    </button>
                  </div>

                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      margin: '0 0 4px',
                      lineHeight: 1.3,
                    }}
                  >
                    {p.title}
                  </h4>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px', fontFamily: 'JetBrains Mono, monospace' }}>
                    SKU: {p.sku}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        color: 'var(--text-secondary)',
                        backgroundColor: 'var(--bg-well)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {p.category}
                    </span>
                    <span className={`status-pill ${isLow ? 'bad' : 'good'}`} style={{ fontSize: '10.5px' }}>
                      {p.stock} units
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-line)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div className="tabular-nums" style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    ₦{p.priceNgn.toLocaleString()}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => onUpdateProduct(p.id, { stock: p.stock + 5 })}
                      className="btn btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '11px' }}
                    >
                      +5 Stock
                    </button>
                    <button
                      onClick={() => onDeleteProduct(p.id)}
                      style={{
                        background: 'none',
                        border: '1px solid var(--border-line)',
                        borderRadius: '6px',
                        padding: '4px 6px',
                        color: 'var(--status-bad)',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* "+ Add New Product" Modal Drawer */}
      {isAddModalOpen && (
        <div className="vendor-modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div
            className="vendor-modal-content"
            style={{ maxWidth: '540px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  className="squircle"
                  style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: 'var(--accent-primary-glow)',
                    color: 'var(--accent-primary)',
                  }}
                >
                  <Package size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Add New Product
                  </h3>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    Publish a new item to your Manga Store catalog
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sony WH-1000XM5 ANC Headphones"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-line-strong)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-line-strong)',
                      color: 'var(--text-primary)',
                      fontSize: '12.5px',
                      outline: 'none',
                    }}
                  >
                    {categories.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                    SKU Code
                  </label>
                  <input
                    type="text"
                    placeholder="Auto-generated if empty"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-line-strong)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none',
                      fontFamily: 'JetBrains Mono, monospace',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                    Selling Price (₦) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="450000"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-line-strong)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                    Compare-at / Original (₦)
                  </label>
                  <input
                    type="number"
                    placeholder="Optional discount anchor"
                    value={formComparePrice}
                    onChange={(e) => setFormComparePrice(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-line-strong)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                    Stock Units Available *
                  </label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-line-strong)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                    Low Stock Alert At
                  </label>
                  <input
                    type="number"
                    value={formThreshold}
                    onChange={(e) => setFormThreshold(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-line-strong)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                  Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-line-strong)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save & Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
