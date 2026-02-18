'use client';
import { motion } from 'framer-motion';
import ArtworkCard from './ArtworkCard';
import type { Artwork } from '@/types/artwork';
import type { Artist } from '@/types/artist';

interface ArtworkGridProps {
  artworks: Artwork[];
  artists?: Artist[];
}

export default function ArtworkGrid({ artworks, artists = [] }: ArtworkGridProps) {
  const getArtistName = (artistId: string): string => {
    const artist = artists.find((a) => a.id === artistId);
    return artist?.name ?? '';
  };

  if (artworks.length === 0) {
    return (
      <div
        style={{
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
            color: '#7a7469',
          }}
        >
          No Artworks Yet
        </div>
        <p style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>
          The collection is being curated.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        columns: '3 300px',
        columnGap: '1.25rem',
        padding: '0',
      }}
    >
      {artworks.map((artwork, index) => (
        <motion.div
          key={artwork.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * 0.05,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ breakInside: 'avoid' }}
        >
          <ArtworkCard artwork={artwork} artistName={getArtistName(artwork.artistId)} />
        </motion.div>
      ))}
    </div>
  );
}
