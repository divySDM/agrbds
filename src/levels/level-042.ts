import { BirdType, MaterialType } from '../game/types';
import type { LevelData } from './types';

const GROUND_Y = 660;

export const level042: LevelData = {
  id: 42,
  name: 'Pinpoint Split',
  birds: [BirdType.BLUE, BirdType.BLUE, BirdType.YELLOW],
  slingshot: { x: 150, y: GROUND_Y - 180 },
  blocks: [
    // Left structure with narrow gap
    { x: 650, y: GROUND_Y - 40, width: 25, height: 80, material: MaterialType.STONE },
    { x: 690, y: GROUND_Y - 40, width: 25, height: 80, material: MaterialType.STONE },
    { x: 670, y: GROUND_Y - 90, width: 70, height: 15, material: MaterialType.WOOD },
    // Middle narrow passage
    { x: 850, y: GROUND_Y - 40, width: 25, height: 80, material: MaterialType.ICE },
    { x: 890, y: GROUND_Y - 40, width: 25, height: 80, material: MaterialType.ICE },
    { x: 870, y: GROUND_Y - 90, width: 70, height: 15, material: MaterialType.WOOD },
    // Right structure
    { x: 1050, y: GROUND_Y - 40, width: 25, height: 80, material: MaterialType.ICE },
    { x: 1090, y: GROUND_Y - 40, width: 25, height: 80, material: MaterialType.ICE },
    { x: 1070, y: GROUND_Y - 90, width: 70, height: 15, material: MaterialType.WOOD },
  ],
  pigs: [
    { x: 670, y: GROUND_Y - 18 },
    { x: 870, y: GROUND_Y - 18 },
    { x: 1070, y: GROUND_Y - 18 },
  ],
  theoreticalMaxScore: 15000 + 7500 + 10000,
};
