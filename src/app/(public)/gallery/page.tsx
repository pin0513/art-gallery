import type { Metadata } from 'next';
import ArtworkGrid from '@/components/gallery/ArtworkGrid';
import { getArtworks } from '@/lib/firestore/artworks';
import { getArtists } from '@/lib/firestore/artists';

export const metadata: Metadata = {
  title: '藝廊典藏',
  description: '瀏覽 LITING Art 立庭藝廊的完整典藏作品，涵蓋當代與古典各風格藝術創作。',
  openGraph: {
    title: '藝廊典藏 | LITING Art',
    description: '瀏覽 LITING Art 立庭藝廊的完整典藏作品，涵蓋當代與古典各風格藝術創作。',
    type: 'website',
    url: '/gallery',
  },
};

export default async function GalleryPage() {
  let artworks: import('@/types/artwork').Artwork[] = [];
  let artists: import('@/types/artist').Artist[] = [];

  try {
    [artworks, artists] = await Promise.all([getArtworks(), getArtists()]);
  } catch {
    // Firebase not configured yet
  }

  return (
    <div style={{ background: '#050505', minHeight: '100vh', paddingTop: '80px' }}>
      {/* Page Header */}
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
              The Collection
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
            Gallery
          </h1>
          <p
            style={{
              color: '#7a7469',
              fontSize: '0.9rem',
              maxWidth: '500px',
              lineHeight: 1.7,
            }}
          >
            {artworks.length > 0
              ? `${artworks.length} works in the collection`
              : 'The collection is being curated. Check back soon.'}
          </p>
        </div>
      </div>

      {/* Artworks Grid */}
      <div
        style={{
          maxWidth: '1300px',
          margin: '0 auto',
          padding: '4rem 2.5rem',
        }}
      >
        <ArtworkGrid artworks={artworks} artists={artists} />
      </div>
    </div>
  );
}
