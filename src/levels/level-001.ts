import { BirdType, MaterialType } from '../game/types';
import type { LevelData } from './types';

// Level 1: Tutorial - 1 pig, simple 3-block tower, 3 red birds
const GROUND_Y = 660;

export const level001: LevelData = {
  id: 1,
  name: 'First Contact',
  birds: [BirdType.RED, BirdType.RED, BirdType.RED],
  slingshot: { x: 200, y: GROUND_Y - 180 },
  blocks: [
    // Simple tower
    { x: 750, y: GROUND_Y - 60, width: 25, height: 120, material: MaterialType.WOOD },
    { x: 850, y: GROUND_Y - 60, width: 25, height: 120, material: MaterialType.WOOD },
    { x: 800, y: GROUND_Y - 130, width: 130, height: 20, material: MaterialType.WOOD },
  ],
  pigs: [
    { x: 800, y: GROUND_Y - 18 },
  ],
  theoreticalMaxScore: 5000 + 1500 + 20000, // 1 pig + 3 wood blocks + 2 remaining birds
};
