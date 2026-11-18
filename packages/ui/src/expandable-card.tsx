import * as React from 'react';

export interface ExpandableCardProps {
  /** Summary view shown when collapsed */
  trigger: (props: { isExpanded: boolean; open: () => void }) => React.ReactNode;
  /** Detailed content shown when expanded */
  children: (props: { close: () => void }) => React.ReactNode;
  /** Duration of expansion and collapse in ms. Default 350 */
  durationMs?: number;
  /** Custom easing function. Default cubic-bezier(0.16, 1, 0.3, 1) */
  easing?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ExpandableCard: React.FC<ExpandableCardProps> = ({
  trigger,
  children,
  durationMs = 350,
  easing = 'cubic-bezier(0.16, 1, 0.3, 1)',
  className,
  style,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [rect, setRect] = React.useState<DOMRect | null>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  const open = () => {
    if (triggerRef.current) {
      setRect(triggerRef.current.getBoundingClientRect());
    }
    setIsExpanded(true);
    setIsAnimating(true);
    // Request animation frame to kick off transition
    requestAnimationFrame(() => {
      setIsAnimating(false);
    });
  };

  const close = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsExpanded(false);
      setIsAnimating(false);
    }, durationMs);
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        close();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  return (
    <>
      {/* Collapsed Trigger Card */}
      <div
        ref={triggerRef}
        onClick={open}
        className={className}
        style={{
          cursor: 'pointer',
          willChange: 'transform, opacity',
          ...style,
        }}
      >
        {trigger({ isExpanded, open })}
      </div>

      {/* Expanded Modal Overlay with 350ms Ease-Out */}
      {isExpanded && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            pointerEvents: 'auto',
          }}
        >
          {/* Backdrop Fade */}
          <div
            onClick={close}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(26, 21, 18, 0.65)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              opacity: isAnimating ? 0 : 1,
              transition: `opacity ${durationMs}ms ${easing}`,
            }}
          />

          {/* Modal Container: Starts fast, slows down with 350ms Ease-Out */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '640px',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              boxShadow: '0 25px 50px -12px rgba(42, 35, 32, 0.25)',
              transform: isAnimating ? 'scale(0.88) translateY(24px)' : 'scale(1) translateY(0)',
              opacity: isAnimating ? 0 : 1,
              transition: `transform ${durationMs}ms ${easing}, opacity ${durationMs}ms ${easing}`,
              willChange: 'transform, opacity',
            }}
          >
            {children({ close })}
          </div>
        </div>
      )}
    </>
  );
};
