export const colors = {
  primary: {
    50: '#fdf4f4',
    100: '#fbe8e8',
    500: '#e11d48', // Manga rose/crimson
    600: '#be123c',
    700: '#9f1239',
  },
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  feedback: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  surface: {
    background: '#ffffff',
    subtle: '#f8fafc',
    card: '#ffffff',
    border: '#e2e8f0',
  },
} as const;

export type Colors = typeof colors;
