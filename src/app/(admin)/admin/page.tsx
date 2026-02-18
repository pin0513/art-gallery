'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getArtworks } from '@/lib/firestore/artworks';
import { getArtists } from '@/lib/firestore/artists';
import { getWhitelist } from '@/lib/firestore/whitelist';

interface Stats {
  artworks: number;
  artists: number;
  admins: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({ artworks: 0, artists: 0, admins: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [artworks, artists, admins] = await Promise.all([
          getArtworks(),
          getArtists(),
          getWhitelist(),
        ]);
        setStats({
          artworks: artworks.length,
          artists: artists.length,
          admins: admins.length,
        });
      } catch {
        // Firebase not configured
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Artworks', value: stats.artworks, href: '/gallery', action: 'View Gallery' },
    { label: 'Artists', value: stats.artists, href: '/artist', action: 'View Artists' },
    { label: 'Admins', value: stats.admins, href: '/admin/whitelist', action: 'Manage' },
  ];

  const quickActions = [
    { href: '/admin/upload', label: 'Upload Artwork', description: 'Add a new artwork to the collection' },
    { href: '/admin/artist', label: 'Manage Artists', description: 'Add, edit, or remove artists' },
    { href: '/admin/whitelist', label: 'Whitelist', description: 'Manage admin access' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '0.75rem',
          }}
        >
          <div style={{ height: '1px', width: '20px', background: 'rgba(201,184,154,0.5)' }} />
          <span
            style={{
              color: '#c9b89a',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Admin
          </span>
        </div>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '3rem',
            fontWeight: 300,
            color: '#f0ece3',
            lineHeight: 1,
            marginBottom: '0.5rem',
          }}
        >
          Dashboard
        </h1>
        <p style={{ color: '#7a7469', fontSize: '0.85rem', fontFamily: 'Inter, sans-serif' }}>
          Welcome back, {user?.displayName ?? user?.email}
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.25rem',
          marginBottom: '3rem',
        }}
      >
        {statCards.map(({ label, value, href, action }) => (
          <div
            key={label}
            style={{
              background: '#111111',
              border: '1px solid rgba(255,255,255,0.06)',
              padding: '1.75rem',
              transition: 'border-color 0.2s',
            }}
          >
            <p
              style={{
                color: '#7a7469',
                fontSize: '0.7rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontFamily: 'Inter, sans-serif',
                marginBottom: '0.75rem',
              }}
            >
              {label}
            </p>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '3rem',
                color: '#f0ece3',
                lineHeight: 1,
                marginBottom: '1rem',
              }}
            >
              {loading ? '—' : value}
            </div>
            <Link
              href={href}
              style={{
                fontSize: '0.7rem',
                color: '#c9b89a',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontFamily: 'Inter, sans-serif',
                textDecoration: 'none',
              }}
            >
              {action} →
            </Link>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '1.5rem',
            fontWeight: 300,
            color: '#f0ece3',
            marginBottom: '1.5rem',
          }}
        >
          Quick Actions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {quickActions.map(({ href, label, description }) => (
            <Link
              key={href}
              href={href}
              style={{
                background: '#111111',
                border: '1px solid rgba(255,255,255,0.06)',
                padding: '1.5rem',
                textDecoration: 'none',
                display: 'block',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(201,184,154,0.2)';
                (e.currentTarget as HTMLAnchorElement).style.background = '#1a1a1a';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.06)';
                (e.currentTarget as HTMLAnchorElement).style.background = '#111111';
              }}
            >
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: '1.2rem',
                  fontWeight: 500,
                  color: '#f0ece3',
                  marginBottom: '0.4rem',
                }}
              >
                {label}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#7a7469', fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>
                {description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
