import { GAME_WIDTH, GAME_HEIGHT } from '../game/types';
import { freaky } from './freaky';

const F_GAME_OVER = freaky('GAME OVER');
const F_PIGS_SURVIVED = freaky('Pigs survived!');
const F_TRY_AGAIN = freaky('TRY AGAIN');

export class GameOverScreen {
  render(ctx: CanvasRenderingContext2D): void {
    // Overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Panel
    const panelW = 400;
    const panelH = 250;
    const panelX = (GAME_WIDTH - panelW) / 2;
    const panelY = (GAME_HEIGHT - panelH) / 2;

    ctx.fillStyle = '#7a2020';
    this.roundRect(ctx, panelX, panelY, panelW, panelH, 20);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    this.roundRect(ctx, panelX, panelY, panelW, panelH, 20);
    ctx.stroke();

    // Title
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 42px Arial, sans-serif';
    ctx.fillText(F_GAME_OVER, GAME_WIDTH / 2, panelY + 70);

    // Subtitle
    ctx.font = '22px Arial, sans-serif';
    ctx.fillStyle = '#ddd';
    ctx.fillText(F_PIGS_SURVIVED, GAME_WIDTH / 2, panelY + 120);

    // Retry button
    const btnY = panelY + 190;
    ctx.fillStyle = '#4CAF50';
    this.roundRect(ctx, GAME_WIDTH / 2 - 90, btnY - 25, 180, 50, 10);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.fillText(F_TRY_AGAIN, GAME_WIDTH / 2, btnY);

    ctx.restore();
  }

  handleClick(x: number, y: number): string | null {
    const panelH = 250;
    const panelY = (GAME_HEIGHT - panelH) / 2;
    const btnY = panelY + 190;

    if (x >= GAME_WIDTH / 2 - 90 && x <= GAME_WIDTH / 2 + 90 && y >= btnY - 25 && y <= btnY + 25) {
      return 'retry';
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
