'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getArtists } from '@/lib/firestore/artists';
import type { Artist } from '@/types/artist';

export const dynamic = 'force-dynamic';

export default function ArtistsPage() {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArtists()
      .then((list) => setArtist(list[0] ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ background: '#050505', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '1px', height: '60px', background: 'rgba(201,184,154,0.3)', animation: 'pulse 1.5s infinite' }} />
      </div>
    );
  }

  if (!artist) {
    return (
      <div style={{ background: '#050505', minHeight: '100vh', paddingTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#7a7469', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 300 }}>
          No artist yet.
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: '#050505', minHeight: '100vh' }}>
      {/* Hero: Cover 全版 */}
      <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        {artist.coverUrl ? (
          <Image
            src={artist.coverUrl}
            alt={artist.name}
            fill
            priority
            style={{ objectFit: 'cover', opacity: 0.35 }}
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 40%, rgba(201,184,154,0.04) 0%, transparent 70%)' }} />
        )}

        {/* 漸層遮罩 */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(5,5,5,0.3) 0%, rgba(5,5,5,0.1) 40%, rgba(5,5,5,0.8) 80%, #050505 100%)' }} />

        {/* Hero Content */}
        <div
          style={{
            position: 'absolute',
            bottom: '10vh',
            left: 0,
            right: 0,
            padding: '0 clamp(2rem, 6vw, 8rem)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ height: '1px', width: '40px', background: 'rgba(201,184,154,0.5)' }} />
            <span style={{ color: '#c9b89a', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
              The Artist
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(4rem, 10vw, 9rem)',
              fontWeight: 300,
              color: '#f0ece3',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              marginBottom: '1.5rem',
            }}
          >
            {artist.name.split(' ').map((part, i) => (
              <span key={i} style={{ display: 'block' }}>{part}</span>
            ))}
          </h1>

          {artist.specialty && artist.specialty.length > 0 && (
            <p style={{ color: '#c9b89a', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
              {artist.specialty.join(' · ')}
            </p>
          )}
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '3rem', right: 'clamp(2rem, 6vw, 8rem)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '1px', height: '60px', background: 'linear-gradient(to bottom, rgba(201,184,154,0.5), transparent)' }} />
        </div>
      </div>

      {/* Profile Section */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '6rem clamp(2rem, 6vw, 4rem)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'clamp(3rem, 6vw, 8rem)', alignItems: 'start' }}>

          {/* Avatar */}
          <div style={{ position: 'relative', width: 'clamp(120px, 15vw, 180px)', height: 'clamp(120px, 15vw, 180px)', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(201,184,154,0.2)', background: '#111', flexShrink: 0 }}>
            {artist.avatarUrl ? (
              <Image src={artist.avatarUrl} alt={artist.name} fill style={{ objectFit: 'cover' }} />
            ) : (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: '#c9b89a', fontWeight: 300 }}>
                {artist.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Bio */}
          <div>
            <p style={{ color: '#7a7469', fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)', lineHeight: 1.9, fontFamily: 'Inter, sans-serif', marginBottom: '2.5rem', maxWidth: '600px' }}>
              {artist.bio}
            </p>

            {/* Style Tags */}
            {artist.style && artist.style.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {artist.style.map((s) => (
                  <span key={s} style={{ padding: '0.3rem 0.8rem', border: '1px solid rgba(201,184,154,0.2)', color: '#c9b89a', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.04)', margin: '5rem 0' }} />

        {/* Skills Grid */}
        {artist.specialty && artist.specialty.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
              <div style={{ height: '1px', width: '30px', background: 'rgba(201,184,154,0.5)' }} />
              <span style={{ color: '#c9b89a', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
                Expertise
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1px', background: 'rgba(255,255,255,0.04)' }}>
              {artist.specialty.map((s, i) => (
                <div key={i} style={{ background: '#050505', padding: '2rem 1.5rem' }}>
                  <div style={{ width: '30px', height: '1px', background: 'rgba(201,184,154,0.3)', marginBottom: '1.25rem' }} />
                  <p style={{ color: '#f0ece3', fontSize: '0.88rem', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', letterSpacing: '0.02em' }}>
                    {s}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact */}
        {artist.contact && (artist.contact.email || artist.contact.instagram || artist.contact.website) && (
          <>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.04)', margin: '5rem 0' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                <div style={{ height: '1px', width: '30px', background: 'rgba(201,184,154,0.5)' }} />
                <span style={{ color: '#c9b89a', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
                  Contact
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {artist.contact.email && (
                  <a href={`mailto:${artist.contact.email}`} style={{ color: '#7a7469', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif', textDecoration: 'none', letterSpacing: '0.02em', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#c9b89a')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#7a7469')}>
                    ✉ {artist.contact.email}
                  </a>
                )}
                {artist.contact.instagram && (
                  <a href={`https://instagram.com/${artist.contact.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" style={{ color: '#7a7469', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif', textDecoration: 'none', letterSpacing: '0.02em', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#c9b89a')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#7a7469')}>
                    ◈ {artist.contact.instagram}
                  </a>
                )}
                {artist.contact.website && (
                  <a href={artist.contact.website} target="_blank" rel="noreferrer" style={{ color: '#7a7469', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif', textDecoration: 'none', letterSpacing: '0.02em', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#c9b89a')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#7a7469')}>
                    ↗ {artist.contact.website}
                  </a>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
