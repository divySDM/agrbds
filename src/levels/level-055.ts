import { BirdType, MaterialType, SpecialBlockType } from '../game/types';
import type { LevelData } from './types';

const GROUND_Y = 660;

export const level055: LevelData = {
  id: 55,
  name: 'Slow Burn',
  birds: [BirdType.RED, BirdType.RED, BirdType.RED],
  slingshot: { x: 150, y: GROUND_Y - 180 },
  blocks: [
    // Explosive barrel next to fortress
    { x: 780, y: GROUND_Y - 30, width: 50, height: 60, material: MaterialType.WOOD, special: SpecialBlockType.EXPLOSIVE_BARREL },
    // Fortress
    { x: 860, y: GROUND_Y - 40, width: 25, height: 80, material: MaterialType.STONE },
    { x: 940, y: GROUND_Y - 40, width: 25, height: 80, material: MaterialType.STONE },
    { x: 900, y: GROUND_Y - 90, width: 110, height: 15, material: MaterialType.STONE },
    { x: 880, y: GROUND_Y - 115, width: 20, height: 35, material: MaterialType.WOOD },
    { x: 920, y: GROUND_Y - 115, width: 20, height: 35, material: MaterialType.WOOD },
    { x: 900, y: GROUND_Y - 140, width: 60, height: 15, material: MaterialType.WOOD },
  ],
  pigs: [
    { x: 900, y: GROUND_Y - 18 },
    { x: 900, y: GROUND_Y - 160 },
  ],
  theoreticalMaxScore: 10000 + 6500 + 1800 + 10000,
};
