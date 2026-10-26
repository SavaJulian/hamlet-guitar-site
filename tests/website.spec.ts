import { expect, test, type Locator, type Page } from '@playwright/test';

// Make native permission behavior explicit; blocked-policy tests below inject
// the browser denial before delegating accepted attempts to this native player.
test.use({
  launchOptions: {
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
      : {}),
    args: ['--autoplay-policy=no-user-gesture-required'],
  },
});

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

test('hero no longer exposes the full-film dialog or the old control bar', async ({ page }) => {
  const fullFilmRequests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).pathname.endsWith('/hamlet-flamenco.mp4')) fullFilmRequests.push(request.url());
  });
  await page.goto('/');
  await expect(page.locator('.hero-controls, #hero-pause, .video-dialog, [data-play-video]')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Volledige video' })).toHaveCount(0);
  await expect(page.locator('#hero-sound')).toBeVisible();
  expect(fullFilmRequests).toEqual([]);
});

test('reduced motion keeps the poster until keyboard activation starts the performance', async ({ page }) => {
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

  await start.focus();
  await page.keyboard.press('Enter');
  await expectPlaying(hero);
  expect(heroRequests.length).toBeGreaterThan(0);
  expect(await hero.evaluate((element: HTMLVideoElement) => element.muted)).toBe(false);
  await expect(page.getByRole('button', { name: 'Video pauzeren', exact: true })).toBeFocused();
  await page.keyboard.press('Space');
  await expect.poll(() => hero.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  await expect(page.getByRole('button', { name: 'Video afspelen', exact: true })).toBeFocused();
});

// Only the browser's permission decision is controlled. Accepted calls still use
// native media playback, allowing us to verify that decoded frames advance.
async function recordAutoplayPolicy(page: Page, blockAudibleBeforeGesture: boolean) {
  await page.addInitScript((blocked) => {
    const state = { attempts: [] as boolean[], rejected: 0, activated: false };
    Object.assign(window, { __autoplayTest: state });
    const nativePlay = HTMLMediaElement.prototype.play;
    for (const eventName of ['pointerdown', 'keydown']) {
      document.addEventListener(
        eventName,
        (event) => {
          if (event.isTrusted) state.activated = true;
        },
        { capture: true }
      );
    }
    HTMLMediaElement.prototype.play = function () {
      state.attempts.push(this.muted);
      if (blocked && !this.muted && !state.activated) {
        state.rejected += 1;
        return Promise.reject(new DOMException('Audible autoplay requires user activation.', 'NotAllowedError'));
      }
      return nativePlay.call(this);
    };
  }, blockAudibleBeforeGesture);
}

async function autoplayAttempts(page: Page) {
  return page.evaluate(() => {
    const state = (window as unknown as Window & { __autoplayTest: { attempts: boolean[]; rejected: number } })
      .__autoplayTest;
    return { attempts: state.attempts, rejected: state.rejected };
  });
}

test.describe('hero playback when motion is allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  for (const [device, width] of [
    ['mobile', 390],
    ['desktop', 1440],
  ] as const) {
    test(`${device} starts with sound when autoplay is permitted`, async ({ page }) => {
      await page.setViewportSize({ width, height: device === 'mobile' ? 844 : 1000 });
      await recordAutoplayPolicy(page, false);
      await page.goto('/');
      const hero = page.locator('#hero-video');
      await expectPlaying(hero);
      expect(await hero.evaluate((element: HTMLVideoElement) => element.muted)).toBe(false);
      expect((await autoplayAttempts(page)).attempts[0]).toBe(false);
      await expect(hero).toHaveAttribute('playsinline', '');
      await expect(page.getByRole('button', { name: 'Geluid uitschakelen', exact: true })).toBeVisible();
      await page.screenshot({ path: `.impeccable/review/hero-audio-allowed-${device}.png` });

      await page.locator('#hero-sound').click();
      expect(await hero.evaluate((element: HTMLVideoElement) => element.muted)).toBe(true);
      await expect(page.getByRole('button', { name: 'Geluid inschakelen', exact: true })).toBeVisible();
      await expectPlaying(hero);
      await page.locator('#hero-playback').click();
      await expect.poll(() => hero.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
      await expect(page.getByRole('button', { name: 'Video afspelen', exact: true })).toBeVisible();
      await page.locator('#hero-playback').click();
      await expectPlaying(hero);
      expect(await hero.evaluate((element: HTMLVideoElement) => element.muted)).toBe(true);
    });

    test(`${device} falls back to muted playback when audible autoplay is blocked`, async ({ page }) => {
      await page.setViewportSize({ width, height: device === 'mobile' ? 844 : 1000 });
      await recordAutoplayPolicy(page, true);
      await page.goto('/');
      const hero = page.locator('#hero-video');
      await expectPlaying(hero);
      expect(await hero.evaluate((element: HTMLVideoElement) => element.muted)).toBe(true);
      const policy = await autoplayAttempts(page);
      expect(policy.attempts[0]).toBe(false);
      expect(policy.rejected).toBeGreaterThan(0);
      expect(policy.attempts).toContain(true);
      await expect(page.getByRole('button', { name: 'Geluid inschakelen', exact: true })).toBeVisible();
      await page.screenshot({ path: `.impeccable/review/hero-audio-blocked-${device}.png` });

      await page.locator('#hero-sound').click();
      await expect(page.getByRole('button', { name: 'Geluid uitschakelen', exact: true })).toBeVisible();
      expect(await hero.evaluate((element: HTMLVideoElement) => element.muted)).toBe(false);
      await expectPlaying(hero);
      await page.locator('#hero-sound').click();
      expect(await hero.evaluate((element: HTMLVideoElement) => element.muted)).toBe(true);
    });
  }

  test('scrolling pauses playback and preserves manual sound and pause choices', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await recordAutoplayPolicy(page, false);
    await page.goto('/');
    const hero = page.locator('#hero-video');
    await expectPlaying(hero);
    expect(await hero.evaluate((element: HTMLVideoElement) => element.muted)).toBe(false);
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect.poll(() => hero.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
    await page.getByRole('heading', { level: 1 }).scrollIntoViewIfNeeded();
    await expectPlaying(hero);
    expect(await hero.evaluate((element: HTMLVideoElement) => element.muted)).toBe(false);

    await page.locator('#hero-sound').click();
    expect(await hero.evaluate((element: HTMLVideoElement) => element.muted)).toBe(true);
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect.poll(() => hero.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
    await page.getByRole('heading', { level: 1 }).scrollIntoViewIfNeeded();
    await expectPlaying(hero);
    expect(await hero.evaluate((element: HTMLVideoElement) => element.muted)).toBe(true);

    await page.locator('#hero-playback').focus();
    await page.keyboard.press('Space');
    await expect.poll(() => hero.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
    const pausedAt = await hero.evaluate((element: HTMLVideoElement) => element.currentTime);
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.getByRole('heading', { level: 1 }).scrollIntoViewIfNeeded();
    await expect(page.getByRole('button', { name: 'Video afspelen', exact: true })).toBeVisible();
    expect(await hero.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeCloseTo(pausedAt, 2);
    expect(await hero.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
    expect(await hero.evaluate((element: HTMLVideoElement) => element.muted)).toBe(true);
  });
});

test('mobile hero failure keeps the heading clear and the poster visible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.route('**/hamlet-hero.mp4*', (route) =>
    route.fulfill({ status: 404, contentType: 'text/plain', body: 'Video not found' })
  );
  await page.goto('/');

  const status = page.getByRole('status');
  await expect(status).toBeVisible();
  await expect(status).toContainText('De video kon niet laden.');
  await expect(page.locator('#hero-sound')).toBeDisabled();
  await expect(page.locator('#hero-playback')).toBeDisabled();
  await expect(page.locator('#hero-video')).toHaveAttribute('poster', /hamlet-performance\.webp\?v=black-background$/);

  const statusBox = await status.boundingBox();
  const headingBox = await page.getByRole('heading', { level: 1 }).boundingBox();
  expect(statusBox).not.toBeNull();
  expect(headingBox).not.toBeNull();
  if (!statusBox || !headingBox) throw new Error('The recovery message and page heading must both be rendered.');
  const separated = statusBox.y + statusBox.height <= headingBox.y || headingBox.y + headingBox.height <= statusBox.y;
  expect(separated).toBe(true);
});
