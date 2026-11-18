import * as React from 'react';

export interface PullToRefreshProps {
  children: React.ReactNode;
  /** Async callback executed when pulled beyond threshold */
  onRefresh: () => Promise<void> | void;
  /** Distance in px required to trigger refresh. Default 65 */
  threshold?: number;
  /** Maximum distance the list can visually be pulled down. Default 120 */
  maxPull?: number;
  /** Resistance coefficient (finger moves 100%, list moves 35%). Default 0.35 */
  resistance?: number;
  /** Enable dragging with mouse for desktop testing. Default true */
  enableMouseDrag?: boolean;
  /** Custom indicator renderer */
  indicator?: (props: {
    pullProgress: number;
    isRefreshing: boolean;
    thresholdReached: boolean;
    distance: number;
  }) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  threshold = 65,
  maxPull = 120,
  resistance = 0.35,
  enableMouseDrag = true,
  indicator,
  className,
  style,
}) => {
  const [pullDistance, setPullDistance] = React.useState(0);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const startYRef = React.useRef(0);
  const activeDragRef = React.useRef(false);
  const reachedThresholdRef = React.useRef(false);

  // Compute pull progress 0 -> 1+
  const pullProgress = Math.min(1.5, pullDistance / threshold);
  const thresholdReached = pullDistance >= threshold;

  const handleStart = (clientY: number) => {
    if (isRefreshing) return;

    // Check if element or window is at top
    const container = containerRef.current;
    const isAtTop = !container || container.scrollTop <= 0;
    const isWindowAtTop = typeof window !== 'undefined' ? window.scrollY <= 0 : true;

    if (isAtTop && isWindowAtTop) {
      startYRef.current = clientY;
      activeDragRef.current = true;
      reachedThresholdRef.current = false;
      setIsDragging(true);
    }
  };

  const handleMove = (clientY: number) => {
    if (!activeDragRef.current || isRefreshing) return;

    const rawDelta = clientY - startYRef.current;
    if (rawDelta <= 0) {
      setPullDistance(0);
      return;
    }

    // Exact 35% physical resistance with asymptotic dampening curve
    // d = maxPull * (1 - exp(- (rawDelta * resistance) / maxPull))
    const dampedDistance = maxPull * (1 - Math.exp(-(rawDelta * resistance) / maxPull));
    setPullDistance(dampedDistance);

    // Light tactile haptic feedback when crossing threshold
    if (dampedDistance >= threshold && !reachedThresholdRef.current) {
      reachedThresholdRef.current = true;
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate?.(10);
        } catch {
          // ignore
        }
      }
    } else if (dampedDistance < threshold && reachedThresholdRef.current) {
      reachedThresholdRef.current = false;
    }
  };

  const handleEnd = async () => {
    if (!activeDragRef.current) return;
    activeDragRef.current = false;
    setIsDragging(false);

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      // Snap to comfortable loading height (e.g. 52px)
      setPullDistance(52);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
        reachedThresholdRef.current = false;
      }
    } else {
      // Spring back to 0 immediately if threshold wasn't met
      setPullDistance(0);
      reachedThresholdRef.current = false;
    }
  };

  // Touch event handlers
  const onTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientY);
  const onTouchMove = (e: React.TouchEvent) => {
    if (activeDragRef.current && e.cancelable && pullDistance > 0) {
      e.preventDefault();
    }
    handleMove(e.touches[0].clientY);
  };
  const onTouchEnd = () => handleEnd();

  // Pointer event handlers (allows desktop click-and-drag testing)
  const onPointerDown = (e: React.PointerEvent) => {
    if (!enableMouseDrag || e.pointerType === 'touch') return;
    handleStart(e.clientY);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!enableMouseDrag || e.pointerType === 'touch') return;
    handleMove(e.clientY);
  };
  const onPointerUp = () => {
    if (!enableMouseDrag) return;
    handleEnd();
  };

  return (
    <div
      ref={containerRef}
      className={className}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        position: 'relative',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        touchAction: pullDistance > 0 ? 'none' : 'pan-y',
        userSelect: isDragging ? 'none' : 'auto',
        ...style,
      }}
    >
      {/* Pull Indicator Area */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: `${pullDistance}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        {indicator ? (
          indicator({ pullProgress, isRefreshing, thresholdReached, distance: pullDistance })
        ) : (
          <div
            style={{
              opacity: Math.min(1, pullDistance / (threshold * 0.5)),
              transform: `scale(${Math.min(1, 0.6 + pullProgress * 0.4)})`,
              transition: isDragging ? 'none' : 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(42, 35, 32, 0.12)',
              color: thresholdReached || isRefreshing ? '#B5532E' : '#8C8279',
            }}
          >
            {isRefreshing ? (
              <svg
                style={{
                  width: '20px',
                  height: '20px',
                  animation: 'ptr-spin 0.8s linear infinite',
                }}
                viewBox="0 0 24 24"
                fill="none"
              >
                <style>{`@keyframes ptr-spin { 100% { transform: rotate(360deg); } }`}</style>
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeOpacity="0.25"
                />
                <path
                  d="M12 3a9 9 0 0 1 9 9"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                style={{
                  width: '18px',
                  height: '18px',
                  transform: `rotate(${Math.min(180, pullProgress * 180)}deg)`,
                  transition: 'transform 0.15s ease-out',
                }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
            )}
          </div>
        )}
      </div>

      {/* Movable Content Area */}
      <div
        style={{
          transform: `translate3d(0, ${pullDistance}px, 0)`,
          transition: isDragging
            ? 'none'
            : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
};
