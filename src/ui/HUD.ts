import { GAME_WIDTH, BirdType } from '../game/types';
import type { BirdQueue } from '../entities/BirdQueue';
import { freaky } from './freaky';

export class HUD {
  render(ctx: CanvasRenderingContext2D, score: number, birdQueue: BirdQueue): void {
    ctx.save();

    // Score background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    this.roundRect(ctx, 10, 10, 200, 40, 8);
    ctx.fill();

    // Score text
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.fillText(freaky(`Score: ${score}`), 20, 30);

    // Bird queue indicator
    const types = birdQueue.types;
    const queueX = GAME_WIDTH - 20;
    const queueY = 30;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    const queueW = types.length * 30 + 20;
    this.roundRect(ctx, queueX - queueW, 10, queueW, 40, 8);
    ctx.fill();

    ctx.textAlign = 'center';
    for (let i = 0; i < types.length; i++) {
      const x = queueX - queueW + 20 + i * 30;
      const color = types[i] === BirdType.RED ? '#e03030' : types[i] === BirdType.YELLOW ? '#ffd700' : '#2a2a2a';
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, queueY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // "LAST BIRD!" warning
    if (birdQueue.remaining === 0 && birdQueue.total > 0) {
      ctx.font = 'bold 14px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ff4444';
      ctx.fillText('LAST BIRD!', queueX - queueW / 2, 58);
    }

    ctx.restore();
  }

  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ): void {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}
