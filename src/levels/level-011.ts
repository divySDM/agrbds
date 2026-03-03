import { BirdType, MaterialType } from '../game/types';
import type { LevelData } from './types';

// Level 11: The Pyramid - Massive pyramid structure
const GROUND_Y = 660;

export const level011: LevelData = {
  id: 11,
  name: 'The Pyramid',
  birds: [BirdType.RED, BirdType.BOMB, BirdType.BOMB, BirdType.RED, BirdType.RED],
  slingshot: { x: 180, y: GROUND_Y - 180 },
  blocks: [
    // Bottom row - 5 wide blocks
    { x: 700, y: GROUND_Y - 15, width: 60, height: 30, material: MaterialType.STONE },
    { x: 770, y: GROUND_Y - 15, width: 60, height: 30, material: MaterialType.STONE },
    { x: 840, y: GROUND_Y - 15, width: 60, height: 30, material: MaterialType.STONE },
    { x: 910, y: GROUND_Y - 15, width: 60, height: 30, material: MaterialType.STONE },
    { x: 980, y: GROUND_Y - 15, width: 60, height: 30, material: MaterialType.STONE },

    // Second row - vertical supports + horizontal
    { x: 720, y: GROUND_Y - 60, width: 20, height: 60, material: MaterialType.WOOD },
    { x: 840, y: GROUND_Y - 60, width: 20, height: 60, material: MaterialType.WOOD },
    { x: 960, y: GROUND_Y - 60, width: 20, height: 60, material: MaterialType.WOOD },
    { x: 780, y: GROUND_Y - 97.5, width: 140, height: 15, material: MaterialType.WOOD },
    { x: 900, y: GROUND_Y - 97.5, width: 140, height: 15, material: MaterialType.WOOD },

    // Third row
    { x: 780, y: GROUND_Y - 125, width: 20, height: 40, material: MaterialType.ICE },
    { x: 900, y: GROUND_Y - 125, width: 20, height: 40, material: MaterialType.ICE },
    { x: 840, y: GROUND_Y - 152.5, width: 140, height: 15, material: MaterialType.STONE },

    // Peak
    { x: 840, y: GROUND_Y - 175, width: 40, height: 30, material: MaterialType.WOOD },
    { x: 840, y: GROUND_Y - 200, width: 25, height: 20, material: MaterialType.ICE },
  ],
  pigs: [
    { x: 735, y: GROUND_Y - 48 },
    { x: 840, y: GROUND_Y - 48 },
    { x: 945, y: GROUND_Y - 48 },
    { x: 840, y: GROUND_Y - 120 },
  ],
  theoreticalMaxScore: 20000 + 2000 + 3000 + 7500 + 2000 + 20000,
};
