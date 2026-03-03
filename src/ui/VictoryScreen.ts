import { GAME_WIDTH, GAME_HEIGHT } from '../game/types';

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  rotSpeed: number;
  color: string;
  w: number;
  h: number;
}

export class VictoryScreen {
  private score: number;
  private stars: number;
  private time: number = 0;
  private confetti: ConfettiPiece[] = [];

  constructor(score: number, stars: number, _levelId: number) {
    this.score = score;
    this.stars = stars;

    // Spawn confetti
    const colors = ['#ff3030', '#ffd700', '#4CAF50', '#2196F3', '#ff69b4', '#ff8c00'];
    for (let i = 0; i < 50; i++) {
      this.confetti.push({
        x: Math.random() * GAME_WIDTH,
        y: -Math.random() * 200,
        vx: (Math.random() - 0.5) * 120,
        vy: 80 + Math.random() * 150,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        w: 6 + Math.random() * 6,
        h: 4 + Math.random() * 4,
      });
    }
  }

  update(dt: number): void {
    this.time += dt;
    for (const c of this.confetti) {
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      c.vy += 60 * dt; // gravity
      c.rot += c.rotSpeed * dt;
      // wrap horizontally
      if (c.x < 0) c.x = GAME_WIDTH;
      if (c.x > GAME_WIDTH) c.x = 0;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Confetti
    for (const c of this.confetti) {
      if (c.y > GAME_HEIGHT + 20) continue;
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rot);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
      ctx.restore();
    }

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
    ctx.fillText('LEVEL COMPLETE!', GAME_WIDTH / 2, panelY + 50);

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

    // Score (count-up animation over 1s)
    const displayScore = Math.min(this.score, Math.floor(this.time * this.score / 1.0));
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 28px Arial, sans-serif';
    ctx.fillText(`Score: ${displayScore}`, GAME_WIDTH / 2, panelY + 200);

    // Buttons
    const btnY = panelY + 280;

    // Replay button
    ctx.fillStyle = '#d32f2f';
    this.roundRect(ctx, GAME_WIDTH / 2 - 180, btnY - 25, 150, 50, 10);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 22px Arial, sans-serif';
    ctx.fillText('REPLAY', GAME_WIDTH / 2 - 105, btnY);

    // Next button
    ctx.fillStyle = '#4CAF50';
    this.roundRect(ctx, GAME_WIDTH / 2 + 30, btnY - 25, 150, 50, 10);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillText('NEXT', GAME_WIDTH / 2 + 105, btnY);

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
