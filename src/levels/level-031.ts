import { BirdType, MaterialType, SpecialBlockType } from '../game/types';
import type { LevelData } from './types';

// Level 31: TNT Minefield - Ground littered with TNT, pigs on elevated platforms
const GROUND_Y = 660;

export const level031: LevelData = {
  id: 31,
  name: 'TNT Minefield',
  birds: [BirdType.RED, BirdType.RED, BirdType.RED, BirdType.RED],
  slingshot: { x: 200, y: GROUND_Y - 180 },
  blocks: [
    // TNT scattered on ground
    { x: 600, y: GROUND_Y - 25, width: 40, height: 40, material: MaterialType.WOOD, special: SpecialBlockType.TNT },
    { x: 700, y: GROUND_Y - 25, width: 40, height: 40, material: MaterialType.WOOD, special: SpecialBlockType.TNT },
    { x: 800, y: GROUND_Y - 25, width: 40, height: 40, material: MaterialType.WOOD, special: SpecialBlockType.TNT },
    { x: 900, y: GROUND_Y - 25, width: 40, height: 40, material: MaterialType.WOOD, special: SpecialBlockType.TNT },
    { x: 1000, y: GROUND_Y - 25, width: 40, height: 40, material: MaterialType.WOOD, special: SpecialBlockType.TNT },
    // Elevated platforms
    { x: 700, y: GROUND_Y - 120, width: 100, height: 15, material: MaterialType.STONE },
    { x: 670, y: GROUND_Y - 65, width: 20, height: 100, material: MaterialType.STONE },
    { x: 730, y: GROUND_Y - 65, width: 20, height: 100, material: MaterialType.STONE },
    { x: 950, y: GROUND_Y - 100, width: 80, height: 15, material: MaterialType.STONE },
    { x: 925, y: GROUND_Y - 45, width: 20, height: 80, material: MaterialType.STONE },
    { x: 975, y: GROUND_Y - 45, width: 20, height: 80, material: MaterialType.STONE },
  ],
  pigs: [
    { x: 700, y: GROUND_Y - 140 },
    { x: 950, y: GROUND_Y - 120 },
    { x: 800, y: GROUND_Y - 18 },
  ],
  theoreticalMaxScore: 15000 + 9000 + 10000 + 10000, // 3 pigs + 6 stone + 5 TNT + 1 remaining bird
};
