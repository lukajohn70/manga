import * as React from 'react';
import { Star, Heart, ShoppingCart, Zap, CheckCircle2, Store } from 'lucide-react';
import { Product } from '../data/mockProducts';

export interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onCompareOffers: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onCompareOffers,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '10px',
        border: isHovered ? '1px solid #C2410C' : '1px solid #E2E8F0',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: isHovered ? '0 10px 25px -5px rgba(0, 0, 0, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.2s ease',
        position: 'relative',
      }}
    >
      {/* Top Image & Badge Container */}
      <div>
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '210px',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: '#F8FAFC',
            marginBottom: '12px',
          }}
        >
          <img
            src={product.image}
            alt={product.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.3s ease',
            }}
          />

          {/* Discount Pill */}
          {product.discountPercent > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 800,
                padding: '3px 7px',
                borderRadius: '4px',
                letterSpacing: '0.02em',
              }}
            >
              -{product.discountPercent}%
            </div>
          )}

          {/* Wishlist Heart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            aria-label="Save to Wishlist"
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
              color: isWishlisted ? '#DC2626' : '#64748B',
            }}
          >
            <Heart size={16} fill={isWishlisted ? '#DC2626' : 'none'} />
          </button>
        </div>

        {/* Vendor & Official Store Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#64748B' }}>
            <Store size={12} />
            <span style={{ fontWeight: 600, color: '#334155' }}>{product.primaryVendor.name}</span>
            <span>({product.primaryVendor.city})</span>
          </div>
          {product.isOfficialStore && (
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#1E40AF',
                backgroundColor: '#EFF6FF',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              Official Store
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3
          title={product.title}
          style={{
            margin: '0 0 6px 0',
            fontSize: '14px',
            fontWeight: 600,
            color: '#0F172A',
            lineHeight: 1.35,
            height: '38px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.title}
        </h3>

        {/* Ratings & Reviews */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', color: '#F59E0B' }}>
            <Star size={13} fill="#F59E0B" />
            <span style={{ fontSize: '12px', fontWeight: 700, marginLeft: '3px', color: '#1E293B' }}>
              {product.rating}
            </span>
          </div>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>({product.reviewCount})</span>
          {product.soldCount && (
            <span style={{ fontSize: '11px', color: '#64748B', marginLeft: 'auto' }}>
              {product.soldCount} sold
            </span>
          )}
        </div>

        {/* Price Section */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontSize: '19px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>
            ₦{product.currentPrice.toLocaleString()}
          </div>
          {product.originalPrice > product.currentPrice && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <span style={{ fontSize: '12px', color: '#94A3B8', textDecoration: 'line-through' }}>
                ₦{product.originalPrice.toLocaleString()}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#15803D' }}>
                Save ₦{(product.originalPrice - product.currentPrice).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Delivery Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#15803D', marginBottom: '12px' }}>
          <Zap size={12} />
          <strong>Manga Express</strong> • Next-day delivery
        </div>
      </div>

      {/* Action Buttons: Add to Cart + Compare Offers */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <button
          onClick={() => onAddToCart(product)}
          style={{
            width: '100%',
            backgroundColor: '#C2410C',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            padding: '9px 12px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'background-color 0.15s ease',
          }}
        >
          <ShoppingCart size={15} /> Add to Cart
        </button>

        {product.otherOffers && product.otherOffers.length > 0 && (
          <button
            onClick={() => onCompareOffers(product)}
            style={{
              width: '100%',
              backgroundColor: '#F8FAFC',
              color: '#475569',
              border: '1px solid #CBD5E1',
              borderRadius: '6px',
              padding: '6px 10px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Compare {product.otherOffers.length + 1} offers from ₦
            {Math.min(product.currentPrice, ...product.otherOffers.map((o) => o.price)).toLocaleString()}
          </button>
        )}
      </div>
    </div>
  );
};
