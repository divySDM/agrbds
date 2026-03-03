import { BirdType, MaterialType, SpecialBlockType } from '../game/types';
import type { LevelData } from './types';

// Level 22: Chain Reaction - 4 TNT crates in a line, stone towers between
const GROUND_Y = 660;

export const level022: LevelData = {
  id: 22,
  name: 'Chain Reaction',
  birds: [BirdType.RED, BirdType.RED, BirdType.RED],
  slingshot: { x: 200, y: GROUND_Y - 180 },
  blocks: [
    // TNT chain along the ground
    { x: 650, y: GROUND_Y - 25, width: 50, height: 50, material: MaterialType.WOOD, special: SpecialBlockType.TNT },
    { x: 750, y: GROUND_Y - 25, width: 50, height: 50, material: MaterialType.WOOD, special: SpecialBlockType.TNT },
    { x: 850, y: GROUND_Y - 25, width: 50, height: 50, material: MaterialType.WOOD, special: SpecialBlockType.TNT },
    { x: 950, y: GROUND_Y - 25, width: 50, height: 50, material: MaterialType.WOOD, special: SpecialBlockType.TNT },
    // Stone towers between TNT
    { x: 700, y: GROUND_Y - 70, width: 20, height: 80, material: MaterialType.STONE },
    { x: 800, y: GROUND_Y - 70, width: 20, height: 80, material: MaterialType.STONE },
    { x: 900, y: GROUND_Y - 70, width: 20, height: 80, material: MaterialType.STONE },
  ],
  pigs: [
    { x: 700, y: GROUND_Y - 18 },
    { x: 900, y: GROUND_Y - 18 },
  ],
  theoreticalMaxScore: 10000 + 4500 + 8000 + 20000, // 2 pigs + 3 stone + 4 TNT + 2 remaining birds
};
