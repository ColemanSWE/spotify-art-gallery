import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { SpotifyAlbum } from '../types/spotify';
import ApiService from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';

interface AlbumArtProps {
  album: SpotifyAlbum;
  position: [number, number, number];
  onClick: () => void;
}

const AlbumArt: React.FC<AlbumArtProps> = ({ album, position, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  
  // Use the largest available image (usually 640x640)
  const imageUrl = album.images[0]?.url || '';
  const texture = useLoader(TextureLoader, imageUrl);

  // Gentle rotation animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      if (hovered) {
        meshRef.current.scale.setScalar(1.1);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[2, 2, 0.1]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      
      {/* Album title below the cover */}
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.5}
      >
        {album.name}
      </Text>
      
      {/* Artist name */}
      <Text
        position={[0, -1.8, 0]}
        fontSize={0.15}
        color="#b3b3b3"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.5}
      >
        {album.artists.map(artist => artist.name).join(', ')}
      </Text>
    </group>
  );
};

const LoadingSpinner: React.FC = () => (
  <mesh>
    <sphereGeometry args={[0.5, 16, 16]} />
    <meshStandardMaterial color="#1DB954" wireframe />
  </mesh>
);

interface SpotifyGallerySceneProps {
  onAlbumClick?: (album: SpotifyAlbum) => void;
}

const SpotifyGalleryScene: React.FC<SpotifyGallerySceneProps> = ({ onAlbumClick }) => {
  const lightRef = useRef<THREE.PointLight>(null!);
  const { isAuthenticated, userId } = useAuth();
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.position.set(5, 5, 5);
    }
  }, []);

  useEffect(() => {
    const fetchAlbums = async () => {
      if (!isAuthenticated || !userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Note: This is a simplified version. In production, you'd need a proper JWT token
        // For now, we'll make the call without authentication to demonstrate the flow
        // You'll need to implement JWT token generation for the userId
        
        // Temporary mock data for demonstration
        const mockAlbums: SpotifyAlbum[] = [
          {
            id: 'mock1',
            name: 'Sample Album 1',
            artists: [{ id: 'artist1', name: 'Sample Artist' }],
            images: [{ url: process.env.PUBLIC_URL + '/a4044058454_65.jpg', height: 640, width: 640 }],
            release_date: '2023-01-01',
            total_tracks: 12,
            external_urls: { spotify: 'https://open.spotify.com' }
          },
          {
            id: 'mock2',
            name: 'Sample Album 2',
            artists: [{ id: 'artist2', name: 'Another Artist' }],
            images: [{ url: process.env.PUBLIC_URL + '/a4044058454_65.jpg', height: 640, width: 640 }],
            release_date: '2023-02-01',
            total_tracks: 10,
            external_urls: { spotify: 'https://open.spotify.com' }
          },
          {
            id: 'mock3',
            name: 'Sample Album 3',
            artists: [{ id: 'artist3', name: 'Third Artist' }],
            images: [{ url: process.env.PUBLIC_URL + '/a4044058454_65.jpg', height: 640, width: 640 }],
            release_date: '2023-03-01',
            total_tracks: 8,
            external_urls: { spotify: 'https://open.spotify.com' }
          }
        ];
        
        setAlbums(mockAlbums);
        
        // TODO: Replace with actual API call once JWT token system is implemented
        // const fetchedAlbums = await ApiService.getTopAlbums(jwtToken, 'medium_term', 12);
        // setAlbums(fetchedAlbums);
        
      } catch (err) {
        console.error('Failed to fetch albums:', err);
        setError('Failed to load your albums. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [isAuthenticated, userId]);

  const handleAlbumClick = (album: SpotifyAlbum) => {
    console.log('Album clicked:', album);
    if (onAlbumClick) {
      onAlbumClick(album);
    } else {
      // Default action: open in Spotify
      window.open(album.external_urls.spotify, '_blank');
    }
  };

  const generatePositions = (count: number): [number, number, number][] => {
    const positions: [number, number, number][] = [];
    const radius = 5;
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = Math.sin(i * 0.5) * 2; // Varying heights
      positions.push([x, y, z]);
    }
    
    return positions;
  };

  if (!isAuthenticated) {
    return (
      <div style={{ 
        height: '400px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'white',
        backgroundColor: '#1a1a1a'
      }}>
        <p>Please log in to view your Spotify gallery.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        height: '400px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#ff6b6b',
        backgroundColor: '#1a1a1a'
      }}>
        <p>{error}</p>
      </div>
    );
  }

  const positions = generatePositions(albums.length);

  return (
    <div style={{ height: '100vh', backgroundColor: '#0a0a0a' }}>
      <Canvas camera={{ position: [0, 2, 8], fov: 75 }}>
        <ambientLight intensity={0.3} />
        <pointLight ref={lightRef} intensity={1} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={20}
          minDistance={3}
        />
        
        <Suspense fallback={<LoadingSpinner />}>
          {loading ? (
            <LoadingSpinner />
          ) : (
            albums.map((album, index) => (
              <AlbumArt
                key={album.id}
                album={album}
                position={positions[index] || [0, 0, 0]}
                onClick={() => handleAlbumClick(album)}
              />
            ))
          )}
        </Suspense>
        
        {/* Gallery floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      </Canvas>
      
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          textAlign: 'center'
        }}>
          <p>Loading your music gallery...</p>
        </div>
      )}
    </div>
  );
};

export default SpotifyGalleryScene; 