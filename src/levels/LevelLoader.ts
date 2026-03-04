import { PhysicsWorld } from '../physics/PhysicsWorld';
import { Ground } from '../entities/Ground';
import { Block } from '../entities/Block';
import { Pig } from '../entities/Pig';
import { BirdQueue } from '../entities/BirdQueue';
import { Slingshot } from '../entities/Slingshot';
import type { LevelData } from './types';

export interface LoadedLevel {
  ground: Ground;
  blocks: Block[];
  pigs: Pig[];
  birdQueue: BirdQueue;
  slingshot: Slingshot;
}

export function loadLevel(data: LevelData, physics: PhysicsWorld): LoadedLevel {
  const ground = new Ground();
  physics.addBody(ground.body);

  const blocks: Block[] = [];
  for (const def of data.blocks) {
    const block = new Block(def.x, def.y, def.width, def.height, def.material, def.special);
    if (def.direction) {
      block.direction = def.direction;
    }
    physics.addBody(block.body);
    if (block.sensorBody) {
      physics.addBody(block.sensorBody);
    }
    blocks.push(block);
  }

  // Link teleporter pairs
  if (data.teleporterPairs) {
    for (const pair of data.teleporterPairs) {
      const blockA = blocks[pair.blockIndexA];
      const blockB = blocks[pair.blockIndexB];
      if (blockA && blockB) {
        blockA.linkedTeleporter = blockB;
        blockB.linkedTeleporter = blockA;
      }
    }
  }

  const pigs: Pig[] = [];
  for (const def of data.pigs) {
    const pig = new Pig(def.x, def.y);
    physics.addBody(pig.body);
    pigs.push(pig);
  }

  const birdQueue = new BirdQueue(data.birds);
  const slingshot = new Slingshot(data.slingshot.x, data.slingshot.y);

  return { ground, blocks, pigs, birdQueue, slingshot };
}
