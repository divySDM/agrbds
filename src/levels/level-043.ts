import { BirdType, MaterialType } from '../game/types';
import type { LevelData } from './types';

const GROUND_Y = 660;

export const level043: LevelData = {
  id: 43,
  name: 'Egg Drop 101',
  birds: [BirdType.WHITE, BirdType.WHITE, BirdType.RED],
  slingshot: { x: 150, y: GROUND_Y - 180 },
  blocks: [
    // Stone bunker — pig hidden behind thick walls, reachable only from above
    { x: 800, y: GROUND_Y - 30, width: 25, height: 60, material: MaterialType.STONE },
    { x: 900, y: GROUND_Y - 30, width: 25, height: 60, material: MaterialType.STONE },
    { x: 850, y: GROUND_Y - 70, width: 130, height: 20, material: MaterialType.STONE },
    // Open top — egg can drop in
    { x: 830, y: GROUND_Y - 100, width: 15, height: 40, material: MaterialType.WOOD },
    { x: 870, y: GROUND_Y - 100, width: 15, height: 40, material: MaterialType.WOOD },
  ],
  pigs: [
    { x: 850, y: GROUND_Y - 18 },
    { x: 850, y: GROUND_Y - 90 },
  ],
  theoreticalMaxScore: 10000 + 5000 + 10000,
};
