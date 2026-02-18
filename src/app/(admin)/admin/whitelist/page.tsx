'use client';
import { useState, useEffect } from 'react';
import { getWhitelist, addToWhitelist, removeFromWhitelist } from '@/lib/firestore/whitelist';
import type { AdminUser } from '@/types/admin';

export default function WhitelistPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchAdmins = () => getWhitelist().then(setAdmins).catch(() => {});

  useEffect(() => { fetchAdmins(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim() || !email.trim()) { setError('User ID and email are required.'); return; }
    setLoading(true); setError(null); setSuccess(null);
    try {
      await addToWhitelist(userId.trim(), email.trim());
      setSuccess(`Added ${email} to whitelist.`);
      setUserId(''); setEmail('');
      fetchAdmins();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (uid: string) => {
    if (!confirm('Remove this admin?')) return;
    try {
      await removeFromWhitelist(uid);
      setSuccess('Admin removed.');
      fetchAdmins();
    } catch { /* noop */ }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    background: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#f0ece3',
    fontSize: '0.9rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.7rem',
    letterSpacing: '0.12em',
    color: '#7a7469',
    textTransform: 'uppercase',
    fontFamily: 'Inter, sans-serif',
    marginBottom: '0.5rem',
  };

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
          <div style={{ height: '1px', width: '20px', background: 'rgba(201,184,154,0.5)' }} />
          <span style={{ color: '#c9b89a', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
            Access Control
          </span>
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '3rem', fontWeight: 300, color: '#f0ece3', lineHeight: 1 }}>
          Admin Whitelist
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
        {/* Add Admin Form */}
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.5rem', fontWeight: 300, color: '#f0ece3', marginBottom: '1.5rem' }}>
            Add Admin
          </h2>

          <div
            style={{
              background: 'rgba(201,184,154,0.05)',
              border: '1px solid rgba(201,184,154,0.15)',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              fontSize: '0.8rem',
              color: '#7a7469',
              fontFamily: 'Inter, sans-serif',
              lineHeight: 1.6,
            }}
          >
            To find a user&apos;s UID, have them sign in with Google and check the Firebase console under Authentication.
          </div>

          {success && (
            <div style={{ background: 'rgba(201,184,154,0.1)', border: '1px solid rgba(201,184,154,0.3)', padding: '0.75rem 1rem', marginBottom: '1.5rem', color: '#c9b89a', fontSize: '0.82rem', fontFamily: 'Inter, sans-serif' }}>
              {success}
            </div>
          )}
          {error && (
            <div style={{ background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.2)', padding: '0.75rem 1rem', marginBottom: '1.5rem', color: '#ff9090', fontSize: '0.82rem', fontFamily: 'Inter, sans-serif' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={labelStyle}>Firebase User UID *</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                style={inputStyle}
                placeholder="e.g. abc123xyz..."
                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(201,184,154,0.4)'; }}
                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
              />
            </div>
            <div>
              <label style={labelStyle}>Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                placeholder="admin@example.com"
                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(201,184,154,0.4)'; }}
                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.85rem 2rem',
                background: 'transparent',
                border: '1px solid rgba(201,184,154,0.4)',
                color: '#c9b89a',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif',
                opacity: loading ? 0.6 : 1,
                alignSelf: 'flex-start',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,184,154,0.08)'; }}
              onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              {loading ? 'Adding...' : 'Add Admin'}
            </button>
          </form>
        </div>

        {/* Admin List */}
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.5rem', fontWeight: 300, color: '#f0ece3', marginBottom: '1.5rem' }}>
            Current Admins ({admins.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {admins.length === 0 ? (
              <p style={{ color: '#7a7469', fontSize: '0.85rem', fontFamily: 'Inter, sans-serif' }}>No admins configured.</p>
            ) : (
              admins.map((admin) => (
                <div
                  key={admin.userId}
                  style={{
                    background: '#111',
                    border: '1px solid rgba(255,255,255,0.05)',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <p style={{ color: '#f0ece3', fontSize: '0.88rem', fontFamily: 'Inter, sans-serif', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {admin.email}
                    </p>
                    <p style={{ color: '#7a7469', fontSize: '0.7rem', fontFamily: 'Inter, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {admin.userId}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(admin.userId)}
                    style={{
                      background: 'none',
                      border: '1px solid rgba(255,80,80,0.2)',
                      color: '#ff9090',
                      padding: '0.3rem 0.6rem',
                      cursor: 'pointer',
                      fontSize: '0.7rem',
                      fontFamily: 'Inter, sans-serif',
                      flexShrink: 0,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,80,80,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'none';
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
