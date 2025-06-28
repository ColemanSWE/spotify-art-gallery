import axios from 'axios';

export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: Array<{ url: string; height: number; width: number }>;
  country: string;
  followers: { total: number };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  artists: Array<{ id: string; name: string }>;
  images: Array<{ url: string; height: number; width: number }>;
  release_date: string;
  total_tracks: number;
  external_urls: { spotify: string };
}

export interface SpotifyTopAlbumsResponse {
  items: Array<{
    album: SpotifyAlbum;
    artists: Array<{ id: string; name: string }>;
    name: string;
    id: string;
  }>;
  total: number;
  limit: number;
  offset: number;
}

class SpotifyService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private readonly baseUrl = 'https://api.spotify.com/v1';
  private readonly authUrl = 'https://accounts.spotify.com';

  constructor() {
    this.clientId = process.env.SPOTIFY_CLIENT_ID || '';
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET || '';
    this.redirectUri = process.env.SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:3001/api/spotify/auth/callback';
    
    if (!this.clientId || !this.clientSecret) {
      console.warn('Spotify credentials not configured. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables.');
    }
  }

  generateAuthUrl(state?: string): string {
    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-top-read',
      'user-library-read'
    ].join(' ');

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      scope: scopes,
      redirect_uri: this.redirectUri,
      ...(state && { state })
    });

    return `${this.authUrl}/authorize?${params.toString()}`;
  }

  async exchangeCodeForTokens(code: string): Promise<SpotifyTokenResponse> {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.redirectUri
    });

    const response = await axios.post(`${this.authUrl}/api/token`, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
      }
    });

    return response.data;
  }

  async refreshAccessToken(refreshToken: string): Promise<SpotifyTokenResponse> {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    });

    const response = await axios.post(`${this.authUrl}/api/token`, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
      }
    });

    return response.data;
  }

  async getCurrentUser(accessToken: string): Promise<SpotifyUser> {
    const response = await axios.get(`${this.baseUrl}/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return response.data;
  }

  async getUserTopTracks(accessToken: string, timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term', limit: number = 20): Promise<SpotifyTopAlbumsResponse> {
    const response = await axios.get(`${this.baseUrl}/me/top/tracks`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      params: {
        time_range: timeRange,
        limit,
        offset: 0
      }
    });

    return response.data;
  }

  async getUserTopAlbums(accessToken: string, timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term', limit: number = 20): Promise<SpotifyAlbum[]> {
    const topTracks = await this.getUserTopTracks(accessToken, timeRange, 50);
    
    const albumsMap = new Map<string, SpotifyAlbum>();
    
    topTracks.items.forEach(track => {
      if (track.album && !albumsMap.has(track.album.id)) {
        albumsMap.set(track.album.id, track.album);
      }
    });

    const uniqueAlbums = Array.from(albumsMap.values());
    return uniqueAlbums.slice(0, limit);
  }

  async getAlbumById(accessToken: string, albumId: string): Promise<SpotifyAlbum> {
    const response = await axios.get(`${this.baseUrl}/albums/${albumId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return response.data;
  }
}

export default new SpotifyService(); 