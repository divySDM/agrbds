import { BirdType, MaterialType, SpecialBlockType } from '../game/types';
import type { LevelData } from './types';

// Level 28: Portal Bounce - Teleporter exit aimed at gel pad aimed at structure
const GROUND_Y = 660;

export const level028: LevelData = {
  id: 28,
  name: 'Portal Bounce',
  birds: [BirdType.RED, BirdType.RED, BirdType.RED, BirdType.RED],
  slingshot: { x: 200, y: GROUND_Y - 180 },
  blocks: [
    // Entry teleporter
    { x: 500, y: GROUND_Y - 40, width: 50, height: 60, material: MaterialType.WOOD, special: SpecialBlockType.TELEPORTER },
    // Exit teleporter - positioned above gel pad
    { x: 850, y: GROUND_Y - 200, width: 50, height: 60, material: MaterialType.WOOD, special: SpecialBlockType.TELEPORTER },
    // Gel pad below exit teleporter
    { x: 850, y: GROUND_Y - 15, width: 80, height: 30, material: MaterialType.WOOD, special: SpecialBlockType.GEL_PAD },
    // Target structure - elevated, reachable via bounce
    { x: 1050, y: GROUND_Y - 100, width: 20, height: 80, material: MaterialType.WOOD },
    { x: 1110, y: GROUND_Y - 100, width: 20, height: 80, material: MaterialType.WOOD },
    { x: 1080, y: GROUND_Y - 150, width: 80, height: 15, material: MaterialType.WOOD },
    // Base support
    { x: 1050, y: GROUND_Y - 50, width: 20, height: 100, material: MaterialType.STONE },
    { x: 1110, y: GROUND_Y - 50, width: 20, height: 100, material: MaterialType.STONE },
  ],
  pigs: [
    { x: 1080, y: GROUND_Y - 60 },
    { x: 1080, y: GROUND_Y - 170 },
    { x: 1080, y: GROUND_Y - 18 },
  ],
  teleporterPairs: [{ blockIndexA: 0, blockIndexB: 1 }],
  theoreticalMaxScore: 15000 + 1500 + 3000 + 10000, // 3 pigs + 3 wood + 2 stone + 1 remaining bird
};
