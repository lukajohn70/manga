import * as React from 'react';
import { ArrowRight, ShieldCheck, Zap, Store, Truck, ChevronLeft, ChevronRight } from 'lucide-react';

export const HeroBanner: React.FC<{ onExploreDeals: () => void }> = ({ onExploreDeals }) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const slides = [
    {
      badge: 'MEGA ELECTRONICS & GADGET WEEK',
      title: 'Upgrade Your World. Top Tech, Lowest Prices.',
      subtitle: 'Smartphones, Laptops, Audio & Home Entertainment with verified warranty and 24h express dispatch.',
      cta: 'Shop Tech Deals',
      discount: 'UP TO 35% OFF',
      bgGradient: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
      accentColor: '#F97316',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    },
    {
      badge: 'NEW SEASON ARRIVALS',
      title: 'Authentic Fashion & Everyday Essentials',
      subtitle: 'Curated apparel, premium sneakers, bags and accessories from independent Nigerian merchants.',
      cta: 'Explore Fashion',
      discount: 'FROM ₦4,500',
      bgGradient: 'linear-gradient(135deg, #7C2D12 0%, #431407 100%)',
      accentColor: '#FDBA74',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
    },
  ];

  const slide = slides[currentSlide];

  return (
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
          gridTemplateColumns: '1fr 340px',
          gap: '16px',
        }}
      >
        {/* Main Hero Banner Slider */}
        <div
          style={{
            background: slide.bgGradient,
            borderRadius: '12px',
            padding: '2.5rem 3rem',
            color: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '340px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          }}
        >
          {/* Subtle background image overlay */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '50%',
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.35,
              maskImage: 'linear-gradient(to right, transparent, black)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 5%, black 95%)',
            }}
          />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '540px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(4px)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.06em',
                color: slide.accentColor,
                marginBottom: '1rem',
              }}
            >
              <Zap size={13} /> {slide.badge} • {slide.discount}
            </div>

            <h1
              style={{
                fontSize: '2.25rem',
                fontWeight: 900,
                lineHeight: 1.15,
                margin: '0 0 12px 0',
                letterSpacing: '-0.02em',
              }}
            >
              {slide.title}
            </h1>

            <p
              style={{
                fontSize: '14px',
                color: '#CBD5E1',
                lineHeight: 1.5,
                margin: '0 0 1.75rem 0',
                maxWidth: '460px',
              }}
            >
              {slide.subtitle}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <button
                onClick={onExploreDeals}
                style={{
                  backgroundColor: slide.accentColor,
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
                }}
              >
                {slide.cta} <ArrowRight size={16} />
              </button>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                Over <strong>150,000+</strong> verified orders delivered
              </span>
            </div>
          </div>

          {/* Slide Indicator Controls */}
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '24px',
              display: 'flex',
              gap: '6px',
              zIndex: 3,
            }}
          >
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                style={{
                  width: idx === currentSlide ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: idx === currentSlide ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.2s ease',
                }}
              />
            ))}
          </div>
        </div>

        {/* Side Promo Action Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Card 1: Manga Express Logistics */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              padding: '1.25rem',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                backgroundColor: '#DCFCE7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#15803D',
                flexShrink: 0,
              }}
            >
              <Truck size={22} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                Manga Express Delivery
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '3px', lineHeight: 1.4 }}>
                Next-day priority fulfillment across Lagos, Abuja, Port Harcourt & Ibadan.
              </div>
            </div>
          </div>

          {/* Card 2: Escrow Protection */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              padding: '1.25rem',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                backgroundColor: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1D4ED8',
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                Safe Escrow Payment
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '3px', lineHeight: 1.4 }}>
                Funds are held in secure escrow until you receive and verify your package.
              </div>
            </div>
          </div>

          {/* Card 3: Sell on Manga */}
          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noreferrer"
            style={{
              backgroundColor: '#FFF7ED',
              borderRadius: '10px',
              padding: '1.25rem',
              border: '1px solid #FDBA74',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                backgroundColor: '#EA580C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                flexShrink: 0,
              }}
            >
              <Store size={22} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#9A3412', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Start Selling on Manga <ArrowRight size={13} />
              </div>
              <div style={{ fontSize: '12px', color: '#C2410C', marginTop: '3px', lineHeight: 1.4 }}>
                Register your business in 5 minutes. Zero monthly maintenance fees.
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};
