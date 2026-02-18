'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

const title = 'Art Gallery';
const subtitle = '探索藝術的深邃之美';

export default function HeroSection() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050505',
        overflow: 'hidden',
      }}
    >
      {/* Background gradient orbs */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,184,154,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,184,154,0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Decorative lines */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)',
          transformOrigin: 'center',
        }}
      />

      {/* Main content */}
      <div
        style={{
          textAlign: 'center',
          zIndex: 1,
          padding: '2rem',
          maxWidth: '900px',
        }}
      >
        {/* Pre-title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div style={{ height: '1px', width: '40px', background: 'rgba(201,184,154,0.5)' }} />
          <span
            style={{
              color: '#c9b89a',
              fontSize: '0.7rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
            }}
          >
            A Curated Collection
          </span>
          <div style={{ height: '1px', width: '40px', background: 'rgba(201,184,154,0.5)' }} />
        </motion.div>

        {/* Main Title - Letter by letter animation */}
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(4rem, 10vw, 9rem)',
            fontWeight: 300,
            letterSpacing: '0.05em',
            lineHeight: 1,
            color: '#f0ece3',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '0.02em',
            overflow: 'hidden',
          }}
        >
          {title.split('').map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 60, rotateX: -30 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.4 + i * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                display: 'inline-block',
                transformOrigin: 'bottom center',
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
            fontStyle: 'italic',
            color: '#7a7469',
            fontWeight: 300,
            marginBottom: '3rem',
            letterSpacing: '0.05em',
          }}
        >
          {subtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/gallery"
            style={{
              display: 'inline-block',
              padding: '0.85rem 2.5rem',
              border: '1px solid rgba(201,184,154,0.4)',
              color: '#c9b89a',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(201,184,154,0.1)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(201,184,154,0.7)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(201,184,154,0.4)';
            }}
          >
            Explore Gallery
          </Link>
          <Link
            href="/artists"
            style={{
              display: 'inline-block',
              padding: '0.85rem 2.5rem',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#7a7469',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(201,184,154,0.2)';
              (e.currentTarget as HTMLAnchorElement).style.color = '#c9b89a';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.08)';
              (e.currentTarget as HTMLAnchorElement).style.color = '#7a7469';
            }}
          >
            Meet Artists
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span
          style={{
            color: '#7a7469',
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '1px',
            height: '40px',
            background: 'linear-gradient(to bottom, rgba(201,184,154,0.6), transparent)',
          }}
        />
      </motion.div>
    </section>
  );
}
