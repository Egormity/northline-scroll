import { expect, test } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

test('presents the requested video frames in both scroll directions and serves byte ranges', async ({ page, request }) => {
  const range = await request.get('/media/journey.mp4', { headers: { Range: 'bytes=1000-1999' } });
  expect(range.status()).toBe(206);
  expect(range.headers()['content-range']).toMatch(/^bytes 1000-1999\/\d+$/);
  expect((await range.body()).byteLength).toBe(1000);
  const manifest = await (await request.get('/media/journey.json')).json();
  await page.goto('/');
  await page.getByRole('link', { name: 'The story', exact: true }).click();
  await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe('story');
  const video = page.locator('#story video');
  await expect(video).toBeVisible();
  await expect(video).toHaveClass('is-ready');
  await expect.poll(() => video.evaluate((element) => (element as HTMLVideoElement).readyState)).toBeGreaterThanOrEqual(2);
  const bounds = await page.locator('#story').evaluate((element) => ({
    top: element.getBoundingClientRect().top + scrollY,
    travel: element.getBoundingClientRect().height - element.querySelector<HTMLElement>('[data-stage]')!.offsetHeight,
  }));
  expect(bounds.travel).toBeGreaterThan(500);
  const measurements = [];
  for (const progress of [0.17, 0.72, 0.31, 0.9]) {
    await page.evaluate(({ top }) => window.scrollTo({ top, behavior: 'instant' }), { top: bounds.top + bounds.travel * progress });
    const expectedTime = Math.round(progress * (manifest.frameCount - 1)) / manifest.fps;
    await expect.poll(async () => Math.abs(Number(await video.getAttribute('data-presented-time')) - expectedTime)).toBeLessThan(0.06);
    measurements.push(await video.evaluate((element) => ({
      targetFrame: Number(element.dataset.targetFrame),
      presentedTime: Number(element.dataset.presentedTime),
      seekMs: Number(element.dataset.seekMs),
      currentTime: (element as HTMLVideoElement).currentTime,
      presentedFrames: Number(element.dataset.presentedFrames),
    })));
  }
  expect(measurements[2].presentedTime).toBeLessThan(measurements[1].presentedTime);
  expect(measurements.at(-1)!.presentedFrames).toBeGreaterThanOrEqual(4);
  const settled = await video.evaluate((element) => ({ frame: element.dataset.targetFrame, time: (element as HTMLVideoElement).currentTime }));
  await page.waitForTimeout(400);
  expect(await video.evaluate((element) => ({ frame: element.dataset.targetFrame, time: (element as HTMLVideoElement).currentTime }))).toEqual(settled);
  await writeFile('.playwright/video-validation.json', JSON.stringify({ manifest, measurements }, null, 2));
  await page.screenshot({ path: '.playwright/desktop-film.png' });
});

test('moves the photo rail, opens a keyboard-accessible photograph, and restores scrolling', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Field journal', exact: true }).click();
  await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe('journal');
  const rail = page.locator('.gallery-rail');
  const before = await rail.evaluate((element) => element.style.transform);
  await page.getByRole('button', { name: 'Next journal image', exact: true }).click();
  await expect.poll(() => rail.evaluate((element) => element.style.transform)).not.toBe(before);
  await page.waitForTimeout(700);
  const photograph = page.getByRole('button', { name: /^Open photograph:/ }).nth(1);
  await photograph.focus();
  const box = (await photograph.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(1601);
  await photograph.press('Enter');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const title = await dialog.getByRole('heading').innerText();
  await page.keyboard.press('ArrowRight');
  await expect(dialog.getByRole('heading')).not.toHaveText(title);
  const lockedY = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(250);
  expect(await page.evaluate(() => scrollY)).toBe(lockedY);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(photograph).toBeFocused();
  await expect(page.locator('html')).not.toHaveClass(/lenis-stopped/);
  await page.mouse.move(1400, 800);
  const beforeWheel = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 200);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(beforeWheel + 50);
  await page.screenshot({ path: '.playwright/desktop-journal.png' });
});

test('keeps the poster and reading content when film loading fails', async ({ page }) => {
  await page.route('**/media/journey.mp4', (route) => route.abort());
  await page.goto('/');
  await page.getByRole('link', { name: 'The story', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Retry the film', exact: true })).toBeVisible();
  await expect(page.locator('.journey-poster')).toBeVisible();
  await expect.poll(() => page.locator('.journey-poster').evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Reduce motion', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'One landscape. A slower pace.' })).toBeVisible();
  await expect(page.locator('#story video')).toHaveCount(0);
});
