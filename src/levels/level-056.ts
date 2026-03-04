import { BirdType, MaterialType, SpecialBlockType } from '../game/types';
import type { LevelData } from './types';

const GROUND_Y = 660;

export const level056: LevelData = {
  id: 56,
  name: 'Delayed Reaction',
  birds: [BirdType.RED, BirdType.RED, BirdType.YELLOW],
  slingshot: { x: 150, y: GROUND_Y - 180 },
  blocks: [
    // Chain of explosive barrels
    { x: 650, y: GROUND_Y - 30, width: 45, height: 55, material: MaterialType.WOOD, special: SpecialBlockType.EXPLOSIVE_BARREL },
    { x: 780, y: GROUND_Y - 30, width: 45, height: 55, material: MaterialType.WOOD, special: SpecialBlockType.EXPLOSIVE_BARREL },
    { x: 910, y: GROUND_Y - 30, width: 45, height: 55, material: MaterialType.WOOD, special: SpecialBlockType.EXPLOSIVE_BARREL },
    // Structures between barrels
    { x: 715, y: GROUND_Y - 30, width: 20, height: 60, material: MaterialType.WOOD },
    { x: 845, y: GROUND_Y - 30, width: 20, height: 60, material: MaterialType.WOOD },
    // TNT at the end for extra boom
    { x: 1020, y: GROUND_Y - 25, width: 40, height: 40, material: MaterialType.WOOD, special: SpecialBlockType.TNT },
    // Stone wall protecting pigs
    { x: 1070, y: GROUND_Y - 40, width: 20, height: 80, material: MaterialType.STONE },
    { x: 1110, y: GROUND_Y - 25, width: 50, height: 50, material: MaterialType.WOOD },
  ],
  pigs: [
    { x: 715, y: GROUND_Y - 18 },
    { x: 845, y: GROUND_Y - 18 },
    { x: 1110, y: GROUND_Y - 18 },
  ],
  theoreticalMaxScore: 15000 + 4500 + 5400 + 2000 + 10000,
};
