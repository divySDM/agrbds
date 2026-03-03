import { BirdType, MaterialType } from '../game/types';
import type { LevelData } from './types';

// Level 9: Stone Cold - Heavy stone fortress, bombs required
const GROUND_Y = 660;

export const level009: LevelData = {
  id: 9,
  name: 'Stone Cold',
  birds: [BirdType.BOMB, BirdType.RED, BirdType.BOMB, BirdType.RED, BirdType.YELLOW],
  slingshot: { x: 180, y: GROUND_Y - 180 },
  blocks: [
    // Thick stone base walls
    { x: 700, y: GROUND_Y - 50, width: 30, height: 100, material: MaterialType.STONE },
    { x: 950, y: GROUND_Y - 50, width: 30, height: 100, material: MaterialType.STONE },

    // Inner stone dividers
    { x: 780, y: GROUND_Y - 40, width: 20, height: 80, material: MaterialType.STONE },
    { x: 870, y: GROUND_Y - 40, width: 20, height: 80, material: MaterialType.STONE },

    // Stone roof
    { x: 825, y: GROUND_Y - 105, width: 280, height: 20, material: MaterialType.STONE },

    // Upper wood structure
    { x: 780, y: GROUND_Y - 130, width: 20, height: 30, material: MaterialType.WOOD },
    { x: 870, y: GROUND_Y - 130, width: 20, height: 30, material: MaterialType.WOOD },
    { x: 825, y: GROUND_Y - 155, width: 110, height: 20, material: MaterialType.WOOD },

    // Ice decorations on top
    { x: 825, y: GROUND_Y - 175, width: 40, height: 20, material: MaterialType.ICE },

    // Ground-level ice blocks between pigs
    { x: 740, y: GROUND_Y - 15, width: 50, height: 30, material: MaterialType.ICE },
    { x: 825, y: GROUND_Y - 15, width: 50, height: 30, material: MaterialType.ICE },
    { x: 910, y: GROUND_Y - 15, width: 50, height: 30, material: MaterialType.ICE },
  ],
  pigs: [
    { x: 740, y: GROUND_Y - 18 },
    { x: 825, y: GROUND_Y - 18 },
    { x: 910, y: GROUND_Y - 18 },
    { x: 825, y: GROUND_Y - 125 },
  ],
  theoreticalMaxScore: 20000 + 1500 + 3000 + 7500 + 2000 + 20000,
};
