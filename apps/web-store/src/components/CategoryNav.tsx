import * as React from 'react';
import { Menu, Zap, Flame, Sparkles, Tag, ChevronRight } from 'lucide-react';
import { CATEGORIES, Category } from '../data/mockProducts';

export interface CategoryNavProps {
  selectedCategory: string;
  onSelectCategory: (categorySlug: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div>
      {/* 1. Standard Department Sub-navigation Bar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '0 2rem',
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={() => onSelectCategory('all')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                backgroundColor: selectedCategory === 'all' ? '#FFF7ED' : 'transparent',
                color: selectedCategory === 'all' ? '#C2410C' : '#0F172A',
                border: 'none',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                borderRadius: '6px',
                whiteSpace: 'nowrap',
              }}
            >
              <Menu size={16} /> All Categories
            </button>

            <button
              onClick={() => onSelectCategory('flash-deals')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '12px 14px',
                border: 'none',
                background: 'none',
                fontWeight: 700,
                fontSize: '13px',
                color: '#DC2626',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <Flame size={15} color="#DC2626" /> Flash Sales
            </button>

            <button
              onClick={() => onSelectCategory('phones-tablets')}
              style={{
                padding: '12px 14px',
                border: 'none',
                background: 'none',
                fontWeight: selectedCategory === 'phones-tablets' ? 700 : 500,
                fontSize: '13px',
                color: selectedCategory === 'phones-tablets' ? '#C2410C' : '#334155',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Phones & Tablets
            </button>

            <button
              onClick={() => onSelectCategory('electronics')}
              style={{
                padding: '12px 14px',
                border: 'none',
                background: 'none',
                fontWeight: selectedCategory === 'electronics' ? 700 : 500,
                fontSize: '13px',
                color: selectedCategory === 'electronics' ? '#C2410C' : '#334155',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Electronics & Audio
            </button>

            <button
              onClick={() => onSelectCategory('computers')}
              style={{
                padding: '12px 14px',
                border: 'none',
                background: 'none',
                fontWeight: selectedCategory === 'computers' ? 700 : 500,
                fontSize: '13px',
                color: selectedCategory === 'computers' ? '#C2410C' : '#334155',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Computers
            </button>

            <button
              onClick={() => onSelectCategory('mens-fashion')}
              style={{
                padding: '12px 14px',
                border: 'none',
                background: 'none',
                fontWeight: selectedCategory === 'mens-fashion' ? 700 : 500,
                fontSize: '13px',
                color: selectedCategory === 'mens-fashion' ? '#C2410C' : '#334155',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Fashion
            </button>

            <button
              onClick={() => onSelectCategory('home-kitchen')}
              style={{
                padding: '12px 14px',
                border: 'none',
                background: 'none',
                fontWeight: selectedCategory === 'home-kitchen' ? 700 : 500,
                fontSize: '13px',
                color: selectedCategory === 'home-kitchen' ? '#C2410C' : '#334155',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Home & Living
            </button>

            <button
              onClick={() => onSelectCategory('beauty')}
              style={{
                padding: '12px 14px',
                border: 'none',
                background: 'none',
                fontWeight: selectedCategory === 'beauty' ? 700 : 500,
                fontSize: '13px',
                color: selectedCategory === 'beauty' ? '#C2410C' : '#334155',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Beauty
            </button>

            <button
              onClick={() => onSelectCategory('groceries')}
              style={{
                padding: '12px 14px',
                border: 'none',
                background: 'none',
                fontWeight: selectedCategory === 'groceries' ? 700 : 500,
                fontSize: '13px',
                color: selectedCategory === 'groceries' ? '#C2410C' : '#334155',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Supermarket
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#15803D',
                backgroundColor: '#DCFCE7',
                padding: '4px 10px',
                borderRadius: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                whiteSpace: 'nowrap',
              }}
            >
              <Zap size={12} /> Manga Express: Free Delivery Over ₦30k
            </span>
          </div>
        </div>
      </div>

      {/* 2. Visual Circular Category Strips (Amazon / Konga / Jumia style) */}
      <div
        style={{
          maxWidth: '1440px',
          margin: '1.25rem auto 0',
          padding: '0 2rem',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gap: '12px',
          }}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                style={{
                  backgroundColor: isSelected ? '#FFF7ED' : '#FFFFFF',
                  borderRadius: '10px',
                  padding: '12px 8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: isSelected ? '1.5px solid #C2410C' : '1px solid #E2E8F0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    marginBottom: '8px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: isSelected ? '#C2410C' : '#1E293B',
                    lineHeight: 1.2,
                  }}
                >
                  {cat.name}
                </div>
                <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>
                  {cat.itemCount}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
