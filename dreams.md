# DREAMS.md — boojy.org Active Target

> Working memory: the **active engineering target + its milestone checklist**. Read first each
> session (see `CLAUDE.md` → Memory). Flip `- [ ]` → `- [x]` as work lands. This file is §1 only —
> no incident log, no backlog. History lives in `git log`; durable rules in `CLAUDE.md` +
> `.claude/rules/`; incidental learnings in auto memory.

## 🎯 Active Engineering Target

**None active — steady state.** The Vite→Astro static-site migration shipped and is live in
production (PR #1; CF Pages settings flipped in lockstep). Biome adopted, CI gates every PR, the
SEO/perf + cache-header audit is done. No open framework work.

### Open milestones (next pickups)

- [ ] **(user) Google Search Console — unfinished.** Domain property added + verifying. Submit the
  **full-URL** sitemap `https://boojy.org/sitemap-index.xml` (a Domain property rejects the relative
  path), then Request Indexing for `/`, `/audio/`, `/notes/`, `/cloud/`, `/privacy/`, `/terms/`.
- [ ] **(optional) Core Web Vitals not measured.** Add `chrome-devtools-mcp` and run a Lighthouse
  pass for real LCP / CLS / INP.
- [ ] **(optional) Drop ~57KB React from the homepage.** Starfield is the only island on `/` and was
  vanilla JS pre-migration — re-implementing it as a plain `is:inline` script removes the React
  runtime from the homepage entirely (still loads on /audio, /notes, /account).

_Deferred styling/cleanup (no schedule): Tailwind/shadcn restyle; semantic `a→button` for the 7
`useValidAnchor` sites; a single config-driven download island (vs. the two parallel components);
404 self-canonical without trailing slash; `.DS_Store` is tracked (gitignore + untrack)._
