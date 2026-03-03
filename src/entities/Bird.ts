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
    });
    // Set static AFTER creation so Matter.js saves original mass in _original.
    // Passing isStatic in create options sets mass=Infinity without saving,
    // which prevents setStatic(false) from restoring finite mass on launch.
    Matter.Body.setStatic(this.body, true);
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

    // Rotate bird in direction of travel when launched
    const vel = this.body.velocity;
    const rotation = this.hasLaunched && (vel.x !== 0 || vel.y !== 0)
      ? Math.atan2(vel.y, vel.x)
      : 0;

    ctx.save();
    ctx.translate(x, y);
    if (rotation !== 0) {
      ctx.rotate(rotation);
    }

    if (this.type === BirdType.RED) {
      this.renderRedBird(ctx, r);
    } else if (this.type === BirdType.YELLOW) {
      this.renderYellowBird(ctx, r);
    } else {
      this.renderBombBird(ctx, r);
    }

    ctx.restore();
  }

  private renderRedBird(ctx: CanvasRenderingContext2D, r: number): void {
    ctx.fillStyle = '#e03030';
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ecc8a0';
    ctx.beginPath();
    ctx.arc(0, 4, r * 0.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(-5, -4, 6, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(5, -4, 6, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(-3, -3, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(7, -3, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-11, -12);
    ctx.lineTo(-2, -8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(11, -12);
    ctx.lineTo(2, -8);
    ctx.stroke();

    ctx.fillStyle = '#f5a623';
    ctx.beginPath();
    ctx.moveTo(2, 0);
    ctx.lineTo(14, 2);
    ctx.lineTo(2, 6);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#c02020';
    ctx.beginPath();
    ctx.moveTo(-2, -r);
    ctx.lineTo(2, -r - 10);
    ctx.lineTo(6, -r);
    ctx.closePath();
    ctx.fill();
  }

  private renderYellowBird(ctx: CanvasRenderingContext2D, r: number): void {
    // Triangular yellow bird
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.moveTo(r + 4, 0);
    ctx.lineTo(-r * 0.8, -r * 0.9);
    ctx.lineTo(-r * 0.8, r * 0.9);
    ctx.closePath();
    ctx.fill();

    // Body circle overlay
    ctx.fillStyle = '#ffe44d';
    ctx.beginPath();
    ctx.arc(-2, 0, r * 0.7, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(-2, -4, 5, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(6, -4, 5, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(0, -3, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(8, -3, 2, 0, Math.PI * 2);
    ctx.fill();

    // Angry eyebrows
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-7, -11);
    ctx.lineTo(0, -7);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(13, -11);
    ctx.lineTo(6, -7);
    ctx.stroke();

    // Beak
    ctx.fillStyle = '#ff8c00';
    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.lineTo(16, 2);
    ctx.lineTo(8, 5);
    ctx.closePath();
    ctx.fill();

    // Head crest
    ctx.fillStyle = '#cc9900';
    ctx.beginPath();
    ctx.moveTo(-4, -r * 0.85);
    ctx.lineTo(0, -r - 8);
    ctx.lineTo(4, -r * 0.85);
    ctx.closePath();
    ctx.fill();
  }

  private renderBombBird(ctx: CanvasRenderingContext2D, r: number): void {
    ctx.fillStyle = '#2a2a2a';
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#4a4a4a';
    ctx.beginPath();
    ctx.arc(0, 3, r * 0.55, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(-5, -3, 5, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(5, -3, 5, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#800';
    ctx.beginPath();
    ctx.arc(-4, -2, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(6, -2, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#555';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-10, -11);
    ctx.lineTo(-2, -7);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(10, -11);
    ctx.lineTo(2, -7);
    ctx.stroke();

    ctx.strokeStyle = '#888';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.quadraticCurveTo(5, -r - 10, 2, -r - 14);
    ctx.stroke();

    ctx.fillStyle = '#ff6600';
    ctx.beginPath();
    ctx.arc(2, -r - 14, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffcc00';
    ctx.beginPath();
    ctx.arc(2, -r - 14, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  destroy(): void {
    this.isDestroyed = true;
  }
}
