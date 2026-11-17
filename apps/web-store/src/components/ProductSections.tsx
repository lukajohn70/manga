import * as React from 'react';
import { ArrowRight, Sparkles, Smartphone, Shirt, Home } from 'lucide-react';
import { Product, FEATURED_PRODUCTS } from '../data/mockProducts';
import { ProductCard } from './ProductCard';

export interface ProductSectionsProps {
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: Set<string>;
  onCompareOffers: (product: Product) => void;
}

export const ProductSections: React.FC<ProductSectionsProps> = ({
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onCompareOffers,
}) => {
  const electronicsProducts = FEATURED_PRODUCTS.filter(
    (p) => p.category === 'Phones & Tablets' || p.category === 'Electronics & Audio'
  );
  const fashionProducts = FEATURED_PRODUCTS.filter(
    (p) => p.category === "Men's Fashion" || p.category === "Women's Fashion"
  );
  const computingAndHome = FEATURED_PRODUCTS.filter(
    (p) => p.category === 'Computers & Laptops' || p.category === 'Beauty & Personal Care'
  );

  return (
    <div style={{ maxWidth: '1440px', margin: '2rem auto 0', padding: '0 2rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Shelf 1: Phones & Electronics */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                <Smartphone size={16} />
              </div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                Top Tech, Phones & Electronics
              </h2>
            </div>
            <p style={{ margin: '3px 0 0 36px', fontSize: '13px', color: '#64748B' }}>
              Genuine devices with official manufacturer warranty and express next-day delivery.
            </p>
          </div>
          <button style={{ background: 'none', border: 'none', color: '#C2410C', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>View All Tech</span> <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {electronicsProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlistIds.has(p.id)}
              onCompareOffers={onCompareOffers}
            />
          ))}
        </div>
      </section>

      {/* Mid-Page Promotional Banner */}
      <div
        style={{
          borderRadius: '12px',
          background: 'linear-gradient(90deg, #EA580C 0%, #C2410C 100%)',
          color: '#FFFFFF',
          padding: '1.75rem 2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 12px rgba(194, 65, 12, 0.25)',
        }}
      >
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.9 }}>
            NATIONWIDE MERCHANT GUARANTEE
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, marginTop: '4px' }}>
            Pay with Peace of Mind. 100% Escrow Protection.
          </div>
          <div style={{ fontSize: '13px', opacity: 0.9, marginTop: '4px' }}>
            Your payment is securely held until you inspect your items. Return easily within 7 days.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noreferrer"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#C2410C',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '13px',
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            }}
          >
            Sell on Manga
          </a>
        </div>
      </div>

      {/* Shelf 2: Fashion & Apparel */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#FDF2F8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DB2777' }}>
                <Shirt size={16} />
              </div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                Trending Fashion & Accessories
              </h2>
            </div>
            <p style={{ margin: '3px 0 0 36px', fontSize: '13px', color: '#64748B' }}>
              Sneakers, handcrafted genuine leather bags, and stylish daily wear.
            </p>
          </div>
          <button style={{ background: 'none', border: 'none', color: '#C2410C', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Explore Fashion</span> <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {fashionProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlistIds.has(p.id)}
              onCompareOffers={onCompareOffers}
            />
          ))}
          {computingAndHome.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlistIds.has(p.id)}
              onCompareOffers={onCompareOffers}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
