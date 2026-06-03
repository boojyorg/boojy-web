# DREAMS.md — boojy.org Active Target

> Working memory: the **active engineering target + its milestone checklist**. Read first each
> session (see `CLAUDE.md` → Memory). Flip `- [ ]` → `- [x]` as work lands. This file is §1 only —
> no incident log, no backlog. History lives in `git log`; the ordered roadmap in `docs/ROADMAP.md`;
> unscheduled items in `docs/BACKLOG.md`; durable rules in `CLAUDE.md` + `.claude/rules/`.

## 🎯 Active Engineering Target

**Website audit roadmap** (approved 2026-05-31; full sequence in `docs/ROADMAP.md`).
**P0 (download rot) and P1 (homepage rebuild) have shipped** — the premium homepage, unified 2×2
product grid, periwinkle accent, cosmic backdrop, `/news/` content collection, and the feedback
form island all landed via the homepage-phase1 merge. Next up is **P2 (release automation)**, then
P3 narrative, P4 feedback backend + Cloud waitlist, P5 brand/product-registry, P6 testing floor.

### Open milestones (next pickups)

- [ ] **(P2) Auto-rebuild on release.** CF Pages Deploy Hook POSTed from each app repo's release
  workflow so a new tag rebuilds boojy.org without a manual redeploy. Until then, baked versions only
  refresh on the next deploy.
- [ ] **(P4, boojy-cloud — separate PR) Feedback Edge Function.** The homepage `Feedback.tsx` island
  is live but its backend isn't built: verify the Turnstile token → insert into a new `feedback`
  table + migration. Also needs a real Turnstile **site key** (swap the test key in `Feedback.tsx`)
  + **secret key** on the Edge Function (both via Cloudflare).
- [ ] **(user) Drop the Design screenshot** at `website/public/images/boojy-design-screenshot.png`
  (the Design product card is a broken image until then; CI link-check would 404 it).
- [ ] **(user) Google Search Console.** Domain property added + verifying. Submit the **full-URL**
  sitemap `https://boojy.org/sitemap-index.xml` (a Domain property rejects the relative path), then
  Request Indexing for `/`, `/audio/`, `/notes/`, `/cloud/`, `/privacy/`, `/terms/`.
- [ ] **(P1/P6) Core Web Vitals not measured.** Add `chrome-devtools-mcp` and run a Lighthouse pass
  for real LCP / CLS / INP (folds into the testing floor).
- [ ] **(P1) Drop ~57KB React from the homepage.** ⚠️ Superseded by the feedback form: `Feedback.tsx`
  is a React island, so `/` needs React regardless. Making Starfield `is:inline` no longer removes
  React from the homepage unless the feedback form is also rebuilt in vanilla JS.
