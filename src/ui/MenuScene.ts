import type { Scene } from '../game/Scene';
import type { Game } from '../game/Game';
import { SceneType, GAME_WIDTH, GAME_HEIGHT } from '../game/types';
import { LevelSelectScene } from './LevelSelectScene';

export class MenuScene implements Scene {
  readonly sceneType = SceneType.MENU;
  private game!: Game;
  private titleBounce: number = 0;

  enter(game: Game): void {
    this.game = game;
  }

  exit(): void {}

  update(dt: number): void {
    this.titleBounce += dt * 2;
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Sky gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
    gradient.addColorStop(0, '#2d6ab5');
    gradient.addColorStop(0.5, '#4a90d9');
    gradient.addColorStop(1, '#87ceeb');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    const cloudY = 120;
    for (const cx of [150, 500, 850, 1100]) {
      ctx.beginPath();
      ctx.arc(cx, cloudY, 35, 0, Math.PI * 2);
      ctx.arc(cx + 30, cloudY - 12, 28, 0, Math.PI * 2);
      ctx.arc(cx + 55, cloudY, 32, 0, Math.PI * 2);
      ctx.fill();
    }

    // Ground
    ctx.fillStyle = '#4a8c3f';
    ctx.fillRect(0, GAME_HEIGHT - 80, GAME_WIDTH, 80);
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(0, GAME_HEIGHT - 60, GAME_WIDTH, 60);

    // Title
    const bounce = Math.sin(this.titleBounce) * 8;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Title shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.font = 'bold 80px Arial, sans-serif';
    ctx.fillText('ANGRY BIRDS', GAME_WIDTH / 2 + 3, 240 + bounce + 3);

    // Title
    ctx.fillStyle = '#ff3030';
    ctx.font = 'bold 80px Arial, sans-serif';
    ctx.fillText('ANGRY BIRDS', GAME_WIDTH / 2, 240 + bounce);

    // Title outline
    ctx.strokeStyle = '#8b0000';
    ctx.lineWidth = 3;
    ctx.strokeText('ANGRY BIRDS', GAME_WIDTH / 2, 240 + bounce);

    // Subtitle
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.fillText('Browser Edition', GAME_WIDTH / 2, 300 + bounce);

    // Play button
    const btnX = GAME_WIDTH / 2;
    const btnY = 430;
    const btnW = 220;
    const btnH = 70;

    // Button shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.roundRect(ctx, btnX - btnW / 2 + 3, btnY - btnH / 2 + 3, btnW, btnH, 15);
    ctx.fill();

    // Button bg
    ctx.fillStyle = '#4CAF50';
    this.roundRect(ctx, btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 15);
    ctx.fill();

    // Button border
    ctx.strokeStyle = '#2E7D32';
    ctx.lineWidth = 3;
    this.roundRect(ctx, btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 15);
    ctx.stroke();

    // Button text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 36px Arial, sans-serif';
    ctx.fillText('PLAY', btnX, btnY + 2);

    // Decorative birds
    this.drawMiniBird(ctx, 200, 380, '#e03030');
    this.drawMiniBird(ctx, GAME_WIDTH - 200, 400, '#2a2a2a');

    ctx.restore();
  }

  private drawMiniBird(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): void {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x - 5, y - 5, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 5, y - 5, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x - 4, y - 5, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 6, y - 5, 2.5, 0, Math.PI * 2);
    ctx.fill();
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

  onPointerDown(x: number, y: number): void {
    // Check play button
    const btnX = GAME_WIDTH / 2;
    const btnY = 430;
    const btnW = 220;
    const btnH = 70;

    if (
      x >= btnX - btnW / 2 &&
      x <= btnX + btnW / 2 &&
      y >= btnY - btnH / 2 &&
      y <= btnY + btnH / 2
    ) {
      this.game.sceneManager.switchTo(new LevelSelectScene());
    }
  }
}
