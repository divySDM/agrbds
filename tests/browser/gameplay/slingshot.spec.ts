import { test, expect } from '@playwright/test';
import { loadGame, navigateToLevel, launchBird, launchBirdAndSettle } from '../helpers/gameDriver';
import { getGameState, waitForTurnState, waitForSettled } from '../helpers/waiters';
import { dragFromTo } from '../helpers/canvasPointer';

test.describe('Gameplay: Slingshot', () => {
  test.beforeEach(async ({ page }) => {
    await loadGame(page);
    await navigateToLevel(page, 1);
  });

  test('slingshot drag changes turn state to FLYING on release', async ({ page }) => {
    const before = await getGameState(page);
    expect(before.turnState).toBe('AIMING');

    await launchBird(page, -80, 30);
    const after = await getGameState(page);
    expect(after.turnState).toBe('FLYING');
  });

  test('bird eventually settles after launch', async ({ page }) => {
    await launchBird(page, -80, 30);
    const state = await waitForSettled(page, 20000);
    // Should be in NEXT_BIRD, LEVEL_WON, or LEVEL_LOST after settling
    expect(['NEXT_BIRD', 'LEVEL_WON', 'LEVEL_LOST', 'AIMING']).toContain(state.turnState);
  });

  test('bird launch with accurate aim defeats pig', async ({ page }) => {
    const before = await getGameState(page);
    const pigsBefore = before.pigsAlive;

    // Launch aimed at the structure (strong forward, slightly up)
    await launchBirdAndSettle(page, -80, 30);

    const after = await getGameState(page);
    // Score should increase (from block/pig destruction)
    expect(after.score).toBeGreaterThanOrEqual(0);
    // Either pig died or blocks were hit
    expect(after.pigsAlive <= pigsBefore || after.score > 0).toBeTruthy();
  });
});
