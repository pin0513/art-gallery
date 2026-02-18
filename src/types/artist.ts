export interface Artist {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
  coverUrl: string;
  specialty: string[];
  style: string[];
  contact: {
    email?: string;
    instagram?: string;
    website?: string;
  };
  featured: boolean;
}

export interface ArtistFormData {
  name: string;
  bio: string;
  specialty: string[];
  style: string[];
  contact: {
    email?: string;
    instagram?: string;
    website?: string;
  };
  featured: boolean;
}
