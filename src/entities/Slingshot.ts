import { SLINGSHOT, BIRD_PROPERTIES, GROUND_HEIGHT } from '../physics/constants';
import { GAME_HEIGHT } from '../game/types';
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

    const maxY = GAME_HEIGHT - GROUND_HEIGHT - BIRD_PROPERTIES.radius;
    if (this.dragY > maxY) {
      this.dragY = maxY;
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
    const groundTop = GAME_HEIGHT - 60;

    // Support pole from base to ground
    ctx.fillStyle = '#5a2d0c';
    ctx.fillRect(x - 6, y + 14, 12, groundTop - (y + 14));

    // Back arm (angled outward for Y-fork)
    ctx.save();
    ctx.fillStyle = '#6b3a1f';
    ctx.translate(x - 6, y);
    ctx.rotate(-0.2);
    ctx.fillRect(-5, -55, 8, 55);
    ctx.restore();

    // Front arm (angled outward for Y-fork)
    ctx.save();
    ctx.fillStyle = '#6b3a1f';
    ctx.translate(x + 6, y);
    ctx.rotate(0.2);
    ctx.fillRect(-3, -55, 8, 55);
    ctx.restore();

    // Wood grain lines on pole
    ctx.strokeStyle = 'rgba(90, 45, 12, 0.4)';
    ctx.lineWidth = 1;
    for (let gy = y + 20; gy < groundTop; gy += 10) {
      ctx.beginPath();
      ctx.moveTo(x - 4, gy);
      ctx.lineTo(x + 4, gy);
      ctx.stroke();
    }

    // Base
    ctx.fillStyle = '#5a2d0c';
    ctx.fillRect(x - 18, y + 2, 36, 12);

    // Rubber bands
    if (birdX !== undefined && birdY !== undefined) {
      const bx = birdX - cameraX;
      const by = birdY;

      // Color shifts with tension: brown → orange → red
      const dx = birdX - this.anchorX;
      const dy = birdY - this.anchorY;
      const tension = Math.min(Math.sqrt(dx * dx + dy * dy) / SLINGSHOT.maxDrag, 1);
      const r = Math.round(61 + tension * 194);
      const g = Math.round(43 - tension * 43);
      const b = Math.round(31 - tension * 31);
      ctx.strokeStyle = `rgb(${r},${g},${b})`;
      ctx.lineWidth = 4 + tension * 2;

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
