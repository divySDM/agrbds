import Matter from 'matter-js';
import type { Scene } from './Scene';
import type { Game } from './Game';
import { TurnState, SceneType, GAME_WIDTH, GAME_HEIGHT, WORLD_WIDTH, SpecialBlockType } from './types';
import type { TestGameState } from './types';
import { PhysicsWorld } from '../physics/PhysicsWorld';
import { Camera } from './Camera';
import { TurnManager } from './TurnManager';
import { RulesEngine } from './RulesEngine';
import { ScoreManager } from './ScoreManager';
import { TrajectoryPreview } from './TrajectoryPreview';
import { loadLevel, type LoadedLevel } from '../levels/LevelLoader';
import type { LevelData } from '../levels/types';
import { SCORE } from './types';
import type { Bird } from '../entities/Bird';
import type { Block } from '../entities/Block';
import { BombBird } from '../entities/BombBird';
import { YellowBird } from '../entities/YellowBird';
import { SLINGSHOT, TIMING, SCREEN_SHAKE, BIRD_BOUNDS, TNT, GRAVITY as DEFAULT_GRAVITY, GRAVITY_INVERSION } from '../physics/constants';
import { HUD } from '../ui/HUD';
import { VictoryScreen } from '../ui/VictoryScreen';
import { GameOverScreen } from '../ui/GameOverScreen';
import { playLaunch, playExplosion, playPigDefeat, playBlockBreak, playImpact, playCombo, playBoost, playLevelLost, playLevelWon } from '../audio/SoundManager';
// LevelSelectScene imported dynamically to avoid circular dependency

interface PendingTNT {
  block: Block;
  delay: number;
  chainDepth: number;
}

export class LevelScene implements Scene {
  private game!: Game;
  private physics!: PhysicsWorld;
  private camera!: Camera;
  private turnManager!: TurnManager;
  private rulesEngine!: RulesEngine;
  private scoreManager!: ScoreManager;
  private trajectoryPreview!: TrajectoryPreview;
  private hud!: HUD;

  private level!: LoadedLevel;
  private levelData: LevelData;
  private currentBird: Bird | null = null;
  private launchedBirds: Bird[] = [];
  private isDragging: boolean = false;
  private particles: Particle[] = [];
  private explosionEffects: ExplosionEffect[] = [];
  private nextBirdDelay: number = 0;
  private flyingTime: number = 0;
  private flightTrail: { x: number; y: number }[] = [];

  // Juice features
  private floatingTexts: FloatingText[] = [];
  private slowMoTime: number = 0;
  private comboCount: number = 0;
  private lastDestructionTime: number = 0;
  private gameTime: number = 0;
  private isPaused: boolean = false;
  private showTutorial: boolean = false;
  private tutorialAlpha: number = 1;
  private impactFlashes: ImpactFlash[] = [];
  private titleCardTime: number = 0;
  private showTitleCard: boolean = true;

  // Camera pre-pan
  private prePanTime: number = 0;
  private prePanDone: boolean = false;

  // Overlays
  private victoryScreen: VictoryScreen | null = null;
  private gameOverScreen: GameOverScreen | null = null;
  private finalStars: number = 0;

  // Special block state
  private pendingTNTs: PendingTNT[] = [];
  private gravityInverted: boolean = false;
  private gravityInversionTimer: number = 0;
  private gravityTintAlpha: number = 0;
  private teleportCooldowns: Map<string, number> = new Map();
  private birdTeleportCount: number = 0;

  get sceneType(): SceneType {
    if (this.victoryScreen) return SceneType.VICTORY;
    if (this.gameOverScreen) return SceneType.GAME_OVER;
    return SceneType.PLAYING;
  }

  constructor(levelData: LevelData) {
    this.levelData = levelData;
  }

  getTestSnapshot(): Omit<TestGameState, 'highestUnlocked' | 'levelStars'> {
    return {
      scene: this.sceneType,
      turnState: this.turnManager?.state ?? null,
      score: this.scoreManager?.score ?? 0,
      pigsAlive: this.level?.pigs.length ?? 0,
      birdsRemaining: this.level?.birdQueue.remaining ?? 0,
      levelId: this.levelData.id,
      cameraX: Number.isFinite(this.camera?.x) ? this.camera.x : 0,
      slingshotX: this.level?.slingshot.anchorX ?? 200,
      slingshotY: this.level?.slingshot.anchorY ?? 600,
    };
  }

  enter(game: Game): void {
    this.game = game;
    this.physics = new PhysicsWorld();
    this.camera = new Camera();
    this.turnManager = new TurnManager();
    this.rulesEngine = new RulesEngine();
    this.scoreManager = new ScoreManager();
    this.trajectoryPreview = new TrajectoryPreview();
    this.hud = new HUD();

    this.level = loadLevel(this.levelData, this.physics);
    this.launchedBirds = [];
    this.particles = [];
    this.explosionEffects = [];
    this.floatingTexts = [];
    this.victoryScreen = null;
    this.gameOverScreen = null;
    this.slowMoTime = 0;
    this.comboCount = 0;
    this.lastDestructionTime = 0;
    this.gameTime = 0;
    this.isPaused = false;

    this.showTutorial = this.levelData.id === 1;
    this.tutorialAlpha = 1;
    this.impactFlashes = [];
    this.titleCardTime = 0;
    this.showTitleCard = true;

    // Pre-pan: start camera at the midpoint of the level to show structures
    this.prePanTime = 0;
    this.prePanDone = false;
    this.camera.snapTo(WORLD_WIDTH / 2);

    // Reset special block state
    this.pendingTNTs = [];
    this.gravityInverted = false;
    this.gravityInversionTimer = 0;
    this.gravityTintAlpha = 0;
    this.teleportCooldowns.clear();
    this.birdTeleportCount = 0;
    this.physics.setGravity(DEFAULT_GRAVITY.y);

    this.loadNextBird();
  }

  exit(): void {
    // Guarantee gravity reset on level exit
    this.physics.setGravity(DEFAULT_GRAVITY.y);
    this.physics.clear();
  }

  private loadNextBird(): void {
    const bird = this.level.birdQueue.createNext(
      this.level.slingshot.anchorX,
      this.level.slingshot.anchorY - 40
    );
    this.currentBird = bird;
    if (bird) {
      this.physics.addBody(bird.body);
    }
    this.turnManager.setState(TurnState.AIMING);
    this.birdTeleportCount = 0;
  }

  update(dt: number): void {
    if (this.isPaused) return;

    // Apply slow-motion
    let effectiveDt = dt;
    if (this.slowMoTime > 0) {
      this.slowMoTime -= dt;
      const progress = Math.max(0, this.slowMoTime / TIMING.SLOW_MO_DURATION);
      effectiveDt = dt * (TIMING.SLOW_MO_FACTOR + (1 - TIMING.SLOW_MO_FACTOR) * (1 - progress));
    }

    // Camera pre-pan: show level, then ease back to slingshot
    if (!this.prePanDone) {
      this.prePanTime += dt;
      if (this.prePanTime >= 1.5) {
        this.prePanDone = true;
        this.camera.returnToSlingshot(this.level.slingshot.anchorX);
      }
    }

    this.gameTime += effectiveDt;
    this.physics.update(effectiveDt);

    // Update special block sensor bodies
    for (const block of this.level.blocks) {
      block.update(effectiveDt);
    }

    // Process collisions
    const events = this.physics.getCollisionEvents();
    const { maxImpact, destroyedCount } = this.rulesEngine.processCollisions(
      events,
      this.level.blocks,
      this.level.pigs,
      this.scoreManager
    );

    // Process sensor collisions (gel pad & teleporter)
    this.processSensorCollisions();

    // Screen shake and impact flash on significant impacts
    if (maxImpact > SCREEN_SHAKE.IMPACT_THRESHOLD) {
      const intensity = maxImpact > 10 ? SCREEN_SHAKE.LARGE_INTENSITY : SCREEN_SHAKE.SMALL_INTENSITY;
      this.camera.shake(intensity);
      playImpact();
      // Spawn impact flash at collision points
      for (const event of events) {
        if (event.impactSpeed > SCREEN_SHAKE.IMPACT_THRESHOLD) {
          const pos = (event.bodyA as any).position;
          if (pos && Number.isFinite(pos.x) && Number.isFinite(pos.y)) {
            this.impactFlashes.push({ x: pos.x, y: pos.y, time: 0, maxTime: 0.12 });
          }
        }
      }
    }

    // Slow-mo on big hits
    if (destroyedCount >= 2 || maxImpact > 12) {
      this.slowMoTime = TIMING.SLOW_MO_DURATION;
    }

    // Track combos and spawn floating text for destructions
    if (destroyedCount > 0) {
      if (this.gameTime - this.lastDestructionTime < TIMING.COMBO_WINDOW) {
        this.comboCount += destroyedCount;
      } else {
        this.comboCount = destroyedCount;
      }
      this.lastDestructionTime = this.gameTime;
    }

    // Remove destroyed blocks — check for special block triggers
    for (const block of this.level.blocks) {
      if (block.isDestroyed) {
        // Trigger special block effects on destruction
        if (block.specialType === SpecialBlockType.TNT && !block.activated) {
          this.triggerTNT(block, 0);
        } else if (block.specialType === SpecialBlockType.GRAVITY_INVERTER && !block.activated) {
          this.triggerGravityInverter(block);
        }
        this.spawnParticles(block.body.position.x, block.body.position.y, block.material);
        this.physics.removeBody(block.body);
        if (block.sensorBody) {
          this.physics.removeBody(block.sensorBody);
        }
        playBlockBreak();
      }
    }
    this.level.blocks = this.level.blocks.filter((b) => !b.isDestroyed);

    // Process pending TNT chain explosions
    this.updatePendingTNTs(effectiveDt);

    // Update gravity inversion timer
    this.updateGravityInversion(effectiveDt);

    // Update teleport cooldowns
    for (const [id, cooldown] of this.teleportCooldowns) {
      const newCooldown = cooldown - effectiveDt;
      if (newCooldown <= 0) {
        this.teleportCooldowns.delete(id);
      } else {
        this.teleportCooldowns.set(id, newCooldown);
      }
    }

    // Remove destroyed pigs
    for (const pig of this.level.pigs) {
      if (pig.isDestroyed) {
        this.spawnParticles(pig.body.position.x, pig.body.position.y, 'pig');
        this.spawnFloatingText(pig.body.position.x, pig.body.position.y, `+${SCORE.PIG_DEFEAT}`, '#ffdd00');
        this.physics.removeBody(pig.body);
        playPigDefeat();
      }
    }
    this.level.pigs = this.level.pigs.filter((p) => !p.isDestroyed);

    // Clean up destroyed launched birds
    this.launchedBirds = this.launchedBirds.filter((b) => !b.isDestroyed);

    // Spawn combo text and SFX
    if (destroyedCount > 0 && this.comboCount >= 3) {
      playCombo();
      const lastDestroyed = events.length > 0 ? events[events.length - 1] : null;
      const cx = lastDestroyed ? (lastDestroyed.bodyA as any).position?.x ?? GAME_WIDTH / 2 : GAME_WIDTH / 2;
      const cy = lastDestroyed ? (lastDestroyed.bodyA as any).position?.y ?? GAME_HEIGHT / 2 : GAME_HEIGHT / 2;
      this.spawnFloatingText(cx, cy - 30, `COMBO x${this.comboCount}!`, '#ff6600');
    }

    // Set pigs worried when bird is flying
    const isFlying = this.turnManager.state === TurnState.FLYING;
    for (const pig of this.level.pigs) {
      pig.setWorried(isFlying);
    }

    // Camera follows bird in flight
    if (this.turnManager.state === TurnState.FLYING && this.currentBird) {
      const birdX = this.currentBird.body.position.x;
      if (Number.isFinite(birdX)) {
        this.camera.followBird(birdX);
      }
    }
    this.camera.update(dt);

    // Record flight trail
    if (this.turnManager.state === TurnState.FLYING && this.currentBird) {
      const bp = this.currentBird.body.position;
      if (Number.isFinite(bp.x) && Number.isFinite(bp.y)) {
        if (Math.round(this.flyingTime * 60) % 3 === 0) {
          this.flightTrail.push({ x: bp.x, y: bp.y });
        }
      }
    }

    // Turn state management
    const allDefeated = this.rulesEngine.allPigsDefeated(this.level.pigs);

    if (this.turnManager.state === TurnState.FLYING && this.currentBird) {
      const bird = this.currentBird;
      this.flyingTime += effectiveDt;

      const pos = bird.body.position;
      const outOfBounds = !Number.isFinite(pos.x) || !Number.isFinite(pos.y) ||
        pos.y > GAME_HEIGHT + BIRD_BOUNDS.MAX_Y_OFFSET ||
        pos.x > GAME_WIDTH * BIRD_BOUNDS.MAX_X_FACTOR ||
        pos.x < BIRD_BOUNDS.MIN_X;

      const birdStopped = this.flyingTime > TIMING.BIRD_SETTLE_GRACE && bird.body.speed < TIMING.BIRD_SETTLE_SPEED;
      const maxFlyingTime = this.flyingTime > TIMING.MAX_FLYING_TIME;

      if (outOfBounds || birdStopped || maxFlyingTime) {
        this.turnManager.setState(TurnState.SETTLING);
      }
    }

    // Account for gravity inversion in settling — don't settle while gravity is inverted
    const hasPendingSpecialEffects = this.gravityInverted || this.pendingTNTs.length > 0;

    this.turnManager.update(
      this.physics,
      allDefeated,
      !this.level.birdQueue.isEmpty(),
      hasPendingSpecialEffects
    );

    // Late win check
    if (allDefeated &&
      (this.turnManager.state === TurnState.AIMING ||
       this.turnManager.state === TurnState.NEXT_BIRD)) {
      this.turnManager.setState(TurnState.LEVEL_WON);
    }

    // Handle turn transitions
    if (this.turnManager.state === TurnState.NEXT_BIRD) {
      this.nextBirdDelay += effectiveDt;
      if (this.nextBirdDelay >= TIMING.NEXT_BIRD_DELAY) {
        this.nextBirdDelay = 0;
        if (this.currentBird) {
          this.physics.removeBody(this.currentBird.body);
        }
        this.camera.returnToSlingshot(this.level.slingshot.anchorX);
        this.loadNextBird();
      }
    }

    if (this.turnManager.state === TurnState.LEVEL_WON && !this.victoryScreen) {
      this.scoreManager.addRemainingBirdBonus(this.level.birdQueue.remaining);
      this.finalStars = this.scoreManager.calculateStars(this.levelData.theoreticalMaxScore);
      this.game.completeLevel(this.levelData.id, this.finalStars);
      this.victoryScreen = new VictoryScreen(
        this.scoreManager.score,
        this.finalStars,
        this.levelData.id
      );
      playLevelWon();
    }

    if (this.turnManager.state === TurnState.LEVEL_LOST && !this.gameOverScreen) {
      this.gameOverScreen = new GameOverScreen();
      this.camera.shake(SCREEN_SHAKE.SMALL_INTENSITY, 0.3);
      playLevelLost();
    }

    // Update particles
    this.particles = this.particles.filter((p) => {
      p.life -= effectiveDt;
      p.x += p.vx * effectiveDt;
      p.y += p.vy * effectiveDt;
      p.vy += 400 * effectiveDt;
      return p.life > 0;
    });

    // Update explosion effects
    this.explosionEffects = this.explosionEffects.filter((e) => {
      e.time += effectiveDt;
      return e.time < e.duration;
    });

    // Update floating texts
    this.floatingTexts = this.floatingTexts.filter((ft) => {
      ft.life -= effectiveDt;
      ft.y -= 60 * effectiveDt;
      return ft.life > 0;
    });

    // Update impact flashes
    this.impactFlashes = this.impactFlashes.filter((f) => {
      f.time += effectiveDt;
      return f.time < f.maxTime;
    });

    // Update title card
    if (this.showTitleCard) {
      this.titleCardTime += effectiveDt;
      if (this.titleCardTime > 2) {
        this.showTitleCard = false;
      }
    }

    // Update victory screen animation
    if (this.victoryScreen) {
      this.victoryScreen.update(effectiveDt);
    }

    // Update game over screen animation
    if (this.gameOverScreen) {
      this.gameOverScreen.update(effectiveDt);
    }

    // Fade tutorial
    if (this.showTutorial && this.gameTime > 3) {
      this.tutorialAlpha -= effectiveDt * 2;
      if (this.tutorialAlpha <= 0) {
        this.showTutorial = false;
        this.tutorialAlpha = 0;
      }
    }
  }

  // --- Special Block Triggers ---

  private triggerTNT(block: Block, chainDepth: number): void {
    if (block.activated || chainDepth >= TNT.maxChainDepth) return;
    block.activated = true;

    const center = block.body.position;
    this.physics.applyExplosion(center, TNT.blastRadius, TNT.blastForce);
    this.scoreManager.addTNTDetonation();

    // Explosion VFX
    this.explosionEffects.push({
      x: center.x,
      y: center.y,
      maxRadius: TNT.blastRadius,
      time: 0,
      duration: TIMING.EXPLOSION_DURATION,
    });
    this.camera.shake(SCREEN_SHAKE.BOMB_INTENSITY, 0.3);
    this.spawnFloatingText(center.x, center.y - 30, `+${SCORE.TNT_DETONATION}`, '#ff4400');
    playExplosion();

    // Apply radial damage to blocks and pigs within blast radius
    for (const b of this.level.blocks) {
      if (b === block || b.isDestroyed) continue;
      const dx = b.body.position.x - center.x;
      const dy = b.body.position.y - center.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= TNT.blastRadius) {
        const falloff = 1 - dist / TNT.blastRadius;
        b.applyDamage(falloff * 120);
        // Queue chain TNT explosions with stagger
        if (b.isDestroyed && b.specialType === SpecialBlockType.TNT && !b.activated) {
          this.pendingTNTs.push({ block: b, delay: TNT.chainDelay, chainDepth: chainDepth + 1 });
        }
      }
    }
    for (const pig of this.level.pigs) {
      if (pig.isDestroyed) continue;
      const dx = pig.body.position.x - center.x;
      const dy = pig.body.position.y - center.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= TNT.blastRadius) {
        const falloff = 1 - dist / TNT.blastRadius;
        pig.applyDamage(falloff * 120);
      }
    }
  }

  private updatePendingTNTs(dt: number): void {
    const ready: PendingTNT[] = [];
    this.pendingTNTs = this.pendingTNTs.filter((pt) => {
      pt.delay -= dt;
      if (pt.delay <= 0) {
        ready.push(pt);
        return false;
      }
      return true;
    });
    for (const pt of ready) {
      this.triggerTNT(pt.block, pt.chainDepth);
    }
  }

  private triggerGravityInverter(block: Block): void {
    if (block.activated) return;
    block.activated = true;
    this.scoreManager.addGravityInverter();
    this.spawnFloatingText(block.body.position.x, block.body.position.y - 30, 'GRAVITY INVERTED!', '#bb66ff');
    this.spawnFloatingText(block.body.position.x, block.body.position.y - 60, `+${SCORE.GRAVITY_INVERTER}`, '#bb66ff');

    // Flip gravity (or restart timer if already inverted)
    this.gravityInverted = true;
    this.gravityInversionTimer = GRAVITY_INVERSION.duration;
    this.physics.setGravity(-DEFAULT_GRAVITY.y);
  }

  private updateGravityInversion(dt: number): void {
    if (!this.gravityInverted) return;

    this.gravityInversionTimer -= dt;
    this.gravityTintAlpha = Math.min(0.15, this.gravityTintAlpha + dt * 0.5);

    if (this.gravityInversionTimer <= 0) {
      this.gravityInverted = false;
      this.gravityTintAlpha = 0;
      this.physics.setGravity(DEFAULT_GRAVITY.y);
    }
  }

  private processSensorCollisions(): void {
    const sensorEvents = this.physics.getSensorCollisionEvents();
    for (const event of sensorEvents) {
      const sensorEntity = (event.sensorBody as any).gameEntity as Block | undefined;
      if (!sensorEntity || sensorEntity.isDestroyed) continue;

      const otherEntity = (event.otherBody as any).gameEntity;
      // Only interact with birds
      if (!otherEntity || !(otherEntity as any).hasLaunched) continue;
      const bird = otherEntity as Bird;

      if (sensorEntity.specialType === SpecialBlockType.GEL_PAD) {
        this.handleGelPadBounce(sensorEntity, bird);
      } else if (sensorEntity.specialType === SpecialBlockType.TELEPORTER) {
        this.handleTeleport(sensorEntity, bird);
      }
    }
  }

  private handleGelPadBounce(_pad: Block, bird: Bird): void {
    const vel = bird.body.velocity;
    // Amplify and reflect velocity (bounce upward primarily)
    const multiplier = 1.8;
    const newVy = -Math.abs(vel.y) * multiplier;
    const newVx = vel.x * multiplier;
    Matter.Body.setVelocity(bird.body, { x: newVx, y: newVy });

    // VFX
    this.impactFlashes.push({
      x: bird.body.position.x,
      y: bird.body.position.y,
      time: 0,
      maxTime: 0.15,
    });
    this.spawnFloatingText(bird.body.position.x, bird.body.position.y - 20, 'BOUNCE!', '#00e5a0');
    playImpact();
  }

  private handleTeleport(portal: Block, bird: Bird): void {
    const linked = portal.linkedTeleporter;
    if (!linked || linked.isDestroyed) return;

    // Check cooldown
    if (this.teleportCooldowns.has(portal.id) || this.teleportCooldowns.has(linked.id)) return;

    // Max teleports per bird
    if (this.birdTeleportCount >= 3) return;

    // Warp bird to linked teleporter position
    const exitPos = linked.body.position;
    Matter.Body.setPosition(bird.body, { x: exitPos.x, y: exitPos.y });

    // Preserve velocity magnitude, reverse direction
    const vel = bird.body.velocity;
    Matter.Body.setVelocity(bird.body, { x: -vel.x, y: -vel.y });

    // Set cooldowns
    this.teleportCooldowns.set(portal.id, 0.5);
    this.teleportCooldowns.set(linked.id, 0.5);
    this.birdTeleportCount++;

    // VFX at entry and exit
    this.spawnTeleportParticles(portal.body.position.x, portal.body.position.y);
    this.spawnTeleportParticles(exitPos.x, exitPos.y);
    this.spawnFloatingText(exitPos.x, exitPos.y - 20, 'WARP!', '#6666ff');
    playImpact();
  }

  private spawnTeleportParticles(x: number, y: number): void {
    const colors = ['#3366ff', '#ff6600', '#ffffff'];
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 120;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0.5 + Math.random() * 0.3,
        maxLife: 0.8,
        shape: 'square',
      });
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const shakeY = this.camera.shakeOffsetY;

    // Background sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
    gradient.addColorStop(0, '#4a90d9');
    gradient.addColorStop(0.6, '#87ceeb');
    gradient.addColorStop(1, '#b0e0ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Background hills (parallax scenery)
    this.renderBackground(ctx);

    // Clouds
    this.renderClouds(ctx);

    ctx.save();
    if (shakeY !== 0) {
      ctx.translate(0, shakeY);
    }

    const cam = { x: this.camera.x, y: 0 };

    // Ground
    this.level.ground.render(ctx, this.camera.x);

    // Slingshot back
    this.level.slingshot.render(
      ctx,
      this.camera.x,
      this.currentBird && (this.isDragging || !this.currentBird.hasLaunched)
        ? this.currentBird.body.position.x
        : undefined,
      this.currentBird && (this.isDragging || !this.currentBird.hasLaunched)
        ? this.currentBird.body.position.y
        : undefined
    );

    // Blocks
    for (const block of this.level.blocks) {
      block.render(ctx, cam);
    }

    // Pigs
    for (const pig of this.level.pigs) {
      pig.render(ctx, cam);
    }

    // Launched birds
    for (const bird of this.launchedBirds) {
      if (!bird.isDestroyed) {
        bird.render(ctx, cam);
      }
    }

    // Current bird
    if (this.currentBird && !this.currentBird.isDestroyed) {
      this.currentBird.render(ctx, cam);
    }

    // Flight trail
    if (this.flightTrail.length > 0) {
      const trailLen = this.flightTrail.length;
      for (let i = 0; i < trailLen; i++) {
        const alpha = 0.15 + 0.45 * (i / trailLen);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.flightTrail[i].x - this.camera.x, this.flightTrail[i].y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // Trajectory preview
    if (this.isDragging && this.currentBird) {
      const vel = this.level.slingshot.getVelocityPreview();
      this.trajectoryPreview.render(
        ctx,
        this.currentBird.body.position.x,
        this.currentBird.body.position.y,
        vel.x,
        vel.y,
        this.camera.x
      );
    }

    // Power gauge during drag
    if (this.isDragging && this.currentBird) {
      this.renderPowerGauge(ctx);
    }

    // Particles
    for (const p of this.particles) {
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      if (p.shape === 'shard') {
        ctx.save();
        ctx.translate(p.x - this.camera.x, p.y);
        ctx.rotate(p.vx * 0.01);
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      } else {
        ctx.fillRect(p.x - p.size / 2 - this.camera.x, p.y - p.size / 2, p.size, p.size);
      }
    }
    ctx.globalAlpha = 1;

    // Explosion effects
    for (const e of this.explosionEffects) {
      const progress = e.time / e.duration;
      const radius = e.maxRadius * progress;
      const alpha = 1 - progress;
      ctx.globalAlpha = alpha * 0.6;
      ctx.fillStyle = '#ffcc00';
      ctx.beginPath();
      ctx.arc(e.x - this.camera.x, e.y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ff6600';
      ctx.beginPath();
      ctx.arc(e.x - this.camera.x, e.y, radius * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Impact flashes
    for (const f of this.impactFlashes) {
      const alpha = 1 - f.time / f.maxTime;
      const radius = 15 + (f.time / f.maxTime) * 20;
      ctx.globalAlpha = alpha * 0.7;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(f.x - this.camera.x, f.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Floating texts
    for (const ft of this.floatingTexts) {
      const alpha = ft.life / ft.maxLife;
      ctx.globalAlpha = alpha;
      ctx.font = 'bold 20px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.strokeText(ft.text, ft.x - this.camera.x, ft.y);
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, ft.x - this.camera.x, ft.y);
    }
    ctx.globalAlpha = 1;

    ctx.restore();

    // Gravity inversion purple tint overlay
    if (this.gravityTintAlpha > 0) {
      ctx.fillStyle = `rgba(100, 0, 200, ${this.gravityTintAlpha})`;
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }

    // HUD (not affected by shake)
    this.hud.render(ctx, this.scoreManager.score, this.level.birdQueue);

    // Combo indicator in HUD area
    if (this.comboCount >= 3 && this.gameTime - this.lastDestructionTime < TIMING.COMBO_WINDOW) {
      ctx.font = 'bold 18px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ff6600';
      ctx.fillText(`COMBO x${this.comboCount}`, GAME_WIDTH / 2, 35);
    }

    // Pause button
    this.renderPauseButton(ctx);

    // Overlays
    if (this.victoryScreen) {
      this.victoryScreen.render(ctx);
    }
    if (this.gameOverScreen) {
      this.gameOverScreen.render(ctx);
    }

    // Title card
    if (this.showTitleCard) {
      const alpha = this.titleCardTime < 1.5 ? 1 : Math.max(0, 1 - (this.titleCardTime - 1.5) / 0.5);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(GAME_WIDTH / 2 - 200, GAME_HEIGHT / 2 - 40, 400, 60);
      ctx.font = 'bold 28px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      ctx.fillText(this.levelData.name, GAME_WIDTH / 2, GAME_HEIGHT / 2);
      ctx.font = '16px Arial, sans-serif';
      ctx.fillStyle = '#ccc';
      ctx.fillText(`Level ${this.levelData.id}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 22);
      ctx.globalAlpha = 1;
    }

    // Tutorial overlay
    if (this.showTutorial) {
      this.renderTutorial(ctx);
    }

    // Pause overlay
    if (this.isPaused) {
      this.renderPauseOverlay(ctx);
    }
  }

  private renderPowerGauge(ctx: CanvasRenderingContext2D): void {
    const dragPos = this.level.slingshot.getDragPosition();
    const dx = this.level.slingshot.anchorX - dragPos.x;
    const dy = this.level.slingshot.anchorY - dragPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const power = Math.min(dist / SLINGSHOT.maxDrag, 1);

    const barX = 20;
    const barY = GAME_HEIGHT - 40;
    const barW = 120;
    const barH = 12;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(barX - 2, barY - 2, barW + 4, barH + 4);

    // Gradient from green to yellow to red
    const grd = ctx.createLinearGradient(barX, 0, barX + barW, 0);
    grd.addColorStop(0, '#4caf50');
    grd.addColorStop(0.5, '#ffeb3b');
    grd.addColorStop(1, '#f44336');
    ctx.fillStyle = grd;
    ctx.fillRect(barX, barY, barW * power, barH);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barW, barH);

    ctx.font = '10px Arial, sans-serif';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText('POWER', barX, barY - 2);
  }

  private renderPauseButton(ctx: CanvasRenderingContext2D): void {
    if (this.victoryScreen || this.gameOverScreen) return;
    const x = GAME_WIDTH / 2 - 15;
    const y = 12;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.arc(x + 15, y + 15, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 9, y + 7, 5, 16);
    ctx.fillRect(x + 17, y + 7, 5, 16);
  }

  private renderTutorial(ctx: CanvasRenderingContext2D): void {
    ctx.globalAlpha = this.tutorialAlpha;

    // Arrow pointing to slingshot
    const sx = this.level.slingshot.anchorX - this.camera.x;
    const sy = this.level.slingshot.anchorY - 80;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.moveTo(sx - 100, sy - 60);
    ctx.lineTo(sx + 160, sy - 60);
    ctx.lineTo(sx + 160, sy - 20);
    ctx.lineTo(sx - 100, sy - 20);
    ctx.closePath();
    ctx.fill();

    ctx.font = 'bold 16px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.fillText('Drag bird to aim, release to launch!', sx + 30, sy - 34);

    // Pulsing arrow
    const pulse = Math.sin(this.gameTime * 4) * 3;
    ctx.fillStyle = '#ffdd00';
    ctx.beginPath();
    ctx.moveTo(sx, sy - 15 + pulse);
    ctx.lineTo(sx - 8, sy - 25 + pulse);
    ctx.lineTo(sx + 8, sy - 25 + pulse);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 1;
  }

  private renderPauseOverlay(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    ctx.font = 'bold 48px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.fillText('PAUSED', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30);

    ctx.font = '20px Arial, sans-serif';
    ctx.fillStyle = '#ccc';
    ctx.fillText('Press ESC or tap to resume', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20);
  }

  private renderBackground(ctx: CanvasRenderingContext2D): void {
    const groundTop = GAME_HEIGHT - 60;

    // Far hills — dark blue-green, 10% parallax
    ctx.fillStyle = '#3a6a4a';
    ctx.beginPath();
    ctx.moveTo(0, groundTop);
    for (let x = 0; x <= GAME_WIDTH; x += 4) {
      const wx = x + this.camera.x * 0.1;
      const h = 80 + Math.sin(wx * 0.005) * 50 + Math.sin(wx * 0.012) * 30;
      ctx.lineTo(x, groundTop - h);
    }
    ctx.lineTo(GAME_WIDTH, groundTop);
    ctx.closePath();
    ctx.fill();

    // Mid hills — green, 20% parallax
    ctx.fillStyle = '#4a8a3f';
    ctx.beginPath();
    ctx.moveTo(0, groundTop);
    for (let x = 0; x <= GAME_WIDTH; x += 4) {
      const wx = x + this.camera.x * 0.2;
      const h = 40 + Math.sin(wx * 0.008) * 35 + Math.sin(wx * 0.02) * 20;
      ctx.lineTo(x, groundTop - h);
    }
    ctx.lineTo(GAME_WIDTH, groundTop);
    ctx.closePath();
    ctx.fill();

    // Bush clusters on the ground layer (30% parallax)
    ctx.fillStyle = '#3d7a30';
    const bushPositions = [60, 200, 380, 520, 700, 900, 1050, 1200];
    for (const bx of bushPositions) {
      const sx = bx - this.camera.x * 0.3;
      if (sx < -40 || sx > GAME_WIDTH + 40) continue;
      ctx.beginPath();
      ctx.arc(sx, groundTop - 8, 16, 0, Math.PI * 2);
      ctx.arc(sx - 12, groundTop - 4, 12, 0, Math.PI * 2);
      ctx.arc(sx + 14, groundTop - 5, 13, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private renderClouds(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    const cloudPositions = [
      { x: 100, y: 80, s: 1 },
      { x: 400, y: 50, s: 1.3 },
      { x: 700, y: 100, s: 0.9 },
      { x: 1000, y: 60, s: 1.1 },
    ];
    for (const c of cloudPositions) {
      const cx = c.x - this.camera.x * 0.3; // Parallax
      ctx.beginPath();
      ctx.arc(cx, c.y, 30 * c.s, 0, Math.PI * 2);
      ctx.arc(cx + 25 * c.s, c.y - 10, 25 * c.s, 0, Math.PI * 2);
      ctx.arc(cx + 50 * c.s, c.y, 28 * c.s, 0, Math.PI * 2);
      ctx.arc(cx + 20 * c.s, c.y + 5, 22 * c.s, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private spawnParticles(x: number, y: number, type: string): void {
    const colors: Record<string, string[]> = {
      WOOD: ['#c4923a', '#9e7530', '#d4a850'],
      ICE: ['#a8d8ea', '#7bb8d0', '#c0e8ff'],
      STONE: ['#8a8a8a', '#6a6a6a', '#aaaaaa'],
      pig: ['#6abf4b', '#8fd97a', '#50a535'],
    };
    const particleColors = colors[type] || ['#888'];
    const shape: ParticleShape = type === 'ICE' ? 'shard' : 'square';

    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 80 + Math.random() * 250;
      this.particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 150,
        size: 4 + Math.random() * 8,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        life: TIMING.PARTICLE_LIFE_MIN + Math.random() * TIMING.PARTICLE_LIFE_RANGE,
        maxLife: TIMING.PARTICLE_LIFE_MIN + TIMING.PARTICLE_LIFE_RANGE,
        shape,
      });
    }
  }

  private spawnFloatingText(x: number, y: number, text: string, color: string): void {
    this.floatingTexts.push({
      x, y, text, color,
      life: TIMING.FLOATING_TEXT_LIFE,
      maxLife: TIMING.FLOATING_TEXT_LIFE,
    });
  }

  onPointerDown(x: number, y: number): void {
    // Resume from pause on tap
    if (this.isPaused) {
      this.isPaused = false;
      return;
    }

    // Pause button hit test
    if (!this.victoryScreen && !this.gameOverScreen) {
      const pbX = GAME_WIDTH / 2;
      const pbY = 27;
      if (Math.sqrt((x - pbX) ** 2 + (y - pbY) ** 2) < 16) {
        this.isPaused = true;
        return;
      }
    }

    // Check victory/gameover buttons first
    if (this.victoryScreen) {
      const action = this.victoryScreen.handleClick(x, y);
      if (action === 'next') {
        import('../ui/LevelSelectScene').then(({ LevelSelectScene }) => {
          this.game.sceneManager.switchTo(new LevelSelectScene());
        }).catch(() => {
          this.game.sceneManager.switchTo(new LevelScene(this.levelData));
        });
      } else if (action === 'replay') {
        this.game.sceneManager.switchTo(new LevelScene(this.levelData));
      }
      return;
    }

    if (this.gameOverScreen) {
      const action = this.gameOverScreen.handleClick(x, y);
      if (action === 'retry') {
        this.game.sceneManager.switchTo(new LevelScene(this.levelData));
      }
      return;
    }

    // Bird ability activation during flight
    if (this.turnManager.state === TurnState.FLYING) {
      if (this.currentBird instanceof BombBird && !this.currentBird.hasExploded) {
        this.currentBird.explode(this.physics);
        const bpos = this.currentBird.body.position;
        if (Number.isFinite(bpos.x) && Number.isFinite(bpos.y)) {
          this.explosionEffects.push({
            x: bpos.x,
            y: bpos.y,
            maxRadius: 180,
            time: 0,
            duration: TIMING.EXPLOSION_DURATION,
          });
        }
        this.camera.shake(SCREEN_SHAKE.BOMB_INTENSITY, 0.3);
        this.turnManager.setState(TurnState.SETTLING);
        playExplosion();
        return;
      }
      if (this.currentBird instanceof YellowBird && !this.currentBird.hasBoosted) {
        this.currentBird.activate();
        this.spawnFloatingText(
          this.currentBird.body.position.x,
          this.currentBird.body.position.y - 30,
          'BOOST!',
          '#ffd700'
        );
        playBoost();
        return;
      }
    }

    // Start slingshot drag
    if (this.turnManager.state === TurnState.AIMING && this.currentBird) {
      const birdX = this.currentBird.body.position.x - this.camera.x;
      const birdY = this.currentBird.body.position.y;
      const dist = Math.sqrt((x - birdX) ** 2 + (y - birdY) ** 2);
      if (dist < SLINGSHOT.maxDrag) {
        this.isDragging = true;
        this.showTutorial = false;
        this.level.slingshot.startDrag();
      }
    }
  }

  onPointerMove(x: number, y: number): void {
    if (this.isDragging && this.currentBird) {
      this.level.slingshot.updateDrag(x + this.camera.x, y);
      const dragPos = this.level.slingshot.getDragPosition();
      Matter.Body.setPosition(this.currentBird.body, { x: dragPos.x, y: dragPos.y });
    }
  }

  onPointerUp(_x: number, _y: number): void {
    if (this.isDragging && this.currentBird) {
      this.isDragging = false;
      const velocity = this.level.slingshot.release();
      this.currentBird.launch(velocity.x, velocity.y);
      this.launchedBirds.push(this.currentBird);
      this.flyingTime = 0;
      this.flightTrail = [];
      this.turnManager.setState(TurnState.FLYING);
      this.camera.shake(SCREEN_SHAKE.SMALL_INTENSITY * 0.5, 0.1);
      playLaunch();
    }
  }

  onKeyDown(key: string): void {
    if (key === 'Escape' || key === 'p' || key === 'P') {
      if (!this.victoryScreen && !this.gameOverScreen) {
        this.isPaused = !this.isPaused;
      }
    }
    if (key === 'r' || key === 'R') {
      // Guarantee gravity reset on retry
      this.physics.setGravity(DEFAULT_GRAVITY.y);
      this.game.sceneManager.switchTo(new LevelScene(this.levelData));
    }
  }
}

type ParticleShape = 'square' | 'shard';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  shape: ParticleShape;
}

interface ExplosionEffect {
  x: number;
  y: number;
  maxRadius: number;
  time: number;
  duration: number;
}

interface ImpactFlash {
  x: number;
  y: number;
  time: number;
  maxTime: number;
}

interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
}
