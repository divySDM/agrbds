import { BirdType, MaterialType } from '../game/types';
import type { LevelData } from './types';

// Level 17: The Maze - Complex grid of walls hiding pigs
const GROUND_Y = 660;

export const level017: LevelData = {
  id: 17,
  name: 'The Maze',
  birds: [BirdType.YELLOW, BirdType.BOMB, BirdType.RED, BirdType.BOMB, BirdType.YELLOW, BirdType.RED],
  slingshot: { x: 160, y: GROUND_Y - 180 },
  blocks: [
    // Outer frame
    { x: 660, y: GROUND_Y - 80, width: 15, height: 160, material: MaterialType.STONE },
    { x: 1000, y: GROUND_Y - 80, width: 15, height: 160, material: MaterialType.STONE },
    { x: 830, y: GROUND_Y - 167.5, width: 355, height: 15, material: MaterialType.STONE },

    // Internal maze walls - horizontal
    { x: 760, y: GROUND_Y - 55, width: 120, height: 12, material: MaterialType.WOOD },
    { x: 900, y: GROUND_Y - 55, width: 120, height: 12, material: MaterialType.WOOD },
    { x: 830, y: GROUND_Y - 110, width: 200, height: 12, material: MaterialType.WOOD },

    // Internal maze walls - vertical
    { x: 760, y: GROUND_Y - 35, width: 12, height: 70, material: MaterialType.ICE },
    { x: 830, y: GROUND_Y - 80, width: 12, height: 90, material: MaterialType.ICE },
    { x: 900, y: GROUND_Y - 35, width: 12, height: 70, material: MaterialType.ICE },

    // Upper maze section
    { x: 740, y: GROUND_Y - 140, width: 12, height: 55, material: MaterialType.ICE },
    { x: 900, y: GROUND_Y - 140, width: 12, height: 55, material: MaterialType.ICE },
    { x: 830, y: GROUND_Y - 140, width: 12, height: 40, material: MaterialType.WOOD },

    // Ice blocks scattered as obstacles
    { x: 710, y: GROUND_Y - 15, width: 25, height: 30, material: MaterialType.ICE },
    { x: 950, y: GROUND_Y - 15, width: 25, height: 30, material: MaterialType.ICE },
  ],
  pigs: [
    { x: 710, y: GROUND_Y - 18 },
    { x: 830, y: GROUND_Y - 18 },
    { x: 950, y: GROUND_Y - 18 },
    { x: 770, y: GROUND_Y - 130 },
    { x: 890, y: GROUND_Y - 130 },
  ],
  theoreticalMaxScore: 25000 + 3000 + 5000 + 4500 + 10000,
};
