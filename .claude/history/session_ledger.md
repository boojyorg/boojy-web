# Session Ledger — boojy.org

Append-only per-session log: work done, gate results, cost/token telemetry, and a handoff note for
the next session. Newest entry on top.

---

## 2026-05-29 · Execute Astro migration (Phases 0–7) · astro-migration

### Session Work

| Task | Outcome |
|---|---|
| Phase 0 — Scaffold + pnpm | Astro 6.4.2 + @astrojs/react 5 + sitemap; pnpm (lockfile via install, `onlyBuiltDependencies` for esbuild/sharp); single strict `tsconfig` (`noUncheckedIndexedAccess`); `public/css` → `src/styles` |
| Phase 1 — Layout + chrome | `BaseLayout.astro` (static SEO head + umami inline + native `@view-transition`, no ClientRouter); pre-paint glow via root `--glow-origin` CSS var (4 glow stylesheets updated; hamburger anim → `.open` class); `Nav`/`Footer`/`ProductCards`/`ProductCloudCard` as `.astro` |
| Phase 2 — Pages | All 9 routes ported; legal via `set:html` + `?raw` |
| Phase 3 — Islands | Starfield (idle), FaqAccordion (visible), Audio/NotesDownload (load; OS detect moved to `useEffect` for SSR safety), Account (client:only). `lib/notes-version.ts` build-time fetch (timeout + fallback) — baked real `v0.4.0` from GitHub |
| Phase 4 — SEO | JSON-LD (Organization on `/`, SoftwareApplication on `/audio`+`/notes`); robots → `/sitemap-index.xml`; `/subscribed/` filtered from sitemap |
| Phase 5 — Deploy config | `_redirects` (drop SPA catch-all; add legacy `.html`→clean + trailing-slash 301s); `_headers` (`/_astro/*` immutable); deleted `netlify.toml`; root build script → pnpm |
| Phase 6 — Delete SPA | Removed all SPA files/hooks/`public/js`/`logo-test`; fixed 2 `noUncheckedIndexedAccess` errors (page-meta 404 fallback, Starfield colour index) |
| Phase 7 — Verify | All routes 200 + correct meta; 404 returns 404; content SSR'd; no SPA leftovers; **manual walkthrough passed** |

### Key decisions / findings

- **Legal URLs reversed from spec.** Astro can't emit a literal `/privacy.html` file (every output
  format either nests it as `privacy.html/index.html` or doubles to `privacy.html.html`). Shipped
  **clean URLs `/privacy/` `/terms/` `/subscribed/` + 301s** from the old `.html` URLs. User
  confirmed.
- **No `<ClientRouter />`** — kept native `@view-transition`; glow morph is a no-flash root-CSS-var
  pre-paint script.

### Gates

| Gate | Result |
|---|---|
| `pnpm exec astro check` | ✅ 0 errors, 0 warnings (2 deprecation hints, pre-existing) |
| `pnpm build` | ✅ 9 pages, clean |

### Notes (handoff)

**Next: merge + CF settings flip, in lockstep.** Branch `astro-migration` is 5 commits ahead of
`master`. Do NOT change CF Pages build settings before merge (shared prod/preview — the deploy
trap). At merge: set CF root `website`, build `pnpm build`, output `dist`; validate on the branch
preview deploy first. Then Phase 8 (Biome) as its own commit. Optionally update
`docs/ASTRO_MIGRATION_PLAN.md` to note the legal-URL reversal.

---

## 2026-05-29 · Set up .claude context system + cut migration branch · astro-migration

### Session Work

| Task | Outcome |
|---|---|
| Ported boojy-design's `.claude` system | Added `CLAUDE.md` (re-aimed at Astro target), `dreams.md` (working memory), `settings.json` (compactPrompt + 2 PostToolUse hooks), `hooks/post-edit-validation.sh` (astro check gate, graceful skip pre-Astro), this ledger, and the `session-metrics` skill |
| Adapted gates | Gate is `astro check` (Biome/vitest deferred — no suite yet); hook scoped to `website/**/*.{astro,ts,tsx}` |
| Migration spec | Lives in `docs/ASTRO_MIGRATION_PLAN.md`; live status tracked in `dreams.md` §1 (Phases 0–8) |

### Gates

| Gate | Result |
|---|---|
| astro check | n/a — Astro not scaffolded yet (hook skips until Phase 0 installs it) |

### Notes

**Next session — execute migration Phase 0** (scaffold Astro + pnpm) per `docs/ASTRO_MIGRATION_PLAN.md`.
Remember the CF Pages build-settings deploy trap: do not change Pages build config until merge time.
Stale `*/.claude/settings.local.json` files had dead absolute paths from the old repo location —
tidy or ignore as you go.
