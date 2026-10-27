import { expect, test } from '@playwright/test';

test('traces the route in both directions and restores every chapter in motion-off mode', async ({
  page,
}) => {
  await page.goto('/');
  const route = page.locator('#the-route');
  const setRouteProgress = async (progress: number) => {
    await route.evaluate((element, value) => {
      const stage = element.querySelector<HTMLElement>('[data-stage]')!;
      window.scrollTo({
        top:
          element.getBoundingClientRect().top +
          window.scrollY +
          (element.clientHeight - stage.clientHeight) * value,
        behavior: 'instant',
      });
    }, progress);
  };
  await setRouteProgress(0.1);
  const routeLine = page.locator('.route-line');
  await expect
    .poll(() =>
      routeLine.evaluate((element) => parseFloat(getComputedStyle(element).strokeDashoffset)),
    )
    .toBeGreaterThan(0.7);
  const lastStop = page.getByRole('button', { name: 'A place to pause', exact: true });
  await lastStop.focus();
  await lastStop.press('Enter');
  await expect(lastStop).toHaveAttribute('aria-current', 'step');
  await expect(lastStop).toBeFocused();
  await expect
    .poll(() =>
      routeLine.evaluate((element) => parseFloat(getComputedStyle(element).strokeDashoffset)),
    )
    .toBeLessThan(0.04);
  await page.screenshot({ path: '.playwright/extended-route.png' });
  await page.mouse.move(1300, 650);
  await page.mouse.wheel(0, -1200);
  await expect
    .poll(() =>
      routeLine.evaluate((element) => parseFloat(getComputedStyle(element).strokeDashoffset)),
    )
    .toBeGreaterThan(0.7);

  await expect(page.locator('html')).not.toHaveClass(/lenis-scrolling/);
  const forest = page.locator('#under-the-canopy');
  await page
    .getByRole('navigation', { name: 'Explore the chapters' })
    .getByRole('link', { name: /Under the canopy/ })
    .click();
  await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe('under-the-canopy');
  await expect(forest).toHaveClass(/is-unfolding/);
  const initial = await page
    .locator('.forest-mote')
    .first()
    .evaluate((element) => getComputedStyle(element).transform);
  await page.mouse.wheel(0, 650);
  await expect
    .poll(() =>
      page
        .locator('.forest-mote')
        .first()
        .evaluate((element) => getComputedStyle(element).transform),
    )
    .not.toBe(initial);
  await page.screenshot({ path: '.playwright/extended-forest.png' });
  const fullHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.getByRole('button', { name: 'Reduce motion', exact: true }).click();
  await expect(route).not.toHaveClass(/is-tracing/);
  await expect(forest).not.toHaveClass(/is-unfolding/);
  await expect(page.locator('video')).toHaveCount(0);
  await expect(page.locator('.forest-mote')).toHaveCount(0);
  await expect
    .poll(() =>
      routeLine.evaluate((element) => parseFloat(getComputedStyle(element).strokeDashoffset)),
    )
    .toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThan(
    fullHeight - 1000,
  );
  for (const heading of [
    'Less noise. More sky. A little room to feel far away.',
    /Not every route\s*needs a destination\./,
    /Let the world\s*get a little wider\./,
    /A quieter\s*kind of wonder\./,
  ]) {
    await expect(page.getByRole('heading', { name: heading })).toHaveCount(1);
  }
});

test('ambient films play only while visible and retain user pause', async ({ page }) => {
  // Exercise playback ownership with an existing valid local clip independently of a provider.
  await page.route('**/media/coast-flight.mp4', async (route) => {
    const response = await route.fetch({ url: 'http://127.0.0.1:4410/media/journey.mp4' });
    await route.fulfill({ response });
  });
  await page.goto('/');
  await expect(page.locator('[data-film="coast"] video')).toHaveCount(0);
  await page.locator('#open-water').scrollIntoViewIfNeeded();
  const film = page.locator('[data-film="coast"] video');
  await expect.poll(() => film.evaluate((element: HTMLVideoElement) => element.paused)).toBe(false);
  await page.getByRole('button', { name: 'Pause coast film' }).click();
  await expect.poll(() => film.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  await page.locator('#a-little-room').scrollIntoViewIfNeeded();
  await page.locator('#open-water').scrollIntoViewIfNeeded();
  await expect.poll(() => film.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  await page.getByRole('button', { name: 'Play coast film' }).click();
  await expect.poll(() => film.evaluate((element: HTMLVideoElement) => element.paused)).toBe(false);
  await page.locator('#a-little-room').scrollIntoViewIfNeeded();
  await expect.poll(() => film.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('video')).toHaveCount(0);
});

test('narrow reduced-motion layout retains new content without loading films or overflowing', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const filmRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().endsWith('.mp4')) filmRequests.push(request.url());
  });
  await page.goto('/');
  for (const id of [
    'a-little-room',
    'the-route',
    'open-water',
    'under-the-canopy',
    'field-notes',
  ]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      320,
    );
  }
  await expect(page.locator('.route-stops li')).toHaveCount(3);
  await expect(page.locator('video')).toHaveCount(0);
  expect(filmRequests).toEqual([]);
  await page.screenshot({ path: '.playwright/extended-mobile.png' });
});
