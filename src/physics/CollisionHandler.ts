import Matter from 'matter-js';
import { DAMAGE_VELOCITY_THRESHOLD } from './constants';

export interface CollisionEvent {
  bodyA: Matter.Body;
  bodyB: Matter.Body;
  impactSpeed: number;
}

export interface SensorCollisionEvent {
  sensorBody: Matter.Body;
  otherBody: Matter.Body;
}

export class CollisionHandler {
  private events: CollisionEvent[] = [];
  private sensorEvents: SensorCollisionEvent[] = [];

  constructor(engine: Matter.Engine) {
    Matter.Events.on(engine, 'collisionStart', (event) => {
      for (const pair of event.pairs) {
        const aIsSensor = pair.bodyA.isSensor;
        const bIsSensor = pair.bodyB.isSensor;

        // Sensor collision feed (any-speed, for gel pad + teleporter)
        if (aIsSensor || bIsSensor) {
          if (aIsSensor && !bIsSensor) {
            this.sensorEvents.push({ sensorBody: pair.bodyA, otherBody: pair.bodyB });
          } else if (bIsSensor && !aIsSensor) {
            this.sensorEvents.push({ sensorBody: pair.bodyB, otherBody: pair.bodyA });
          }
          continue;
        }

        // Standard damage-threshold collision feed
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

  drainSensorEvents(): SensorCollisionEvent[] {
    const drained = this.sensorEvents;
    this.sensorEvents = [];
    return drained;
  }
}
