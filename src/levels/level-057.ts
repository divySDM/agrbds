import { BirdType, MaterialType, SpecialBlockType } from '../game/types';
import type { LevelData } from './types';

const GROUND_Y = 660;

export const level057: LevelData = {
  id: 57,
  name: 'Mix Tape I',
  birds: [BirdType.BLUE, BirdType.BLUE, BirdType.YELLOW, BirdType.RED],
  slingshot: { x: 150, y: GROUND_Y - 180 },
  blocks: [
    // Rubber walls for ricochet splits
    { x: 550, y: GROUND_Y - 80, width: 25, height: 120, material: MaterialType.RUBBER },
    { x: 750, y: GROUND_Y - 100, width: 25, height: 140, material: MaterialType.RUBBER },
    // Gel pad for bouncing
    { x: 650, y: GROUND_Y - 15, width: 80, height: 25, material: MaterialType.WOOD, special: SpecialBlockType.GEL_PAD },
    // Target structures
    { x: 850, y: GROUND_Y - 40, width: 20, height: 80, material: MaterialType.ICE },
    { x: 900, y: GROUND_Y - 40, width: 20, height: 80, material: MaterialType.ICE },
    { x: 875, y: GROUND_Y - 90, width: 80, height: 15, material: MaterialType.WOOD },
    { x: 1050, y: GROUND_Y - 30, width: 50, height: 60, material: MaterialType.ICE },
    { x: 1050, y: GROUND_Y - 70, width: 50, height: 15, material: MaterialType.WOOD },
  ],
  pigs: [
    { x: 875, y: GROUND_Y - 18 },
    { x: 875, y: GROUND_Y - 108 },
    { x: 1050, y: GROUND_Y - 18 },
    { x: 1050, y: GROUND_Y - 90 },
  ],
  theoreticalMaxScore: 20000 + 6400 + 10000,
};
