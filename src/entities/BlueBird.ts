import Matter from 'matter-js';
import { Bird } from './Bird';
import { BirdType, COLLISION_CATEGORIES } from '../game/types';
import { BLUE_SPLIT, BIRD_STATS } from '../physics/constants';
import type { PhysicsWorld } from '../physics/PhysicsWorld';

export class BlueBird extends Bird {
  private hasSplit: boolean = false;

  constructor(x: number, y: number) {
    super(x, y, BirdType.BLUE);
  }

  get hasUsedAbility(): boolean {
    return this.hasSplit;
  }

  split(physicsWorld: PhysicsWorld): Bird[] {
    if (this.hasSplit || !this.hasLaunched) return [];
    this.hasSplit = true;

    const vel = this.body.velocity;
    const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
    if (speed < 0.5) return [];

    const baseAngle = Math.atan2(vel.y, vel.x);
    const spreadRad = (BLUE_SPLIT.angleSpread * Math.PI) / 180;
    const fragments: Bird[] = [];

    for (const offset of [-spreadRad, spreadRad]) {
      const angle = baseAngle + offset;
      const fx = this.body.position.x;
      const fy = this.body.position.y;

      const fragment = new Bird(fx, fy, BirdType.BLUE);
      // Override the body with smaller fragment body
      const fragBody = Matter.Bodies.circle(fx, fy, BLUE_SPLIT.fragmentRadius, {
        density: BIRD_STATS[BirdType.BLUE].density * BLUE_SPLIT.fragmentMassFactor,
        friction: 0.5,
        restitution: BIRD_STATS[BirdType.BLUE].restitution,
        collisionFilter: {
          category: COLLISION_CATEGORIES.BIRD,
        },
        label: 'bird',
      });
      (fragBody as any).gameEntity = fragment;
      // Replace body on fragment
      (fragment as any).body = fragBody;

      physicsWorld.addBody(fragBody);
      Matter.Body.setStatic(fragBody, false);
      Matter.Body.setVelocity(fragBody, {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      });
      fragment.hasLaunched = true;

      fragments.push(fragment);
    }

    return fragments;
  }
}
