import type { CollisionEvent } from '../physics/CollisionHandler';
import type { Block } from '../entities/Block';
import type { Pig } from '../entities/Pig';
import type { ScoreManager } from './ScoreManager';
import { DAMAGE_SCALE } from '../physics/constants';

export class RulesEngine {
  processCollisions(
    events: CollisionEvent[],
    blocks: Block[],
    pigs: Pig[],
    scoreManager: ScoreManager
  ): void {
    for (const event of events) {
      const entityA = (event.bodyA as any).gameEntity;
      const entityB = (event.bodyB as any).gameEntity;
      const damage = event.impactSpeed * DAMAGE_SCALE;

      // Apply damage to blocks
      for (const entity of [entityA, entityB]) {
        if (!entity) continue;

        const block = blocks.find((b) => b === entity && !b.isDestroyed);
        if (block) {
          block.applyDamage(damage);
          if (block.isDestroyed) {
            scoreManager.addBlockDestroyed(block.material);
          }
        }

        const pig = pigs.find((p) => p === entity && !p.isDestroyed);
        if (pig) {
          pig.applyDamage(damage);
          if (pig.isDestroyed) {
            scoreManager.addPigDefeat();
          }
        }
      }
    }
  }

  allPigsDefeated(pigs: Pig[]): boolean {
    return pigs.length > 0 && pigs.every((p) => p.isDestroyed);
  }
}
