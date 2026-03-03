import Matter from 'matter-js';
import { Bird } from './Bird';
import { BirdType } from '../game/types';

export class YellowBird extends Bird {
  private boosted: boolean = false;

  constructor(x: number, y: number) {
    super(x, y, BirdType.YELLOW);
  }

  get hasBoosted(): boolean {
    return this.boosted;
  }

  activate(): void {
    if (this.boosted || !this.hasLaunched) return;
    this.boosted = true;
    const vel = this.body.velocity;
    const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
    if (speed < 0.5) return;
    const nx = vel.x / speed;
    const ny = vel.y / speed;
    const boostSpeed = speed * 2.5;
    Matter.Body.setVelocity(this.body, { x: nx * boostSpeed, y: ny * boostSpeed });
  }
}
