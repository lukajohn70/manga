/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        manga: {
          terracotta: '#B5532E',
          laterite: '#8F3B1F',
          iron: '#2A2320',
          ochre: '#D9A441',
          clay: '#F6EDE0',
          paper: '#FFFFFF',
          sand: '#E7D5BC',
          ash: '#8C8279',
          savanna: '#4F6B3A',
          slate: '#3E5C76',
          ember: '#B3261E',
          primary: '#B5532E',
          primaryDeep: '#8F3B1F',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(42, 35, 32, 0.05)',
      },
    },
  },
  plugins: [],
};
