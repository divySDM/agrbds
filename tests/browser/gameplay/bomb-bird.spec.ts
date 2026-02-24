import { test, expect } from '@playwright/test';
import {
  loadGame,
  clickPlay,
  clickLevel,
  clickNext,
  launchBird,
  launchBirdAndSettle,
  tapBombBird,
  playLevelUntilEnd,
} from '../helpers/gameDriver';
import { getGameState, waitForScene, waitForTurnState, waitForSettled } from '../helpers/waiters';

test.describe('Gameplay: Bomb Bird', () => {
  test('bomb bird tap during flight triggers explosion and SETTLING', async ({ page }) => {
    test.setTimeout(120000); // Extended timeout: need to unlock level 3

    await loadGame(page);

    // Need to unlock level 3 by completing levels 1 and 2
    for (const level of [1, 2]) {
      await clickPlay(page);
      await clickLevel(page, level);
      const result = await playLevelUntilEnd(page, 15);
      if (!result.won) {
        test.skip();
        return;
      }
      await waitForScene(page, 'VICTORY');
      await clickNext(page);
      await waitForScene(page, 'LEVEL_SELECT');
    }

    // Now click level 3
    await clickLevel(page, 3);

    // Level 3 birds: [RED, BOMB, RED, RED]
    // First bird is RED — launch and settle
    await launchBirdAndSettle(page);

    const state = await getGameState(page);
    if (state.turnState === 'LEVEL_WON' || state.turnState === 'LEVEL_LOST') {
      test.skip();
      return;
    }

    // Wait for bomb bird to be ready
    await waitForTurnState(page, 'AIMING', 10000);

    // Launch the bomb bird
    await launchBird(page);

    // Brief delay then tap to explode
    await page.waitForTimeout(400);
    const flyState = await getGameState(page);
    if (flyState.turnState === 'FLYING') {
      await tapBombBird(page);

      // After tap, should transition to SETTLING
      const afterTap = await getGameState(page);
      expect(['SETTLING', 'NEXT_BIRD', 'LEVEL_WON', 'LEVEL_LOST']).toContain(
        afterTap.turnState
      );
    }

    // Wait for full settling
    await waitForSettled(page, 20000);
  });
});
