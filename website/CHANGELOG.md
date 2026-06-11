# Changelog

## Unreleased

### Bug Fixes
- **Feedback form actually delivers** — Send now opens the visitor's email app pre-filled to
  tyr@boojy.org (the `feedback` Edge Function was never built, so every submission errored and was
  lost; the always-pass Turnstile **test** key also no longer ships). Real backend tracked as P4.
- **Design card CTA visible** — the homepage Design card's "Learn more" button had no accent fill
  (near-black on dark, read as disabled); it now matches the other three products.
- **Honest platform label on /audio** — Linux/unknown-OS/no-JS visitors no longer see "(Silicon)"
  next to the generic fallback download button.
- **Dead analytics tag removed** — the self-hosted umami app (Railway) was gone and its script
  404'd silently on every page view; Cloudflare Web Analytics beacon to follow.

### Improvements
- **Stale Cloud copy aligned** — homepage + `/cloud/` meta descriptions and the account-page blurb
  no longer say Cloud is "rolling out soon" (it's live: free Notes sync, 500 MB).
- **SEO pass** — every hero page gets a (screen-reader-only) `<h1>`; `/account/` + `/subscribed/`
  are `noindex`; news posts emit `og:type=article` + published time + BlogPosting JSON-LD;
  `/cloud/` gets SoftwareApplication JSON-LD; `/news/` drops the "monthly" promise.
- **"All versions" links** — `/audio` and `/notes` hero meta lines link to each product's GitHub
  releases page (old builds + full release notes).
- **Dead code removed** — `ProductCloudCard.astro` (unmounted since the 2×2 grid refactor) + its
  icon constants and ~230 lines of orphaned `.product-cloud-*` / `.hub-signup-*` CSS;
  `INFRASTRUCTURE_SETUP.md` archived; stale suite-dashboard script removed (lives in the
  suite-umbrella repo now).

## 2026-06-10 (deploy)

### Features
- **`/design` page added + Boojy Design promoted to live** — Boojy Design is now live at
  **design.boojy.org**, so it gets a real page mirroring `/audio`: wordmark hero with an **amber**
  nebula glow (matching the wordmark badge), the v0.4.0 screenshot, three value props (free in your
  browser / layers & live text / own your files), an "Open in Web → design.boojy.org" CTA, and a
  Current / Coming Soon checklist sourced from `boojy-design`'s FEATURE_TRACKER (6 shipped + 6
  planned). The homepage hub card flips from "Coming soon" (muted, no link) to an **Early access**
  card linking to `/design/`, with the screenshot replacing the placeholder. Design now appears in
  the nav, mobile menu, and footer; `/design → /design/` redirect added.

### Improvements
- **Canonical product order is now Audio · Notes · Design · Cloud** — apps by maturity, with the
  Cloud service last (it's not an app). Applied to the desktop nav, mobile menu, footer, and the
  homepage 2×2 product grid.
- **`/design` meta line links to GitHub** — `boojy-design` is now public at
  `boojyorg/boojy-design`, so the hero meta line gained a GitHub link (matching `/audio`/`/notes`).
- **`/design` CTA polish** — the "Open in Web" button now matches the Notes hero CTA (globe icon +
  label) with a `v0.4.0 · Early access` meta line beneath it, and the Design wordmark in the hero is
  ~15% larger across all breakpoints. Removed the unused `CLOUD_DESCRIPTION` string from `site.ts`.
- **`/cloud` rebuilt as a free-only service page** — dropped the paid "Orbit" tier entirely
  (pricing cards, the "We believe in fair software" subscription-ethics section, and the paid FAQ
  removed). Now mirrors `/audio` + `/notes`: wordmark hero with a **white** nebula glow, a
  device-sync diagram standing in for the app screenshot, three value props (cross-device sync /
  quick & quiet / always optional), and a Current / Coming Soon checklist. Cleaned the Orbit/
  subscription language out of `cloud.ts`, the account page meta, and the June news post. _(Deferred:
  legal Terms "Cloud Subscriptions" section + the account-dashboard tier UI, which touch the live
  Stripe/Supabase billing.)_
- **New Boojy Cloud wordmark** — recoloured the cloud glyph from blue to white (text stays black).
- **`/notes` Features checklist + Cloud card removed** — added a Current / Coming Soon two-column
  checklist below the three value-prop boxes (mirrors `/audio`, teal checks). Current lists the six
  shipped pillars; Coming Soon lists Linux support, tablet/touch layout, and smoother editing. Removed
  the Boojy Cloud card from the page, and fixed the stale "Offline first" copy — sync is live, so it
  now reads "Works offline, no account needed. Optional cloud sync across your devices."
- **`/notes` CTA is now web-first** — removed the primary "Download" button; "Open in Web" is the
  single CTA, restyled to the translucent glass look. Desktop installers (macOS, Windows) move into
  the "Other platforms" dropdown as direct download links alongside the GitHub all-releases link,
  mirroring the `/audio` panel. OS detection now only highlights the visitor's platform row.
- **Homepage hero copy** — tagline now "Your creative space." / "Free, open source software. Made
  by Tyr." (was "a creative suite" / "Free creative software. Made by Tyr."). Plays on the cosmic
  backdrop and surfaces the open-source angle.
- **New Boojy Notes wordmark** — refreshed art, and the file renamed `Notes-text-logo.png` →
  `notes-text-logo.png` (lowercase, matching the other wordmarks). References updated in `site.ts`
  and the `/notes` hero; the old capitalised name would 404 on Cloudflare's case-sensitive build.
- **New Boojy Audio wordmark** — refreshed `audio-text-logo.png` on the hub product card and the
  `/audio` hero. Height-driven sizing unchanged, so no layout shift.
- **`/audio` page refresh for v0.5.2** — removed the disabled "Open in Web" button (the app
  doesn't run in the browser yet) and the Boojy Cloud card; added a two-column
  Features / Coming Soon checklist (6 + 6, blue checks vs orange arrows) below the three
  value-prop cards. Plugin card corrected to VST3-only (it over-claimed AU support); Coming
  Soon sticks to the v0.6 "Sound" scope. New v0.5.2 screenshot (here + the homepage product
  card); release fallback version bumped to v0.5.2 Beta.

## 2026-05-23 (deploy)

### Added
- **Repo-root `package.json`** — Cloudflare Pages build delegates `npm ci` + Vite build into `website/`

### Changed
- **Deploy docs** — Cloudflare settings (empty root directory, output `website/dist`) and troubleshooting notes

## 2026-05-23 (SEO + cleanup)

### Changed
- **`usePageMeta`** — per-route title, description, and Open Graph tags (ported from static HTML)
- **`_redirects`** — simplified to external redirects + SPA catch-all
- **Sitemap** — `lastmod` updated to 2026-05-23

### Removed
- Orphaned static JS (`account.js`, `hub.js`, `audio.js`, `notes.js`) superseded by React

## 2026-05-23 (legal + misc)

### Added
- **React routes** — `/privacy.html`, `/terms.html`, `/subscribed.html`, catch-all 404
- **`LegalLayout`**, **`usePageMeta`**, legal body content in `src/content/legal/`

### Changed
- **SPA fallback** — `_redirects` catch-all `/* → index.html`
- **Footer** — `Link` for privacy/terms
- **Docs** — migration complete; removed `sync-partials.py` / `bump-cache.py` references

### Removed
- Static `public/privacy.html`, `terms.html`, `404.html`, `subscribed.html`
- `partials/`, `sync-partials.py`, `bump-cache.py`

## 2026-05-23 (continued)

### Added
- **React routes** — `/cloud/` (preview pricing + FAQ) and `/account/` (Supabase auth via npm `@2.43.4`)
- **`FaqAccordion`**, **`useAccount`**, **`src/lib/supabase.ts`** with `CLOUD_LAUNCHED` flag for billing UI

### Changed
- **SPA fallbacks** — `_redirects` rules for `/cloud/*` and `/account/*`
- **`sync-partials.py` / `bump-cache.py`** — cloud/account removed (now React)
- **Nav/Footer** — `Link` for `/cloud/` and `/account/`; account active state on `/account/`

### Removed
- Static `public/cloud/index.html` and `public/account/index.html`

## 2026-05-23

### Added
- **React + Vite scaffold** — `package.json`, `vite.config.ts`, TypeScript config, `src/` app
- **React routes** — `/` (hub), `/audio/`, `/notes/` via React Router + shared `SiteLayout`
- **Shared React components** — `Nav`, `Footer`, `Starfield`, `ProductCloudCard`, hero/pages for each route
- **SPA fallbacks** — `_redirects` rules for `/audio/*` and `/notes/*` → `index.html`

### Changed
- **Project layout** — static assets and unmigrated pages moved under `website/public/`; Vite builds to `website/dist/`
- **Cloud rollout messaging** — hub, notes, cloud preview, and account copy updated; checkout/billing UI disabled until Cloud launches
- **`sync-partials.py` / `bump-cache.py`** — paths updated for `public/`; audio/notes/hub removed (now React)
- **Docs** — `website/README.md`, root `README.md`, `CLAUDE.md` updated with migration status

### Removed
- Static `website/audio/index.html` and `website/notes/index.html` (replaced by React pages)

## 2026-03-13

### Added
- **Favicon** — SVG + PNG fallback + Apple touch icon on all pages
- **OG images** — `og:image` and `og:url` meta tags on all 9 pages; full OG tag set added to privacy, terms, subscribed, and 404 pages
- **Theme-color** — `<meta name="theme-color" content="#13151C">` on all pages for mobile browser chrome
- **`css/legal.css`** — shared stylesheet for privacy and terms pages with `legal-` prefixed classes
- **Nav/footer partials** — `partials/nav.html`, `partials/footer.html`, and `sync-partials.py` for keeping nav/footer consistent across pages

### Changed
- **`privacy.html`** — replaced all inline `style=""` attributes with `legal.css` classes
- **`terms.html`** — replaced all inline `style=""` attributes with `legal.css` classes
- **Cloud card CSS dedup** — extracted shared `.product-cloud-*` classes into `shared.css`, removed ~170 lines of duplicated styles from `audio.css`, `notes.css`, and `hub.css`
- **Lazy loading** — added `loading="lazy"` to 13 below-fold images across hub, audio, notes, and subscribed pages
- **Supabase anon key** — added comments in `cloud/index.html` and `js/account.js` documenting the key is intentionally public (RLS-protected)
- **Cache busting** — created `bump-cache.py` to auto-replace `?v=` strings with git commit hash; all pages now use `?v=89a0dc2`
- **Linux detection** — `detectPlatform()` now recognises Linux and shows Tux icon + "Linux coming soon" with a disabled download button

### Known Issues
- **Boojy Notes download 404** — clicking the macOS download button links to a GitHub release asset that returns a 404 (`boojyorg/boojy-notes/releases/download/v0.1.3/Boojy-Notes-0.1.3-arm64.dmg`)
- **"Boojy" text rendering** — the word "Boojy" in "Boojy Audio" / "Boojy Notes" headings occasionally renders in the wrong font
- **Nav logo hover** — the Boojy icon in the top-left should scale up ~10% on hover (enhancement)
