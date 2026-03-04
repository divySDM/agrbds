import { BirdType, MaterialType } from '../game/types';
import type { LevelData } from './types';

const GROUND_Y = 660;

export const level049: LevelData = {
  id: 49,
  name: 'Sandcastle',
  birds: [BirdType.RED, BirdType.RED],
  slingshot: { x: 150, y: GROUND_Y - 180 },
  blocks: [
    // Tall sand tower — hit the base, whole tower crumbles
    { x: 850, y: GROUND_Y - 25, width: 60, height: 50, material: MaterialType.SAND },
    { x: 850, y: GROUND_Y - 60, width: 50, height: 40, material: MaterialType.SAND },
    { x: 850, y: GROUND_Y - 90, width: 45, height: 35, material: MaterialType.SAND },
    { x: 850, y: GROUND_Y - 115, width: 40, height: 30, material: MaterialType.SAND },
    { x: 850, y: GROUND_Y - 140, width: 35, height: 25, material: MaterialType.SAND },
    { x: 850, y: GROUND_Y - 160, width: 30, height: 20, material: MaterialType.SAND },
  ],
  pigs: [
    { x: 850, y: GROUND_Y - 180 },
    { x: 850, y: GROUND_Y - 50 },
  ],
  theoreticalMaxScore: 10000 + 1200 + 10000,
};
