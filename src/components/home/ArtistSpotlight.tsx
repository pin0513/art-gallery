'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import type { Artist } from '@/types/artist';

interface ArtistSpotlightProps {
  artists: Artist[];
}

export default function ArtistSpotlight({ artists }: ArtistSpotlightProps) {
  if (artists.length === 0) return null;

  return (
    <section
      style={{
        padding: '8rem 2.5rem',
        background: '#0a0a0a',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        {/* Header */}
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
              The Artists
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
            Meet the Creators
          </h2>
        </motion.div>

        {/* Artists Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '2rem',
          }}
        >
          {artists.map((artist, index) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link
                href={`/artists/${artist.id}`}
                style={{ display: 'block', textDecoration: 'none' }}
              >
                <div
                  style={{
                    background: '#111111',
                    border: '1px solid rgba(255,255,255,0.05)',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    textAlign: 'center',
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
                  {/* Avatar */}
                  <div
                    style={{
                      position: 'relative',
                      width: '100px',
                      height: '100px',
                      margin: '2rem auto 1.25rem',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '1px solid rgba(201,184,154,0.2)',
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
                          fontSize: '2rem',
                          color: '#c9b89a',
                          fontWeight: 300,
                        }}
                      >
                        {artist.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: '0 1.5rem 2rem' }}>
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
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center', marginBottom: '0.75rem' }}>
                        {artist.specialty.slice(0, 2).map((s) => (
                          <span
                            key={s}
                            style={{
                              fontSize: '0.65rem',
                              letterSpacing: '0.1em',
                              color: '#c9b89a',
                              textTransform: 'uppercase',
                              fontFamily: 'Inter, sans-serif',
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                    <p
                      style={{
                        fontSize: '0.8rem',
                        color: '#7a7469',
                        lineHeight: 1.6,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical' as const,
                      }}
                    >
                      {artist.bio}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Artists */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ textAlign: 'center', marginTop: '4rem' }}
        >
          <Link
            href="/artists"
            style={{
              display: 'inline-block',
              padding: '0.85rem 3rem',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#7a7469',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontFamily: 'Inter, sans-serif',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(201,184,154,0.3)';
              (e.currentTarget as HTMLAnchorElement).style.color = '#c9b89a';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.08)';
              (e.currentTarget as HTMLAnchorElement).style.color = '#7a7469';
            }}
          >
            View All Artists
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
