import { BirdType, MaterialType } from '../game/types';
import type { LevelData } from './types';

// Level 7: Mixed fortress - wide spread, requires strategy
const GROUND_Y = 660;

export const level007: LevelData = {
  id: 7,
  name: 'Divide & Conquer',
  birds: [BirdType.RED, BirdType.YELLOW, BirdType.BOMB, BirdType.RED, BirdType.RED],
  slingshot: { x: 170, y: GROUND_Y - 180 },
  blocks: [
    // Left bunker (stone + wood)
    { x: 600, y: GROUND_Y - 50, width: 25, height: 100, material: MaterialType.STONE },
    { x: 660, y: GROUND_Y - 50, width: 25, height: 100, material: MaterialType.STONE },
    { x: 630, y: GROUND_Y - 107.5, width: 85, height: 15, material: MaterialType.WOOD },

    // Center tower (ice, weak)
    { x: 780, y: GROUND_Y - 40, width: 15, height: 80, material: MaterialType.ICE },
    { x: 810, y: GROUND_Y - 40, width: 15, height: 80, material: MaterialType.ICE },
    { x: 795, y: GROUND_Y - 87.5, width: 50, height: 15, material: MaterialType.ICE },
    { x: 795, y: GROUND_Y - 110, width: 15, height: 30, material: MaterialType.ICE },

    // Right bunker (wood + ice hybrid)
    { x: 920, y: GROUND_Y - 50, width: 20, height: 100, material: MaterialType.WOOD },
    { x: 980, y: GROUND_Y - 50, width: 20, height: 100, material: MaterialType.WOOD },
    { x: 950, y: GROUND_Y - 107.5, width: 80, height: 15, material: MaterialType.ICE },
    { x: 950, y: GROUND_Y - 135, width: 40, height: 40, material: MaterialType.WOOD },
  ],
  pigs: [
    { x: 630, y: GROUND_Y - 18 },
    { x: 795, y: GROUND_Y - 18 },
    { x: 950, y: GROUND_Y - 18 },
    { x: 950, y: GROUND_Y - 115 },
  ],
  theoreticalMaxScore: 20000 + 3000 + 4000 + 2500 + 20000,
};
