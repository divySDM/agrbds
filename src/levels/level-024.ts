import { BirdType, MaterialType, SpecialBlockType } from '../game/types';
import type { LevelData } from './types';

// Level 24: Defying Gravity - Gravity inverter beneath a wood structure
const GROUND_Y = 660;

export const level024: LevelData = {
  id: 24,
  name: 'Defying Gravity',
  birds: [BirdType.RED, BirdType.RED, BirdType.RED],
  slingshot: { x: 200, y: GROUND_Y - 180 },
  blocks: [
    // Gravity inverter at base
    { x: 800, y: GROUND_Y - 25, width: 50, height: 50, material: MaterialType.WOOD, special: SpecialBlockType.GRAVITY_INVERTER },
    // Wood structure above
    { x: 770, y: GROUND_Y - 80, width: 20, height: 60, material: MaterialType.WOOD },
    { x: 830, y: GROUND_Y - 80, width: 20, height: 60, material: MaterialType.WOOD },
    { x: 800, y: GROUND_Y - 120, width: 80, height: 15, material: MaterialType.WOOD },
    { x: 800, y: GROUND_Y - 150, width: 50, height: 40, material: MaterialType.WOOD },
    // Ice decorations on top
    { x: 785, y: GROUND_Y - 180, width: 20, height: 20, material: MaterialType.ICE },
    { x: 815, y: GROUND_Y - 180, width: 20, height: 20, material: MaterialType.ICE },
  ],
  pigs: [
    { x: 800, y: GROUND_Y - 18 },
    { x: 800, y: GROUND_Y - 200 },
  ],
  theoreticalMaxScore: 10000 + 2500 + 2000 + 2500 + 10000, // 2 pigs + 5 wood + 2 ice + 1 gravity inverter + 1 remaining bird
};
