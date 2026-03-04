import { BirdType, MaterialType, SpecialBlockType } from '../game/types';
import type { LevelData } from './types';

const GROUND_Y = 660;

export const level054: LevelData = {
  id: 54,
  name: 'Assembly Line',
  birds: [BirdType.RED, BirdType.RED, BirdType.RED, BirdType.BOMB],
  slingshot: { x: 150, y: GROUND_Y - 180 },
  blocks: [
    // Multiple conveyors routing objects through multi-stage path
    { x: 600, y: GROUND_Y - 15, width: 120, height: 25, material: MaterialType.STONE, special: SpecialBlockType.CONVEYOR, direction: 'right' },
    { x: 800, y: GROUND_Y - 80, width: 120, height: 25, material: MaterialType.STONE, special: SpecialBlockType.CONVEYOR, direction: 'left' },
    // Ramp between conveyors
    { x: 700, y: GROUND_Y - 45, width: 80, height: 15, material: MaterialType.STONE },
    // Target at end
    { x: 950, y: GROUND_Y - 40, width: 25, height: 80, material: MaterialType.WOOD },
    { x: 1010, y: GROUND_Y - 40, width: 25, height: 80, material: MaterialType.WOOD },
    { x: 980, y: GROUND_Y - 90, width: 90, height: 15, material: MaterialType.ICE },
    // TNT at bottom
    { x: 980, y: GROUND_Y - 25, width: 40, height: 40, material: MaterialType.WOOD, special: SpecialBlockType.TNT },
  ],
  pigs: [
    { x: 980, y: GROUND_Y - 18 },
    { x: 980, y: GROUND_Y - 110 },
    { x: 700, y: GROUND_Y - 70 },
  ],
  theoreticalMaxScore: 15000 + 5000 + 2000 + 10000,
};
