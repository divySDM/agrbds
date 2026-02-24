import type { Page } from '@playwright/test';

const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;

/**
 * Converts logical game coordinates (1280×720) to page coordinates
 * accounting for CSS scaling and canvas positioning.
 */
async function toPageCoords(
  page: Page,
  gameX: number,
  gameY: number
): Promise<{ x: number; y: number }> {
  const rect = await page.locator('#game-canvas').boundingBox();
  if (!rect) throw new Error('Canvas not found');
  return {
    x: rect.x + (gameX / GAME_WIDTH) * rect.width,
    y: rect.y + (gameY / GAME_HEIGHT) * rect.height,
  };
}

/** Click at a game coordinate. */
export async function clickAt(page: Page, gameX: number, gameY: number): Promise<void> {
  const { x, y } = await toPageCoords(page, gameX, gameY);
  await page.mouse.click(x, y);
}

/** Pointer drag from one game coordinate to another. */
export async function dragFromTo(
  page: Page,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  steps = 10
): Promise<void> {
  const from = await toPageCoords(page, fromX, fromY);
  const to = await toPageCoords(page, toX, toY);

  await page.mouse.move(from.x, from.y);
  await page.mouse.down();

  // Move in steps for smooth drag
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const mx = from.x + (to.x - from.x) * t;
    const my = from.y + (to.y - from.y) * t;
    await page.mouse.move(mx, my);
  }

  await page.mouse.up();
}
