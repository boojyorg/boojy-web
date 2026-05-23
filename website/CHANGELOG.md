# Changelog

## 2026-05-23 (legal + misc)

### Added
- **React routes** — `/privacy.html`, `/terms.html`, `/subscribed.html`, catch-all 404
- **`LegalLayout`**, **`usePageTitle`**, legal body content in `src/content/legal/`

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
