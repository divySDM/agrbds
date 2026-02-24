import Matter from 'matter-js';
import type { Scene } from './Scene';
import type { Game } from './Game';
import { TurnState, GAME_WIDTH, GAME_HEIGHT } from './types';
import { PhysicsWorld } from '../physics/PhysicsWorld';
import { Camera } from './Camera';
import { TurnManager } from './TurnManager';
import { RulesEngine } from './RulesEngine';
import { ScoreManager } from './ScoreManager';
import { TrajectoryPreview } from './TrajectoryPreview';
import { loadLevel, type LoadedLevel } from '../levels/LevelLoader';
import type { LevelData } from '../levels/types';
import type { Bird } from '../entities/Bird';
import { BombBird } from '../entities/BombBird';
import { SLINGSHOT } from '../physics/constants';
import { HUD } from '../ui/HUD';
import { VictoryScreen } from '../ui/VictoryScreen';
import { GameOverScreen } from '../ui/GameOverScreen';
// LevelSelectScene imported dynamically to avoid circular dependency

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

  // Overlays
  private victoryScreen: VictoryScreen | null = null;
  private gameOverScreen: GameOverScreen | null = null;
  private finalStars: number = 0;

  constructor(levelData: LevelData) {
    this.levelData = levelData;
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
    this.victoryScreen = null;
    this.gameOverScreen = null;

    this.camera.snapTo(this.level.slingshot.anchorX);
    this.loadNextBird();
  }

  exit(): void {
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
  }

  update(dt: number): void {
    this.physics.update(dt);

    // Process collisions
    const events = this.physics.getCollisionEvents();
    this.rulesEngine.processCollisions(
      events,
      this.level.blocks,
      this.level.pigs,
      this.scoreManager
    );

    // Remove destroyed blocks
    for (const block of this.level.blocks) {
      if (block.isDestroyed) {
        this.spawnParticles(block.body.position.x, block.body.position.y, block.material);
        this.physics.removeBody(block.body);
      }
    }
    this.level.blocks = this.level.blocks.filter((b) => !b.isDestroyed);

    // Remove destroyed pigs
    for (const pig of this.level.pigs) {
      if (pig.isDestroyed) {
        this.spawnParticles(pig.body.position.x, pig.body.position.y, 'pig');
        this.physics.removeBody(pig.body);
      }
    }
    this.level.pigs = this.level.pigs.filter((p) => !p.isDestroyed);

    // Set pigs worried when bird is flying
    const isFlying = this.turnManager.state === TurnState.FLYING;
    for (const pig of this.level.pigs) {
      pig.setWorried(isFlying);
    }

    // Camera follows bird in flight
    if (this.turnManager.state === TurnState.FLYING && this.currentBird) {
      this.camera.followBird(this.currentBird.body.position.x);
    }
    this.camera.update();

    // Turn state management
    const allDefeated = this.rulesEngine.allPigsDefeated(this.level.pigs);

    if (this.turnManager.state === TurnState.FLYING && this.currentBird) {
      // Check if bird has gone off screen or is very slow
      const bird = this.currentBird;
      const outOfBounds = bird.body.position.y > GAME_HEIGHT + 100 ||
        bird.body.position.x > GAME_WIDTH * 3 ||
        bird.body.position.x < -200;

      if (outOfBounds) {
        this.turnManager.setState(TurnState.SETTLING);
      }
    }

    this.turnManager.update(
      this.physics,
      allDefeated,
      !this.level.birdQueue.isEmpty()
    );

    // Handle turn transitions
    if (this.turnManager.state === TurnState.NEXT_BIRD) {
      this.nextBirdDelay += dt;
      if (this.nextBirdDelay >= 0.5) {
        this.nextBirdDelay = 0;
        // Remove old bird from physics
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
    }

    if (this.turnManager.state === TurnState.LEVEL_LOST && !this.gameOverScreen) {
      this.gameOverScreen = new GameOverScreen();
    }

    // Update particles
    this.particles = this.particles.filter((p) => {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 400 * dt;
      return p.life > 0;
    });

    // Update explosion effects
    this.explosionEffects = this.explosionEffects.filter((e) => {
      e.time += dt;
      return e.time < e.duration;
    });
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Background sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
    gradient.addColorStop(0, '#4a90d9');
    gradient.addColorStop(0.6, '#87ceeb');
    gradient.addColorStop(1, '#b0e0ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Clouds
    this.renderClouds(ctx);

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

    // Particles
    for (const p of this.particles) {
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2 - this.camera.x, p.y - p.size / 2, p.size, p.size);
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

    // HUD
    this.hud.render(ctx, this.scoreManager.score, this.level.birdQueue);

    // Overlays
    if (this.victoryScreen) {
      this.victoryScreen.render(ctx);
    }
    if (this.gameOverScreen) {
      this.gameOverScreen.render(ctx);
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

    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 100 + Math.random() * 200;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 100,
        size: 3 + Math.random() * 5,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        life: 0.5 + Math.random() * 0.5,
        maxLife: 1,
      });
    }
  }

  onPointerDown(x: number, y: number): void {
    // Check victory/gameover buttons first
    if (this.victoryScreen) {
      const action = this.victoryScreen.handleClick(x, y);
      if (action === 'next') {
        import('../ui/LevelSelectScene').then(({ LevelSelectScene }) => {
          this.game.sceneManager.switchTo(new LevelSelectScene());
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

    // Bomb bird tap to explode during flight
    if (this.turnManager.state === TurnState.FLYING && this.currentBird instanceof BombBird) {
      if (!this.currentBird.hasExploded) {
        this.currentBird.explode(this.physics);
        this.explosionEffects.push({
          x: this.currentBird.body.position.x,
          y: this.currentBird.body.position.y,
          maxRadius: 180,
          time: 0,
          duration: 0.4,
        });
        this.turnManager.setState(TurnState.SETTLING);
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
      this.turnManager.setState(TurnState.FLYING);
    }
  }
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

interface ExplosionEffect {
  x: number;
  y: number;
  maxRadius: number;
  time: number;
  duration: number;
}
