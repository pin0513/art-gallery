'use client';
import { useState, useRef } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { createArtwork } from '@/lib/firestore/artworks';
import { getArtists } from '@/lib/firestore/artists';
import type { ArtworkFormData } from '@/types/artwork';
import type { Artist } from '@/types/artist';
import { useEffect } from 'react';

export default function UploadArtworkPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [form, setForm] = useState<ArtworkFormData>({
    title: '',
    description: '',
    artistId: '',
    tags: [],
    year: new Date().getFullYear(),
    featured: false,
    order: 0,
  });
  const [tagInput, setTagInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getArtists().then(setArtists).catch(() => {});
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      setForm((f) => ({ ...f, tags: [...f.tags, tag] }));
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setError('Please select an image.'); return; }
    if (!form.title) { setError('Please enter a title.'); return; }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const timestamp = Date.now();
      const filename = `artworks/${timestamp}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, filename);
      const uploadTask = uploadBytesResumable(storageRef, file);

      const imageUrl = await new Promise<string>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setProgress(pct);
          },
          reject,
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          }
        );
      });

      await createArtwork({ ...form, imageUrl, thumbnailUrl: imageUrl });

      setSuccess(true);
      setFile(null);
      setPreview(null);
      setProgress(0);
      setForm({
        title: '',
        description: '',
        artistId: '',
        tags: [],
        year: new Date().getFullYear(),
        featured: false,
        order: 0,
      });
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
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
    transition: 'border-color 0.2s',
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
            Upload
          </span>
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '3rem', fontWeight: 300, color: '#f0ece3', lineHeight: 1 }}>
          Upload Artwork
        </h1>
      </div>

      {success && (
        <div style={{ background: 'rgba(201,184,154,0.1)', border: '1px solid rgba(201,184,154,0.3)', padding: '1rem 1.5rem', marginBottom: '2rem', color: '#c9b89a', fontSize: '0.85rem', fontFamily: 'Inter, sans-serif' }}>
          Artwork uploaded successfully!
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.2)', padding: '1rem 1.5rem', marginBottom: '2rem', color: '#ff9090', fontSize: '0.85rem', fontFamily: 'Inter, sans-serif' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: '700px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem 3rem' }}>
          {/* Left column */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Artwork Image *</label>
            <div
              style={{
                border: '1px dashed rgba(255,255,255,0.1)',
                padding: '2rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: '#0a0a0a',
                transition: 'border-color 0.2s',
              }}
              onClick={() => fileRef.current?.click()}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,184,154,0.3)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
            >
              {preview ? (
                <img src={preview} alt="Preview" style={{ maxHeight: '300px', maxWidth: '100%', objectFit: 'contain' }} />
              ) : (
                <div>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>+</div>
                  <p style={{ color: '#7a7469', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif' }}>Click to select image</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
          </div>

          <div>
            <label style={labelStyle}>Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              style={inputStyle}
              placeholder="Artwork title"
              onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(201,184,154,0.4)'; }}
              onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
            />
          </div>

          <div>
            <label style={labelStyle}>Year</label>
            <input
              type="number"
              value={form.year}
              onChange={(e) => setForm((f) => ({ ...f, year: parseInt(e.target.value) || new Date().getFullYear() }))}
              style={inputStyle}
              min={1000}
              max={new Date().getFullYear()}
              onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(201,184,154,0.4)'; }}
              onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
              placeholder="Describe the artwork..."
              onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(201,184,154,0.4)'; }}
              onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
            />
          </div>

          <div>
            <label style={labelStyle}>Artist</label>
            <select
              value={form.artistId}
              onChange={(e) => setForm((f) => ({ ...f, artistId: e.target.value }))}
              style={{ ...inputStyle, cursor: 'pointer' }}
              onFocus={(e) => { (e.target as HTMLSelectElement).style.borderColor = 'rgba(201,184,154,0.4)'; }}
              onBlur={(e) => { (e.target as HTMLSelectElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
            >
              <option value="">Select artist...</option>
              {artists.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Display Order</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))}
              style={inputStyle}
              min={0}
              onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(201,184,154,0.4)'; }}
              onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Tags</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                style={{ ...inputStyle, flex: 1 }}
                placeholder="Add tag, press Enter"
                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(201,184,154,0.4)'; }}
                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
              />
              <button type="button" onClick={addTag} style={{ padding: '0.75rem 1.25rem', background: 'none', border: '1px solid rgba(255,255,255,0.08)', color: '#7a7469', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem' }}>
                Add
              </button>
            </div>
            {form.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(201,184,154,0.08)', border: '1px solid rgba(201,184,154,0.2)', padding: '0.2rem 0.6rem', fontSize: '0.72rem', color: '#c9b89a', fontFamily: 'Inter, sans-serif' }}
                  >
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', color: '#7a7469', cursor: 'pointer', padding: 0, lineHeight: 1, fontSize: '0.9rem' }}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                style={{ accentColor: '#c9b89a', width: '16px', height: '16px' }}
              />
              <span style={{ color: '#7a7469', fontSize: '0.82rem', fontFamily: 'Inter, sans-serif' }}>
                Featured artwork (shown on homepage)
              </span>
            </label>
          </div>

          {uploading && (
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#c9b89a', width: `${progress}%`, transition: 'width 0.3s ease', borderRadius: '2px' }} />
              </div>
              <p style={{ color: '#7a7469', fontSize: '0.75rem', marginTop: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
                Uploading... {progress}%
              </p>
            </div>
          )}

          <div style={{ gridColumn: '1 / -1' }}>
            <button
              type="submit"
              disabled={uploading}
              style={{
                padding: '0.9rem 2.5rem',
                background: uploading ? 'rgba(201,184,154,0.1)' : 'transparent',
                border: '1px solid rgba(201,184,154,0.4)',
                color: '#c9b89a',
                fontSize: '0.78rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: uploading ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s ease',
                opacity: uploading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!uploading) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,184,154,0.1)';
              }}
              onMouseLeave={(e) => {
                if (!uploading) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }}
            >
              {uploading ? 'Uploading...' : 'Upload Artwork'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
