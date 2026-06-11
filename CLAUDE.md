# CLAUDE.md

Local guidance for Boojy Web (boojy.org). **Suite-wide process/conventions live in the root
`~/Documents/Projects/boojy/CLAUDE.md`** (memory model, changelog/release, branch discipline,
context-hygiene, working prefs); this file is the app-specific architecture, stack, and gotchas.
Per-area gotchas live in **`.claude/rules/`**; the active target lives in **`dreams.md`**.

## What this is (read first)

This is the **boojy.org marketing website** repo (`boojy-web`). Solo project by Tyr. It's an **Astro
static site** (SSG + React islands), live in production. It replaced a Vite + React SPA whose empty
`<div id="root">` was invisible to crawlers and social scrapers; Astro ships fully-formed static
HTML per page (real `<title>`/description/OG), with the interactive pieces layered back in as React
islands. Scope of that migration was **framework only** — the plain CSS, Supabase/Stripe logic, and
copy were untouched; a Tailwind/shadcn restyle is a separate future task. Historical spec:
`docs/archive/ASTRO_MIGRATION_PLAN.md`.

Two architectural anchors for any change:

* **Static-first, no SSR.** The whole site is SSG + client islands. Account auth and Cloud checkout
  run client-side; the Notes version is fetched at build time. **Do not add an SSR adapter** (and
  **never Vercel**) unless a real server-rendering requirement appears.
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
```

No automated test suite yet. **The gates are `pnpm exec astro check` + a clean `pnpm build` +
`pnpm lint`.** The same three run in CI (`.github/workflows/ci.yml`) on every PR and on `master` —
so a red PR check = a gate you skipped locally.

**Biome scope:** it lints/formats `.ts/.tsx/.js/.mjs/.json/.css` only — `.astro` and the legal
`.html` content files are **excluded** (Biome parses `.astro` frontmatter as standalone JS and would
false-flag every template-only import/var as unused; `astro check` is the gate for `.astro`). Three
rules are off in `biome.json` for intentional, recurring patterns: `noNonNullAssertion` (deliberate
`!` with `noUncheckedIndexedAccess`), `noUnknownTypeSelector` (false-positives on valid
`::view-transition-*` CSS), `useValidAnchor` (deferred a→button styling work).

## Shipping (repo-specific)

General branch discipline → root `CLAUDE.md`. Web specifics:

* `master` is **branch-protected** and requires the "Lint · Check · Build" CI check — every change
  needs a branch + PR.
* **Local gates:** `pnpm exec astro check` + `pnpm build` + `pnpm lint` (the same three CI runs).
* **Deploy is Cloudflare Pages Git integration** (preview per branch, production on `master`).
  GitHub Actions runs CI gates only, never the deploy. ⚠️ **CF build settings are shared
  prod/preview** — before any framework-level build change, read `.claude/rules/caching-and-deploy.md`.

## Architecture

* **`website/src/pages/`** — file-based routes: `index`, `audio/`, `notes/`, `design/`, `cloud/`, `news/`
  (`index` archive + `[...slug]` post pages from the `news` collection), `account/`, `privacy/`,
  `terms/`, `subscribed/`, `404`. Legal/subscribed pages use **clean URLs** + 301s from the old
  `.html` (see `.claude/rules/caching-and-deploy.md`).
* **`website/src/layouts/`** — `BaseLayout.astro` owns the full static `<head>` (title, description,
  canonical, OG, theme-color, favicons, analytics slot) from `content/page-meta.ts`. `LegalLayout.astro` for
  privacy/terms. (View-transition + glow rules: `.claude/rules/view-transitions-and-glow.md`.)
* **Islands (React, logic unchanged):** `Starfield` (`client:idle`), `FaqAccordion`
  (`client:visible`; **currently unmounted** — was only on `/cloud`, whose FAQ is deferred —
  component kept for when it returns), `AudioDownload` / `NotesDownload` (`client:load`; OS detect runs in
  `useEffect` so they SSR a universal default), `Account` (`client:only="react"` — behind login),
  `Feedback` (`client:visible`; homepage form → `feedback` Edge Function + Turnstile —
  see `.claude/rules/feedback.md`).
* **Static `.astro` chrome:** `Nav.astro` (+ inline toggle/scroll script; active route from
  `Astro.url.pathname` at build time), `Footer.astro`, `ProductCards.astro`.
* **`website/src/content/`** — `site.ts`, `cloud.ts`, `page-meta.ts`, `legal/*.html` (rendered via
  `set:html` with `?raw`). Copy + meta come from here; don't hardcode. **Content collection:** `news`
  (defined in `src/content.config.ts`, glob loader over `src/content/news/*.md`) — one markdown file
  per monthly post; a new post = a new `.md` file (title/date/summary frontmatter + prose body).
* **`website/src/lib/`** — `platform.ts` (OS detect), `supabase.ts`, `github-release.ts` (build-time
  version + download-URL fetch for Audio & Notes).
* **Backend facts (Supabase, Stripe) + the build-time Notes version → `.claude/rules/`** (loaded
  when you touch account/cloud/notes).

## Conventions

* **TypeScript is strict** (`strict` + `noUncheckedIndexedAccess`) — `arr[i]` is possibly-undefined
  across existing `lib/` code, not just new files. Handle it; use `import type` for type-only imports.
* **CSS lives in `src/styles/`** (not `public/css/`) so Astro bundles + content-hashes it.
  `shared.css` is global in `BaseLayout`; per-page CSS is imported in each page's frontmatter.
  Inter loads via `src/styles/inter.css` (a hand-rolled latin + latin-ext `@font-face`, **not** the
  full `@fontsource-variable/inter` import — the other 5 subsets are latin-only dead weight in `dist`).

## Memory & docs (repo-specific)

General memory model + context-hygiene → root `CLAUDE.md`. Web specifics:

* **`dreams.md`** — §1 only: the active engineering target + open milestones. Roadmap sequence lives
  in `docs/ROADMAP.md`; unscheduled items in `docs/BACKLOG.md`.
* **`.claude/rules/`** — one topic per file (per-area gotchas + durable backend facts: Supabase,
  Stripe, caching/deploy, view-transitions/glow, feedback). Loaded when you touch matching files.
