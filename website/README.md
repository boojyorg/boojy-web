# Boojy Website

Source for [boojy.org](https://boojy.org) — a **static [Astro](https://astro.build) site** (SSG +
React islands) on Cloudflare Pages. Every page ships fully-formed HTML; the interactive bits hydrate
as islands.

## Routes

File-based, under `src/pages/`. All routes are directory routes (`trailingSlash: 'always'`).

| Route | Notes |
|-------|-------|
| `/` | Hub — 2×2 product grid (Audio · Notes · Design · Cloud), Why Boojy, latest-news teaser, feedback form |
| `/audio/` | OS-aware download CTA + platforms panel (island) |
| `/notes/` | Web CTA + downloads; version baked at build time from the GitHub API |
| `/design/` | Web image editor — link to design.boojy.org, value props, feature checklist (version hardcoded; no GH Releases) |
| `/cloud/` | Free-only sync service (live — powers Notes sync; Audio support coming); no paid tier, no FAQ |
| `/news/`, `/news/<post>/` | Monthly "what's new" notes — `news` content collection (one `.md` per post) |
| `/account/` | Supabase auth; billing UI gated by `CLOUD_LAUNCHED` (`client:only` island) |
| `/privacy/`, `/terms/` | Legal content via `LegalLayout` (clean URLs; old `.html` 301 → here) |
| `/subscribed/` | Post-signup confirmation |
| `*` (404) | `404.astro` → `dist/404.html`, served by Cloudflare for unmatched paths |

Cloud is **free-only** (Boojy Notes syncs through it), with Boojy Audio support to follow.
Nav: **Audio · Notes · Design · Cloud · Account**.

## Local development

```bash
cd website
pnpm install
pnpm dev          # http://localhost:4321
```

| Command | What it does |
|---|---|
| `pnpm dev` | Astro dev server |
| `pnpm build` | Static build → `dist/` |
| `pnpm preview` | Serve the production build locally |
| `pnpm run check` | `astro check` — type/diagnostic gate |
| `pnpm lint` / `pnpm lint:fix` | Biome lint + format (check / apply) |

**Gates before pushing:** `pnpm run check` + `pnpm build` + `pnpm lint`. The same three run in CI on
every PR.

## Project structure

```
website/
├── astro.config.mjs    # static output, trailingSlash, sitemap (filters /account/ + /subscribed/)
├── biome.json          # lint/format (.ts/.tsx/.js/.json/.css — .astro excluded; see CLAUDE.md)
├── src/
│   ├── pages/          # file-based routes (.astro)
│   ├── layouts/        # BaseLayout (static <head> + SEO), LegalLayout
│   ├── components/      # .astro chrome (Nav, Footer, ProductCards) + React islands
│   │                   #   (Starfield, FaqAccordion, Audio/NotesDownload, Account, Feedback)
│   ├── content.config.ts # `news` content collection (glob over content/news/*.md)
│   ├── content/        # site.ts, cloud.ts, page-meta.ts, legal/*.html, news/*.md
│   ├── lib/            # platform.ts, supabase.ts, github-release.ts (build-time version/URL fetch)
│   └── styles/         # inter.css (latin subset), shared.css (global) + per-page CSS, hashed by Astro
└── public/
    ├── _headers        # security headers + immutable caching for /_astro/*
    ├── _redirects      # legacy .html → clean-URL 301s, /pricing → /cloud/, /github
    ├── robots.txt      # → sitemap-index.xml
    └── images/
```

## Tech stack

- **Astro** (static) + **React 19** islands (`@astrojs/react`), `@astrojs/sitemap`
- Plain CSS (no Tailwind), **TypeScript** strict + `noUncheckedIndexedAccess`
- **pnpm**, **Biome** for lint/format
- **Supabase** JS on `/account/` (auth; billing gated until Cloud launch)
- Native browser View Transitions (no Astro `<ClientRouter />`)

## Deployment

**Cloudflare Pages Git integration** (no wrangler, no Actions-driven deploy):

| Setting | Value |
|---------|-------|
| Root directory | `website` |
| Build command | `pnpm build` |
| Output directory | `dist` |

Pushes to `master` deploy production; other branches get preview deploys. The repo-root
[`package.json`](../package.json) also exposes a `build` script that runs the build inside `website/`.

### Deploy verification

- `curl -s https://boojy.org/ | grep '<title>'` → real per-route title in the raw HTML (not an empty
  `<div id="root">`)
- `curl -sI https://boojy.org/privacy.html` → `301` to `/privacy/`
- Browser smoke: hub starfield, `/audio/` download detection, `/account/` sign-in, fake URL → 404

## Links

- **Live site:** [boojy.org](https://boojy.org)
- **Project context:** [CLAUDE.md](../CLAUDE.md)
