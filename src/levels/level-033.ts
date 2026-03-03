import { BirdType, MaterialType, SpecialBlockType } from '../game/types';
import type { LevelData } from './types';

// Level 33: Pinball - Multiple gel pads creating a bounce path
const GROUND_Y = 660;

export const level033: LevelData = {
  id: 33,
  name: 'Pinball',
  birds: [BirdType.RED, BirdType.RED, BirdType.RED, BirdType.RED],
  slingshot: { x: 200, y: GROUND_Y - 180 },
  blocks: [
    // Gel pads forming a bounce path
    { x: 500, y: GROUND_Y - 15, width: 80, height: 30, material: MaterialType.WOOD, special: SpecialBlockType.GEL_PAD },
    { x: 700, y: GROUND_Y - 200, width: 80, height: 30, material: MaterialType.WOOD, special: SpecialBlockType.GEL_PAD },
    { x: 900, y: GROUND_Y - 15, width: 80, height: 30, material: MaterialType.WOOD, special: SpecialBlockType.GEL_PAD },
    // Target structures at various heights
    { x: 600, y: GROUND_Y - 300, width: 60, height: 20, material: MaterialType.ICE },
    { x: 800, y: GROUND_Y - 60, width: 60, height: 20, material: MaterialType.ICE },
    { x: 1050, y: GROUND_Y - 250, width: 60, height: 20, material: MaterialType.ICE },
    // Walls to bounce off
    { x: 650, y: GROUND_Y - 100, width: 20, height: 120, material: MaterialType.STONE },
    { x: 850, y: GROUND_Y - 150, width: 20, height: 120, material: MaterialType.STONE },
  ],
  pigs: [
    { x: 600, y: GROUND_Y - 320 },
    { x: 800, y: GROUND_Y - 80 },
    { x: 1050, y: GROUND_Y - 270 },
  ],
  theoreticalMaxScore: 15000 + 3000 + 3000 + 10000, // 3 pigs + 3 ice + 2 stone + 1 remaining bird
};
