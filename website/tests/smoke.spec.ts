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
  { path: '/design/', title: 'Boojy Design – Image Editor in Your Browser' },
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

test('homepage shows the orbit logo twice and both product cards, Audio first', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('svg.boojy-mark')).toHaveCount(2); // nav + hero
  await expect(page.locator('.product-card')).toHaveCount(2);
  await expect(page.locator('.product-card').first()).toHaveAttribute('data-product', 'audio');
  await expect(page.locator('.product-card').last()).toHaveAttribute('data-product', 'notes');
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
  await expect(page.locator('.btn-download')).toBeVisible();
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

test('/notes/ primary CTA opens the web app', async ({ page }) => {
  await page.goto('/notes/');
  const cta = page.getByRole('link', { name: /open in web/i });
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute('href', 'https://notes.boojy.org');
});

// The Feedback section went 2026-09-11; the footer email is the only contact route on the
// homepage now, so guard that instead.
test('the footer carries the contact email', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.footer-email')).toHaveAttribute('href', 'mailto:tyr@boojy.org');
});

// Design was unlisted 2026-09: the page stays live and linkable, but nothing on the
// site points at it. These two guard both halves of that.
test('/design/ is still reachable by direct link', async ({ page }) => {
  const response = await page.goto('/design/');
  expect(response?.status()).toBe(200);
});

test('nav and footer do not link to Design, and list Audio before Notes', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('a[href="/design/"]')).toHaveCount(0);
  await expect(page.locator('.nav-products .nav-product')).toHaveText(['Audio', 'Notes']);
  await expect(page.locator('.footer-row-1 a')).toHaveText(['Audio', 'Notes', 'Privacy', 'Terms']);
});

test('unknown URLs return the 404 page', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.locator('.not-found-title')).toHaveText('Page Not Found');
});
