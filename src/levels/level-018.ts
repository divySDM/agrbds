import { BirdType, MaterialType } from '../game/types';
import type { LevelData } from './types';

// Level 18: Sky High - Tall stacked structure with pigs at various heights
const GROUND_Y = 660;

export const level018: LevelData = {
  id: 18,
  name: 'Sky High',
  birds: [BirdType.RED, BirdType.YELLOW, BirdType.BOMB, BirdType.RED, BirdType.YELLOW],
  slingshot: { x: 180, y: GROUND_Y - 180 },
  blocks: [
    // Ground floor
    { x: 810, y: GROUND_Y - 40, width: 20, height: 80, material: MaterialType.STONE },
    { x: 890, y: GROUND_Y - 40, width: 20, height: 80, material: MaterialType.STONE },
    { x: 850, y: GROUND_Y - 87.5, width: 100, height: 15, material: MaterialType.STONE },

    // Second floor
    { x: 825, y: GROUND_Y - 115, width: 15, height: 40, material: MaterialType.WOOD },
    { x: 875, y: GROUND_Y - 115, width: 15, height: 40, material: MaterialType.WOOD },
    { x: 850, y: GROUND_Y - 142.5, width: 80, height: 15, material: MaterialType.WOOD },

    // Third floor
    { x: 830, y: GROUND_Y - 165, width: 15, height: 30, material: MaterialType.ICE },
    { x: 870, y: GROUND_Y - 165, width: 15, height: 30, material: MaterialType.ICE },
    { x: 850, y: GROUND_Y - 187.5, width: 60, height: 15, material: MaterialType.ICE },

    // Spire
    { x: 850, y: GROUND_Y - 210, width: 20, height: 30, material: MaterialType.WOOD },
    { x: 850, y: GROUND_Y - 235, width: 12, height: 20, material: MaterialType.ICE },

    // Buttress supports on sides
    { x: 770, y: GROUND_Y - 25, width: 15, height: 50, material: MaterialType.WOOD },
    { x: 930, y: GROUND_Y - 25, width: 15, height: 50, material: MaterialType.WOOD },
    { x: 790, y: GROUND_Y - 55, width: 60, height: 10, material: MaterialType.WOOD },
    { x: 910, y: GROUND_Y - 55, width: 60, height: 10, material: MaterialType.WOOD },
  ],
  pigs: [
    { x: 850, y: GROUND_Y - 18 },
    { x: 850, y: GROUND_Y - 105 },
    { x: 850, y: GROUND_Y - 155 },
    { x: 850, y: GROUND_Y - 205 },
  ],
  theoreticalMaxScore: 20000 + 2500 + 3000 + 4500 + 1000 + 10000,
};
