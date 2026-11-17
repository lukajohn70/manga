import * as React from 'react';

export const metadata = {
  title: 'Manga — Nigeria’s Online Marketplace | Phones, Fashion, Electronics & More',
  description: 'Shop millions of products from verified sellers across Nigeria. Fast delivery, safe escrow payments, and best deals on Manga.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <style>{`
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 0;
            background-color: #F4F5F7;
            color: #111827;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            -webkit-font-smoothing: antialiased;
          }
          a { text-decoration: none; color: inherit; }
          button { font-family: inherit; }
          input, select, textarea { font-family: inherit; }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
