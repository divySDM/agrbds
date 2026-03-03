import { BirdType, MaterialType } from '../game/types';
import type { LevelData } from './types';

// Level 6: Introduce Yellow Bird - tall ice columns requiring precision
const GROUND_Y = 660;

export const level006: LevelData = {
  id: 6,
  name: 'Speed Demon',
  birds: [BirdType.YELLOW, BirdType.YELLOW, BirdType.RED, BirdType.RED],
  slingshot: { x: 190, y: GROUND_Y - 180 },
  blocks: [
    // Two ice towers side by side
    // Left tower
    { x: 700, y: GROUND_Y - 80, width: 20, height: 160, material: MaterialType.ICE },
    { x: 740, y: GROUND_Y - 80, width: 20, height: 160, material: MaterialType.ICE },
    { x: 720, y: GROUND_Y - 168, width: 60, height: 15, material: MaterialType.ICE },

    // Right tower
    { x: 850, y: GROUND_Y - 80, width: 20, height: 160, material: MaterialType.ICE },
    { x: 890, y: GROUND_Y - 80, width: 20, height: 160, material: MaterialType.ICE },
    { x: 870, y: GROUND_Y - 168, width: 60, height: 15, material: MaterialType.ICE },

    // Connecting bridge
    { x: 785, y: GROUND_Y - 180, width: 200, height: 15, material: MaterialType.WOOD },

    // Top structure
    { x: 785, y: GROUND_Y - 210, width: 15, height: 45, material: MaterialType.WOOD },
    { x: 785, y: GROUND_Y - 240, width: 60, height: 15, material: MaterialType.WOOD },
  ],
  pigs: [
    { x: 720, y: GROUND_Y - 18 },
    { x: 870, y: GROUND_Y - 18 },
  ],
  theoreticalMaxScore: 10000 + 6000 + 1000 + 20000, // 2 pigs + 6 ice + 4 wood blocks + 2 remaining birds
};
