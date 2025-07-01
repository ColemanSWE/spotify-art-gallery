import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useLoader, useThree, useFrame } from '@react-three/fiber';
import { Text, PointerLockControls } from '@react-three/drei';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { SpotifyAlbum } from '../types/spotify';
import { useAuth } from '../contexts/AuthContext';
import { ApiService } from '../services/apiService';

// Gallery dimensions
const GALLERY_WIDTH = 40;
const GALLERY_HEIGHT = 6;
const GALLERY_DEPTH = 30;
const ARTWORK_HEIGHT = 3; // Raised significantly from 2

// Brutalist color palette (matching portfolio)
const BRUTALIST_COLORS = {
  BLACK: '#000000',
  WHITE: '#ffffff', 
  YELLOW: '#ffff00',
  RED: '#ff0000',
  BLUE: '#0000ff',
  GREEN: '#00ff00',
  PINK: '#ff00ff',
  CYAN: '#00ffff'
};

interface AlbumArtworkProps {
  album: SpotifyAlbum;
  position: [number, number, number];
  rotation: [number, number, number];
  colorIndex: number;
}

const AlbumArtwork: React.FC<AlbumArtworkProps> = ({ album, position, rotation, colorIndex }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const imageUrl = album.images[0]?.url || '';
  const texture = useLoader(TextureLoader, imageUrl);
  
  // Cycle through brutalist colors for frames
  const frameColors = [
    BRUTALIST_COLORS.YELLOW,
    BRUTALIST_COLORS.PINK, 
    BRUTALIST_COLORS.GREEN,
    BRUTALIST_COLORS.CYAN,
    BRUTALIST_COLORS.RED,
    BRUTALIST_COLORS.BLUE
  ];
  const frameColor = frameColors[colorIndex % frameColors.length];

  return (
    <group position={position} rotation={rotation}>
      {/* Brutalist frame - thick black border (back layer) */}
      <mesh position={[0, 0, -0.25]}>
        <boxGeometry args={[3, 3, 0.2]} />
        <meshBasicMaterial color={BRUTALIST_COLORS.BLACK} />
      </mesh>
      
      {/* Colored background frame (middle layer) */}
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[2.8, 2.8, 0.1]} />
        <meshBasicMaterial color={frameColor} />
      </mesh>
      
      {/* Album cover (front layer) */}
      <mesh ref={meshRef} position={[0, 0, 0.05]}>
        <planeGeometry args={[2.4, 2.4]} />
        <meshBasicMaterial map={texture} />
      </mesh>
      
      {/* Info panel background - positioned below artwork */}
      <mesh position={[0, -2.5, 0.01]}>
        <boxGeometry args={[3.2, 0.8, 0.05]} />
        <meshBasicMaterial color={BRUTALIST_COLORS.BLACK} />
      </mesh>
      
      {/* Info panel foreground - positioned below artwork */}
      <mesh position={[0, -2.5, 0.06]}>
        <boxGeometry args={[3.0, 0.6, 0.02]} />
        <meshBasicMaterial color={BRUTALIST_COLORS.WHITE} />
      </mesh>
      
      {/* Album title text - positioned below artwork */}
      <Text
        position={[0, -2.4, 0.08]}
        fontSize={0.12}
        color={BRUTALIST_COLORS.BLACK}
        anchorX="center"
        anchorY="middle"
        maxWidth={2.8}
        letterSpacing={0.02}
      >
        {album.name.toUpperCase()}
      </Text>
      
      {/* Artist name text - positioned below artwork */}
      <Text
        position={[0, -2.6, 0.08]}
        fontSize={0.08}
        color={BRUTALIST_COLORS.BLACK}
        anchorX="center"
        anchorY="middle"
        maxWidth={2.8}
        letterSpacing={0.02}
      >
        {album.artists[0]?.name.toUpperCase()}
      </Text>
    </group>
  );
};

const VaporwaveGalleryStructure: React.FC = () => {
  const floorTexture = useLoader(TextureLoader, '/assets/floortexture.jpg');
  const wallTexture = useLoader(TextureLoader, '/assets/walltexture.jpg');
  
  // Set up floor texture
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(10, 8);
  
  // Set up wall texture - Single stretched version
  wallTexture.wrapS = THREE.ClampToEdgeWrapping;
  wallTexture.wrapT = THREE.ClampToEdgeWrapping;

  return (
    <group>
      {/* Vaporwave floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[GALLERY_WIDTH, GALLERY_DEPTH]} />
        <meshBasicMaterial map={floorTexture} />
      </mesh>
      
      {/* No ceiling - let the vaporwave background show through! */}
      
      {/* North Wall */}
      <mesh position={[0, GALLERY_HEIGHT / 2, -GALLERY_DEPTH / 2]}>
        <planeGeometry args={[GALLERY_WIDTH, GALLERY_HEIGHT]} />
        <meshBasicMaterial map={wallTexture} />
      </mesh>
      
      {/* South Wall */}
      <mesh position={[0, GALLERY_HEIGHT / 2, GALLERY_DEPTH / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[GALLERY_WIDTH, GALLERY_HEIGHT]} />
        <meshBasicMaterial map={wallTexture} />
      </mesh>
      
      {/* East Wall */}
      <mesh position={[GALLERY_WIDTH / 2, GALLERY_HEIGHT / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[GALLERY_DEPTH, GALLERY_HEIGHT]} />
        <meshBasicMaterial map={wallTexture} />
      </mesh>
      
      {/* West Wall */}
      <mesh position={[-GALLERY_WIDTH / 2, GALLERY_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[GALLERY_DEPTH, GALLERY_HEIGHT]} />
        <meshBasicMaterial map={wallTexture} />
      </mesh>
      
      {/* Corner pillars with vaporwave accent color */}
      {[
        [-GALLERY_WIDTH/2 + 1, GALLERY_HEIGHT/2, -GALLERY_DEPTH/2 + 1],
        [GALLERY_WIDTH/2 - 1, GALLERY_HEIGHT/2, -GALLERY_DEPTH/2 + 1],
        [-GALLERY_WIDTH/2 + 1, GALLERY_HEIGHT/2, GALLERY_DEPTH/2 - 1],
        [GALLERY_WIDTH/2 - 1, GALLERY_HEIGHT/2, GALLERY_DEPTH/2 - 1]
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[2, GALLERY_HEIGHT, 2]} />
          <meshBasicMaterial color="#ff006f" />
        </mesh>
      ))}
    </group>
  );
};

const VaporwaveSkybox: React.FC = () => {
  const skyboxTexture = useLoader(TextureLoader, '/assets/skybox.jpg');
  
  return (
    <mesh>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial 
        map={skyboxTexture} 
        side={THREE.BackSide}
      />
    </mesh>
  );
};

interface FirstPersonCameraProps {
  isPaused: boolean;
  onTogglePause: () => void;
  onPointerLockChange: (hasLock: boolean) => void;
}

const FirstPersonCamera = React.forwardRef<any, FirstPersonCameraProps>(({ isPaused, onTogglePause, onPointerLockChange }, ref) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>();
  const [hasPointerLock, setHasPointerLock] = useState(false);
  const keysPressed = useRef<{[key: string]: boolean}>({});
  
  // Expose the lock method and state to parent component
  React.useImperativeHandle(ref, () => ({
    lock: () => {
      if (controlsRef.current && !isPaused) {
        try {
          // Check if pointer lock is available and not already active
          if (document.pointerLockElement === null) {
            controlsRef.current.lock();
          }
        } catch (error) {
          console.warn('Pointer lock request failed:', error);
          // Retry after a longer delay if it fails
          setTimeout(() => {
            try {
              if (controlsRef.current && document.pointerLockElement === null) {
                controlsRef.current.lock();
              }
            } catch (retryError) {
              console.warn('Pointer lock retry failed:', retryError);
            }
          }, 200);
        }
      }
    },
    forceLock: () => {
      if (controlsRef.current) {
        try {
          // Check if pointer lock is available and not already active
          if (document.pointerLockElement === null) {
            controlsRef.current.lock();
          }
        } catch (error) {
          console.warn('Force pointer lock request failed:', error);
          // Retry after a longer delay if it fails
          setTimeout(() => {
            try {
              if (controlsRef.current && document.pointerLockElement === null) {
                controlsRef.current.lock();
              }
            } catch (retryError) {
              console.warn('Force pointer lock retry failed:', retryError);
            }
          }, 200);
        }
      }
    },
    hasPointerLock: hasPointerLock
  }));
  
  // Clear keys when paused
  useEffect(() => {
    if (isPaused) {
      keysPressed.current = {};
    }
  }, [isPaused]);

  // Continuous movement with animation frame
  useFrame((state, delta) => {
    // Don't allow movement when paused OR when we don't have pointer lock
    if (isPaused || !controlsRef.current || !hasPointerLock) return;
    
    const moveSpeed = 5.0; // Units per second
    const frameSpeed = moveSpeed * delta; // Movement this frame
    const direction = new THREE.Vector3();
    let moved = false;
    
    // Forward/Backward movement
    if (keysPressed.current['KeyW'] || keysPressed.current['KeyS']) {
      camera.getWorldDirection(direction);
      direction.y = 0;
      direction.normalize();
      
      if (keysPressed.current['KeyW']) {
        camera.position.add(direction.multiplyScalar(frameSpeed));
        moved = true;
      }
      if (keysPressed.current['KeyS']) {
        camera.position.add(direction.multiplyScalar(-frameSpeed));
        moved = true;
      }
    }
    
    // Left/Right movement
    if (keysPressed.current['KeyA'] || keysPressed.current['KeyD']) {
      camera.getWorldDirection(direction);
      direction.y = 0;
      direction.normalize();
      
      if (keysPressed.current['KeyA']) {
        const right = new THREE.Vector3(direction.z, 0, -direction.x);
        camera.position.add(right.multiplyScalar(frameSpeed));
        moved = true;
      }
      if (keysPressed.current['KeyD']) {
        const left = new THREE.Vector3(-direction.z, 0, direction.x);
        camera.position.add(left.multiplyScalar(frameSpeed));
        moved = true;
      }
    }
    
    // Apply collision detection if we moved
    if (moved) {
      const margin = 2;
      camera.position.x = Math.max(-GALLERY_WIDTH/2 + margin, Math.min(GALLERY_WIDTH/2 - margin, camera.position.x));
      camera.position.z = Math.max(-GALLERY_DEPTH/2 + margin, Math.min(GALLERY_DEPTH/2 - margin, camera.position.z));
      camera.position.y = Math.max(1, Math.min(GALLERY_HEIGHT - 1, camera.position.y));
    }
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Track key presses for movement
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) {
        keysPressed.current[event.code] = true;
        event.preventDefault();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      // Stop tracking key when released
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) {
        keysPressed.current[event.code] = false;
        event.preventDefault();
      }
    };

    const handlePointerLockChange = () => {
      // Update pointer lock state
      const hasLock = !!document.pointerLockElement;
      setHasPointerLock(hasLock);
      onPointerLockChange(hasLock);
      
      // Clear all key states when losing pointer lock
      if (!hasLock) {
        keysPressed.current = {};
      }
      
      // When pointer lock is released (ESC pressed), show pause menu
      // Only if we're not already paused (prevents loops)
      if (!hasLock && !isPaused) {
        // Small delay to prevent race conditions
        setTimeout(() => {
          if (!isPaused) {
            onTogglePause();
          }
        }, 50);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      // Clear key states on cleanup
      keysPressed.current = {};
    };
  }, [camera, isPaused, onTogglePause]);
  
  return <PointerLockControls ref={controlsRef} enabled={!isPaused} />;
});

const LoadingSpinner: React.FC = () => (
  <mesh>
    <boxGeometry args={[2, 2, 2]} />
    <meshBasicMaterial color={BRUTALIST_COLORS.YELLOW} />
  </mesh>
);

interface SpotifyGallerySceneProps {}

const SpotifyGalleryScene: React.FC<SpotifyGallerySceneProps> = () => {
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'short_term' | 'medium_term' | 'long_term'>('medium_term');
  const [isPaused, setIsPaused] = useState(false);
  const [hasPointerLock, setHasPointerLock] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const { isAuthenticated, userId, logout } = useAuth();
  const lightRef = useRef<THREE.PointLight>(null);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.position.set(0, GALLERY_HEIGHT - 1, 0);
    }
    
    // Mobile detection
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
      const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
      const isTouchDevice = 'ontouchstart' in window;
      const isSmallScreen = window.innerWidth <= 768;
      
      setIsMobile(isMobileUA || (isTouchDevice && isSmallScreen));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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

  const generateWallPositions = (count: number): Array<{position: [number, number, number], rotation: [number, number, number]}> => {
    const positions: Array<{position: [number, number, number], rotation: [number, number, number]}> = [];
    
    const wallSpacing = 6;
    const wallOffset = 3;
    const cornerMargin = 4;
    
    // North wall (yellow)
    const northWallWidth = GALLERY_WIDTH - (2 * cornerMargin);
    const northCount = Math.min(count, Math.floor(northWallWidth / wallSpacing));
    for (let i = 0; i < northCount && positions.length < count; i++) {
      const x = (i - (northCount - 1) / 2) * wallSpacing;
      positions.push({
        position: [x, ARTWORK_HEIGHT, -GALLERY_DEPTH / 2 + wallOffset],
        rotation: [0, 0, 0]
      });
    }
    
    // South wall (pink)
    const southCount = Math.min(count - positions.length, Math.floor(northWallWidth / wallSpacing));
    for (let i = 0; i < southCount && positions.length < count; i++) {
      const x = (i - (southCount - 1) / 2) * wallSpacing;
      positions.push({
        position: [x, ARTWORK_HEIGHT, GALLERY_DEPTH / 2 - wallOffset],
        rotation: [0, Math.PI, 0]
      });
    }
    
    // East wall (green)
    const eastWallDepth = GALLERY_DEPTH - (2 * cornerMargin);
    const eastCount = Math.min(count - positions.length, Math.floor(eastWallDepth / wallSpacing));
    for (let i = 0; i < eastCount && positions.length < count; i++) {
      const z = (i - (eastCount - 1) / 2) * wallSpacing;
      positions.push({
        position: [GALLERY_WIDTH / 2 - wallOffset, ARTWORK_HEIGHT, z],
        rotation: [0, -Math.PI / 2, 0]
      });
    }
    
    // West wall (cyan)
    const westCount = Math.min(count - positions.length, Math.floor(eastWallDepth / wallSpacing));
    for (let i = 0; i < westCount && positions.length < count; i++) {
      const z = (i - (westCount - 1) / 2) * wallSpacing;
      positions.push({
        position: [-GALLERY_WIDTH / 2 + wallOffset, ARTWORK_HEIGHT, z],
        rotation: [0, Math.PI / 2, 0]
      });
    }
    
    return positions;
  };

  if (!isAuthenticated) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        color: BRUTALIST_COLORS.BLACK,
        backgroundColor: BRUTALIST_COLORS.WHITE,
        textAlign: 'center',
        fontFamily: 'JetBrains Mono, monospace',
        cursor: 'crosshair',
        padding: isMobile ? '20px' : '40px'
      }}>
        <h2 style={{ 
          color: BRUTALIST_COLORS.BLACK, 
          marginBottom: '20px',
          fontSize: isMobile ? '2rem' : '3rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: isMobile ? '2px' : '4px',
          textShadow: `3px 3px 0px ${BRUTALIST_COLORS.YELLOW}, 6px 6px 0px ${BRUTALIST_COLORS.PINK}`
        }}>
          🎵 SPOTIFY 3D GALLERY
        </h2>
        
        {isMobile && (
          <div style={{
            backgroundColor: BRUTALIST_COLORS.YELLOW,
            color: BRUTALIST_COLORS.BLACK,
            border: `4px solid ${BRUTALIST_COLORS.BLACK}`,
            boxShadow: `8px 8px 0px ${BRUTALIST_COLORS.BLACK}`,
            padding: '20px',
            marginBottom: '20px',
            maxWidth: '400px'
          }}>
            <p style={{ fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase' }}>
              📱 MOBILE DETECTED
            </p>
            <p style={{ fontWeight: 700, fontSize: '14px', lineHeight: '1.4' }}>
              This is a 3D desktop experience! You can still log in to see your albums, but visit on desktop for the full gallery.
            </p>
          </div>
        )}
        <p style={{ 
          marginBottom: '30px', 
          fontSize: '18px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          CONNECT YOUR SPOTIFY ACCOUNT TO VIEW YOUR MUSIC IN 3D!
        </p>
        <div style={{ 
          padding: '30px',
          border: `4px solid ${BRUTALIST_COLORS.BLACK}`,
          boxShadow: `8px 8px 0px ${BRUTALIST_COLORS.BLACK}`,
          backgroundColor: BRUTALIST_COLORS.YELLOW,
          maxWidth: '600px'
        }}>
          <p style={{fontWeight: 700, marginBottom: '15px'}}>🎨 YOUR TOP ALBUMS WILL BE DISPLAYED AS ARTWORK IN A VIRTUAL GALLERY</p>
          <p style={{fontWeight: 700, marginBottom: '15px'}}>🚶‍♂️ WALK AROUND AND EXPLORE YOUR MUSIC COLLECTION IN 3D SPACE</p>
          <p style={{fontWeight: 700}}>🖼️ EXPERIENCE YOUR MUSIC AS A CURATED ART EXHIBITION</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        color: BRUTALIST_COLORS.WHITE,
        backgroundColor: BRUTALIST_COLORS.RED,
        textAlign: 'center',
        fontFamily: 'JetBrains Mono, monospace',
        cursor: 'crosshair'
      }}>
        <h3 style={{
          fontSize: '2rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '3px',
          marginBottom: '20px'
        }}>
          ⚠️ GALLERY ERROR
        </h3>
        <p style={{ marginBottom: '20px', fontWeight: 700, textTransform: 'uppercase' }}>{error}</p>
        <p style={{ marginBottom: '30px', fontWeight: 700, textTransform: 'uppercase' }}>TRY REFRESHING THE PAGE OR LOGGING OUT AND BACK IN.</p>
        
        {isAuthenticated && (
          <button
            onClick={() => {
              if (window.confirm('LOG OUT TO RESET YOUR CREDENTIALS?')) {
                logout();
              }
            }}
            style={{
              backgroundColor: BRUTALIST_COLORS.WHITE,
              color: BRUTALIST_COLORS.BLACK,
              border: `4px solid ${BRUTALIST_COLORS.BLACK}`,
              boxShadow: `4px 4px 0px ${BRUTALIST_COLORS.BLACK}`,
              padding: '15px 25px',
              fontSize: '16px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: 'crosshair',
              fontFamily: 'JetBrains Mono, monospace',
              transition: 'all 0.2s cubic-bezier(0.76, 0, 0.24, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(-2px, -2px)';
              e.currentTarget.style.boxShadow = `6px 6px 0px ${BRUTALIST_COLORS.BLACK}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(0px, 0px)';
              e.currentTarget.style.boxShadow = `4px 4px 0px ${BRUTALIST_COLORS.BLACK}`;
            }}
          >
            LOGOUT & RETRY
          </button>
        )}
      </div>
    );
  }

  const artworkPositions = generateWallPositions(albums.length);

  // Mobile fallback view
  if (isMobile && isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: BRUTALIST_COLORS.BLACK,
        color: BRUTALIST_COLORS.WHITE,
        fontFamily: 'JetBrains Mono, monospace',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h1 style={{
            color: BRUTALIST_COLORS.YELLOW,
            fontSize: '2rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '3px',
            marginBottom: '20px',
            textShadow: `3px 3px 0px ${BRUTALIST_COLORS.PINK}`
          }}>
            🖥️ DESKTOP EXPERIENCE
          </h1>
          
          <div style={{
            backgroundColor: BRUTALIST_COLORS.WHITE,
            color: BRUTALIST_COLORS.BLACK,
            border: `4px solid ${BRUTALIST_COLORS.BLACK}`,
            boxShadow: `8px 8px 0px ${BRUTALIST_COLORS.YELLOW}`,
            padding: '30px',
            marginBottom: '30px',
            textAlign: 'left'
          }}>
            <h2 style={{
              fontSize: '1.2rem',
              marginBottom: '15px',
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}>
              🎵 3D GALLERY OPTIMIZED FOR DESKTOP
            </h2>
            <p style={{ marginBottom: '15px', lineHeight: '1.5' }}>
              <strong>THIS IS A 3D WALKING EXPERIENCE</strong> designed for desktop with mouse and keyboard controls.
            </p>
            <ul style={{ marginBottom: '15px', paddingLeft: '20px', lineHeight: '1.6' }}>
              <li><strong>MOUSE:</strong> Look around the gallery</li>
              <li><strong>WASD:</strong> Walk through 3D space</li>
              <li><strong>ESC:</strong> Pause and settings</li>
            </ul>
            <p style={{ fontWeight: 700, textTransform: 'uppercase' }}>
              📱 Visit on desktop for the full experience!
            </p>
          </div>

          {albums.length > 0 && (
            <>
              <h3 style={{
                color: BRUTALIST_COLORS.CYAN,
                fontSize: '1.2rem',
                marginBottom: '20px',
                textTransform: 'uppercase',
                letterSpacing: '2px'
              }}>
                YOUR TOP ALBUMS ({timeRange.replace('_', ' ').toUpperCase()})
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '15px',
                marginBottom: '30px'
              }}>
                {albums.slice(0, 12).map((album, index) => (
                  <div key={album.id} style={{
                    backgroundColor: BRUTALIST_COLORS.WHITE,
                    border: `3px solid ${BRUTALIST_COLORS.BLACK}`,
                    boxShadow: `4px 4px 0px ${BRUTALIST_COLORS.BLACK}`,
                    padding: '10px'
                  }}>
                    <img 
                      src={album.images[1]?.url || album.images[0]?.url} 
                      alt={album.name}
                      style={{ 
                        width: '100%', 
                        height: 'auto',
                        display: 'block',
                        marginBottom: '8px'
                      }}
                    />
                    <div style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: BRUTALIST_COLORS.BLACK,
                      lineHeight: '1.2'
                    }}>
                      {album.name}
                    </div>
                    <div style={{
                      fontSize: '0.7rem',
                      color: BRUTALIST_COLORS.BLACK,
                      marginTop: '4px'
                    }}>
                      {album.artists[0]?.name}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              style={{
                backgroundColor: BRUTALIST_COLORS.GREEN,
                color: BRUTALIST_COLORS.BLACK,
                border: `4px solid ${BRUTALIST_COLORS.BLACK}`,
                boxShadow: `4px 4px 0px ${BRUTALIST_COLORS.BLACK}`,
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: 700,
                textTransform: 'uppercase',
                fontFamily: 'JetBrains Mono, monospace',
                cursor: 'pointer'
              }}
            >
              <option value="short_term">LAST 4 WEEKS</option>
              <option value="medium_term">LAST 6 MONTHS</option>
              <option value="long_term">ALL TIME</option>
            </select>
            
            <button
              onClick={() => {
                if (window.confirm('LOG OUT AND TRY A DIFFERENT ACCOUNT?')) {
                  logout();
                }
              }}
              style={{
                backgroundColor: BRUTALIST_COLORS.PINK,
                color: BRUTALIST_COLORS.BLACK,
                border: `4px solid ${BRUTALIST_COLORS.BLACK}`,
                boxShadow: `4px 4px 0px ${BRUTALIST_COLORS.BLACK}`,
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: 700,
                textTransform: 'uppercase',
                fontFamily: 'JetBrains Mono, monospace',
                cursor: 'pointer'
              }}
            >
              🚪 LOGOUT
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthenticated && !loading && !error && albums.length === 0) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        color: BRUTALIST_COLORS.BLACK,
        backgroundColor: BRUTALIST_COLORS.WHITE,
        textAlign: 'center',
        fontFamily: 'JetBrains Mono, monospace',
        cursor: 'crosshair'
      }}>
        <h3 style={{ 
          color: BRUTALIST_COLORS.BLACK, 
          marginBottom: '20px',
          fontSize: '2rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '3px',
          textShadow: `2px 2px 0px ${BRUTALIST_COLORS.GREEN}`
        }}>
          🎵 GALLERY READY!
        </h3>
        <p style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 700, textTransform: 'uppercase' }}>NO ALBUMS FOUND FOR THE SELECTED TIME RANGE.</p>
        <div style={{ 
          padding: '20px',
          border: `4px solid ${BRUTALIST_COLORS.BLACK}`,
          boxShadow: `8px 8px 0px ${BRUTALIST_COLORS.BLACK}`,
          backgroundColor: BRUTALIST_COLORS.CYAN,
          marginBottom: '30px'
        }}>
          <p style={{fontWeight: 700, marginBottom: '10px'}}>💡 TRY CHANGING THE TIME RANGE ABOVE</p>
          <p style={{fontWeight: 700, marginBottom: '10px'}}>🎧 MAKE SURE YOU HAVE LISTENED TO MUSIC ON SPOTIFY</p>
          <p style={{fontWeight: 700}}>⏱️ IT MAY TAKE TIME FOR SPOTIFY TO UPDATE YOUR LISTENING HISTORY</p>
        </div>
        
        <button
          onClick={() => {
            if (window.confirm('LOGOUT AND TRY A DIFFERENT SPOTIFY ACCOUNT?')) {
              logout();
            }
          }}
          style={{
            backgroundColor: BRUTALIST_COLORS.PINK,
            color: BRUTALIST_COLORS.BLACK,
            border: `4px solid ${BRUTALIST_COLORS.BLACK}`,
            boxShadow: `4px 4px 0px ${BRUTALIST_COLORS.BLACK}`,
            padding: '15px 25px',
            fontSize: '16px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            cursor: 'crosshair',
            fontFamily: 'JetBrains Mono, monospace',
            transition: 'all 0.2s cubic-bezier(0.76, 0, 0.24, 1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(-2px, -2px)';
            e.currentTarget.style.boxShadow = `6px 6px 0px ${BRUTALIST_COLORS.BLACK}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(0px, 0px)';
            e.currentTarget.style.boxShadow = `4px 4px 0px ${BRUTALIST_COLORS.BLACK}`;
          }}
        >
          LOGOUT & TRY DIFFERENT ACCOUNT
        </button>
      </div>
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
      {/* Pause Menu Overlay */}
      {isPaused && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'JetBrains Mono, monospace',
            cursor: 'crosshair'
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
        >
          <div style={{
            backgroundColor: BRUTALIST_COLORS.BLACK,
            border: `6px solid ${BRUTALIST_COLORS.WHITE}`,
            boxShadow: `12px 12px 0px ${BRUTALIST_COLORS.WHITE}`,
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '25px',
            alignItems: 'center',
            maxWidth: '500px'
          }}>
            <h2 style={{
              color: BRUTALIST_COLORS.YELLOW,
              fontSize: '2.5rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '4px',
              margin: 0,
              marginBottom: '10px'
            }}>
              ⏸️ PAUSED
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
              <label style={{ 
                color: BRUTALIST_COLORS.WHITE, 
                fontSize: '16px', 
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '2px'
              }}>
                TIME RANGE:
              </label>
              <select
                value={timeRange}
                onChange={(e) => {
                  e.stopPropagation();
                  setTimeRange(e.target.value as any);
                }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  backgroundColor: BRUTALIST_COLORS.YELLOW,
                  color: BRUTALIST_COLORS.BLACK,
                  border: `4px solid ${BRUTALIST_COLORS.BLACK}`,
                  boxShadow: `4px 4px 0px ${BRUTALIST_COLORS.BLACK}`,
                  padding: '15px 20px',
                  fontSize: '16px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontFamily: 'JetBrains Mono, monospace',
                  cursor: 'crosshair',
                  minWidth: '200px'
                }}
              >
                <option value="short_term">LAST 4 WEEKS</option>
                <option value="medium_term">LAST 6 MONTHS</option>
                <option value="long_term">ALL TIME</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsPaused(false);
                }}
                style={{
                  backgroundColor: BRUTALIST_COLORS.GREEN,
                  color: BRUTALIST_COLORS.BLACK,
                  border: `4px solid ${BRUTALIST_COLORS.BLACK}`,
                  boxShadow: `4px 4px 0px ${BRUTALIST_COLORS.BLACK}`,
                  padding: '15px 25px',
                  fontSize: '18px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: 'crosshair',
                  fontFamily: 'JetBrains Mono, monospace',
                  transition: 'all 0.2s cubic-bezier(0.76, 0, 0.24, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translate(-2px, -2px)';
                  e.currentTarget.style.boxShadow = `6px 6px 0px ${BRUTALIST_COLORS.BLACK}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translate(0px, 0px)';
                  e.currentTarget.style.boxShadow = `4px 4px 0px ${BRUTALIST_COLORS.BLACK}`;
                }}
              >
                ▶️ RESUME
              </button>
              
              {isAuthenticated && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (window.confirm('ARE YOU SURE YOU WANT TO LOG OUT?')) {
                      logout();
                    }
                  }}
                  style={{
                    backgroundColor: BRUTALIST_COLORS.PINK,
                    color: BRUTALIST_COLORS.BLACK,
                    border: `4px solid ${BRUTALIST_COLORS.BLACK}`,
                    boxShadow: `4px 4px 0px ${BRUTALIST_COLORS.BLACK}`,
                    padding: '15px 25px',
                    fontSize: '18px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    cursor: 'crosshair',
                    fontFamily: 'JetBrains Mono, monospace',
                    transition: 'all 0.2s cubic-bezier(0.76, 0, 0.24, 1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translate(-2px, -2px)';
                    e.currentTarget.style.boxShadow = `6px 6px 0px ${BRUTALIST_COLORS.BLACK}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translate(0px, 0px)';
                    e.currentTarget.style.boxShadow = `4px 4px 0px ${BRUTALIST_COLORS.BLACK}`;
                  }}
                >
                  🚪 LOGOUT
                </button>
              )}
            </div>
          </div>
        </div>
      )}



      {/* Brutalist Instructions - Only show when not paused */}
      {!isPaused && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          color: BRUTALIST_COLORS.WHITE,
          fontSize: '14px',
          backgroundColor: BRUTALIST_COLORS.BLACK,
          border: `4px solid ${BRUTALIST_COLORS.WHITE}`,
          boxShadow: `4px 4px 0px ${BRUTALIST_COLORS.WHITE}`,
          padding: '20px',
          maxWidth: '250px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          lineHeight: '1.4'
        }}>
          <div style={{marginBottom: '10px', color: BRUTALIST_COLORS.YELLOW}}>CONTROLS:</div>
          <div>CLICK TO ENTER GALLERY</div>
          <div>WASD - SMOOTH MOVEMENT</div>
          <div>MOUSE - LOOK AROUND</div>
          <div>ESC - PAUSE MENU</div>
        </div>
      )}

      {!isPaused && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 999,
          color: BRUTALIST_COLORS.BLACK,
          fontSize: '24px',
          backgroundColor: BRUTALIST_COLORS.YELLOW,
          border: `4px solid ${BRUTALIST_COLORS.BLACK}`,
          boxShadow: `8px 8px 0px ${BRUTALIST_COLORS.BLACK}`,
          padding: '20px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '2px',
          pointerEvents: 'none',
          opacity: hasPointerLock ? 0 : 1,
          transition: 'opacity 0.3s ease'
        }}>
          CLICK TO ENTER GALLERY
        </div>
      )}

      {/* Canvas with transparent background to show container background */}
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