import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://boojy.org',
  output: 'static', // fully static — no SSR adapter, no Vercel
  trailingSlash: 'always', // matches current /audio/, /notes/ etc.
  build: { format: 'directory' },
  integrations: [react(), sitemap()],
});
