import Matter from 'matter-js';
import { COLLISION_CATEGORIES, DamageState, MaterialType, type GameEntity, type Vec2 } from '../game/types';
import { MATERIALS } from './Materials';

export class Block implements GameEntity {
  readonly id: string;
  readonly body: Matter.Body;
  readonly material: MaterialType;
  readonly width: number;
  readonly height: number;
  private health: number;
  private maxHealth: number;
  private _damageState: DamageState = DamageState.INTACT;
  isDestroyed: boolean = false;

  constructor(x: number, y: number, width: number, height: number, material: MaterialType) {
    this.id = `block_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    this.material = material;
    this.width = width;
    this.height = height;
    const mat = MATERIALS[material];
    this.health = mat.health;
    this.maxHealth = mat.health;

    this.body = Matter.Bodies.rectangle(x, y, width, height, {
      density: mat.density,
      friction: mat.friction,
      restitution: mat.restitution,
      collisionFilter: {
        category: COLLISION_CATEGORIES.BLOCK,
      },
      label: 'block',
    });
    (this.body as any).gameEntity = this;
  }

  get position(): Vec2 {
    return this.body.position;
  }

  get damageState(): DamageState {
    return this._damageState;
  }

  applyDamage(amount: number): void {
    this.health -= amount;
    if (this.health <= 0) {
      this._damageState = DamageState.DESTROYED;
      this.isDestroyed = true;
    } else if (this.health < this.maxHealth * 0.5) {
      this._damageState = DamageState.CRACKED;
    }
  }

  update(_dt: number): void {
    // Physics drives position
  }

  render(ctx: CanvasRenderingContext2D, camera: { x: number; y: number }): void {
    const mat = MATERIALS[this.material];
    const x = this.body.position.x - camera.x;
    const y = this.body.position.y - camera.y;
    const angle = this.body.angle;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Block body
    const color = this._damageState === DamageState.CRACKED ? mat.crackedColor : mat.color;
    ctx.fillStyle = color;
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

    // Border
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);

    // Crack overlay
    if (this._damageState === DamageState.CRACKED) {
      ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-this.width * 0.3, -this.height * 0.2);
      ctx.lineTo(0, this.height * 0.1);
      ctx.lineTo(this.width * 0.2, -this.height * 0.3);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(this.width * 0.1, this.height * 0.1);
      ctx.lineTo(this.width * 0.3, this.height * 0.3);
      ctx.stroke();
    }

    // Material-specific details
    if (this.material === MaterialType.WOOD) {
      ctx.strokeStyle = 'rgba(139, 90, 43, 0.3)';
      ctx.lineWidth = 0.5;
      for (let i = -this.height / 2 + 5; i < this.height / 2; i += 8) {
        ctx.beginPath();
        ctx.moveTo(-this.width / 2, i);
        ctx.lineTo(this.width / 2, i);
        ctx.stroke();
      }
    } else if (this.material === MaterialType.ICE) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(-this.width / 2 + 2, -this.height / 2 + 2, this.width * 0.4, this.height * 0.3);
    }

    ctx.restore();
  }

  destroy(): void {
    this.isDestroyed = true;
  }
}
