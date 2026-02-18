import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LITING Art | 藝廊',
  description: '探索藝術的深邃之美 — LITING Art, a curated collection of contemporary and classical artworks',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body style={{ background: '#050505', color: '#f0ece3' }}>
        {children}
      </body>
    </html>
  );
}
