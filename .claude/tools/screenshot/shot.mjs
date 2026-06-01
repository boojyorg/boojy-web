#!/usr/bin/env node
// Boojy screenshot helper — drives the locally-installed Chrome via puppeteer-core.
// No bundled Chromium download; reuses the system browser.
//
// Usage:
//   node shot.mjs <url> [outPath] [--w=1440] [--h=900] [--full] [--sel=".hub-hero"]
//                       [--dpr=2] [--dark] [--wait=600] [--reduce-motion]
//
// Defaults: 1440x900, dpr=2, full page off, out=./shots/shot.png
// Exits non-zero on navigation/launch failure so callers can detect breakage.

import { existsSync, mkdirSync } from 'node:fs';
import { dirname, isAbsolute, resolve } from 'node:path';
import puppeteer from 'puppeteer-core';

const CHROME_CANDIDATES = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
];

function findChrome() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
  const hit = CHROME_CANDIDATES.find((p) => existsSync(p));
  if (!hit) {
    console.error('No Chrome found. Set CHROME_PATH or install Google Chrome.');
    process.exit(2);
  }
  return hit;
}

const argv = process.argv.slice(2);
const positional = argv.filter((a) => !a.startsWith('--'));
const flags = Object.fromEntries(
  argv
    .filter((a) => a.startsWith('--'))
    .map((a) => {
      const [k, v] = a.replace(/^--/, '').split('=');
      return [k, v ?? true];
    }),
);

const url = positional[0];
if (!url) {
  console.error('Usage: node shot.mjs <url> [outPath] [--w=] [--h=] [--full] [--sel=] [--dpr=] [--dark] [--wait=] [--reduce-motion]');
  process.exit(2);
}
const outArg = positional[1] ?? './shots/shot.png';
const out = isAbsolute(outArg) ? outArg : resolve(process.cwd(), outArg);
mkdirSync(dirname(out), { recursive: true });

const width = Number(flags.w ?? 1440);
const height = Number(flags.h ?? 900);
const dpr = Number(flags.dpr ?? 2);
const fullPage = Boolean(flags.full);
const waitMs = Number(flags.wait ?? 600);

const browser = await puppeteer.launch({
  executablePath: findChrome(),
  headless: 'new',
  args: ['--no-sandbox', '--hide-scrollbars', '--force-color-profile=srgb'],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: dpr });
  if (flags.dark) await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
  if (flags['reduce-motion'])
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  // Optional scroll offset (px) — useful for fixed-attachment backgrounds where
  // the experience differs by scroll position.
  if (flags.scroll) {
    const y = Number(flags.scroll);
    await page.evaluate((py) => window.scrollTo(0, py), y);
  }
  // Let canvas/islands settle (starfield draws on rAF, fonts swap in).
  await new Promise((r) => setTimeout(r, waitMs));

  if (flags.sel) {
    const el = await page.$(String(flags.sel));
    if (!el) {
      console.error(`Selector not found: ${flags.sel}`);
      process.exit(3);
    }
    await el.screenshot({ path: out });
  } else {
    await page.screenshot({ path: out, fullPage });
  }
  console.log(out);
} finally {
  await browser.close();
}
