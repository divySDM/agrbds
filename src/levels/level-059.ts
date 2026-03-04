import { BirdType, MaterialType, SpecialBlockType } from '../game/types';
import type { LevelData } from './types';

const GROUND_Y = 660;

export const level059: LevelData = {
  id: 59,
  name: 'Mix Tape III',
  birds: [BirdType.BIG, BirdType.BOMB, BirdType.RED, BirdType.RED, BirdType.YELLOW],
  slingshot: { x: 150, y: GROUND_Y - 180 },
  blocks: [
    // Heavy stone fortress — Big Bird territory
    { x: 600, y: GROUND_Y - 40, width: 30, height: 80, material: MaterialType.STONE },
    { x: 700, y: GROUND_Y - 40, width: 30, height: 80, material: MaterialType.STONE },
    { x: 650, y: GROUND_Y - 90, width: 130, height: 20, material: MaterialType.STONE },
    // Explosive barrels
    { x: 650, y: GROUND_Y - 25, width: 45, height: 50, material: MaterialType.WOOD, special: SpecialBlockType.EXPLOSIVE_BARREL },
    // Gravity inverter
    { x: 850, y: GROUND_Y - 25, width: 50, height: 50, material: MaterialType.WOOD, special: SpecialBlockType.GRAVITY_INVERTER },
    // Upper structures (affected by gravity flip)
    { x: 850, y: GROUND_Y - 100, width: 20, height: 50, material: MaterialType.WOOD },
    { x: 900, y: GROUND_Y - 100, width: 20, height: 50, material: MaterialType.WOOD },
    { x: 875, y: GROUND_Y - 135, width: 80, height: 15, material: MaterialType.ICE },
    // Right section
    { x: 1050, y: GROUND_Y - 30, width: 50, height: 60, material: MaterialType.STONE },
    { x: 1050, y: GROUND_Y - 70, width: 50, height: 15, material: MaterialType.WOOD },
    { x: 1100, y: GROUND_Y - 25, width: 40, height: 40, material: MaterialType.WOOD, special: SpecialBlockType.TNT },
  ],
  pigs: [
    { x: 650, y: GROUND_Y - 18 },
    { x: 650, y: GROUND_Y - 110 },
    { x: 875, y: GROUND_Y - 18 },
    { x: 875, y: GROUND_Y - 155 },
    { x: 1050, y: GROUND_Y - 18 },
  ],
  theoreticalMaxScore: 25000 + 8000 + 1800 + 2500 + 2000 + 20000,
};
