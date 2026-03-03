import { BirdType, MaterialType, SpecialBlockType } from '../game/types';
import type { LevelData } from './types';

// Level 35: Gravity & TNT - Gravity inverter lifts TNT near elevated pigs
const GROUND_Y = 660;

export const level035: LevelData = {
  id: 35,
  name: 'Gravity & TNT',
  birds: [BirdType.RED, BirdType.RED, BirdType.BOMB, BirdType.RED, BirdType.RED],
  slingshot: { x: 180, y: GROUND_Y - 180 },
  blocks: [
    // Gravity inverter at ground level
    { x: 700, y: GROUND_Y - 25, width: 50, height: 50, material: MaterialType.WOOD, special: SpecialBlockType.GRAVITY_INVERTER },
    // TNT crates on shelf that will float up when gravity inverts
    { x: 800, y: GROUND_Y - 25, width: 50, height: 50, material: MaterialType.WOOD, special: SpecialBlockType.TNT },
    { x: 860, y: GROUND_Y - 25, width: 50, height: 50, material: MaterialType.WOOD, special: SpecialBlockType.TNT },
    // Elevated stone platform with pigs
    { x: 830, y: GROUND_Y - 200, width: 140, height: 20, material: MaterialType.STONE },
    { x: 790, y: GROUND_Y - 130, width: 20, height: 120, material: MaterialType.STONE },
    { x: 870, y: GROUND_Y - 130, width: 20, height: 120, material: MaterialType.STONE },
    // Upper structure
    { x: 810, y: GROUND_Y - 230, width: 20, height: 40, material: MaterialType.WOOD },
    { x: 850, y: GROUND_Y - 230, width: 20, height: 40, material: MaterialType.WOOD },
    { x: 830, y: GROUND_Y - 260, width: 60, height: 15, material: MaterialType.WOOD },
  ],
  pigs: [
    { x: 810, y: GROUND_Y - 220 },
    { x: 850, y: GROUND_Y - 220 },
    { x: 830, y: GROUND_Y - 280 },
    { x: 830, y: GROUND_Y - 18 },
  ],
  theoreticalMaxScore: 20000 + 1500 + 3000 + 2500 + 4000 + 10000,
};
