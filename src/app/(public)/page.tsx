import HeroSection from '@/components/home/HeroSection';
import FeaturedArtworks from '@/components/home/FeaturedArtworks';
import ArtistSpotlight from '@/components/home/ArtistSpotlight';
import { getFeaturedArtworks } from '@/lib/firestore/artworks';
import { getFeaturedArtists } from '@/lib/firestore/artists';

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
