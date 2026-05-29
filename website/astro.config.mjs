import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://boojy.org',
  output: 'static', // fully static — no SSR adapter, no Vercel
  trailingSlash: 'always', // every route is a directory route: /audio/, /privacy/, etc.
  build: { format: 'directory' },
  integrations: [react(), sitemap()],
});
