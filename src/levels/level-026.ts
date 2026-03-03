import { BirdType, MaterialType, SpecialBlockType } from '../game/types';
import type { LevelData } from './types';

// Level 26: Gel & TNT Combo - Bounce bird off gel pad into TNT cluster
const GROUND_Y = 660;

export const level026: LevelData = {
  id: 26,
  name: 'Gel & TNT Combo',
  birds: [BirdType.RED, BirdType.RED, BirdType.RED, BirdType.RED],
  slingshot: { x: 200, y: GROUND_Y - 180 },
  blocks: [
    // Gel pad angled for bounce
    { x: 550, y: GROUND_Y - 15, width: 80, height: 30, material: MaterialType.WOOD, special: SpecialBlockType.GEL_PAD },
    // TNT cluster on elevated platform
    { x: 850, y: GROUND_Y - 150, width: 50, height: 50, material: MaterialType.WOOD, special: SpecialBlockType.TNT },
    { x: 900, y: GROUND_Y - 150, width: 50, height: 50, material: MaterialType.WOOD, special: SpecialBlockType.TNT },
    // Platform holding TNT
    { x: 875, y: GROUND_Y - 115, width: 120, height: 15, material: MaterialType.STONE },
    // Support pillars
    { x: 840, y: GROUND_Y - 55, width: 20, height: 110, material: MaterialType.STONE },
    { x: 910, y: GROUND_Y - 55, width: 20, height: 110, material: MaterialType.STONE },
    // Wood shelter below for pigs
    { x: 875, y: GROUND_Y - 40, width: 60, height: 15, material: MaterialType.WOOD },
  ],
  pigs: [
    { x: 860, y: GROUND_Y - 18 },
    { x: 890, y: GROUND_Y - 18 },
    { x: 875, y: GROUND_Y - 175 },
  ],
  theoreticalMaxScore: 15000 + 500 + 3000 + 4000 + 10000, // 3 pigs + 1 wood + 2 stone + 2 TNT + 1 remaining bird
};
