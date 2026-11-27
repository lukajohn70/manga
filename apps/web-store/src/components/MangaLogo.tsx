import * as React from 'react';

interface MangaLogoProps {
  variant?: 'light' | 'dark' | 'auto';
  height?: number;
  className?: string;
}

export const MangaLogo: React.FC<MangaLogoProps> = ({
  variant = 'auto',
  height = 36,
  className = '',
}) => {
  const isWhite = variant === 'light';
  const width = Math.round((height / 36) * 175);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 175 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <defs>
        <linearGradient id={`mGradClay_${variant}_store`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B5532E" />
          <stop offset="100%" stopColor="#8F3B1F" />
        </linearGradient>
      </defs>

      {/* Modern Geometric Monogram Icon (M Glyph) */}
      <g transform="translate(0, 2) scale(0.66667)">
        <rect width="48" height="48" rx="12" fill={`url(#mGradClay_${variant}_store)`} />
        {/* Dynamic M Glyph */}
        <path d="M11 34V14h6.5l6.5 10.5L30.5 14H37v20h-5.5V22l-6.5 9h-2l-6.5-9v12H11z" fill="#FFFFFF" />
        {/* Pulse Accent Dot */}
        <circle cx="36" cy="13" r="3" fill="#D9A441" />
      </g>

      {/* Brand Wordmark */}
      <text
        x="40"
        y="21"
        fontFamily="Fraunces, Georgia, serif"
        fontWeight="900"
        fontSize="20"
        fill={isWhite ? '#FFFFFF' : '#1D1917'}
        letterSpacing="1.5"
      >
        MANGA
      </text>

      {/* Micro Subtitle: MARKETSQUARE */}
      <text
        x="41"
        y="30"
        fontFamily="Urbanist, sans-serif"
        fontWeight="800"
        fontSize="5.8"
        fill={isWhite ? '#FFFFFF' : '#B5532E'}
        letterSpacing="2"
      >
        MARKETSQUARE
      </text>
    </svg>
  );
};
