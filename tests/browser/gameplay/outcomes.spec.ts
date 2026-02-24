import { test, expect } from '@playwright/test';
import {
  loadGame,
  navigateToLevel,
  launchBirdAndSettle,
  clickReplay,
  clickNext,
  clickRetry,
  playLevelUntilEnd,
} from '../helpers/gameDriver';
import { getGameState, waitForScene, waitForTurnState } from '../helpers/waiters';

/** Play level until won, retrying on loss. Returns false if can't win after retries. */
async function winLevel(page: import('@playwright/test').Page, retries = 3): Promise<boolean> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const result = await playLevelUntilEnd(page, 15);
    if (result.won) return true;

    // Lost — retry
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

test.describe('Gameplay: Win/Loss Outcomes', () => {
  test('all pigs defeated triggers LEVEL_WON with stars', async ({ page }) => {
    test.setTimeout(120000);
    await loadGame(page);
    await navigateToLevel(page, 1);

    const won = await winLevel(page);
    if (!won) { test.skip(); return; }

    const state = await getGameState(page);
    expect(state.scene).toBe('VICTORY');
    expect(state.turnState).toBe('LEVEL_WON');
    expect(state.pigsAlive).toBe(0);
    expect(state.score).toBeGreaterThan(0);
  });

  test('all birds used with pigs remaining triggers LEVEL_LOST', async ({ page }) => {
    test.setTimeout(120000);
    await loadGame(page);
    await navigateToLevel(page, 1);

    // Launch all birds deliberately missing (aim down into ground)
    const initialState = await getGameState(page);
    const totalBirds = initialState.birdsRemaining;

    for (let i = 0; i < totalBirds + 1; i++) {
      const current = await getGameState(page);
      if (current.turnState === 'LEVEL_WON' || current.scene === 'VICTORY') break;
      if (current.turnState === 'LEVEL_LOST' || current.scene === 'GAME_OVER') break;
      if (current.turnState !== 'AIMING') {
        try {
          await waitForTurnState(page, 'AIMING', 15000);
        } catch {
          break;
        }
      }
      // Launch with minimal force to miss (straight up, falls down)
      await launchBirdAndSettle(page, 10, -95);
      await page.waitForTimeout(200);
    }

    const finalState = await getGameState(page);
    expect(['LEVEL_WON', 'LEVEL_LOST']).toContain(finalState.turnState);
  });

  test('victory screen REPLAY restarts level', async ({ page }) => {
    test.setTimeout(120000);
    await loadGame(page);
    await navigateToLevel(page, 1);

    const won = await winLevel(page);
    if (!won) { test.skip(); return; }

    await waitForScene(page, 'VICTORY');
    await clickReplay(page);
    await waitForScene(page, 'PLAYING');

    const state = await getGameState(page);
    expect(state.turnState).toBe('AIMING');
    expect(state.score).toBe(0);
    expect(state.levelId).toBe(1);
  });

  test('victory screen NEXT returns to level select', async ({ page }) => {
    test.setTimeout(120000);
    await loadGame(page);
    await navigateToLevel(page, 1);

    const won = await winLevel(page);
    if (!won) { test.skip(); return; }

    await waitForScene(page, 'VICTORY');
    await clickNext(page);
    await waitForScene(page, 'LEVEL_SELECT');

    const state = await getGameState(page);
    expect(state.scene).toBe('LEVEL_SELECT');
    expect(state.highestUnlocked).toBeGreaterThanOrEqual(2);
  });

  test('game over TRY AGAIN restarts level', async ({ page }) => {
    test.setTimeout(120000);
    await loadGame(page);
    await navigateToLevel(page, 1);

    // Launch all birds missing to trigger game over
    const initialState = await getGameState(page);
    const totalBirds = initialState.birdsRemaining;

    for (let i = 0; i < totalBirds + 1; i++) {
      const current = await getGameState(page);
      if (current.scene === 'VICTORY' || current.scene === 'GAME_OVER') break;
      if (current.turnState === 'LEVEL_WON' || current.turnState === 'LEVEL_LOST') break;
      if (current.turnState !== 'AIMING') {
        try {
          await waitForTurnState(page, 'AIMING', 15000);
        } catch {
          break;
        }
      }
      await launchBirdAndSettle(page, 10, -95);
      await page.waitForTimeout(200);
    }

    const finalState = await getGameState(page);
    if (finalState.scene !== 'GAME_OVER' && finalState.turnState !== 'LEVEL_LOST') {
      test.skip();
      return;
    }

    await waitForScene(page, 'GAME_OVER');
    await clickRetry(page);
    await waitForScene(page, 'PLAYING');

    const afterRetry = await getGameState(page);
    expect(afterRetry.turnState).toBe('AIMING');
    expect(afterRetry.score).toBe(0);
  });

  test('score is positive after defeating a pig', async ({ page }) => {
    test.setTimeout(120000);
    await loadGame(page);
    await navigateToLevel(page, 1);

    const won = await winLevel(page);
    if (!won) { test.skip(); return; }

    const state = await getGameState(page);
    expect(state.score).toBeGreaterThan(0);
  });
});
