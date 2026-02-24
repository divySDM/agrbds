import type { Game } from './Game';
import type { SceneType } from './types';

export interface Scene {
  readonly sceneType: SceneType;
  enter(game: Game): void;
  exit(): void;
  update(dt: number): void;
  render(ctx: CanvasRenderingContext2D): void;
  onPointerDown?(x: number, y: number): void;
  onPointerMove?(x: number, y: number): void;
  onPointerUp?(x: number, y: number): void;
}
