export interface Artist {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
  coverUrl: string;
  specialty: string[];
  featured: boolean;
}

export interface ArtistFormData {
  name: string;
  bio: string;
  specialty: string[];
  featured: boolean;
}
