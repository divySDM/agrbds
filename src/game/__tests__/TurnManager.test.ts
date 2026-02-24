import { describe, it, expect, beforeEach } from 'vitest';
import { TurnManager } from '../TurnManager';
import { TurnState } from '../types';
import { SETTLING_FRAMES } from '../../physics/constants';

// Mock PhysicsWorld
class MockPhysicsWorld {
  private settled: boolean = false;

  setSettled(settled: boolean): void {
    this.settled = settled;
  }

  isWorldSettled(_threshold: number): boolean {
    return this.settled;
  }
}

describe('TurnManager', () => {
  let turnManager: TurnManager;
  let mockPhysics: MockPhysicsWorld;

  beforeEach(() => {
    turnManager = new TurnManager();
    mockPhysics = new MockPhysicsWorld();
  });

  it('should start in AIMING state', () => {
    expect(turnManager.state).toBe(TurnState.AIMING);
  });

  it('should transition to FLYING', () => {
    turnManager.setState(TurnState.FLYING);
    expect(turnManager.state).toBe(TurnState.FLYING);
  });

  it('should transition to SETTLING', () => {
    turnManager.setState(TurnState.SETTLING);
    expect(turnManager.state).toBe(TurnState.SETTLING);
  });

  describe('settling detection', () => {
    it('should transition to LEVEL_WON when world settles and all pigs defeated', () => {
      turnManager.setState(TurnState.SETTLING);
      mockPhysics.setSettled(true);

      for (let i = 0; i < SETTLING_FRAMES; i++) {
        turnManager.update(mockPhysics as any, true, true);
      }

      expect(turnManager.state).toBe(TurnState.LEVEL_WON);
    });

    it('should transition to LEVEL_LOST when world settles and no birds remain', () => {
      turnManager.setState(TurnState.SETTLING);
      mockPhysics.setSettled(true);

      for (let i = 0; i < SETTLING_FRAMES; i++) {
        turnManager.update(mockPhysics as any, false, false);
      }

      expect(turnManager.state).toBe(TurnState.LEVEL_LOST);
    });

    it('should transition to NEXT_BIRD when world settles and birds remain', () => {
      turnManager.setState(TurnState.SETTLING);
      mockPhysics.setSettled(true);

      for (let i = 0; i < SETTLING_FRAMES; i++) {
        turnManager.update(mockPhysics as any, false, true);
      }

      expect(turnManager.state).toBe(TurnState.NEXT_BIRD);
    });

    it('should reset settling counter when world becomes unsettled', () => {
      turnManager.setState(TurnState.SETTLING);

      // Settle for a bit
      mockPhysics.setSettled(true);
      for (let i = 0; i < SETTLING_FRAMES - 5; i++) {
        turnManager.update(mockPhysics as any, false, true);
      }

      // Become unsettled
      mockPhysics.setSettled(false);
      turnManager.update(mockPhysics as any, false, true);

      // Settle again - should need full SETTLING_FRAMES again
      mockPhysics.setSettled(true);
      for (let i = 0; i < SETTLING_FRAMES - 1; i++) {
        turnManager.update(mockPhysics as any, false, true);
      }
      expect(turnManager.state).toBe(TurnState.SETTLING);

      // One more should trigger transition
      turnManager.update(mockPhysics as any, false, true);
      expect(turnManager.state).toBe(TurnState.NEXT_BIRD);
    });
  });

  it('should reset to AIMING state', () => {
    turnManager.setState(TurnState.FLYING);
    turnManager.reset();
    expect(turnManager.state).toBe(TurnState.AIMING);
  });
});
