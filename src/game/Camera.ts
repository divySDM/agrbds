import { GAME_WIDTH, WORLD_WIDTH } from './types';

export class Camera {
  x: number = 0;
  private targetX: number = 0;
  private readonly easing: number = 0.05;

  setTarget(x: number): void {
    this.targetX = Math.max(0, Math.min(x - GAME_WIDTH / 2, WORLD_WIDTH - GAME_WIDTH));
  }

  snapTo(x: number): void {
    this.targetX = Math.max(0, Math.min(x - GAME_WIDTH / 2, WORLD_WIDTH - GAME_WIDTH));
    this.x = this.targetX;
  }

  update(): void {
    this.x += (this.targetX - this.x) * this.easing;
  }

  followBird(birdX: number): void {
    this.setTarget(birdX);
  }

  returnToSlingshot(slingshotX: number): void {
    this.setTarget(slingshotX);
  }
}
