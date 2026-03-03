import { BirdType, MaterialType } from '../game/types';
import type { LevelData } from './types';

// Level 15: Mixed Signals - Every material in varied enclosures
const GROUND_Y = 660;

export const level015: LevelData = {
  id: 15,
  name: 'Mixed Signals',
  birds: [BirdType.RED, BirdType.YELLOW, BirdType.BOMB, BirdType.RED, BirdType.YELLOW],
  slingshot: { x: 170, y: GROUND_Y - 180 },
  blocks: [
    // Far left: open wood shelter
    { x: 620, y: GROUND_Y - 40, width: 20, height: 80, material: MaterialType.WOOD },
    { x: 680, y: GROUND_Y - 40, width: 20, height: 80, material: MaterialType.WOOD },
    { x: 650, y: GROUND_Y - 87.5, width: 80, height: 15, material: MaterialType.WOOD },

    // Center-left: ice box
    { x: 755, y: GROUND_Y - 40, width: 15, height: 80, material: MaterialType.ICE },
    { x: 815, y: GROUND_Y - 40, width: 15, height: 80, material: MaterialType.ICE },
    { x: 785, y: GROUND_Y - 87.5, width: 75, height: 15, material: MaterialType.ICE },
    { x: 785, y: GROUND_Y - 10, width: 75, height: 20, material: MaterialType.ICE },

    // Center-right: stone bunker (hard target)
    { x: 880, y: GROUND_Y - 35, width: 20, height: 70, material: MaterialType.STONE },
    { x: 940, y: GROUND_Y - 35, width: 20, height: 70, material: MaterialType.STONE },
    { x: 910, y: GROUND_Y - 77.5, width: 80, height: 15, material: MaterialType.STONE },

    // Far right: mixed tower
    { x: 1010, y: GROUND_Y - 50, width: 20, height: 100, material: MaterialType.WOOD },
    { x: 1060, y: GROUND_Y - 50, width: 20, height: 100, material: MaterialType.ICE },
    { x: 1035, y: GROUND_Y - 107.5, width: 70, height: 15, material: MaterialType.STONE },
    { x: 1035, y: GROUND_Y - 130, width: 30, height: 30, material: MaterialType.WOOD },
  ],
  pigs: [
    { x: 650, y: GROUND_Y - 18 },
    { x: 785, y: GROUND_Y - 18 },
    { x: 910, y: GROUND_Y - 18 },
    { x: 1035, y: GROUND_Y - 18 },
  ],
  theoreticalMaxScore: 20000 + 1500 + 4000 + 4500 + 2000 + 20000,
};
