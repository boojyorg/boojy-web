# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is (read first)

This is the **boojy.org marketing website** repo (`boojy`). Solo project by Tyr.

**The Vite + React SPA → Astro static-site migration is implemented on branch `astro-migration`**
(all phases green: `astro check` + `pnpm build` clean, manual walkthrough passed). The SPA is fully
removed — the tree is now Astro end to end. What's left before it's "done": **merge to `master` +
flip the CF Pages build settings in lockstep** (see the deploy trap below), then the deferred Biome
pass. Full spec: `docs/ASTRO_MIGRATION_PLAN.md`; live status: `dreams.md` §1.

**Why the migration:** the SPA ships an empty `<div id="root">`, so crawlers and social scrapers
see no title/description/OG tags. Astro ships fully-formed static HTML per page, fixing SEO, with
the interactive pieces layered back in as React islands. Scope is **framework only** — the plain
CSS, Supabase/Stripe logic, and copy are untouched; Tailwind and Biome are explicitly deferred.

Two architectural anchors for any change:

* **Static-first, no SSR.** The whole site is SSG + client islands. Account auth and Cloud checkout
  run client-side; the Notes version is fetched at build time. **Do not add an SSR adapter** (and
  **never Vercel**) unless a real server-rendering requirement appears.
* **The app lives in `website/`.** The repo root is a thin delegator; all source, config, and the
  dev server are in `website/`. Run gates from there.

## Repos (siblings under `projects/boojy/`)

| Repo | Path | Purpose |
|------|------|---------|
| `boojy` (this) | `Boojy/` | Marketing website — boojy.org |
| `boojy-notes` | `../boojy-notes/` | Notes app — notes.boojy.org |
| `boojy-cloud` | `../boojy-cloud/` | Supabase Edge Functions + migrations |
| `boojy-design` | `../boojy-design/` | Web image editor (the `.claude` system here is ported from it) |
| `Boojy Audio` | `../Boojy Audio/` | DAW |

## Commands

All from `website/`. **pnpm** (migrated from npm during Phase 0).

```bash
pnpm install
pnpm dev                 # Astro dev server — the user runs this; don't auto-start it
pnpm build               # astro build → website/dist/
pnpm preview             # serve the static build locally
pnpm exec astro check    # type + diagnostic gate (the pre-commit gate)
```

No automated test suite yet, and **Biome is deferred** to a follow-up commit after the migration
merges (so the migration diff stays reviewable). The gate today is `astro check` + a clean
`pnpm build`.

## Shipping workflow

1. **Branch** (never commit straight to `master`). Migration work is on `astro-migration`.
2. **Green the gates:** `pnpm exec astro check` + `pnpm build`.
3. **Commit, push.**
4. **Deploy is Cloudflare Pages Git integration** — a preview deploy per branch, production on
   `master`. No wrangler, no GitHub Actions.

> ⚠️ **Load-bearing deploy trap — CF Pages build settings are shared between production and
> preview.** A Pages project has one build command / output dir, used for both. The moment you
> switch it to `pnpm build` + `website/dist`, the next *production* build of `master` uses those
> settings too — but `master` is still the SPA until merge, so that build breaks. **Change the CF
> build settings in lockstep with merging `astro-migration` → `master`, not before.** Validate the
> real build on the branch preview deployment until then.

## Architecture (Astro target)

* **`website/src/pages/`** — file-based routes. `index.astro`, `audio/index.astro`,
  `notes/index.astro`, `cloud/index.astro`, `account/index.astro`, `privacy/index.astro`,
  `terms/index.astro`, `subscribed/index.astro`, `404.astro`. The legal/subscribed pages use **clean
  URLs** (`/privacy/`, `/terms/`, `/subscribed/`) because Astro can't emit a literal `/privacy.html`
  file from a page — **301s from the old `.html` URLs live in `public/_redirects`** (don't drop
  them; they preserve the indexed URLs).
* **`website/src/layouts/`** — `BaseLayout.astro` owns the full static `<head>` (title, description,
  canonical, OG, theme-color, favicons, umami script) sourced from `content/page-meta.ts`.
  `LegalLayout.astro` for privacy/terms.
* **Islands (React, logic unchanged):** `Starfield` (`client:idle`), `FaqAccordion`
  (`client:visible`), `AudioDownload` / `NotesDownload` (`client:load` — the OS-aware download CTAs;
  OS detection runs in `useEffect` so they SSR a universal default), `Account` (`client:only="react"`
  — behind login, no SEO value).
* **Static `.astro` chrome:** `Nav.astro` (+ tiny inline toggle/scroll script; active route from
  `Astro.url.pathname` at build time), `Footer.astro`, `ProductCards.astro`.
* **`website/src/content/`** — `site.ts`, `cloud.ts`, `page-meta.ts`, `legal/*.html` (rendered via
  `set:html` with `?raw`). Copy and meta come from here; don't hardcode.
* **`website/src/lib/`** — `platform.ts` (OS detect), `supabase.ts`, `notes-version.ts`
  (build-time GitHub fetch).

## Conventions & gotchas

* **Native View Transitions, not Astro's `<ClientRouter />`.** The site uses the browser-native
  `@view-transition { navigation: auto }` (in `shared.css`, with `view-transition-name` on navbar /
  starfield / hero glow). It works on a static MPA for free. Adding `<ClientRouter />` would
  re-introduce SPA navigation and risk a glow color-flash. Keep the CSS; ship no router.
* **The cross-page glow morph is a pre-paint `is:inline` script, not a React island.** Hydrating it
  flashes the destination color before React mounts. An `is:inline` script in `<head>` must set the
  origin color via a **root-level CSS variable on `documentElement`** (read synchronously from
  `sessionStorage`) **before** paint — do not query the glow element (it isn't parsed yet). Logic is
  lifted verbatim from the old `useHeroGlowTransition.ts`; only delivery changes.
* **Notes version is baked at build time.** `lib/notes-version.ts` fetches the latest tag from the
  GitHub API in `notes/index.astro` frontmatter. It **must never break the build** — AbortController
  timeout + try/catch returning a fallback string. Guard `tags[0]` (see strict TS below).
* **TypeScript is strict** (`strict` + `noUncheckedIndexedAccess`). Turning these on surfaces
  `arr[i]`-as-possibly-undefined errors across existing `lib/` code, not just new files — handle
  them, use `import type` for type-only imports.
* **CSS lives in `src/styles/`** (moved from `public/css/`) so Astro bundles + content-hashes it;
  `_headers` caches `/_astro/*` immutably. `shared.css` is global in `BaseLayout`; per-page CSS is
  imported in each page's frontmatter.
* **umami `<script>` is `is:inline`** so Astro leaves it untouched. Native MPA navigation means
  umami counts pageviews automatically — no manual route tracking needed.
* **Keep the docs current.** Structure/roadmap changes update this file and `README.md` in the same
  commit; a release bumps `package.json` + adds a `CHANGELOG.md` entry.

### Supabase (durable facts)

* **Project ref:** `wupmcvhzstgsdrvcigtm`
* **Key tables:** `profiles`, `storage_usage`, `notes_metadata`
* **Auth providers:** Email, Google, Apple
* **Edge Functions** (in `boojy-cloud`): create-checkout, stripe-webhook, sync-push, sync-pull,
  sync-delete, storage-check, auth-webhook
* Edge Function calls need both `apikey` and `Authorization` headers; functions deploy with
  `--no-verify-jwt`. Use `.maybeSingle()` not `.single()` for queries that may return no rows.

### Stripe (durable facts)

* Currently **test mode**. Product: **Boojy Cloud Orbit**. Checkout is **gated** — `CLOUD_LAUNCHED`
  is `false`, so `/cloud/` shows a disabled "Coming soon" button and no checkout island is wired
  this pass. Customer Portal handles subscription management once live.

## Memory Synchronization Rule

`dreams.md` is the project's working memory. **At the start of every session, read `dreams.md`** to
establish the active target. As work progresses, flip its task checkboxes `- [ ]` → `- [x]`, log
manual UX bugs into §2, and keep §3 (gotchas / cost) current. The post-edit hook auto-injects
validation failures into §2 — clear stale/transient ones once gates are green.

## Context Hygiene Gate

Monitor session context. When utilization crosses ~50%, pause active loops, summarize the current
migration phase + files touched, update `dreams.md`, and run `/compact`.
