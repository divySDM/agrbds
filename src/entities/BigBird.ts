import { Bird } from './Bird';
import { BirdType } from '../game/types';

export class BigBird extends Bird {
  constructor(x: number, y: number) {
    super(x, y, BirdType.BIG);
  }
  // No special ability — mass alone is the weapon
}
