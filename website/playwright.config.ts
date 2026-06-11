import { defineConfig, devices } from '@playwright/test';

/**
 * Smoke tests run against the BUILT site (`astro preview` serving `dist/`), not the dev
 * server — what's tested is exactly what Cloudflare Pages ships. Run `pnpm build` first;
 * the webServer below only serves, it does not build (so a stale dist = stale tests).
 */
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm preview --port 4173',
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
});
