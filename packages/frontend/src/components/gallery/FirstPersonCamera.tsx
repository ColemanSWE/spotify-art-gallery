import React, { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import { GALLERY_WIDTH, GALLERY_HEIGHT, GALLERY_DEPTH, MOVE_SPEED, COLLISION_MARGIN, MAX_DELTA_TIME } from '../../constants/gallery';

interface FirstPersonCameraProps {
  isPaused: boolean;
  onTogglePause: () => void;
  onPointerLockChange: (hasLock: boolean) => void;
}

export const FirstPersonCamera = React.forwardRef<any, FirstPersonCameraProps>(({ isPaused, onTogglePause, onPointerLockChange }, ref) => {
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
    
    // Cap delta to prevent huge jumps if frame rate drops
    const cappedDelta = Math.min(delta, MAX_DELTA_TIME);
    const frameSpeed = MOVE_SPEED * cappedDelta;
    
    // Debug logging for deployment issues
    if (Object.values(keysPressed.current).some(pressed => pressed)) {
      console.log('Movement frame:', { delta, cappedDelta, frameSpeed, keys: keysPressed.current });
    }
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
      camera.position.x = Math.max(-GALLERY_WIDTH/2 + COLLISION_MARGIN, Math.min(GALLERY_WIDTH/2 - COLLISION_MARGIN, camera.position.x));
      camera.position.z = Math.max(-GALLERY_DEPTH/2 + COLLISION_MARGIN, Math.min(GALLERY_DEPTH/2 - COLLISION_MARGIN, camera.position.z));
      camera.position.y = Math.max(1, Math.min(GALLERY_HEIGHT - 1, camera.position.y));
    }
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Track key presses for movement
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) {
        keysPressed.current[event.code] = true;
        event.preventDefault();
        console.log('Key pressed:', event.code, keysPressed.current);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      // Stop tracking key when released
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) {
        keysPressed.current[event.code] = false;
        event.preventDefault();
        console.log('Key released:', event.code, keysPressed.current);
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
    
    // Debug: Verify event listeners are attached
    console.log('Event listeners attached for movement controls');
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      // Clear key states on cleanup
      keysPressed.current = {};
      console.log('Event listeners removed for movement controls');
    };
  }, [camera, isPaused, onTogglePause]);
  
  return <PointerLockControls ref={controlsRef} enabled={!isPaused} />;
}); 