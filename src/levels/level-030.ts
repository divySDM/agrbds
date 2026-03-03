import { BirdType, MaterialType, SpecialBlockType } from '../game/types';
import type { LevelData } from './types';

// Level 30: The Gauntlet - Multi-section level, each guarded by a different special block
const GROUND_Y = 660;

export const level030: LevelData = {
  id: 30,
  name: 'The Gauntlet',
  birds: [BirdType.RED, BirdType.BOMB, BirdType.RED, BirdType.YELLOW, BirdType.RED],
  slingshot: { x: 150, y: GROUND_Y - 180 },
  blocks: [
    // Section 1: TNT guarded
    { x: 550, y: GROUND_Y - 25, width: 50, height: 50, material: MaterialType.WOOD, special: SpecialBlockType.TNT },
    { x: 550, y: GROUND_Y - 70, width: 60, height: 40, material: MaterialType.WOOD },
    // Section 2: Gel pad section
    { x: 700, y: GROUND_Y - 15, width: 80, height: 30, material: MaterialType.WOOD, special: SpecialBlockType.GEL_PAD },
    { x: 750, y: GROUND_Y - 200, width: 60, height: 20, material: MaterialType.WOOD },
    { x: 750, y: GROUND_Y - 225, width: 40, height: 30, material: MaterialType.ICE },
    // Section 3: Gravity inverter
    { x: 900, y: GROUND_Y - 25, width: 50, height: 50, material: MaterialType.WOOD, special: SpecialBlockType.GRAVITY_INVERTER },
    { x: 900, y: GROUND_Y - 80, width: 80, height: 60, material: MaterialType.STONE },
    // Section 4: Teleporter
    { x: 450, y: GROUND_Y - 100, width: 50, height: 60, material: MaterialType.WOOD, special: SpecialBlockType.TELEPORTER },
    { x: 1100, y: GROUND_Y - 100, width: 50, height: 60, material: MaterialType.WOOD, special: SpecialBlockType.TELEPORTER },
    { x: 1100, y: GROUND_Y - 40, width: 20, height: 80, material: MaterialType.WOOD },
    { x: 1160, y: GROUND_Y - 40, width: 20, height: 80, material: MaterialType.WOOD },
    { x: 1130, y: GROUND_Y - 90, width: 80, height: 15, material: MaterialType.WOOD },
  ],
  pigs: [
    { x: 550, y: GROUND_Y - 100 },
    { x: 750, y: GROUND_Y - 250 },
    { x: 900, y: GROUND_Y - 120 },
    { x: 1130, y: GROUND_Y - 18 },
  ],
  teleporterPairs: [{ blockIndexA: 7, blockIndexB: 8 }],
  theoreticalMaxScore: 20000 + 3000 + 1000 + 1500 + 2000 + 2500 + 10000,
};
