import Matter from 'matter-js';
import { BirdType, COLLISION_CATEGORIES, type GameEntity, type Vec2 } from '../game/types';
import { BIRD_PROPERTIES, BIRD_STATS } from '../physics/constants';

export class Bird implements GameEntity {
  readonly id: string;
  readonly body: Matter.Body;
  readonly type: BirdType;
  isDestroyed: boolean = false;
  hasLaunched: boolean = false;

  constructor(x: number, y: number, type: BirdType = BirdType.RED) {
    this.id = `bird_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    this.type = type;
    const stats = BIRD_STATS[type] ?? BIRD_STATS[BirdType.RED];
    this.body = Matter.Bodies.circle(x, y, stats.radius, {
      density: stats.density,
      friction: BIRD_PROPERTIES.friction,
      restitution: stats.restitution,
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
    const stats = BIRD_STATS[this.type] ?? BIRD_STATS[BirdType.RED];
    const r = stats.radius;

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
    } else if (this.type === BirdType.BOMB) {
      this.renderBombBird(ctx, r);
    } else if (this.type === BirdType.BLUE) {
      this.renderBlueBird(ctx, r);
    } else if (this.type === BirdType.WHITE) {
      this.renderWhiteBird(ctx, r);
    } else if (this.type === BirdType.BIG) {
      this.renderBigBird(ctx, r);
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

  private renderBlueBird(ctx: CanvasRenderingContext2D, r: number): void {
    // Small light-blue body
    ctx.fillStyle = '#5bc0eb';
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Lighter belly
    ctx.fillStyle = '#a0e4ff';
    ctx.beginPath();
    ctx.arc(0, 3, r * 0.55, 0, Math.PI * 2);
    ctx.fill();

    // Wide eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(-4, -3, 5, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(4, -3, 5, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(-3, -2, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(5, -2, 2, 0, Math.PI * 2);
    ctx.fill();

    // Three-feather crest splitting outward
    ctx.fillStyle = '#3a9fd8';
    ctx.beginPath();
    ctx.moveTo(-4, -r);
    ctx.lineTo(-7, -r - 8);
    ctx.lineTo(-2, -r + 1);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(0, -r - 10);
    ctx.lineTo(3, -r + 1);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(4, -r);
    ctx.lineTo(7, -r - 8);
    ctx.lineTo(2, -r + 1);
    ctx.closePath();
    ctx.fill();

    // Beak
    ctx.fillStyle = '#f5a623';
    ctx.beginPath();
    ctx.moveTo(3, 1);
    ctx.lineTo(11, 2);
    ctx.lineTo(3, 5);
    ctx.closePath();
    ctx.fill();
  }

  private renderWhiteBird(ctx: CanvasRenderingContext2D, r: number): void {
    // White oval body (tall proportions)
    ctx.fillStyle = '#f0f0f0';
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.85, r, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rosy cheeks
    ctx.fillStyle = 'rgba(255, 150, 150, 0.4)';
    ctx.beginPath();
    ctx.arc(-6, 4, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(6, 4, 4, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(-4, -4, 5, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(4, -4, 5, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(-3, -3, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(5, -3, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Eyebrows
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-9, -10);
    ctx.lineTo(-2, -7);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(9, -10);
    ctx.lineTo(2, -7);
    ctx.stroke();

    // Dark tail feathers
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(-5, r * 0.6);
    ctx.lineTo(-10, r + 4);
    ctx.lineTo(-2, r * 0.7);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, r * 0.7);
    ctx.lineTo(0, r + 6);
    ctx.lineTo(4, r * 0.7);
    ctx.closePath();
    ctx.fill();

    // Beak
    ctx.fillStyle = '#f5a623';
    ctx.beginPath();
    ctx.moveTo(2, 1);
    ctx.lineTo(12, 2);
    ctx.lineTo(2, 5);
    ctx.closePath();
    ctx.fill();
  }

  private renderBigBird(ctx: CanvasRenderingContext2D, r: number): void {
    // Dark red, very large circle
    ctx.fillStyle = '#8b1a1a';
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Darker belly
    ctx.fillStyle = '#6a1010';
    ctx.beginPath();
    ctx.arc(0, 6, r * 0.65, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(-8, -6, 7, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(8, -6, 7, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(-6, -5, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(10, -5, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Thick angry eyebrows (square jaw look)
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-16, -16);
    ctx.lineTo(-4, -10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(16, -16);
    ctx.lineTo(4, -10);
    ctx.stroke();

    // Beak
    ctx.fillStyle = '#f5a623';
    ctx.beginPath();
    ctx.moveTo(4, 0);
    ctx.lineTo(18, 3);
    ctx.lineTo(4, 8);
    ctx.closePath();
    ctx.fill();

    // Head crest
    ctx.fillStyle = '#6b0e0e';
    ctx.beginPath();
    ctx.moveTo(-4, -r);
    ctx.lineTo(0, -r - 12);
    ctx.lineTo(4, -r);
    ctx.closePath();
    ctx.fill();
  }

  destroy(): void {
    this.isDestroyed = true;
  }
}
