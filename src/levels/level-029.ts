import { BirdType, MaterialType, SpecialBlockType } from '../game/types';
import type { LevelData } from './types';

// Level 29: All Together - All four special block types in one level
const GROUND_Y = 660;

export const level029: LevelData = {
  id: 29,
  name: 'All Together',
  birds: [BirdType.RED, BirdType.RED, BirdType.BOMB, BirdType.RED, BirdType.RED],
  slingshot: { x: 180, y: GROUND_Y - 180 },
  blocks: [
    // Gel pad for bouncing
    { x: 500, y: GROUND_Y - 15, width: 80, height: 30, material: MaterialType.WOOD, special: SpecialBlockType.GEL_PAD },
    // Teleporter pair
    { x: 600, y: GROUND_Y - 100, width: 50, height: 60, material: MaterialType.WOOD, special: SpecialBlockType.TELEPORTER },
    { x: 1000, y: GROUND_Y - 100, width: 50, height: 60, material: MaterialType.WOOD, special: SpecialBlockType.TELEPORTER },
    // TNT near structure
    { x: 850, y: GROUND_Y - 25, width: 50, height: 50, material: MaterialType.WOOD, special: SpecialBlockType.TNT },
    // Gravity inverter on platform
    { x: 750, y: GROUND_Y - 150, width: 50, height: 50, material: MaterialType.WOOD, special: SpecialBlockType.GRAVITY_INVERTER },
    // Main structure
    { x: 800, y: GROUND_Y - 60, width: 25, height: 120, material: MaterialType.WOOD },
    { x: 900, y: GROUND_Y - 60, width: 25, height: 120, material: MaterialType.WOOD },
    { x: 850, y: GROUND_Y - 130, width: 130, height: 20, material: MaterialType.STONE },
    { x: 850, y: GROUND_Y - 160, width: 60, height: 40, material: MaterialType.WOOD },
    // Platform for gravity inverter
    { x: 750, y: GROUND_Y - 115, width: 80, height: 15, material: MaterialType.STONE },
  ],
  pigs: [
    { x: 850, y: GROUND_Y - 18 },
    { x: 830, y: GROUND_Y - 150 },
    { x: 870, y: GROUND_Y - 150 },
    { x: 1000, y: GROUND_Y - 18 },
  ],
  teleporterPairs: [{ blockIndexA: 1, blockIndexB: 2 }],
  theoreticalMaxScore: 20000 + 2000 + 3000 + 2000 + 2500 + 10000,
};
