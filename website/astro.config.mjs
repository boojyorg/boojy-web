import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://boojy.org',
  output: 'static', // fully static — no SSR adapter, no Vercel
  trailingSlash: 'always', // every route is a directory route: /audio/, /privacy/, etc.
  build: { format: 'directory' },
  integrations: [
    react(),
    // Keep no-SEO-value pages out of the sitemap:
    //  - /subscribed/ : post-signup confirmation page
    //  - /account/    : login-gated client:only island — renders nothing server-side,
    //                   so submitting it invites a soft-404 / "crawled, not indexed".
    sitemap({
      filter: (page) => !page.includes('/subscribed/') && !page.includes('/account/'),
    }),
  ],
});
