import { BirdType, MaterialType } from '../game/types';

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
  [MaterialType.RUBBER]: {
    density: 0.006,
    friction: 0.2,
    restitution: 0.9,
    health: 300,
  },
  [MaterialType.SAND]: {
    density: 0.010,
    friction: 0.8,
    restitution: 0.05,
    health: 25,
  },
};

export const BIRD_PROPERTIES = {
  radius: 20,
  density: 0.008,
  friction: 0.5,
  restitution: 0.4,
} as const;

export const BIRD_STATS: Record<BirdType, { radius: number; density: number; restitution: number }> = {
  [BirdType.RED]: { radius: 20, density: 0.008, restitution: 0.4 },
  [BirdType.YELLOW]: { radius: 20, density: 0.008, restitution: 0.4 },
  [BirdType.BOMB]: { radius: 20, density: 0.008, restitution: 0.4 },
  [BirdType.BLUE]: { radius: 18, density: 0.006, restitution: 0.4 },
  [BirdType.WHITE]: { radius: 22, density: 0.008, restitution: 0.3 },
  [BirdType.BIG]: { radius: 32, density: 0.020, restitution: 0.1 },
};

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
  powerScale: 0.25,
} as const;

export const BOMB = {
  blastRadius: 180,
  blastForce: 0.08,
} as const;

export const TNT = {
  blastRadius: 200,
  blastForce: 0.12,
  chainDelay: 0.1,
  maxChainDepth: 10,
} as const;

export const GRAVITY_INVERSION = {
  duration: 3.0,
} as const;

export const BLUE_SPLIT = {
  angleSpread: 15,
  fragmentMassFactor: 0.4,
  fragmentRadius: 14,
} as const;

export const EGG_BOMB = {
  radius: 10,
  blastRadius: 120,
  blastForce: 0.06,
  fuseTime: 0.3,
} as const;

export const MAGNET_PULL = {
  range: 150,
  force: 0.0005,
  maxAffected: 8,
} as const;

export const CONVEYOR = {
  pushForce: 0.003,
  maxSpeed: 3.0,
} as const;

export const EXPLOSIVE_BARREL = {
  fuseTime: 2.0,
  blastRadius: 180,
  blastForce: 0.10,
  health: 60,
} as const;

export const DAMAGE_VELOCITY_THRESHOLD = 2.0;
export const DAMAGE_SCALE = 18;
export const SETTLING_THRESHOLD = 0.15;
export const SETTLING_FRAMES = 60;

export const TIMING = {
  NEXT_BIRD_DELAY: 1.5,
  MAX_FLYING_TIME: 8.0,
  BIRD_SETTLE_GRACE: 1.5,
  BIRD_SETTLE_SPEED: 1.5,
  PARTICLE_LIFE_MIN: 0.8,
  PARTICLE_LIFE_RANGE: 0.7,
  EXPLOSION_DURATION: 0.4,
  COMBO_WINDOW: 2.0,
  SLOW_MO_DURATION: 0.25,
  SLOW_MO_FACTOR: 0.3,
  FLOATING_TEXT_LIFE: 1.2,
} as const;

export const CAMERA_EASING = {
  FOLLOW: 0.20,
  RETURN: 0.06,
  DEFAULT: 0.08,
} as const;

export const SCREEN_SHAKE = {
  IMPACT_THRESHOLD: 5,
  SMALL_INTENSITY: 3,
  LARGE_INTENSITY: 8,
  BOMB_INTENSITY: 12,
  DURATION: 0.2,
} as const;

export const BIRD_BOUNDS = {
  MAX_Y_OFFSET: 100,
  MAX_X_FACTOR: 3,
  MIN_X: -200,
} as const;

export const GROUND_HEIGHT = 60;
