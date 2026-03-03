import { BirdType, MaterialType } from '../game/types';
import type { LevelData } from './types';

// Level 16: Twin Peaks - Two tall towers with pigs at multiple heights
const GROUND_Y = 660;

export const level016: LevelData = {
  id: 16,
  name: 'Twin Peaks',
  birds: [BirdType.BOMB, BirdType.RED, BirdType.BOMB, BirdType.RED],
  slingshot: { x: 180, y: GROUND_Y - 180 },
  blocks: [
    // Left tower - base
    { x: 710, y: GROUND_Y - 50, width: 20, height: 100, material: MaterialType.STONE },
    { x: 770, y: GROUND_Y - 50, width: 20, height: 100, material: MaterialType.STONE },
    { x: 740, y: GROUND_Y - 107.5, width: 80, height: 15, material: MaterialType.WOOD },

    // Left tower - second floor
    { x: 720, y: GROUND_Y - 140, width: 15, height: 50, material: MaterialType.WOOD },
    { x: 760, y: GROUND_Y - 140, width: 15, height: 50, material: MaterialType.WOOD },
    { x: 740, y: GROUND_Y - 172.5, width: 60, height: 15, material: MaterialType.WOOD },

    // Left tower - top
    { x: 740, y: GROUND_Y - 195, width: 30, height: 30, material: MaterialType.ICE },

    // Right tower - base
    { x: 890, y: GROUND_Y - 50, width: 20, height: 100, material: MaterialType.STONE },
    { x: 950, y: GROUND_Y - 50, width: 20, height: 100, material: MaterialType.STONE },
    { x: 920, y: GROUND_Y - 107.5, width: 80, height: 15, material: MaterialType.WOOD },

    // Right tower - second floor
    { x: 900, y: GROUND_Y - 140, width: 15, height: 50, material: MaterialType.WOOD },
    { x: 940, y: GROUND_Y - 140, width: 15, height: 50, material: MaterialType.WOOD },
    { x: 920, y: GROUND_Y - 172.5, width: 60, height: 15, material: MaterialType.WOOD },

    // Right tower - top
    { x: 920, y: GROUND_Y - 195, width: 30, height: 30, material: MaterialType.ICE },
  ],
  pigs: [
    { x: 740, y: GROUND_Y - 18 },
    { x: 740, y: GROUND_Y - 125 },
    { x: 920, y: GROUND_Y - 18 },
    { x: 920, y: GROUND_Y - 125 },
  ],
  theoreticalMaxScore: 20000 + 4000 + 6000 + 2000 + 0,
};
