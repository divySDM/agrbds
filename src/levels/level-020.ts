import { BirdType, MaterialType } from '../game/types';
import type { LevelData } from './types';

// Level 20: Grand Finale - Massive fortress with every material and many pigs
const GROUND_Y = 660;

export const level020: LevelData = {
  id: 20,
  name: 'Grand Finale',
  birds: [BirdType.RED, BirdType.YELLOW, BirdType.BOMB, BirdType.BOMB, BirdType.YELLOW, BirdType.RED],
  slingshot: { x: 160, y: GROUND_Y - 180 },
  blocks: [
    // Grand outer stone walls
    { x: 620, y: GROUND_Y - 90, width: 30, height: 180, material: MaterialType.STONE },
    { x: 1040, y: GROUND_Y - 90, width: 30, height: 180, material: MaterialType.STONE },

    // Left wing - wood structure
    { x: 690, y: GROUND_Y - 50, width: 20, height: 100, material: MaterialType.WOOD },
    { x: 750, y: GROUND_Y - 50, width: 20, height: 100, material: MaterialType.WOOD },
    { x: 720, y: GROUND_Y - 107.5, width: 80, height: 15, material: MaterialType.WOOD },

    // Central keep - stone base, ice middle, wood top
    { x: 810, y: GROUND_Y - 40, width: 25, height: 80, material: MaterialType.STONE },
    { x: 870, y: GROUND_Y - 40, width: 25, height: 80, material: MaterialType.STONE },
    { x: 840, y: GROUND_Y - 87.5, width: 85, height: 15, material: MaterialType.STONE },

    { x: 825, y: GROUND_Y - 115, width: 15, height: 40, material: MaterialType.ICE },
    { x: 855, y: GROUND_Y - 115, width: 15, height: 40, material: MaterialType.ICE },
    { x: 840, y: GROUND_Y - 142.5, width: 60, height: 15, material: MaterialType.ICE },

    { x: 840, y: GROUND_Y - 165, width: 30, height: 30, material: MaterialType.WOOD },

    // Right wing - wood structure
    { x: 920, y: GROUND_Y - 50, width: 20, height: 100, material: MaterialType.WOOD },
    { x: 980, y: GROUND_Y - 50, width: 20, height: 100, material: MaterialType.WOOD },
    { x: 950, y: GROUND_Y - 107.5, width: 80, height: 15, material: MaterialType.WOOD },

    // Grand roof spanning everything
    { x: 830, y: GROUND_Y - 190, width: 450, height: 20, material: MaterialType.STONE },

    // Battlements on top
    { x: 680, y: GROUND_Y - 210, width: 25, height: 20, material: MaterialType.STONE },
    { x: 760, y: GROUND_Y - 210, width: 25, height: 20, material: MaterialType.STONE },
    { x: 840, y: GROUND_Y - 210, width: 25, height: 20, material: MaterialType.STONE },
    { x: 920, y: GROUND_Y - 210, width: 25, height: 20, material: MaterialType.STONE },
    { x: 1000, y: GROUND_Y - 210, width: 25, height: 20, material: MaterialType.STONE },
  ],
  pigs: [
    { x: 720, y: GROUND_Y - 18 },
    { x: 840, y: GROUND_Y - 18 },
    { x: 950, y: GROUND_Y - 18 },
    { x: 720, y: GROUND_Y - 125 },
    { x: 840, y: GROUND_Y - 100 },
    { x: 950, y: GROUND_Y - 125 },
  ],
  theoreticalMaxScore: 30000 + 3000 + 3000 + 13500 + 500 + 0,
};
