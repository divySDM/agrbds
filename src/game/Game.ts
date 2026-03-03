import { SceneManager } from './SceneManager';
import { GAME_WIDTH, GAME_HEIGHT } from './types';

export class Game {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  readonly sceneManager: SceneManager;

  levelStars: Map<number, number> = new Map();
  highestUnlocked: number = 1;
  private static readonly STORAGE_KEY = 'angrybirds_progress';

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
    this.loadProgress();
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

    // Keyboard input
    window.addEventListener('keydown', (e) => {
      this.sceneManager.onKeyDown(e.key);
    });
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
    this.saveProgress();
  }

  private saveProgress(): void {
    try {
      const data = {
        highestUnlocked: this.highestUnlocked,
        levelStars: Object.fromEntries(this.levelStars),
      };
      localStorage.setItem(Game.STORAGE_KEY, JSON.stringify(data));
    } catch {
      // localStorage unavailable
    }
  }

  private loadProgress(): void {
    try {
      const raw = localStorage.getItem(Game.STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (typeof data.highestUnlocked === 'number') {
        this.highestUnlocked = data.highestUnlocked;
      }
      if (data.levelStars && typeof data.levelStars === 'object') {
        for (const [k, v] of Object.entries(data.levelStars)) {
          if (typeof v === 'number') {
            this.levelStars.set(Number(k), v);
          }
        }
      }
    } catch {
      // Corrupted or unavailable
    }
  }
}
