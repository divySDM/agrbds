import { BirdType, MaterialType, SpecialBlockType } from '../game/types';
import type { LevelData } from './types';

// Level 23: Bounce Shot - Pig behind tall stone wall, gel pad for ricochet
const GROUND_Y = 660;

export const level023: LevelData = {
  id: 23,
  name: 'Bounce Shot',
  birds: [BirdType.RED, BirdType.RED, BirdType.RED],
  slingshot: { x: 200, y: GROUND_Y - 180 },
  blocks: [
    // Tall stone wall blocking direct path
    { x: 700, y: GROUND_Y - 100, width: 30, height: 200, material: MaterialType.STONE },
    // Gel pad on ground in front of wall
    { x: 600, y: GROUND_Y - 15, width: 80, height: 30, material: MaterialType.WOOD, special: SpecialBlockType.GEL_PAD },
    // Structure behind wall
    { x: 850, y: GROUND_Y - 40, width: 20, height: 80, material: MaterialType.WOOD },
    { x: 910, y: GROUND_Y - 40, width: 20, height: 80, material: MaterialType.WOOD },
    { x: 880, y: GROUND_Y - 90, width: 90, height: 15, material: MaterialType.WOOD },
  ],
  pigs: [
    { x: 880, y: GROUND_Y - 18 },
    { x: 850, y: GROUND_Y - 110 },
  ],
  theoreticalMaxScore: 10000 + 1500 + 2000 + 10000, // 2 pigs + 3 wood + 1 stone + 1 remaining bird
};
