import { BirdType, MaterialType } from '../game/types';
import type { LevelData } from './types';

// Level 8: Ice bunkers - requires bomb birds to penetrate
const GROUND_Y = 660;

export const level008: LevelData = {
  id: 8,
  name: 'Ice Breaker',
  birds: [BirdType.YELLOW, BirdType.BOMB, BirdType.BOMB, BirdType.RED, BirdType.YELLOW],
  slingshot: { x: 180, y: GROUND_Y - 180 },
  blocks: [
    // Left ice bunker - enclosed pig
    { x: 650, y: GROUND_Y - 60, width: 20, height: 120, material: MaterialType.ICE },
    { x: 730, y: GROUND_Y - 60, width: 20, height: 120, material: MaterialType.ICE },
    { x: 690, y: GROUND_Y - 127.5, width: 100, height: 15, material: MaterialType.STONE },
    { x: 690, y: GROUND_Y - 10, width: 100, height: 20, material: MaterialType.ICE },

    // Center structure - pyramid
    { x: 830, y: GROUND_Y - 30, width: 60, height: 60, material: MaterialType.STONE },
    { x: 830, y: GROUND_Y - 75, width: 40, height: 30, material: MaterialType.WOOD },
    { x: 830, y: GROUND_Y - 100, width: 25, height: 20, material: MaterialType.ICE },

    // Right ice bunker - enclosed pig
    { x: 930, y: GROUND_Y - 60, width: 20, height: 120, material: MaterialType.ICE },
    { x: 1010, y: GROUND_Y - 60, width: 20, height: 120, material: MaterialType.ICE },
    { x: 970, y: GROUND_Y - 127.5, width: 100, height: 15, material: MaterialType.STONE },
    { x: 970, y: GROUND_Y - 10, width: 100, height: 20, material: MaterialType.ICE },

    // Top connecting bridge
    { x: 830, y: GROUND_Y - 145, width: 400, height: 15, material: MaterialType.WOOD },
  ],
  pigs: [
    { x: 690, y: GROUND_Y - 18 },
    { x: 830, y: GROUND_Y - 18 },
    { x: 970, y: GROUND_Y - 18 },
  ],
  theoreticalMaxScore: 15000 + 6000 + 4500 + 2500 + 20000,
};
