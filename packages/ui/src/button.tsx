import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  /** Scale factor when pressed. Default is 0.95 (5% squish) */
  squishScale?: number;
  /** Enable or disable the squish animation. Default true */
  enableSquish?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  style,
  squishScale = 0.97,
  enableSquish = true,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  onPointerCancel,
  onKeyDown,
  onKeyUp,
  ...props
}) => {
  const [isPressed, setIsPressed] = React.useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!disabled && !isLoading && enableSquish) {
      setIsPressed(true);
    }
    onPointerDown?.(e);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (enableSquish) setIsPressed(false);
    onPointerUp?.(e);
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (enableSquish) setIsPressed(false);
    onPointerLeave?.(e);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (enableSquish) setIsPressed(false);
    onPointerCancel?.(e);
  };

  // Keyboard navigation (Enter / Space) suppresses deformation to avoid input lag
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyUp?.(e);
  };

  const getStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: '#B5532E',
          color: '#FFFFFF',
          border: '1px solid #8F3B1F',
          boxShadow: isPressed
            ? '0 1px 1px rgba(42, 35, 32, 0.04)'
            : '0 1px 2px rgba(42, 35, 32, 0.08)',
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

  // Kinetic spring transition on release, snappy compression on press
  const transformTransition = isPressed
    ? 'transform 0.09s ease-out'
    : 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)';

  return (
    <button
      disabled={disabled || isLoading}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerCancel}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
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
        transform: isPressed ? `scale(${squishScale})` : 'scale(1)',
        transition: `${transformTransition}, background-color 0.15s ease, box-shadow 0.15s ease`,
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        willChange: 'transform',
        ...getStyles(),
        ...style,
      }}
      {...props}
    >
      {isLoading ? 'Processing...' : children}
    </button>
  );
};
