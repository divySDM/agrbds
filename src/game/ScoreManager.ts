import { MaterialType, SCORE } from './types';

export class ScoreManager {
  private _score: number = 0;

  get score(): number {
    return this._score;
  }

  addPigDefeat(): void {
    this._score += SCORE.PIG_DEFEAT;
  }

  addBlockDestroyed(material: MaterialType): void {
    switch (material) {
      case MaterialType.WOOD:
        this._score += SCORE.BLOCK_WOOD;
        break;
      case MaterialType.ICE:
        this._score += SCORE.BLOCK_ICE;
        break;
      case MaterialType.STONE:
        this._score += SCORE.BLOCK_STONE;
        break;
    }
  }

  addRemainingBirdBonus(count: number): void {
    this._score += count * SCORE.REMAINING_BIRD;
  }

  calculateStars(theoreticalMax: number): number {
    if (theoreticalMax <= 0) return 1;
    const ratio = this._score / theoreticalMax;
    if (ratio >= SCORE.STAR_3_THRESHOLD) return 3;
    if (ratio >= SCORE.STAR_2_THRESHOLD) return 2;
    return 1;
  }

  reset(): void {
    this._score = 0;
  }
}
