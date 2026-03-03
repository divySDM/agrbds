import { BirdType, MaterialType, SpecialBlockType } from '../game/types';
import type { LevelData } from './types';

// Level 40: Grand Finale II - Massive multi-section fortress with all special blocks
const GROUND_Y = 660;

export const level040: LevelData = {
  id: 40,
  name: 'Grand Finale II',
  birds: [BirdType.BOMB, BirdType.YELLOW, BirdType.RED, BirdType.BOMB, BirdType.RED, BirdType.RED, BirdType.RED],
  slingshot: { x: 150, y: GROUND_Y - 180 },
  blocks: [
    // === Left section: TNT fortress ===
    { x: 550, y: GROUND_Y - 25, width: 50, height: 50, material: MaterialType.WOOD, special: SpecialBlockType.TNT },
    { x: 610, y: GROUND_Y - 25, width: 50, height: 50, material: MaterialType.WOOD, special: SpecialBlockType.TNT },
    { x: 580, y: GROUND_Y - 80, width: 120, height: 15, material: MaterialType.STONE },
    { x: 560, y: GROUND_Y - 110, width: 20, height: 45, material: MaterialType.WOOD },
    { x: 600, y: GROUND_Y - 110, width: 20, height: 45, material: MaterialType.WOOD },
    { x: 580, y: GROUND_Y - 140, width: 60, height: 15, material: MaterialType.WOOD },

    // === Center section: Gravity & gel combo ===
    { x: 780, y: GROUND_Y - 25, width: 50, height: 50, material: MaterialType.WOOD, special: SpecialBlockType.GRAVITY_INVERTER },
    { x: 850, y: GROUND_Y - 15, width: 70, height: 25, material: MaterialType.WOOD, special: SpecialBlockType.GEL_PAD },
    { x: 820, y: GROUND_Y - 80, width: 25, height: 60, material: MaterialType.STONE },
    { x: 880, y: GROUND_Y - 80, width: 25, height: 60, material: MaterialType.STONE },
    { x: 850, y: GROUND_Y - 120, width: 90, height: 15, material: MaterialType.STONE },
    { x: 850, y: GROUND_Y - 155, width: 50, height: 50, material: MaterialType.WOOD, special: SpecialBlockType.TNT },
    { x: 835, y: GROUND_Y - 195, width: 20, height: 30, material: MaterialType.ICE },
    { x: 865, y: GROUND_Y - 195, width: 20, height: 30, material: MaterialType.ICE },
    { x: 850, y: GROUND_Y - 220, width: 50, height: 15, material: MaterialType.WOOD },

    // === Right section: Teleporter fortress ===
    { x: 450, y: GROUND_Y - 150, width: 50, height: 60, material: MaterialType.WOOD, special: SpecialBlockType.TELEPORTER },
    { x: 1100, y: GROUND_Y - 150, width: 50, height: 60, material: MaterialType.WOOD, special: SpecialBlockType.TELEPORTER },
    { x: 1050, y: GROUND_Y - 60, width: 25, height: 120, material: MaterialType.STONE },
    { x: 1150, y: GROUND_Y - 60, width: 25, height: 120, material: MaterialType.STONE },
    { x: 1100, y: GROUND_Y - 130, width: 130, height: 20, material: MaterialType.STONE },
    { x: 1080, y: GROUND_Y - 165, width: 20, height: 50, material: MaterialType.WOOD },
    { x: 1120, y: GROUND_Y - 165, width: 20, height: 50, material: MaterialType.WOOD },
    { x: 1100, y: GROUND_Y - 200, width: 60, height: 15, material: MaterialType.WOOD },
    { x: 1100, y: GROUND_Y - 25, width: 50, height: 50, material: MaterialType.WOOD, special: SpecialBlockType.TNT },
  ],
  pigs: [
    { x: 580, y: GROUND_Y - 160 },
    { x: 580, y: GROUND_Y - 18 },
    { x: 850, y: GROUND_Y - 18 },
    { x: 850, y: GROUND_Y - 240 },
    { x: 1100, y: GROUND_Y - 18 },
    { x: 1100, y: GROUND_Y - 220 },
  ],
  teleporterPairs: [{ blockIndexA: 15, blockIndexB: 16 }],
  theoreticalMaxScore: 30000 + 3000 + 2000 + 7500 + 8000 + 2500 + 20000,
};
