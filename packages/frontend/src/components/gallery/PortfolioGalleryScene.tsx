import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Environment, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { PortfolioItem } from './PortfolioItem';
import { BRUTALIST_COLORS } from '../../constants/gallery';
import { MuseumItem, UserGallery } from '../../types/museum';
import { GalleryService } from '../../services/galleryService';
import { useAuth } from '../../contexts/AuthContext';

interface PortfolioGallerySceneProps {
  galleryId?: string;
}

const PortfolioGalleryStructure: React.FC<{ items: MuseumItem[] }> = ({ items }) => {
  const floorTexture = useTexture('/assets/floortexture.jpg');
  const wallTexture = useTexture('/assets/walltexture.jpg');
  
  // Brutalist concrete floor
  const floorMaterial = new THREE.MeshStandardMaterial({
    map: floorTexture,
    roughness: 0.9,
    metalness: 0.1,
  });
  
  // Brutalist concrete walls
  const wallMaterial = new THREE.MeshStandardMaterial({
    map: wallTexture,
    roughness: 0.8,
    metalness: 0.2,
  });

  return (
    <>
      {/* Brutalist concrete floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <primitive object={floorMaterial} attach="material" />
      </mesh>

      {/* Brutalist concrete walls */}
      <mesh position={[0, 2, -25]} receiveShadow>
        <boxGeometry args={[50, 10, 1]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>
      <mesh position={[0, 2, 25]} receiveShadow>
        <boxGeometry args={[50, 10, 1]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>
      <mesh position={[-25, 2, 0]} receiveShadow>
        <boxGeometry args={[1, 10, 50]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>
      <mesh position={[25, 2, 0]} receiveShadow>
        <boxGeometry args={[1, 10, 50]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>

      {/* Brutalist ceiling */}
      <mesh position={[0, 7, 0]} receiveShadow>
        <boxGeometry args={[50, 1, 50]} />
        <meshStandardMaterial color={BRUTALIST_COLORS.GRAY} roughness={0.9} />
      </mesh>

      {/* Portfolio items arranged in a grid */}
      {items.map((item, index) => {
        const row = Math.floor(index / 4);
        const col = index % 4;
        const x = (col - 1.5) * 8;
        const z = (row - 1) * 8;
        
        return (
          <PortfolioItem
            key={item.id}
            item={item}
            position={[x, 0, z]}
            rotation={[0, 0, 0]}
            colorIndex={index}
          />
        );
      })}

      {/* Brutalist structural elements */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 10]} />
        <meshStandardMaterial color={BRUTALIST_COLORS.BLACK} />
      </mesh>
    </>
  );
};

const PortfolioGalleryContent: React.FC<PortfolioGallerySceneProps> = ({ galleryId }) => {
  const [gallery, setGallery] = useState<UserGallery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        setLoading(true);
        if (galleryId) {
          const galleryData = await GalleryService.getGallery(parseInt(galleryId));
          setGallery(galleryData);
        } else {
          // Load demo gallery if no specific gallery ID
          const demoGallery: UserGallery = {
            id: "1",
            userId: "1",
            title: "Portfolio Showcase",
            description: "A collection of my work and achievements",
            theme: "brutalist",
            isPublic: true,
            visitCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
                         items: [
               {
                 id: "1",
                title: "Web Application",
                description: "Full-stack React application with 3D graphics",
                category: "project",
                imageUrl: "https://via.placeholder.com/400x400/4A90E2/FFFFFF?text=Web+App",
                metadata: {
                  techStack: ["React", "Three.js", "Node.js"],
                  role: "Full Stack Developer",
                  duration: "3 months"
                },
                userId: "1",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              },
                             {
                 id: "2",
                 title: "Machine Learning Project",
                 description: "AI-powered data analysis system",
                 category: "project",
                 imageUrl: "https://via.placeholder.com/400x400/50C878/FFFFFF?text=ML+Project",
                                 metadata: {
                  techStack: ["Python", "TensorFlow", "Pandas"],
                  role: "ML Engineer",
                  duration: "6 months"
                },
                userId: "1",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              },
              {
                id: "3",
                title: "Bachelor's Degree",
                description: "Computer Science with honors",
                category: "achievement",
                imageUrl: "https://via.placeholder.com/400x400/FFD700/000000?text=Degree",
                metadata: {
                  date: "2023",
                  location: "University of Technology"
                },
                userId: "1",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              },
              {
                id: "4",
                title: "Open Source Contributor",
                description: "Active contributor to major open source projects",
                category: "achievement",
                imageUrl: "https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Open+Source",
                metadata: {
                  tags: ["GitHub", "Community", "Collaboration"]
                },
                userId: "1",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            ]
          };
          setGallery(demoGallery);
        }
      } catch (err) {
        setError('Failed to load gallery');
        console.error('Error loading gallery:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, [galleryId]);

  if (loading) {
    return (
      <div style={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        color: BRUTALIST_COLORS.WHITE,
        fontSize: '24px',
        fontFamily: 'monospace'
      }}>
        LOADING PORTFOLIO...
      </div>
    );
  }

  if (error || !gallery) {
    return (
      <div style={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        color: BRUTALIST_COLORS.RED,
        fontSize: '24px',
        fontFamily: 'monospace',
        textAlign: 'center'
      }}>
        ERROR LOADING GALLERY<br/>
        {error}
      </div>
    );
  }

  return (
    <>
      <PortfolioGalleryStructure items={gallery.items} />
      
      {/* Gallery title */}
      <Text
        position={[0, 5, -20]}
        fontSize={1}
        color={BRUTALIST_COLORS.WHITE}
        anchorX="center"
        anchorY="middle"
        maxWidth={20}
        font="/fonts/brutalist.woff"
      >
        {gallery.title.toUpperCase()}
      </Text>
      
      {/* Gallery description */}
      <Text
        position={[0, 3.5, -20]}
        fontSize={0.3}
        color={BRUTALIST_COLORS.WHITE}
        anchorX="center"
        anchorY="middle"
        maxWidth={15}
        font="/fonts/brutalist.woff"
      >
        {gallery.description}
      </Text>
    </>
  );
};

export const PortfolioGalleryScene: React.FC<PortfolioGallerySceneProps> = ({ galleryId }) => {
  return (
    <div style={{ width: '100vw', height: '100vh', background: BRUTALIST_COLORS.BLACK }}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 10], fov: 75 }}
        gl={{ antialias: true }}
      >
        <Environment preset="warehouse" />
        
        <PortfolioGalleryContent galleryId={galleryId} />
        
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={0}
        />
      </Canvas>
      
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: BRUTALIST_COLORS.WHITE,
        fontFamily: 'monospace',
        fontSize: '14px',
        zIndex: 1000
      }}>
        <div>PORTFOLIO GALLERY</div>
        <div>MOUSE: LOOK | SCROLL: ZOOM</div>
      </div>
    </div>
  );
}; 