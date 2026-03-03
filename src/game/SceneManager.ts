import type { Scene } from './Scene';
import type { Game } from './Game';

export class SceneManager {
  private currentScene: Scene | null = null;
  private game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  switchTo(scene: Scene): void {
    if (this.currentScene) {
      this.currentScene.exit();
    }
    this.currentScene = scene;
    this.currentScene.enter(this.game);
  }

  update(dt: number): void {
    this.currentScene?.update(dt);
  }

  render(ctx: CanvasRenderingContext2D): void {
    this.currentScene?.render(ctx);
  }

  get current(): Scene | null {
    return this.currentScene;
  }

  onPointerDown(x: number, y: number): void {
    this.currentScene?.onPointerDown?.(x, y);
  }

  onPointerMove(x: number, y: number): void {
    this.currentScene?.onPointerMove?.(x, y);
  }

  onPointerUp(x: number, y: number): void {
    this.currentScene?.onPointerUp?.(x, y);
  }

  onKeyDown(key: string): void {
    this.currentScene?.onKeyDown?.(key);
  }
}
