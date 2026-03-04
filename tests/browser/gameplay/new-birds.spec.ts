import { test, expect } from '@playwright/test';
import { loadGame, clickPlay, clickLevel, clickNextPage, launchBird } from '../helpers/gameDriver';
import { getGameState } from '../helpers/waiters';
import { clickAt } from '../helpers/canvasPointer';

/** Unlock all levels via the test API. */
async function unlockAllLevels(page: import('@playwright/test').Page): Promise<void> {
  await page.evaluate(() => (window as any).__AB_TEST_API.unlockAll());
}

test.describe('New Birds: Blue, White, Big', () => {
  test.beforeEach(async ({ page }) => {
    await loadGame(page);
    await unlockAllLevels(page);
  });

  test('navigate to page 3 and load level 41 (Blue Bird)', async ({ page }) => {
    await clickPlay(page);
    // Navigate to page 3 (index 2)
    await clickNextPage(page);
    await clickNextPage(page);
    const state = await getGameState(page);
    expect(state.levelSelectPage).toBe(2);

    // Click level 41 (first on page 3)
    await clickLevel(page, 1);
    const playState = await getGameState(page);
    expect(playState.scene).toBe('PLAYING');
    expect(playState.levelId).toBe(41);
  });

  test('Blue Bird split ability creates spawned projectiles', async ({ page }) => {
    await clickPlay(page);
    await clickNextPage(page);
    await clickNextPage(page);
    await clickLevel(page, 1); // Level 41

    // Launch bird
    await launchBird(page);

    // Tap to split
    await page.waitForTimeout(400);
    await clickAt(page, 640, 360);
    await page.waitForTimeout(300);

    const state = await getGameState(page);
    expect(state.abilityUsed).toBe(true);
    expect(state.spawnedProjectiles).toBeGreaterThanOrEqual(2);
  });

  test('White Bird drops egg on tap', async ({ page }) => {
    await clickPlay(page);
    await clickNextPage(page);
    await clickNextPage(page);
    await clickLevel(page, 3); // Level 43 (Egg Drop 101)

    // Launch bird
    await launchBird(page);

    // Tap to drop egg
    await page.waitForTimeout(400);
    await clickAt(page, 640, 360);
    await page.waitForTimeout(300);

    const state = await getGameState(page);
    expect(state.abilityUsed).toBe(true);
  });

  test('Big Bird level loads with correct bird count', async ({ page }) => {
    await clickPlay(page);
    await clickNextPage(page);
    await clickNextPage(page);
    await clickLevel(page, 5); // Level 45 (Heavy Lesson)

    const state = await getGameState(page);
    expect(state.scene).toBe('PLAYING');
    expect(state.levelId).toBe(45);
    expect(state.birdsRemaining).toBe(2); // 3 total minus 1 current bird loaded
  });
});
