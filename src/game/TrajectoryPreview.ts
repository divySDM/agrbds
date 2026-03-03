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
    const stepsPerDot = 3; // ~0.05s between dots at 60fps

    // Match Matter.js Verlet integration:
    // Per-step gravity = GRAVITY.y * gravityScale * dt_ms²
    // where gravityScale = 0.001 (Matter.js default), dt_ms = 1000/60
    const dtMs = 1000 / 60;
    const gravityStep = GRAVITY.y * 0.001 * dtMs * dtMs;
    const airDamping = 1 - 0.01; // Matter.js default body frictionAir

    // Simulate step-by-step, tracking displacement per step (Verlet)
    let dx = velocityX;
    let dy = velocityY;
    let px = startX;
    let py = startY;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';

    for (let i = 1; i <= dotCount; i++) {
      for (let s = 0; s < stepsPerDot; s++) {
        dx *= airDamping;
        dy *= airDamping;
        dy += gravityStep;
        px += dx;
        py += dy;
      }

      const alpha = 1 - i / dotCount;
      ctx.globalAlpha = alpha * 0.6;
      ctx.beginPath();
      ctx.arc(px - cameraX, py, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }
}
