import { BirdType, MaterialType } from '../game/types';
import type { LevelData } from './types';

// Level 2: 2 pigs, L-shaped wood structure, 3 red birds
const GROUND_Y = 660;

export const level002: LevelData = {
  id: 2,
  name: 'Double Trouble',
  birds: [BirdType.RED, BirdType.RED, BirdType.RED],
  slingshot: { x: 200, y: GROUND_Y - 180 },
  blocks: [
    // Left vertical
    { x: 700, y: GROUND_Y - 60, width: 25, height: 120, material: MaterialType.WOOD },
    // Right vertical
    { x: 850, y: GROUND_Y - 60, width: 25, height: 120, material: MaterialType.WOOD },
    // Top horizontal
    { x: 775, y: GROUND_Y - 130, width: 180, height: 20, material: MaterialType.WOOD },
    // Extension right
    { x: 920, y: GROUND_Y - 20, width: 25, height: 40, material: MaterialType.WOOD },
    // Extension top
    { x: 885, y: GROUND_Y - 50, width: 100, height: 20, material: MaterialType.WOOD },
  ],
  pigs: [
    { x: 775, y: GROUND_Y - 18 },
    { x: 885, y: GROUND_Y - 18 },
  ],
  theoreticalMaxScore: 10000 + 2500 + 10000, // 2 pigs + 5 wood blocks + 1 remaining bird
};
