# Boojy — Project Context

Solo project by Tyr. This is the **marketing website** repo (`boojy`).

## Repos

| Repo | Path | Purpose |
|------|------|---------|
| `boojy` | This repo | Marketing website (boojy.org) |
| `boojy-notes` | `../2026/Boojy Notes/` | React 19 + Vite notes app (notes.boojy.org) |
| `boojy-cloud` | `../2026/Boojy Cloud/` | Supabase Edge Functions + migrations |

## Website Structure

```
boojy/
├── package.json        # Cloudflare build — delegates to website/
└── website/
    ├── index.html      # Vite entry — React SPA
    ├── src/
    │   ├── App.tsx     # React Router (all routes)
    │   ├── pages/      # Hub, Audio, Notes, Cloud, Account, legal, 404
    │   ├── components/ # Nav, Footer, Starfield, LegalLayout, etc.
    │   ├── hooks/      # usePageMeta, useAccount, useHeroGlowTransition, …
    │   ├── lib/        # platform.ts, supabase.ts
    │   └── content/    # site copy, cloud FAQ, page-meta.ts, legal HTML bodies
    ├── public/         # Static assets (CSS, images, redirects)
    │   ├── css/
    │   ├── js/         # dev-tools.js (logo-test)
    │   ├── images/
    │   ├── _redirects
    │   ├── _headers
    │   ├── robots.txt
    │   └── sitemap.xml
    ├── vite.config.ts
    └── package.json
```

## Tech Stack

- **Framework:** React 19 + TypeScript + Vite + React Router (all routes)
- **Hosting:** Cloudflare Pages (auto-deploys from GitHub `master`)
- **Build:** repo-root `npm run build` → output in `website/dist/`
- **Auth:** Supabase JS `@2.43.4` via npm on `/account/` route
- **Payments:** Stripe Checkout + Customer Portal (disabled on site until Cloud launches)
- **Backend:** Supabase Edge Functions (in boojy-cloud repo)
- **Storage:** Cloudflare R2 (S3-compatible, for note content)
- **Analytics:** Umami (self-hosted on Railway)

## What's next

| Priority | Task | Where |
|----------|------|-------|
| When Cloud launches | Set `CLOUD_LAUNCHED = true`; re-enable checkout on `/cloud/`; verify Stripe + billing UI on `/account/` | `website/src/lib/supabase.ts`, `website/src/pages/CloudPage.tsx` |
| Optional cleanup | Remove empty `public/audio/` etc. dirs; drop `logo-test/` sandbox or its legacy `shared.js` / `starfield.js` | `website/public/` |
| If share cards matter | SPA OG tags only update client-side — consider prerender/edge HTML for `/audio/`, `/notes/` link previews | Future infra decision |
| When editing legal copy | Move privacy/terms from raw HTML blobs to Markdown/TSX | `website/src/content/legal/` |

## Key Conventions

- Shared CSS from `public/css/`; page CSS imported per route in `src/pages/` or components
- Per-route SEO via `usePageMeta` in `SiteLayout` (title, description, Open Graph)
- Account auth: `@supabase/supabase-js@2.43.4` as npm import (not CDN)
- Edge Function calls need both `apikey` and `Authorization` headers
- All Edge Functions are deployed with `--no-verify-jwt`
- Use `.maybeSingle()` not `.single()` for Supabase queries that may return no rows

## Supabase

- **Project ref:** wupmcvhzstgsdrvcigtm
- **Key tables:** `profiles`, `storage_usage`, `notes_metadata`
- **Auth providers:** Email, Google, Apple
- **Edge Functions:** create-checkout, stripe-webhook, sync-push, sync-pull, sync-delete, storage-check, auth-webhook

## Stripe

- Currently in **test mode**
- Product: Boojy Cloud Orbit
- 4 PPP price tiers (test IDs — will change for live)
- Customer Portal active for subscription management

## Local Dev

```bash
# Day-to-day (from website/)
cd website && npm install && npm run dev
# http://localhost:5173/

# Matches Cloudflare (from repo root)
npm run build   # → website/dist/
```

Preview production build: `cd website && npm run preview`

## Deployment

Cloudflare Pages settings:

- **Root directory:** *(empty — repo root)*
- **Build command:** `npm run build`
- **Output directory:** `website/dist`

(Alternative: root directory `website`, build `npm run build`, output `dist`.)

Push to `master` branch → Cloudflare Pages auto-deploys.

Verify: `curl -s https://boojy.org/ | grep assets/index` should show `/assets/index-*.js`, not `main.tsx`.

## Archived docs

These predate the React migration and are not maintained: `docs/WEBSITE_PLAN.md`, `.claude/cache-busting.md`.

## Git

- Branch: `master`
- `docs/private/` is gitignored (secrets reference, TODOs, archived docs)
- `docs/BUSINESS_PLAN.md` is gitignored
