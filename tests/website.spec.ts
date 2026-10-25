import { expect, test, type Locator } from '@playwright/test';

async function expectPlaying(video: Locator) {
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.readyState)).toBeGreaterThanOrEqual(2);
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(false);
  const startedAt = await video.evaluate((element: HTMLVideoElement) => element.currentTime);
  await expect
    .poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime))
    .toBeGreaterThan(startedAt + 0.1);
}

for (const width of [390, 768, 1440]) {
  test(`homepage is usable without overflow or broken images at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Leer gitaar spelen\..*Op jouw tempo\./);

    // Exercise lazy loading through the complete page rather than only inspecting the hero.
    const images = page.locator('main img');
    for (const image of await images.all()) {
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0))
        .toBe(true);
    }
    const dimensions = await page.evaluate(() => ({
      pageWidth: document.documentElement.scrollWidth,
      viewport: document.documentElement.clientWidth,
    }));
    expect(dimensions.pageWidth).toBeLessThanOrEqual(dimensions.viewport + 1);
    expect(errors).toEqual([]);
  });
}

test('mobile navigation opens, closes on a section selection, and responds to Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const navigation = page.getByRole('navigation', { name: 'Mobiele navigatie' });
  const toggle = page.locator('button[aria-controls="mobile-nav"]');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(navigation).toBeHidden();

  await page.getByRole('button', { name: 'Menu openen', exact: true }).click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(navigation).toBeVisible();
  await page.screenshot({ path: '.impeccable/review/mobile-menu.png' });
  await navigation.getByRole('link', { name: 'De lessen', exact: true }).click();
  await expect(page).toHaveURL(/#lessen$/);
  await expect(navigation).toBeHidden();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');

  await toggle.click();
  await expect(navigation).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(navigation).toBeHidden();
  await expect(toggle).toHaveAccessibleName('Menu openen');
});

test('FAQ answers open and close with the keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const question = page.locator('summary').filter({ hasText: 'Kan ik beginnen zonder ervaring?' });
  const answer = question.locator('..').locator('p');
  await expect(answer).toBeHidden();
  await question.focus();
  await page.keyboard.press('Enter');
  await expect(answer).toBeVisible();
  await expect(answer).toContainText('beginners én gevorderden');
  await page.locator('#vragen').evaluate((element) => element.scrollIntoView({ block: 'start' }));
  await page.screenshot({ path: '.impeccable/review/faq-open.png' });
  await page.keyboard.press('Enter');
  await expect(answer).toBeHidden();
});

test('lesson choice prepares the matching SMS without sending anything', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /De ziel van.*flamenco/is }).click();
  await expect(page).toHaveURL(/#contact$/);
  const sms = new URL((await page.getByRole('link', { name: /Liever een bericht/ }).getAttribute('href')) || '');
  expect(sms.protocol).toBe('sms:');
  expect(sms.pathname).toBe('+32483502220');
  expect(sms.searchParams.get('body')).toContain('ik wil flamenco leren');
  expect(sms.searchParams.get('body')).toContain('gratis kennismakingsles afspreken');
  await expect(page.locator('[aria-live="polite"]')).toContainText('Ik wil flamenco leren');
});

test('contact links point to the verified phone and Google location', async ({ page }) => {
  await page.goto('/');
  const telephoneLinks = page.locator('a[href^="tel:"]');
  expect(await telephoneLinks.count()).toBeGreaterThan(0);
  for (const link of await telephoneLinks.all()) {
    await expect(link).toHaveAttribute('href', 'tel:+32483502220');
  }
  const route = page.getByRole('link', { name: 'Plan je route' });
  const maps = new URL((await route.getAttribute('href')) || '');
  expect(maps.hostname).toBe('www.google.com');
  expect(maps.pathname).toBe('/maps');
  expect(maps.searchParams.get('cid')).toBe('4943289985205439662');
  await expect(page.locator('address')).toContainText('Bredabaan 479');
  await expect(page.locator('address')).toContainText('2170 Merksem');
});

test('performance loads only on demand, then pauses and releases scrolling on Escape', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const mediaRequests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).pathname.endsWith('/hamlet-flamenco.mp4')) mediaRequests.push(request.url());
  });
  await page.goto('/');
  const video = page.locator('.video-dialog video');
  await expect(video).not.toHaveAttribute('src');
  expect(mediaRequests).toHaveLength(0);

  const watch = page.getByRole('button', { name: 'Volledige video' });
  await watch.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect.poll(() => mediaRequests.length).toBeGreaterThan(0);
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.readyState)).toBeGreaterThanOrEqual(1);
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(false);
  expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toBe('hidden');
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0.1);
  await page.screenshot({ path: '.impeccable/review/video-open.png' });

  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe('hidden');
  await expect(watch).toBeFocused();
});

test('reduced motion keeps the hero as a poster until the visitor starts it', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const heroRequests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).pathname.endsWith('/hamlet-hero.mp4')) heroRequests.push(request.url());
  });
  await page.goto('/');
  const hero = page.locator('#hero-video');
  const start = page.getByRole('button', { name: 'Video afspelen', exact: true });
  await expect(start).toBeVisible();
  await expect(hero).not.toHaveAttribute('src');
  await expect(hero).toHaveAttribute('poster', /hamlet-performance\.webp\?v=black-background$/);
  expect(heroRequests).toHaveLength(0);
  expect(await hero.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);

  await start.click();
  await expectPlaying(hero);
  expect(heroRequests.length).toBeGreaterThan(0);
  expect(await hero.evaluate((element: HTMLVideoElement) => element.muted)).toBe(true);
  await expect(page.getByRole('button', { name: 'Video pauzeren', exact: true })).toBeVisible();
});

test.describe('hero playback when motion is allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  for (const [device, width] of [
    ['mobile', 390],
    ['desktop', 1440],
  ] as const) {
    test(`${device} hero autoplays silently and sound/pause controls work`, async ({ page }) => {
      await page.setViewportSize({ width, height: device === 'mobile' ? 844 : 1000 });
      await page.goto('/');
      const hero = page.locator('#hero-video');
      await expectPlaying(hero);
      expect(await hero.evaluate((element: HTMLVideoElement) => element.muted)).toBe(true);
      await expect(hero).toHaveAttribute('playsinline', '');
      await page.screenshot({ path: `.impeccable/review/hero-autoplay-${device}.png` });

      await page.getByRole('button', { name: 'Geluid inschakelen', exact: true }).click();
      await expect(page.getByRole('button', { name: 'Geluid uitschakelen', exact: true })).toBeVisible();
      expect(await hero.evaluate((element: HTMLVideoElement) => element.muted)).toBe(false);
      await expectPlaying(hero);

      await page.getByRole('button', { name: 'Video pauzeren', exact: true }).click();
      await expect.poll(() => hero.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
      await expect(page.getByRole('button', { name: 'Video afspelen', exact: true })).toBeVisible();
      const pausedAt = await hero.evaluate((element: HTMLVideoElement) => element.currentTime);
      await page.locator('.hero').screenshot({ path: `.impeccable/review/hero-video-${device}.png` });
      expect(await hero.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeCloseTo(pausedAt, 2);

      await page.getByRole('button', { name: 'Video afspelen', exact: true }).click();
      await expectPlaying(hero);
      await page.getByRole('button', { name: 'Geluid uitschakelen', exact: true }).click();
      await expect(page.getByRole('button', { name: 'Geluid inschakelen', exact: true })).toBeVisible();
      expect(await hero.evaluate((element: HTMLVideoElement) => element.muted)).toBe(true);
    });
  }

  test('full performance pauses the audible hero and closing resumes only the hero', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('/');
    const hero = page.locator('#hero-video');
    const performance = page.locator('.video-dialog video');
    await expectPlaying(hero);
    await page.getByRole('button', { name: 'Geluid inschakelen', exact: true }).click();
    expect(await hero.evaluate((element: HTMLVideoElement) => element.muted)).toBe(false);

    await page.getByRole('button', { name: 'Volledige video' }).click();
    await expectPlaying(performance);
    await expect.poll(() => hero.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
    expect(
      await page
        .locator('video')
        .evaluateAll(
          (elements) => elements.filter((element) => element instanceof HTMLVideoElement && !element.paused).length
        )
    ).toBe(1);

    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
    await expectPlaying(hero);
    expect(await performance.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
    expect(
      await page
        .locator('video')
        .evaluateAll(
          (elements) => elements.filter((element) => element instanceof HTMLVideoElement && !element.paused).length
        )
    ).toBe(1);
  });

  test('hero pauses outside the viewport and respects manual pause after scrolling or a dialog', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('/');
    const hero = page.locator('#hero-video');
    await expectPlaying(hero);
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect.poll(() => hero.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
    await page.getByRole('heading', { level: 1 }).scrollIntoViewIfNeeded();
    await expectPlaying(hero);

    await page.getByRole('button', { name: 'Video pauzeren', exact: true }).click();
    await expect.poll(() => hero.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
    const pausedAt = await hero.evaluate((element: HTMLVideoElement) => element.currentTime);
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.getByRole('heading', { level: 1 }).scrollIntoViewIfNeeded();
    await expect(page.getByRole('button', { name: 'Video afspelen', exact: true })).toBeVisible();
    expect(await hero.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeCloseTo(pausedAt, 2);
    expect(await hero.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);

    await page.getByRole('button', { name: 'Volledige video' }).click();
    await expectPlaying(page.locator('.video-dialog video'));
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
    expect(await hero.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
    await expect(page.getByRole('button', { name: 'Video afspelen', exact: true })).toBeVisible();
  });
});

test('mobile hero failure keeps the heading clear and the full performance available', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.route('**/hamlet-hero.mp4*', (route) =>
    route.fulfill({ status: 404, contentType: 'text/plain', body: 'Video not found' })
  );
  await page.goto('/');

  const status = page.getByRole('status');
  await expect(status).toBeVisible();
  await expect(status).toContainText('De achtergrondvideo kon niet laden.');
  await expect(status).toContainText('Probeer de volledige video.');
  await expect(page.locator('#hero-sound')).toBeDisabled();
  await expect(page.locator('#hero-pause')).toBeDisabled();

  const statusBox = await status.boundingBox();
  const headingBox = await page.getByRole('heading', { level: 1 }).boundingBox();
  expect(statusBox).not.toBeNull();
  expect(headingBox).not.toBeNull();
  if (!statusBox || !headingBox) throw new Error('The recovery message and page heading must both be rendered.');
  expect(statusBox.y + statusBox.height).toBeLessThanOrEqual(headingBox.y);

  const fullVideo = page.getByRole('button', { name: 'Volledige video' });
  await expect(fullVideo).toBeEnabled();
  await fullVideo.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expectPlaying(page.locator('.video-dialog video'));
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
});
