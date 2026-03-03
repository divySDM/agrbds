import { GAME_WIDTH, WORLD_WIDTH } from './types';
import { CAMERA_EASING, SCREEN_SHAKE } from '../physics/constants';

export class Camera {
  x: number = 0;
  shakeOffsetY: number = 0;
  private targetX: number = 0;
  private easing: number = CAMERA_EASING.DEFAULT;
  private shakeIntensity: number = 0;
  private shakeDuration: number = 0;
  private shakeTime: number = 0;

  setTarget(x: number): void {
    if (!Number.isFinite(x)) return;
    this.targetX = Math.max(0, Math.min(x - GAME_WIDTH / 2, WORLD_WIDTH - GAME_WIDTH));
  }

  snapTo(x: number): void {
    this.targetX = Math.max(0, Math.min(x - GAME_WIDTH / 2, WORLD_WIDTH - GAME_WIDTH));
    this.x = this.targetX;
  }

  shake(intensity: number, duration: number = SCREEN_SHAKE.DURATION): void {
    if (intensity > this.shakeIntensity) {
      this.shakeIntensity = intensity;
      this.shakeDuration = duration;
      this.shakeTime = 0;
    }
  }

  update(dt: number): void {
    this.x += (this.targetX - this.x) * this.easing;

    if (this.shakeTime < this.shakeDuration) {
      this.shakeTime += dt;
      const decay = 1 - this.shakeTime / this.shakeDuration;
      this.x += Math.sin(this.shakeTime * 40) * this.shakeIntensity * decay;
      this.shakeOffsetY = Math.cos(this.shakeTime * 35) * this.shakeIntensity * decay * 0.5;
    } else {
      this.shakeIntensity = 0;
      this.shakeOffsetY = 0;
    }
  }

  followBird(birdX: number): void {
    this.easing = CAMERA_EASING.FOLLOW;
    this.setTarget(birdX);
  }

  returnToSlingshot(slingshotX: number): void {
    this.easing = CAMERA_EASING.RETURN;
    this.setTarget(slingshotX);
  }
}
