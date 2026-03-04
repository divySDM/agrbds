import Matter from 'matter-js';
import { GRAVITY } from './constants';
import { CollisionHandler, type CollisionEvent, type SensorCollisionEvent } from './CollisionHandler';

export class PhysicsWorld {
  readonly engine: Matter.Engine;
  readonly world: Matter.World;
  private collisionHandler: CollisionHandler;

  constructor() {
    this.engine = Matter.Engine.create({
      gravity: GRAVITY,
      // Higher solver iterations prevent fast bodies tunneling through thin objects
      positionIterations: 10, // default 6
      velocityIterations: 8,  // default 4
    });
    this.world = this.engine.world;
    this.collisionHandler = new CollisionHandler(this.engine);
  }

  update(dt: number): void {
    Matter.Engine.update(this.engine, dt * 1000);
  }

  addBody(body: Matter.Body): void {
    Matter.Composite.add(this.world, body);
  }

  removeBody(body: Matter.Body): void {
    Matter.Composite.remove(this.world, body);
  }

  getCollisionEvents(): CollisionEvent[] {
    return this.collisionHandler.drain();
  }

  getSensorCollisionEvents(): SensorCollisionEvent[] {
    return this.collisionHandler.drainSensorEvents();
  }

  getActiveSensorContacts(): SensorCollisionEvent[] {
    return this.collisionHandler.getActiveSensorContacts();
  }

  setGravity(y: number): void {
    this.engine.gravity.y = y;
  }

  isWorldSettled(threshold: number): boolean {
    const bodies = Matter.Composite.allBodies(this.world);
    for (const body of bodies) {
      if (body.isStatic) continue;
      const speed = body.speed;
      const angularSpeed = Math.abs(body.angularVelocity);
      if (speed > threshold || angularSpeed > threshold) {
        return false;
      }
    }
    return true;
  }

  getBodiesInRadius(center: Matter.Vector, radius: number): Matter.Body[] {
    const bodies = Matter.Composite.allBodies(this.world);
    const result: Matter.Body[] = [];
    for (const body of bodies) {
      if (body.isStatic) continue;
      const dx = body.position.x - center.x;
      const dy = body.position.y - center.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= radius) {
        result.push(body);
      }
    }
    return result;
  }

  applyExplosion(center: Matter.Vector, radius: number, forceMag: number): void {
    const bodies = this.getBodiesInRadius(center, radius);
    for (const body of bodies) {
      const dx = body.position.x - center.x;
      const dy = body.position.y - center.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 1) continue;
      const falloff = 1 - dist / radius;
      const force = forceMag * falloff;
      const nx = dx / dist;
      const ny = dy / dist;
      Matter.Body.applyForce(body, body.position, {
        x: nx * force,
        y: ny * force,
      });
    }
  }

  clear(): void {
    Matter.Composite.clear(this.world, false);
    this.collisionHandler.drain();
  }
}
