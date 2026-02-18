'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Artwork } from '@/types/artwork';

interface ArtworkCardProps {
  artwork: Artwork;
  artistName?: string;
}

export default function ArtworkCard({ artwork, artistName }: ArtworkCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/gallery/${artwork.id}`}
      style={{
        display: 'block',
        textDecoration: 'none',
        breakInside: 'avoid',
        marginBottom: '1.25rem',
      }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: '#111111',
          border: `1px solid ${hovered ? 'rgba(201,184,154,0.2)' : 'rgba(255,255,255,0.05)'}`,
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
          boxShadow: hovered
            ? '0 24px 60px rgba(0,0,0,0.6), 0 0 40px rgba(201,184,154,0.1)'
            : '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        {/* Image Container */}
        <div style={{ position: 'relative', overflow: 'hidden', background: '#0a0a0a' }}>
          {!imageLoaded && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, #111 25%, #1a1a1a 50%, #111 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                minHeight: '200px',
              }}
            />
          )}
          {artwork.imageUrl ? (
            <Image
              src={artwork.imageUrl}
              alt={artwork.title}
              width={600}
              height={400}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                opacity: imageLoaded ? 1 : 0,
                transition: 'opacity 0.5s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: hovered ? 'scale(1.04)' : 'scale(1)',
              }}
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <div
              style={{
                width: '100%',
                minHeight: '200px',
                background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ color: '#7a7469', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                No Image
              </span>
            </div>
          )}

          {/* Year Badge */}
          <div
            style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              background: 'rgba(5,5,5,0.8)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '0.2rem 0.6rem',
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              color: '#c9b89a',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {artwork.year}
          </div>

          {/* Hover overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(5,5,5,0.8) 0%, transparent 50%)',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          />
        </div>

        {/* Info */}
        <div style={{ padding: '1rem 1.25rem 1.25rem' }}>
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '1.1rem',
              fontWeight: 500,
              color: '#f0ece3',
              marginBottom: '0.3rem',
              lineHeight: 1.3,
              transition: 'color 0.2s',
            }}
          >
            {artwork.title}
          </h3>
          {artistName && (
            <p
              style={{
                fontSize: '0.75rem',
                color: '#7a7469',
                letterSpacing: '0.05em',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {artistName}
            </p>
          )}
          {artwork.tags && artwork.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem' }}>
              {artwork.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: '0.65rem',
                    letterSpacing: '0.08em',
                    color: '#7a7469',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    padding: '0.15rem 0.5rem',
                    textTransform: 'uppercase',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
