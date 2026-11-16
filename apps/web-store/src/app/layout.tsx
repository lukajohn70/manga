import * as React from 'react';

export const metadata = {
  title: 'Manga Storefront',
  description: 'Manga Marketplace Buyer App & PWA',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>{children}</body>
    </html>
  );
}
