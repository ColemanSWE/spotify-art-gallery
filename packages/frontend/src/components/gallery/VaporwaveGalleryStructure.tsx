import React from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { GALLERY_WIDTH, GALLERY_HEIGHT, GALLERY_DEPTH } from '../../constants/gallery';

export const VaporwaveGalleryStructure: React.FC = () => {
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