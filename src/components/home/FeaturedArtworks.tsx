'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import type { Artwork } from '@/types/artwork';

interface FeaturedArtworksProps {
  artworks: Artwork[];
}

export default function FeaturedArtworks({ artworks }: FeaturedArtworksProps) {
  if (artworks.length === 0) {
    return null;
  }

  return (
    <section
      style={{
        padding: '8rem 2.5rem',
        background: '#050505',
      }}
    >
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '4rem' }}
        >
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
              Featured Works
            </span>
          </div>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 300,
              color: '#f0ece3',
              letterSpacing: '0.02em',
              lineHeight: 1.1,
            }}
          >
            Selected Collection
          </h2>
        </motion.div>

        {/* Artwork Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {artworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <FeaturedCard artwork={artwork} />
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ textAlign: 'center', marginTop: '4rem' }}
        >
          <Link
            href="/gallery"
            style={{
              display: 'inline-block',
              padding: '0.85rem 3rem',
              border: '1px solid rgba(201,184,154,0.3)',
              color: '#c9b89a',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontFamily: 'Inter, sans-serif',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(201,184,154,0.08)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(201,184,154,0.6)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(201,184,154,0.3)';
            }}
          >
            View Full Gallery
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function FeaturedCard({ artwork }: { artwork: Artwork }) {
  return (
    <Link
      href={`/gallery/${artwork.id}`}
      style={{ display: 'block', textDecoration: 'none' }}
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
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(201,184,154,0.08)';
          (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,184,154,0.15)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
          (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.05)';
        }}
      >
        <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#0a0a0a' }}>
          {artwork.imageUrl ? (
            <Image
              src={artwork.imageUrl}
              alt={artwork.title}
              fill
              style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
            />
          ) : (
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)' }} />
          )}
        </div>
        <div style={{ padding: '1.25rem' }}>
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '1.15rem',
              fontWeight: 500,
              color: '#f0ece3',
              marginBottom: '0.25rem',
            }}
          >
            {artwork.title}
          </h3>
          <span
            style={{
              fontSize: '0.72rem',
              color: '#7a7469',
              letterSpacing: '0.05em',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {artwork.year}
          </span>
        </div>
      </div>
    </Link>
  );
}
