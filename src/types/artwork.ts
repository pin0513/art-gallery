export interface Artwork {
  id: string;
  title: string;
  description: string;
  imageUrl: string;       // desktop / original
  imageUrlPad?: string;   // tablet ≤ 768px
  imageUrlPhone?: string; // phone ≤ 480px
  thumbnailUrl: string;
  artistId: string;
  tags: string[];
  year: number;
  featured: boolean;
  createdAt: Date;
  order: number;
}

export interface ArtworkFormData {
  title: string;
  description: string;
  artistId: string;
  tags: string[];
  year: number;
  featured: boolean;
  order: number;
}
