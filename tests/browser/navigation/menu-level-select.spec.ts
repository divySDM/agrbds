import { test, expect } from '@playwright/test';
import { loadGame, clickPlay, clickLevel, clickBack } from '../helpers/gameDriver';
import { getGameState, waitForScene } from '../helpers/waiters';

test.describe('Navigation: Menu and Level Select', () => {
  test.beforeEach(async ({ page }) => {
    await loadGame(page);
  });

  test('game loads and displays MenuScene', async ({ page }) => {
    const state = await getGameState(page);
    expect(state.scene).toBe('MENU');
  });

  test('clicking PLAY transitions to LevelSelectScene', async ({ page }) => {
    await clickPlay(page);
    const state = await getGameState(page);
    expect(state.scene).toBe('LEVEL_SELECT');
  });

  test('level select shows 5 levels with level 1 unlocked', async ({ page }) => {
    await clickPlay(page);
    const state = await getGameState(page);
    expect(state.scene).toBe('LEVEL_SELECT');
    expect(state.highestUnlocked).toBe(1);
  });

  test('clicking level 1 transitions to PLAYING with AIMING state', async ({ page }) => {
    await clickPlay(page);
    await clickLevel(page, 1);
    const state = await getGameState(page);
    expect(state.scene).toBe('PLAYING');
    expect(state.turnState).toBe('AIMING');
    expect(state.levelId).toBe(1);
    expect(state.pigsAlive).toBeGreaterThan(0);
    expect(state.birdsRemaining).toBeGreaterThan(0);
  });

  test('back button returns to MenuScene', async ({ page }) => {
    await clickPlay(page);
    await waitForScene(page, 'LEVEL_SELECT');
    await clickBack(page);
    const state = await getGameState(page);
    expect(state.scene).toBe('MENU');
  });
});
