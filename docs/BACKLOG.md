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
- **The Notes wordmark is a copy from `boojy-notes` (2026-09-11).**
  `website/public/images/notes-text-logo.png` is that repo's
  `assets/boojy-notes-wordmark-light.png`, kept under this site's own `<app>-text-logo.png`
  name rather than the app's filename. Mind the naming: `-light` is the variant drawn *for the
  app's Light theme*, so its ink is near-black — chosen on purpose, to sit with
  `audio-text-logo.png` on the dark ground. `boojy-notes` regenerates its variants whenever the
  app's `TEXT.primary` moves and this copy does not follow, so re-copy when the wordmark
  changes. If the set ever goes pale, `-dark` is the one to take: its ink is `#E8EAF0`, the
  site's own `--color-text`.
- **`/audio/` and `/notes/` end at the version line (2026-09-11).** The "in Early Access, so
  there may be bugs" note went, and the `Got feedback?` line under it with it: the stage is
  already on the version string and the homepage card badge. Those two pages no longer link to
  `/#feedback` — the anchor and the footer email are the remaining routes. `/design/` keeps its
  own note (paused development, which is not the same claim) and is now the only user of
  `.hero-note`.
- **Static-first, no SSR, never Vercel.** See `AGENTS.md`.

## Next: homepage polish (brainstormed 2026-09-07, not yet planned)

Needs one to three reference sites and the UI intake before any plan. Items raised so far:

- Wordmarks are black PNGs on a dark ground (Boojy in the hero; Audio and Notes on the cards),
  so the brand is the lowest-contrast thing on the page. Ship them as SVG inked with `currentColor`,
  keeping the coloured glyph. (Also the June review's "wordmark dark-on-dark legibility" item.)
  Still open after the 2026-09-11 Notes refresh: the new artwork went in, but deliberately in the
  black-ink variant, so the contrast problem is unchanged and is a whole-set decision.
- Notes card: logo refreshed 2026-09-11 (the old arch-N artwork was two designs behind). Still a
  web-build screenshot — recapture, and use one screenshot recipe for both cards (same window
  size, aspect, theme, real-looking content).
- Stage pills over the screenshots read as warning stickers. Move status into the card body as a
  quiet line (version can come from the existing build-time fetch); calm the three solid buttons.
- "Always free" wording must survive a possible paid hosted-storage option: say "every app and
  every editing feature", never "every feature".
- Why Boojy: two columns on desktop (story left, promises right) as the card data already
  describes; tighten the story line.
- Hero: the one expressive motion moment (parallax on the starfield, the orbit mark's moon
  becoming the three app glyphs on hover, glow following the hovered card). Keep everything else
  quiet.
- Tighten the vertical rhythm between hero, cards and Why Boojy.

## Unscheduled

- **Auto-rebuild on app release.** A Cloudflare Pages Deploy Hook POSTed from each app's release
  workflow so a new tag rebuilds the site; today baked versions refresh on the next deploy.
  Deliberately deferred while releases are rare.
- **Core Web Vitals not measured.** Run a Lighthouse pass for real LCP / CLS / INP and add the
  Cloudflare Web Analytics beacon (free CWV data).
- **Drop React from the homepage.** The feedback form island is gone, so `Starfield` is the last
  React island on `/`; making it `is:inline` vanilla JS removes React from the homepage entirely.
- **Privacy and terms freshness check.** Carried from June. The one known inaccuracy (a newsletter
  "Unsubscribe" line) was fixed 2026-09-07; a full read-through against what the apps actually do
  is still owed.
- **CSS consolidation** 4 → 1 product stylesheets (June site review, rec #9).
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
