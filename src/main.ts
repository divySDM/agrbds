import { Game } from './game/Game';
import { MenuScene } from './ui/MenuScene';
import { LevelScene } from './game/LevelScene';
import { LevelSelectScene } from './ui/LevelSelectScene';
import type { TestGameState, SceneType } from './game/types';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const game = new Game(canvas);
game.sceneManager.switchTo(new MenuScene());
game.start();

// Test instrumentation — DEV mode only, read-only
if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).__AB_TEST_API = {
    unlockAll(): void {
      game.highestUnlocked = 60;
    },
    getState(): TestGameState {
      const scene = game.sceneManager.current;
      const base = {
        highestUnlocked: game.highestUnlocked,
        levelStars: Object.fromEntries(game.levelStars),
      };

      if (scene instanceof LevelScene) {
        return { ...base, ...scene.getTestSnapshot() };
      }

      const result = {
        ...base,
        scene: (scene?.sceneType ?? 'MENU') as SceneType,
        turnState: null as null,
        score: 0,
        pigsAlive: 0,
        birdsRemaining: 0,
        levelId: null as null,
        cameraX: 0,
        slingshotX: 200,
        slingshotY: 600,
        levelSelectPage: scene instanceof LevelSelectScene ? (scene as any).currentPage as number : undefined,
        levelSelectTotalPages: scene instanceof LevelSelectScene ? (scene as any).totalPages as number : undefined,
      };

      return result;
    },
  };
}
