import { BirdType, MaterialType } from '../game/types';
import type { LevelData } from './types';

// Level 4: 3 pigs, multi-tower with bridge, mixed materials, 2 bomb + 2 red birds
const GROUND_Y = 660;

export const level004: LevelData = {
  id: 4,
  name: 'Bridged Fortress',
  birds: [BirdType.RED, BirdType.BOMB, BirdType.RED, BirdType.BOMB],
  slingshot: { x: 180, y: GROUND_Y - 180 },
  blocks: [
    // Left tower
    { x: 680, y: GROUND_Y - 60, width: 20, height: 120, material: MaterialType.WOOD },
    { x: 740, y: GROUND_Y - 60, width: 20, height: 120, material: MaterialType.WOOD },
    { x: 710, y: GROUND_Y - 130, width: 80, height: 20, material: MaterialType.WOOD },

    // Right tower
    { x: 880, y: GROUND_Y - 60, width: 20, height: 120, material: MaterialType.STONE },
    { x: 940, y: GROUND_Y - 60, width: 20, height: 120, material: MaterialType.STONE },
    { x: 910, y: GROUND_Y - 130, width: 80, height: 20, material: MaterialType.STONE },

    // Bridge connecting towers
    { x: 810, y: GROUND_Y - 127.5, width: 120, height: 15, material: MaterialType.ICE },

    // Top block on left tower
    { x: 710, y: GROUND_Y - 160, width: 40, height: 40, material: MaterialType.WOOD },

    // Small ice blocks on bridge
    { x: 790, y: GROUND_Y - 145, width: 25, height: 20, material: MaterialType.ICE },
    { x: 830, y: GROUND_Y - 145, width: 25, height: 20, material: MaterialType.ICE },
  ],
  pigs: [
    { x: 710, y: GROUND_Y - 18 },
    { x: 810, y: GROUND_Y - 18 },
    { x: 910, y: GROUND_Y - 18 },
  ],
  theoreticalMaxScore: 15000 + 2000 + 3000 + 4500 + 10000, // 3 pigs + 4 wood + 3 ice + 3 stone + 1 remaining bird
};
