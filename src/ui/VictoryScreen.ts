import { GAME_WIDTH, GAME_HEIGHT } from '../game/types';
import { freaky } from './freaky';

const F_LEVEL_COMPLETE = freaky('LEVEL COMPLETE!');
const F_REPLAY = freaky('REPLAY');
const F_NEXT = freaky('NEXT');

export class VictoryScreen {
  private score: number;
  private stars: number;
  private time: number = 0;

  constructor(score: number, stars: number, _levelId: number) {
    this.score = score;
    this.stars = stars;
  }

  update(dt: number): void {
    this.time += dt;
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Panel
    const panelW = 450;
    const panelH = 350;
    const panelX = (GAME_WIDTH - panelW) / 2;
    const panelY = (GAME_HEIGHT - panelH) / 2;

    ctx.fillStyle = '#2c5f8a';
    this.roundRect(ctx, panelX, panelY, panelW, panelH, 20);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    this.roundRect(ctx, panelX, panelY, panelW, panelH, 20);
    ctx.stroke();

    // Title
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 42px Arial, sans-serif';
    ctx.fillText(F_LEVEL_COMPLETE, GAME_WIDTH / 2, panelY + 50);

    // Stars (animated twinkle)
    for (let i = 0; i < 3; i++) {
      const starX = GAME_WIDTH / 2 - 70 + i * 70;
      const delay = i * 0.3;
      const starTime = Math.max(0, this.time - delay);

      if (i < this.stars && starTime > 0) {
        const scale = Math.min(starTime / 0.2, 1);
        const twinkle = 0.85 + 0.15 * Math.sin(starTime * 6);
        ctx.globalAlpha = twinkle;
        ctx.font = `${Math.round(60 * scale)}px Arial, sans-serif`;
        ctx.fillStyle = '#ffd700';
      } else {
        ctx.globalAlpha = 1;
        ctx.font = '60px Arial, sans-serif';
        ctx.fillStyle = '#555';
      }
      ctx.fillText('\u2605', starX, panelY + 130);
    }
    ctx.globalAlpha = 1;

    // Score
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 28px Arial, sans-serif';
    ctx.fillText(freaky(`Score: ${this.score}`), GAME_WIDTH / 2, panelY + 200);

    // Buttons
    const btnY = panelY + 280;

    // Replay button
    ctx.fillStyle = '#d32f2f';
    this.roundRect(ctx, GAME_WIDTH / 2 - 180, btnY - 25, 150, 50, 10);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 22px Arial, sans-serif';
    ctx.fillText(F_REPLAY, GAME_WIDTH / 2 - 105, btnY);

    // Next button
    ctx.fillStyle = '#4CAF50';
    this.roundRect(ctx, GAME_WIDTH / 2 + 30, btnY - 25, 150, 50, 10);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillText(F_NEXT, GAME_WIDTH / 2 + 105, btnY);

    ctx.restore();
  }

  handleClick(x: number, y: number): string | null {
    const panelH = 350;
    const panelY = (GAME_HEIGHT - panelH) / 2;
    const btnY = panelY + 280;

    // Replay
    if (x >= GAME_WIDTH / 2 - 180 && x <= GAME_WIDTH / 2 - 30 && y >= btnY - 25 && y <= btnY + 25) {
      return 'replay';
    }
    // Next
    if (x >= GAME_WIDTH / 2 + 30 && x <= GAME_WIDTH / 2 + 180 && y >= btnY - 25 && y <= btnY + 25) {
      return 'next';
    }
    return null;
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
