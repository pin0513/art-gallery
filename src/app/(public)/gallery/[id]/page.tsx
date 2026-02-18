'use client';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { getArtwork } from '@/lib/firestore/artworks';
import { getArtist } from '@/lib/firestore/artists';

interface ArtworkPageProps {
  params: Promise<{ id: string }>;
}

export default function ArtworkPage({ params }: ArtworkPageProps) {
  const { id } = use(params);
  const [artwork, setArtwork] = useState<import('@/types/artwork').Artwork | null>(null);
  const [artist, setArtist] = useState<import('@/types/artist').Artist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArtwork(id).then(async (art) => {
      if (art) {
        setArtwork(art);
        if (art.artistId) {
          const artistData = await getArtist(art.artistId).catch(() => null);
          setArtist(artistData);
        }
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ background: '#050505', minHeight: '100vh', paddingTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7a7469' }}>Loading...</div>;
  if (!artwork) notFound();

  return (
    <div style={{ background: '#050505', minHeight: '100vh', paddingTop: '80px' }}>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '4rem 2.5rem',
        }}
      >
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link
            href="/gallery"
            style={{ color: '#7a7469', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}
          >
            Gallery
          </Link>
          <span style={{ color: '#7a7469', fontSize: '0.7rem' }}>/</span>
          <span style={{ color: '#c9b89a', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
            {artwork.title}
          </span>
        </nav>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '5rem',
            alignItems: 'start',
          }}
        >
          {/* Image */}
          <div>
            <div
              style={{
                position: 'relative',
                border: '1px solid rgba(255,255,255,0.05)',
                overflow: 'hidden',
                background: '#111',
              }}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            >
              {artwork.imageUrl ? (
                <>
                  <Image
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    width={800}
                    height={1000}
                    draggable={false}
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      pointerEvents: 'none',
                      userSelect: 'none',
                    }}
                  />
                  {/* Watermark overlay */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                      overflow: 'hidden',
                    }}
                  >
                    {Array.from({ length: 20 }).map((_, i) => (
                      <span
                        key={i}
                        style={{
                          position: 'absolute',
                          left: `${(i % 4) * 26 - 5}%`,
                          top: `${Math.floor(i / 4) * 22 - 3}%`,
                          transform: 'rotate(-30deg)',
                          fontSize: '0.55rem',
                          letterSpacing: '0.18em',
                          color: 'rgba(201,184,154,0.1)',
                          fontFamily: 'Inter, sans-serif',
                          textTransform: 'uppercase',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        © {artist?.name ?? 'Liting Art Gallery'}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '4/5',
                    background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#7a7469',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.8rem',
                    letterSpacing: '0.1em',
                  }}
                >
                  No Image Available
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div style={{ position: 'sticky', top: '120px' }}>
            <div style={{ marginBottom: '0.75rem' }}>
              <span
                style={{
                  color: '#c9b89a',
                  fontSize: '0.65rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {artwork.year}
              </span>
            </div>

            <h1
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                fontWeight: 300,
                color: '#f0ece3',
                lineHeight: 1.1,
                marginBottom: '1.5rem',
              }}
            >
              {artwork.title}
            </h1>

            {artist && (
              <Link
                href={`/artist/${artist.id}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  textDecoration: 'none',
                  marginBottom: '2.5rem',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#1a1a1a',
                    border: '1px solid rgba(201,184,154,0.2)',
                    overflow: 'hidden',
                    position: 'relative',
                    flexShrink: 0,
                  }}
                >
                  {artist.avatarUrl ? (
                    <Image src={artist.avatarUrl} alt={artist.name} fill style={{ objectFit: 'cover' }} />
                  ) : (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9b89a', fontFamily: 'serif', fontSize: '0.9rem' }}>
                      {artist.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span style={{ color: '#7a7469', fontSize: '0.85rem', fontFamily: 'Inter, sans-serif', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.color = '#c9b89a'; }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.color = '#7a7469'; }}
                >
                  {artist.name}
                </span>
              </Link>
            )}

            <div
              style={{
                height: '1px',
                background: 'rgba(255,255,255,0.06)',
                marginBottom: '2rem',
              }}
            />

            {artwork.description && (
              <p
                style={{
                  color: '#7a7469',
                  fontSize: '0.92rem',
                  lineHeight: 1.8,
                  marginBottom: '2rem',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {artwork.description}
              </p>
            )}

            {artwork.tags && artwork.tags.length > 0 && (
              <div>
                <p
                  style={{
                    color: '#7a7469',
                    fontSize: '0.65rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    fontFamily: 'Inter, sans-serif',
                    marginBottom: '0.75rem',
                  }}
                >
                  Tags
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {artwork.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '0.7rem',
                        letterSpacing: '0.08em',
                        color: '#7a7469',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        padding: '0.25rem 0.75rem',
                        textTransform: 'uppercase',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}
