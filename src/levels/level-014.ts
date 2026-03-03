import { BirdType, MaterialType } from '../game/types';
import type { LevelData } from './types';

// Level 14: Suspension - Precarious balancing act, knock supports for chain reactions
const GROUND_Y = 660;

export const level014: LevelData = {
  id: 14,
  name: 'Suspension',
  birds: [BirdType.YELLOW, BirdType.RED, BirdType.RED],
  slingshot: { x: 190, y: GROUND_Y - 180 },
  blocks: [
    // Tall thin left support
    { x: 700, y: GROUND_Y - 90, width: 15, height: 180, material: MaterialType.WOOD },

    // Long horizontal beam balanced on left support
    { x: 790, y: GROUND_Y - 187.5, width: 200, height: 15, material: MaterialType.WOOD },

    // Blocks stacked on beam (will topple)
    { x: 750, y: GROUND_Y - 210, width: 30, height: 30, material: MaterialType.ICE },
    { x: 830, y: GROUND_Y - 210, width: 30, height: 30, material: MaterialType.ICE },

    // Right structure - tall tower
    { x: 920, y: GROUND_Y - 60, width: 20, height: 120, material: MaterialType.WOOD },
    { x: 970, y: GROUND_Y - 60, width: 20, height: 120, material: MaterialType.WOOD },
    { x: 945, y: GROUND_Y - 130, width: 70, height: 20, material: MaterialType.WOOD },

    // Small ice blocks on right tower top
    { x: 930, y: GROUND_Y - 150, width: 20, height: 20, material: MaterialType.ICE },
    { x: 960, y: GROUND_Y - 150, width: 20, height: 20, material: MaterialType.ICE },

    // Ground-level stone shield for center pig
    { x: 830, y: GROUND_Y - 20, width: 60, height: 40, material: MaterialType.STONE },
  ],
  pigs: [
    { x: 770, y: GROUND_Y - 18 },
    { x: 830, y: GROUND_Y - 50 },
    { x: 945, y: GROUND_Y - 18 },
  ],
  theoreticalMaxScore: 15000 + 2500 + 4000 + 1500 + 10000,
};
