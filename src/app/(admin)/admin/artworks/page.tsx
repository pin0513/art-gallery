'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getArtworks, updateArtwork, deleteArtwork } from '@/lib/firestore/artworks';
import { getArtists } from '@/lib/firestore/artists';
import type { Artwork } from '@/types/artwork';
import type { Artist } from '@/types/artist';

export default function ManageArtworksPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<{
    title: string;
    description: string;
    year: number;
    featured: boolean;
    tags: string[];
    order: number;
  }>({ title: '', description: '', year: 0, featured: false, tags: [], order: 0 });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    Promise.all([getArtworks(), getArtists()])
      .then(([aw, ar]) => { setArtworks(aw); setArtists(ar); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const artistName = (id: string) => artists.find((a) => a.id === id)?.name ?? '';

  const startEdit = (artwork: Artwork) => {
    setEditingId(artwork.id);
    setEditFields({
      title: artwork.title,
      description: artwork.description ?? '',
      year: artwork.year,
      featured: artwork.featured,
      tags: artwork.tags ?? [],
      order: artwork.order ?? 0,
    });
    setTagInput('');
    setSaveMsg('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setSaveMsg('');
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !editFields.tags.includes(t)) {
      setEditFields((f) => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput('');
  };

  const removeTag = (t: string) => {
    setEditFields((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }));
  };

  const handleSave = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      await updateArtwork(editingId, editFields);
      setArtworks((prev) =>
        prev.map((a) => (a.id === editingId ? { ...a, ...editFields } : a))
      );
      setSaveMsg('Saved');
      setTimeout(() => { setEditingId(null); setSaveMsg(''); }, 800);
    } catch {
      setSaveMsg('Error saving');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this artwork?')) return;
    try {
      await deleteArtwork(id);
      setArtworks((prev) => prev.filter((a) => a.id !== id));
      if (editingId === id) setEditingId(null);
    } catch {
      alert('Delete failed');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.6rem 0.9rem',
    background: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#f0ece3',
    fontSize: '0.85rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh' }}>
        <div style={{ width: '1px', height: '50px', background: 'rgba(201,184,154,0.3)', animation: 'pulse 1.5s infinite' }} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
          <div style={{ height: '1px', width: '20px', background: 'rgba(201,184,154,0.5)' }} />
          <span style={{ color: '#c9b89a', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
            Manage
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '3rem', fontWeight: 300, color: '#f0ece3', lineHeight: 1 }}>
            Artworks
          </h1>
          <span style={{ color: '#7a7469', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif' }}>
            {artworks.length} works
          </span>
        </div>
      </div>

      {artworks.length === 0 && (
        <p style={{ color: '#7a7469', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem' }}>
          No artworks yet. Upload some from the Upload page.
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(255,255,255,0.04)' }}>
        {artworks.map((artwork) => {
          const isEditing = editingId === artwork.id;
          return (
            <div
              key={artwork.id}
              style={{
                background: isEditing ? '#111' : '#050505',
                padding: '1.5rem',
                transition: 'background 0.2s',
              }}
            >
              {isEditing ? (
                /* ── Edit mode ── */
                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '1.5rem', alignItems: 'start' }}>
                  {/* Thumbnail */}
                  <div style={{ position: 'relative', width: 140, height: 100, background: '#0a0a0a', flexShrink: 0 }}>
                    {artwork.imageUrl && (
                      <Image src={artwork.imageUrl} alt={artwork.title} fill style={{ objectFit: 'cover' }} />
                    )}
                  </div>

                  {/* Fields */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px', gap: '0.75rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.65rem', color: '#7a7469', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', marginBottom: '0.3rem' }}>Title</label>
                        <input value={editFields.title} onChange={(e) => setEditFields((f) => ({ ...f, title: e.target.value }))} style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.65rem', color: '#7a7469', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', marginBottom: '0.3rem' }}>Year</label>
                        <input type="number" value={editFields.year} onChange={(e) => setEditFields((f) => ({ ...f, year: parseInt(e.target.value) || 0 }))} style={inputStyle} min={1000} max={2099} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.65rem', color: '#7a7469', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', marginBottom: '0.3rem' }}>Order</label>
                        <input type="number" value={editFields.order} onChange={(e) => setEditFields((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))} style={inputStyle} min={0} />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.65rem', color: '#7a7469', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', marginBottom: '0.3rem' }}>Description</label>
                      <textarea
                        value={editFields.description}
                        onChange={(e) => setEditFields((f) => ({ ...f, description: e.target.value }))}
                        style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                        placeholder="Describe the artwork..."
                      />
                    </div>

                    {/* Tags */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.65rem', color: '#7a7469', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', marginBottom: '0.3rem' }}>Tags</label>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                          style={{ ...inputStyle, flex: 1 }}
                          placeholder="Add tag, press Enter"
                        />
                        <button type="button" onClick={addTag} style={{ padding: '0.6rem 1rem', background: 'none', border: '1px solid rgba(255,255,255,0.08)', color: '#7a7469', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.78rem' }}>Add</button>
                      </div>
                      {editFields.tags.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                          {editFields.tags.map((tag) => (
                            <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(201,184,154,0.08)', border: '1px solid rgba(201,184,154,0.2)', padding: '0.2rem 0.6rem', fontSize: '0.7rem', color: '#c9b89a', fontFamily: 'Inter, sans-serif' }}>
                              {tag}
                              <button type="button" onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', color: '#7a7469', cursor: 'pointer', padding: 0, lineHeight: 1 }}>×</button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Featured */}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={editFields.featured} onChange={(e) => setEditFields((f) => ({ ...f, featured: e.target.checked }))} style={{ accentColor: '#c9b89a', width: '14px', height: '14px' }} />
                      <span style={{ color: '#7a7469', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif' }}>Featured (shown on homepage)</span>
                    </label>

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.25rem' }}>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{ padding: '0.6rem 1.75rem', background: 'transparent', border: '1px solid rgba(201,184,154,0.4)', color: '#c9b89a', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', opacity: saving ? 0.6 : 1 }}
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={cancelEdit}
                        style={{ padding: '0.6rem 1.25rem', background: 'none', border: '1px solid rgba(255,255,255,0.06)', color: '#7a7469', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                      >
                        Cancel
                      </button>
                      {saveMsg && (
                        <span style={{ color: saveMsg === 'Saved' ? '#c9b89a' : '#ff9090', fontSize: '0.78rem', fontFamily: 'Inter, sans-serif' }}>
                          {saveMsg}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* ── View mode ── */
                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: '1.25rem', alignItems: 'center' }}>
                  {/* Thumb */}
                  <div style={{ position: 'relative', width: 80, height: 56, background: '#111', flexShrink: 0 }}>
                    {artwork.imageUrl && (
                      <Image src={artwork.imageUrl} alt={artwork.title} fill style={{ objectFit: 'cover' }} />
                    )}
                  </div>

                  {/* Info */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.1rem', color: '#f0ece3' }}>
                        {artwork.title}
                      </span>
                      <span style={{ color: '#7a7469', fontSize: '0.72rem', fontFamily: 'Inter, sans-serif' }}>{artwork.year}</span>
                      {artwork.featured && (
                        <span style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: '#c9b89a', border: '1px solid rgba(201,184,154,0.3)', padding: '0.1rem 0.45rem', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
                          Featured
                        </span>
                      )}
                    </div>
                    {artistName(artwork.artistId) && (
                      <p style={{ color: '#7a7469', fontSize: '0.75rem', fontFamily: 'Inter, sans-serif', marginTop: '0.15rem' }}>
                        {artistName(artwork.artistId)}
                      </p>
                    )}
                    {artwork.description && (
                      <p style={{ color: '#7a7469', fontSize: '0.78rem', fontFamily: 'Inter, sans-serif', marginTop: '0.25rem', maxWidth: '600px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {artwork.description}
                      </p>
                    )}
                    {artwork.tags && artwork.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                        {artwork.tags.map((tag) => (
                          <span key={tag} style={{ fontSize: '0.62rem', letterSpacing: '0.08em', color: '#7a7469', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', padding: '0.1rem 0.45rem', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <button
                      onClick={() => startEdit(artwork)}
                      style={{ padding: '0.45rem 1rem', background: 'none', border: '1px solid rgba(201,184,154,0.25)', color: '#c9b89a', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,184,154,0.5)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,184,154,0.25)'; }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(artwork.id)}
                      style={{ padding: '0.45rem 0.75rem', background: 'none', border: '1px solid rgba(255,80,80,0.15)', color: 'rgba(255,120,120,0.6)', fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,80,80,0.4)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,80,80,0.15)'; }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
