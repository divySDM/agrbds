import { BirdType, MaterialType } from '../game/types';
import type { LevelData } from './types';

const GROUND_Y = 660;

export const level045: LevelData = {
  id: 45,
  name: 'Heavy Lesson',
  birds: [BirdType.BIG, BirdType.RED, BirdType.RED],
  slingshot: { x: 150, y: GROUND_Y - 180 },
  blocks: [
    // Stone fortress — only mass can punch through
    { x: 800, y: GROUND_Y - 40, width: 30, height: 80, material: MaterialType.STONE },
    { x: 900, y: GROUND_Y - 40, width: 30, height: 80, material: MaterialType.STONE },
    { x: 850, y: GROUND_Y - 90, width: 130, height: 20, material: MaterialType.STONE },
    { x: 850, y: GROUND_Y - 120, width: 80, height: 20, material: MaterialType.STONE },
    { x: 830, y: GROUND_Y - 150, width: 20, height: 40, material: MaterialType.STONE },
    { x: 870, y: GROUND_Y - 150, width: 20, height: 40, material: MaterialType.STONE },
    { x: 850, y: GROUND_Y - 180, width: 60, height: 15, material: MaterialType.STONE },
  ],
  pigs: [
    { x: 850, y: GROUND_Y - 18 },
    { x: 850, y: GROUND_Y - 200 },
  ],
  theoreticalMaxScore: 10000 + 10500 + 10000,
};
