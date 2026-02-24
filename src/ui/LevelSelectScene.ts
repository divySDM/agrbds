import type { Scene } from '../game/Scene';
import type { Game } from '../game/Game';
import { GAME_WIDTH, GAME_HEIGHT } from '../game/types';
import { LevelScene } from '../game/LevelScene';
import { LEVELS } from '../levels/index';
import { MenuScene } from './MenuScene';

export class LevelSelectScene implements Scene {
  private game!: Game;

  enter(game: Game): void {
    this.game = game;
  }

  exit(): void {}

  update(_dt: number): void {}

  render(ctx: CanvasRenderingContext2D): void {
    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
    gradient.addColorStop(0, '#2d6ab5');
    gradient.addColorStop(1, '#87ceeb');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Title
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px Arial, sans-serif';
    ctx.fillText('SELECT LEVEL', GAME_WIDTH / 2, 80);

    // Level buttons
    const cols = 5;
    const btnSize = 100;
    const gap = 30;
    const totalW = cols * btnSize + (cols - 1) * gap;
    const startX = (GAME_WIDTH - totalW) / 2 + btnSize / 2;
    const startY = 250;

    for (let i = 0; i < LEVELS.length; i++) {
      const col = i % cols;
      const x = startX + col * (btnSize + gap);
      const y = startY;
      const levelNum = i + 1;
      const isUnlocked = levelNum <= this.game.highestUnlocked;
      const stars = this.game.levelStars.get(levelNum) ?? 0;

      // Button background
      if (isUnlocked) {
        ctx.fillStyle = levelNum === this.game.highestUnlocked && stars === 0
          ? '#4CAF50'  // Next unlocked (green highlight)
          : '#5a7dbf'; // Completed or available
      } else {
        ctx.fillStyle = '#555';
      }

      this.roundRect(ctx, x - btnSize / 2, y - btnSize / 2, btnSize, btnSize, 12);
      ctx.fill();

      // Border
      ctx.strokeStyle = isUnlocked ? '#fff' : '#777';
      ctx.lineWidth = 2;
      this.roundRect(ctx, x - btnSize / 2, y - btnSize / 2, btnSize, btnSize, 12);
      ctx.stroke();

      if (isUnlocked) {
        // Level number
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 36px Arial, sans-serif';
        ctx.fillText(String(levelNum), x, y - 8);

        // Stars
        for (let s = 0; s < 3; s++) {
          const starX = x - 20 + s * 20;
          const starY = y + 30;
          ctx.fillStyle = s < stars ? '#ffd700' : '#555';
          ctx.font = '16px Arial, sans-serif';
          ctx.fillText('\u2605', starX, starY);
        }
      } else {
        // Lock icon
        ctx.fillStyle = '#888';
        ctx.font = '36px Arial, sans-serif';
        ctx.fillText('\uD83D\uDD12', x, y);
      }
    }

    // Back button
    ctx.fillStyle = '#d32f2f';
    this.roundRect(ctx, 40, GAME_HEIGHT - 80, 120, 50, 10);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 22px Arial, sans-serif';
    ctx.fillText('BACK', 100, GAME_HEIGHT - 55);

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

  onPointerDown(x: number, y: number): void {
    // Check back button
    if (x >= 40 && x <= 160 && y >= GAME_HEIGHT - 80 && y <= GAME_HEIGHT - 30) {
      this.game.sceneManager.switchTo(new MenuScene());
      return;
    }

    // Check level buttons
    const cols = 5;
    const btnSize = 100;
    const gap = 30;
    const totalW = cols * btnSize + (cols - 1) * gap;
    const startX = (GAME_WIDTH - totalW) / 2 + btnSize / 2;
    const startY = 250;

    for (let i = 0; i < LEVELS.length; i++) {
      const col = i % cols;
      const bx = startX + col * (btnSize + gap);
      const by = startY;
      const levelNum = i + 1;

      if (
        levelNum <= this.game.highestUnlocked &&
        x >= bx - btnSize / 2 &&
        x <= bx + btnSize / 2 &&
        y >= by - btnSize / 2 &&
        y <= by + btnSize / 2
      ) {
        this.game.sceneManager.switchTo(new LevelScene(LEVELS[i]));
        return;
      }
    }
  }
}
