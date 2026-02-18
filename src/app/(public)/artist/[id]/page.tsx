import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArtist } from '@/lib/firestore/artists';
import { getArtworksByArtist } from '@/lib/firestore/artworks';
import ArtworkGrid from '@/components/gallery/ArtworkGrid';

interface ArtistPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ArtistPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const artist = await getArtist(id);
    if (!artist) return {};
    const description = artist.bio
      ? artist.bio.slice(0, 160)
      : `探索 ${artist.name} 的藝術作品 — LITING Art 立庭藝廊`;
    return {
      title: artist.name,
      description,
      openGraph: {
        title: `${artist.name} | LITING Art`,
        description,
        type: 'profile',
        url: `/artist/${id}`,
        images: artist.avatarUrl ? [{ url: artist.avatarUrl, alt: artist.name }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${artist.name} | LITING Art`,
        description,
        images: artist.avatarUrl ? [artist.avatarUrl] : [],
      },
    };
  } catch {
    return {};
  }
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { id } = await params;

  let artist = null;
  let artworks = [];

  try {
    artist = await getArtist(id);
    if (!artist) notFound();
    artworks = await getArtworksByArtist(id);
  } catch {
    notFound();
  }

  if (!artist) notFound();

  return (
    <div style={{ background: '#050505', minHeight: '100vh', paddingTop: '80px' }}>
      {/* Artist Hero */}
      <div style={{ position: 'relative' }}>
        {/* Cover */}
        {artist.coverUrl && (
          <div
            style={{
              position: 'relative',
              height: '400px',
              overflow: 'hidden',
              background: '#0a0a0a',
            }}
          >
            <Image
              src={artist.coverUrl}
              alt={`${artist.name} cover`}
              fill
              style={{ objectFit: 'cover', opacity: 0.4 }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, transparent 0%, #050505 100%)',
              }}
            />
          </div>
        )}

        {/* Artist Info */}
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: artist.coverUrl ? '0 2.5rem 4rem' : '5rem 2.5rem 4rem',
            position: artist.coverUrl ? 'relative' : 'static',
            marginTop: artist.coverUrl ? '-120px' : 0,
          }}
        >
          {/* Breadcrumb */}
          <nav style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              href="/artist"
              style={{
                color: '#7a7469',
                fontSize: '0.78rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Artists
            </Link>
            <span style={{ color: '#7a7469', fontSize: '0.7rem' }}>/</span>
            <span style={{ color: '#c9b89a', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
              {artist.name}
            </span>
          </nav>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div
              style={{
                position: 'relative',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid rgba(201,184,154,0.3)',
                background: '#111',
                flexShrink: 0,
              }}
            >
              {artist.avatarUrl ? (
                <Image src={artist.avatarUrl} alt={artist.name} fill style={{ objectFit: 'cover' }} />
              ) : (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '3rem',
                    color: '#c9b89a',
                    fontWeight: 300,
                  }}
                >
                  {artist.name.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  fontWeight: 300,
                  color: '#f0ece3',
                  lineHeight: 1.1,
                  marginBottom: '0.5rem',
                }}
              >
                {artist.name}
              </h1>
              {artist.specialty && artist.specialty.length > 0 && (
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: '#c9b89a',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {artist.specialty.join(' · ')}
                </p>
              )}
            </div>
          </div>

          {/* Bio */}
          {artist.bio && (
            <div
              style={{
                maxWidth: '700px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                paddingTop: '2rem',
              }}
            >
              <p
                style={{
                  color: '#7a7469',
                  fontSize: '0.95rem',
                  lineHeight: 1.8,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {artist.bio}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Artworks Section */}
      <div
        style={{
          maxWidth: '1300px',
          margin: '0 auto',
          padding: '2rem 2.5rem 5rem',
        }}
      >
        {artworks.length > 0 && (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '3rem',
                borderTop: '1px solid rgba(255,255,255,0.04)',
                paddingTop: '3rem',
              }}
            >
              <div style={{ height: '1px', width: '30px', background: 'rgba(201,184,154,0.5)' }} />
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: '1.5rem',
                  fontWeight: 300,
                  color: '#f0ece3',
                }}
              >
                Works ({artworks.length})
              </h2>
            </div>
            <ArtworkGrid artworks={artworks} />
          </>
        )}
      </div>
    </div>
  );
}
