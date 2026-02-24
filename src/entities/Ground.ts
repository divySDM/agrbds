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

    // Grass
    ctx.fillStyle = '#4a8c3f';
    ctx.fillRect(screenX, groundTop, WORLD_WIDTH, 8);

    // Dirt
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(screenX, groundTop + 8, WORLD_WIDTH, 52);

    // Grass detail tufts
    ctx.fillStyle = '#5aa84f';
    for (let x = screenX; x < screenX + WORLD_WIDTH; x += 30) {
      ctx.beginPath();
      ctx.ellipse(x, groundTop, 8, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
