import { BirdType, MaterialType } from '../game/types';
import type { LevelData } from './types';

const GROUND_Y = 660;

export const level046: LevelData = {
  id: 46,
  name: 'Wrecking Crew',
  birds: [BirdType.BIG, BirdType.RED, BirdType.RED, BirdType.RED],
  slingshot: { x: 150, y: GROUND_Y - 180 },
  blocks: [
    // Multi-support structure — smash center support to collapse towers
    // Left tower
    { x: 700, y: GROUND_Y - 50, width: 25, height: 100, material: MaterialType.STONE },
    { x: 700, y: GROUND_Y - 110, width: 50, height: 15, material: MaterialType.WOOD },
    // Center support (key structural element)
    { x: 850, y: GROUND_Y - 50, width: 25, height: 100, material: MaterialType.STONE },
    { x: 850, y: GROUND_Y - 110, width: 50, height: 15, material: MaterialType.WOOD },
    // Right tower
    { x: 1000, y: GROUND_Y - 50, width: 25, height: 100, material: MaterialType.STONE },
    { x: 1000, y: GROUND_Y - 110, width: 50, height: 15, material: MaterialType.WOOD },
    // Connecting platform
    { x: 850, y: GROUND_Y - 130, width: 350, height: 15, material: MaterialType.WOOD },
    // Upper blocks
    { x: 770, y: GROUND_Y - 155, width: 40, height: 30, material: MaterialType.WOOD },
    { x: 930, y: GROUND_Y - 155, width: 40, height: 30, material: MaterialType.WOOD },
  ],
  pigs: [
    { x: 700, y: GROUND_Y - 18 },
    { x: 850, y: GROUND_Y - 18 },
    { x: 1000, y: GROUND_Y - 18 },
  ],
  theoreticalMaxScore: 15000 + 7000 + 20000,
};
