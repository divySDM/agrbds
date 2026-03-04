import { BirdType, MaterialType, SpecialBlockType } from '../game/types';
import type { LevelData } from './types';

const GROUND_Y = 660;

export const level058: LevelData = {
  id: 58,
  name: 'Mix Tape II',
  birds: [BirdType.WHITE, BirdType.WHITE, BirdType.RED, BirdType.BOMB],
  slingshot: { x: 150, y: GROUND_Y - 180 },
  blocks: [
    // Magnet pulling birds — need to account for pull
    { x: 600, y: GROUND_Y - 80, width: 50, height: 50, material: MaterialType.STONE, special: SpecialBlockType.MAGNET },
    // Teleporter pair
    { x: 500, y: GROUND_Y - 130, width: 50, height: 50, material: MaterialType.WOOD, special: SpecialBlockType.TELEPORTER },
    { x: 1000, y: GROUND_Y - 130, width: 50, height: 50, material: MaterialType.WOOD, special: SpecialBlockType.TELEPORTER },
    // Structure around exit teleporter
    { x: 980, y: GROUND_Y - 40, width: 20, height: 80, material: MaterialType.STONE },
    { x: 1050, y: GROUND_Y - 40, width: 20, height: 80, material: MaterialType.STONE },
    { x: 1015, y: GROUND_Y - 90, width: 100, height: 15, material: MaterialType.WOOD },
    // Lower bunker
    { x: 800, y: GROUND_Y - 25, width: 80, height: 50, material: MaterialType.STONE },
    { x: 800, y: GROUND_Y - 60, width: 80, height: 15, material: MaterialType.STONE },
  ],
  pigs: [
    { x: 1015, y: GROUND_Y - 18 },
    { x: 1015, y: GROUND_Y - 110 },
    { x: 800, y: GROUND_Y - 80 },
    { x: 800, y: GROUND_Y - 18 },
  ],
  teleporterPairs: [{ blockIndexA: 1, blockIndexB: 2 }],
  theoreticalMaxScore: 20000 + 6500 + 1500 + 10000,
};
