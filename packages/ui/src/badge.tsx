import * as React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'neutral' | 'info';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral' }) => {
  const getColors = () => {
    switch (variant) {
      case 'success':
        return { bg: '#dcfce7', text: '#15803d' };
      case 'warning':
        return { bg: '#fef3c7', text: '#b45309' };
      case 'error':
        return { bg: '#fee2e2', text: '#b91c1c' };
      case 'info':
        return { bg: '#dbeafe', text: '#1d4ed8' };
      default:
        return { bg: '#f1f5f9', text: '#475569' };
    }
  };

  const { bg, text } = getColors();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 600,
        backgroundColor: bg,
        color: text,
      }}
    >
      {children}
    </span>
  );
};
