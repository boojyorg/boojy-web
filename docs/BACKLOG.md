# Backlog — boojy.org

The one planning file for the site: the decisions that shape it, what's next, and unscheduled
items. Shipped work leaves here for `CHANGELOG.md`. How the site works lives in `AGENTS.md` and
`.claude/rules/`.

## Decisions

- **Boojy Cloud is not on the site.** It left the lineup in 2026-08: `/cloud/` and `/account/` 301
  to `/`, the Supabase/Stripe wiring is gone, and the site has no backend. The suite position on
  Cloud (a future possibility) is in the suite root's `VISION.md` §7; the site doesn't mention it.
- **Site map (2026-09; first locked 2026-06-01):** nav pillars Audio · Notes and one utility link,
  GitHub. Dropped over time: `/roadmap`, `/about`, `/cloud/`, `/account/`, the Cloud FAQ, `/news/`
  (its one post went stale and wrong), the old newsletter confirmation page, the homepage
  feedback form (2026-09) and the Feedback section that replaced it (2026-09-11). The footer
  email is the site's only contact route; `/#feedback` is a dead anchor.
- **Boojy Design is unlisted (2026-09).** Off the homepage grid, the nav and the footer, and out of
  the marketing copy (homepage meta + JSON-LD) and the Terms "What Boojy Is" list. `/design/` itself
  stays live, linkable and indexable — it's just no longer promoted. The `preview` badge flag went
  with it. Re-listing is a revert: add the card back to `PRODUCT_CARDS` and a link to
  `Nav.astro` / `Footer.astro`.
- **Logos are drawn, not images (2026-09-28).** The Boojy logo and the Notes/Audio wordmarks are
  built from Poppins outlines (`website/src/content/glyphs.json`), so they're light on the dark
  ground and never depend on a font loading. If an app's glyph (the teal N, the blue A) changes,
  update `lib/wordmark.ts`.
- **App pages end at Features (2026-09-28).** Hero, screenshot, four Features tiles, a GitHub
  line, then the footer on the app's planet horizon. No Current/Coming-soon lists (they kept going
  stale) and no feedback invite until the apps reach Beta. `/design/` keeps its own paused-
  development note and is the only user of `.hero-note`.
- **Notes is desktop-only on the site (2026-09-27).** No "Open in Web" button: the browser build
  at notes.boojy.org is a development target whose notes live in browser storage (boojy-notes
  README). Bring a web option back when Notes on the web saves notes properly. Phones and tablets
  get a "desktop app" line instead of an installer, on every download island.
- **Static-first, no SSR, never Vercel.** See `AGENTS.md`.

## Next: redesign follow-ups

The space redesign shipped from the Sky Lab (spec: https://claude.ai/artifact/17QQiaUjrCMM8iyGBNV6y8;
decisions in `CHANGELOG.md`). Left over:

- **Real screenshots.** The Notes pair was captured from the browser build in a wide window, so it's
  mostly empty at card size; recapture at about 1100×700 with a fuller note, light and dark. Audio's
  is from v0.5.2. Use one recipe for both apps.
- **Audio's "macOS Intel" download** points at the same `.dmg` as Apple Silicon, which is probably
  arm64-only (the release build runs on arm64 runners). Verify, then drop the row or ship a
  universal build.
- **Phone check on real devices.** Dragging the homepage planets is mouse/pen only (touch keeps
  scrolling the page); the j's dot and the 404 moon do drag on touch. The flare and touch fixes
  (2026-09-28) were checked in desktop and emulated-mobile browsers only: confirm on an iPhone.
- **`/design/`** still uses the old black wordmark image (unlisted, deliberately untouched).

## Unscheduled

- **Core Web Vitals not measured.** Run a Lighthouse pass for real LCP / CLS / INP and add the
  Cloudflare Web Analytics beacon (free CWV data).
- **Privacy and terms freshness check.** Carried from June. The one known inaccuracy (a newsletter
  "Unsubscribe" line) was fixed 2026-09-07; a full read-through against what the apps actually do
  is still owed.
- **CSS consolidation:** Notes and Audio now share `product.css`; `design.css` and `legal.css` remain.
- **Google Search Console (reassess).** A domain property was being verified in June; check whether
  it completed and whether `https://boojy.org/sitemap-index.xml` was submitted. The June list of
  URLs to index included `/cloud/`, which no longer exists.
- **Tailwind/shadcn restyle.** The Astro migration was framework-only; a visual restyle is a
  separate future task.
- **Semantic `a→button`** for the 7 `useValidAnchor` sites (the rule is currently off in
  `biome.json`).
- **Single config-driven download island** — replace the two parallel `AudioDownload` /
  `NotesDownload` components with one.
- **404 self-canonical** without trailing slash.

## Dropped

- The old roadmap's "P3 narrative" (updates storytelling beyond news) and "P5 product registry" —
  News is gone, and `PRODUCT_CARDS` + `STAGE_LABELS` in `site.ts` already are the product model.
