'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getArtists } from '@/lib/firestore/artists';

export const dynamic = 'force-dynamic';

export default function ArtistsPage() {
  const [artists, setArtists] = useState<import('@/types/artist').Artist[]>([]);

  useEffect(() => {
    getArtists().then(setArtists).catch(() => {});
  }, []);

  return (
    <div style={{ background: '#050505', minHeight: '100vh', paddingTop: '80px' }}>
      {/* Header */}
      <div
        style={{
          padding: '5rem 2.5rem 4rem',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ height: '1px', width: '30px', background: 'rgba(201,184,154,0.5)' }} />
            <span
              style={{
                color: '#c9b89a',
                fontSize: '0.65rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              The Creators
            </span>
          </div>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(3rem, 6vw, 5rem)',
              fontWeight: 300,
              color: '#f0ece3',
              lineHeight: 1.1,
              marginBottom: '1rem',
            }}
          >
            Artists
          </h1>
          <p style={{ color: '#7a7469', fontSize: '0.9rem', maxWidth: '500px', lineHeight: 1.7 }}>
            {artists.length > 0
              ? `${artists.length} artists in the gallery`
              : 'Artists are being featured. Check back soon.'}
          </p>
        </div>
      </div>

      {/* Artists Grid */}
      <div
        style={{
          maxWidth: '1300px',
          margin: '0 auto',
          padding: '4rem 2.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2rem',
        }}
      >
        {artists.length === 0 ? (
          <div
            style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '6rem 2rem',
              color: '#7a7469',
            }}
          >
            <div
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '2rem',
                marginBottom: '1rem',
              }}
            >
              No Artists Yet
            </div>
            <p style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>
              The roster is being assembled.
            </p>
          </div>
        ) : (
          artists.map((artist) => (
            <Link
              key={artist.id}
              href={`/artists/${artist.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  background: '#111111',
                  border: '1px solid rgba(255,255,255,0.05)',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,184,154,0.15)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 50px rgba(0,0,0,0.4)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.05)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}
              >
                {/* Cover Image */}
                {artist.coverUrl && (
                  <div style={{ position: 'relative', height: '160px', overflow: 'hidden', background: '#0a0a0a' }}>
                    <Image
                      src={artist.coverUrl}
                      alt={`${artist.name} cover`}
                      fill
                      style={{ objectFit: 'cover', opacity: 0.7 }}
                    />
                  </div>
                )}

                <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                  {/* Avatar */}
                  <div
                    style={{
                      position: 'relative',
                      width: '80px',
                      height: '80px',
                      margin: artist.coverUrl ? '-2.5rem auto 1rem' : '0 auto 1rem',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '2px solid #111111',
                      outline: '1px solid rgba(201,184,154,0.2)',
                      background: '#0a0a0a',
                    }}
                  >
                    {artist.avatarUrl ? (
                      <Image
                        src={artist.avatarUrl}
                        alt={artist.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: '1.5rem',
                          color: '#c9b89a',
                        }}
                      >
                        {artist.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: '1.3rem',
                      fontWeight: 500,
                      color: '#f0ece3',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {artist.name}
                  </h3>

                  {artist.specialty && artist.specialty.length > 0 && (
                    <p
                      style={{
                        fontSize: '0.7rem',
                        color: '#c9b89a',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        fontFamily: 'Inter, sans-serif',
                        marginBottom: '0.75rem',
                      }}
                    >
                      {artist.specialty.slice(0, 2).join(' · ')}
                    </p>
                  )}

                  <p
                    style={{
                      fontSize: '0.8rem',
                      color: '#7a7469',
                      lineHeight: 1.6,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical' as const,
                    }}
                  >
                    {artist.bio}
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
