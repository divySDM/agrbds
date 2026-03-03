import { GRAVITY } from '../physics/constants';

export class TrajectoryPreview {
  render(
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    velocityX: number,
    velocityY: number,
    cameraX: number
  ): void {
    const dotCount = 30;
    const timeStep = 0.05;
    // Matter.js applies GRAVITY.y per step (60 steps/sec).
    // In real-time: g_real = GRAVITY.y * fps^2 = 1.2 * 3600 = 4320 units/s²
    const gravity = GRAVITY.y * 3600;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';

    for (let i = 1; i <= dotCount; i++) {
      const t = i * timeStep;
      const x = startX + velocityX * t * 60 - cameraX;
      const y = startY + velocityY * t * 60 + 0.5 * gravity * t * t;

      const alpha = 1 - i / dotCount;
      ctx.globalAlpha = alpha * 0.6;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }
}
