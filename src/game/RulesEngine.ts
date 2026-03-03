import type { CollisionEvent } from '../physics/CollisionHandler';
import type { Block } from '../entities/Block';
import type { Pig } from '../entities/Pig';
import type { ScoreManager } from './ScoreManager';
import { DAMAGE_SCALE } from '../physics/constants';

export interface CollisionResult {
  maxImpact: number;
  destroyedCount: number;
}

export class RulesEngine {
  processCollisions(
    events: CollisionEvent[],
    blocks: Block[],
    pigs: Pig[],
    scoreManager: ScoreManager
  ): CollisionResult {
    let maxImpact = 0;
    let destroyedCount = 0;
    const blockSet = new Set(blocks);
    const pigSet = new Set(pigs);

    for (const event of events) {
      const entityA = (event.bodyA as any).gameEntity;
      const entityB = (event.bodyB as any).gameEntity;
      const damage = event.impactSpeed * DAMAGE_SCALE;
      maxImpact = Math.max(maxImpact, event.impactSpeed);

      for (const entity of [entityA, entityB]) {
        if (!entity) continue;

        if (blockSet.has(entity) && !entity.isDestroyed) {
          entity.applyDamage(damage);
          if (entity.isDestroyed) {
            scoreManager.addBlockDestroyed(entity.material);
            destroyedCount++;
          }
        }

        if (pigSet.has(entity) && !entity.isDestroyed) {
          entity.applyDamage(damage);
          if (entity.isDestroyed) {
            scoreManager.addPigDefeat();
            destroyedCount++;
          }
        }
      }
    }
    return { maxImpact, destroyedCount };
  }

  allPigsDefeated(pigs: Pig[]): boolean {
    return pigs.length === 0;
  }
}
