# Boojy — Tech Stack

Solo project built by Tyr. Last updated: Feb 2026.

---

## Repos

| Repo | Purpose | URL |
|------|---------|-----|
| `boojy` | Marketing website (boojy.org) | github.com/boojyorg/boojy |
| `boojy-notes` | Notes web app (notes.boojy.org) | github.com/boojyorg/boojy-notes |
| `boojy-cloud` | Backend: Supabase migrations + Edge Functions | github.com/boojyorg/boojy-cloud |

---

## Website (boojy.org)

| Component | Service |
|-----------|---------|
| Domain | Namecheap |
| DNS + CDN | Cloudflare |
| Hosting | Cloudflare Pages (auto-deploys from GitHub) |
| Framework | Plain HTML/CSS/JS |
| Auth | Supabase JS (CDN v2.43.4) |

---

## Boojy Notes (notes.boojy.org)

| Component | Service |
|-----------|---------|
| Hosting | Cloudflare Pages (auto-deploys from GitHub) |
| Framework | React 19 + Vite |
| Auth | Supabase Auth (Email, Google, Apple) |
| Sync | Supabase Edge Functions → Cloudflare R2 |

---

## Backend (Supabase)

| Component | Service |
|-----------|---------|
| Auth | Supabase Auth (Email, Google, Apple OAuth) |
| Database | Supabase PostgreSQL |
| Edge Functions | Deno runtime on Supabase |
| Object Storage | Cloudflare R2 (S3-compatible) |

### Edge Functions

| Function | Purpose |
|----------|---------|
| `create-checkout` | Creates Stripe Checkout session with PPP pricing |
| `stripe-webhook` | Handles Stripe events (checkout, cancel, update) |
| `sync-push` | Push note content to R2 + metadata to Postgres |
| `sync-pull` | Pull notes from R2 (incremental by timestamp) |
| `sync-delete` | Soft-delete notes from R2 + metadata |
| `storage-check` | Check if user has storage space before upload |
| `auth-webhook` | Post-signup hook |
| `sync` | Legacy general sync endpoint |

### Database Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User tier, Stripe IDs, storage limit |
| `storage_usage` | Bytes used, file count per user |
| `notes_metadata` | Note metadata (title, hash, R2 key, timestamps) |

---

## Payments (Stripe)

| Component | Detail |
|-----------|--------|
| Product | Boojy Cloud Orbit |
| Pricing | 4 PPP tiers: $5 / $3.50 / $2 / $1 per month |
| Checkout | Stripe Checkout (hosted) |
| Portal | Stripe Customer Portal (manage/cancel) |
| Webhooks | → Supabase Edge Function `stripe-webhook` |
| Tax | Stripe Tax (automatic, requires billing address) |

---

## Boojy Audio

| Component | Technology |
|-----------|------------|
| Framework | Flutter |
| Platforms | macOS, Windows |
| Downloads | GitHub Releases |

---

## Analytics & Monitoring

| Component | Service |
|-----------|---------|
| Website Analytics | Umami (self-hosted on Railway) |
| App Crash Reports | Sentry.io (opt-in) |

---

## Costs (Approximate)

| Service | Cost |
|---------|------|
| Namecheap (domain) | ~£10/year |
| Cloudflare Pages | Free |
| Supabase | Free tier |
| Stripe | 2.9% + 30¢ per transaction |
| Cloudflare R2 | Free tier (10 GB storage, 10M reads/month) |
| Railway (Umami) | ~$5/month |
| Sentry | Free tier |
