import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import yaml from 'js-yaml';
import configBuilder, { type Config } from './vendor/integration/utils/configBuilder';

const root = path.dirname(fileURLToPath(import.meta.url));
const site = process.env.SITE_URL || undefined;
const base = process.env.BASE_PATH || '/';
const theme = configBuilder(
  yaml.load(fs.readFileSync(new URL('./src/config.yaml', import.meta.url), 'utf8')) as Config
);
theme.SITE.site = site;
theme.SITE.base = base;

export default defineConfig({
  output: 'static',
  devToolbar: { enabled: false },
  site,
  base,
  trailingSlash: 'never',
  // Retained for compatibility with unused starter components; Hamlet loads its
  // own local font packages, without contacting a font CDN at runtime.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin'],
    },
  ],
  integrations: [...(site ? [sitemap()] : []), icon({ iconDir: 'src/assets/icons', include: { tabler: ['*'] } })],
  vite: {
    plugins: [
      tailwindcss(),
      {
        name: 'hamlet-theme-config',
        resolveId(id) {
          if (id === 'astrowind:config') return '\0astrowind:config';
        },
        load(id) {
          if (id === '\0astrowind:config')
            return Object.entries(theme)
              .map(([key, value]) => `export const ${key} = ${JSON.stringify(value)};`)
              .join('\n');
        },
      },
    ],
    resolve: { alias: { '~': path.resolve(root, 'src') } },
  },
});
