# DREAMS.md — boojy.org Active Target

> Working memory: the **active engineering target + its milestone checklist**. Read first each
> session (see `CLAUDE.md` → Memory). Flip `- [ ]` → `- [x]` as work lands. This file is §1 only —
> no incident log, no backlog. History lives in `git log`; the ordered roadmap in `docs/ROADMAP.md`;
> unscheduled items in `docs/BACKLOG.md`; durable rules in `CLAUDE.md` + `.claude/rules/`.

## 🎯 Active Engineering Target

**Website audit roadmap** (approved 2026-05-31; full sequence in `docs/ROADMAP.md`).
**P0 (download rot) and P1 (homepage rebuild) have shipped** — the premium homepage, unified 2×2
product grid, periwinkle accent, cosmic backdrop, `/news/` content collection, and the feedback
form island all landed via the homepage-phase1 merge. **2026-06-11: multi-agent site review ran**
(report: `docs/reviews/2026-06-11-site-review.md`) and its quick wins shipped same-day — PRs
#21–25 (review fixes, feedback mailto fallback, honest download labels, dead-code/docs sync,
animated orbit logo) + **#26 the P6 testing baseline** (vitest + Playwright smoke in CI). Next up
is **P2 (release automation)**, then P3 narrative, P4 feedback backend, P5 brand/product-registry,
P6 tail (CWV measurement).

### Review leftovers (from the 2026-06-11 top-10, not yet picked up)

- News `june-2026.md` rewrite in Tyr's voice (rec #8) · CSS consolidation 4→1 product stylesheets
  (rec #9) · wordmark dark-on-dark legibility (brand-asset question, above all repo changes).
- Supabase pausing (rec #1) was handled in **boojy-cloud**: twice-weekly keep-alive ping CI
  (its PR #2, 2026-06-11).

### Open milestones (next pickups)

- [ ] **(P2) Auto-rebuild on release.** CF Pages Deploy Hook POSTed from each app repo's release
  workflow so a new tag rebuilds boojy.org without a manual redeploy. Until then, baked versions only
  refresh on the next deploy.
- [ ] **(P4, boojy-cloud — separate PR) Feedback Edge Function.** Interim shipped (PR #22):
  Send opens a pre-filled email to tyr@boojy.org behind `FEEDBACK_BACKEND_LIVE = false`, so
  nothing is lost meanwhile. The real backend remains: verify the Turnstile token → insert into a
  new `feedback` table + migration, then flip the flag and swap in real Turnstile **site key**
  (in `Feedback.tsx`) + **secret key** on the Edge Function (both via Cloudflare).
- [x] **(user) Drop the Design screenshot** — landed as
  `website/public/images/design-screenshot-v0.4.png` with the `/design` page (PR #16).
- [ ] **(user) Google Search Console.** Domain property added + verifying. Submit the **full-URL**
  sitemap `https://boojy.org/sitemap-index.xml` (a Domain property rejects the relative path), then
  Request Indexing for `/`, `/audio/`, `/notes/`, `/cloud/`, `/privacy/`, `/terms/`.
- [x] **(P6) Testing baseline** — shipped 2026-06-11 (PR #26): vitest unit tests for
  `github-release.ts` + Playwright smoke suite against the built `dist/`, both in CI (the five-gate
  set in `CLAUDE.md`). Remaining P6 tail = the CWV bullet below.
- [ ] **(P1/P6) Core Web Vitals not measured.** Add `chrome-devtools-mcp` and run a Lighthouse pass
  for real LCP / CLS / INP (folds into the testing floor). The dead umami tag was removed (PR #21);
  Cloudflare Web Analytics beacon (free CWV data) still to add.
- [ ] **(P1) Drop ~57KB React from the homepage.** ⚠️ Superseded by the feedback form: `Feedback.tsx`
  is a React island, so `/` needs React regardless. Making Starfield `is:inline` no longer removes
  React from the homepage unless the feedback form is also rebuilt in vanilla JS.
