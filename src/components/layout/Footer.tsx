'use client';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: '#050505',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '3rem 2.5rem',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          alignItems: 'start',
        }}
      >
        {/* Brand */}
        <div>
          <Link
            href="/"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '1.1rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              color: '#f0ece3',
              textDecoration: 'none',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '0.75rem',
            }}
          >
            Art Gallery
          </Link>
          <p style={{ color: '#7a7469', fontSize: '0.8rem', lineHeight: 1.7, maxWidth: '220px' }}>
            探索藝術的深邃之美，發現當代與古典藝術的精髓。
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4
            style={{
              color: '#c9b89a',
              fontSize: '0.7rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
            }}
          >
            Explore
          </h4>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[
              { href: '/gallery', label: 'Gallery' },
              { href: '/artists', label: 'Artists' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  color: '#7a7469',
                  textDecoration: 'none',
                  fontSize: '0.82rem',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => { (e.target as HTMLAnchorElement).style.color = '#c9b89a'; }}
                onMouseLeave={(e) => { (e.target as HTMLAnchorElement).style.color = '#7a7469'; }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Copyright */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
          <p style={{ color: '#7a7469', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
            &copy; {currentYear} Art Gallery. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
