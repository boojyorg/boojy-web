# Roadmap — boojy.org

Ordered intentions for the marketing site. The **current target + live checklist** is in
`dreams.md`; **unscheduled someday** items are in `docs/BACKLOG.md`. This file is the sequence.

Approved 2026-05-31 as the "website audit roadmap." Going slowly, homepage-first; later pages get
ASCII-mockup sign-off before code.

## Phases

- **P0 — Stop the bleeding ✅ (shipped).** Fixed download rot (Notes 404 → build-time fetch of real
  asset URLs via `lib/github-release.ts`; Audio owner `tyrbujac`→`boojyorg` + dynamic version),
  link-checker workflow, aligned legal dates, removed orphaned images.
- **P1 — Homepage ✅ (shipped).** Design-led rebuild on a premium base: Inter, periwinkle-blue
  accent baked as default, cosmic backdrop, unified 2×2 product grid (Audio · Notes · Cloud ·
  Design) driven by `PRODUCT_CARDS` in `site.ts`, release-stage ladder (Early access → Beta → Full
  release), centered "Why Boojy" card, `/news/` content collection (prose monthly notes), and the
  feedback form island. Remaining homepage tails (React-weight, CWV) tracked in `dreams.md`.
- **P2 — Release automation 🔶 (wired, needs secret).** `site-rebuild.yml` in boojy-audio (#74) and
  boojy-notes (#25) POSTs the CF Pages Deploy Hook on `release: published` so a new release rebuilds
  boojy.org automatically. Remaining: create the Deploy Hook in the CF dashboard and set
  `CF_PAGES_DEPLOY_HOOK_URL` in both app repos. Flow doc: `docs/WEBSITE-VERSION-UPDATES.md`.
- **P3 — Narrative.** Roadmap/updates storytelling beyond `/news/` as the suite matures.
- **P4 — Feedback backend + Cloud waitlist.** Build the `feedback` Edge Function (Turnstile verify →
  `feedback` table) in boojy-cloud; the Cloud paid-tier email waitlist follows the same pattern
  (Supabase table + Edge Function + Turnstile) — deferred until that backend exists.
- **P5 — Brand / product registry.** A single config-driven product model (extends the
  `STAGE_LABELS` + per-product `stage` work) feeding cards, badges, and meta.
- **P6 — Testing floor.** Add a baseline test/measurement layer (CWV via Lighthouse, basic checks)
  — the site currently has no automated test suite.

## Locked decisions (reference)

- **Site map (locked 2026-06-01):** nav pillars Audio · Notes · Cloud; utility links News · GitHub ·
  Account. Cloud is a live pillar (Free = live now, Orbit = coming, no waitlist yet). `/news/`
  replaces the old `/updates` changelog idea (prose monthly notes, not a blog/RSS). **Dropped:**
  `/roadmap` page, Cloud FAQ (component kept, unmounted), `/about`. Full detail in auto-memory
  `boojy-website-roadmap`.
