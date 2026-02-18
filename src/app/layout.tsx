import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://liting-art.com'),
  title: {
    default: 'LITING Art | 立庭藝廊',
    template: '%s | LITING Art',
  },
  description: '探索藝術的深邃之美 — LITING Art 立庭藝廊，精選當代與古典藝術作品的線上藝廊。',
  openGraph: {
    siteName: 'LITING Art',
    locale: 'zh_TW',
    type: 'website',
    title: 'LITING Art | 立庭藝廊',
    description: '探索藝術的深邃之美 — LITING Art 立庭藝廊，精選當代與古典藝術作品的線上藝廊。',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LITING Art | 立庭藝廊',
    description: '探索藝術的深邃之美 — LITING Art 立庭藝廊，精選當代與古典藝術作品的線上藝廊。',
  },
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
