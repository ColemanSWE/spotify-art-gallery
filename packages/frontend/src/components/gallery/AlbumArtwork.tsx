import React, { useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { BRUTALIST_COLORS } from '../../constants/gallery';
import { SpotifyAlbum } from '../../types/spotify';

interface AlbumArtworkProps {
  album: SpotifyAlbum;
  position: [number, number, number];
  rotation: [number, number, number];
  colorIndex: number;
}

export const AlbumArtwork: React.FC<AlbumArtworkProps> = ({ album, position, rotation, colorIndex }) => {
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