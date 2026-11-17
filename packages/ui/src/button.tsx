import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  style,
  ...props
}) => {
  const getStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: '#B5532E',
          color: '#FFFFFF',
          border: '1px solid #8F3B1F',
          boxShadow: '0 1px 2px rgba(42, 35, 32, 0.08)',
        };
      case 'secondary':
        return {
          backgroundColor: '#2A2320',
          color: '#F6EDE0',
          border: '1px solid #1E1815',
        };
      case 'outline':
        return {
          backgroundColor: '#FFFFFF',
          color: '#2A2320',
          border: '1px solid #D8C3A5',
        };
      case 'destructive':
        return {
          backgroundColor: '#B3261E',
          color: '#FFFFFF',
          border: '1px solid #8F1D17',
        };
      case 'ghost':
      default:
        return {
          backgroundColor: 'transparent',
          color: '#2A2320',
          border: '1px solid transparent',
        };
    }
  };

  return (
    <button
      disabled={disabled || isLoading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        borderRadius: '8px',
        fontWeight: 600,
        fontFamily: 'Inter, -apple-system, sans-serif',
        fontSize: size === 'sm' ? '12px' : size === 'lg' ? '15px' : '13px',
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        padding: size === 'sm' ? '6px 12px' : size === 'lg' ? '12px 22px' : '9px 16px',
        opacity: disabled || isLoading ? 0.6 : 1,
        transition: 'all 0.15s ease',
        ...getStyles(),
        ...style,
      }}
      {...props}
    >
      {isLoading ? 'Processing...' : children}
    </button>
  );
};
