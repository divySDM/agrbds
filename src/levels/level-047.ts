import { BirdType, MaterialType } from '../game/types';
import type { LevelData } from './types';

const GROUND_Y = 660;

export const level047: LevelData = {
  id: 47,
  name: 'Rubber Room',
  birds: [BirdType.RED, BirdType.RED, BirdType.RED],
  slingshot: { x: 150, y: GROUND_Y - 180 },
  blocks: [
    // Rubber walls that deflect birds — ricochet behind cover
    { x: 650, y: GROUND_Y - 60, width: 25, height: 120, material: MaterialType.RUBBER },
    { x: 750, y: GROUND_Y - 30, width: 80, height: 15, material: MaterialType.WOOD },
    { x: 900, y: GROUND_Y - 80, width: 25, height: 160, material: MaterialType.RUBBER },
    { x: 1000, y: GROUND_Y - 30, width: 80, height: 15, material: MaterialType.WOOD },
    // Cover above pigs
    { x: 750, y: GROUND_Y - 50, width: 80, height: 15, material: MaterialType.STONE },
    { x: 1000, y: GROUND_Y - 50, width: 80, height: 15, material: MaterialType.STONE },
  ],
  pigs: [
    { x: 750, y: GROUND_Y - 18 },
    { x: 1000, y: GROUND_Y - 18 },
  ],
  theoreticalMaxScore: 10000 + 5100 + 10000,
};
