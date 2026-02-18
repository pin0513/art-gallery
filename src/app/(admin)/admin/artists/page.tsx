'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { getArtists, createArtist, updateArtist, deleteArtist } from '@/lib/firestore/artists';
import type { Artist, ArtistFormData } from '@/types/artist';

const emptyForm: ArtistFormData = {
  name: '', bio: '', specialty: [], style: [],
  contact: { email: '', instagram: '', website: '' },
  featured: false,
};

export default function AdminArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ArtistFormData>(emptyForm);
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [styleInput, setStyleInput] = useState('');
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

  const startEdit = (artist: Artist) => {
    setEditingId(artist.id);
    setForm({
      name: artist.name,
      bio: artist.bio,
      specialty: artist.specialty ?? [],
      style: artist.style ?? [],
      contact: artist.contact ?? { email: '', instagram: '', website: '' },
      featured: artist.featured,
    });
    setAvatarPreview(artist.avatarUrl || null);
    setCoverPreview(artist.coverUrl || null);
    setAvatarFile(null);
    setCoverFile(null);
    setSuccess(false);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setAvatarFile(null); setAvatarPreview(null);
    setCoverFile(null); setCoverPreview(null);
    setSuccess(false); setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
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

  const addTag = (type: 'specialty' | 'style') => {
    const input = type === 'specialty' ? specialtyInput : styleInput;
    const val = input.trim();
    if (!val || form[type].includes(val)) return;
    setForm((f) => ({ ...f, [type]: [...f[type], val] }));
    if (type === 'specialty') setSpecialtyInput('');
    else setStyleInput('');
  };

  const removeTag = (type: 'specialty' | 'style', val: string) =>
    setForm((f) => ({ ...f, [type]: f[type].filter((x) => x !== val) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { setError('Name is required.'); return; }
    setSaving(true); setError(null); setSuccess(false);
    try {
      const ts = Date.now();
      let avatarUrl = editingId ? (avatarPreview && !avatarFile ? avatarPreview : '') : '';
      let coverUrl = editingId ? (coverPreview && !coverFile ? coverPreview : '') : '';

      if (avatarFile) avatarUrl = await uploadFile(avatarFile, `artists/${ts}-avatar-${avatarFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`);
      if (coverFile) coverUrl = await uploadFile(coverFile, `artists/${ts}-cover-${coverFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`);

      if (editingId) {
        await updateArtist(editingId, { ...form, avatarUrl, coverUrl } as Partial<ArtistFormData> & { avatarUrl: string; coverUrl: string });
      } else {
        await createArtist({ ...form, avatarUrl, coverUrl });
      }
      setSuccess(true);
      cancelEdit();
      fetchArtists();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save artist.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this artist?')) return;
    await deleteArtist(id).catch(() => {});
    if (editingId === id) cancelEdit();
    fetchArtists();
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.75rem 1rem', background: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.08)', color: '#f0ece3',
    fontSize: '0.9rem', fontFamily: 'Inter, sans-serif', outline: 'none',
    boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em',
    color: '#7a7469', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif',
    marginBottom: '0.5rem',
  };
  const TagInput = ({ type, value, onChange, placeholder }: { type: 'specialty' | 'style'; value: string; onChange: (v: string) => void; placeholder: string }) => (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(type); } }}
          style={{ ...inputStyle, flex: 1 }} placeholder={placeholder} />
        <button type="button" onClick={() => addTag(type)}
          style={{ padding: '0.75rem 1rem', background: 'none', border: '1px solid rgba(255,255,255,0.08)', color: '#7a7469', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
          Add
        </button>
      </div>
      {form[type].length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {form[type].map((s) => (
            <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(201,184,154,0.08)', border: '1px solid rgba(201,184,154,0.2)', padding: '0.2rem 0.5rem', fontSize: '0.7rem', color: '#c9b89a', fontFamily: 'Inter, sans-serif' }}>
              {s}
              <button type="button" onClick={() => removeTag(type, s)} style={{ background: 'none', border: 'none', color: '#7a7469', cursor: 'pointer', padding: 0, lineHeight: 1 }}>×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
          <div style={{ height: '1px', width: '20px', background: 'rgba(201,184,154,0.5)' }} />
          <span style={{ color: '#c9b89a', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>Artists</span>
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '3rem', fontWeight: 300, color: '#f0ece3', lineHeight: 1 }}>
          Manage Artist
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
        {/* Form */}
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.5rem', fontWeight: 300, color: '#f0ece3', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {editingId ? 'Edit Artist' : 'Add Artist'}
            {editingId && (
              <button onClick={cancelEdit} style={{ background: 'none', border: 'none', color: '#7a7469', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em' }}>
                Cancel
              </button>
            )}
          </h2>

          {success && (
            <div style={{ background: 'rgba(201,184,154,0.1)', border: '1px solid rgba(201,184,154,0.3)', padding: '0.75rem 1rem', marginBottom: '1.5rem', color: '#c9b89a', fontSize: '0.82rem', fontFamily: 'Inter, sans-serif' }}>
              {editingId ? 'Artist updated!' : 'Artist created!'}
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
              <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} style={inputStyle} placeholder="Artist name" />
            </div>

            <div>
              <label style={labelStyle}>Bio</label>
              <textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} placeholder="Artist biography..." />
            </div>

            <div>
              <label style={labelStyle}>Specialty</label>
              <TagInput type="specialty" value={specialtyInput} onChange={setSpecialtyInput} placeholder="e.g. 手繪創作" />
            </div>

            <div>
              <label style={labelStyle}>Style</label>
              <TagInput type="style" value={styleInput} onChange={setStyleInput} placeholder="e.g. 古典主義" />
            </div>

            <div>
              <label style={labelStyle}>Contact — Email</label>
              <input type="email" value={form.contact.email ?? ''} onChange={(e) => setForm((f) => ({ ...f, contact: { ...f.contact, email: e.target.value } }))} style={inputStyle} placeholder="email@example.com" />
            </div>

            <div>
              <label style={labelStyle}>Contact — Instagram</label>
              <input type="text" value={form.contact.instagram ?? ''} onChange={(e) => setForm((f) => ({ ...f, contact: { ...f.contact, instagram: e.target.value } }))} style={inputStyle} placeholder="@handle" />
            </div>

            <div>
              <label style={labelStyle}>Contact — Website</label>
              <input type="text" value={form.contact.website ?? ''} onChange={(e) => setForm((f) => ({ ...f, contact: { ...f.contact, website: e.target.value } }))} style={inputStyle} placeholder="https://..." />
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

            <button type="submit" disabled={saving}
              style={{ padding: '0.85rem 2rem', background: editingId ? 'rgba(201,184,154,0.1)' : 'transparent', border: '1px solid rgba(201,184,154,0.4)', color: '#c9b89a', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', opacity: saving ? 0.6 : 1, alignSelf: 'flex-start' }}>
              {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Artist'}
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
            ) : artists.map((a) => (
              <div key={a.id}
                style={{ background: editingId === a.id ? 'rgba(201,184,154,0.05)' : '#111', border: `1px solid ${editingId === a.id ? 'rgba(201,184,154,0.2)' : 'rgba(255,255,255,0.05)'}`, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', background: '#0a0a0a', flexShrink: 0 }}>
                  {a.avatarUrl ? (
                    <Image src={a.avatarUrl} alt={a.name} fill style={{ objectFit: 'cover' }} />
                  ) : (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9b89a', fontFamily: 'serif', fontSize: '1rem' }}>{a.name.charAt(0)}</div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: '#f0ece3', fontSize: '0.9rem', fontFamily: "'Cormorant Garamond', serif", marginBottom: '0.1rem' }}>{a.name}</p>
                  {a.specialty && a.specialty.length > 0 && (
                    <p style={{ color: '#7a7469', fontSize: '0.7rem', fontFamily: 'Inter, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.specialty.join(' · ')}</p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button onClick={() => startEdit(a)}
                    style={{ background: 'none', border: '1px solid rgba(201,184,154,0.2)', color: '#c9b89a', padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '0.7rem', fontFamily: 'Inter, sans-serif' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(a.id)}
                    style={{ background: 'none', border: '1px solid rgba(255,80,80,0.2)', color: '#ff9090', padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '0.7rem', fontFamily: 'Inter, sans-serif' }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
