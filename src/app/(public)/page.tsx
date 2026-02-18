import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import FeaturedArtworks from '@/components/home/FeaturedArtworks';
import ArtistSpotlight from '@/components/home/ArtistSpotlight';
import { getFeaturedArtworks } from '@/lib/firestore/artworks';
import { getFeaturedArtists } from '@/lib/firestore/artists';

export const metadata: Metadata = {
  title: 'LITING Art | 立庭藝廊',
  description: '探索藝術的深邃之美 — LITING Art 立庭藝廊，精選當代與古典藝術作品的線上藝廊。',
  openGraph: {
    title: 'LITING Art | 立庭藝廊',
    description: '探索藝術的深邃之美 — LITING Art 立庭藝廊，精選當代與古典藝術作品的線上藝廊。',
    type: 'website',
    url: '/',
  },
};

export default async function HomePage() {
  let featuredArtworks: import('@/types/artwork').Artwork[] = [];
  let featuredArtists: import('@/types/artist').Artist[] = [];

  try {
    [featuredArtworks, featuredArtists] = await Promise.all([
      getFeaturedArtworks(6),
      getFeaturedArtists(),
    ]);
  } catch {
    // Firebase not configured yet — render with empty data
  }

  return (
    <>
      <HeroSection />
      <FeaturedArtworks artworks={featuredArtworks} />
      <ArtistSpotlight artists={featuredArtists} />
    </>
  );
}
