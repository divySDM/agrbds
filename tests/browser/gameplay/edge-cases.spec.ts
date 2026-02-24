import { test, expect } from '@playwright/test';
import {
  loadGame,
  navigateToLevel,
  launchBirdAndSettle,
  clickReplay,
  playLevelUntilEnd,
} from '../helpers/gameDriver';
import { clickAt } from '../helpers/canvasPointer';
import { getGameState, waitForScene, waitForTurnState, waitForSettled } from '../helpers/waiters';

test.describe('Edge Cases: Robustness', () => {
  test('rapid pointer events do not crash game', async ({ page }) => {
    await loadGame(page);
    await navigateToLevel(page, 1);

    // Rapid clicks all over the canvas
    for (let i = 0; i < 20; i++) {
      const x = 100 + Math.random() * 1080;
      const y = 100 + Math.random() * 520;
      await clickAt(page, x, y);
    }

    // Game should still be responsive
    const state = await getGameState(page);
    expect(state.scene).toBeDefined();
    expect(['PLAYING', 'VICTORY', 'GAME_OVER']).toContain(state.scene);
  });

  test('retry/replay loop works stably', async ({ page }) => {
    test.setTimeout(180000);
    await loadGame(page);
    await navigateToLevel(page, 1);

    for (let attempt = 0; attempt < 3; attempt++) {
      const result = await playLevelUntilEnd(page);

      if (result.won) {
        await waitForScene(page, 'VICTORY');
        await clickReplay(page);
        await waitForScene(page, 'PLAYING');
      } else {
        await waitForScene(page, 'GAME_OVER');
        const { clickRetry } = await import('../helpers/gameDriver');
        await clickRetry(page);
        await waitForScene(page, 'PLAYING');
      }

      const state = await getGameState(page);
      expect(state.turnState).toBe('AIMING');
      expect(state.score).toBe(0);
      expect(state.levelId).toBe(1);
    }
  });

  test('bird going out of bounds transitions to SETTLING', async ({ page }) => {
    await loadGame(page);
    await navigateToLevel(page, 1);

    // Launch bird straight up with maximum power to go out of bounds
    await launchBirdAndSettle(page, -5, -100);

    const state = await getGameState(page);
    // Bird should have settled after going out of bounds
    expect(['NEXT_BIRD', 'AIMING', 'LEVEL_WON', 'LEVEL_LOST']).toContain(state.turnState);
  });

  test('repeated pointer down/up without drag does not crash', async ({ page }) => {
    await loadGame(page);
    await navigateToLevel(page, 1);

    // Click on various spots without dragging the slingshot
    await clickAt(page, 640, 360);
    await clickAt(page, 100, 100);
    await clickAt(page, 1200, 600);

    const state = await getGameState(page);
    expect(state.turnState).toBe('AIMING');
    expect(state.scene).toBe('PLAYING');
  });
});
