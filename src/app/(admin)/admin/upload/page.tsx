'use client';
import { useState, useRef, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { createArtwork } from '@/lib/firestore/artworks';
import { getArtists } from '@/lib/firestore/artists';
import type { ArtworkFormData } from '@/types/artwork';
import type { Artist } from '@/types/artist';

// ─────────────────────────────────────────────
// Helper: resize image with Canvas API
// Returns a JPEG Blob at given maxWidth (keeps ratio, skips if already smaller)
// ─────────────────────────────────────────────
async function resizeImage(file: File, maxWidth: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const ratio = img.width > maxWidth ? maxWidth / img.width : 1;
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas not supported')); return; }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => { if (blob) resolve(blob); else reject(new Error('Canvas toBlob failed')); },
        'image/jpeg',
        0.85
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image load failed')); };
    img.src = url;
  });
}

// Upload a Blob to Firebase Storage path, call onProgress(0..100), return download URL
async function uploadBlob(
  blob: Blob,
  path: string,
  onProgress: (pct: number) => void
): Promise<string> {
  const storageRef = ref(storage, path);
  const task = uploadBytesResumable(storageRef, blob, { contentType: 'image/jpeg' });
  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      (snap) => onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      reject,
      async () => { resolve(await getDownloadURL(task.snapshot.ref)); }
    );
  });
}

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
  // Per-size progress: [phone, pad, original]
  const [progress, setProgress] = useState<[number, number, number]>([0, 0, 0]);
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
    setProgress([0, 0, 0]);

    try {
      const timestamp = Date.now();
      const base = `artworks/${timestamp}`;

      // Resize all 3 sizes in parallel
      const [blobPhone, blobPad, blobOriginal] = await Promise.all([
        resizeImage(file, 480),
        resizeImage(file, 768),
        resizeImage(file, 9999), // effectively original size
      ]);

      // Upload sequentially with per-size progress
      const imageUrlPhone = await uploadBlob(
        blobPhone, `${base}/phone.jpg`,
        (pct) => setProgress((p) => [pct, p[1], p[2]])
      );
      const imageUrlPad = await uploadBlob(
        blobPad, `${base}/pad.jpg`,
        (pct) => setProgress((p) => [100, pct, p[2]])
      );
      const imageUrl = await uploadBlob(
        blobOriginal, `${base}/original.jpg`,
        (pct) => setProgress((p) => [100, 100, pct])
      );

      await createArtwork({
        ...form,
        imageUrl,
        imageUrlPad,
        imageUrlPhone,
        thumbnailUrl: imageUrlPhone, // use phone size as thumbnail
      });

      setSuccess(true);
      setFile(null);
      setPreview(null);
      setProgress([0, 0, 0]);
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

  const overallProgress = uploading
    ? Math.round((progress[0] + progress[1] + progress[2]) / 3)
    : 0;

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

  const sizeBarLabel = (label: string, pct: number) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
      <span style={{ width: '3.5rem', fontSize: '0.65rem', color: '#7a7469', fontFamily: 'Inter, sans-serif', flexShrink: 0 }}>
        {label}
      </span>
      <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', height: '3px', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: '#c9b89a', width: `${pct}%`, transition: 'width 0.3s ease', borderRadius: '2px' }} />
      </div>
      <span style={{ width: '2.5rem', fontSize: '0.65rem', color: '#7a7469', fontFamily: 'Inter, sans-serif', textAlign: 'right' }}>
        {pct}%
      </span>
    </div>
  );

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
        <p style={{ marginTop: '0.75rem', color: '#7a7469', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif' }}>
          Auto-generates Phone (480px), Pad (768px) &amp; Original sizes.
        </p>
      </div>

      {success && (
        <div style={{ background: 'rgba(201,184,154,0.1)', border: '1px solid rgba(201,184,154,0.3)', padding: '1rem 1.5rem', marginBottom: '2rem', color: '#c9b89a', fontSize: '0.85rem', fontFamily: 'Inter, sans-serif' }}>
          Artwork uploaded successfully — 3 sizes stored.
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.2)', padding: '1rem 1.5rem', marginBottom: '2rem', color: '#ff9090', fontSize: '0.85rem', fontFamily: 'Inter, sans-serif' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: '700px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem 3rem' }}>
          {/* Image picker */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Artwork Image *</label>
            <div
              style={{ border: '1px dashed rgba(255,255,255,0.1)', padding: '2rem', textAlign: 'center', cursor: 'pointer', background: '#0a0a0a', transition: 'border-color 0.2s' }}
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

          {/* Title */}
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

          {/* Year */}
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

          {/* Description */}
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

          {/* Artist */}
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

          {/* Order */}
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

          {/* Tags */}
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

          {/* Featured */}
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

          {/* Progress bars (per size) */}
          {uploading && (
            <div style={{ gridColumn: '1 / -1' }}>
              <p style={{ color: '#7a7469', fontSize: '0.7rem', fontFamily: 'Inter, sans-serif', marginBottom: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Uploading… {overallProgress}%
              </p>
              {sizeBarLabel('Phone', progress[0])}
              {sizeBarLabel('Pad', progress[1])}
              {sizeBarLabel('Original', progress[2])}
            </div>
          )}

          {/* Submit */}
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
              onMouseEnter={(e) => { if (!uploading) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,184,154,0.1)'; }}
              onMouseLeave={(e) => { if (!uploading) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              {uploading ? `Uploading… ${overallProgress}%` : 'Upload Artwork'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
