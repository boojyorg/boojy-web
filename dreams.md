# DREAMS.md — boojy.org Intent Buffer & Devlog

> Working memory for the boojy.org repo. Read this first at the start of every session (see
> `CLAUDE.md` → Memory Synchronization Rule). Flip `- [ ]` → `- [x]` as work lands. The post-edit
> hook injects validation failures into §2.

## 1. 🎯 Active Engineering Target — Astro migration

**Status (2026-05-29):** ✅ **Migration complete and live in production.** All phases done
(0–8). PR #1 merged to `master` with CF Pages settings flipped in lockstep (root `website`, build
`pnpm build`, output `dist`); `boojy.org` verified serving static HTML with real per-route meta and
`.html`→clean-URL 301s. Biome adopted (Phase 8, own chore commit). No open migration work.
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
- [x] **Phase 7b — Merge.** PR #1 merged `astro-migration` → `master`; CF Pages build settings
  flipped in lockstep (root `website`, build `pnpm build`, output `dist`); production deploy
  confirmed serving Astro static HTML (verified live via curl: per-route titles/meta, `.html`→301s).
- [x] **Phase 8 — Biome** (own chore commit on `chore/biome`). `@biomejs/biome` 2.4.16; `biome.json`
  scopes to `.ts/.tsx/.js/.mjs/.json/.css` (excludes `.astro` + legal `.html`); recommended rules
  with 3 documented disables (see CLAUDE.md); `pnpm lint` / `pnpm lint:fix` scripts. Whole tree
  reformatted to 2-space; a11y `aria-hidden` added to decorative icons. `biome check`, `astro
  check`, `pnpm build` all green.

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

### SEO / perf audit (2026-05-29, live prod)

SEO is healthy: all routes ship static HTML with correct per-route title/description/canonical/OG +
JSON-LD, Brotli on, sitemap/robots good. Findings:

- ✅ **Fixed:** `/account/` was in the sitemap despite being a login-gated `client:only` page (no
  server-rendered content). Added to the sitemap filter alongside `/subscribed/`.
- ✅ **Fixed (was: `/_astro/*` cached 4h, not 1yr).** Two-part: (1) **user** flipped CF Browser
  Cache TTL → "Respect Existing Headers" (it had been overriding the header to `max-age=14400`);
  (2) that exposed a `_headers` conflict — hashed assets matched both `/_astro/*` AND generic
  `/*.css`//*.js` rules, and CF *combines* matching rules, yielding a doubled Cache-Control
  (`…immutable, …max-age=3600, must-revalidate`). Removed the generic rules (all CSS/JS is hashed
  under `/_astro/`). **Verified live** via cache-buster: fresh fetch returns a clean single
  `public, max-age=31536000, immutable`.
- 💡 **Optimization (deferred):** the homepage ships ~57KB (brotli) of React runtime (`client.js`)
  solely to hydrate the decorative **Starfield** — the only island on `/`, and vanilla JS pre-
  migration. It's `client:idle` (doesn't block paint), but re-implementing Starfield as a plain
  `is:inline` script would drop React from the homepage entirely (still loads on /audio, /notes,
  /account). Worth a pass if homepage weight matters.
- ⏭️ **Core Web Vitals not measured** — Chrome DevTools MCP not configured this session. Run a
  Lighthouse pass or add `chrome-devtools-mcp` for real LCP/CLS/INP.

#### User action items — status

- [x] **Cloudflare Browser Cache TTL → "Respect Existing Headers"** — done by user; `/_astro/*` now
  caches 1yr (verified live). Follow-on `_headers` conflict fixed in PR #6. _(Stale edge copies of
  the old doubled header will age out, or "Purge Everything" to clear immediately — optional.)_
- [ ] **Google Search Console — UNFINISHED (resume later).** Property added as a **Domain** property;
  verification in progress. **Still TODO:** (1) Sitemaps → submit the **full URL**
  `https://boojy.org/sitemap-index.xml` (a Domain property needs the full URL, not the relative
  path — the relative path returns "invalid sitemap address"); (2) URL-inspection → **Request
  Indexing** for `/`, `/audio/`, `/notes/`, `/cloud/`, `/privacy/`, `/terms/`.
- [x] **GitHub branch protection** — "Lint · Check · Build" set as a required status check on
  `master` (via API; no required approvals so solo merges still work).

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

- **Semantic `<a href="#">` → `<button>` conversion** in `Account` + the download panels (the 7
  `useValidAnchor` sites). Disabled in Biome for now; the proper fix touches CSS (`.platform-item`,
  `.other-platforms-link`) so it's bundled with the styling/a11y pass, not the Biome chore.
- Tailwind / shadcn restyle (separate task — styling stays plain CSS this pass).
- SSR / Cloudflare adapter — not needed while static.
- Always-live notes-version island — build-time bake is the chosen approach.
- A blog/devlog via Astro content collections — scope separately if added.

### 💸 Cost / session telemetry

Line-velocity footprint per session (`git diff --stat` vs the session's starting `master`). Treat as
a rough activity signal — a formatter sweep inflates it without adding behaviour.

- **2026-05-29 · Biome (Phase 8) + CI** (`b471f22..2c89519`, 4 commits): 22 files, **+1985 / −1565**.
  ~90% is the one-time Biome 2-space CSS reformat (semantic-identical); real code change is just
  +54/−18 TS/TSX. Config +190/−2 (biome.json, scripts, lockfile, ci.yml); docs +79/−27.

- **2026-05-29 · Full post-migration session (cost)** — Biome + CI + SEO/perf audit + README rewrites
  + sitemap fix + branch-protection + cache-header fix. **6 PRs (#2–#6 + docs).**
  - **Cost: $55.08** (Opus 4.8 $54.87; Haiku $0.21). API 1h39m / wall 3h30m. ~2432 lines added /
    403 removed (CSS reformat dominates the adds).
  - Opus token mix: 103.5k input · 400k output · **66.6m cache read** · 1.8m cache write — i.e. cost
    was overwhelmingly large-context cache reads, not new generation.
  - **Cost drivers (Anthropic usage view):** 83% from subagent-heavy sessions, 73% at >150k context.
    **Lesson:** be deliberate spawning subagents (each is its own request stream); `/compact`
    mid-task and `/clear` between tasks to keep context — and cost — down. See "Context Hygiene
    Gate" in CLAUDE.md.
