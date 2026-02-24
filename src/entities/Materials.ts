import { MaterialType } from '../game/types';

export interface MaterialDef {
  color: string;
  crackedColor: string;
  density: number;
  friction: number;
  restitution: number;
  health: number;
}

export const MATERIALS: Record<MaterialType, MaterialDef> = {
  [MaterialType.WOOD]: {
    color: '#c4923a',
    crackedColor: '#9e7530',
    density: 0.004,
    friction: 0.6,
    restitution: 0.3,
    health: 80,
  },
  [MaterialType.ICE]: {
    color: '#a8d8ea',
    crackedColor: '#7bb8d0',
    density: 0.005,
    friction: 0.1,
    restitution: 0.2,
    health: 50,
  },
  [MaterialType.STONE]: {
    color: '#8a8a8a',
    crackedColor: '#6a6a6a',
    density: 0.008,
    friction: 0.9,
    restitution: 0.1,
    health: 200,
  },
};
