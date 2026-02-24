import Matter from 'matter-js';
import { DAMAGE_VELOCITY_THRESHOLD } from './constants';

export interface CollisionEvent {
  bodyA: Matter.Body;
  bodyB: Matter.Body;
  impactSpeed: number;
}

export class CollisionHandler {
  private events: CollisionEvent[] = [];

  constructor(engine: Matter.Engine) {
    Matter.Events.on(engine, 'collisionStart', (event) => {
      for (const pair of event.pairs) {
        const relVel = {
          x: pair.bodyA.velocity.x - pair.bodyB.velocity.x,
          y: pair.bodyA.velocity.y - pair.bodyB.velocity.y,
        };
        const impactSpeed = Math.sqrt(relVel.x * relVel.x + relVel.y * relVel.y);
        if (impactSpeed >= DAMAGE_VELOCITY_THRESHOLD) {
          this.events.push({
            bodyA: pair.bodyA,
            bodyB: pair.bodyB,
            impactSpeed,
          });
        }
      }
    });
  }

  drain(): CollisionEvent[] {
    const drained = this.events;
    this.events = [];
    return drained;
  }
}
