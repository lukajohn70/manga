export const typography = {
  fontFamily: {
    display: 'Fraunces, Georgia, "Times New Roman", serif',
    sans: 'Inter, "Source Sans 3", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  fontSize: {
    overline: '0.75rem',  // 12px
    caption: '0.8125rem', // 13px
    bodySm: '0.875rem',   // 14px
    body: '0.9375rem',    // 15px
    bodyLg: '1.0625rem',  // 17px
    h3: '1.125rem',       // 18px
    h2: '1.375rem',       // 22px
    h1: '1.75rem',        // 28px
    displayL: '2rem',     // 32px
    displayXl: '2.5rem',  // 40px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
  },
  lineHeight: {
    tight: '1.2',
    normal: '1.5',
    relaxed: '1.65',
  },
} as const;

export type Typography = typeof typography;
