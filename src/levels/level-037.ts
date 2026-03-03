import { BirdType, MaterialType, SpecialBlockType } from '../game/types';
import type { LevelData } from './types';

// Level 37: Warp Zone - 3 teleporter pairs in sequence
const GROUND_Y = 660;

export const level037: LevelData = {
  id: 37,
  name: 'Warp Zone',
  birds: [BirdType.RED, BirdType.RED, BirdType.RED, BirdType.RED],
  slingshot: { x: 150, y: GROUND_Y - 180 },
  blocks: [
    // Teleporter pair 1
    { x: 400, y: GROUND_Y - 40, width: 50, height: 60, material: MaterialType.WOOD, special: SpecialBlockType.TELEPORTER },
    { x: 600, y: GROUND_Y - 150, width: 50, height: 60, material: MaterialType.WOOD, special: SpecialBlockType.TELEPORTER },
    // Teleporter pair 2
    { x: 650, y: GROUND_Y - 40, width: 50, height: 60, material: MaterialType.WOOD, special: SpecialBlockType.TELEPORTER },
    { x: 900, y: GROUND_Y - 150, width: 50, height: 60, material: MaterialType.WOOD, special: SpecialBlockType.TELEPORTER },
    // Teleporter pair 3
    { x: 950, y: GROUND_Y - 40, width: 50, height: 60, material: MaterialType.WOOD, special: SpecialBlockType.TELEPORTER },
    { x: 1200, y: GROUND_Y - 40, width: 50, height: 60, material: MaterialType.WOOD, special: SpecialBlockType.TELEPORTER },
    // Walls between sections
    { x: 500, y: GROUND_Y - 100, width: 25, height: 200, material: MaterialType.STONE },
    { x: 750, y: GROUND_Y - 100, width: 25, height: 200, material: MaterialType.STONE },
    { x: 1050, y: GROUND_Y - 100, width: 25, height: 200, material: MaterialType.STONE },
    // Target structure behind last wall
    { x: 1200, y: GROUND_Y - 80, width: 20, height: 60, material: MaterialType.WOOD },
    { x: 1260, y: GROUND_Y - 80, width: 20, height: 60, material: MaterialType.WOOD },
    { x: 1230, y: GROUND_Y - 120, width: 80, height: 15, material: MaterialType.WOOD },
  ],
  pigs: [
    { x: 600, y: GROUND_Y - 18 },
    { x: 900, y: GROUND_Y - 18 },
    { x: 1230, y: GROUND_Y - 18 },
  ],
  teleporterPairs: [
    { blockIndexA: 0, blockIndexB: 1 },
    { blockIndexA: 2, blockIndexB: 3 },
    { blockIndexA: 4, blockIndexB: 5 },
  ],
  theoreticalMaxScore: 15000 + 1500 + 4500 + 10000,
};
