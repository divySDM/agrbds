import { BirdType, MaterialType, SpecialBlockType } from '../game/types';
import type { LevelData } from './types';

// Level 36: Bounce House - Level lined with gel pads, birds ricochet chaotically
const GROUND_Y = 660;

export const level036: LevelData = {
  id: 36,
  name: 'Bounce House',
  birds: [BirdType.RED, BirdType.RED, BirdType.YELLOW, BirdType.RED, BirdType.RED],
  slingshot: { x: 200, y: GROUND_Y - 180 },
  blocks: [
    // Gel pads lining the ground
    { x: 500, y: GROUND_Y - 15, width: 80, height: 30, material: MaterialType.WOOD, special: SpecialBlockType.GEL_PAD },
    { x: 650, y: GROUND_Y - 15, width: 80, height: 30, material: MaterialType.WOOD, special: SpecialBlockType.GEL_PAD },
    { x: 800, y: GROUND_Y - 15, width: 80, height: 30, material: MaterialType.WOOD, special: SpecialBlockType.GEL_PAD },
    { x: 950, y: GROUND_Y - 15, width: 80, height: 30, material: MaterialType.WOOD, special: SpecialBlockType.GEL_PAD },
    // Scattered structures
    { x: 575, y: GROUND_Y - 100, width: 60, height: 20, material: MaterialType.ICE },
    { x: 725, y: GROUND_Y - 180, width: 60, height: 20, material: MaterialType.ICE },
    { x: 875, y: GROUND_Y - 120, width: 60, height: 20, material: MaterialType.ICE },
    { x: 1050, y: GROUND_Y - 200, width: 60, height: 20, material: MaterialType.ICE },
    // Supporting blocks
    { x: 575, y: GROUND_Y - 55, width: 15, height: 70, material: MaterialType.WOOD },
    { x: 875, y: GROUND_Y - 55, width: 15, height: 70, material: MaterialType.WOOD },
  ],
  pigs: [
    { x: 575, y: GROUND_Y - 120 },
    { x: 725, y: GROUND_Y - 200 },
    { x: 875, y: GROUND_Y - 140 },
    { x: 1050, y: GROUND_Y - 220 },
  ],
  theoreticalMaxScore: 20000 + 4000 + 1000 + 10000, // 4 pigs + 4 ice + 2 wood + 1 remaining
};
