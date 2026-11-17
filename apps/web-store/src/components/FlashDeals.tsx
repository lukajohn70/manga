import * as React from 'react';
import { Flame, Clock, ArrowRight, Zap } from 'lucide-react';
import { FLASH_DEALS, Product } from '../data/mockProducts';
import { ProductCard } from './ProductCard';

export interface FlashDealsProps {
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: Set<string>;
  onCompareOffers: (product: Product) => void;
}

export const FlashDeals: React.FC<FlashDealsProps> = ({
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onCompareOffers,
}) => {
  const [timeLeft, setTimeLeft] = React.useState({ hours: 4, minutes: 28, seconds: 15 });

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <section
      style={{
        maxWidth: '1440px',
        margin: '2rem auto 0',
        padding: '0 2rem',
      }}
    >
      {/* Flash Deals Header Strip */}
      <div
        style={{
          backgroundColor: '#DC2626',
          borderRadius: '12px 12px 0 0',
          padding: '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#FFFFFF',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={24} color="#FEF08A" />
            <span style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.02em' }}>
              TODAY'S FLASH DEALS
            </span>
          </div>

          {/* Countdown Clock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
            <span style={{ opacity: 0.9 }}>Ends in:</span>
            <div style={{ display: 'flex', gap: '4px', fontWeight: 800 }}>
              <span style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '3px 6px', borderRadius: '4px' }}>
                {formatNumber(timeLeft.hours)}h
              </span>
              <span>:</span>
              <span style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '3px 6px', borderRadius: '4px' }}>
                {formatNumber(timeLeft.minutes)}m
              </span>
              <span>:</span>
              <span style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '3px 6px', borderRadius: '4px' }}>
                {formatNumber(timeLeft.seconds)}s
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
          <span>See All Flash Deals</span>
          <ArrowRight size={14} />
        </div>
      </div>

      {/* Flash Deals Product Grid */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '0 0 12px 12px',
          border: '1px solid #E2E8F0',
          borderTop: 'none',
          padding: '1.25rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
          }}
        >
          {FLASH_DEALS.map((deal) => {
            const soldPercent = Math.min(100, Math.round(((deal.soldCount || 30) / (deal.stockCount + (deal.soldCount || 30))) * 100));

            return (
              <div key={deal.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <ProductCard
                  product={deal}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlistIds.has(deal.id)}
                  onCompareOffers={onCompareOffers}
                />
                {/* Flash Deal Progress Bar */}
                <div style={{ marginTop: '8px', padding: '0 4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748B', marginBottom: '3px' }}>
                    <span>{soldPercent}% Claimed</span>
                    <span style={{ fontWeight: 600, color: '#DC2626' }}>{deal.stockCount} left</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#FEE2E2', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${soldPercent}%`, height: '100%', backgroundColor: '#DC2626', borderRadius: '3px' }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
