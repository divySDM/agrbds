import type { Page } from '@playwright/test';

export interface TestGameState {
  scene: string;
  turnState: string | null;
  score: number;
  pigsAlive: number;
  birdsRemaining: number;
  levelId: number | null;
  highestUnlocked: number;
  levelStars: Record<number, number>;
  cameraX: number;
  slingshotX: number;
  slingshotY: number;
}

/** Get the current game state snapshot from the test API. */
export async function getGameState(page: Page): Promise<TestGameState> {
  return page.evaluate(() => {
    const api = (window as unknown as Record<string, { getState(): TestGameState }>).__AB_TEST_API;
    if (!api) throw new Error('__AB_TEST_API not available');
    return api.getState();
  });
}

/** Wait until the game reaches a specific scene type. */
export async function waitForScene(
  page: Page,
  sceneType: string,
  timeout = 10000
): Promise<TestGameState> {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const state = await getGameState(page);
    if (state.scene === sceneType) return state;
    await page.waitForTimeout(100);
  }
  const final = await getGameState(page);
  throw new Error(
    `Timed out waiting for scene "${sceneType}" (current: "${final.scene}") after ${timeout}ms`
  );
}

/** Wait until the turn reaches a specific state. */
export async function waitForTurnState(
  page: Page,
  turnState: string,
  timeout = 15000
): Promise<TestGameState> {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const state = await getGameState(page);
    if (state.turnState === turnState) return state;
    await page.waitForTimeout(100);
  }
  const final = await getGameState(page);
  throw new Error(
    `Timed out waiting for turnState "${turnState}" (current: "${final.turnState}") after ${timeout}ms`
  );
}

/** Wait until all pigs are defeated (pigsAlive === 0). */
export async function waitForPigsDefeated(
  page: Page,
  timeout = 15000
): Promise<TestGameState> {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const state = await getGameState(page);
    if (state.pigsAlive === 0) return state;
    await page.waitForTimeout(100);
  }
  const final = await getGameState(page);
  throw new Error(
    `Timed out waiting for pigs defeated (pigsAlive: ${final.pigsAlive}) after ${timeout}ms`
  );
}

/** Wait for settling to complete (turn moves past SETTLING). */
export async function waitForSettled(
  page: Page,
  timeout = 15000
): Promise<TestGameState> {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const state = await getGameState(page);
    if (
      state.turnState !== 'FLYING' &&
      state.turnState !== 'SETTLING'
    ) {
      return state;
    }
    await page.waitForTimeout(100);
  }
  const final = await getGameState(page);
  throw new Error(
    `Timed out waiting for settled (turnState: "${final.turnState}") after ${timeout}ms`
  );
}

/** Wait for the camera to return near the slingshot (cameraX < threshold). */
export async function waitForCameraReturn(
  page: Page,
  threshold = 20,
  timeout = 5000
): Promise<void> {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const state = await getGameState(page);
    if (state.cameraX < threshold) return;
    await page.waitForTimeout(50);
  }
}
