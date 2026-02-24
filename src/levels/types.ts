import { BirdType, MaterialType } from '../game/types';

export interface BlockDef {
  x: number;
  y: number;
  width: number;
  height: number;
  material: MaterialType;
}

export interface PigDef {
  x: number;
  y: number;
}

export interface LevelData {
  id: number;
  name: string;
  birds: BirdType[];
  slingshot: { x: number; y: number };
  blocks: BlockDef[];
  pigs: PigDef[];
  theoreticalMaxScore: number;
}
