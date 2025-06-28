export interface SpotifyAlbum {
  id: string;
  name: string;
  artists: Array<{ id: string; name: string }>;
  images: Array<{ 
    url: string; 
    height: number; 
    width: number; 
  }>;
  release_date: string;
  total_tracks: number;
  external_urls: { spotify: string };
}

export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: Array<{ url: string; height: number; width: number }>;
  country: string;
  followers: { total: number };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: SpotifyUser | null;
  userId: string | null;
} 