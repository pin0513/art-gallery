'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { signInWithGoogle, signOutUser } from '@/lib/auth';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkStyle: React.CSSProperties = {
    color: '#7a7469',
    textDecoration: 'none',
    fontSize: '0.78rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    transition: 'color 0.2s ease',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
  };

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: '1.25rem 2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled ? 'rgba(5,5,5,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '1.25rem',
            fontWeight: 600,
            letterSpacing: '0.2em',
            color: '#f0ece3',
            textDecoration: 'none',
            textTransform: 'uppercase',
          }}
        >
          LITING Art
        </Link>

        {/* Desktop Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '2.5rem',
            alignItems: 'center',
          }}
          className="hidden-mobile"
        >
          <Link href="/gallery" style={navLinkStyle} className="nav-link">
            Gallery
          </Link>
          <Link href="/artist" style={navLinkStyle} className="nav-link">
            Artists
          </Link>

          {user ? (
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              {isAdmin && (
                <Link
                  href="/admin"
                  style={{ ...navLinkStyle, color: '#c9b89a' }}
                >
                  Admin
                </Link>
              )}
              <button
                onClick={signOutUser}
                style={{
                  color: '#7a7469',
                  background: 'none',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '0.4rem 1.2rem',
                  cursor: 'pointer',
                  fontSize: '0.72rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,184,154,0.3)';
                  (e.currentTarget as HTMLButtonElement).style.color = '#c9b89a';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)';
                  (e.currentTarget as HTMLButtonElement).style.color = '#7a7469';
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              style={{
                color: '#c9b89a',
                background: 'none',
                border: '1px solid rgba(201,184,154,0.25)',
                padding: '0.4rem 1.2rem',
                cursor: 'pointer',
                fontSize: '0.72rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,184,154,0.08)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,184,154,0.5)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'none';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,184,154,0.25)';
              }}
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: '#f0ece3',
            cursor: 'pointer',
            display: 'none',
            padding: '0.25rem',
          }}
          className="show-mobile"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            zIndex: 49,
            background: 'rgba(5,5,5,0.98)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <Link href="/gallery" style={navLinkStyle} onClick={() => setMenuOpen(false)}>Gallery</Link>
          <Link href="/artist" style={navLinkStyle} onClick={() => setMenuOpen(false)}>Artists</Link>
          {user && isAdmin && (
            <Link href="/admin" style={{ ...navLinkStyle, color: '#c9b89a' }} onClick={() => setMenuOpen(false)}>Admin</Link>
          )}
          {user ? (
            <button onClick={() => { signOutUser(); setMenuOpen(false); }} style={{ ...navLinkStyle, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              Sign Out
            </button>
          ) : (
            <button onClick={() => { signInWithGoogle(); setMenuOpen(false); }} style={{ ...navLinkStyle, color: '#c9b89a', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              Sign In
            </button>
          )}
        </div>
      )}

      <style>{`
        .nav-link:hover { color: #c9b89a !important; }
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}
