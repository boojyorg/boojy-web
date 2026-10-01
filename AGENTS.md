# AGENTS.md

Local guidance for coding agents working on Boojy Web (boojy.org). **Suite-wide process/conventions
live in the suite root's `AGENTS.md` (`~/Documents/Projects/boojy/AGENTS.md`)** (memory model,
changelog/release, branch discipline, context-hygiene, working prefs); this file is the app-specific
architecture, stack, and gotchas. Per-area gotchas live in **`.claude/rules/`** (plain markdown —
readable by any agent); the one planning file is **`docs/BACKLOG.md`**.

## What this is (read first)

This is the **boojy.org marketing website** repo (`boojy-web`). Solo project by Tyr. It's an **Astro
static site** (SSG + React islands), live in production. It replaced a Vite + React SPA whose empty
`<div id="root">` was invisible to crawlers and social scrapers; Astro ships fully-formed static
HTML per page (real `<title>`/description/OG), with the interactive pieces layered back in as React
islands.

Two architectural anchors for any change:

* **Static-first, no SSR.** The whole site is SSG + client islands; the Notes version is fetched at
  build time. **Do not add an SSR adapter** (and **never Vercel**) unless a real server-rendering
  requirement appears.
* **The app lives in `website/`.** The repo root is a thin delegator; all source, config, and the
  dev server are in `website/`. Run gates from there.

## Repos (siblings under `projects/boojy/`)

| Repo | Path | Purpose |
|------|------|---------|
| `boojy-web` (this) | `boojy-web/` | Marketing website — boojy.org |
| `boojy-notes` | `../boojy-notes/` | Notes desktop app (macOS, Windows, Linux) |
| `boojy-cloud` | `../boojy-cloud/` | Dormant Supabase backend (private; the site doesn't use it) |
| `boojy-design` | `../boojy-design/` | Web image editor (private, on hold; `/design/` redirects home) |
| `Boojy Audio` | `../boojy-audio/` | DAW |

## Commands

All from `website/`. **pnpm.**

```bash
pnpm install
pnpm dev                 # Astro dev server
pnpm build               # astro build → website/dist/
pnpm preview             # serve the static build locally
pnpm exec astro check    # type + diagnostic gate
pnpm lint                # biome check (lint + format diagnostics)
pnpm lint:fix            # biome check --write (apply formatting + safe fixes)
pnpm test:unit           # vitest (src/**/*.test.ts)
pnpm test:e2e            # Playwright smoke suite — needs a fresh `pnpm build` first
```

**The gates are `pnpm exec astro check` + a clean `pnpm build` + `pnpm lint` + `pnpm test:unit` +
`pnpm test:e2e`.** All five run in CI (`.github/workflows/ci.yml`) on every PR and on `master` —
so a red PR check = a gate you skipped locally. The smoke suite (`tests/smoke.spec.ts`) runs
against the **built `dist/`** via `astro preview` on port 4173 (Playwright starts/stops the server
itself; it serves but never builds, so re-run `pnpm build` after changes or the tests check stale
output).

**Biome scope:** it lints/formats `.ts/.tsx/.js/.mjs/.json/.css` only — `.astro` and the legal
`.html` content files are **excluded** (Biome parses `.astro` frontmatter as standalone JS and would
false-flag every template-only import/var as unused; `astro check` is the gate for `.astro`). Three
rules are off in `biome.json` for intentional, recurring patterns: `noNonNullAssertion` (deliberate
`!` with `noUncheckedIndexedAccess`), `noUnknownTypeSelector` (false-positives on valid
`::view-transition-*` CSS), `useValidAnchor` (deferred a→button styling work).

## Shipping (repo-specific)

General branch discipline → suite root `AGENTS.md`. Web specifics:

* `master` is **branch-protected** and requires the "Lint · Check · Build" CI check — every change
  needs a branch + PR.
* **Local gates:** `pnpm exec astro check` + `pnpm build` + `pnpm lint` + `pnpm test:unit` +
  `pnpm test:e2e` (the same five CI runs; the job name stays "Lint · Check · Build" because branch
  protection pins that exact string).
* **Deploy is Cloudflare Pages Git integration** (preview per branch, production on `master`).
  GitHub Actions runs CI gates only, never the deploy. ⚠️ **CF build settings are shared
  prod/preview** — before any framework-level build change, read `.claude/rules/caching-and-deploy.md`.

## Architecture

* **`website/src/pages/`** — file-based routes: `index`, `notes/`, `audio/`,
  `privacy/`, `terms/`, `404`. Legal pages use **clean URLs** + 301s from the old `.html`
  (see `.claude/rules/caching-and-deploy.md`). Retired routes 301 to `/` in `public/_redirects`:
  `/cloud/` and `/account/` (Boojy Cloud drop, 2026-08), `/news/*` and `/subscribed/` (removed
  2026-09 — the site has no news page, no newsletter, and no account functionality). `/design/`
  302s to `/` while Boojy Design is on hold (2026-10).
* **`website/src/layouts/`** — `BaseLayout.astro` owns the full static `<head>` (title, description,
  canonical, OG, theme-color, favicons, analytics slot) from `content/page-meta.ts`. `LegalLayout.astro` for
  privacy/terms. (View-transition + glow rules: `.claude/rules/view-transitions-and-glow.md`.)
* **The space design (2026-09 redesign, spec = the Sky Lab):** `Sky.astro` + `scripts/sky.ts`
  (plain JS, no React) draw the stars on every page and, on the homepage, the solar system around
  the logo's sun (rings, belt, draggable planets). `BoojyWordmark` / `AppLockup` / `AppWordmark`
  draw the logos from Poppins outlines (`lib/wordmark.ts` + `content/glyphs.json`), so no web font
  is involved; `scripts/logo.ts` handles the sun/N/A flares and dragging the j's dot and the 404
  moon. Speed + interaction rules: `.claude/rules/sky-and-motion.md`.
* **Islands (React):** only `AudioDownload` / `NotesDownload` (`client:load`; OS detect runs in
  `useEffect` so they SSR a universal default). The homepage ships no React. The footer email is
  the site's contact route.
* **Static `.astro` chrome:** `Nav.astro` (sits at the top and scrolls away; active route from
  `Astro.url.pathname` at build time), `Footer.astro` (one row; on app pages it sits on the
  planet horizon), `ProductCards.astro`, `Features.astro`.
* **`website/src/content/`** — `site.ts`, `page-meta.ts`, `legal/*.html` (rendered via
  `set:html` with `?raw`). Copy + meta come from here; don't hardcode. No content collections.
* **`website/src/lib/`** — `platform.ts` (OS detect), `github-release.ts` (build-time
  version + download-URL fetch for Audio & Notes).
* **The build-time Notes version → `.claude/rules/`** — read the matching rule file when you touch
  notes code. (The site has **no backend**: the Supabase/Stripe integrations were removed 2026-08
  with the Boojy Cloud drop.)

## Conventions

* **TypeScript is strict** (`strict` + `noUncheckedIndexedAccess`) — `arr[i]` is possibly-undefined
  across existing `lib/` code, not just new files. Handle it; use `import type` for type-only imports.
* **CSS lives in `src/styles/`** (not `public/css/`) so Astro bundles + content-hashes it.
  `shared.css` + `space.css` (tokens, sky, nav, footer, buttons, motion) are global in
  `BaseLayout`; per-page CSS (`home.css`, `product.css` for Notes + Audio, `lost.css`,
  `legal.css`) is imported in each page's frontmatter.
  Inter loads via `src/styles/inter.css` (a hand-rolled latin + latin-ext `@font-face`, **not** the
  full `@fontsource-variable/inter` import — the other 5 subsets are latin-only dead weight in `dist`).

## Memory & docs (repo-specific)

General memory model + context-hygiene → suite root `AGENTS.md`. Web specifics:

* **`docs/BACKLOG.md`** — the one planning file: decisions, what's next, unscheduled items. There is
  no `dreams.md` and no roadmap file; shipped work goes to `CHANGELOG.md`.
* **`.claude/rules/`** — one topic per file (per-area gotchas + durable facts: caching/deploy,
  view-transitions/glow, release-fetch, sky-and-motion). Read the matching file when touching matching areas.

## Claude Code–specific

Only applies when the agent is Claude Code; other agents can skip this section.

* Claude Code loads `.claude/rules/` files conditionally when touching matching paths.
* `CLAUDE.md` in this repo is a one-line pointer to this file.
