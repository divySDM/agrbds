import { GAME_WIDTH, GAME_HEIGHT } from '../game/types';

export class GameOverScreen {
  private time: number = 0;

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

    // Panel with shake on appear
    const panelW = 400;
    const panelH = 300;
    const panelX = (GAME_WIDTH - panelW) / 2;
    const panelY = (GAME_HEIGHT - panelH) / 2;

    // Shake offset for first 0.3s
    let shakeX = 0;
    if (this.time < 0.3) {
      const decay = 1 - this.time / 0.3;
      shakeX = Math.sin(this.time * 50) * 5 * decay;
    }

    ctx.translate(shakeX, 0);

    ctx.fillStyle = '#7a2020';
    this.roundRect(ctx, panelX, panelY, panelW, panelH, 20);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    this.roundRect(ctx, panelX, panelY, panelW, panelH, 20);
    ctx.stroke();

    // Sad pig face
    const pigX = GAME_WIDTH / 2;
    const pigY = panelY + 55;
    // Body
    ctx.fillStyle = '#6abf4b';
    ctx.beginPath();
    ctx.arc(pigX, pigY, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#3a7a2a';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Snout
    ctx.fillStyle = '#8fd97a';
    ctx.beginPath();
    ctx.ellipse(pigX, pigY + 6, 14, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    // Nostrils
    ctx.fillStyle = '#3a7a2a';
    ctx.beginPath();
    ctx.arc(pigX - 4, pigY + 6, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(pigX + 4, pigY + 6, 2, 0, Math.PI * 2);
    ctx.fill();
    // Sad eyes (looking down)
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(pigX - 10, pigY - 8, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(pigX + 10, pigY - 8, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(pigX - 10, pigY - 5, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(pigX + 10, pigY - 5, 3, 0, Math.PI * 2);
    ctx.fill();
    // Sad mouth (frown)
    ctx.strokeStyle = '#3a7a2a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(pigX, pigY + 20, 8, Math.PI + 0.3, Math.PI * 2 - 0.3);
    ctx.stroke();

    // Title
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 42px Arial, sans-serif';
    ctx.fillText('GAME OVER', GAME_WIDTH / 2, panelY + 120);

    // Subtitle with personality
    ctx.font = '20px Arial, sans-serif';
    ctx.fillStyle = '#ffcccc';
    ctx.fillText('The pigs are laughing at you!', GAME_WIDTH / 2, panelY + 160);

    // Retry button
    const btnY = panelY + 235;
    ctx.fillStyle = '#4CAF50';
    this.roundRect(ctx, GAME_WIDTH / 2 - 90, btnY - 25, 180, 50, 10);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.fillText('TRY AGAIN', GAME_WIDTH / 2, btnY);

    ctx.restore();
  }

  handleClick(x: number, y: number): string | null {
    const panelH = 300;
    const panelY = (GAME_HEIGHT - panelH) / 2;
    const btnY = panelY + 235;

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
