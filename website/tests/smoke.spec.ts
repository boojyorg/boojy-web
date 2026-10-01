import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

/**
 * Smoke suite — catches the failure class the 2026-06 review found shipping silently:
 * pages that stop rendering, dead download affordances, islands that fail to hydrate.
 * Runs against the built `dist/` via `astro preview` (see playwright.config.ts).
 */

// Every public page: it loads, carries its exact title, and renders a heading.
const PAGES = [
  { path: '/', title: 'Boojy – Creative Tools' },
  { path: '/audio/', title: 'Boojy Audio – Free DAW for Beginners' },
  { path: '/notes/', title: 'Boojy Notes – A Calm Space for Your Thoughts' },
  { path: '/privacy/', title: 'Privacy Policy – Boojy' },
  { path: '/terms/', title: 'Terms of Service – Boojy' },
];

for (const { path, title } of PAGES) {
  test(`${path} renders with its title`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(title);
    expect(await page.locator('h1').count()).toBeGreaterThan(0);
  });
}

test('homepage: nav mark, the drawn Boojy logo, both app cards (Audio first) and the About card', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.site-nav svg.boojy-mark')).toHaveCount(1);
  // The hero logo is drawn from parts: the sun and the draggable planet are real shapes.
  await expect(page.locator('svg[data-system] .sun')).toHaveCount(1);
  await expect(page.locator('svg[data-system] .jplanet')).toHaveCount(1);
  await expect(page.locator('.product-card')).toHaveCount(2);
  await expect(page.locator('.product-card').first()).toHaveAttribute('data-product', 'audio');
  await expect(page.locator('.product-card').last()).toHaveAttribute('data-product', 'notes');
  await expect(page.locator('.product-card').first()).toHaveAttribute('href', '/audio/');
  await expect(page.locator('.about h2')).toHaveText("Hi, I'm Tyr.");
});

test('homepage runs without JavaScript errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(errors).toEqual([]);
});

test('/audio/ download CTA hydrates and the panel lists a GitHub fallback', async ({ page }) => {
  await page.goto('/audio/');
  await expect(page.locator('.audio-download')).toBeVisible();
  // client:load island — retry the toggle until hydration has attached the handler.
  // (By name, not class: the "All versions" link shares .other-platforms-link styling.)
  await expect(async () => {
    await page.getByRole('link', { name: 'Other platforms' }).click();
    await expect(page.locator('.platform-github')).toBeVisible({ timeout: 1000 });
  }).toPass();
  await expect(page.locator('.platform-github')).toHaveAttribute(
    'href',
    'https://github.com/boojyorg/boojy-audio/releases',
  );
});

// Notes is desktop-only on the site (the browser build is a dev target): no web CTA, a
// download button for the detected OS, and every desktop build in "Other platforms".
test('/notes/ offers desktop downloads, Linux included, and no web app link', async ({ page }) => {
  await page.goto('/notes/');
  await expect(page.locator('a[href="https://notes.boojy.org"]')).toHaveCount(0);
  await expect(page.locator('.btn-notes-download')).toBeVisible();
  await expect(page.locator('.btn-notes-download')).toContainText('Download');
  await expect(async () => {
    await page.getByRole('link', { name: 'Other platforms' }).click();
    await expect(page.locator('.platform-github')).toBeVisible({ timeout: 1000 });
  }).toPass();
  for (const id of [
    'mac-arm64',
    'windows-x64',
    'linux-appimage-x64',
    'linux-appimage-arm64',
    'linux-deb-x64',
    'linux-deb-arm64',
  ]) {
    await expect(page.locator(`.platform-item[data-platform="${id}"]`)).toHaveAttribute(
      'href',
      /^https:\/\/github\.com\/boojyorg\/boojy-notes\/releases\//,
    );
  }
});

test.describe('on a phone', () => {
  test.use({
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
    viewport: { width: 390, height: 844 },
  });

  test('/notes/ says it is a desktop app instead of offering an installer', async ({ page }) => {
    await page.goto('/notes/');
    await expect(page.locator('.notes-desktop-note')).toBeVisible();
    await expect(page.locator('.btn-notes-download')).toHaveCount(0);
  });

  test('pages do not scroll sideways', async ({ page }) => {
    for (const path of ['/', '/notes/', '/audio/']) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
  });
});

test('desktop pages do not scroll sideways', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  for (const path of ['/', '/notes/', '/audio/']) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});

// The logo is drawn as outlines: a <text> element would render in whatever font the
// visitor happens to have (Times, on most machines), since SVG-as-<img> can't load fonts.
test('the Boojy logo SVG has no live text', async ({ request }) => {
  const svg = await (await request.get('/images/boojy-logo.svg')).text();
  expect(svg).not.toContain('<text');
});

// The Feedback section went 2026-09-11; the footer email is the only contact route on the
// homepage now, so guard that instead.
test('the footer carries the contact email', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.footer-email')).toHaveAttribute('href', 'mailto:tyr@boojy.org');
});

// Design is on hold (2026-10): its page isn't built and Cloudflare sends /design/ home.
// `astro preview` neither applies nor serves _redirects, so check the built file itself.
test('/design/ is not built and redirects home', async ({ page }) => {
  expect((await page.goto('/design/'))?.status()).toBe(404);
  const redirects = readFileSync('dist/_redirects', 'utf8');
  expect(redirects).toMatch(/^\/design\/\s+\/\s+302$/m);
});

test('nav and footer do not link to Design, and list Audio before Notes', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('a[href="/design/"]')).toHaveCount(0);
  await expect(page.locator('.site-nav-links a')).toHaveText(['Audio', 'Notes']);
  await expect(page.locator('.site-foot a')).toHaveText([
    'Audio',
    'Notes',
    'Privacy',
    'Terms',
    'GitHub',
    'tyr@boojy.org',
  ]);
});

test('app pages show four feature tiles and a link to the source on GitHub', async ({ page }) => {
  for (const app of ['notes', 'audio']) {
    await page.goto(`/${app}/`);
    await expect(page.locator('.tile')).toHaveCount(4);
    await expect(page.locator('.gh-line a')).toHaveAttribute(
      'href',
      `https://github.com/boojyorg/boojy-${app}`,
    );
    await expect(page.locator(`.horizon-${app} .site-foot`)).toHaveCount(1);
  }
});

test('unknown URLs return the 404 page', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.locator('.lost-title')).toHaveText('This page drifted out of orbit.');
  await expect(page.locator('.lost a[href="/"]')).toBeVisible();
});
