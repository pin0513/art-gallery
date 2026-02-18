'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { getArtists, createArtist, deleteArtist } from '@/lib/firestore/artists';
import type { Artist, ArtistFormData } from '@/types/artist';

const emptyForm: ArtistFormData = { name: '', bio: '', specialty: [], featured: false };

export default function AdminArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [form, setForm] = useState<ArtistFormData>(emptyForm);
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const avatarRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const fetchArtists = () => getArtists().then(setArtists).catch(() => {});

  useEffect(() => { fetchArtists(); }, []);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'avatar' | 'cover'
  ) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (type === 'avatar') { setAvatarFile(f); setAvatarPreview(ev.target?.result as string); }
      else { setCoverFile(f); setCoverPreview(ev.target?.result as string); }
    };
    reader.readAsDataURL(f);
  };

  const uploadFile = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file);
    return new Promise((resolve, reject) => {
      task.on('state_changed', null, reject, async () => {
        resolve(await getDownloadURL(task.snapshot.ref));
      });
    });
  };

  const addSpecialty = () => {
    const s = specialtyInput.trim();
    if (s && !form.specialty.includes(s)) {
      setForm((f) => ({ ...f, specialty: [...f.specialty, s] }));
    }
    setSpecialtyInput('');
  };

  const removeSpecialty = (s: string) =>
    setForm((f) => ({ ...f, specialty: f.specialty.filter((x) => x !== s) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { setError('Name is required.'); return; }
    setSaving(true); setError(null); setSuccess(false);
    try {
      const ts = Date.now();
      const avatarUrl = avatarFile
        ? await uploadFile(avatarFile, `artists/${ts}-avatar-${avatarFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`)
        : '';
      const coverUrl = coverFile
        ? await uploadFile(coverFile, `artists/${ts}-cover-${coverFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`)
        : '';
      await createArtist({ ...form, avatarUrl, coverUrl });
      setSuccess(true);
      setForm(emptyForm);
      setAvatarFile(null); setAvatarPreview(null);
      setCoverFile(null); setCoverPreview(null);
      setSpecialtyInput('');
      if (avatarRef.current) avatarRef.current.value = '';
      if (coverRef.current) coverRef.current.value = '';
      fetchArtists();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create artist.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this artist?')) return;
    try {
      await deleteArtist(id);
      fetchArtists();
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
            Artists
          </span>
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '3rem', fontWeight: 300, color: '#f0ece3', lineHeight: 1 }}>
          Manage Artists
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
        {/* Add Artist Form */}
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.5rem', fontWeight: 300, color: '#f0ece3', marginBottom: '1.5rem' }}>
            Add Artist
          </h2>

          {success && (
            <div style={{ background: 'rgba(201,184,154,0.1)', border: '1px solid rgba(201,184,154,0.3)', padding: '0.75rem 1rem', marginBottom: '1.5rem', color: '#c9b89a', fontSize: '0.82rem', fontFamily: 'Inter, sans-serif' }}>
              Artist created successfully!
            </div>
          )}
          {error && (
            <div style={{ background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.2)', padding: '0.75rem 1rem', marginBottom: '1.5rem', color: '#ff9090', fontSize: '0.82rem', fontFamily: 'Inter, sans-serif' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={labelStyle}>Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} style={inputStyle} placeholder="Artist name" onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(201,184,154,0.4)'; }} onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)'; }} />
            </div>

            <div>
              <label style={labelStyle}>Bio</label>
              <textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} placeholder="Artist biography..." onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(201,184,154,0.4)'; }} onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(255,255,255,0.08)'; }} />
            </div>

            <div>
              <label style={labelStyle}>Specialty</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <input type="text" value={specialtyInput} onChange={(e) => setSpecialtyInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSpecialty(); } }} style={{ ...inputStyle, flex: 1 }} placeholder="e.g. Oil Painting" onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(201,184,154,0.4)'; }} onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)'; }} />
                <button type="button" onClick={addSpecialty} style={{ padding: '0.75rem 1rem', background: 'none', border: '1px solid rgba(255,255,255,0.08)', color: '#7a7469', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.75rem' }}>Add</button>
              </div>
              {form.specialty.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {form.specialty.map((s) => (
                    <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(201,184,154,0.08)', border: '1px solid rgba(201,184,154,0.2)', padding: '0.2rem 0.5rem', fontSize: '0.7rem', color: '#c9b89a', fontFamily: 'Inter, sans-serif' }}>
                      {s}
                      <button type="button" onClick={() => removeSpecialty(s)} style={{ background: 'none', border: 'none', color: '#7a7469', cursor: 'pointer', padding: 0, lineHeight: 1 }}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label style={labelStyle}>Avatar Image</label>
              <div style={{ border: '1px dashed rgba(255,255,255,0.08)', padding: '1rem', textAlign: 'center', cursor: 'pointer', background: '#0a0a0a' }} onClick={() => avatarRef.current?.click()}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <p style={{ color: '#7a7469', fontSize: '0.78rem', fontFamily: 'Inter, sans-serif' }}>Click to select avatar</p>
                )}
              </div>
              <input ref={avatarRef} type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} style={{ display: 'none' }} />
            </div>

            <div>
              <label style={labelStyle}>Cover Image</label>
              <div style={{ border: '1px dashed rgba(255,255,255,0.08)', padding: '1rem', textAlign: 'center', cursor: 'pointer', background: '#0a0a0a' }} onClick={() => coverRef.current?.click()}>
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover" style={{ maxHeight: '120px', maxWidth: '100%', objectFit: 'cover' }} />
                ) : (
                  <p style={{ color: '#7a7469', fontSize: '0.78rem', fontFamily: 'Inter, sans-serif' }}>Click to select cover</p>
                )}
              </div>
              <input ref={coverRef} type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} style={{ display: 'none' }} />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} style={{ accentColor: '#c9b89a', width: '16px', height: '16px' }} />
              <span style={{ color: '#7a7469', fontSize: '0.82rem', fontFamily: 'Inter, sans-serif' }}>Featured artist</span>
            </label>

            <button
              type="submit"
              disabled={saving}
              style={{ padding: '0.85rem 2rem', background: 'transparent', border: '1px solid rgba(201,184,154,0.4)', color: '#c9b89a', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', opacity: saving ? 0.6 : 1, alignSelf: 'flex-start' }}
            >
              {saving ? 'Creating...' : 'Create Artist'}
            </button>
          </form>
        </div>

        {/* Artists List */}
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.5rem', fontWeight: 300, color: '#f0ece3', marginBottom: '1.5rem' }}>
            All Artists ({artists.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {artists.length === 0 ? (
              <p style={{ color: '#7a7469', fontSize: '0.85rem', fontFamily: 'Inter, sans-serif' }}>No artists yet.</p>
            ) : artists.map((artist) => (
              <div key={artist.id} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', background: '#0a0a0a', flexShrink: 0 }}>
                  {artist.avatarUrl ? (
                    <Image src={artist.avatarUrl} alt={artist.name} fill style={{ objectFit: 'cover' }} />
                  ) : (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9b89a', fontFamily: 'serif', fontSize: '1rem' }}>{artist.name.charAt(0)}</div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#f0ece3', fontSize: '0.9rem', fontFamily: "'Cormorant Garamond', serif", marginBottom: '0.1rem' }}>{artist.name}</p>
                  {artist.specialty && artist.specialty.length > 0 && (
                    <p style={{ color: '#7a7469', fontSize: '0.7rem', fontFamily: 'Inter, sans-serif' }}>{artist.specialty.join(', ')}</p>
                  )}
                </div>
                {artist.featured && (
                  <span style={{ fontSize: '0.6rem', color: '#c9b89a', border: '1px solid rgba(201,184,154,0.2)', padding: '0.15rem 0.4rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>Featured</span>
                )}
                <button
                  onClick={() => handleDelete(artist.id)}
                  style={{ background: 'none', border: '1px solid rgba(255,80,80,0.2)', color: '#ff9090', padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '0.7rem', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
