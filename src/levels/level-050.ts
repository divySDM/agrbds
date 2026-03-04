import { BirdType, MaterialType, SpecialBlockType } from '../game/types';
import type { LevelData } from './types';

const GROUND_Y = 660;

export const level050: LevelData = {
  id: 50,
  name: 'Avalanche',
  birds: [BirdType.RED, BirdType.RED, BirdType.BOMB],
  slingshot: { x: 150, y: GROUND_Y - 180 },
  blocks: [
    // Hillside of sand blocks — pick the right trigger point
    { x: 700, y: GROUND_Y - 25, width: 50, height: 50, material: MaterialType.SAND },
    { x: 760, y: GROUND_Y - 25, width: 50, height: 50, material: MaterialType.SAND },
    { x: 730, y: GROUND_Y - 65, width: 50, height: 40, material: MaterialType.SAND },
    { x: 790, y: GROUND_Y - 65, width: 50, height: 40, material: MaterialType.SAND },
    { x: 760, y: GROUND_Y - 100, width: 50, height: 35, material: MaterialType.SAND },
    { x: 820, y: GROUND_Y - 100, width: 50, height: 35, material: MaterialType.SAND },
    { x: 790, y: GROUND_Y - 130, width: 50, height: 30, material: MaterialType.SAND },
    // TNT in the hill for extra chaos
    { x: 850, y: GROUND_Y - 25, width: 40, height: 40, material: MaterialType.WOOD, special: SpecialBlockType.TNT },
    // Stone base (solid ground)
    { x: 900, y: GROUND_Y - 15, width: 100, height: 30, material: MaterialType.STONE },
  ],
  pigs: [
    { x: 900, y: GROUND_Y - 40 },
    { x: 950, y: GROUND_Y - 18 },
    { x: 800, y: GROUND_Y - 18 },
  ],
  theoreticalMaxScore: 15000 + 3100 + 2000 + 10000,
};
