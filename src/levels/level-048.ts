import { BirdType, MaterialType } from '../game/types';
import type { LevelData } from './types';

const GROUND_Y = 660;

export const level048: LevelData = {
  id: 48,
  name: 'Bank Shot',
  birds: [BirdType.YELLOW, BirdType.YELLOW, BirdType.YELLOW],
  slingshot: { x: 150, y: GROUND_Y - 180 },
  blocks: [
    // Angled rubber surfaces for geometric ricochet puzzle
    { x: 550, y: GROUND_Y - 100, width: 25, height: 100, material: MaterialType.RUBBER },
    { x: 700, y: GROUND_Y - 150, width: 100, height: 20, material: MaterialType.RUBBER },
    { x: 900, y: GROUND_Y - 80, width: 25, height: 100, material: MaterialType.RUBBER },
    // Target structures behind cover
    { x: 800, y: GROUND_Y - 30, width: 60, height: 60, material: MaterialType.ICE },
    { x: 1050, y: GROUND_Y - 25, width: 50, height: 50, material: MaterialType.WOOD },
    { x: 1050, y: GROUND_Y - 60, width: 50, height: 15, material: MaterialType.WOOD },
    // Stone shield
    { x: 950, y: GROUND_Y - 40, width: 20, height: 80, material: MaterialType.STONE },
  ],
  pigs: [
    { x: 800, y: GROUND_Y - 18 },
    { x: 1050, y: GROUND_Y - 18 },
    { x: 1050, y: GROUND_Y - 78 },
  ],
  theoreticalMaxScore: 15000 + 5900 + 10000,
};
