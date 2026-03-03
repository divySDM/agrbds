import Matter from 'matter-js';
import { COLLISION_CATEGORIES, DamageState, MaterialType, SpecialBlockType, type GameEntity, type Vec2 } from '../game/types';
import { MATERIALS } from './Materials';

export class Block implements GameEntity {
  readonly id: string;
  readonly body: Matter.Body;
  readonly material: MaterialType;
  readonly width: number;
  readonly height: number;
  readonly specialType?: SpecialBlockType;
  sensorBody?: Matter.Body;
  linkedTeleporter?: Block;
  activated: boolean = false;
  private health: number;
  private maxHealth: number;
  private _damageState: DamageState = DamageState.INTACT;
  isDestroyed: boolean = false;

  constructor(x: number, y: number, width: number, height: number, material: MaterialType, specialType?: SpecialBlockType) {
    this.id = `block_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    this.material = material;
    this.width = width;
    this.height = height;
    this.specialType = specialType;
    const mat = MATERIALS[material];

    // Special blocks have custom health
    if (specialType === SpecialBlockType.TNT) {
      this.health = 40;
      this.maxHealth = 40;
    } else if (specialType === SpecialBlockType.GEL_PAD || specialType === SpecialBlockType.TELEPORTER) {
      this.health = 9999;
      this.maxHealth = 9999;
    } else {
      this.health = mat.health;
      this.maxHealth = mat.health;
    }

    this.body = Matter.Bodies.rectangle(x, y, width, height, {
      density: mat.density,
      friction: mat.friction,
      restitution: mat.restitution,
      collisionFilter: {
        category: COLLISION_CATEGORIES.BLOCK,
      },
      label: specialType ? `block_${specialType}` : 'block',
    });
    (this.body as any).gameEntity = this;

    // Create sensor body for gel pad and teleporter (any-speed collision detection)
    if (specialType === SpecialBlockType.GEL_PAD || specialType === SpecialBlockType.TELEPORTER) {
      this.sensorBody = Matter.Bodies.rectangle(x, y, width + 10, height + 10, {
        isSensor: true,
        isStatic: true,
        collisionFilter: {
          category: COLLISION_CATEGORIES.BLOCK,
        },
        label: `sensor_${specialType}`,
      });
      (this.sensorBody as any).gameEntity = this;
    }
  }

  get position(): Vec2 {
    return this.body.position;
  }

  get damageState(): DamageState {
    return this._damageState;
  }

  applyDamage(amount: number): void {
    if (this.isDestroyed) return;
    this.health -= amount;
    if (this.health <= 0) {
      this._damageState = DamageState.DESTROYED;
      this.isDestroyed = true;
    } else if (this.health < this.maxHealth * 0.5) {
      this._damageState = DamageState.CRACKED;
    } else if (this.health < this.maxHealth * 0.75) {
      this._damageState = DamageState.LIGHT_DAMAGE;
    }
  }

  update(_dt: number): void {
    // Physics drives position
    // Keep sensor body in sync with main body
    if (this.sensorBody) {
      Matter.Body.setPosition(this.sensorBody, this.body.position);
      Matter.Body.setAngle(this.sensorBody, this.body.angle);
    }
  }

  render(ctx: CanvasRenderingContext2D, camera: { x: number; y: number }): void {
    if (this.specialType) {
      this.renderSpecial(ctx, camera);
      return;
    }

    const mat = MATERIALS[this.material];
    const x = this.body.position.x - camera.x;
    const y = this.body.position.y - camera.y;
    const angle = this.body.angle;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Drop shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(-this.width / 2 + 3, -this.height / 2 + 3, this.width, this.height);

    // Block body
    const damaged = this._damageState === DamageState.CRACKED || this._damageState === DamageState.LIGHT_DAMAGE;
    const color = damaged ? mat.crackedColor : mat.color;
    ctx.fillStyle = color;
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

    // Top edge highlight
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, 2);

    // Border
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);

    // Light damage - small crack
    if (this._damageState === DamageState.LIGHT_DAMAGE) {
      ctx.strokeStyle = 'rgba(0,0,0,0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-this.width * 0.15, -this.height * 0.1);
      ctx.lineTo(this.width * 0.1, this.height * 0.15);
      ctx.stroke();
    }

    // Heavy crack overlay
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
      ctx.beginPath();
      ctx.moveTo(-this.width * 0.2, this.height * 0.2);
      ctx.lineTo(-this.width * 0.05, -this.height * 0.05);
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

  private renderSpecial(ctx: CanvasRenderingContext2D, camera: { x: number; y: number }): void {
    const x = this.body.position.x - camera.x;
    const y = this.body.position.y - camera.y;
    const angle = this.body.angle;
    const hw = this.width / 2;
    const hh = this.height / 2;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    switch (this.specialType) {
      case SpecialBlockType.TNT:
        this.renderTNT(ctx, hw, hh);
        break;
      case SpecialBlockType.GRAVITY_INVERTER:
        this.renderGravityInverter(ctx, hw, hh);
        break;
      case SpecialBlockType.GEL_PAD:
        this.renderGelPad(ctx, hw, hh);
        break;
      case SpecialBlockType.TELEPORTER:
        this.renderTeleporter(ctx, hw, hh);
        break;
    }

    ctx.restore();
  }

  private renderTNT(ctx: CanvasRenderingContext2D, hw: number, hh: number): void {
    // Drop shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(-hw + 3, -hh + 3, hw * 2, hh * 2);

    // Red-brown crate body
    ctx.fillStyle = '#8b2500';
    ctx.fillRect(-hw, -hh, hw * 2, hh * 2);

    // Danger stripes (diagonal)
    ctx.fillStyle = '#cc3300';
    ctx.fillRect(-hw, -hh, hw * 2, 4);
    ctx.fillRect(-hw, hh - 4, hw * 2, 4);

    // TNT text
    ctx.fillStyle = '#ffdd00';
    ctx.font = `bold ${Math.min(hw, hh) * 0.8}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TNT', 0, 0);

    // Border
    ctx.strokeStyle = '#5a1000';
    ctx.lineWidth = 2;
    ctx.strokeRect(-hw, -hh, hw * 2, hh * 2);

    // Damage cracks
    if (this._damageState === DamageState.CRACKED || this._damageState === DamageState.LIGHT_DAMAGE) {
      ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-hw * 0.3, -hh * 0.2);
      ctx.lineTo(hw * 0.1, hh * 0.2);
      ctx.stroke();
    }
  }

  private renderGravityInverter(ctx: CanvasRenderingContext2D, hw: number, hh: number): void {
    // Glow aura
    ctx.fillStyle = 'rgba(150, 50, 255, 0.2)';
    ctx.fillRect(-hw - 4, -hh - 4, hw * 2 + 8, hh * 2 + 8);

    // Purple block body
    ctx.fillStyle = '#7b2fbe';
    ctx.fillRect(-hw, -hh, hw * 2, hh * 2);

    // Lighter center gradient
    ctx.fillStyle = 'rgba(200, 150, 255, 0.3)';
    ctx.fillRect(-hw * 0.6, -hh * 0.6, hw * 1.2, hh * 1.2);

    // Upward arrow symbol
    ctx.fillStyle = '#e0c0ff';
    ctx.beginPath();
    ctx.moveTo(0, -hh * 0.6);
    ctx.lineTo(-hw * 0.4, -hh * 0.1);
    ctx.lineTo(-hw * 0.15, -hh * 0.1);
    ctx.lineTo(-hw * 0.15, hh * 0.5);
    ctx.lineTo(hw * 0.15, hh * 0.5);
    ctx.lineTo(hw * 0.15, -hh * 0.1);
    ctx.lineTo(hw * 0.4, -hh * 0.1);
    ctx.closePath();
    ctx.fill();

    // Border
    ctx.strokeStyle = '#4a1a7a';
    ctx.lineWidth = 2;
    ctx.strokeRect(-hw, -hh, hw * 2, hh * 2);
  }

  private renderGelPad(ctx: CanvasRenderingContext2D, hw: number, hh: number): void {
    // Bright green/cyan squishy rectangle
    ctx.fillStyle = '#00e5a0';
    ctx.beginPath();
    ctx.moveTo(-hw, hh);
    ctx.lineTo(-hw, -hh * 0.6);
    ctx.quadraticCurveTo(-hw * 0.5, -hh, 0, -hh * 0.8);
    ctx.quadraticCurveTo(hw * 0.5, -hh, hw, -hh * 0.6);
    ctx.lineTo(hw, hh);
    ctx.closePath();
    ctx.fill();

    // Inner glow
    ctx.fillStyle = 'rgba(100, 255, 200, 0.4)';
    ctx.beginPath();
    ctx.moveTo(-hw * 0.7, hh * 0.5);
    ctx.quadraticCurveTo(0, -hh * 0.6, hw * 0.7, hh * 0.5);
    ctx.lineTo(-hw * 0.7, hh * 0.5);
    ctx.fill();

    // Shine highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(-hw * 0.4, -hh * 0.5, hw * 0.5, hh * 0.3);

    // Border
    ctx.strokeStyle = '#009970';
    ctx.lineWidth = 2;
    ctx.strokeRect(-hw, -hh, hw * 2, hh * 2);
  }

  private renderTeleporter(ctx: CanvasRenderingContext2D, hw: number, hh: number): void {
    // Determine color based on whether this is linked (use id hash for consistency)
    const isOrange = this.linkedTeleporter && this.id > this.linkedTeleporter.id;
    const baseColor = isOrange ? '#ff6600' : '#3366ff';
    const glowColor = isOrange ? 'rgba(255, 102, 0, 0.3)' : 'rgba(51, 102, 255, 0.3)';

    // Outer glow
    ctx.fillStyle = glowColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, hw + 5, hh + 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Oval portal body
    ctx.fillStyle = baseColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, hw, hh, 0, 0, Math.PI * 2);
    ctx.fill();

    // Swirling inner effect (concentric rings)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(0, 0, hw * 0.7, hh * 0.7, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(0, 0, hw * 0.4, hh * 0.4, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Center bright spot
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.ellipse(0, 0, hw * 0.2, hh * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Border
    ctx.strokeStyle = isOrange ? '#cc5500' : '#2244cc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, hw, hh, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  destroy(): void {
    this.isDestroyed = true;
  }
}
