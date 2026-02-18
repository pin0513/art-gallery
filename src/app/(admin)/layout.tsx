'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { signOutUser } from '@/lib/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && !isAdmin) {
      router.push('/');
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#050505',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '1.5rem',
            color: '#7a7469',
            letterSpacing: '0.1em',
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  const navItemStyle: React.CSSProperties = {
    color: '#7a7469',
    textDecoration: 'none',
    fontSize: '0.78rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    fontFamily: 'Inter, sans-serif',
    padding: '0.5rem 0',
    display: 'block',
    borderBottom: '1px solid transparent',
    transition: 'all 0.2s ease',
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#050505' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '220px',
          background: '#0a0a0a',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 40,
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '1rem',
            letterSpacing: '0.2em',
            color: '#f0ece3',
            textDecoration: 'none',
            textTransform: 'uppercase',
            marginBottom: '2rem',
            display: 'block',
          }}
        >
          Art Gallery
        </Link>

        <div
          style={{
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            color: '#c9b89a',
            textTransform: 'uppercase',
            fontFamily: 'Inter, sans-serif',
            marginBottom: '1rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          Admin Panel
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {[
            { href: '/admin', label: 'Dashboard' },
            { href: '/admin/upload', label: 'Upload Artwork' },
            { href: '/admin/artworks', label: 'Manage Artworks' },
            { href: '/admin/artist', label: 'Manage Artists' },
            { href: '/admin/whitelist', label: 'Whitelist' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={navItemStyle}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = '#c9b89a';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = '#7a7469';
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.05)',
            paddingTop: '1.5rem',
          }}
        >
          <p
            style={{
              fontSize: '0.72rem',
              color: '#7a7469',
              marginBottom: '0.75rem',
              fontFamily: 'Inter, sans-serif',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {user.email}
          </p>
          <button
            onClick={signOutUser}
            style={{
              background: 'none',
              border: '1px solid rgba(255,255,255,0.06)',
              color: '#7a7469',
              padding: '0.4rem 0.75rem',
              cursor: 'pointer',
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontFamily: 'Inter, sans-serif',
              width: '100%',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,184,154,0.3)';
              (e.currentTarget as HTMLButtonElement).style.color = '#c9b89a';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.06)';
              (e.currentTarget as HTMLButtonElement).style.color = '#7a7469';
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: '220px', padding: '3rem 3rem', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
}
