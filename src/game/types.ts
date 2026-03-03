export enum BirdType {
  RED = 'RED',
  YELLOW = 'YELLOW',
  BOMB = 'BOMB',
}

export enum MaterialType {
  WOOD = 'WOOD',
  ICE = 'ICE',
  STONE = 'STONE',
}

export enum DamageState {
  INTACT = 'INTACT',
  LIGHT_DAMAGE = 'LIGHT_DAMAGE',
  CRACKED = 'CRACKED',
  DESTROYED = 'DESTROYED',
}

export enum TurnState {
  AIMING = 'AIMING',
  FLYING = 'FLYING',
  SETTLING = 'SETTLING',
  NEXT_BIRD = 'NEXT_BIRD',
  LEVEL_WON = 'LEVEL_WON',
  LEVEL_LOST = 'LEVEL_LOST',
}

export enum SceneType {
  MENU = 'MENU',
  LEVEL_SELECT = 'LEVEL_SELECT',
  PLAYING = 'PLAYING',
  VICTORY = 'VICTORY',
  GAME_OVER = 'GAME_OVER',
}

export interface Vec2 {
  x: number;
  y: number;
}

export interface GameEntity {
  id: string;
  position: Vec2;
  update(dt: number): void;
  render(ctx: CanvasRenderingContext2D, camera: { x: number; y: number }): void;
  destroy(): void;
  isDestroyed: boolean;
}

// Collision categories for Matter.js
export const COLLISION_CATEGORIES = {
  BIRD: 0x0001,
  PIG: 0x0002,
  BLOCK: 0x0004,
  GROUND: 0x0008,
} as const;

// Game constants
export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;
export const WORLD_WIDTH = 2560;

// Test API state snapshot (DEV mode only)
export interface TestGameState {
  scene: SceneType;
  turnState: TurnState | null;
  score: number;
  pigsAlive: number;
  birdsRemaining: number;
  levelId: number | null;
  highestUnlocked: number;
  levelStars: Record<number, number>;
  cameraX: number;
  slingshotX: number;
  slingshotY: number;
}

// Scoring constants
export const SCORE = {
  PIG_DEFEAT: 5000,
  BLOCK_WOOD: 500,
  BLOCK_ICE: 1000,
  BLOCK_STONE: 1500,
  REMAINING_BIRD: 10000,
  STAR_2_THRESHOLD: 0.6,
  STAR_3_THRESHOLD: 0.85,
} as const;
