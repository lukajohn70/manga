import * as React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'neutral' | 'info' | 'terracotta' | 'ochre';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral' }) => {
  const getColors = () => {
    switch (variant) {
      case 'success':
        return { bg: '#EBF2E6', text: '#4F6B3A', border: '#D0DEC7' };
      case 'warning':
      case 'ochre':
        return { bg: '#FBF5E5', text: '#8C6514', border: '#F3E1B2' };
      case 'error':
        return { bg: '#FBE8E7', text: '#B3261E', border: '#F3BCB8' };
      case 'info':
        return { bg: '#EBF1F6', text: '#3E5C76', border: '#CADAE6' };
      case 'terracotta':
        return { bg: '#F8ECE7', text: '#B5532E', border: '#EDC8BA' };
      default:
        return { bg: '#E7D5BC', text: '#2A2320', border: '#D8C3A5' };
    }
  };

  const { bg, text, border } = getColors();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 8px',
        borderRadius: '9999px',
        fontSize: '11px',
        fontWeight: 700,
        backgroundColor: bg,
        color: text,
        border: `1px solid ${border}`,
        letterSpacing: '0.02em',
      }}
    >
      {children}
    </span>
  );
};
