import { describe, it, expect, beforeEach } from 'vitest';
import { RulesEngine } from '../RulesEngine';
import { ScoreManager } from '../ScoreManager';
import { Block } from '../../entities/Block';
import { Pig } from '../../entities/Pig';
import { MaterialType, SCORE } from '../types';
import type { CollisionEvent } from '../../physics/CollisionHandler';

describe('RulesEngine', () => {
  let rulesEngine: RulesEngine;
  let scoreManager: ScoreManager;

  beforeEach(() => {
    rulesEngine = new RulesEngine();
    scoreManager = new ScoreManager();
  });

  describe('processCollisions', () => {
    it('should apply damage to blocks from collisions', () => {
      const block = new Block(100, 100, 50, 50, MaterialType.WOOD);
      const events: CollisionEvent[] = [
        {
          bodyA: block.body,
          bodyB: { velocity: { x: 0, y: 0 } } as any,
          impactSpeed: 10,
        },
      ];

      rulesEngine.processCollisions(events, [block], [], scoreManager);
      expect(block.damageState).not.toBe('INTACT'); // Should have taken damage
    });

    it('should award points when a block is destroyed', () => {
      const block = new Block(100, 100, 50, 50, MaterialType.ICE);
      // ICE has 50 health; impactSpeed * DAMAGE_SCALE = 10 * 18 = 180 > 50
      const events: CollisionEvent[] = [
        {
          bodyA: block.body,
          bodyB: { velocity: { x: 0, y: 0 } } as any,
          impactSpeed: 10,
        },
      ];

      rulesEngine.processCollisions(events, [block], [], scoreManager);
      expect(block.isDestroyed).toBe(true);
      expect(scoreManager.score).toBe(SCORE.BLOCK_ICE);
    });

    it('should award points when a pig is defeated', () => {
      const pig = new Pig(100, 100);
      const events: CollisionEvent[] = [
        {
          bodyA: pig.body,
          bodyB: { velocity: { x: 0, y: 0 } } as any,
          impactSpeed: 10,
        },
      ];

      rulesEngine.processCollisions(events, [], [pig], scoreManager);
      expect(pig.isDestroyed).toBe(true);
      expect(scoreManager.score).toBe(SCORE.PIG_DEFEAT);
    });

    it('should not score for already destroyed entities', () => {
      const pig = new Pig(100, 100);
      pig.destroy();
      const events: CollisionEvent[] = [
        {
          bodyA: pig.body,
          bodyB: { velocity: { x: 0, y: 0 } } as any,
          impactSpeed: 10,
        },
      ];

      rulesEngine.processCollisions(events, [], [pig], scoreManager);
      expect(scoreManager.score).toBe(0);
    });
  });

  describe('allPigsDefeated', () => {
    it('should return true when pig array is empty (all removed)', () => {
      // In the game, destroyed pigs are filtered out of the array.
      // An empty array means all pigs have been defeated.
      expect(rulesEngine.allPigsDefeated([])).toBe(true);
    });

    it('should return false when some pigs remain', () => {
      const pig1 = new Pig(100, 100);
      const pig2 = new Pig(200, 100);
      expect(rulesEngine.allPigsDefeated([pig1, pig2])).toBe(false);
    });

    it('should return false when one pig remains', () => {
      const pig1 = new Pig(100, 100);
      expect(rulesEngine.allPigsDefeated([pig1])).toBe(false);
    });
  });
});

describe('ScoreManager', () => {
  let scoreManager: ScoreManager;

  beforeEach(() => {
    scoreManager = new ScoreManager();
  });

  it('should start with score 0', () => {
    expect(scoreManager.score).toBe(0);
  });

  it('should add pig defeat score', () => {
    scoreManager.addPigDefeat();
    expect(scoreManager.score).toBe(SCORE.PIG_DEFEAT);
  });

  it('should add block destroyed scores by material', () => {
    scoreManager.addBlockDestroyed(MaterialType.WOOD);
    expect(scoreManager.score).toBe(SCORE.BLOCK_WOOD);

    scoreManager.addBlockDestroyed(MaterialType.ICE);
    expect(scoreManager.score).toBe(SCORE.BLOCK_WOOD + SCORE.BLOCK_ICE);

    scoreManager.addBlockDestroyed(MaterialType.STONE);
    expect(scoreManager.score).toBe(SCORE.BLOCK_WOOD + SCORE.BLOCK_ICE + SCORE.BLOCK_STONE);
  });

  it('should add remaining bird bonus', () => {
    scoreManager.addRemainingBirdBonus(3);
    expect(scoreManager.score).toBe(30000);
  });

  it('should calculate 1 star for low score', () => {
    scoreManager.addPigDefeat(); // 5000
    expect(scoreManager.calculateStars(50000)).toBe(1);
  });

  it('should calculate 2 stars for medium score', () => {
    // Need >= 60% of max
    scoreManager.addRemainingBirdBonus(3); // 30000
    expect(scoreManager.calculateStars(50000)).toBe(2); // 60%
  });

  it('should calculate 3 stars for high score', () => {
    // Need >= 85% of max
    scoreManager.addRemainingBirdBonus(5); // 50000
    expect(scoreManager.calculateStars(50000)).toBe(3); // 100%
  });

  it('should reset score', () => {
    scoreManager.addPigDefeat();
    scoreManager.reset();
    expect(scoreManager.score).toBe(0);
  });
});
