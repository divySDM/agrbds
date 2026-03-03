import { BirdType, MaterialType, SpecialBlockType } from '../game/types';
import type { LevelData } from './types';

// Level 34: Portal Maze - Multiple teleporter pairs creating routing puzzle
const GROUND_Y = 660;

export const level034: LevelData = {
  id: 34,
  name: 'Portal Maze',
  birds: [BirdType.RED, BirdType.RED, BirdType.RED, BirdType.RED],
  slingshot: { x: 200, y: GROUND_Y - 180 },
  blocks: [
    // Teleporter pair 1 (near to mid)
    { x: 450, y: GROUND_Y - 40, width: 50, height: 60, material: MaterialType.WOOD, special: SpecialBlockType.TELEPORTER },
    { x: 750, y: GROUND_Y - 200, width: 50, height: 60, material: MaterialType.WOOD, special: SpecialBlockType.TELEPORTER },
    // Teleporter pair 2 (mid to far)
    { x: 800, y: GROUND_Y - 40, width: 50, height: 60, material: MaterialType.WOOD, special: SpecialBlockType.TELEPORTER },
    { x: 1100, y: GROUND_Y - 40, width: 50, height: 60, material: MaterialType.WOOD, special: SpecialBlockType.TELEPORTER },
    // Stone walls blocking direct paths
    { x: 600, y: GROUND_Y - 100, width: 30, height: 200, material: MaterialType.STONE },
    { x: 900, y: GROUND_Y - 100, width: 30, height: 200, material: MaterialType.STONE },
    // Target structure
    { x: 1100, y: GROUND_Y - 80, width: 20, height: 60, material: MaterialType.WOOD },
    { x: 1160, y: GROUND_Y - 80, width: 20, height: 60, material: MaterialType.WOOD },
    { x: 1130, y: GROUND_Y - 120, width: 80, height: 15, material: MaterialType.WOOD },
  ],
  pigs: [
    { x: 750, y: GROUND_Y - 18 },
    { x: 1130, y: GROUND_Y - 18 },
    { x: 1130, y: GROUND_Y - 140 },
  ],
  teleporterPairs: [
    { blockIndexA: 0, blockIndexB: 1 },
    { blockIndexA: 2, blockIndexB: 3 },
  ],
  theoreticalMaxScore: 15000 + 1500 + 3000 + 10000, // 3 pigs + 3 wood + 2 stone + 1 remaining
};
