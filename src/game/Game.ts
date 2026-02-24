import { SceneManager } from './SceneManager';
import { GAME_WIDTH, GAME_HEIGHT } from './types';

export class Game {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  readonly sceneManager: SceneManager;

  // Level progress (in-memory, no persistence)
  levelStars: Map<number, number> = new Map();
  highestUnlocked: number = 1;

  private lastTime: number = 0;
  private accumulator: number = 0;
  private readonly fixedDt: number = 1 / 60;
  private running: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get 2d context');
    this.ctx = ctx;

    this.sceneManager = new SceneManager(this);
    this.setupCanvas();
    this.setupInput();
  }

  private setupCanvas(): void {
    this.canvas.width = GAME_WIDTH;
    this.canvas.height = GAME_HEIGHT;
    this.fitToScreen();
    window.addEventListener('resize', () => this.fitToScreen());
  }

  private fitToScreen(): void {
    const ratio = GAME_WIDTH / GAME_HEIGHT;
    let w = window.innerWidth;
    let h = window.innerHeight;

    if (w / h > ratio) {
      w = h * ratio;
    } else {
      h = w / ratio;
    }

    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
  }

  private setupInput(): void {
    const toGameCoords = (e: PointerEvent): { x: number; y: number } => {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: ((e.clientX - rect.left) / rect.width) * GAME_WIDTH,
        y: ((e.clientY - rect.top) / rect.height) * GAME_HEIGHT,
      };
    };

    this.canvas.addEventListener('pointerdown', (e) => {
      const { x, y } = toGameCoords(e);
      this.sceneManager.onPointerDown(x, y);
    });

    this.canvas.addEventListener('pointermove', (e) => {
      const { x, y } = toGameCoords(e);
      this.sceneManager.onPointerMove(x, y);
    });

    this.canvas.addEventListener('pointerup', (e) => {
      const { x, y } = toGameCoords(e);
      this.sceneManager.onPointerUp(x, y);
    });

    this.canvas.addEventListener('pointercancel', (e) => {
      const { x, y } = toGameCoords(e);
      this.sceneManager.onPointerUp(x, y);
    });

    // Prevent context menu on long press
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    // Prevent touch scrolling
    this.canvas.style.touchAction = 'none';
  }

  start(): void {
    this.running = true;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  stop(): void {
    this.running = false;
  }

  private loop = (time: number): void => {
    if (!this.running) return;
    requestAnimationFrame(this.loop);

    const frameTime = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;
    this.accumulator += frameTime;

    while (this.accumulator >= this.fixedDt) {
      this.sceneManager.update(this.fixedDt);
      this.accumulator -= this.fixedDt;
    }

    this.ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.sceneManager.render(this.ctx);
  };

  completeLevel(levelNum: number, stars: number): void {
    const current = this.levelStars.get(levelNum) ?? 0;
    if (stars > current) {
      this.levelStars.set(levelNum, stars);
    }
    if (levelNum + 1 > this.highestUnlocked) {
      this.highestUnlocked = levelNum + 1;
    }
  }
}
