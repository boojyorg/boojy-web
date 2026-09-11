# Changelog — boojy.org

Changes to the marketing site. Entries under `## Unreleased` as work lands; the suite-wide
convention is in the suite root's `AGENTS.md`.

## Unreleased

### Bug Fixes
- **Privacy page no longer mentions unsubscribing from emails.** The line came from the retired
  Mailchimp newsletter; the site sends no emails. "Last updated" bumped to 2026-09-07.

### Improvements
- **Planning files pruned.** `dreams.md` (a June to-do list) and `docs/ROADMAP.md` are gone; their
  unfinished items and locked decisions live in `docs/BACKLOG.md`, now the one planning file. The
  stale `session-metrics` skill from the Astro migration is removed.
- **Contribution policy simplified** (`CONTRIBUTING.md`, `README.md`): personal project, no
  external code contributions, feedback and bug reports by email to tyr@boojy.org.
- **News removed.** The `/news/` archive, its one post (which still described the retired Boojy
  Cloud sync), the content collection, the homepage "Latest" card, and the nav/footer links are
  gone. `/news` and `/news/*` 301 to `/`.
- **Homepage Feedback section removed.** The React form island went first (replaced by a plain
  mailto line), then the section itself: the suite's `CONTRIBUTING.md` files route feedback to
  tyr@boojy.org directly, so nothing pointed at the anchor any more. The homepage now closes on the
  "Why Boojy" card, `/#feedback` is a dead anchor, and the footer email is the site's contact route.
  The island, its rule file, the form styles and the section's own styles are all gone.
- **Newsletter leftover removed.** `/subscribed/`, the confirmation page from the old Mailchimp
  signup (form removed months ago), is deleted; `/subscribed`, `/subscribed/` and
  `/subscribed.html` 301 to `/`. The site has no account, sign-in or newsletter functionality.
- **Boojy Design removed from the public site.** Briefly labelled "Preview", then unlisted
  altogether: it is off the homepage grid, the nav and the footer, and out of the marketing copy
  (homepage meta, OG, JSON-LD) and the Terms "What Boojy Is" list. `/design/` itself is untouched —
  still live, still linkable, still indexed — it is simply no longer promoted, and re-listing it is
  a revert. The off-ladder `preview` flag introduced for the badge went with it.
- **Audio leads Notes** on the homepage grid, in the nav (desktop and mobile), in the footer and in
  the Terms list. With two cards instead of three the grid is capped at 820px and centred, so each
  card keeps roughly the width it had three-up.
- **Notes wordmark refreshed** from `boojy-notes`' own asset; the site had been showing artwork two
  designs behind. Provenance and the light/dark variant trap are recorded in `docs/BACKLOG.md`.
- **Product heroes end at the version line.** The "in Early Access, so there may be bugs and
  unfinished features" note on `/audio/` and `/notes/`, and the "Got feedback?" line under it, are
  gone — the version string and the card badge already carry the stage. `/design/` keeps its own
  note (paused development, a different claim) and is the only remaining user of `.hero-note`.
- **Stale download fallbacks corrected:** `/notes/` v0.3.0 → v0.7.0, `/audio/` v0.5.2 → v0.6.0.
  These only surface if the build-time GitHub release fetch fails.
- **"Why Boojy" copy:** "Open source, once it's ready" → "Open source — every app's code is public
  on GitHub, under GPLv3."
