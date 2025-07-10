export interface MuseumItem {
  id: string;
  title: string;
  description: string;
  category: 'achievement' | 'influence' | 'project' | 'memory' | 'book' | 'art' | 'travel' | 'other';
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
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserGallery {
  id: string;
  userId: string;
  title: string;
  description: string;
  isPublic: boolean;
  items: MuseumItem[];
  theme: 'brutalist' | 'minimal' | 'dark' | 'warm';
  visitCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MuseumUser {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  galleries: UserGallery[];
  isPublic: boolean;
} 