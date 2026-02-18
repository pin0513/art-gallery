import type { Metadata } from 'next';
import { getArtwork } from '@/lib/firestore/artworks';
import ArtworkPageClient from './ArtworkPageClient';

interface ArtworkPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ArtworkPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const artwork = await getArtwork(id);
    if (!artwork) return {};
    const description = artwork.description
      ? artwork.description.slice(0, 160)
      : `${artwork.title} — LITING Art 立庭藝廊`;
    const imageUrl = artwork.thumbnailUrl || artwork.imageUrlPad || artwork.imageUrl;
    return {
      title: artwork.title,
      description,
      openGraph: {
        title: `${artwork.title} | LITING Art`,
        description,
        type: 'article',
        url: `/gallery/${id}`,
        images: imageUrl ? [{ url: imageUrl, alt: artwork.title }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${artwork.title} | LITING Art`,
        description,
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch {
    return {};
  }
}

export default function ArtworkPage({ params }: ArtworkPageProps) {
  return <ArtworkPageClient params={params} />;
}
