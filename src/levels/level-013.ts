import { BirdType, MaterialType } from '../game/types';
import type { LevelData } from './types';

// Level 13: Castle Keep - Walled castle with inner keep
const GROUND_Y = 660;

export const level013: LevelData = {
  id: 13,
  name: 'Castle Keep',
  birds: [BirdType.BOMB, BirdType.BOMB, BirdType.RED, BirdType.YELLOW, BirdType.RED],
  slingshot: { x: 170, y: GROUND_Y - 180 },
  blocks: [
    // Outer castle walls (stone)
    { x: 640, y: GROUND_Y - 80, width: 25, height: 160, material: MaterialType.STONE },
    { x: 1000, y: GROUND_Y - 80, width: 25, height: 160, material: MaterialType.STONE },

    // Inner walls (wood)
    { x: 720, y: GROUND_Y - 50, width: 20, height: 100, material: MaterialType.WOOD },
    { x: 820, y: GROUND_Y - 50, width: 20, height: 100, material: MaterialType.WOOD },
    { x: 920, y: GROUND_Y - 50, width: 20, height: 100, material: MaterialType.WOOD },

    // Inner roofs
    { x: 770, y: GROUND_Y - 107.5, width: 120, height: 15, material: MaterialType.WOOD },
    { x: 870, y: GROUND_Y - 107.5, width: 120, height: 15, material: MaterialType.WOOD },

    // Main roof (stone)
    { x: 820, y: GROUND_Y - 170, width: 390, height: 20, material: MaterialType.STONE },

    // Tower tops
    { x: 680, y: GROUND_Y - 185, width: 50, height: 10, material: MaterialType.STONE },
    { x: 960, y: GROUND_Y - 185, width: 50, height: 10, material: MaterialType.STONE },

    // Central keep tower
    { x: 820, y: GROUND_Y - 200, width: 20, height: 40, material: MaterialType.WOOD },
    { x: 820, y: GROUND_Y - 230, width: 50, height: 20, material: MaterialType.WOOD },

    // Ice blocks inside (weak points)
    { x: 770, y: GROUND_Y - 130, width: 25, height: 25, material: MaterialType.ICE },
    { x: 870, y: GROUND_Y - 130, width: 25, height: 25, material: MaterialType.ICE },
  ],
  pigs: [
    { x: 700, y: GROUND_Y - 18 },
    { x: 770, y: GROUND_Y - 18 },
    { x: 820, y: GROUND_Y - 18 },
    { x: 870, y: GROUND_Y - 18 },
    { x: 950, y: GROUND_Y - 18 },
  ],
  theoreticalMaxScore: 25000 + 3000 + 2000 + 6000 + 500 + 0,
};
