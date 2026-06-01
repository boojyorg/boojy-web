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
- [x] **Accent = periwinkle blue** (`124,140,255`), chosen 2026-06-01 and **baked as the `:root`
  default** (was gold). All hardcoded gold `rgba()` glows/focus rings converted to
  `rgba(var(--accent-rgb),…)`. The `?accent=gold|mono` toggle remains as **dev scaffolding** to
  compare the old gold / a near-white mono; **delete the toggle + the `data-accent` blocks before
  merge** (default already IS blue). NB: the **WHY BOOJY eyebrow is deliberately mono near-white**
  (`#d4d9e6`, not the accent) so it stays calm while the news eyebrow / links / CTAs are blue.
- [x] **Card colours baked** (2026-06-01): default mix = **product cards grey** (pop forward),
  **narrative cards near-black** (`--color-bg-card-dark: #0c0e1a`; Why + news recede into the
  backdrop), **feedback card grey** (opts out — it's the closing CTA). Grouped vars
  `--card-product-bg` / `--card-narrative-bg`. The `?cards=grey|dark` toggle remains as **dev
  scaffolding** to compare all-grey / all-near-black; **delete before merge** (default IS the mix).
- [x] Hero: "a creative suite" / "Free creative software. Made by Tyr." Open-source dropped from hero
  + JSON-LD + `/` meta; **kept once, verbatim, in Why Boojy.** Verified repo visibility (see memory):
  Audio + Notes **public**, Cloud **private**, Design **not public** → Terms' "Audio is open-source"
  claim is accurate, left as-is.
- [x] **Unified 2×2 product grid** (2026-06-01): one `ProductCards` grid renders **all four** —
  Audio · Notes · Cloud · Design — same card style. Replaced the old split (Audio/Notes grid + a
  separate Cloud "live pillar" band + a coming-soon row), tightening the page. `PRODUCT_CARDS` in
  `site.ts` is now the single model (optional `href`/`logo`, `visual: image|placeholder`,
  `stage|comingSoon`). **Cloud** = real card (`cloud-preview.jpg` + `cloud-text-logo.png`, short copy
  "Optional cloud storage that syncs Boojy Notes…", Early-access badge, → /cloud/). **Design** =
  off-ladder `comingSoon` card (gradient + glyph placeholder, "Coming soon" badge, **non-link div**,
  "In the works"). Deleted `ComingSoonCards.astro` + `COMING_SOON`; `ProductCloudCard` kept (still the
  Cloud band on /audio/ + /notes/). Dead `.cloud-card`/`.hub-cloud-*`/coming-soon-section CSS removed.
- [x] Why Boojy = **centered card** (warm one-paragraph "Hi, I'm Tyr…" story + centered promise
  checklist; copy in `site.ts`. Iterated 2026-06-01: bordered prose card → borderless editorial split
  → back to a centered card per Tyr. **"No subscriptions" promise removed entirely** — now 3 promises:
  Always free / Open source once ready / Yours to keep). **Dropped the Latest-releases strip + Roadmap.**
- [x] **Feedback form** island (`Feedback.tsx`, `client:visible`) — fields + Cloudflare Turnstile
  widget, submits via `supabase.functions.invoke('feedback')`. UI done; **backend not built** (below).

**Pending before this can merge:**

- [ ] **(user)** Drop the Design screenshot at `website/public/images/boojy-design-screenshot.png`
  (card is a broken image until then; CI link-check would 404 it).
- [x] Accent chosen = **blue** (baked as default); card mix chosen = **product grey / narrative
  near-black / feedback grey** (baked as default). **Dev toggles deleted** (2026-06-01): both
  `?accent` + `?cards` inline scripts in `BaseLayout` and the `:root[data-accent=…]` /
  `:root[data-cards=…]` blocks in `shared.css` removed; orphaned `--color-purple` token dropped
  (Design card now uses `--color-design: #ffa500`).
- [ ] **(boojy-cloud, separate PR)** Build the `feedback` Edge Function (verify Turnstile token →
  insert into a new `feedback` table) + migration.
- [ ] **(user, Cloudflare)** Create a Turnstile widget for boojy.org → real **site key** (swap the
  test key `1x00000000000000000000AA` in `Feedback.tsx`) + **secret key** (set on the Edge Function).
- [ ] **On commit:** update `CLAUDE.md` islands list (+Feedback), add a feedback `.claude/rules/`
  note, refresh README. (Deferred until the shape is final.)
- [x] Inter subset to latin — `src/styles/inter.css` (latin + latin-ext `@font-face`); `dist` now
  emits 2 woff2 not 7. (Dist-tidiness only; `unicode-range` already gated runtime fetches.)
- [x] Commit-prep docs — Feedback added to `CLAUDE.md` + `README.md` islands lists;
  `.claude/rules/feedback.md` written; Inter approach noted.
- [x] **Cosmic backdrop** (homepage-only, `hub.css` → `body` with `background-attachment: fixed`):
  edge vignette + cool periwinkle/violet/teal nebula blooms + faint galactic band, behind the fixed
  starfield canvas. Nebula stays cool regardless of the gold/cool accent. Chose the "bolder" of two
  intensities on dev-server screenshots; starfield JS left untouched (reduced-motion + VT contract).
- [x] **Screenshot skill** (`.claude/skills/screenshot/` + `.claude/tools/screenshot/`): drives the
  installed Chrome via `puppeteer-core` (no bundled browser; isolated from `website/` deps) so CC can
  capture + `Read` rendered pages during visual work. `shots/` + `node_modules/` gitignored.

### Confirmed site map (locked 2026-06-01) — full detail in auto-memory `boojy-website-roadmap`

- [x] **Nav:** pillars **Audio · Notes · Cloud** (Cloud added); right-side utility links
  **News · GitHub · Account** (News sits by the GitHub icon — not a product, so it's a utility link).
- [x] **Cloud reframed as a live pillar:** homepage Cloud band (`ProductCloudCard` + "Live · Free"
  badge, promoted out of the "coming soon" row → Design now stands alone there); `/cloud/` shows Free
  = **Live now** (CTA "Get Boojy Notes →"), Orbit = **Coming** (no waitlist — capture deferred), +
  "Coming to Boojy Audio next." line; **Cloud FAQ removed** (component `FaqAccordion` now unmounted,
  kept for later); shared `CLOUD_DESCRIPTION` reframed (flows to `/notes` band too).
- [x] **Release-stage ladder** (suite-wide): **Early access → Beta → Full release**, one config
  (`STAGE_LABELS` + per-product `stage` in `site.ts`) — generalizes the old `EARLY_ACCESS` const and
  feeds the Phase-5 product registry. Audio + Notes + Cloud are all **Early access** now; the badge
  shows on the homepage product cards + the Cloud band. Design stays **"In the works"** (off-ladder
  until it ships).
- [x] **`/news/`** (replaces the old `/updates` changelog idea): **Direction A — prose monthly notes**
  ("June 2026"). First content collection (`news`, glob loader, `content.config.ts`); `/news/` archive
  + `/news/[...slug]/` posts; homepage **"Latest" teaser** (newest post, sits before Feedback); footer
  link added; `BaseLayout` gained optional title/description overrides for the dynamic post pages.
  Inaugural post `june-2026.md` is a **starter draft to edit**. No RSS/auto-changelog; not a blog.
- **Cloud paid-tier email waitlist** = deferred until its backend (Supabase table + Edge Function +
  Turnstile, same pattern as Feedback) exists; `/cloud` just states "paid coming" for now.
- **Dropped:** `/roadmap` and a Cloud FAQ (both "not now"); no `/about`.

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
