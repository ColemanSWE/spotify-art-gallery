import axios from 'axios';
import { MuseumItem, UserGallery, MuseumUser } from '../types/museum';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export class GalleryService {
  // Get all public galleries for discovery
  static async getPublicGalleries(): Promise<UserGallery[]> {
    const response = await apiClient.get('/galleries/public');
    return response.data;
  }

  // Get user's own galleries
  static async getMyGalleries(): Promise<UserGallery[]> {
    const response = await apiClient.get('/galleries/my-galleries');
    return response.data;
  }

  // Get specific gallery with all items
  static async getGallery(galleryId: number): Promise<UserGallery> {
    const response = await apiClient.get(`/galleries/${galleryId}`);
    return response.data;
  }

  // Create new gallery
  static async createGallery(galleryData: {
    title: string;
    description?: string;
    roomType: 'achievements' | 'projects' | 'influences' | 'skills' | 'experience' | 'personal';
    theme?: 'brutalist' | 'minimal' | 'dark' | 'warm';
    isPublic?: boolean;
  }): Promise<UserGallery> {
    const response = await apiClient.post('/galleries', galleryData);
    return response.data;
  }

  // Update gallery
  static async updateGallery(
    galleryId: number,
    galleryData: {
      title?: string;
      description?: string;
      roomType?: 'achievements' | 'projects' | 'influences' | 'skills' | 'experience' | 'personal';
      theme?: 'brutalist' | 'minimal' | 'dark' | 'warm';
      isPublic?: boolean;
    }
  ): Promise<UserGallery> {
    const response = await apiClient.put(`/galleries/${galleryId}`, galleryData);
    return response.data;
  }

  // Delete gallery
  static async deleteGallery(galleryId: number): Promise<void> {
    await apiClient.delete(`/galleries/${galleryId}`);
  }

  // Add artwork to gallery
  static async addArtwork(
    galleryId: number,
    artworkData: {
      title: string;
      description?: string;
      category: 'achievement' | 'project' | 'influence' | 'skill' | 'experience' | 'personal' | 'other';
      imageUrl: string;
      metadata?: {
        date?: string;
        location?: string;
        tags?: string[];
        externalLink?: string;
        techStack?: string[];
        role?: string;
        duration?: string;
      };
      position?: { x: number; y: number; z: number };
      rotation?: { x: number; y: number; z: number };
    }
  ): Promise<MuseumItem> {
    const response = await apiClient.post(`/galleries/${galleryId}/artworks`, artworkData);
    return response.data;
  }

  // Update artwork
  static async updateArtwork(
    artworkId: number,
    artworkData: {
      title?: string;
      description?: string;
      category?: 'achievement' | 'project' | 'influence' | 'skill' | 'experience' | 'personal' | 'other';
      imageUrl?: string;
      metadata?: {
        date?: string;
        location?: string;
        tags?: string[];
        externalLink?: string;
        techStack?: string[];
        role?: string;
        duration?: string;
      };
      position?: { x: number; y: number; z: number };
      rotation?: { x: number; y: number; z: number };
    }
  ): Promise<MuseumItem> {
    const response = await apiClient.put(`/galleries/artworks/${artworkId}`, artworkData);
    return response.data;
  }

  // Delete artwork
  static async deleteArtwork(artworkId: number): Promise<void> {
    await apiClient.delete(`/galleries/artworks/${artworkId}`);
  }
} 