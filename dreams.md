# DREAMS.md — boojy.org Intent Buffer & Devlog

> Working memory for the boojy.org repo. Read this first at the start of every session (see
> `CLAUDE.md` → Memory Synchronization Rule). Flip `- [ ]` → `- [x]` as work lands. The post-edit
> hook injects validation failures into §2.

## 1. 🎯 Active Engineering Target — Astro migration

**Status (2026-05-29):** ✅ **Migration implemented on `astro-migration`** — Phases 0–7 done,
`astro check` + `pnpm build` clean, manual walkthrough passed. SPA fully removed. **Remaining:**
merge → `master` + flip CF Pages build settings in lockstep (deploy trap, §3), then Phase 8 (Biome).
Full spec: `docs/ASTRO_MIGRATION_PLAN.md`. Decisions as built: native view transitions / no
`<ClientRouter />`; glow as pre-paint root-CSS-var script; build-time notes version; **legal pages
on clean URLs `/privacy/` `/terms/` `/subscribed/` + 301s** (Astro can't emit a literal `.html`
file — this reverses the plan's "preserve `.html`" call); CF Pages Git integration kept; in-place
scaffold; pnpm + TS-strict now, Biome deferred.

### Phases (one commit each; see the plan for detail)

- [x] **Phase 0 — Scaffold + pnpm.** `pnpm import`; rewrite `package.json` (add astro@^6.4,
  @astrojs/react, @astrojs/sitemap; drop vite + react-router); `astro.config.mjs`
  (`output:'static'`, `trailingSlash:'always'`, `build.format:'directory'`,
  `site:'https://boojy.org'`); single strict `tsconfig.json`; move `public/css` → `src/styles`.
- [x] **Phase 1 — Base layout + chrome.** `BaseLayout.astro` (static head + umami + `@view-transition`
  CSS, no ClientRouter), `Nav.astro` + inline script, `Footer.astro`, the two `is:inline` glow
  scripts + `data-glow` convention, static `ProductCards`/`ProductCloudCard`/`WebIcon`.
- [x] **Phase 2 — Static pages.** All 9 routes as `.astro`; legal via `set:html`. `astro build` +
  `preview`; **view-source each page = SEO acceptance gate.**
- [x] **Phase 3 — Islands.** Starfield, FaqAccordion, AudioDownload/NotesDownload, Account; move
  notes version to `notes/index.astro` frontmatter via `lib/notes-version.ts`.
- [x] **Phase 4 — SEO finishers.** `@astrojs/sitemap`, `robots.txt`, JSON-LD; verify canonical + OG.
- [x] **Phase 5 — Deploy config.** Edit `_redirects`/`_headers`, delete `netlify.toml`, update root
  build script for pnpm. **Do NOT change CF Pages build settings yet** (shared with production —
  see CLAUDE.md deploy trap).
- [x] **Phase 6 — Delete the SPA.** Remove App.tsx/main.tsx/index.html/vite.config.ts, old
  SiteLayout + page `.tsx` wrappers, `usePageMeta`/`useHeroGlowTransition`/`useNotesVersion` hooks,
  `public/js/`, `public/logo-test/`, root `netlify.toml`. `astro check` + build clean.
- [x] **Phase 7 — Verify.** Verification checklist walked (SEO view-source, glow morph, nav,
  download panel, account, notes fallback, routing, redirects) — automated checks + manual
  walkthrough passed.
- [ ] **Phase 7b — Merge.** Merge `astro-migration` → `master` **and** flip CF Pages build settings
  (root `website`, build `pnpm build`, output `dist`) in the same step; confirm production deploy.
- [ ] **Phase 8 — (separate, later) Biome** as its own chore commit.

## 2. 🧪 Workspace Feedback Loops & Incident Logs

### 🛑 Manual UX & Testing Reports (User Injected)

- [ ] Add manual observations from `pnpm dev` / `pnpm preview` walkthroughs here.

### 🚨 Automated Validation Incident Logs (Script Prepended)

_None open._

<!-- The post-edit-validation hook automatically injects astro check failures beneath this line -->

---

## 3. 🗺️ Strategic Backlog & Architecture Scratchpad

### ⚠️ Known gotchas / risks (carried from the migration review)

- **CF Pages build settings are shared prod/preview.** Changing them to `pnpm build` while `master`
  is still the SPA breaks the next production build. Change at merge time only.
- **Glow pre-paint script** must set color via a root-level CSS var on `documentElement` before
  paint, not by querying the not-yet-parsed glow element — else the flash returns.
- **`noUncheckedIndexedAccess`** will surface errors across existing `lib/` (e.g. `platform.ts`),
  not just `notes-version`. Budget a small cleanup in Phase 0.
- **Native cross-document view transitions are Chromium-mostly.** Safari/Firefox just do a plain
  navigation — graceful, not a bug. Check the glow morph in Chromium.
- **GitHub API is 60 req/hr/IP unauthenticated** on shared CF build IPs — the notes-version fallback
  string covers the occasional rate-limit; no token needed.

### Post-review cleanup (deferred, low severity)

From `/code-review high` on the branch — correctness (#1 download fallbacks, #2 notes-version
abort) and the icon/OG dedup (#3, #4, #7) are **fixed**. Remaining, optional:

- **`BaseLayout.astro` glow gradient is duplicated** in the JS morph string and the 4 glow CSS
  files — a stop change must touch all of them or the morph's last frame won't match the resting
  state. (Animating a CSS custom property the gradient reads would remove the JS string.)
- **404 canonical/og:url is `/404.html`** (no trailing slash, inconsistent with `trailingSlash:
  'always'`); arguably a 404 shouldn't self-canonicalize.
- **Glow morph `clearOrigin()` repeated at 4 exit points** — flatten with early returns so the
  "always clear the override" invariant is structural, not manual.
- **`AudioDownload`/`NotesDownload` are still two components** with parallel structure — a single
  config-driven download island is the deeper (altitude) fix if it's worth a future pass.

### Deferred (not this migration)

- Biome adoption (Phase 8, separate commit).
- Tailwind / shadcn restyle (separate task — styling stays plain CSS this pass).
- SSR / Cloudflare adapter — not needed while static.
- Always-live notes-version island — build-time bake is the chosen approach.
- A blog/devlog via Astro content collections — scope separately if added.

### 💸 Cost / session telemetry

_Add per-session cost + token notes here (mirrors boojy-design's practice). First entry to be added
after the first migration work session._
