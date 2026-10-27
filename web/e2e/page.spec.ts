import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('smooths real wheel input, preserves anchors and downloads usable notes', async ({ page }) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('request', (request) => {
    if (!request.url().startsWith('http://127.0.0.1:4410')) external.push(request.url());
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /A little\s*further\./ })).toBeVisible();
  await expect(page.locator('html')).toHaveClass(/lenis/);
  await expect
    .poll(() =>
      page.locator('.hero-image').evaluate((image) => (image as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
  await page.screenshot({ path: '.playwright/desktop-hero.png' });
  await page.evaluate(() => {
    const capture = window as unknown as { wheelSamples: number[] };
    capture.wheelSamples = [];
    const end = performance.now() + 1400;
    const record = () => {
      capture.wheelSamples.push(window.scrollY);
      if (performance.now() < end) requestAnimationFrame(record);
    };
    requestAnimationFrame(record);
  });
  await page.mouse.move(1300, 700);
  await page.mouse.wheel(0, 420);
  await page.waitForTimeout(1500);
  const samples = await page.evaluate(
    () => (window as unknown as { wheelSamples: number[] }).wheelSamples,
  );
  expect(new Set(samples.map(Math.round)).size).toBeGreaterThan(5);
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(410);
  expect(await page.evaluate(() => scrollY)).toBeLessThan(430);
  await page.mouse.wheel(0, -180);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(260);
  await page.waitForTimeout(600);
  const beforeKey = await page.evaluate(() => scrollY);
  await page.keyboard.press('PageDown');
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(beforeKey + 100);

  await page.getByRole('link', { name: 'Notes to take', exact: true }).click();
  await expect(page).toHaveURL(/#field-notes$/);
  await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe('field-notes');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Download the field notes/ }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('northline-field-notes.txt');
  const notes = await readFile((await download.path())!, 'utf8');
  expect(notes).toContain('fictional field journal');
  expect(notes).toContain('A PAGE FOR YOUR OWN NOTES');
  await page.getByRole('button', { name: 'Reduce motion', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  await expect(page.locator('html')).not.toHaveClass(/lenis/);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});

test('honors reduced motion before loading film and responds to live preference changes', async ({
  page,
}) => {
  const videoRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().endsWith('journey.mp4')) videoRequests.push(request.url());
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  await expect(
    page.getByRole('button', { name: 'Reduced motion follows your system preference' }),
  ).toBeDisabled();
  await expect(page.locator('html')).not.toHaveClass(/lenis/);
  expect(videoRequests).toEqual([]);
  await expect(page.locator('#story')).toBeVisible();
  const size = await page.locator('#story').boundingBox();
  expect(size!.height).toBeLessThan(1600);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'full');
  await expect(page.locator('html')).toHaveClass(/lenis/);
});

test('keeps a narrow viewport readable with native scrolling and a lighter film chapter', async ({
  page,
}) => {
  const videoRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().endsWith('journey.mp4')) videoRequests.push(request.url());
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /A little\s*further\./ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  expect(videoRequests).toEqual([]);
  await page.getByRole('link', { name: /Begin the journey/ }).click();
  await expect(page).toHaveURL(/#story$/);
  await expect(page.locator('#story')).toBeVisible();
  await page.locator('#field-notes').scrollIntoViewIfNeeded();
  await expect(page.getByRole('button', { name: /Download the field notes/ })).toBeVisible();
  await page.screenshot({ path: '.playwright/mobile-page.png', fullPage: true });
});
