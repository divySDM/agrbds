import Matter from 'matter-js';
import { BirdType, COLLISION_CATEGORIES, type GameEntity, type Vec2 } from '../game/types';
import { BIRD_PROPERTIES } from '../physics/constants';

export class Bird implements GameEntity {
  readonly id: string;
  readonly body: Matter.Body;
  readonly type: BirdType;
  isDestroyed: boolean = false;
  hasLaunched: boolean = false;

  constructor(x: number, y: number, type: BirdType = BirdType.RED) {
    this.id = `bird_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    this.type = type;
    this.body = Matter.Bodies.circle(x, y, BIRD_PROPERTIES.radius, {
      density: BIRD_PROPERTIES.density,
      friction: BIRD_PROPERTIES.friction,
      restitution: BIRD_PROPERTIES.restitution,
      collisionFilter: {
        category: COLLISION_CATEGORIES.BIRD,
      },
      label: 'bird',
      isStatic: true, // Static until launched
    });
    (this.body as any).gameEntity = this;
  }

  get position(): Vec2 {
    return this.body.position;
  }

  launch(vx: number, vy: number): void {
    Matter.Body.setStatic(this.body, false);
    Matter.Body.setVelocity(this.body, { x: vx, y: vy });
    this.hasLaunched = true;
  }

  update(_dt: number): void {
    // Physics drives position
  }

  render(ctx: CanvasRenderingContext2D, camera: { x: number; y: number }): void {
    const x = this.body.position.x - camera.x;
    const y = this.body.position.y - camera.y;
    const r = BIRD_PROPERTIES.radius;

    if (this.type === BirdType.RED) {
      this.renderRedBird(ctx, x, y, r);
    } else {
      this.renderBombBird(ctx, x, y, r);
    }
  }

  private renderRedBird(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
    // Body
    ctx.fillStyle = '#e03030';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    // Belly
    ctx.fillStyle = '#ecc8a0';
    ctx.beginPath();
    ctx.arc(x, y + 4, r * 0.6, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(x - 5, y - 4, 6, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 5, y - 4, 6, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x - 3, y - 3, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 7, y - 3, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Angry eyebrows
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x - 11, y - 12);
    ctx.lineTo(x - 2, y - 8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 11, y - 12);
    ctx.lineTo(x + 2, y - 8);
    ctx.stroke();

    // Beak
    ctx.fillStyle = '#f5a623';
    ctx.beginPath();
    ctx.moveTo(x + 2, y);
    ctx.lineTo(x + 14, y + 2);
    ctx.lineTo(x + 2, y + 6);
    ctx.closePath();
    ctx.fill();

    // Head feathers
    ctx.fillStyle = '#c02020';
    ctx.beginPath();
    ctx.moveTo(x - 2, y - r);
    ctx.lineTo(x + 2, y - r - 10);
    ctx.lineTo(x + 6, y - r);
    ctx.closePath();
    ctx.fill();
  }

  private renderBombBird(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
    // Body
    ctx.fillStyle = '#2a2a2a';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    // Gray belly highlight
    ctx.fillStyle = '#4a4a4a';
    ctx.beginPath();
    ctx.arc(x, y + 3, r * 0.55, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(x - 5, y - 3, 5, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 5, y - 3, 5, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pupils (angry red tint)
    ctx.fillStyle = '#800';
    ctx.beginPath();
    ctx.arc(x - 4, y - 2, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 6, y - 2, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Angry eyebrows
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x - 10, y - 11);
    ctx.lineTo(x - 2, y - 7);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 10, y - 11);
    ctx.lineTo(x + 2, y - 7);
    ctx.stroke();

    // Fuse on top
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y - r);
    ctx.quadraticCurveTo(x + 5, y - r - 10, x + 2, y - r - 14);
    ctx.stroke();

    // Fuse spark
    ctx.fillStyle = '#ff6600';
    ctx.beginPath();
    ctx.arc(x + 2, y - r - 14, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffcc00';
    ctx.beginPath();
    ctx.arc(x + 2, y - r - 14, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  destroy(): void {
    this.isDestroyed = true;
  }
}
