import * as React from 'react';

export interface SuccessCheckmarkProps {
  /** Diameter of the icon in pixels. Default 56 */
  size?: number;
  /** Primary stroke color. Default '#4F6B3A' (Savanna Green) */
  color?: string;
  /** Stroke width in SVG units. Default 3.5 */
  strokeWidth?: number;
  /** Callback fired when the checkmark animation sequence finishes */
  onComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const SuccessCheckmark: React.FC<SuccessCheckmarkProps> = ({
  size = 56,
  color = '#4F6B3A',
  strokeWidth = 3.5,
  onComplete,
  className,
  style,
}) => {
  const [animationKey, setAnimationKey] = React.useState(0);

  React.useEffect(() => {
    if (onComplete) {
      // Circle (350ms) + Tick delay (220ms) + Tick duration (260ms) = ~480-500ms
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }
  }, [animationKey, onComplete]);

  // Restart animation if clicked
  const restart = () => {
    setAnimationKey((k) => k + 1);
  };

  return (
    <div
      key={animationKey}
      onClick={restart}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${size}px`,
        height: `${size}px`,
        cursor: 'pointer',
        animation: 'scm-pop 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        transformOrigin: 'center center',
        ...style,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 52 52"
        fill="none"
        style={{ overflow: 'visible' }}
      >
        <style>{`
          @keyframes scm-circle {
            0% {
              stroke-dashoffset: 151;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }
          @keyframes scm-tick {
            0% {
              stroke-dashoffset: 40;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }
          @keyframes scm-pop {
            0% {
              transform: scale(0.85);
            }
            65% {
              transform: scale(1.06);
            }
            100% {
              transform: scale(1);
            }
          }
        `}</style>

        {/* Phase 1: Circle boundary draws first (0 -> 350ms) */}
        <circle
          cx="26"
          cy="26"
          r="24"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray="151"
          strokeDashoffset="151"
          style={{
            animation: 'scm-circle 0.35s cubic-bezier(0.65, 0, 0.45, 1) forwards',
          }}
        />

        {/* Phase 2: Check tick draws with slight overlap starting at 220ms */}
        <path
          d="M15 27 L23 35 L37 19"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="40"
          strokeDashoffset="40"
          style={{
            animation: 'scm-tick 0.26s cubic-bezier(0.65, 0, 0.45, 1) 0.22s forwards',
          }}
        />
      </svg>
    </div>
  );
};
