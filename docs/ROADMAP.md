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
- **P2 — Release automation.** CF Pages Deploy Hook POSTed from each app's release workflow so a new
  tag rebuilds boojy.org automatically (baked versions currently only refresh on the next deploy).
- **P3 — Narrative.** Roadmap/updates storytelling beyond `/news/` as the suite matures.
- **P4 — Feedback backend.** Build the `feedback` Edge Function (Turnstile verify → `feedback`
  table + an email notification so "straight to my inbox" stays true) in boojy-cloud, then flip
  `FEEDBACK_BACKEND_LIVE` in `Feedback.tsx` and swap in the real Turnstile keys — all in one
  release. (The Cloud paid-tier waitlist that used to ride along here was dropped with Orbit —
  see Locked decisions.)
- **P5 — Brand / product registry.** A single config-driven product model (extends the
  `STAGE_LABELS` + per-product `stage` work) feeding cards, badges, and meta.
- **P6 — Testing floor.** Baseline ✅ (shipped 2026-06-11, PR #26): vitest unit tests for
  `github-release.ts` + a Playwright smoke suite against the built site, both gating CI. Remaining
  tail: CWV measurement (Lighthouse pass / Cloudflare Web Analytics) — tracked in `dreams.md`.

## Locked decisions (reference)

- **Cloud is free-only (locked 2026-06-11):** the paid "Orbit" tier is dropped, not deferred — no
  pricing, no waitlist, no subscription machinery. The dormant Stripe wiring (create-checkout,
  stripe-webhook, `useAccount`'s Orbit tier mapping, the gated billing UI in `Account.tsx`) stays
  parked behind `CLOUD_LAUNCHED = false` and gets removed (not launched) when next touched.
- **Site map (locked 2026-06-01, nav order updated #18):** nav pillars Audio · Notes · Design ·
  Cloud; utility links News · GitHub · Account. Cloud is a live free pillar. `/news/`
  replaces the old `/updates` changelog idea (prose monthly notes, not a blog/RSS). **Dropped:**
  `/roadmap` page, Cloud FAQ (component kept, unmounted), `/about`. Full detail in auto-memory
  `boojy-website-roadmap`.
