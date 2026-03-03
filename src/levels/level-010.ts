import { BirdType, MaterialType } from '../game/types';
import type { LevelData } from './types';

// Level 10: Triple Threat - Three widely-spaced towers
const GROUND_Y = 660;

export const level010: LevelData = {
  id: 10,
  name: 'Triple Threat',
  birds: [BirdType.YELLOW, BirdType.YELLOW, BirdType.RED, BirdType.BOMB],
  slingshot: { x: 170, y: GROUND_Y - 180 },
  blocks: [
    // Left tower (wood)
    { x: 580, y: GROUND_Y - 60, width: 20, height: 120, material: MaterialType.WOOD },
    { x: 640, y: GROUND_Y - 60, width: 20, height: 120, material: MaterialType.WOOD },
    { x: 610, y: GROUND_Y - 130, width: 80, height: 20, material: MaterialType.WOOD },
    { x: 610, y: GROUND_Y - 155, width: 30, height: 30, material: MaterialType.WOOD },

    // Center tower (ice + stone)
    { x: 790, y: GROUND_Y - 70, width: 20, height: 140, material: MaterialType.ICE },
    { x: 860, y: GROUND_Y - 70, width: 20, height: 140, material: MaterialType.ICE },
    { x: 825, y: GROUND_Y - 147.5, width: 90, height: 15, material: MaterialType.STONE },
    { x: 825, y: GROUND_Y - 170, width: 40, height: 30, material: MaterialType.ICE },

    // Right tower (stone + wood)
    { x: 1000, y: GROUND_Y - 50, width: 25, height: 100, material: MaterialType.STONE },
    { x: 1070, y: GROUND_Y - 50, width: 25, height: 100, material: MaterialType.STONE },
    { x: 1035, y: GROUND_Y - 110, width: 100, height: 20, material: MaterialType.WOOD },
    { x: 1035, y: GROUND_Y - 135, width: 50, height: 30, material: MaterialType.WOOD },
  ],
  pigs: [
    { x: 610, y: GROUND_Y - 18 },
    { x: 825, y: GROUND_Y - 18 },
    { x: 1035, y: GROUND_Y - 18 },
  ],
  theoreticalMaxScore: 15000 + 2000 + 3000 + 4500 + 1000 + 10000,
};
