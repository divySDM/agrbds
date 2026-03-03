import { BirdType, MaterialType } from '../game/types';
import type { LevelData } from './types';

// Level 19: Bunker Down - Heavy stone bunkers, requires precision bombing
const GROUND_Y = 660;

export const level019: LevelData = {
  id: 19,
  name: 'Bunker Down',
  birds: [BirdType.BOMB, BirdType.BOMB, BirdType.BOMB, BirdType.RED, BirdType.RED],
  slingshot: { x: 170, y: GROUND_Y - 180 },
  blocks: [
    // Left bunker - fully enclosed stone
    { x: 660, y: GROUND_Y - 35, width: 25, height: 70, material: MaterialType.STONE },
    { x: 740, y: GROUND_Y - 35, width: 25, height: 70, material: MaterialType.STONE },
    { x: 700, y: GROUND_Y - 77.5, width: 105, height: 15, material: MaterialType.STONE },
    { x: 700, y: GROUND_Y - 10, width: 105, height: 20, material: MaterialType.STONE },

    // Center bunker - stone walls, ice roof (weak point)
    { x: 810, y: GROUND_Y - 45, width: 25, height: 90, material: MaterialType.STONE },
    { x: 890, y: GROUND_Y - 45, width: 25, height: 90, material: MaterialType.STONE },
    { x: 850, y: GROUND_Y - 97.5, width: 105, height: 15, material: MaterialType.ICE },
    { x: 850, y: GROUND_Y - 10, width: 105, height: 20, material: MaterialType.STONE },

    // Right bunker - double-walled
    { x: 960, y: GROUND_Y - 35, width: 20, height: 70, material: MaterialType.STONE },
    { x: 1040, y: GROUND_Y - 35, width: 20, height: 70, material: MaterialType.STONE },
    { x: 1000, y: GROUND_Y - 77.5, width: 100, height: 15, material: MaterialType.STONE },
    { x: 980, y: GROUND_Y - 30, width: 10, height: 60, material: MaterialType.WOOD },
    { x: 1020, y: GROUND_Y - 30, width: 10, height: 60, material: MaterialType.WOOD },
    { x: 1000, y: GROUND_Y - 10, width: 100, height: 20, material: MaterialType.STONE },

    // Overhead stone shield across all bunkers
    { x: 850, y: GROUND_Y - 120, width: 420, height: 15, material: MaterialType.STONE },
  ],
  pigs: [
    { x: 700, y: GROUND_Y - 18 },
    { x: 850, y: GROUND_Y - 18 },
    { x: 1000, y: GROUND_Y - 18 },
    { x: 700, y: GROUND_Y - 100 },
    { x: 1000, y: GROUND_Y - 100 },
  ],
  theoreticalMaxScore: 25000 + 1000 + 1000 + 16500 + 0,
};
