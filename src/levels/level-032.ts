import { BirdType, MaterialType, SpecialBlockType } from '../game/types';
import type { LevelData } from './types';

// Level 32: Floating Fortress - Gravity inverters hold up a structure
const GROUND_Y = 660;

export const level032: LevelData = {
  id: 32,
  name: 'Floating Fortress',
  birds: [BirdType.RED, BirdType.RED, BirdType.BOMB, BirdType.RED],
  slingshot: { x: 200, y: GROUND_Y - 180 },
  blocks: [
    // Two gravity inverters supporting the fortress
    { x: 750, y: GROUND_Y - 25, width: 50, height: 50, material: MaterialType.WOOD, special: SpecialBlockType.GRAVITY_INVERTER },
    { x: 900, y: GROUND_Y - 25, width: 50, height: 50, material: MaterialType.WOOD, special: SpecialBlockType.GRAVITY_INVERTER },
    // Fortress structure above
    { x: 780, y: GROUND_Y - 80, width: 20, height: 60, material: MaterialType.STONE },
    { x: 870, y: GROUND_Y - 80, width: 20, height: 60, material: MaterialType.STONE },
    { x: 825, y: GROUND_Y - 120, width: 120, height: 20, material: MaterialType.STONE },
    // Upper structure
    { x: 810, y: GROUND_Y - 155, width: 20, height: 50, material: MaterialType.WOOD },
    { x: 840, y: GROUND_Y - 155, width: 20, height: 50, material: MaterialType.WOOD },
    { x: 825, y: GROUND_Y - 190, width: 50, height: 20, material: MaterialType.WOOD },
  ],
  pigs: [
    { x: 825, y: GROUND_Y - 18 },
    { x: 825, y: GROUND_Y - 75 },
    { x: 825, y: GROUND_Y - 210 },
  ],
  theoreticalMaxScore: 15000 + 1500 + 4500 + 5000 + 10000, // 3 pigs + 3 wood + 3 stone + 2 grav inv + 1 remaining
};
