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
  private activeSensorContacts: Map<string, SensorCollisionEvent> = new Map();

  constructor(engine: Matter.Engine) {
    Matter.Events.on(engine, 'collisionStart', (event) => {
      for (const pair of event.pairs) {
        const aIsSensor = pair.bodyA.isSensor;
        const bIsSensor = pair.bodyB.isSensor;

        // Sensor collision feed (any-speed, for gel pad + teleporter + conveyor)
        if (aIsSensor || bIsSensor) {
          if (aIsSensor && !bIsSensor) {
            const se = { sensorBody: pair.bodyA, otherBody: pair.bodyB };
            this.sensorEvents.push(se);
            this.activeSensorContacts.set(`${pair.bodyA.id}_${pair.bodyB.id}`, se);
          } else if (bIsSensor && !aIsSensor) {
            const se = { sensorBody: pair.bodyB, otherBody: pair.bodyA };
            this.sensorEvents.push(se);
            this.activeSensorContacts.set(`${pair.bodyB.id}_${pair.bodyA.id}`, se);
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

    Matter.Events.on(engine, 'collisionEnd', (event) => {
      for (const pair of event.pairs) {
        const aIsSensor = pair.bodyA.isSensor;
        const bIsSensor = pair.bodyB.isSensor;
        if (aIsSensor && !bIsSensor) {
          this.activeSensorContacts.delete(`${pair.bodyA.id}_${pair.bodyB.id}`);
        } else if (bIsSensor && !aIsSensor) {
          this.activeSensorContacts.delete(`${pair.bodyB.id}_${pair.bodyA.id}`);
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

  getActiveSensorContacts(): SensorCollisionEvent[] {
    return Array.from(this.activeSensorContacts.values());
  }
}
