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
website/
├── index.html          # Vite entry — React SPA
├── src/                # React routes + shared layout components
│   ├── pages/          # Hub, Audio, Notes, Cloud, Account, legal, 404
│   ├── components/     # Nav, Footer, Starfield, LegalLayout, etc.
│   └── content/        # site copy, cloud FAQ, legal HTML bodies
├── public/             # Static assets only (CSS, images, redirects)
│   ├── css/
│   ├── js/             # dev-tools.js (logo-test)
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
- **Build:** `npm run build` → output in `website/dist/`
- **Auth:** Supabase JS `@2.43.4` via npm on `/account/` route
- **Payments:** Stripe Checkout + Customer Portal (disabled on site until Cloud launches)
- **Backend:** Supabase Edge Functions (in boojy-cloud repo)
- **Storage:** Cloudflare R2 (S3-compatible, for note content)
- **Analytics:** Umami (self-hosted on Railway)

## Migration status (website)

All marketing routes are React. Set `CLOUD_LAUNCHED = true` in `src/lib/supabase.ts` when Cloud storage goes live to show billing UI on account.

## Key Conventions

- Shared CSS from `public/css/`; page CSS imported per route in `src/pages/` or components
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
cd website && npm install && npm run dev
# http://localhost:5173/
```

Production build: `npm run build` (output in `dist/`).

## Deployment

Cloudflare Pages settings:

- **Root directory:** `website`
- **Build command:** `npm run build`
- **Output directory:** `dist`

Push to `master` branch → Cloudflare Pages auto-deploys.

## Git

- Branch: `master`
- `docs/private/` is gitignored (secrets reference, TODOs, archived docs)
- `docs/BUSINESS_PLAN.md` is gitignored
