import { BirdType, MaterialType } from '../game/types';
import type { LevelData } from './types';

const GROUND_Y = 660;

export const level041: LevelData = {
  id: 41,
  name: "Three's Company",
  birds: [BirdType.BLUE, BirdType.BLUE, BirdType.RED],
  slingshot: { x: 150, y: GROUND_Y - 180 },
  blocks: [
    // Three ice pillars spread wide
    { x: 600, y: GROUND_Y - 50, width: 20, height: 100, material: MaterialType.ICE },
    { x: 800, y: GROUND_Y - 50, width: 20, height: 100, material: MaterialType.ICE },
    { x: 1000, y: GROUND_Y - 50, width: 20, height: 100, material: MaterialType.ICE },
    // Small roofs
    { x: 600, y: GROUND_Y - 110, width: 40, height: 10, material: MaterialType.ICE },
    { x: 800, y: GROUND_Y - 110, width: 40, height: 10, material: MaterialType.ICE },
    { x: 1000, y: GROUND_Y - 110, width: 40, height: 10, material: MaterialType.ICE },
  ],
  pigs: [
    { x: 600, y: GROUND_Y - 18 },
    { x: 800, y: GROUND_Y - 18 },
    { x: 1000, y: GROUND_Y - 18 },
  ],
  theoreticalMaxScore: 15000 + 6000 + 10000,
};
