import { BirdType, MaterialType, SpecialBlockType } from '../game/types';
import type { LevelData } from './types';

const GROUND_Y = 660;

export const level051: LevelData = {
  id: 51,
  name: 'Magnetized',
  birds: [BirdType.RED, BirdType.RED, BirdType.RED],
  slingshot: { x: 150, y: GROUND_Y - 180 },
  blocks: [
    // Magnet block that pulls birds off course
    { x: 650, y: GROUND_Y - 60, width: 50, height: 50, material: MaterialType.STONE, special: SpecialBlockType.MAGNET },
    // Target structure behind the magnet
    { x: 900, y: GROUND_Y - 40, width: 25, height: 80, material: MaterialType.WOOD },
    { x: 960, y: GROUND_Y - 40, width: 25, height: 80, material: MaterialType.WOOD },
    { x: 930, y: GROUND_Y - 90, width: 90, height: 15, material: MaterialType.WOOD },
    { x: 930, y: GROUND_Y - 110, width: 40, height: 25, material: MaterialType.ICE },
  ],
  pigs: [
    { x: 930, y: GROUND_Y - 18 },
    { x: 930, y: GROUND_Y - 130 },
  ],
  theoreticalMaxScore: 10000 + 3500 + 1500 + 10000,
};
