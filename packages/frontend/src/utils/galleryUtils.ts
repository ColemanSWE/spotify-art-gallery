import { GALLERY_WIDTH, GALLERY_DEPTH, WALL_SPACING, WALL_OFFSET, CORNER_MARGIN } from '../constants/gallery';

export const generateWallPositions = (count: number): Array<{position: [number, number, number], rotation: [number, number, number]}> => {
  const positions: Array<{position: [number, number, number], rotation: [number, number, number]}> = [];
  
  // North wall (yellow)
  const northWallWidth = GALLERY_WIDTH - (2 * CORNER_MARGIN);
  const northCount = Math.min(count, Math.floor(northWallWidth / WALL_SPACING));
  for (let i = 0; i < northCount && positions.length < count; i++) {
    const x = (i - (northCount - 1) / 2) * WALL_SPACING;
    positions.push({
      position: [x, 3, -GALLERY_DEPTH / 2 + WALL_OFFSET], // Using hardcoded ARTWORK_HEIGHT = 3
      rotation: [0, 0, 0]
    });
  }
  
  // South wall (pink)
  const southCount = Math.min(count - positions.length, Math.floor(northWallWidth / WALL_SPACING));
  for (let i = 0; i < southCount && positions.length < count; i++) {
    const x = (i - (southCount - 1) / 2) * WALL_SPACING;
    positions.push({
      position: [x, 3, GALLERY_DEPTH / 2 - WALL_OFFSET],
      rotation: [0, Math.PI, 0]
    });
  }
  
  // East wall (green)
  const eastWallDepth = GALLERY_DEPTH - (2 * CORNER_MARGIN);
  const eastCount = Math.min(count - positions.length, Math.floor(eastWallDepth / WALL_SPACING));
  for (let i = 0; i < eastCount && positions.length < count; i++) {
    const z = (i - (eastCount - 1) / 2) * WALL_SPACING;
    positions.push({
      position: [GALLERY_WIDTH / 2 - WALL_OFFSET, 3, z],
      rotation: [0, -Math.PI / 2, 0]
    });
  }
  
  // West wall (cyan)
  const westCount = Math.min(count - positions.length, Math.floor(eastWallDepth / WALL_SPACING));
  for (let i = 0; i < westCount && positions.length < count; i++) {
    const z = (i - (westCount - 1) / 2) * WALL_SPACING;
    positions.push({
      position: [-GALLERY_WIDTH / 2 + WALL_OFFSET, 3, z],
      rotation: [0, Math.PI / 2, 0]
    });
  }
  
  return positions;
}; 