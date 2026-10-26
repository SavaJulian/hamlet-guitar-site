import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { format, resolveConfig } from 'prettier';

const root = fileURLToPath(new URL('../', import.meta.url));
const reviewUrl = 'https://savajulian.github.io/hamlet-guitar-site/logo-keuze/';
// This previously activated anonymous endpoint sends design feedback to Julian.
// Keep it separate from the lesson destination, which may later move to Hamlet.
const textValues = {
  FEEDBACK_ENDPOINT: 'https://formsubmit.co/854093865d255586b4a7b0670db1e89b',
  REVIEW_URL: reviewUrl,
  THANKS_URL: `${reviewUrl}bedankt/`,
};
const sources = {
  LOGO_ORIGINAL: ['public/brand/hamlet-logo-dark.svg', 'image/svg+xml'],
  LOGO_CASA: ['src/assets/logo-concepts/casa.webp', 'image/webp'],
  LOGO_TOKKEL: ['src/assets/logo-concepts/tokkel.webp', 'image/webp'],
  LOGO_SNAARWERK: ['src/assets/logo-concepts/snaarwerk.webp', 'image/webp'],
  LOGO_SIGNATURE: ['src/assets/logo-concepts/signature.webp', 'image/webp'],
  LOGO_PULSO: ['src/assets/logo-concepts/pulso.webp', 'image/webp'],
  LOGO_AIRE: ['src/assets/logo-concepts/aire.webp', 'image/webp'],
  FONT_MANROPE: ['node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2', 'font/woff2'],
  FONT_MANROPE_CYRILLIC: [
    'node_modules/@fontsource-variable/manrope/files/manrope-cyrillic-wght-normal.woff2',
    'font/woff2',
  ],
};

const values = { ...textValues };
for (const [key, [source, mime]] of Object.entries(sources)) {
  const data = await readFile(path.join(root, source));
  values[key] = `data:${mime};base64,${data.toString('base64')}`;
}
for (const [template, destination] of [
  ['logo-choice.html', 'index.html'],
  ['logo-thanks.html', 'bedankt/index.html'],
]) {
  const templatePath = path.join(root, 'src/brand-review', template);
  let html = await readFile(templatePath, 'utf8');
  for (const [key, value] of Object.entries(values)) html = html.replaceAll(`{{${key}}}`, value);
  if (/\{\{[A-Z_]+\}\}/.test(html)) throw new Error('Unresolved logo-choice value');
  html = await format(html, { ...(await resolveConfig(templatePath)), parser: 'html' });
  const output = path.join(root, 'public/logo-keuze', destination);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, html);
  console.log(`Built ${destination} (${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MiB)`);
}
