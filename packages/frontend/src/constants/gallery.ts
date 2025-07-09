// Gallery dimensions
export const GALLERY_WIDTH = 40;
export const GALLERY_HEIGHT = 6;
export const GALLERY_DEPTH = 30;
export const ARTWORK_HEIGHT = 3; // Raised significantly from 2

// Brutalist color palette (matching portfolio)
export const BRUTALIST_COLORS = {
  BLACK: '#000000',
  WHITE: '#ffffff', 
  YELLOW: '#ffff00',
  RED: '#ff0000',
  BLUE: '#0000ff',
  GREEN: '#00ff00',
  PINK: '#ff00ff',
  CYAN: '#00ffff'
} as const;

// Movement and interaction constants
export const MOVE_SPEED = 5.0; // Units per second
export const COLLISION_MARGIN = 2;
export const MAX_DELTA_TIME = 0.1; // Max 100ms per frame

// Gallery layout constants
export const WALL_SPACING = 6;
export const WALL_OFFSET = 3;
export const CORNER_MARGIN = 4; 