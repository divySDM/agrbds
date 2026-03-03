import { BirdType, MaterialType, SpecialBlockType } from '../game/types';
import type { LevelData } from './types';

// Level 21: TNT Tutorial - Simple wood structure with TNT at base
const GROUND_Y = 660;

export const level021: LevelData = {
  id: 21,
  name: 'TNT Tutorial',
  birds: [BirdType.RED, BirdType.RED, BirdType.RED],
  slingshot: { x: 200, y: GROUND_Y - 180 },
  blocks: [
    // TNT at the base of the structure
    { x: 800, y: GROUND_Y - 25, width: 50, height: 50, material: MaterialType.WOOD, special: SpecialBlockType.TNT },
    // Wood tower above
    { x: 775, y: GROUND_Y - 80, width: 20, height: 60, material: MaterialType.WOOD },
    { x: 825, y: GROUND_Y - 80, width: 20, height: 60, material: MaterialType.WOOD },
    { x: 800, y: GROUND_Y - 120, width: 70, height: 15, material: MaterialType.WOOD },
    { x: 800, y: GROUND_Y - 145, width: 40, height: 35, material: MaterialType.WOOD },
  ],
  pigs: [
    { x: 800, y: GROUND_Y - 18 },
  ],
  theoreticalMaxScore: 5000 + 2500 + 2000 + 20000, // 1 pig + 5 wood + 1 TNT + 2 remaining birds
};
