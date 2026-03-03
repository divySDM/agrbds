import type { Page } from '@playwright/test';
import { clickAt, dragFromTo } from './canvasPointer';
import { waitForScene, waitForTurnState, waitForSettled, waitForCameraReturn, getGameState } from './waiters';

// Button coordinates (in game space 1280×720)
const PLAY_BUTTON = { x: 640, y: 430 };

// Level select layout (must match LevelSelectScene.ts: btnSize=80, gap=20, cols=5, startY=180)
const LEVEL_BTN_SIZE = 80;
const LEVEL_BTN_GAP = 20;
const LEVEL_COLS = 5;
const LEVEL_TOTAL_W = LEVEL_COLS * LEVEL_BTN_SIZE + (LEVEL_COLS - 1) * LEVEL_BTN_GAP;
const LEVEL_START_X = (1280 - LEVEL_TOTAL_W) / 2 + LEVEL_BTN_SIZE / 2;
const LEVEL_START_Y = 180;

// Slingshot coordinates
const SLINGSHOT_ANCHOR_X = 200;
const SLINGSHOT_ANCHOR_Y = 480;
const BIRD_REST_Y = SLINGSHOT_ANCHOR_Y - 40;

// Victory overlay buttons (from VictoryScreen.ts)
const VICTORY_REPLAY_BTN = { x: 640 - 105, y: (720 - 350) / 2 + 280 };
const VICTORY_NEXT_BTN = { x: 640 + 105, y: (720 - 350) / 2 + 280 };

// Game over button
const GAME_OVER_RETRY_BTN = { x: 640, y: (720 - 250) / 2 + 190 };

// Back button on level select
const BACK_BUTTON = { x: 100, y: 720 - 55 };

/** Navigate to the game and wait for it to load. */
export async function loadGame(page: Page): Promise<void> {
  await page.goto('/');
  // Wait for the test API to be available
  await page.waitForFunction(
    () => (window as unknown as Record<string, unknown>).__AB_TEST_API !== undefined,
    { timeout: 10000 }
  );
  await waitForScene(page, 'MENU');
}

/** Click the PLAY button on the menu. */
export async function clickPlay(page: Page): Promise<void> {
  await clickAt(page, PLAY_BUTTON.x, PLAY_BUTTON.y);
  await waitForScene(page, 'LEVEL_SELECT');
}

/** Click a level button (1-indexed, on the current page). */
export async function clickLevel(page: Page, levelNum: number): Promise<void> {
  // levelNum is 1-indexed within the current page
  const idx = levelNum - 1;
  const col = idx % LEVEL_COLS;
  const row = Math.floor(idx / LEVEL_COLS);
  const x = LEVEL_START_X + col * (LEVEL_BTN_SIZE + LEVEL_BTN_GAP);
  const y = LEVEL_START_Y + row * (LEVEL_BTN_SIZE + LEVEL_BTN_GAP);
  await clickAt(page, x, y);
  await waitForScene(page, 'PLAYING');
  await waitForTurnState(page, 'AIMING');
}

/** Click the BACK button on level select. */
export async function clickBack(page: Page): Promise<void> {
  await clickAt(page, BACK_BUTTON.x, BACK_BUTTON.y);
  await waitForScene(page, 'MENU');
}

// Page navigation buttons (based on actual game layout: btnSize=80, gap=20, 5 cols)
const GAME_BTN_SIZE = 80;
const GAME_BTN_GAP = 20;
const GAME_TOTAL_W = 5 * GAME_BTN_SIZE + 4 * GAME_BTN_GAP;
const ARROW_SIZE = 40;
const ARROW_Y = 180 + 2 * (GAME_BTN_SIZE + GAME_BTN_GAP); // Same calc as LevelSelectScene
const RIGHT_ARROW_X = (1280 + GAME_TOTAL_W) / 2 + 15 + ARROW_SIZE / 2;
const LEFT_ARROW_X = (1280 - GAME_TOTAL_W) / 2 - ARROW_SIZE - 15 + ARROW_SIZE / 2;

/** Click the right arrow to go to next page in level select. */
export async function clickNextPage(page: Page): Promise<void> {
  await clickAt(page, RIGHT_ARROW_X, ARROW_Y);
  // Small delay for page to update
  await page.waitForTimeout(200);
}

/** Click the left arrow to go to previous page in level select. */
export async function clickPrevPage(page: Page): Promise<void> {
  await clickAt(page, LEFT_ARROW_X, ARROW_Y);
  await page.waitForTimeout(200);
}

/** Navigate from menu to a specific level. */
export async function navigateToLevel(page: Page, levelNum: number): Promise<void> {
  await clickPlay(page);
  await clickLevel(page, levelNum);
}

/**
 * Launch a bird from the slingshot by dragging backward and releasing.
 * dragBackX/dragBackY are relative offsets (negative X = pull left, positive Y = pull down).
 */
export async function launchBird(
  page: Page,
  dragBackX = -95,
  dragBelowAnchor = 60
): Promise<void> {
  // Wait for camera to return near slingshot before attempting to drag
  await waitForCameraReturn(page, 50, 8000);

  // Get current game state for dynamic slingshot position and camera
  const state = await getGameState(page);
  const camX = state.cameraX ?? 0;
  const slingshotX = state.slingshotX ?? 200;
  const slingshotY = state.slingshotY ?? 600;
  const birdRestY = slingshotY - 40;

  // Bird position in screen space (accounting for camera)
  const fromX = slingshotX - camX;
  const fromY = birdRestY;
  // Drag target: relative to anchor, not bird. Convert to bird-relative.
  const toX = fromX + dragBackX;
  const toY = slingshotY + dragBelowAnchor;

  // Validate coordinates are within reasonable bounds
  if (!Number.isFinite(fromX) || !Number.isFinite(fromY)) {
    throw new Error(
      `Invalid launch coordinates: from=(${fromX}, ${fromY}) cameraX=${camX} slingshot=(${slingshotX},${slingshotY})`
    );
  }

  await dragFromTo(page, fromX, fromY, toX, toY);
  // Wait for bird to enter FLYING state
  await waitForTurnState(page, 'FLYING', 5000);
}

/** Launch bird and wait for the turn to fully settle. */
export async function launchBirdAndSettle(
  page: Page,
  dragBackX = -95,
  dragBelowAnchor = 60
): Promise<void> {
  await launchBird(page, dragBackX, dragBelowAnchor);
  await waitForSettled(page, 20000);
}

/** Tap the screen to trigger bomb bird explosion (during FLYING). */
export async function tapBombBird(page: Page): Promise<void> {
  // Tap in the middle area of the screen
  await clickAt(page, 640, 360);
}

/** Click the REPLAY button on victory screen. */
export async function clickReplay(page: Page): Promise<void> {
  await clickAt(page, VICTORY_REPLAY_BTN.x, VICTORY_REPLAY_BTN.y);
}

/** Click the NEXT button on victory screen. */
export async function clickNext(page: Page): Promise<void> {
  await clickAt(page, VICTORY_NEXT_BTN.x, VICTORY_NEXT_BTN.y);
}

/** Click the TRY AGAIN button on game over screen. */
export async function clickRetry(page: Page): Promise<void> {
  await clickAt(page, GAME_OVER_RETRY_BTN.x, GAME_OVER_RETRY_BTN.y);
}

/**
 * Complete a level by repeatedly launching birds until victory or loss.
 * Uses a strong forward launch angle aimed at the structure.
 * Returns the final game state.
 */
export async function playLevelUntilEnd(
  page: Page,
  maxShots = 10
): Promise<{ won: boolean }> {
  for (let shot = 0; shot < maxShots; shot++) {
    // Check for end conditions first
    const state = await getGameState(page);
    if (isWon(state)) return { won: true };
    if (isLost(state)) return { won: false };
    // If we're no longer in a playing scene, bail
    if (state.scene !== 'PLAYING') return { won: false };

    // Wait for AIMING if needed
    if (state.turnState !== 'AIMING') {
      const deadline = Date.now() + 15000;
      while (Date.now() < deadline) {
        const s = await getGameState(page);
        if (isWon(s)) return { won: true };
        if (isLost(s)) return { won: false };
        if (s.turnState === 'AIMING') break;
        await page.waitForTimeout(100);
      }
    }

    // Re-check after waiting
    const prelaunch = await getGameState(page);
    if (isWon(prelaunch)) return { won: true };
    if (isLost(prelaunch)) return { won: false };
    if (prelaunch.turnState !== 'AIMING') continue;

    // Launch and wait for settle
    try {
      await launchBirdAndSettle(page);
    } catch {
      // If launch fails, check if level ended
      const s = await getGameState(page);
      if (isWon(s)) return { won: true };
      if (isLost(s)) return { won: false };
      continue;
    }

    // Wait a bit for state transitions (LEVEL_WON/LEVEL_LOST detection)
    await page.waitForTimeout(500);
  }

  const finalState = await getGameState(page);
  return { won: isWon(finalState) };
}

function isWon(state: { scene: string; turnState: string | null }): boolean {
  return state.scene === 'VICTORY' || state.turnState === 'LEVEL_WON';
}

function isLost(state: { scene: string; turnState: string | null }): boolean {
  return state.scene === 'GAME_OVER' || state.turnState === 'LEVEL_LOST';
}
