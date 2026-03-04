import { BirdType, MaterialType, SpecialBlockType } from '../game/types';
import type { LevelData } from './types';

const GROUND_Y = 660;

export const level060: LevelData = {
  id: 60,
  name: 'Grand Finale III',
  birds: [BirdType.BIG, BirdType.BLUE, BirdType.WHITE, BirdType.BOMB, BirdType.YELLOW, BirdType.RED, BirdType.RED, BirdType.RED],
  slingshot: { x: 150, y: GROUND_Y - 180 },
  blocks: [
    // === Section 1: Heavy fortress (Big Bird) ===
    { x: 500, y: GROUND_Y - 40, width: 30, height: 80, material: MaterialType.STONE },
    { x: 580, y: GROUND_Y - 40, width: 30, height: 80, material: MaterialType.STONE },
    { x: 540, y: GROUND_Y - 90, width: 110, height: 20, material: MaterialType.STONE },
    { x: 540, y: GROUND_Y - 120, width: 60, height: 30, material: MaterialType.STONE },

    // === Section 2: Ice cluster (Blue Bird splits) ===
    { x: 700, y: GROUND_Y - 25, width: 30, height: 50, material: MaterialType.ICE },
    { x: 740, y: GROUND_Y - 25, width: 30, height: 50, material: MaterialType.ICE },
    { x: 780, y: GROUND_Y - 25, width: 30, height: 50, material: MaterialType.ICE },
    { x: 740, y: GROUND_Y - 60, width: 110, height: 15, material: MaterialType.ICE },

    // === Section 3: Bunker (White Bird egg) ===
    { x: 900, y: GROUND_Y - 30, width: 25, height: 60, material: MaterialType.STONE },
    { x: 980, y: GROUND_Y - 30, width: 25, height: 60, material: MaterialType.STONE },
    { x: 940, y: GROUND_Y - 70, width: 110, height: 15, material: MaterialType.STONE },

    // === Section 4: Explosive + TNT chain ===
    { x: 1100, y: GROUND_Y - 25, width: 45, height: 50, material: MaterialType.WOOD, special: SpecialBlockType.EXPLOSIVE_BARREL },
    { x: 1160, y: GROUND_Y - 25, width: 40, height: 40, material: MaterialType.WOOD, special: SpecialBlockType.TNT },
    { x: 1130, y: GROUND_Y - 70, width: 80, height: 15, material: MaterialType.WOOD },
    { x: 1110, y: GROUND_Y - 95, width: 20, height: 35, material: MaterialType.WOOD },
    { x: 1150, y: GROUND_Y - 95, width: 20, height: 35, material: MaterialType.WOOD },

    // === Environmental blocks ===
    { x: 650, y: GROUND_Y - 100, width: 45, height: 45, material: MaterialType.STONE, special: SpecialBlockType.MAGNET },
    { x: 850, y: GROUND_Y - 15, width: 80, height: 25, material: MaterialType.STONE, special: SpecialBlockType.CONVEYOR, direction: 'right' },
    { x: 400, y: GROUND_Y - 60, width: 25, height: 80, material: MaterialType.RUBBER },
    { x: 1200, y: GROUND_Y - 25, width: 40, height: 40, material: MaterialType.SAND },
    { x: 1200, y: GROUND_Y - 55, width: 35, height: 30, material: MaterialType.SAND },
    { x: 1200, y: GROUND_Y - 80, width: 30, height: 25, material: MaterialType.SAND },

    // === Gravity inverter ===
    { x: 540, y: GROUND_Y - 160, width: 40, height: 40, material: MaterialType.WOOD, special: SpecialBlockType.GRAVITY_INVERTER },
  ],
  pigs: [
    { x: 540, y: GROUND_Y - 18 },
    { x: 740, y: GROUND_Y - 18 },
    { x: 940, y: GROUND_Y - 18 },
    { x: 1130, y: GROUND_Y - 18 },
    { x: 1130, y: GROUND_Y - 88 },
    { x: 1200, y: GROUND_Y - 100 },
  ],
  theoreticalMaxScore: 30000 + 12000 + 1800 + 2000 + 1500 + 2500 + 1200 + 30000,
};
