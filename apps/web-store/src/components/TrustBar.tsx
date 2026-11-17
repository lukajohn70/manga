import * as React from 'react';
import { ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';

export const TrustBar: React.FC = () => {
  const pillars = [
    {
      icon: <ShieldCheck size={26} color="#C2410C" />,
      title: '100% Authentic Products',
      description: 'Sourced directly from verified brands and vetted merchant suppliers.',
    },
    {
      icon: <Truck size={26} color="#C2410C" />,
      title: 'Fast Nationwide Delivery',
      description: 'Express door-to-door delivery across all 36 Nigerian states & FCT.',
    },
    {
      icon: <RotateCcw size={26} color="#C2410C" />,
      title: '7-Day Easy Returns',
      description: 'Zero hassle return policy with instant escrow refund guarantee.',
    },
    {
      icon: <Headphones size={26} color="#C2410C" />,
      title: '24/7 Dedicated Support',
      description: 'Talk to real humans via live chat, WhatsApp, or phone anytime.',
    },
  ];

  return (
    <section
      style={{
        maxWidth: '1440px',
        margin: '2.5rem auto 0',
        padding: '0 2rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          padding: '1.75rem 2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        {pillars.map((p, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                backgroundColor: '#FFF7ED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {p.icon}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '3px' }}>
                {p.title}
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.4 }}>
                {p.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
