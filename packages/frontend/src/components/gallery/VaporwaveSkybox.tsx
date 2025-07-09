import React from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

export const VaporwaveSkybox: React.FC = () => {
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