import { BirdType, MaterialType } from '../game/types';
import type { LevelData } from './types';

const GROUND_Y = 660;

export const level044: LevelData = {
  id: 44,
  name: 'Recoil Shot',
  birds: [BirdType.WHITE, BirdType.WHITE, BirdType.RED],
  slingshot: { x: 150, y: GROUND_Y - 180 },
  blocks: [
    // Ground level target behind wall
    { x: 750, y: GROUND_Y - 40, width: 25, height: 80, material: MaterialType.STONE },
    { x: 850, y: GROUND_Y - 25, width: 60, height: 50, material: MaterialType.WOOD },
    // Elevated target
    { x: 600, y: GROUND_Y - 180, width: 80, height: 15, material: MaterialType.WOOD },
    { x: 580, y: GROUND_Y - 160, width: 20, height: 30, material: MaterialType.ICE },
    { x: 620, y: GROUND_Y - 160, width: 20, height: 30, material: MaterialType.ICE },
    // Right structure
    { x: 1000, y: GROUND_Y - 40, width: 25, height: 80, material: MaterialType.STONE },
    { x: 1060, y: GROUND_Y - 25, width: 60, height: 50, material: MaterialType.WOOD },
  ],
  pigs: [
    { x: 850, y: GROUND_Y - 18 },
    { x: 600, y: GROUND_Y - 200 },
    { x: 1060, y: GROUND_Y - 18 },
  ],
  theoreticalMaxScore: 15000 + 5500 + 10000,
};
