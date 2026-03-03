import { BirdType, MaterialType } from '../game/types';
import type { LevelData } from './types';

// Level 12: Glass House - Fragile ice structure, chain-reaction level
const GROUND_Y = 660;

export const level012: LevelData = {
  id: 12,
  name: 'Glass House',
  birds: [BirdType.RED, BirdType.RED, BirdType.YELLOW, BirdType.RED],
  slingshot: { x: 190, y: GROUND_Y - 180 },
  blocks: [
    // Left ice wall section
    { x: 680, y: GROUND_Y - 70, width: 15, height: 140, material: MaterialType.ICE },
    { x: 720, y: GROUND_Y - 70, width: 15, height: 140, material: MaterialType.ICE },
    { x: 700, y: GROUND_Y - 147.5, width: 55, height: 15, material: MaterialType.ICE },

    // Center ice structure
    { x: 770, y: GROUND_Y - 50, width: 15, height: 100, material: MaterialType.ICE },
    { x: 830, y: GROUND_Y - 50, width: 15, height: 100, material: MaterialType.ICE },
    { x: 800, y: GROUND_Y - 107.5, width: 75, height: 15, material: MaterialType.ICE },
    { x: 800, y: GROUND_Y - 130, width: 40, height: 30, material: MaterialType.ICE },

    // Right ice wall section
    { x: 880, y: GROUND_Y - 70, width: 15, height: 140, material: MaterialType.ICE },
    { x: 920, y: GROUND_Y - 70, width: 15, height: 140, material: MaterialType.ICE },
    { x: 900, y: GROUND_Y - 147.5, width: 55, height: 15, material: MaterialType.ICE },

    // Connecting roof
    { x: 800, y: GROUND_Y - 160, width: 260, height: 12, material: MaterialType.ICE },

    // Upper ice blocks
    { x: 750, y: GROUND_Y - 180, width: 30, height: 25, material: MaterialType.ICE },
    { x: 850, y: GROUND_Y - 180, width: 30, height: 25, material: MaterialType.ICE },

    // One stone block protecting center pig
    { x: 800, y: GROUND_Y - 15, width: 40, height: 30, material: MaterialType.STONE },
  ],
  pigs: [
    { x: 700, y: GROUND_Y - 18 },
    { x: 800, y: GROUND_Y - 18 },
    { x: 900, y: GROUND_Y - 18 },
  ],
  theoreticalMaxScore: 15000 + 13000 + 1500 + 10000,
};
