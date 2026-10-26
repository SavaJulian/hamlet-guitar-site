import { expect, test } from '@playwright/test';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const localPage = pathToFileURL(resolve('public/logo-keuze/index.html')).href;
const localThanks = pathToFileURL(resolve('public/logo-keuze/bedankt/index.html')).href;
const russianNotes = 'Хочу название «Струна». Сделай новые варианты с этим названием.';

test('logo review defaults to Russian and switching languages keeps the answer', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(localPage);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  await expect(page.locator('#language-ru')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.logo-card')).toHaveCount(7);
  await expect(page.locator('input[name="favorite"]')).toHaveCount(8);
  await page.locator('#geen input').check();
  await page.locator('#choice-note').fill(russianNotes);
  await page.locator('#language-nl').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'nl-BE');
  await expect(page.locator('#page-title')).toContainText('Welk logo');
  await expect(page.locator('#geen input')).toBeChecked();
  await expect(page.locator('#choice-note')).toHaveValue(russianNotes);
  await expect(page.locator('[name="_next"]')).toHaveValue(/\?lang=nl$/);
  await page.locator('#language-ru').click();
  await expect(page.locator('[name="_next"]')).not.toHaveValue(/\?lang=nl$/);
  const opener = page.locator('#aire [data-enlarge]');
  await opener.click();
  await expect(page.locator('#logo-dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(opener).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  expect(errors).toEqual([]);
  await page.goto(`${localThanks}?lang=nl`);
  await expect(page.locator('html')).toHaveAttribute('lang', 'nl');
  await expect(page.locator('h1')).toContainText('Bedankt');
  await page.locator('#language-ru').click();
  await expect(page.locator('h1')).toContainText('Спасибо');
});

for (const selected of ['tokkel', 'geen']) {
  test(`logo feedback posts ${selected} and Cyrillic notes without contacting the provider`, async ({ page }) => {
    let posted: Record<string, string> | undefined;
    await page.route('https://formsubmit.co/**', async (route) => {
      expect(route.request().method()).toBe('POST');
      posted = Object.fromEntries(new URLSearchParams(route.request().postData() || ''));
      await route.fulfill({ status: 200, contentType: 'text/html', body: '<p>Locally intercepted test.</p>' });
    });
    await page.goto(localPage);
    if (selected === 'tokkel') await page.locator('#language-nl').click();
    await page.locator(`#${selected} input`).check();
    await page.locator('#choice-note').fill(russianNotes);
    await page.locator('#send-feedback').click();
    await page.waitForURL('https://formsubmit.co/**');
    expect(posted?.favorite).toBe(selected);
    expect(posted?.Opmerkingen).toBe(russianNotes);
    expect(posted?.Logokeuze).toMatch(selected === 'geen' ? /Ни один/ : /03 — Tokkel/);
    expect(posted?._next).toBe(
      `https://savajulian.github.io/hamlet-guitar-site/logo-keuze/bedankt/${selected === 'tokkel' ? '?lang=nl' : ''}`
    );
    await page.goBack();
    await expect(page.locator('#send-feedback')).toBeEnabled();
    await expect(page.locator('#choice-note')).toHaveValue(russianNotes);
  });
}

test('missing choice and offline feedback keep notes and offer a copy fallback', async ({ page, context }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error('Permission denied');
        },
      },
    });
  });
  let attempts = 0;
  await page.route('https://formsubmit.co/**', (route) => {
    attempts += 1;
    return route.abort();
  });
  await page.goto(localPage);
  await page.locator('#choice-note').fill(russianNotes);
  await page.locator('#send-feedback').click();
  await expect(page.locator('#feedback-status')).toContainText('Выбери');
  await page.locator('#geen input').check();
  await context.setOffline(true);
  await page.locator('#send-feedback').click();
  await expect(page.locator('#feedback-status')).toContainText('Нет интернета');
  await page.locator('#copy-choice').click();
  await expect(page.locator('#copy-fallback')).toBeVisible();
  await expect(page.locator('#copy-text')).toHaveValue(new RegExp(russianNotes));
  await expect(page.locator('#choice-note')).toHaveValue(russianNotes);
  expect(attempts).toBe(0);
});
