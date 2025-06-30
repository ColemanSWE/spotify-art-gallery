import axios from 'axios';
import { SpotifyAlbum, SpotifyUser } from '../types/spotify';

// Determine API URL based on environment
const getApiBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // In production, use relative path
  if (process.env.NODE_ENV === 'production') {
    return '/api';
  }
  
  // In development, use localhost
  return 'http://127.0.0.1:3001/api';
};

const API_BASE_URL = getApiBaseUrl();

console.log('API Base URL:', API_BASE_URL, 'Environment:', process.env.NODE_ENV);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class ApiService {
  static async getSpotifyAuthUrl(): Promise<{ authUrl: string; state: string }> {
    const response = await apiClient.get('/spotify/auth');
    return response.data;
  }

  static async generateToken(userId: string): Promise<{ token: string; user: any }> {
    const response = await apiClient.post('/auth/token', { userId });
    return response.data;
  }

  static async getSpotifyProfile(token: string): Promise<SpotifyUser> {
    const response = await apiClient.get('/spotify/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }

  static async getTopAlbums(
    token: string, 
    timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
    limit: number = 20
  ): Promise<SpotifyAlbum[]> {
    const response = await apiClient.get('/spotify/top-albums', {
      headers: { Authorization: `Bearer ${token}` },
      params: { timeRange, limit }
    });
    return response.data;
  }

  static async getAlbum(token: string, albumId: string): Promise<SpotifyAlbum> {
    const response = await apiClient.get(`/spotify/album/${albumId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
}

export default ApiService; 