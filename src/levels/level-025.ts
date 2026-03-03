import { BirdType, MaterialType, SpecialBlockType } from '../game/types';
import type { LevelData } from './types';

// Level 25: Portal Run - Teleporter pair bypasses stone wall
const GROUND_Y = 660;

export const level025: LevelData = {
  id: 25,
  name: 'Portal Run',
  birds: [BirdType.RED, BirdType.RED, BirdType.RED],
  slingshot: { x: 200, y: GROUND_Y - 180 },
  blocks: [
    // Teleporter A (entry, near slingshot area)
    { x: 500, y: GROUND_Y - 40, width: 50, height: 60, material: MaterialType.WOOD, special: SpecialBlockType.TELEPORTER },
    // Impassable stone wall
    { x: 700, y: GROUND_Y - 120, width: 40, height: 240, material: MaterialType.STONE },
    // Teleporter B (exit, behind wall)
    { x: 900, y: GROUND_Y - 40, width: 50, height: 60, material: MaterialType.WOOD, special: SpecialBlockType.TELEPORTER },
    // Structure around pig behind wall
    { x: 1000, y: GROUND_Y - 40, width: 20, height: 80, material: MaterialType.WOOD },
    { x: 1060, y: GROUND_Y - 40, width: 20, height: 80, material: MaterialType.WOOD },
    { x: 1030, y: GROUND_Y - 90, width: 80, height: 15, material: MaterialType.WOOD },
  ],
  pigs: [
    { x: 1030, y: GROUND_Y - 18 },
    { x: 1030, y: GROUND_Y - 110 },
  ],
  teleporterPairs: [{ blockIndexA: 0, blockIndexB: 2 }],
  theoreticalMaxScore: 10000 + 1500 + 1500 + 10000, // 2 pigs + 3 wood + 1 stone + 1 remaining bird
};
