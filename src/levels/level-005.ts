import { BirdType, MaterialType } from '../game/types';
import type { LevelData } from './types';

// Level 5: 3 pigs, fortress with stone walls, 2 bomb + 3 red birds
const GROUND_Y = 660;

export const level005: LevelData = {
  id: 5,
  name: 'The Fortress',
  birds: [BirdType.RED, BirdType.BOMB, BirdType.BOMB, BirdType.RED, BirdType.RED],
  slingshot: { x: 180, y: GROUND_Y - 180 },
  blocks: [
    // Outer stone walls
    { x: 680, y: GROUND_Y - 70, width: 25, height: 140, material: MaterialType.STONE },
    { x: 960, y: GROUND_Y - 70, width: 25, height: 140, material: MaterialType.STONE },

    // Inner wood structure - left chamber
    { x: 740, y: GROUND_Y - 40, width: 20, height: 80, material: MaterialType.WOOD },
    { x: 800, y: GROUND_Y - 40, width: 20, height: 80, material: MaterialType.WOOD },
    { x: 770, y: GROUND_Y - 87.5, width: 80, height: 15, material: MaterialType.WOOD },

    // Inner wood structure - right chamber
    { x: 860, y: GROUND_Y - 40, width: 20, height: 80, material: MaterialType.WOOD },
    { x: 920, y: GROUND_Y - 40, width: 20, height: 80, material: MaterialType.WOOD },
    { x: 890, y: GROUND_Y - 87.5, width: 80, height: 15, material: MaterialType.WOOD },

    // Top stone roof
    { x: 820, y: GROUND_Y - 150, width: 310, height: 20, material: MaterialType.STONE },

    // Upper ice blocks (weak points)
    { x: 770, y: GROUND_Y - 110, width: 30, height: 30, material: MaterialType.ICE },
    { x: 890, y: GROUND_Y - 110, width: 30, height: 30, material: MaterialType.ICE },

    // Top decoration
    { x: 820, y: GROUND_Y - 180, width: 60, height: 40, material: MaterialType.WOOD },
  ],
  pigs: [
    { x: 770, y: GROUND_Y - 18 },
    { x: 830, y: GROUND_Y - 18 },
    { x: 890, y: GROUND_Y - 18 },
  ],
  theoreticalMaxScore: 15000 + 3500 + 2000 + 4500 + 20000, // 3 pigs + 7 wood + 2 ice + 3 stone + 2 remaining birds
};
