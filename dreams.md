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

### Phase 1 — homepage (branch `feat/homepage-phase1`, **uncommitted WIP** as of 2026-05-31)

Design-led rebuild on a premium base. Mockup agreed section-by-section, then built; **awaiting
dev-server review**. Gates green (check/build/lint). Nothing committed yet.

**Done (on the branch):**

- [x] Premium base (global): **Inter** (`@fontsource-variable/inter`), radius 12/16→8/12
  (+`--border-radius-sm:6`), `prefers-reduced-motion` contract + Starfield static-frame early-return,
  nav hamburger breakpoint 480→768 (closes the 481–767 overlap dead zone), `clamp()` hero type.
- [x] **Accent A/B toggle** — `?accent=cool|gold` → `data-accent` on `<html>`; `--accent-rgb` swaps
  gold ↔ periwinkle. **Dev scaffolding** (inline script in `BaseLayout` + `:root[data-accent=cool]`
  in `shared.css`); **bake the winner into `:root` and delete the toggle before merge.**
- [x] Hero: "a creative suite" / "Free creative software. Made by Tyr." Open-source dropped from hero
  + JSON-LD + `/` meta; **kept once, verbatim, in Why Boojy.** Verified repo visibility (see memory):
  Audio + Notes **public**, Cloud **private**, Design **not public** → Terms' "Audio is open-source"
  claim is accurate, left as-is.
- [x] Sections (post-redline): Why Boojy = bordered **card**, no "— Tyr"; Audio/Notes grid +
  one-config **early-access badge**; Coming-soon = Design + Cloud **cards** (muted, "Coming soon"
  badge; Cloud has a gradient placeholder + "Join waitlist", Design has no link). **Dropped the
  Latest-releases strip + the Roadmap link.**
- [x] **Feedback form** island (`Feedback.tsx`, `client:visible`) — fields + Cloudflare Turnstile
  widget, submits via `supabase.functions.invoke('feedback')`. UI done; **backend not built** (below).

**Pending before this can merge:**

- [ ] **(user)** Drop the Design screenshot at `website/public/images/boojy-design-screenshot.png`
  (card is a broken image until then; CI link-check would 404 it).
- [ ] **(user)** Pick the accent (cool vs gold) on the dev server → then bake it + remove the toggle.
- [ ] **(boojy-cloud, separate PR)** Build the `feedback` Edge Function (verify Turnstile token →
  insert into a new `feedback` table) + migration.
- [ ] **(user, Cloudflare)** Create a Turnstile widget for boojy.org → real **site key** (swap the
  test key `1x00000000000000000000AA` in `Feedback.tsx`) + **secret key** (set on the Edge Function).
- [ ] **On commit:** update `CLAUDE.md` islands list (+Feedback), add a feedback `.claude/rules/`
  note, refresh README. (Deferred until the shape is final.)
- [ ] Optional: subset Inter to `/latin` to trim emitted woff2 (visitors only fetch latin anyway).

### Open milestones (next pickups)

- [ ] **(P2) Auto-rebuild on release.** CF Pages Deploy Hook POSTed from each app repo's release
  workflow so a new tag rebuilds boojy.org without a manual redeploy. Until then, baked versions only
  refresh on the next deploy.
- [ ] **(user) Google Search Console — unfinished.** Domain property added + verifying. Submit the
  **full-URL** sitemap `https://boojy.org/sitemap-index.xml` (a Domain property rejects the relative
  path), then Request Indexing for `/`, `/audio/`, `/notes/`, `/cloud/`, `/privacy/`, `/terms/`.
- [ ] **(P1/P6) Core Web Vitals not measured.** Add `chrome-devtools-mcp` and run a Lighthouse
  pass for real LCP / CLS / INP (folds into the homepage rebuild + testing floor).
- [ ] **(P1) Drop ~57KB React from the homepage.** ⚠️ **Superseded by the feedback form:** the new
  `Feedback.tsx` is a React island, so `/` now needs React regardless. Making Starfield `is:inline`
  no longer removes React from the homepage unless the feedback form is also rebuilt in vanilla JS.

_Deferred styling/cleanup (no schedule): Tailwind/shadcn restyle; semantic `a→button` for the 7
`useValidAnchor` sites; a single config-driven download island (vs. the two parallel components);
404 self-canonical without trailing slash; `.DS_Store` is tracked (gitignore + untrack)._
