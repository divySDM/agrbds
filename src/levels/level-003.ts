import { BirdType, MaterialType } from '../game/types';
import type { LevelData } from './types';

// Level 3: 2 pigs, enclosed box (requires arc shot), 1 bomb + 3 red birds
const GROUND_Y = 660;

export const level003: LevelData = {
  id: 3,
  name: 'Breaking In',
  birds: [BirdType.RED, BirdType.BOMB, BirdType.RED, BirdType.RED],
  slingshot: { x: 200, y: GROUND_Y - 60 },
  blocks: [
    // Enclosed box - left wall
    { x: 730, y: GROUND_Y - 70, width: 20, height: 80, material: MaterialType.WOOD },
    // Right wall
    { x: 870, y: GROUND_Y - 70, width: 20, height: 80, material: MaterialType.WOOD },
    // Roof
    { x: 800, y: GROUND_Y - 120, width: 160, height: 20, material: MaterialType.WOOD },
    // Inner divider
    { x: 800, y: GROUND_Y - 50, width: 20, height: 40, material: MaterialType.ICE },

    // Overhead protection (requires arc)
    { x: 800, y: GROUND_Y - 200, width: 200, height: 15, material: MaterialType.STONE },
    // Support pillars for overhead
    { x: 710, y: GROUND_Y - 160, width: 15, height: 65, material: MaterialType.WOOD },
    { x: 890, y: GROUND_Y - 160, width: 15, height: 65, material: MaterialType.WOOD },
  ],
  pigs: [
    { x: 770, y: GROUND_Y - 48 },
    { x: 830, y: GROUND_Y - 48 },
  ],
  theoreticalMaxScore: 10000 + 3000 + 1000 + 1500 + 20000, // 2 pigs + 5 wood + 1 ice + 1 stone + 2 remaining birds
};
