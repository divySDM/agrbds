import Matter from 'matter-js';
import { Bird } from './Bird';
import { BirdType, COLLISION_CATEGORIES } from '../game/types';
import { EGG_BOMB } from '../physics/constants';
import type { PhysicsWorld } from '../physics/PhysicsWorld';

export class WhiteBird extends Bird {
  private hasDropped: boolean = false;

  constructor(x: number, y: number) {
    super(x, y, BirdType.WHITE);
  }

  get hasDroppedEgg(): boolean {
    return this.hasDropped;
  }

  dropEgg(physicsWorld: PhysicsWorld): Matter.Body {
    this.hasDropped = true;

    // Create egg body at current position
    const eggBody = Matter.Bodies.circle(
      this.body.position.x,
      this.body.position.y + 15,
      EGG_BOMB.radius,
      {
        density: 0.008,
        friction: 0.5,
        restitution: 0.1,
        collisionFilter: {
          category: COLLISION_CATEGORIES.BIRD,
        },
        label: 'egg',
      }
    );
    (eggBody as any).isEgg = true;
    (eggBody as any).eggFuseStarted = false;
    (eggBody as any).eggFuseTimer = EGG_BOMB.fuseTime;

    physicsWorld.addBody(eggBody);
    // Egg starts with zero velocity (falls with gravity)
    Matter.Body.setVelocity(eggBody, { x: 0, y: 0 });

    // Bird recoils upward
    Matter.Body.applyForce(this.body, this.body.position, { x: 0, y: -0.05 });

    return eggBody;
  }
}
