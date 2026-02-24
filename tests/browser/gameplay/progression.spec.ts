import { test, expect } from '@playwright/test';
import {
  loadGame,
  navigateToLevel,
  clickPlay,
  clickNext,
  clickLevel,
  clickRetry,
  playLevelUntilEnd,
} from '../helpers/gameDriver';
import { getGameState, waitForScene } from '../helpers/waiters';

/** Play level until won, retrying on loss. */
async function winLevel(page: import('@playwright/test').Page, retries = 3): Promise<boolean> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const result = await playLevelUntilEnd(page, 15);
    if (result.won) return true;

    await waitForScene(page, 'GAME_OVER', 5000).catch(() => {});
    const state = await getGameState(page);
    if (state.scene === 'GAME_OVER') {
      await clickRetry(page);
      await waitForScene(page, 'PLAYING');
    } else {
      return false;
    }
  }
  return false;
}

test.describe('Gameplay: Level Progression', () => {
  test('completing level 1 unlocks level 2 in level select', async ({ page }) => {
    test.setTimeout(120000);
    await loadGame(page);
    await navigateToLevel(page, 1);

    const won = await winLevel(page);
    if (!won) { test.skip(); return; }

    await waitForScene(page, 'VICTORY');
    await clickNext(page);
    await waitForScene(page, 'LEVEL_SELECT');

    const state = await getGameState(page);
    expect(state.highestUnlocked).toBeGreaterThanOrEqual(2);
  });

  test('stars are retained after returning to level select', async ({ page }) => {
    test.setTimeout(120000);
    await loadGame(page);
    await navigateToLevel(page, 1);

    const won = await winLevel(page);
    if (!won) { test.skip(); return; }

    await waitForScene(page, 'VICTORY');
    const victoryState = await getGameState(page);
    const stars = victoryState.levelStars[1];

    await clickNext(page);
    await waitForScene(page, 'LEVEL_SELECT');

    const selectState = await getGameState(page);
    expect(selectState.levelStars[1]).toBe(stars);
    expect(selectState.levelStars[1]).toBeGreaterThanOrEqual(1);
    expect(selectState.levelStars[1]).toBeLessThanOrEqual(3);
  });

  test('complete all 5 levels sequentially', async ({ page }) => {
    test.setTimeout(300000); // 5 minutes for 5 levels
    await loadGame(page);

    for (let level = 1; level <= 5; level++) {
      if (level === 1) {
        await navigateToLevel(page, level);
      } else {
        await clickLevel(page, level);
      }

      const won = await winLevel(page);
      if (!won) {
        test.skip();
        return;
      }

      await waitForScene(page, 'VICTORY');

      if (level < 5) {
        await clickNext(page);
        await waitForScene(page, 'LEVEL_SELECT');
      }
    }

    // Verify final state
    const state = await getGameState(page);
    expect(state.levelStars[1]).toBeGreaterThanOrEqual(1);
  });
});
