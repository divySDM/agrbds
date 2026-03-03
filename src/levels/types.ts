import { BirdType, MaterialType, SpecialBlockType } from '../game/types';

export interface BlockDef {
  x: number;
  y: number;
  width: number;
  height: number;
  material: MaterialType;
  special?: SpecialBlockType;
}

export interface PigDef {
  x: number;
  y: number;
}

export interface TeleporterPairDef {
  blockIndexA: number;
  blockIndexB: number;
}

export interface LevelData {
  id: number;
  name: string;
  birds: BirdType[];
  slingshot: { x: number; y: number };
  blocks: BlockDef[];
  pigs: PigDef[];
  theoreticalMaxScore: number;
  teleporterPairs?: TeleporterPairDef[];
}
