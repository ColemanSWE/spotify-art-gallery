import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { SpotifyAlbum } from '../types/spotify';
import { useAuth } from '../contexts/AuthContext';
import { ApiService } from '../services/apiService';
import { useMobileDetection } from '../hooks/useMobileDetection';
import { generateWallPositions } from '../utils/galleryUtils';
import { BRUTALIST_COLORS, GALLERY_HEIGHT } from '../constants/gallery';

// Component imports
import { AlbumArtwork } from './gallery/AlbumArtwork';
import { VaporwaveGalleryStructure } from './gallery/VaporwaveGalleryStructure';
import { VaporwaveSkybox } from './gallery/VaporwaveSkybox';
import { FirstPersonCamera } from './gallery/FirstPersonCamera';
import { LoadingSpinner } from './gallery/LoadingSpinner';
import { PauseMenu } from './gallery/PauseMenu';
import { Instructions } from './gallery/Instructions';
import { MobileFallback } from './gallery/MobileFallback';
import { AuthenticationViews } from './gallery/AuthenticationViews';

interface SpotifyGallerySceneProps {}

const SpotifyGalleryScene: React.FC<SpotifyGallerySceneProps> = () => {
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'short_term' | 'medium_term' | 'long_term'>('medium_term');
  const [isPaused, setIsPaused] = useState(false);
  const [hasPointerLock, setHasPointerLock] = useState(false);
  
  const { isAuthenticated, userId, logout } = useAuth();
  const isMobile = useMobileDetection();
  const lightRef = useRef<THREE.PointLight>(null);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.position.set(0, GALLERY_HEIGHT - 1, 0);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      setLoading(false);
      return;
    }

    const fetchAlbums = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('jwtToken');
        if (token) {
          const response = await ApiService.getTopAlbums(token, timeRange, 20);
          setAlbums(response);
        } else {
          console.warn('No JWT token found, user needs to authenticate with Spotify');
          setAlbums([]);
        }
        
      } catch (err) {
        console.error('Failed to fetch albums:', err);
        setError('Failed to load your albums. Please try logging in again.');
        setAlbums([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [isAuthenticated, userId, timeRange]);

  const artworkPositions = generateWallPositions(albums.length);

  // Check if we should show authentication views
  const shouldShowAuthViews = !isAuthenticated || error || (isAuthenticated && !loading && !error && albums.length === 0);
  
  if (shouldShowAuthViews) {
    return (
      <AuthenticationViews
        isAuthenticated={isAuthenticated}
        loading={loading}
        error={error}
        albumCount={albums.length}
        onLogout={logout}
      />
    );
  }

  // Mobile fallback view
  if (isMobile && isAuthenticated) {
    return (
      <MobileFallback
        albums={albums}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        onLogout={logout}
      />
    );
  }

  return (
    <div style={{ 
      height: '100vh', 
      backgroundColor: '#000',
      position: 'relative',
      fontFamily: 'JetBrains Mono, monospace',
      cursor: 'crosshair'
    }}>
      <PauseMenu
        isVisible={isPaused}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        onResume={() => setIsPaused(false)}
        onLogout={logout}
        isAuthenticated={isAuthenticated}
      />

      {!isPaused && (
        <Instructions hasPointerLock={hasPointerLock} />
      )}

      <Canvas 
        camera={{ position: [0, 2, 12], fov: 75 }}
        style={{
          background: 'transparent',
          pointerEvents: isPaused ? 'none' : 'auto'
        }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        
        <FirstPersonCamera 
          ref={cameraRef}
          isPaused={isPaused} 
          onTogglePause={() => setIsPaused(!isPaused)}
          onPointerLockChange={setHasPointerLock}
        />
        
        <Suspense fallback={null}>
          <VaporwaveSkybox />
        </Suspense>
        
        <Suspense fallback={null}>
          <VaporwaveGalleryStructure />
        </Suspense>
        
        <Suspense fallback={<LoadingSpinner />}>
          {loading ? (
            <LoadingSpinner />
          ) : (
            albums.map((album, index) => {
              const artworkPos = artworkPositions[index];
              if (!artworkPos) return null;
              
              return (
                <AlbumArtwork
                  key={album.id}
                  album={album}
                  position={artworkPos.position}
                  rotation={artworkPos.rotation}
                  colorIndex={index}
                />
              );
            })
          )}
        </Suspense>
      </Canvas>
      
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: BRUTALIST_COLORS.WHITE,
          textAlign: 'center',
          fontSize: '18px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '2px',
          backgroundColor: BRUTALIST_COLORS.BLACK,
          padding: '20px',
          border: `4px solid ${BRUTALIST_COLORS.WHITE}`,
          boxShadow: `8px 8px 0px ${BRUTALIST_COLORS.WHITE}`
        }}>
          LOADING YOUR MUSIC GALLERY...
        </div>
      )}
    </div>
  );
};

export default SpotifyGalleryScene; 