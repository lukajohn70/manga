import * as React from 'react';
import './globals.css';
import { StoreProvider } from '../context/StoreContext';

export const metadata = {
  title: 'MANGA MARKETSQUARE — Authentic Multi-Category Commerce | Verified Sellers',
  description: 'Shop genuine smartphones, laptops, audio, fashion, and home goods from verified sellers. Same-day delivery available for orders within Kaduna.',
  icons: {
    icon: '/images/symbol.svg',
    shortcut: '/images/symbol.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js" async></script>
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-[#FAF6F0] text-[#2A2320]">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
