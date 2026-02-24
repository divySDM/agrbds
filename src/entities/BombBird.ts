import { Bird } from './Bird';
import { BirdType } from '../game/types';
import { BOMB } from '../physics/constants';
import type { PhysicsWorld } from '../physics/PhysicsWorld';

export class BombBird extends Bird {
  private exploded: boolean = false;

  constructor(x: number, y: number) {
    super(x, y, BirdType.BOMB);
  }

  get hasExploded(): boolean {
    return this.exploded;
  }

  explode(physicsWorld: PhysicsWorld): void {
    if (this.exploded) return;
    this.exploded = true;
    physicsWorld.applyExplosion(
      this.body.position,
      BOMB.blastRadius,
      BOMB.blastForce
    );
  }
}
