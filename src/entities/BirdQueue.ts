import { BirdType } from '../game/types';
import { Bird } from './Bird';
import { BombBird } from './BombBird';
import { YellowBird } from './YellowBird';
import { BlueBird } from './BlueBird';
import { WhiteBird } from './WhiteBird';
import { BigBird } from './BigBird';

export class BirdQueue {
  private queue: BirdType[];
  private currentIndex: number = 0;

  constructor(birdTypes: BirdType[]) {
    this.queue = [...birdTypes];
  }

  createNext(x: number, y: number): Bird | null {
    if (this.currentIndex >= this.queue.length) return null;
    const type = this.queue[this.currentIndex];
    this.currentIndex++;
    if (type === BirdType.BOMB) {
      return new BombBird(x, y);
    }
    if (type === BirdType.YELLOW) {
      return new YellowBird(x, y);
    }
    if (type === BirdType.BLUE) {
      return new BlueBird(x, y);
    }
    if (type === BirdType.WHITE) {
      return new WhiteBird(x, y);
    }
    if (type === BirdType.BIG) {
      return new BigBird(x, y);
    }
    return new Bird(x, y, BirdType.RED);
  }

  get remaining(): number {
    return this.queue.length - this.currentIndex;
  }

  get total(): number {
    return this.queue.length;
  }

  get usedCount(): number {
    return this.currentIndex;
  }

  get types(): BirdType[] {
    return this.queue.slice(this.currentIndex);
  }

  isEmpty(): boolean {
    return this.currentIndex >= this.queue.length;
  }
}
