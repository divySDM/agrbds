import { BirdType, MaterialType, SpecialBlockType } from '../game/types';
import type { LevelData } from './types';

const GROUND_Y = 660;

export const level053: LevelData = {
  id: 53,
  name: 'Beltline',
  birds: [BirdType.RED, BirdType.RED, BirdType.RED],
  slingshot: { x: 150, y: GROUND_Y - 180 },
  blocks: [
    // Conveyor that moves debris into weak point
    { x: 750, y: GROUND_Y - 15, width: 120, height: 25, material: MaterialType.STONE, special: SpecialBlockType.CONVEYOR, direction: 'right' },
    // Target structure at end of conveyor
    { x: 900, y: GROUND_Y - 40, width: 20, height: 80, material: MaterialType.ICE },
    { x: 940, y: GROUND_Y - 40, width: 20, height: 80, material: MaterialType.ICE },
    { x: 920, y: GROUND_Y - 90, width: 70, height: 15, material: MaterialType.WOOD },
    // Debris blocks on conveyor
    { x: 720, y: GROUND_Y - 40, width: 30, height: 30, material: MaterialType.WOOD },
    { x: 770, y: GROUND_Y - 40, width: 30, height: 30, material: MaterialType.WOOD },
  ],
  pigs: [
    { x: 920, y: GROUND_Y - 18 },
    { x: 920, y: GROUND_Y - 108 },
  ],
  theoreticalMaxScore: 10000 + 4000 + 10000,
};
