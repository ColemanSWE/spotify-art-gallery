import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';

const ArtPiece: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const texture = useLoader(TextureLoader, process.env.PUBLIC_URL + '/a4044058454_65.jpg');
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1, 0.1]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

const GalleryScene: React.FC = () => {
  const lightRef = useRef<THREE.PointLight>(null!);
  const [isPending, startTransition] = React.useTransition();
  const [showScene, setShowScene] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setShowScene(true);
    });

    if (lightRef.current) {
      lightRef.current.position.set(5, 5, 5);
    }
  }, []);

  return (
    <>
      {isPending && <div>Loading...</div>}
      {showScene && (
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight ref={lightRef} />
          <OrbitControls />
          <Suspense fallback={<mesh />}>
            <ArtPiece position={[-2, 0, 0]} />
            <ArtPiece position={[0, 0, 0]} />
            <ArtPiece position={[2, 0, 0]} />
          </Suspense>
        </Canvas>
      )}
    </>
  );
}

export default GalleryScene;
