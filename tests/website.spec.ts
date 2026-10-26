import { expect, test, type Locator, type Page } from '@playwright/test';
import { lessonFormEndpoint } from '../src/lib/lessonForm';

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

test('lesson form endpoint keeps receiving emails out of published actions', () => {
  const anonymous = 'https://formsubmit.co/test-endpoint_token-0001';
  expect(lessonFormEndpoint(anonymous)).toBe(anonymous);
  expect(lessonFormEndpoint(`  ${anonymous}/  `)).toBe(`${anonymous}/`);
  for (const missing of [undefined, '', '   ']) expect(lessonFormEndpoint(missing)).toBeUndefined();

  const rejected = [
    'https://formsubmit.co/recipient@example.invalid',
    'https://formsubmit.co/recipient%40example.invalid',
    'https://formsubmit.co/recipient%2540example.invalid',
    'https://external.example.invalid/test-endpoint_token-0001',
    'https://formsubmit.co.external.example.invalid/test-endpoint_token-0001',
    'http://formsubmit.co/test-endpoint_token-0001',
    'https://user:password@formsubmit.co/test-endpoint_token-0001',
    `${anonymous}?email=recipient%40example.invalid`,
    `${anonymous}#recipient@example.invalid`,
    'https://formsubmit.co/short',
    `https://formsubmit.co/${'x'.repeat(129)}`,
    'not-a-url',
  ];
  for (const endpoint of rejected) expect(() => lessonFormEndpoint(endpoint)).toThrow();
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

// The configured fixture only changes initial server markup. Submission still
// uses the real form script and native browser POST, captured locally below.
async function lessonFormFixture(page: Page, ready: boolean) {
  const submissions: {
    url: string;
    method: string;
    body: string;
    navigation: boolean;
  }[] = [];
  await page.route('**/*', async (route) => {
    const request = route.request();
    if (request.method() === 'POST') {
      submissions.push({
        url: request.url(),
        method: request.method(),
        body: request.postData() || '',
        navigation: request.isNavigationRequest(),
      });
      // No request can reach a real lead destination, even if wiring regresses.
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<!doctype html><html lang="nl"><title>Lokale formuliertest</title><body><h1>Lokale testontvangst</h1></body></html>',
      });
      return;
    }
    if (request.isNavigationRequest() && request.method() === 'GET') {
      const response = await route.fetch();
      const html = await response.text();
      const body = html.replace(/<form\b(?=[^>]*\bid="kennismakingsformulier")[^>]*>[\s\S]*?<\/form>/, (form) => {
        let configured = form
          .replace(/\saction="[^"]*"/, '')
          .replace(/data-ready="(?:true|false)"/, `data-ready="${ready}"`);
        configured = configured.replace(/(<button\b[^>]*\btype="submit"[^>]*?)\sdisabled(?:="[^"]*")?/, '$1');
        if (ready) configured = configured.replace('<form', '<form action="/__form-test"');
        else configured = configured.replace(/(<button\b[^>]*\btype="submit")/, '$1 disabled');
        const status = ready ? '' : 'Dit formulier staat klaar als voorbeeld. Verzenden is nog niet ingeschakeld.';
        configured = configured.replace(/(<p[^>]+id="lesson-form-status"[^>]*>)[\s\S]*?(<\/p>)/, `$1${status}$2`);
        return configured;
      });
      await route.fulfill({ response, body });
      return;
    }
    await route.continue();
  });
  return submissions;
}

test('lesson choices prefill the inquiry form without losing entered details', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Je naam', { exact: false }).fill('Voorbeeld leerling');
  const choices = page.locator('[data-interest]');
  await expect(choices).toHaveCount(3);
  for (const choice of await choices.all()) {
    const interest = await choice.getAttribute('data-interest');
    await expect(choice).toHaveAttribute('href', '#contact');
    await choice.click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator('#lesson-interest')).toHaveValue(interest || '');
    await expect(page.getByLabel('Je naam', { exact: false })).toHaveValue('Voorbeeld leerling');
  }
});

test('free lesson and introduction calls to action lead to the contact form', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  const actions = page.getByRole('link', {
    name: /^(Plan je gratis les|Maak kennis met Hamlet)$/,
    includeHidden: true,
  });
  expect(await actions.count()).toBeGreaterThanOrEqual(4);
  for (const action of await actions.all()) await expect(action).toHaveAttribute('href', '#contact');
  await page.getByRole('link', { name: 'Maak kennis met Hamlet', exact: true }).click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.getByRole('form', { name: 'Gratis kennismakingsles aanvragen' })).toBeVisible();
});

test('an unconfigured form cannot submit or claim a successful request', async ({ page }) => {
  const submissions = await lessonFormFixture(page, false);
  await page.goto('/');
  const form = page.getByRole('form', { name: 'Gratis kennismakingsles aanvragen' });
  await expect(form).toHaveAttribute('data-ready', 'false');
  await expect(form).not.toHaveAttribute('action');
  await expect(form.getByRole('button', { name: 'Vraag je gratis les aan' })).toBeDisabled();
  await expect(form.getByRole('status')).toContainText('Verzenden is nog niet ingeschakeld');
  await page.getByLabel('Je naam', { exact: false }).fill('Voorbeeld leerling');
  await page.getByLabel('E-mailadres', { exact: false }).fill('leerling@example.invalid');
  await form.evaluate((element: HTMLFormElement) => element.requestSubmit());
  await expect(form.getByRole('status')).toHaveText(
    'Verzenden is nog niet ingeschakeld. Je kunt Hamlet wel rechtstreeks bellen.'
  );
  await expect(page.getByLabel('Je naam', { exact: false })).toHaveValue('Voorbeeld leerling');
  expect(submissions).toHaveLength(0);
});

test('inquiry form labels, required validation and errors preserve entered values', async ({ page }) => {
  const submissions = await lessonFormFixture(page, true);
  await page.goto('/');
  const form = page.getByRole('form', { name: 'Gratis kennismakingsles aanvragen' });
  const name = page.getByLabel('Je naam', { exact: false });
  const email = page.getByLabel('E-mailadres', { exact: false });
  const phone = page.getByLabel('Telefoonnummer', { exact: false });
  const interest = page.getByLabel('Waar sta je nu?', { exact: false });
  const message = page.getByLabel('Wat wil je graag leren?', { exact: false });
  await expect(name).toHaveAttribute('required', '');
  await expect(email).toHaveAttribute('required', '');
  await expect(email).toHaveAttribute('type', 'email');
  await expect(phone).toHaveAttribute('type', 'tel');
  for (const field of [phone, interest, message]) await expect(field).not.toHaveAttribute('required');
  await expect(form).toHaveAccessibleDescription(/Je les is nog niet geboekt/);

  await name.fill('   ');
  await email.fill('geen-geldig-adres');
  await phone.fill('+32 400 00 00 00');
  await interest.selectOption('Ik wil flamenco leren');
  await message.fill('Ik wil graag de basis van flamenco leren.');
  await form.getByRole('button', { name: 'Vraag je gratis les aan' }).click();
  await expect(name).toBeFocused();
  await expect(name).toHaveAttribute('aria-invalid', 'true');
  await expect(name).toHaveAccessibleDescription('Vul je naam in.');
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  await expect(email).toHaveAccessibleDescription('Vul een geldig e-mailadres in, zoals naam@voorbeeld.be.');
  await expect(form.getByRole('status')).toHaveText(
    'Controleer de gemarkeerde velden voordat je je aanvraag verstuurt.'
  );
  await expect(name).toHaveValue('   ');
  await expect(email).toHaveValue('geen-geldig-adres');
  await expect(phone).toHaveValue('+32 400 00 00 00');
  await expect(interest).toHaveValue('Ik wil flamenco leren');
  await expect(message).toHaveValue('Ik wil graag de basis van flamenco leren.');
  await name.fill('Voorbeeld leerling');
  await expect(name).not.toHaveAttribute('aria-invalid');
  await form.getByRole('button', { name: 'Vraag je gratis les aan' }).click();
  await expect(email).toBeFocused();
  await email.fill('');
  await expect(email).toHaveAccessibleDescription('Vul je e-mailadres in.');
  await email.fill('leerling@example.invalid');
  await expect(email).not.toHaveAttribute('aria-invalid');
  expect(submissions).toHaveLength(0);
});

for (const includeOptional of [false, true]) {
  test(`valid inquiry uses a native POST with ${includeOptional ? 'all fields' : 'only required details'}`, async ({
    page,
  }) => {
    const submissions = await lessonFormFixture(page, true);
    await page.goto('/');
    const canonical = page.locator('link[rel="canonical"]');
    const next = (await canonical.count())
      ? { _next: new URL('bedankt/', (await canonical.getAttribute('href')) || '').href }
      : {};
    await page.getByLabel('Je naam', { exact: false }).fill('  Voorbeeld leerling  ');
    await page.getByLabel('E-mailadres', { exact: false }).fill('leerling@example.invalid');
    if (includeOptional) {
      await page.getByLabel('Telefoonnummer', { exact: false }).fill('+32 400 00 00 00');
      await page.getByLabel('Waar sta je nu?', { exact: false }).selectOption('Ik speel al gitaar');
      await page.getByLabel('Wat wil je graag leren?', { exact: false }).fill('Akkoorden & ritme, op mijn tempo.');
    }
    await page.getByRole('button', { name: 'Vraag je gratis les aan' }).click();
    await expect(page.getByRole('heading', { name: 'Lokale testontvangst' })).toBeVisible();
    expect(submissions).toHaveLength(1);
    expect(new URL(submissions[0].url).pathname).toBe('/__form-test');
    expect(submissions[0].method).toBe('POST');
    expect(submissions[0].navigation).toBe(true);
    expect(Object.fromEntries(new URLSearchParams(submissions[0].body))).toEqual({
      _subject: 'Hamlet — aanvraag gratis kennismakingsles',
      _template: 'table',
      ...next,
      naam: 'Voorbeeld leerling',
      email: 'leerling@example.invalid',
      telefoon: includeOptional ? '+32 400 00 00 00' : '',
      interesse: includeOptional ? 'Ik speel al gitaar' : '',
      bericht: includeOptional ? 'Akkoorden & ritme, op mijn tempo.' : '',
    });
  });
}

test('privacy and thank-you pages explain form handling without contacting the provider', async ({ page }) => {
  const providerRequests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).hostname === 'formsubmit.co') providerRequests.push(request.url());
  });
  await page.goto('/');
  await page
    .getByRole('form', { name: 'Gratis kennismakingsles aanvragen' })
    .getByRole('link', { name: 'Lees het privacybeleid.' })
    .click();
  await expect(page).toHaveURL(/\/privacy\/?$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Privacy.');
  await expect(page.getByRole('heading', { name: 'Wanneer je het formulier verstuurt' })).toBeVisible();
  await expect(page.getByRole('main')).toContainText('naar FormSubmit verstuurd');
  await expect(page.getByRole('link', { name: 'privacybeleid van FormSubmit (pdf)' })).toHaveAttribute(
    'href',
    'https://formsubmit.co/privacy.pdf'
  );

  const response = await page.goto('/bedankt/');
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Bedankt voor.*je aanvraag\./);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  await expect(page.getByRole('main')).toContainText('Je aanvraag is nog geen bevestiging van een lesmoment.');
  await page.getByRole('link', { name: 'Terug naar Hamlet', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Leer gitaar spelen\..*Op jouw tempo\./);
  expect(providerRequests).toHaveLength(0);
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

  const status = page.locator('.hero-video-status');
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
