import React, { useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { BRUTALIST_COLORS } from '../../constants/gallery';
import { MuseumItem } from '../../types/museum';

interface PortfolioItemProps {
  item: MuseumItem;
  position: [number, number, number];
  rotation: [number, number, number];
  colorIndex: number;
}

export const PortfolioItem: React.FC<PortfolioItemProps> = ({ item, position, rotation, colorIndex }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const texture = useLoader(TextureLoader, item.imageUrl);
  
  // Cycle through brutalist colors for frames based on category
  const getFrameColor = (category: string) => {
    const categoryColors = {
      achievement: BRUTALIST_COLORS.GREEN,
      project: BRUTALIST_COLORS.BLUE,
      influence: BRUTALIST_COLORS.YELLOW,
      skill: BRUTALIST_COLORS.CYAN,
      experience: BRUTALIST_COLORS.PINK,
      personal: BRUTALIST_COLORS.RED,
      other: BRUTALIST_COLORS.WHITE
    };
    return categoryColors[category as keyof typeof categoryColors] || BRUTALIST_COLORS.WHITE;
  };
  
  const frameColor = getFrameColor(item.category);

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
      
      {/* Portfolio item image (front layer) */}
      <mesh ref={meshRef} position={[0, 0, 0.05]}>
        <planeGeometry args={[2.4, 2.4]} />
        <meshBasicMaterial map={texture} />
      </mesh>
      
      {/* Info panel background - positioned below item */}
      <mesh position={[0, -2.5, 0.01]}>
        <boxGeometry args={[3.2, 0.8, 0.05]} />
        <meshBasicMaterial color={BRUTALIST_COLORS.BLACK} />
      </mesh>
      
      {/* Info panel foreground - positioned below item */}
      <mesh position={[0, -2.5, 0.06]}>
        <boxGeometry args={[3.0, 0.6, 0.02]} />
        <meshBasicMaterial color={BRUTALIST_COLORS.WHITE} />
      </mesh>
      
      {/* Item title text - positioned below item */}
      <Text
        position={[0, -2.4, 0.08]}
        fontSize={0.12}
        color={BRUTALIST_COLORS.BLACK}
        anchorX="center"
        anchorY="middle"
        maxWidth={2.8}
        letterSpacing={0.02}
      >
        {item.title.toUpperCase()}
      </Text>
      
      {/* Category badge - positioned below title */}
      <Text
        position={[0, -2.6, 0.08]}
        fontSize={0.08}
        color={BRUTALIST_COLORS.BLACK}
        anchorX="center"
        anchorY="middle"
        maxWidth={2.8}
        letterSpacing={0.02}
      >
        {item.category.toUpperCase()}
      </Text>
    </group>
  );
}; 