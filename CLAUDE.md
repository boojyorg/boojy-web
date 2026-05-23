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
├── index.html          # Vite entry — React app (hub, audio, notes)
├── src/                # React routes + shared layout components
│   ├── pages/          # HubPage, AudioPage, NotesPage
│   └── components/     # Nav, Footer, Starfield, etc.
├── public/             # Static assets + legacy HTML pages
│   ├── cloud/index.html
│   ├── account/index.html
│   ├── privacy.html, terms.html, subscribed.html, 404.html
│   ├── css/            # shared.css + page styles
│   ├── js/             # shared.js, account.js, audio.js, etc.
│   ├── images/
│   ├── _redirects
│   ├── _headers
│   ├── robots.txt
│   └── sitemap.xml
├── partials/           # Nav/footer source for static pages
├── sync-partials.py
├── bump-cache.py
├── vite.config.ts
└── package.json
```

## Tech Stack

- **React routes:** `/`, `/audio/`, `/notes/` (React Router + shared layout)
- **Static pages:** `/cloud/`, `/account/`, legal pages (migrating incrementally)
- **Hosting:** Cloudflare Pages (auto-deploys from GitHub `master`)
- **Build:** `npm run build` → output in `website/dist/`
- **Auth:** Supabase JS via CDN (pinned to v2.43.4)
- **Payments:** Stripe Checkout + Customer Portal (disabled on site until Cloud launches)
- **Backend:** Supabase Edge Functions (in boojy-cloud repo)
- **Storage:** Cloudflare R2 (S3-compatible, for note content)
- **Analytics:** Umami (self-hosted on Railway)

## Migration status (website)

| Route | Stack |
|-------|-------|
| `/`, `/audio/`, `/notes/` | React 19 + TS + Vite + React Router |
| `/cloud/`, `/account/`, legal | Static HTML in `website/public/` |

Shared layout (`Nav`, `Footer`, `Starfield`) lives in `website/src/components/`. Static pages still use `partials/` + `sync-partials.py`. Cloud checkout is disabled; account hides billing/storage until Cloud launches.

## Key Conventions

- React routes: shared CSS imported from `public/css/`; page CSS imported per route in `src/pages/`
- Static pages: nav/footer synced via `sync-partials.py`; `shared.css` + `shared.js` on each page
- Supabase CDN is pinned to `@2.43.4` (newer versions break global scope)
- Scripts using Supabase must use `type="module"` to avoid global property conflicts
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
# React: http://localhost:5173/ , /audio/ , /notes/
# Static: http://localhost:5173/cloud/ , /account/ , etc.
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
