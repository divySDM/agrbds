import { BirdType, MaterialType, SpecialBlockType } from '../game/types';
import type { LevelData } from './types';

// Level 27: Gravity Cascade - Two gravity inverters at different heights
const GROUND_Y = 660;

export const level027: LevelData = {
  id: 27,
  name: 'Gravity Cascade',
  birds: [BirdType.RED, BirdType.RED, BirdType.RED, BirdType.RED],
  slingshot: { x: 200, y: GROUND_Y - 180 },
  blocks: [
    // Lower gravity inverter
    { x: 700, y: GROUND_Y - 25, width: 50, height: 50, material: MaterialType.WOOD, special: SpecialBlockType.GRAVITY_INVERTER },
    // Upper gravity inverter on platform
    { x: 900, y: GROUND_Y - 180, width: 50, height: 50, material: MaterialType.WOOD, special: SpecialBlockType.GRAVITY_INVERTER },
    // Platform for upper inverter
    { x: 900, y: GROUND_Y - 145, width: 80, height: 15, material: MaterialType.STONE },
    // Support for upper platform
    { x: 870, y: GROUND_Y - 70, width: 20, height: 140, material: MaterialType.STONE },
    { x: 930, y: GROUND_Y - 70, width: 20, height: 140, material: MaterialType.STONE },
    // Wood structure with pigs
    { x: 800, y: GROUND_Y - 60, width: 25, height: 120, material: MaterialType.WOOD },
    { x: 850, y: GROUND_Y - 25, width: 80, height: 15, material: MaterialType.WOOD },
    // Floating structure
    { x: 800, y: GROUND_Y - 250, width: 60, height: 15, material: MaterialType.WOOD },
    { x: 785, y: GROUND_Y - 270, width: 20, height: 25, material: MaterialType.ICE },
    { x: 815, y: GROUND_Y - 270, width: 20, height: 25, material: MaterialType.ICE },
  ],
  pigs: [
    { x: 800, y: GROUND_Y - 18 },
    { x: 850, y: GROUND_Y - 40 },
    { x: 800, y: GROUND_Y - 290 },
  ],
  theoreticalMaxScore: 15000 + 2000 + 2000 + 4500 + 5000 + 10000, // 3 pigs + 4 wood + 2 ice + 3 stone + 2 gravity inv + 1 remaining
};
