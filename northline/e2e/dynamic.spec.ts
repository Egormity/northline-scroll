import { expect, test } from '@playwright/test';

test('reverses hero choreography and navigates the film by chapter', async ({ page }) => {
  await page.goto('/');
  const image = page.locator('.hero-image');
  const imageStart = await image.evaluate((element) => getComputedStyle(element).transform);
  const title = page.locator('.hero-title-emphasis');
  const titleStart = await title.evaluate((element) => getComputedStyle(element).transform);
  await page.evaluate(() => window.scrollTo({ top: 440, behavior: 'instant' }));
  await expect
    .poll(() => image.evaluate((element) => getComputedStyle(element).transform))
    .not.toBe(imageStart);
  await expect
    .poll(() => title.evaluate((element) => getComputedStyle(element).transform))
    .not.toBe(titleStart);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect
    .poll(() => image.evaluate((element) => getComputedStyle(element).transform))
    .toBe(imageStart);
  await page.getByRole('link', { name: 'The story', exact: true }).click();
  await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe('story');
  const third = page.getByRole('button', { name: 'Go to chapter 3: Leave a little room.' });
  await third.focus();
  await third.press('Enter');
  await expect(third).toHaveAttribute('aria-current', 'step');
  await expect
    .poll(() =>
      page
        .locator('.beat-2.journey-beat')
        .evaluate((element) => Number(getComputedStyle(element).opacity)),
    )
    .toBeGreaterThan(0.99);
  await expect(third).toBeFocused();
  await page.screenshot({ path: '.playwright/dynamic-story.png' });
  await page.setViewportSize({ width: 1600, height: 740 });
  await third.click();
  await expect(third).toHaveAttribute('aria-current', 'step');
  await expect
    .poll(() =>
      page.evaluate(() => {
        const text = document.querySelector('.beat-2 p')!.getBoundingClientRect();
        const controls = document.querySelector('.journey-chapters')!.getBoundingClientRect();
        return controls.top - text.bottom;
      }),
    )
    .toBeGreaterThan(15);
  await page.getByRole('button', { name: 'Go to chapter 1: Find the edge.' }).click();
  await expect
    .poll(() =>
      page
        .locator('.beat-0.journey-beat')
        .evaluate((element) => Number(getComputedStyle(element).opacity)),
    )
    .toBeGreaterThan(0.99);
  await page.getByRole('button', { name: 'Reduce motion', exact: true }).click();
  await expect(page.locator('.hero')).not.toHaveClass(/hero-motion/);
  await expect(page.getByRole('navigation', { name: 'Landscape chapters' })).toHaveCount(0);
  await expect(page.locator('#story video')).toHaveCount(0);
});

test('turns field notes using keyboard and retains the deck in mobile reduced motion', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Notes to take', exact: true }).click();
  await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe('field-notes');
  const front = page.locator('.deck-card[aria-hidden="false"]');
  await expect(front).toHaveCount(1);
  await expect(front.getByRole('heading')).toHaveText('Findthe edge.');
  const next = page.getByRole('button', { name: 'Next field note', exact: true });
  await next.focus();
  await next.press('Enter');
  await expect(front.getByRole('heading')).toHaveText('Take thelong way.');
  await expect(next).toBeFocused();
  await next.press('Enter');
  await expect(front.getByRole('heading')).toHaveText('Leave alittle room.');
  await next.press('Enter');
  await expect(front.getByRole('heading')).toHaveText('Findthe edge.');
  await page.screenshot({ path: '.playwright/dynamic-field-notes.png' });
  await page.setViewportSize({ width: 800, height: 740 });
  await page.locator('.note-deck').scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(800);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 740 });
  await page.locator('.note-deck').scrollIntoViewIfNeeded();
  await expect(page.locator('.note-deck')).not.toHaveClass(/is-responsive/);
  await expect
    .poll(() => front.evaluate((element) => getComputedStyle(element).transitionDuration))
    .toBe('0s');
  await next.click();
  await expect(front.getByRole('heading')).toHaveText('Take thelong way.');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await page.screenshot({ path: '.playwright/dynamic-mobile-notes.png' });
});
