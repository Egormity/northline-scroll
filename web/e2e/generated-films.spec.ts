import { expect, test } from '@playwright/test';

test('delivers both real generated films and keeps their controls reachable', async ({
  page,
  request,
}) => {
  await page.goto('/');
  for (const film of [
    { id: 'open-water', title: 'Open water', name: 'coast', source: 'coast-flight' },
    { id: 'under-the-canopy', title: 'Under the canopy', name: 'forest', source: 'forest-light' },
  ]) {
    const range = await request.get(`/media/${film.source}.mp4`, {
      headers: { Range: 'bytes=0-1023' },
    });
    expect(range.status()).toBe(206);
    expect((await range.body()).length).toBe(1024);
    await page
      .getByRole('navigation', { name: 'Explore the chapters' })
      .getByRole('link', { name: new RegExp(film.title) })
      .click();
    await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe(film.id);
    const video = page.locator(`[data-film="${film.name}"] video`);
    await expect
      .poll(() => video.evaluate((element: HTMLVideoElement) => element.readyState))
      .toBeGreaterThanOrEqual(2);
    const metadata = await video.evaluate((element: HTMLVideoElement) => ({
      width: element.videoWidth,
      height: element.videoHeight,
      duration: element.duration,
      muted: element.muted,
    }));
    expect(metadata.width).toBe(1280);
    expect(metadata.height).toBe(704);
    expect(metadata.duration).toBeGreaterThan(4.9);
    expect(metadata.duration).toBeLessThan(5.2);
    expect(metadata.muted).toBe(true);
    await expect
      .poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime))
      .toBeGreaterThan(0.1);
    const pause = page.getByRole('button', { name: `Pause ${film.name} film` });
    await pause.focus();
    await pause.press('Enter');
    await expect
      .poll(() => video.evaluate((element: HTMLVideoElement) => element.paused))
      .toBe(true);
    await expect(page.getByRole('button', { name: `Play ${film.name} film` })).toBeFocused();
    await page.screenshot({ path: `.playwright/generated-${film.name}.png` });
  }
});
