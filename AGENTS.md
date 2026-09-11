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
islands. Scope of that migration was **framework only** — the plain CSS, Supabase/Stripe logic, and
copy were untouched; a Tailwind/shadcn restyle is a separate future task. Historical spec:
`docs/archive/ASTRO_MIGRATION_PLAN.md`.

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
| `boojy-notes` | `../boojy-notes/` | Notes app — notes.boojy.org |
| `boojy-cloud` | `../boojy-cloud/` | Supabase Edge Functions + migrations |
| `boojy-design` | `../boojy-design/` | Web image editor (the `.claude` system here came from it) |
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
pnpm test:unit           # vitest (src/**/*.test.ts — currently github-release.ts)
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

* **`website/src/pages/`** — file-based routes: `index`, `notes/`, `audio/`, `design/`,
  `privacy/`, `terms/`, `404`. Legal pages use **clean URLs** + 301s from the old `.html`
  (see `.claude/rules/caching-and-deploy.md`). Retired routes 301 to `/` in `public/_redirects`:
  `/cloud/` and `/account/` (Boojy Cloud drop, 2026-08), `/news/*` and `/subscribed/` (removed
  2026-09 — the site has no news page, no newsletter, and no account functionality).
* **`website/src/layouts/`** — `BaseLayout.astro` owns the full static `<head>` (title, description,
  canonical, OG, theme-color, favicons, analytics slot) from `content/page-meta.ts`. `LegalLayout.astro` for
  privacy/terms. (View-transition + glow rules: `.claude/rules/view-transitions-and-glow.md`.)
* **Islands (React):** `Starfield` (`client:idle`), `AudioDownload` / `NotesDownload`
  (`client:load`; OS detect runs in `useEffect` so they SSR a universal default). The homepage
  Feedback section is gone (the form went 2026-09, the mailto line after it on 2026-09-11); the
  footer email is the site's contact route and `/#feedback` is a dead anchor.
* **Static `.astro` chrome:** `Nav.astro` (+ inline toggle/scroll script; active route from
  `Astro.url.pathname` at build time), `Footer.astro`, `ProductCards.astro`.
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
  `shared.css` is global in `BaseLayout`; per-page CSS is imported in each page's frontmatter.
  Inter loads via `src/styles/inter.css` (a hand-rolled latin + latin-ext `@font-face`, **not** the
  full `@fontsource-variable/inter` import — the other 5 subsets are latin-only dead weight in `dist`).

## Memory & docs (repo-specific)

General memory model + context-hygiene → suite root `AGENTS.md`. Web specifics:

* **`docs/BACKLOG.md`** — the one planning file: decisions, what's next, unscheduled items. There is
  no `dreams.md` and no roadmap file; shipped work goes to `CHANGELOG.md`.
* **`.claude/rules/`** — one topic per file (per-area gotchas + durable facts: caching/deploy,
  view-transitions/glow, release-fetch). Read the matching file when touching matching areas.

## Claude Code–specific

Only applies when the agent is Claude Code; other agents can skip this section.

* Claude Code loads `.claude/rules/` files conditionally when touching matching paths.
* `CLAUDE.md` in this repo is a symlink to this file.
