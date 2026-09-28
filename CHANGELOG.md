# Changelog — boojy.org

Changes to the marketing site. Entries under `## Unreleased` as work lands; the suite-wide
convention is in the suite root's `AGENTS.md`.

## Unreleased

### Features
- **The logo's planet spins as you change page.** Any link to another page on the site sends the
  nav logo's planet round once (clockwise), and the next page picks the lap up mid-orbit, so it
  never snaps back.
- **Privacy and Terms, rewritten to be readable.** Each opens with one line and an "In short"
  summary, with the detail on a solid card instead of over the stars. The Website section (empty
  until now) covers Cloudflare Web Analytics, Notes' automatic updates are listed, and both pages
  speak as "I". Together they're about 40% shorter.
- **Tyr's photo in the About card.**
- **The space redesign** (from the Sky Lab). The homepage is a solar system around the Boojy
  logo: soft spectrum orbit rings fading with distance, an asteroid belt, and eight planets you can
  drag (let go and they glide back onto the nearest point of their orbit with a small settle).
  The logo is drawn from its parts: click the sun for a flare, drag the dot on the j. Two app
  cards (Audio, Notes) with real screenshots, an About card, and a one-row footer. The Notes and
  Audio pages get a "Boojy Notes" / "Boojy Audio" lockup, a key-point line, a solid download
  button in the app's colour with "Apple Silicon · v0.10 · Early access · Other platforms"
  under it, the screenshot (Notes with a Dark/Light toggle), four Features tiles, a link to the
  source on GitHub, and the footer on a planet horizon in the app's colour. New 404: "4 (moon) 4"
  in a shifting nebula, with a draggable moon. The nav sits at the top and scrolls away. The
  homepage ships no React; the sky is plain canvas code that caches its rings and caps at 60fps.
- **Boojy Notes downloads for Linux.** The Notes page offers the AppImage and the .deb, for Intel
  and ARM, straight from the latest release (v0.10.0 is the first with Linux). Linux visitors get
  "Download for Linux" (the AppImage); "Linux support" is out of Coming soon, and the page
  description and search data now say macOS, Windows and Linux.

### Bug Fixes
- **Feature tiles fade in on time, not on scroll.** Their fade was tied to scroll distance, so it
  felt slow, and on phones the last tiles stayed half-faded because the page couldn't scroll far
  enough.
- **The planet horizon is round on phones.** It was a tall oval that read as a steep hill on
  narrow screens.
- **The logo's flares play in Safari, and the logo behaves on touch.** No grey tap box or
  long-press menu on the sun, N, A and planets, and a dragged dot rides above your finger instead
  of under it.
- **The footer rests at the bottom of short pages** on tall screens, instead of floating
  mid-screen.
- **The Boojy logo always renders in its own font.** The logo's "Boojy" was live text in Poppins,
  which an SVG shown as an image can't load, so any visitor without Poppins installed saw it in
  Times. The letters are now outlines, identical to the design.
- **Shooting stars no longer pile up.** Coming back to a tab that had been in the background
  launched every star it had queued at once, more the longer it had been away. Stars now only
  launch while the page is visible.
- **Phones aren't offered desktop installers.** An iPhone was offered the macOS download (its
  browser says "like Mac OS X"); Android would have been offered Linux. Phones and tablets now see
  "A desktop app for macOS, Windows and Linux" on the Notes page, with the full list still one
  tap away.
- **No sideways scrolling.** Every page was about 60px wider than the window on desktop (the hero
  glow), and the Notes page overflowed on phones.
- **Notes and Audio pages say what the apps do today.** Notes: the "Open in Web" button is gone
  (the browser version doesn't save notes to disk); the features list drops backlinks and import
  (both removed in v0.6.0) and adds `/` commands, the Markdown view, version history, Recently
  Deleted, and your own folders synced through iCloud Drive or Dropbox; "Coming soon" becomes
  "What's next" (Beta, then web and phone later); macOS Intel "Coming soon" is gone (no Intel build
  is planned). Audio: drum kit, step grid, automation, input monitoring and join/reverse move from
  "Coming soon" to the features list (all shipped by v0.6.0); "What's next" is the v0.7
  reliability release; Linux reads "Planned".
- **Privacy page no longer mentions unsubscribing from emails.** The line came from the retired
  Mailchimp newsletter; the site sends no emails. "Last updated" bumped to 2026-09-07.

### Improvements
- **A calmer, fuller sky.** The stars scroll closer to the page's speed and the solar system fades
  to half past the hero, so the rings no longer feel like glass sliding over a still sky. Planets
  and rings are bigger on large screens, and a dragged dot or moon passes in front of everything.
- **Nav and spacing polish.** Bigger nav links that take their app's colour (Audio blue, Notes
  teal) when active or hovered, tighter gaps around Features, and the footer's © in the same
  colour as the links.
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
