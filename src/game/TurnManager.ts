import { TurnState } from './types';
import { SETTLING_THRESHOLD, SETTLING_FRAMES } from '../physics/constants';
import type { PhysicsWorld } from '../physics/PhysicsWorld';

export class TurnManager {
  private _state: TurnState = TurnState.AIMING;
  private settlingCounter: number = 0;

  get state(): TurnState {
    return this._state;
  }

  setState(state: TurnState): void {
    this._state = state;
    if (state === TurnState.SETTLING) {
      this.settlingCounter = 0;
    }
  }

  update(
    physics: PhysicsWorld,
    allPigsDefeated: boolean,
    hasBirdsRemaining: boolean,
    hasPendingSpecialEffects: boolean = false
  ): void {
    switch (this._state) {
      case TurnState.SETTLING: {
        // Don't settle while special effects are pending (gravity inversion, TNT chains)
        if (hasPendingSpecialEffects) {
          this.settlingCounter = 0;
          break;
        }
        if (physics.isWorldSettled(SETTLING_THRESHOLD)) {
          this.settlingCounter++;
        } else {
          this.settlingCounter = 0;
        }

        if (this.settlingCounter >= SETTLING_FRAMES) {
          if (allPigsDefeated) {
            this._state = TurnState.LEVEL_WON;
          } else if (!hasBirdsRemaining) {
            this._state = TurnState.LEVEL_LOST;
          } else {
            this._state = TurnState.NEXT_BIRD;
          }
        }
        break;
      }
      default:
        break;
    }
  }

  reset(): void {
    this._state = TurnState.AIMING;
    this.settlingCounter = 0;
  }
}
