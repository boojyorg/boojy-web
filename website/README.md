# Boojy Website

Source for [boojy.org](https://boojy.org) — a **static [Astro](https://astro.build) site** (SSG +
React islands) on Cloudflare Pages. Every page ships fully-formed HTML; the interactive bits hydrate
as islands.

## Routes

File-based, under `src/pages/`. All routes are directory routes (`trailingSlash: 'always'`).

| Route | Notes |
|-------|-------|
| `/` | Hub — product grid (Audio · Notes), Why Boojy, feedback line |
| `/audio/` | OS-aware download CTA + platforms panel (island) |
| `/notes/` | Web CTA + downloads; version baked at build time from the GitHub API |
| `/privacy/`, `/terms/` | Legal content via `LegalLayout` (clean URLs; old `.html` 301 → here) |
| `*` (404) | `404.astro` → `dist/404.html`, served by Cloudflare for unmatched paths |

Retired routes (`/cloud/`, `/account/`, `/news/`, `/pricing`, `/subscribed`) 301 to `/`, and
`/design/` 302s to `/` while Boojy Design is on hold; see `public/_redirects`.
Nav: **Audio · Notes** plus GitHub.

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
| `pnpm test:unit` | vitest unit tests (`src/**/*.test.ts`) |
| `pnpm test:e2e` | Playwright smoke suite — run `pnpm build` first (tests the built `dist/`) |

**Gates before pushing:** `pnpm run check` + `pnpm build` + `pnpm lint` + `pnpm test:unit` +
`pnpm test:e2e`. The same five run in CI on every PR.

## Project structure

```
website/
├── astro.config.mjs    # static output, trailingSlash, sitemap
├── biome.json          # lint/format (.ts/.tsx/.js/.json/.css — .astro excluded; see AGENTS.md)
├── vitest.config.ts    # unit tests (src/**/*.test.ts)
├── playwright.config.ts # smoke suite vs the built dist/ (astro preview :4173)
├── tests/              # Playwright smoke specs
├── src/
│   ├── pages/          # file-based routes (.astro)
│   ├── layouts/        # BaseLayout (static <head> + SEO), LegalLayout
│   ├── components/     # .astro chrome (Nav, Footer, Sky, logos, ProductCards, Features)
│   │                   #   + the two React islands (Audio/NotesDownload)
│   ├── scripts/        # sky.ts (stars + solar system), logo.ts (flares, drags), reveal.ts
│   ├── hooks/          # usePlatformsPanel (download dropdown)
│   ├── content/        # site.ts, page-meta.ts, glyphs.json (logo outlines), legal/*.html
│   ├── lib/            # platform.ts, github-release.ts, wordmark.ts (logo geometry)
│   └── styles/         # inter.css, shared.css + space.css (global), per-page CSS, hashed by Astro
└── public/
    ├── _headers        # security headers + immutable caching for /_astro/*
    ├── _redirects      # legacy .html → clean-URL 301s, retired routes → /, /github
    ├── robots.txt      # → sitemap-index.xml
    └── images/
```

## Tech stack

- **Astro** (static) + two **React 19** islands (the download buttons), `@astrojs/sitemap`
- Plain CSS (no Tailwind), plain canvas JS for the sky, **TypeScript** strict + `noUncheckedIndexedAccess`
- **pnpm**, **Biome** for lint/format
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
- Browser smoke: homepage solar system, `/notes/` + `/audio/` download detection, fake URL → 404

## Links

- **Live site:** [boojy.org](https://boojy.org)
- **Project context:** [AGENTS.md](../AGENTS.md)
