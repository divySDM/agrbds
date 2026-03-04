import { BirdType, MaterialType, SpecialBlockType } from '../game/types';
import type { LevelData } from './types';

const GROUND_Y = 660;

export const level052: LevelData = {
  id: 52,
  name: 'Orbit Breaker',
  birds: [BirdType.YELLOW, BirdType.YELLOW, BirdType.YELLOW, BirdType.RED],
  slingshot: { x: 150, y: GROUND_Y - 180 },
  blocks: [
    // Multiple magnets creating a gauntlet
    { x: 600, y: GROUND_Y - 100, width: 45, height: 45, material: MaterialType.STONE, special: SpecialBlockType.MAGNET },
    { x: 800, y: GROUND_Y - 60, width: 45, height: 45, material: MaterialType.STONE, special: SpecialBlockType.MAGNET },
    // TNT near pigs
    { x: 1000, y: GROUND_Y - 25, width: 40, height: 40, material: MaterialType.WOOD, special: SpecialBlockType.TNT },
    // Target structures
    { x: 1050, y: GROUND_Y - 40, width: 20, height: 80, material: MaterialType.WOOD },
    { x: 1100, y: GROUND_Y - 40, width: 20, height: 80, material: MaterialType.WOOD },
    { x: 1075, y: GROUND_Y - 90, width: 80, height: 15, material: MaterialType.WOOD },
    { x: 950, y: GROUND_Y - 40, width: 20, height: 80, material: MaterialType.ICE },
  ],
  pigs: [
    { x: 1000, y: GROUND_Y - 60 },
    { x: 1075, y: GROUND_Y - 18 },
    { x: 950, y: GROUND_Y - 18 },
  ],
  theoreticalMaxScore: 15000 + 5500 + 3000 + 2000 + 10000,
};
