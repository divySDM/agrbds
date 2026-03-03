import { BirdType, MaterialType, SpecialBlockType } from '../game/types';
import type { LevelData } from './types';

// Level 38: Kitchen Sink - Every special block type used multiple times
const GROUND_Y = 660;

export const level038: LevelData = {
  id: 38,
  name: 'Kitchen Sink',
  birds: [BirdType.RED, BirdType.BOMB, BirdType.YELLOW, BirdType.RED, BirdType.RED, BirdType.RED],
  slingshot: { x: 150, y: GROUND_Y - 180 },
  blocks: [
    // TNT pair
    { x: 600, y: GROUND_Y - 25, width: 45, height: 45, material: MaterialType.WOOD, special: SpecialBlockType.TNT },
    { x: 660, y: GROUND_Y - 25, width: 45, height: 45, material: MaterialType.WOOD, special: SpecialBlockType.TNT },
    // Gel pads
    { x: 500, y: GROUND_Y - 15, width: 70, height: 25, material: MaterialType.WOOD, special: SpecialBlockType.GEL_PAD },
    { x: 850, y: GROUND_Y - 15, width: 70, height: 25, material: MaterialType.WOOD, special: SpecialBlockType.GEL_PAD },
    // Gravity inverters
    { x: 750, y: GROUND_Y - 25, width: 45, height: 45, material: MaterialType.WOOD, special: SpecialBlockType.GRAVITY_INVERTER },
    { x: 1000, y: GROUND_Y - 25, width: 45, height: 45, material: MaterialType.WOOD, special: SpecialBlockType.GRAVITY_INVERTER },
    // Teleporter pair
    { x: 450, y: GROUND_Y - 100, width: 45, height: 55, material: MaterialType.WOOD, special: SpecialBlockType.TELEPORTER },
    { x: 1100, y: GROUND_Y - 100, width: 45, height: 55, material: MaterialType.WOOD, special: SpecialBlockType.TELEPORTER },
    // Central fortress
    { x: 700, y: GROUND_Y - 80, width: 25, height: 110, material: MaterialType.STONE },
    { x: 800, y: GROUND_Y - 80, width: 25, height: 110, material: MaterialType.STONE },
    { x: 750, y: GROUND_Y - 145, width: 130, height: 20, material: MaterialType.STONE },
    // Upper structure
    { x: 730, y: GROUND_Y - 175, width: 20, height: 40, material: MaterialType.WOOD },
    { x: 770, y: GROUND_Y - 175, width: 20, height: 40, material: MaterialType.WOOD },
    { x: 750, y: GROUND_Y - 205, width: 60, height: 15, material: MaterialType.WOOD },
    // Far right structure
    { x: 1100, y: GROUND_Y - 50, width: 20, height: 60, material: MaterialType.WOOD },
    { x: 1150, y: GROUND_Y - 50, width: 20, height: 60, material: MaterialType.WOOD },
    { x: 1125, y: GROUND_Y - 90, width: 70, height: 15, material: MaterialType.ICE },
  ],
  pigs: [
    { x: 630, y: GROUND_Y - 55 },
    { x: 750, y: GROUND_Y - 18 },
    { x: 750, y: GROUND_Y - 225 },
    { x: 1000, y: GROUND_Y - 55 },
    { x: 1125, y: GROUND_Y - 18 },
  ],
  teleporterPairs: [{ blockIndexA: 6, blockIndexB: 7 }],
  theoreticalMaxScore: 25000 + 2500 + 4500 + 1000 + 4000 + 5000 + 10000,
};
