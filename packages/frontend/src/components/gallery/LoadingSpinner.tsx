import React from 'react';
import { BRUTALIST_COLORS } from '../../constants/gallery';

export const LoadingSpinner: React.FC = () => (
  <mesh>
    <boxGeometry args={[2, 2, 2]} />
    <meshBasicMaterial color={BRUTALIST_COLORS.YELLOW} />
  </mesh>
); 