import { expect, test, type Page } from '@playwright/test';
import { lessonFormEndpoint } from '../src/lib/lessonForm';

const pages = [
  { path: '/', heading: 'Live flamencogitaar.' },
  { path: '/gitaarles/', heading: 'Leer gitaar spelen. Op jouw tempo.' },
];
const forms = {
  booking: {
    path: '/',
    id: 'boekingsformulier',
    statusId: 'booking-form-status',
    name: 'Een avond live muziek aanvragen',
    submit: 'Boek een avond',
  },
  lesson: {
    path: '/gitaarles/',
    id: 'kennismakingsformulier',
    statusId: 'lesson-form-status',
    name: 'Gratis kennismakingsles aanvragen',
    submit: 'Vraag je gratis les aan',
  },
};
type FormKey = keyof typeof forms;

test('form endpoint keeps receiving emails out of published actions', () => {
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

for (const { path, heading } of pages) {
  for (const width of [390, 768, 1440]) {
    test(`${path} is usable without overflow or broken images at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);

      // Exercise lazy loading through the complete page rather than only inspecting the hero.
      const images = page.locator('main img');
      expect(await images.count()).toBeGreaterThan(1);
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
}

test('live music is the homepage and guitar lessons are a second page of the same site', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const navigation = page.getByRole('navigation', { name: 'Hoofdnavigatie' });
  await expect(navigation.getByRole('link', { name: 'Live muziek' })).toHaveAttribute('aria-current', 'page');
  await navigation.getByRole('link', { name: 'Gitaarles' }).click();
  await expect(page).toHaveURL(/\/gitaarles\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Leer gitaar spelen. Op jouw tempo.');
  await expect(navigation.getByRole('link', { name: 'Gitaarles' })).toHaveAttribute('aria-current', 'page');
  await page.getByRole('link', { name: 'Hamlet, naar de startpagina' }).first().click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Live flamencogitaar.');
  await page.getByRole('link', { name: 'Naar de gitaarlessen' }).click();
  await expect(page).toHaveURL(/\/gitaarles\/$/);
});

test('neither page shows a show agenda or a list of frequently asked questions', async ({ page }) => {
  for (const { path } of pages) {
    await page.goto(path);
    await expect(page.locator('details')).toHaveCount(0);
    await expect(page.getByRole('main')).not.toContainText(/agenda|veelgestelde vragen/i);
  }
});

test('mobile navigation opens, leads to the lesson page, and responds to Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const navigation = page.getByRole('navigation', { name: 'Mobiele navigatie' });
  const toggle = page.locator('button[aria-controls="mobile-nav"]');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(navigation).toBeHidden();

  await page.getByRole('button', { name: 'Menu openen', exact: true }).click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(navigation).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(navigation).toBeHidden();
  await expect(toggle).toHaveAccessibleName('Menu openen');
  await expect(toggle).toBeFocused();

  await toggle.click();
  await navigation.getByRole('link', { name: 'Gitaarles' }).click();
  await expect(page).toHaveURL(/\/gitaarles\/$/);
  await expect(page.getByRole('navigation', { name: 'Mobiele navigatie' })).toBeHidden();
});

for (const { path, target, label } of [
  { path: '/', target: '#boeken', label: 'Boek een avond' },
  { path: '/gitaarles/', target: '#contact', label: 'Plan je gratis les' },
]) {
  test(`mobile shortcut on ${path} stays out of the hero and the form`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path);
    const shortcut = page.locator('.float-cta');
    await expect(shortcut).toHaveAttribute('href', target);
    await expect(shortcut).toContainText(label);
    await expect(page.locator('[data-primary-action]')).toBeInViewport();
    await expect(shortcut).not.toBeInViewport();

    await page
      .locator('main > section')
      .nth(1)
      .evaluate((element) => element.scrollIntoView({ block: 'start' }));
    await expect(shortcut).toBeInViewport();

    await page.locator(`${target} form`).scrollIntoViewIfNeeded();
    await expect(shortcut).not.toBeInViewport();
  });
}

test('primary actions lead to the form on their own page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  const booking = page.getByRole('link', { name: 'Boek een avond', includeHidden: true });
  expect(await booking.count()).toBeGreaterThanOrEqual(3);
  for (const action of await booking.all()) await expect(action).toHaveAttribute('href', '#boeken');
  await page.locator('.hero-actions').getByRole('link', { name: 'Boek een avond' }).click();
  await expect(page).toHaveURL(/#boeken$/);
  await expect(page.getByRole('form', { name: forms.booking.name })).toBeVisible();

  await page.goto('/gitaarles/');
  const lesson = page.getByRole('link', {
    name: /^(Plan je gratis les|Maak kennis met Hamlet)$/,
    includeHidden: true,
  });
  expect(await lesson.count()).toBeGreaterThanOrEqual(4);
  for (const action of await lesson.all()) await expect(action).toHaveAttribute('href', '#contact');
  await page.getByRole('link', { name: 'Maak kennis met Hamlet', exact: true }).click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.getByRole('form', { name: forms.lesson.name })).toBeVisible();
});

test('lesson choices prefill the inquiry form without losing entered details', async ({ page }) => {
  await page.goto('/gitaarles/');
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

// The configured fixture only changes initial server markup. Submission still
// uses the real form script and native browser POST, captured locally below.
async function formFixture(page: Page, key: FormKey, ready: boolean) {
  const { id, statusId } = forms[key];
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
      const body = html.replace(new RegExp(`<form\\b(?=[^>]*\\bid="${id}")[^>]*>[\\s\\S]*?</form>`), (form) => {
        let configured = form
          .replace(/\saction="[^"]*"/, '')
          .replace(/data-ready="(?:true|false)"/, `data-ready="${ready}"`);
        configured = configured.replace(/(<button\b[^>]*\btype="submit"[^>]*?)\sdisabled(?:="[^"]*")?/, '$1');
        if (ready) configured = configured.replace('<form', '<form action="/__form-test"');
        else configured = configured.replace(/(<button\b[^>]*\btype="submit")/, '$1 disabled');
        const status = ready ? '' : 'Dit formulier staat klaar als voorbeeld. Verzenden is nog niet ingeschakeld.';
        configured = configured.replace(new RegExp(`(<p[^>]+id="${statusId}"[^>]*>)[\\s\\S]*?(</p>)`), `$1${status}$2`);
        return configured;
      });
      await route.fulfill({ response, body });
      return;
    }
    await route.continue();
  });
  return submissions;
}

for (const key of Object.keys(forms) as FormKey[]) {
  const { path, name, submit } = forms[key];

  test(`an unconfigured ${key} form cannot submit or claim a successful request`, async ({ page }) => {
    const submissions = await formFixture(page, key, false);
    await page.goto(path);
    const form = page.getByRole('form', { name });
    await expect(form).toHaveAttribute('data-ready', 'false');
    await expect(form).not.toHaveAttribute('action');
    await expect(form.getByRole('button', { name: submit })).toBeDisabled();
    await expect(form.getByRole('status')).toContainText('Verzenden is nog niet ingeschakeld');
    await form.getByLabel('Je naam', { exact: false }).fill('Voorbeeld aanvrager');
    await form.getByLabel('E-mailadres', { exact: false }).fill('aanvrager@example.invalid');
    await form.getByLabel('Telefoonnummer', { exact: false }).fill('+32 400 00 00 00');
    await form.evaluate((element: HTMLFormElement) => element.requestSubmit());
    await expect(form.getByRole('status')).toHaveText(
      'Verzenden is nog niet ingeschakeld. Je kunt Hamlet wel rechtstreeks bellen.'
    );
    await expect(form.getByLabel('Je naam', { exact: false })).toHaveValue('Voorbeeld aanvrager');
    expect(submissions).toHaveLength(0);
  });

  test(`${key} form validates required fields and keeps entered values`, async ({ page }) => {
    const submissions = await formFixture(page, key, true);
    await page.goto(path);
    const form = page.getByRole('form', { name });
    const fullName = form.getByLabel('Je naam', { exact: false });
    const email = form.getByLabel('E-mailadres', { exact: false });
    const phone = form.getByLabel('Telefoonnummer', { exact: false });
    await expect(fullName).toHaveAttribute('required', '');
    await expect(email).toHaveAttribute('required', '');
    await expect(email).toHaveAttribute('type', 'email');
    await expect(phone).toHaveAttribute('type', 'tel');
    // Venues are called back, so the booking form needs a number; lessons do not.
    if (key === 'booking') await expect(phone).toHaveAttribute('required', '');
    else await expect(phone).not.toHaveAttribute('required');
    await expect(form).toHaveAccessibleDescription(/nog niet geboekt|nog geen bevestigde boeking/);

    if (key === 'booking') {
      await expect(form.getByLabel('Je naam of bedrijfsnaam', { exact: false })).toBeVisible();
      await expect(form.locator('select, input[type="date"]')).toHaveCount(0);
      await fullName.fill('Voorbeeld zaak');
      await email.fill('zaak@example.invalid');
      await form.getByRole('button', { name: submit }).click();
      await expect(phone).toBeFocused();
      await expect(phone).toHaveAccessibleDescription('Vul je telefoonnummer in.');
      expect(submissions).toHaveLength(0);
    }
    await fullName.fill('   ');
    await email.fill('geen-geldig-adres');
    await phone.fill('+32 400 00 00 00');
    await form.getByRole('button', { name: submit }).click();
    await expect(fullName).toBeFocused();
    await expect(fullName).toHaveAttribute('aria-invalid', 'true');
    await expect(fullName).toHaveAccessibleDescription('Vul je naam in.');
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(email).toHaveAccessibleDescription('Vul een geldig e-mailadres in, zoals naam@voorbeeld.be.');
    await expect(form.getByRole('status')).toHaveText(
      'Controleer de gemarkeerde velden voordat je je aanvraag verstuurt.'
    );
    await expect(fullName).toHaveValue('   ');
    await expect(email).toHaveValue('geen-geldig-adres');
    await expect(phone).toHaveValue('+32 400 00 00 00');
    await fullName.fill('Voorbeeld aanvrager');
    await expect(fullName).not.toHaveAttribute('aria-invalid');
    await form.getByRole('button', { name: submit }).click();
    await expect(email).toBeFocused();
    await email.fill('');
    await expect(email).toHaveAccessibleDescription('Vul je e-mailadres in.');
    await email.fill('aanvrager@example.invalid');
    await expect(email).not.toHaveAttribute('aria-invalid');
    expect(submissions).toHaveLength(0);
  });
}

for (const includeOptional of [false, true]) {
  test(`valid lesson inquiry uses a native POST with ${includeOptional ? 'all fields' : 'only required details'}`, async ({
    page,
  }) => {
    const submissions = await formFixture(page, 'lesson', true);
    await page.goto('/gitaarles/');
    const canonical = page.locator('link[rel="canonical"]');
    const next = (await canonical.count())
      ? { _next: new URL('../bedankt/', (await canonical.getAttribute('href')) || '').href }
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

test('valid booking request posts the evening details under its own subject', async ({ page }) => {
  const submissions = await formFixture(page, 'booking', true);
  await page.goto('/');
  const canonical = page.locator('link[rel="canonical"]');
  const next = (await canonical.count())
    ? { _next: new URL('bedankt-boeking/', (await canonical.getAttribute('href')) || '').href }
    : {};
  const form = page.getByRole('form', { name: forms.booking.name });
  await form.getByLabel('Je naam', { exact: false }).fill('  Voorbeeld zaakvoerder  ');
  await form.getByLabel('E-mailadres', { exact: false }).fill('zaak@example.invalid');
  await form.getByLabel('Telefoonnummer', { exact: false }).fill('+32 400 00 00 00');
  await form.getByLabel('Waar en wanneer?', { exact: false }).fill('Een avond voor veertig gasten, 12 maart.');
  await form.getByRole('button', { name: 'Boek een avond' }).click();
  await expect(page.getByRole('heading', { name: 'Lokale testontvangst' })).toBeVisible();
  expect(submissions).toHaveLength(1);
  expect(submissions[0].navigation).toBe(true);
  expect(Object.fromEntries(new URLSearchParams(submissions[0].body))).toEqual({
    _subject: 'Hamlet — aanvraag avond live muziek',
    _template: 'table',
    ...next,
    naam: 'Voorbeeld zaakvoerder',
    email: 'zaak@example.invalid',
    telefoon: '+32 400 00 00 00',
    bericht: 'Een avond voor veertig gasten, 12 maart.',
  });
});

test('privacy and thank-you pages explain form handling without contacting the provider', async ({ page }) => {
  const providerRequests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).hostname === 'formsubmit.co') providerRequests.push(request.url());
  });
  await page.goto('/gitaarles/');
  await page
    .getByRole('form', { name: forms.lesson.name })
    .getByRole('link', { name: 'Lees het privacybeleid.' })
    .click();
  await expect(page).toHaveURL(/\/privacy\/?$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Privacy.');
  await expect(page.getByRole('heading', { name: 'Wanneer je een formulier verstuurt' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Wanneer je een video van YouTube afspeelt' })).toBeVisible();
  await expect(page.getByRole('main')).toContainText('naar FormSubmit verstuurd');
  await expect(page.getByRole('link', { name: 'privacybeleid van FormSubmit (pdf)' })).toHaveAttribute(
    'href',
    'https://formsubmit.co/privacy.pdf'
  );

  let response = await page.goto('/bedankt/');
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Bedankt voor je aanvraag.');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  await expect(page.getByRole('main')).toContainText('Je aanvraag is nog geen bevestiging van een lesmoment.');
  await page.getByRole('link', { name: 'Terug naar de gitaarlessen' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Leer gitaar spelen. Op jouw tempo.');

  response = await page.goto('/bedankt-boeking/');
  expect(response?.status()).toBe(200);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  await expect(page.getByRole('main')).toContainText('Je aanvraag is nog geen bevestigde boeking.');
  await page.getByRole('link', { name: 'Terug naar Hamlet', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Live flamencogitaar.');
  expect(providerRequests).toHaveLength(0);
});

test('contact links point to the verified phone and Google location', async ({ page }) => {
  for (const { path } of pages) {
    await page.goto(path);
    const telephoneLinks = page.locator('a[href^="tel:"]');
    expect(await telephoneLinks.count()).toBeGreaterThan(0);
    for (const link of await telephoneLinks.all()) {
      await expect(link).toHaveAttribute('href', 'tel:+32483502220');
    }
  }
  const route = page.getByRole('link', { name: 'Plan je route' });
  const maps = new URL((await route.getAttribute('href')) || '');
  expect(maps.hostname).toBe('www.google.com');
  expect(maps.pathname).toBe('/maps');
  expect(maps.searchParams.get('cid')).toBe('4943289985205439662');
  await expect(page.locator('address')).toContainText('Bredabaan 479');
  await expect(page.locator('address')).toContainText('2170 Merksem');
});

test('videos open in a dialog, and YouTube is only contacted after a click', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const youtubeRequests: string[] = [];
  await page.route(/youtube(-nocookie)?\.com|ytimg\.com/, async (route) => {
    youtubeRequests.push(route.request().url());
    await route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>YouTube-test</title>' });
  });
  await page.goto('/');
  const tiles = page.locator('a[data-video]');
  await expect(tiles).toHaveCount(3);
  const dialog = page.locator('#video-dialog');
  await expect(dialog).toBeHidden();

  const stage = tiles.nth(1);
  await expect(stage).toHaveAttribute('href', /\/media\/hamlet-podium\.mp4$/);
  await stage.click();
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAccessibleName('Live op het podium');
  const video = dialog.locator('video');
  await expect(video).toHaveAttribute('src', /\/media\/hamlet-podium\.mp4$/);
  await expect(video).toHaveAttribute('controls', '');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(dialog.locator('video')).toHaveCount(0);
  await expect(stage).toBeFocused();
  expect(youtubeRequests).toHaveLength(0);

  await tiles.first().click();
  await expect(dialog.locator('iframe')).toHaveAttribute(
    'src',
    'https://www.youtube-nocookie.com/embed/MEcC6SS83Bc?autoplay=1&rel=0'
  );
  await expect.poll(() => youtubeRequests.length).toBeGreaterThan(0);
  await dialog.getByRole('button', { name: 'Video sluiten' }).click();
  await expect(dialog).toBeHidden();
  await expect(dialog.locator('iframe')).toHaveCount(0);
});

test('the lesson page shows lesson videos that play in the dialog', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/gitaarles/');
  const tiles = page.locator('a[data-video]');
  await expect(tiles).toHaveCount(5);
  await tiles.first().click();
  const dialog = page.locator('#video-dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('video')).toHaveAttribute('src', /\/media\/les-julian-1\.mp4$/);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(tiles.first()).toBeFocused();
});

const stringShapes = (page: Page) =>
  page.locator('[data-strings] path').evaluateAll((paths) => paths.map((path) => path.getAttribute('d')));

test('reduced motion keeps the strings still and every section visible', async ({ page }) => {
  await page.goto('/');
  const resting = await stringShapes(page);
  expect(resting).toHaveLength(6);
  await page.waitForTimeout(1500);
  expect(await stringShapes(page)).toEqual(resting);
  for (const item of await page.locator('[data-reveal]').all()) await expect(item).toHaveCSS('opacity', '1');
});

test.describe('when motion is allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('the strings are strummed on arrival and ring out again', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const resting = await stringShapes(page);
    await expect.poll(() => stringShapes(page), { timeout: 4000 }).not.toEqual(resting);
    await expect.poll(() => stringShapes(page), { timeout: 12_000 }).toEqual(resting);
  });

  test('sections below the fold rise into view when scrolled to', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const { path } of pages) {
      await page.goto(path);
      const items = page.locator('[data-reveal]');
      expect(await items.count()).toBeGreaterThan(3);
      const last = items.last();
      await expect(last).toHaveCSS('opacity', '0');
      for (const item of await items.all()) {
        await item.scrollIntoViewIfNeeded();
        await expect(item).toHaveClass(/is-in/);
        await expect(item).toHaveCSS('opacity', '1');
      }
    }
  });
});
