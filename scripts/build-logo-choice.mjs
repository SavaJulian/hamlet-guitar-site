import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { format, resolveConfig } from 'prettier';

const root = fileURLToPath(new URL('../', import.meta.url));
const templatePath = path.join(root, 'src/brand-review/logo-choice.html');
const sources = {
  LOGO_ORIGINAL: ['public/brand/hamlet-logo-dark.svg', 'image/svg+xml'],
  LOGO_CASA: ['src/assets/logo-concepts/casa.webp', 'image/webp'],
  LOGO_TOKKEL: ['src/assets/logo-concepts/tokkel.webp', 'image/webp'],
  LOGO_SNAARWERK: ['src/assets/logo-concepts/snaarwerk.webp', 'image/webp'],
  LOGO_SIGNATURE: ['src/assets/logo-concepts/signature.webp', 'image/webp'],
  LOGO_PULSO: ['src/assets/logo-concepts/pulso.webp', 'image/webp'],
  LOGO_AIRE: ['src/assets/logo-concepts/aire.webp', 'image/webp'],
  FONT_MANROPE: ['node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2', 'font/woff2'],
};

let html = await readFile(templatePath, 'utf8');
for (const [key, [source, mime]] of Object.entries(sources)) {
  const data = await readFile(path.join(root, source));
  html = html.replaceAll(`{{${key}}}`, `data:${mime};base64,${data.toString('base64')}`);
}
if (/\{\{[A-Z_]+\}\}/.test(html)) throw new Error('Unresolved logo-choice asset');
html = await format(html, { ...(await resolveConfig(templatePath)), parser: 'html' });
const output = path.join(root, 'public/logo-keuze/index.html');
await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, html);
console.log(`Built standalone logo-choice page (${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MiB)`);
