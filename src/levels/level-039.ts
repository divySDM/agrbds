import { BirdType, MaterialType, SpecialBlockType } from '../game/types';
import type { LevelData } from './types';

// Level 39: No Way Through - Stone fortress, no direct shot possible, must combine special blocks
const GROUND_Y = 660;

export const level039: LevelData = {
  id: 39,
  name: 'No Way Through',
  birds: [BirdType.RED, BirdType.BOMB, BirdType.RED, BirdType.RED, BirdType.RED],
  slingshot: { x: 180, y: GROUND_Y - 180 },
  blocks: [
    // Impenetrable stone fortress (front wall)
    { x: 650, y: GROUND_Y - 120, width: 35, height: 240, material: MaterialType.STONE },
    // Impenetrable stone fortress (back wall)
    { x: 950, y: GROUND_Y - 120, width: 35, height: 240, material: MaterialType.STONE },
    // Stone roof
    { x: 800, y: GROUND_Y - 250, width: 340, height: 25, material: MaterialType.STONE },
    // TNT hidden inside fortress
    { x: 750, y: GROUND_Y - 25, width: 50, height: 50, material: MaterialType.WOOD, special: SpecialBlockType.TNT },
    { x: 850, y: GROUND_Y - 25, width: 50, height: 50, material: MaterialType.WOOD, special: SpecialBlockType.TNT },
    // Teleporter to get inside
    { x: 450, y: GROUND_Y - 40, width: 50, height: 60, material: MaterialType.WOOD, special: SpecialBlockType.TELEPORTER },
    { x: 800, y: GROUND_Y - 180, width: 50, height: 60, material: MaterialType.WOOD, special: SpecialBlockType.TELEPORTER },
    // Gravity inverter inside fortress
    { x: 800, y: GROUND_Y - 80, width: 50, height: 50, material: MaterialType.WOOD, special: SpecialBlockType.GRAVITY_INVERTER },
    // Interior support
    { x: 720, y: GROUND_Y - 80, width: 20, height: 100, material: MaterialType.WOOD },
    { x: 880, y: GROUND_Y - 80, width: 20, height: 100, material: MaterialType.WOOD },
    { x: 800, y: GROUND_Y - 140, width: 180, height: 15, material: MaterialType.WOOD },
  ],
  pigs: [
    { x: 760, y: GROUND_Y - 18 },
    { x: 840, y: GROUND_Y - 18 },
    { x: 800, y: GROUND_Y - 160 },
    { x: 800, y: GROUND_Y - 100 },
  ],
  teleporterPairs: [{ blockIndexA: 5, blockIndexB: 6 }],
  theoreticalMaxScore: 20000 + 2000 + 6000 + 4000 + 2500 + 10000,
};
