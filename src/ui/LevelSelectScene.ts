import type { Scene } from '../game/Scene';
import type { Game } from '../game/Game';
import { SceneType, GAME_WIDTH, GAME_HEIGHT } from '../game/types';
import { LevelScene } from '../game/LevelScene';
import { LEVELS } from '../levels/index';
import { MenuScene } from './MenuScene';
import { freaky } from './freaky';

const F_SELECT_LEVEL = freaky('SELECT LEVEL');
const F_BACK = freaky('BACK');

const LEVELS_PER_PAGE = 20;

export class LevelSelectScene implements Scene {
  readonly sceneType = SceneType.LEVEL_SELECT;
  private game!: Game;
  private currentPage: number = 0;

  get totalPages(): number {
    return Math.ceil(LEVELS.length / LEVELS_PER_PAGE);
  }

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
    ctx.fillText(F_SELECT_LEVEL, GAME_WIDTH / 2, 80);

    // Level buttons
    const cols = 5;
    const btnSize = 80;
    const gap = 20;
    const totalW = cols * btnSize + (cols - 1) * gap;
    const startX = (GAME_WIDTH - totalW) / 2 + btnSize / 2;
    const startY = 180;

    const pageStart = this.currentPage * LEVELS_PER_PAGE;
    const pageEnd = Math.min(pageStart + LEVELS_PER_PAGE, LEVELS.length);

    for (let i = pageStart; i < pageEnd; i++) {
      const pageIdx = i - pageStart;
      const col = pageIdx % cols;
      const row = Math.floor(pageIdx / cols);
      const x = startX + col * (btnSize + gap);
      const y = startY + row * (btnSize + gap);
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
        ctx.font = 'bold 28px Arial, sans-serif';
        ctx.fillText(freaky(String(levelNum)), x, y - 6);

        // Stars
        for (let s = 0; s < 3; s++) {
          const starX = x - 18 + s * 18;
          const starY = y + 24;
          ctx.fillStyle = s < stars ? '#ffd700' : '#555';
          ctx.font = '14px Arial, sans-serif';
          ctx.fillText('\u2605', starX, starY);
        }
      } else {
        // Lock icon
        ctx.fillStyle = '#888';
        ctx.font = '36px Arial, sans-serif';
        ctx.fillText('\uD83D\uDD12', x, y);
      }
    }

    // Page navigation arrows
    const arrowY = startY + 2 * (btnSize + gap); // Center vertically in grid area
    const arrowSize = 40;

    // Left arrow (hide on page 0)
    if (this.currentPage > 0) {
      const lx = (GAME_WIDTH - totalW) / 2 - arrowSize - 15;
      ctx.fillStyle = '#5a7dbf';
      this.roundRect(ctx, lx, arrowY - arrowSize / 2, arrowSize, arrowSize, 8);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      this.roundRect(ctx, lx, arrowY - arrowSize / 2, arrowSize, arrowSize, 8);
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 24px Arial, sans-serif';
      ctx.fillText('\u25C0', lx + arrowSize / 2, arrowY);
    }

    // Right arrow (hide on last page)
    if (this.currentPage < this.totalPages - 1) {
      const rx = (GAME_WIDTH + totalW) / 2 + 15;
      ctx.fillStyle = '#5a7dbf';
      this.roundRect(ctx, rx, arrowY - arrowSize / 2, arrowSize, arrowSize, 8);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      this.roundRect(ctx, rx, arrowY - arrowSize / 2, arrowSize, arrowSize, 8);
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 24px Arial, sans-serif';
      ctx.fillText('\u25B6', rx + arrowSize / 2, arrowY);
    }

    // Page dots
    const dotY = GAME_HEIGHT - 130;
    const dotSpacing = 20;
    const totalDotW = (this.totalPages - 1) * dotSpacing;
    const dotStartX = GAME_WIDTH / 2 - totalDotW / 2;

    for (let p = 0; p < this.totalPages; p++) {
      const dx = dotStartX + p * dotSpacing;
      ctx.fillStyle = p === this.currentPage ? '#fff' : 'rgba(255,255,255,0.4)';
      ctx.beginPath();
      ctx.arc(dx, dotY, p === this.currentPage ? 6 : 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Back button
    ctx.fillStyle = '#d32f2f';
    this.roundRect(ctx, 40, GAME_HEIGHT - 80, 120, 50, 10);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 22px Arial, sans-serif';
    ctx.fillText(F_BACK, 100, GAME_HEIGHT - 55);

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

    // Check page navigation arrows
    const cols = 5;
    const btnSize = 80;
    const gap = 20;
    const totalW = cols * btnSize + (cols - 1) * gap;
    const startX = (GAME_WIDTH - totalW) / 2 + btnSize / 2;
    const startY = 180;
    const arrowY = startY + 2 * (btnSize + gap);
    const arrowSize = 40;

    // Left arrow
    if (this.currentPage > 0) {
      const lx = (GAME_WIDTH - totalW) / 2 - arrowSize - 15;
      if (x >= lx && x <= lx + arrowSize && y >= arrowY - arrowSize / 2 && y <= arrowY + arrowSize / 2) {
        this.currentPage--;
        return;
      }
    }

    // Right arrow
    if (this.currentPage < this.totalPages - 1) {
      const rx = (GAME_WIDTH + totalW) / 2 + 15;
      if (x >= rx && x <= rx + arrowSize && y >= arrowY - arrowSize / 2 && y <= arrowY + arrowSize / 2) {
        this.currentPage++;
        return;
      }
    }

    // Check level buttons
    const pageStart = this.currentPage * LEVELS_PER_PAGE;
    const pageEnd = Math.min(pageStart + LEVELS_PER_PAGE, LEVELS.length);

    for (let i = pageStart; i < pageEnd; i++) {
      const pageIdx = i - pageStart;
      const col = pageIdx % cols;
      const row = Math.floor(pageIdx / cols);
      const bx = startX + col * (btnSize + gap);
      const by = startY + row * (btnSize + gap);
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
