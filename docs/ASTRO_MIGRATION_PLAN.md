# boojy.org — Astro Migration Plan

> **Purpose of this file:** an execution brief to paste into Claude Code. It describes how to
> refactor the current `website/` (Vite + React SPA) into an Astro static site, route by route,
> reusing the existing React components as islands. Hand this to Claude Code as the spec; it has
> enough detail to execute without re-deriving the architecture. Drafted 2026-05-29.

---

## 1. Goal

Move boojy.org from a **client-rendered React SPA** to a **statically-rendered Astro site** so that
every page ships real HTML in the initial response. This fixes the one concrete failure of the
current site: crawlers and social-card scrapers receive an empty `<div id="root">` shell and never
see titles, descriptions, or OG tags (these are injected at runtime by `usePageMeta`, too late for
bots).

**Success criteria (acceptance):**

1. `view-source:` on every public page shows the full content, correct `<title>`, meta description,
   canonical, and OG tags in the static HTML — no JS required.
2. Lighthouse SEO = 100; OG cards validate in a scraper (e.g. the Facebook/X debuggers).
3. All current routes resolve with the same URLs (or 301-redirect from old URLs — see §6).
4. Interactive pieces still work: starfield, FAQ accordion, OS-aware download buttons, account
   auth (Supabase) and Cloud checkout (Stripe).
5. Deploys to **Cloudflare Pages** as static output. No Vercel, no SSR runtime.
6. `pnpm`, Biome, and TS strict are in place.

---

## 2. Hard constraints (do not violate)

- **Stack:** Astro + TypeScript + React (islands). Reuse existing React components — do **not**
  rewrite their logic.
- **Hosting:** Cloudflare Pages only. **Vercel is barred** (no `@vercel/*`, no Vercel adapter).
- **Output: static.** The whole site is SSG + client islands. **Do not add an SSR adapter** unless
  a later requirement forces server rendering (see §5 note). Static `dist/` deploys directly to CF
  Pages.
- **One change at a time (velocity rule):** this pass is *framework only*. **Keep the existing
  plain CSS** (`public/css/shared.css`). Do **not** also convert styling to Tailwind/shadcn in this
  migration — that's a separate, later task. Do not touch the Supabase/Stripe logic.
- **TS strictness:** `strict: true` and `noUncheckedIndexedAccess: true`.
- Package manager: **pnpm**. Linter/formatter: **Biome**.

---

## 3. Current site inventory (source of truth for the port)

Located in `website/`. Vite 6 + React 19 + react-router-dom 7. Styling is **plain CSS**
(`public/css/shared.css`, imported in `main.tsx`). Analytics: umami script in `index.html`.
View transitions enabled via `<meta name="view-transition">`.

**Routes** (from `src/App.tsx`), all wrapped in `SiteLayout` (Starfield + Nav + Outlet + Footer):

| URL | Page component | Nature | SEO-critical |
|---|---|---|---|
| `/` | `HubPage` | Static content + hero glow | Yes |
| `/audio/` | `AudioPage` | Static + OS-aware download panel | Yes |
| `/notes/` | `NotesPage` | Static + live version from GitHub | Yes |
| `/cloud/` | `CloudPage` | Static pricing + FAQ; checkout gated | Yes |
| `/account/` | `AccountPage` | Supabase auth + Stripe billing | **No** (behind login) |
| `/privacy.html` | `PrivacyPage` | Static legal HTML | Yes |
| `/terms.html` | `TermsPage` | Static legal HTML | Yes |
| `/subscribed.html` | `SubscribedPage` | Static confirmation | Low |
| `/404.html`, `*` | `NotFoundPage` | 404 | n/a |

**Components / hooks and how each maps to Astro:**

| File | Today | Target |
|---|---|---|
| `SiteLayout.tsx` | Wrapper + `usePageMeta` runtime meta hack | Becomes `BaseLayout.astro` (meta in static `<head>`); the runtime meta hook is **deleted** |
| `Nav.tsx` | Site nav | Rebuild as `Nav.astro` (links are real HTML); island only if it has a mobile toggle |
| `Footer.tsx` | Footer | `Footer.astro` (static) |
| `Starfield.tsx` | Canvas animation | Keep as React island: `<Starfield client:idle />` |
| `FaqAccordion.tsx` | Accordion | React island: `<FaqAccordion client:visible />` |
| `HubHero.tsx` + `useHeroGlowTransition` | Hero + glow | Static markup; glow as island if needed (`client:idle`) |
| `ProductCards.tsx` / `ProductCloudCard.tsx` | Cards | Static `.astro` (or `client:load` only if interactive) |
| `usePlatformsPanel.ts` + `lib/platform.ts` | OS detect for downloads | React island on `/audio/`: `<DownloadPanel client:load />` |
| `useNotesVersion.ts` | Fetches latest version from GitHub at runtime | **Move to build-time**: fetch in the `.astro` frontmatter during build so the version is baked into static HTML (re-fetched on each deploy). Optional tiny island only if you want it always-live |
| `useAccount.ts` + `AccountPage` | Supabase auth + Stripe | Full client island: `<Account client:only="react" />` — no SEO value, render client-side |
| `CloudPage` checkout | Stripe, gated by `CLOUD_LAUNCHED` | Static pricing in `.astro`; the checkout button is an island |
| `content/site.ts`, `content/cloud.ts`, `content/page-meta.ts` | TS content + meta | **Keep as-is** — import directly into `.astro` frontmatter. `page-meta.ts` is already structured per-route and ports cleanly into `<head>` |
| `content/legal/*.html` | Raw legal HTML | Render via `set:html` in `privacy`/`terms` pages, or convert to `.md` later |
| `usePageMeta.ts` | Runtime DOM meta injection | **Delete** — replaced by static `<head>` |

---

## 4. Target stack & versions

Verified current stable as of 2026-05-29:

- **astro** `^6.4` (Astro 6 line; do not jump to 7 alpha)
- **@astrojs/react** (React islands)
- **@astrojs/sitemap** (sitemap.xml)
- **react** `^19` / **react-dom** `^19` (already in use)
- **@supabase/supabase-js** `^2` (already in use)
- **typescript** `~5.8`
- Dev: **@biomejs/biome**, **wrangler** (CF Pages deploy)

No Tailwind in this pass (see §2). No SSR adapter (see §5).

---

## 5. Astro config

`astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://boojy.org',
  output: 'static',            // fully static — no SSR adapter, no Vercel
  trailingSlash: 'always',     // matches current /audio/, /notes/ etc.
  build: { format: 'directory' },
  integrations: [react(), sitemap()],
});
```

> **Note on the adapter:** because account/cloud interactivity runs as client islands and the notes
> version is fetched at build time, the site needs **no server runtime**. Deploy the static `dist/`
> to Cloudflare Pages. Only if a future requirement needs real server rendering (e.g. server-side
> auth gating of a page's HTML) do you add `@astrojs/cloudflare` and switch `output`. Don't add it
> pre-emptively.

`tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": { "noUncheckedIndexedAccess": true }
}
```

---

## 6. URL preservation & redirects (decide before building)

The legal pages currently live at `/privacy.html` and `/terms.html` — these exact URLs may be
indexed and linked. Two options:

- **A (lowest risk):** keep the exact URLs by naming the files `src/pages/privacy.html.astro` and
  `src/pages/terms.html.astro` (Astro emits `/privacy.html`). Zero redirect work, nothing breaks.
- **B (cleaner long-term):** move to `/privacy/` and `/terms/`, set `<link rel="canonical">`, and
  add **301 redirects** from the old `.html` URLs in `public/_redirects` (CF Pages format).

**Recommendation: A** for this migration (preserve URLs, no SEO risk); revisit clean URLs later if
desired. Same applies to `/subscribed.html` and `/404.html` → use Astro's `src/pages/404.astro`.

---

## 7. SEO layer (the whole point)

In `BaseLayout.astro` `<head>`, rendered statically per page from props sourced from
`page-meta.ts`:

- `<title>`, `<meta name="description">`
- `<link rel="canonical" href={SITE + path}>`
- OG: `og:title`, `og:description`, `og:type`, `og:url`, `og:image` (images already exist as static
  files under `public/images/` — now they land in real HTML so scrapers read them)
- `theme-color`, favicon, apple-touch-icon (port from current `index.html`)
- Astro `<ClientRouter />` for view transitions (replaces the `view-transition` meta hack)
- umami analytics `<script>` (port verbatim from current `index.html`)

Add:

- `@astrojs/sitemap` → `/sitemap-index.xml`
- `public/robots.txt` referencing the sitemap
- **JSON-LD structured data**: `SoftwareApplication` on `/audio/` and `/notes/`; `Organization` on
  `/`. (Boosts rich results — low effort, high SEO value.)

---

## 8. Execution phases

Do these in order; commit per phase.

**Phase 0 — Branch & scaffold.** Create branch `astro-migration`. Scaffold Astro inside `website/`
(or a parallel dir then swap). Add `@astrojs/react`, `@astrojs/sitemap`. Convert to `pnpm`
(`pnpm import` from the existing lockfile, then delete `package-lock.json`).

**Phase 1 — Base layout + global styles.** `BaseLayout.astro` with the full static `<head>` (§7).
Import the existing `public/css/shared.css` globally. Port `Nav` and `Footer` to `.astro`.

**Phase 2 — Static pages.** Build `index`, `audio/index`, `notes/index`, `cloud/index`,
`privacy.html`, `terms.html`, `subscribed.html`, `404` as `.astro`, pulling copy from `site.ts` /
`cloud.ts` and meta from `page-meta.ts`. Render legal HTML via `set:html`.

**Phase 3 — Islands.** Wire interactive React components with the directives from the §3 table:
Starfield (`client:idle`), FaqAccordion (`client:visible`), DownloadPanel (`client:load`), Account
(`client:only="react"`), Cloud checkout button (island, gated). Move the GitHub version fetch into
`notes/index.astro` frontmatter (build-time).

**Phase 4 — SEO finishers.** Sitemap, robots.txt, JSON-LD, canonical, OG verified. Confirm every
page's `view-source` is complete.

**Phase 5 — Tooling.** TS strict config, Biome config carried over, `pnpm` scripts
(`dev`/`build`/`preview`).

**Phase 6 — Deploy.** Cloudflare Pages project pointed at `dist/` (build: `pnpm build`). Update the
GitHub Actions workflow to build + deploy via `wrangler pages deploy`. Confirm no Netlify/Vercel in
the pipeline.

**Phase 7 — Cleanup.** Delete `netlify.toml` (site is on CF Pages, not Netlify). Remove
`public/logo-test/`, and any legacy `public/css/shared.css`-duplicating `starfield.js` / `shared.js`
left from the pre-SPA era. Delete `usePageMeta.ts` and react-router.

**Phase 8 — Verify (acceptance §1).** Walk the success criteria; run Lighthouse; validate OG cards;
click through every route incl. account login and a (gated) cloud checkout.

---

## 9. Explicitly out of scope for this pass

- Converting CSS to Tailwind/shadcn (separate task — one change at a time).
- Any change to Supabase schema, auth flow, or Stripe products.
- Adding SSR / the Cloudflare adapter.
- Clean-URL migration for legal pages (defaulting to URL preservation, §6 option A).
- A blog/devlog system — note that **if you add one later, Astro content collections are the reason
  Astro was chosen**; scope it separately.

---

## 10. Open decisions to confirm before/while building

1. **Legal URLs:** §6 option A (preserve `.html`) vs B (clean + 301). Plan assumes **A**.
2. **Notes version:** build-time bake (recommended, static) vs keep it always-live as a tiny island.
3. **Nav interactivity:** is there a mobile menu toggle? If yes, it's the one part of `Nav` that
   needs to be an island; if not, `Nav.astro` is fully static.
```
