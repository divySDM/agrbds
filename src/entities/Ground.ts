import Matter from 'matter-js';
import { COLLISION_CATEGORIES, GAME_HEIGHT, WORLD_WIDTH } from '../game/types';

export class Ground {
  readonly body: Matter.Body;
  private readonly y: number;

  constructor() {
    this.y = GAME_HEIGHT - 60;
    this.body = Matter.Bodies.rectangle(
      WORLD_WIDTH / 2,
      this.y + 30,
      WORLD_WIDTH,
      60,
      {
        isStatic: true,
        friction: 0.8,
        restitution: 0.1,
        collisionFilter: {
          category: COLLISION_CATEGORIES.GROUND,
        },
        label: 'ground',
      }
    );
  }

  render(ctx: CanvasRenderingContext2D, cameraX: number): void {
    const screenX = -cameraX;
    const groundTop = this.y;

    // Grass layer
    ctx.fillStyle = '#4a8c3f';
    ctx.fillRect(screenX, groundTop, WORLD_WIDTH, 10);

    // Dark dirt divider line
    ctx.fillStyle = '#5a4a10';
    ctx.fillRect(screenX, groundTop + 10, WORLD_WIDTH, 3);

    // Dirt
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(screenX, groundTop + 13, WORLD_WIDTH, 47);

    // Grass blades (short line strokes)
    ctx.strokeStyle = '#5ec44f';
    ctx.lineWidth = 1.5;
    for (let x = screenX; x < screenX + WORLD_WIDTH; x += 12) {
      const h = 4 + Math.sin(x * 0.7) * 3;
      const lean = Math.sin(x * 1.3) * 2;
      ctx.beginPath();
      ctx.moveTo(x, groundTop);
      ctx.lineTo(x + lean, groundTop - h);
      ctx.stroke();
    }

    // Small stones/pebbles in dirt
    ctx.fillStyle = '#a09070';
    for (let x = screenX + 20; x < screenX + WORLD_WIDTH; x += 45) {
      const px = x + Math.sin(x * 2.1) * 10;
      const py = groundTop + 20 + Math.sin(x * 1.7) * 8;
      const r = 2 + Math.sin(x * 3.3) * 1;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
