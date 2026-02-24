import { MaterialType } from '../game/types';

export const GRAVITY = { x: 0, y: 1.2 };

export const MATERIAL_PROPERTIES: Record<MaterialType, {
  density: number;
  friction: number;
  restitution: number;
  health: number;
}> = {
  [MaterialType.WOOD]: {
    density: 0.004,
    friction: 0.6,
    restitution: 0.3,
    health: 80,
  },
  [MaterialType.ICE]: {
    density: 0.005,
    friction: 0.1,
    restitution: 0.2,
    health: 50,
  },
  [MaterialType.STONE]: {
    density: 0.008,
    friction: 0.9,
    restitution: 0.1,
    health: 200,
  },
};

export const BIRD_PROPERTIES = {
  radius: 20,
  density: 0.008,
  friction: 0.5,
  restitution: 0.4,
} as const;

export const PIG_PROPERTIES = {
  radius: 18,
  density: 0.003,
  friction: 0.5,
  restitution: 0.3,
  health: 60,
} as const;

export const SLINGSHOT = {
  x: 200,
  y: 480,
  maxDrag: 120,
  powerScale: 0.22,
} as const;

export const BOMB = {
  blastRadius: 180,
  blastForce: 0.08,
} as const;

export const DAMAGE_VELOCITY_THRESHOLD = 2.0;
export const DAMAGE_SCALE = 18;
export const SETTLING_THRESHOLD = 0.15;
export const SETTLING_FRAMES = 60;
