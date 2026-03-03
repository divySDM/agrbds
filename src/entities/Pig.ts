import Matter from 'matter-js';
import { COLLISION_CATEGORIES, type GameEntity, type Vec2 } from '../game/types';
import { PIG_PROPERTIES } from '../physics/constants';

export class Pig implements GameEntity {
  readonly id: string;
  readonly body: Matter.Body;
  private health: number;
  isDestroyed: boolean = false;
  private worried: boolean = false;

  constructor(x: number, y: number) {
    this.id = `pig_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    this.health = PIG_PROPERTIES.health;

    this.body = Matter.Bodies.circle(x, y, PIG_PROPERTIES.radius, {
      density: PIG_PROPERTIES.density,
      friction: PIG_PROPERTIES.friction,
      restitution: PIG_PROPERTIES.restitution,
      collisionFilter: {
        category: COLLISION_CATEGORIES.PIG,
      },
      label: 'pig',
    });
    (this.body as any).gameEntity = this;
  }

  get position(): Vec2 {
    return this.body.position;
  }

  setWorried(worried: boolean): void {
    this.worried = worried;
  }

  applyDamage(amount: number): void {
    if (this.isDestroyed) return;
    this.health -= amount;
    if (this.health <= 0) {
      this.isDestroyed = true;
    }
  }

  update(_dt: number): void {
    // Physics drives position
  }

  render(ctx: CanvasRenderingContext2D, camera: { x: number; y: number }): void {
    const x = this.body.position.x - camera.x;
    const y = this.body.position.y - camera.y;
    const r = PIG_PROPERTIES.radius;

    // Body
    ctx.fillStyle = '#6abf4b';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    // Lighter belly
    ctx.fillStyle = '#8fd97a';
    ctx.beginPath();
    ctx.arc(x, y + 2, r * 0.65, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.fillStyle = '#5aaf3b';
    ctx.beginPath();
    ctx.arc(x - r * 0.7, y - r * 0.6, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + r * 0.7, y - r * 0.6, 5, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(x - 5, y - 4, 5, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 5, y - 4, 5, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = '#000';
    if (this.worried) {
      // Worried: smaller pupils looking up
      ctx.beginPath();
      ctx.arc(x - 5, y - 6, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 5, y - 6, 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(x - 4, y - 4, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 6, y - 4, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Snout
    ctx.fillStyle = '#50a535';
    ctx.beginPath();
    ctx.ellipse(x, y + 4, 8, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nostrils
    ctx.fillStyle = '#3a7a28';
    ctx.beginPath();
    ctx.ellipse(x - 3, y + 4, 2, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 3, y + 4, 2, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rosy cheeks
    ctx.fillStyle = 'rgba(255, 150, 150, 0.4)';
    ctx.beginPath();
    ctx.arc(x - 10, y + 1, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 10, y + 1, 4, 0, Math.PI * 2);
    ctx.fill();

    // Worried mouth
    if (this.worried) {
      ctx.strokeStyle = '#3a7a28';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, y + 12, 4, Math.PI, 0);
      ctx.stroke();
    }
  }

  destroy(): void {
    this.isDestroyed = true;
  }
}
