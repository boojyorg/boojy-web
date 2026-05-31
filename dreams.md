# DREAMS.md — boojy.org Active Target

> Working memory: the **active engineering target + its milestone checklist**. Read first each
> session (see `CLAUDE.md` → Memory). Flip `- [ ]` → `- [x]` as work lands. This file is §1 only —
> no incident log, no backlog. History lives in `git log`; durable rules in `CLAUDE.md` +
> `.claude/rules/`; incidental learnings in auto memory.

## 🎯 Active Engineering Target

**Website audit roadmap** (approved 2026-05-31). Full plan:
`~/.claude/plans/i-want-you-to-purrfect-teapot.md`. Sequence: P0 fix download rot → P1 homepage
(design-led, mockup-first, accent A/B) → P2 release automation → P3 narrative (roadmap/updates) →
P4 feedback + Cloud waitlist → P5 brand/product-registry → P6 testing floor. Going slowly, homepage
first; later pages get ASCII-mockup sign-off before code.

### Phase 0 — stop the bleeding (branch `fix/download-rot-and-link-guard`)

- [x] Notes 404 fixed — build-time fetch resolves real v0.3.0 asset URLs (`lib/github-release.ts`,
  generalized from the old `notes-version.ts`); Notes + Audio both auto-fetch version/date.
- [x] Audio owner `tyrbujac` → `boojyorg` (3 spots + README); Audio version made dynamic (was the
  hardcoded `v0.1 Beta · 28 Feb 2026`).
- [x] Link-checker workflow (`.github/workflows/links.yml`, PR + weekly; separate from the required
  gate so transient external 404s don't block merges).
- [x] Legal "last updated" dates aligned; 3 orphaned images removed;
  `docs/WEBSITE-VERSION-UPDATES.md` rewritten for the Astro build-time flow.

### Open milestones (next pickups)

- [ ] **(P2) Auto-rebuild on release.** CF Pages Deploy Hook POSTed from each app repo's release
  workflow so a new tag rebuilds boojy.org without a manual redeploy. Until then, baked versions only
  refresh on the next deploy.
- [ ] **(user) Google Search Console — unfinished.** Domain property added + verifying. Submit the
  **full-URL** sitemap `https://boojy.org/sitemap-index.xml` (a Domain property rejects the relative
  path), then Request Indexing for `/`, `/audio/`, `/notes/`, `/cloud/`, `/privacy/`, `/terms/`.
- [ ] **(P1/P6) Core Web Vitals not measured.** Add `chrome-devtools-mcp` and run a Lighthouse
  pass for real LCP / CLS / INP (folds into the homepage rebuild + testing floor).
- [ ] **(P1) Drop ~57KB React from the homepage.** Starfield is the only island on `/` and was
  vanilla JS pre-migration — re-implementing it as a plain `is:inline` script removes the React
  runtime from the homepage entirely (still loads on /audio, /notes, /account).

_Deferred styling/cleanup (no schedule): Tailwind/shadcn restyle; semantic `a→button` for the 7
`useValidAnchor` sites; a single config-driven download island (vs. the two parallel components);
404 self-canonical without trailing slash; `.DS_Store` is tracked (gitignore + untrack)._
