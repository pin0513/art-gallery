'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { signInWithGoogle } from '@/lib/auth';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/admin');
    }
  }, [user, loading, router]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push('/admin');
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#050505',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: '#111111',
          border: '1px solid rgba(255,255,255,0.06)',
          padding: '4rem',
          width: '100%',
          maxWidth: '420px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '0.9rem',
            letterSpacing: '0.3em',
            color: '#c9b89a',
            textTransform: 'uppercase',
            marginBottom: '2rem',
          }}
        >
          Art Gallery
        </div>

        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '2.5rem',
            fontWeight: 300,
            color: '#f0ece3',
            marginBottom: '0.75rem',
            lineHeight: 1.1,
          }}
        >
          Admin Access
        </h1>
        <p
          style={{
            color: '#7a7469',
            fontSize: '0.85rem',
            marginBottom: '3rem',
            lineHeight: 1.6,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Sign in with your Google account to manage the gallery.
        </p>

        <div
          style={{
            height: '1px',
            background: 'rgba(255,255,255,0.06)',
            marginBottom: '3rem',
          }}
        />

        <button
          onClick={handleSignIn}
          style={{
            width: '100%',
            padding: '1rem',
            background: 'transparent',
            border: '1px solid rgba(201,184,154,0.3)',
            color: '#c9b89a',
            fontSize: '0.8rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,184,154,0.08)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,184,154,0.6)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,184,154,0.3)';
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
      </motion.div>
    </div>
  );
}
