import { SLINGSHOT } from '../physics/constants';
import type { Vec2 } from '../game/types';

export class Slingshot {
  readonly anchorX: number;
  readonly anchorY: number;
  private dragX: number = 0;
  private dragY: number = 0;
  private _isDragging: boolean = false;

  constructor(x: number = SLINGSHOT.x, y: number = SLINGSHOT.y) {
    this.anchorX = x;
    this.anchorY = y;
  }

  get isDragging(): boolean {
    return this._isDragging;
  }

  startDrag(): void {
    this._isDragging = true;
    this.dragX = this.anchorX;
    this.dragY = this.anchorY;
  }

  updateDrag(pointerX: number, pointerY: number): void {
    if (!this._isDragging) return;
    const dx = pointerX - this.anchorX;
    const dy = pointerY - this.anchorY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > SLINGSHOT.maxDrag) {
      const scale = SLINGSHOT.maxDrag / dist;
      this.dragX = this.anchorX + dx * scale;
      this.dragY = this.anchorY + dy * scale;
    } else {
      this.dragX = pointerX;
      this.dragY = pointerY;
    }
  }

  release(): Vec2 {
    this._isDragging = false;
    const vx = (this.anchorX - this.dragX) * SLINGSHOT.powerScale;
    const vy = (this.anchorY - this.dragY) * SLINGSHOT.powerScale;
    return { x: vx, y: vy };
  }

  getDragPosition(): Vec2 {
    return { x: this.dragX, y: this.dragY };
  }

  getVelocityPreview(): Vec2 {
    return {
      x: (this.anchorX - this.dragX) * SLINGSHOT.powerScale,
      y: (this.anchorY - this.dragY) * SLINGSHOT.powerScale,
    };
  }

  render(ctx: CanvasRenderingContext2D, cameraX: number, birdX?: number, birdY?: number): void {
    const x = this.anchorX - cameraX;
    const y = this.anchorY;

    // Back arm
    ctx.fillStyle = '#6b3a1f';
    ctx.fillRect(x - 16, y - 50, 8, 55);

    // Front arm
    ctx.fillRect(x + 8, y - 50, 8, 55);

    // Base
    ctx.fillStyle = '#5a2d0c';
    ctx.fillRect(x - 18, y + 2, 36, 12);

    // Rubber bands
    if (birdX !== undefined && birdY !== undefined) {
      const bx = birdX - cameraX;
      const by = birdY;

      ctx.strokeStyle = '#3d2b1f';
      ctx.lineWidth = 4;

      // Back band
      ctx.beginPath();
      ctx.moveTo(x - 12, y - 44);
      ctx.lineTo(bx, by);
      ctx.stroke();

      // Front band
      ctx.beginPath();
      ctx.moveTo(x + 12, y - 44);
      ctx.lineTo(bx, by);
      ctx.stroke();
    } else {
      // Relaxed band
      ctx.strokeStyle = '#3d2b1f';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x - 12, y - 44);
      ctx.lineTo(x + 12, y - 44);
      ctx.stroke();
    }
  }
}
