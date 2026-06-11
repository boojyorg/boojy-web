# boojy.org site review — 2026-06-11

Multi-agent review (102 agents): four fact-finding reviews — bugs, accounts, feedback form, SEO —
each finding adversarially verified by a 3-judge panel (correctness / materiality / reproduction)
before inclusion, plus five advisory reports (UI/UX from fresh full-page screenshots of every page,
space theming + animated logo, testing/CI, maintainability, News/versions). 23 findings confirmed,
8 rejected. Review only — nothing has been changed.

---

## 🚨 Urgent — three production outages, all silent

These are live on boojy.org right now and fail without any visible error:

1. **The Supabase project is gone from DNS.** `wupmcvhzstgsdrvcigtm.supabase.co` returns
   NXDOMAIN on every resolver — the classic signature of a **paused free-tier project**
   (created ~Feb 2026; Supabase pauses inactive free projects and drops their DNS).
   The website code is *correct* — the Account island ships and hydrates fine with the URL and
   anon key baked in — but every sign-in, sign-up, OAuth call, and edge-function call dies with
   `ERR_NAME_NOT_RESOLVED`. **Fix:** log into supabase.com → the project should show Paused →
   Restore. No code change needed. Consider a keep-alive ping or plan upgrade to stop recurrence.
   *2-minute test:* open https://boojy.org/account/ with DevTools, try email sign-in — you'll see
   the DNS failure in the console; restore the project and retry.

2. **The "Found a bug?" form has no backend — every submission is lost.** The form is live on the
   homepage and calls the `feedback` Edge Function, but boojy-cloud has no such function and no
   feedback table (it's the known P4 item — UI shipped ahead of backend). Visitors get the error
   state and their message goes nowhere, while the headline promises "it goes straight to my
   inbox." The live bundle also still ships the **Turnstile TEST site key**
   (`1x00000000000000000000AA` — always passes, zero spam protection). **Fix:** either build P4
   (verify Turnstile server-side with a real key pair, insert into a feedback table, **and send an
   email notification** so the inbox promise is true), or until then swap Send for a
   `mailto:tyr@boojy.org` fallback / hide the form.

3. **Analytics has been dead site-wide.** Every page loads umami from
   `umami-production-fc39.up.railway.app`, and that Railway app no longer exists (404 at the
   root). Zero pageview data is being collected. **Fix:** restore/redeploy umami and update
   `BaseLayout.astro:81`, or remove the tag — the testing advisor suggests **Cloudflare Web
   Analytics** as a free zero-maintenance replacement that also gives real-user Core Web Vitals.

---

## Answers to the questions asked

- **Is the accounts page working?** No — but not because of your code. Verdict: **broken in
  production solely because the Supabase project is paused** (item 1 above). The island ships
  correctly. Secondary fixes for when it's back: OAuth errors are silently swallowed
  (`useAccount.ts:119` — the try/catch is dead code because supabase-js *returns* errors rather
  than throwing), profile-load errors silently show "Free" (`useAccount.ts:22`), "Manage
  Subscription" has no handler and no backing edge function (gated behind `CLOUD_LAUNCHED`), and
  the `?upgraded=true` checkout return is never handled.

- **Does "Found a bug" work?** No — never has (item 2 above). **Email optional vs mandatory: keep
  it optional, exactly as built.** Mandatory email is the biggest conversion killer on feedback
  forms; the most valuable reports on a free indie site are drive-by bug sightings. Requiring
  email doesn't reduce spam (bots fake addresses — Turnstile is the spam defense), it only filters
  out shy humans. The current placeholder "Email (optional, for a reply)" already nudges people
  who want a response. One addition: when Turnstile is blocked by an ad blocker the form is a
  dead end — add a "blocked? email me instead" fallback.

- **Keep News?** **Yes — but make it yours.** Dropping it would unwind the locked 2026-06-01
  decision (News replaced the /updates idea) and remove P3's foundation, plus the homepage
  "Latest" strip and the site's only freshness signal. The real problems are smaller: rewrite
  `june-2026.md` in your own voice (~15 min — its shape is right, its voice isn't), and change
  the `/news/` subtitle from "Monthly notes…" to something cadence-free so a 3-month gap doesn't
  read as abandonment. Only post when something shipped you'd tell a friend about. Do **not**
  turn News into patch notes — GitHub releases already do that job better.

- **Previous versions / changelog?** GitHub already *is* your public changelog — Audio has five
  public v0.5.x releases plus v0.3.x with binaries attached per release, and the release bodies
  are genuinely good prose. **Ship now (~30 min):** an "All versions →" link under the /audio and
  /notes download buttons pointing to each repo's releases page. **App-repo task:** publish
  boojy-notes' draft releases (only v0.3.0 is public — its link would be nearly empty).
  **Defer:** a built `/audio/releases` page until after P2's deploy hook (otherwise it's stale
  between manual deploys). **Skip:** mirroring CHANGELOG.md on the site. Division of labour:
  GitHub = exhaustive per-version changelog; /news = occasional personal narrative linking to it.

- **Testing / CI / Playwright MCP?** Current gates verify the *code*, nothing verifies the *built
  site behaves* (the shipped dead macOS Notes link is exactly the class CI can't see). Note:
  boojy-design's committed suite is actually **Vitest**, not Playwright — Playwright MCP there is
  an *agent QA instrument*, not a test suite. Adoption plan:
  1. **PR 1:** Vitest unit tests for `github-release.ts` fallback paths (+ optional
     `GITHUB_TOKEN` support to kill CI rate-limit flake). Highest ROI, ~60 lines.
  2. **PR 2:** ~6-spec Playwright smoke suite against the built dist (pages render, nav + mobile
     toggle, download buttons carry real *versioned* GitHub URLs, feedback form validates
     offline, 404).
  3. **PR 3:** `linkinator` over dist/ in CI; external link checks as a weekly scheduled
     workflow that opens an issue (never a PR gate).
  4. **PR 4 (later):** one axe a11y spec, serious/critical only.
  - **Yes, copy boojy-design's `.mcp.json`** — it's one file, no deps, and it's the only sane
    coverage for the login-gated Account island (agent-driven QA; complements the puppeteer
    screenshot tool, which only *sees*, by also *interacting*).
  - **Skip:** visual regression (starfield/glow churn vs a designer's intentional changes) and
    Lighthouse CI (use Cloudflare Web Analytics for free real-user CWV instead).

- **SEO?** **Grade B+.** Fundamentals are genuinely strong (unique titles/descriptions from one
  source, correct canonicals, full OG/Twitter, JSON-LD for Organization + three products, clean
  sitemap + robots, immaculate redirect hygiene). Gaps, by impact:
  1. **No `<h1>` on the homepage or any product page** — image-based heroes mean Google's
     strongest on-page signal is missing where it matters most. Fix: visually-hidden h1 text
     wrapping the wordmarks.
  2. **www.boojy.org doesn't resolve at all** — Cloudflare dashboard fix (proxied CNAME + 301
     rule), no repo change.
  3. **OG images undersized/transparent** for the `summary_large_image` card every page requests
     (default is 595×419 transparent; previews are 600×400) — make real 1200×630 cards.
  4. **Stale meta descriptions:** homepage + /cloud/ still say Cloud is "rolling out soon" while
     your own news post says it shipped.
  5. Smaller: noindex /account/ + /subscribed/; news posts lack `og:type=article` +
     `article:published_time` + BlogPosting JSON-LD; /cloud/ is the only product page without
     SoftwareApplication JSON-LD (add it with a $0 offer now Cloud is live).

- **Bugs spotted (beyond the outages):**
  - Audio download CTA permanently says "(Silicon)" for Linux/unknown-OS/no-JS visitors and
    pre-selects the mac-arm64 row (`AudioDownload.tsx:69` — NotesDownload does this correctly;
    initialise neutral and only set on positive detection).
  - `ProductCloudCard.astro` is dead code (zero imports) along with its `site.ts` icon constants.
  - The **Design card's "Learn more" button is invisible** — hub.css has accent background rules
    for audio/notes/cloud CTAs but none for design, so it renders near-black-on-dark. Your newest
    product looks like the one you can't click.

---

## UI/UX critique (from screenshots of all 9 pages, desktop + 390px + 768px)

**What works:** the product-page system (wordmark hero → promise → CTA → screenshot → benefits →
honest Current/Coming-Soon split) is genuinely strong and rare; "free, open-source, made by one
person" lands; mobile holds up; the 404 page ironically has the clearest CTA hierarchy on the
site; the cosmic backdrop is restrained.

**Fix, by user impact:**
1. **Design card CTA invisible** (bug, above) — one missing hub.css rule.
2. **Wordmarks are dark-on-dark everywhere** — the brand name is the least legible text on the
   site at the most important positions. Light-on-dark wordmark variants (or a subtle outline)
   is the highest-leverage visual change available.
3. **Cloud's status is told three contradictory ways** — /news + /cloud say live; the homepage
   card image says "Beta: February 2026"; /account says "rolling out soon" *right above the
   sign-up buttons*. Align all four to "live, free, 500 MB."
4. **Product-page hero CTAs look secondary** — the most valuable button on each page is its
   quietest. Give each its product accent fill.
5. **Homepage hero has no action** — add a low-key "See the apps ↓" cue; consider
   action-specific card labels over four "Learn more"s.
6. Polish: stray hero planet wraps below the wordmark at 390px; 768px grid could be two-up;
   "EARLY ACCESS" on all four cards carries no information (use per-product stage labels);
   feedback form uses placeholder-only labels (a11y); version/footer text contrast; /news header
   has a hard seam where the dark band meets the starfield.

(Note: the local-preview 404 screenshot artifact was the preview server's trailing-slash quirk —
production serves your real 404 correctly.)

---

## Space theme + animated orbit logo

Ranked ideas (full plan below): **(1)** the animated logo itself; **(2)** extend 2–3 of the
homepage nebula gradient layers into `shared.css` so subpages stop falling back to flat
`#13151c` — trivial effort, the space feel currently evaporates off-homepage; **(3)** the 404 as
a lost-in-space moment (planet drifted off its ring, "This page drifted out of orbit"); **(4)**
per-product planet glyphs — abstract flat discs only, *highest cheapening risk*, mock up first;
**(5)** planet-rise hover gradient on card bottom edges; **(6)** one orbit-arc divider, used
once; **(7)** nav active state as a 3px "moon" dot. **Deliberately don't:** more shooting stars,
cursor trails, scroll parallax, or space-themed copy on serious pages — restraint is what keeps
the current design calm.

<details>
<summary><strong>Animated logo — full implementation plan (measured from the PNG)</strong></summary>

Measured from `Boojy_Image_Logo.png` (595×419): sun circle center ≈ (304, 222) r ≈ 165, flat
`#FFB71D` (a faint top-left radial `#FFC23A → #FFB71D → #F2A60F` reproduces the soft look);
planet center ≈ (530, 52) r ≈ 50 `#666666`; ring `#DEDEDE`, stroke ≈ 24, ellipse center
(300, 215) rx ≈ 295 ry ≈ 108 rotated ≈ −23°. Confirmed by pixel sampling: in the static logo the
ring already passes **in front** of the sun at the bottom, so the front/back split is faithful
tracing, not invention.

**Tech: CSS `offset-path` + animated `offset-distance`** (universal since ~2022) over SMIL
`animateMotion` — SMIL can't be paused from CSS, so honoring `prefers-reduced-motion` would need
JS. Wrap in `@supports (offset-path: path("M0 0"))` with a static `transform: translate(530px,
52px)` fallback = pixel-identical static logo on old browsers.

**Z-order:** split the ring ellipse into two stroked arcs (far arc behind the sun, near arc in
front, matching the PNG). Render the planet **twice** with the identical offset-path animation,
each copy inside a static half-plane `clipPath` (a big rect rotated −23° through the ellipse
center): far copy clipped to the upper half-plane and layered below the sun, near copy clipped to
the lower half-plane above everything. Handoff happens exactly at the ellipse extremes where both
copies straddle the clip line and tile perfectly — cannot flicker (unlike keyframed visibility
swaps). Paint order bottom→top: ring-far → planet(far, clipped) → sun → ring-near → planet(near,
clipped).

```html
<svg viewBox="0 0 595 419" aria-hidden="true" class="boojy-mark">
  <defs>
    <radialGradient id="sunShade" cx="40%" cy="32%" r="78%">
      <stop offset="0%"  stop-color="#FFC23A"/>
      <stop offset="55%" stop-color="#FFB71D"/>
      <stop offset="100%" stop-color="#F2A60F"/>
    </radialGradient>
    <clipPath id="far">  <rect x="-600" y="-1400" width="2000" height="1400"
                               transform="rotate(-23 300 215)"/> </clipPath>
    <clipPath id="near"> <rect x="-600" y="0"     width="2000" height="1400"
                               transform="rotate(-23 300 215)"/> </clipPath>
  </defs>
  <path class="ring" d="<upper arc>"/>                               <!-- behind sun -->
  <g clip-path="url(#far)">  <circle class="planet" r="50" fill="#666"/> </g>
  <circle cx="304" cy="222" r="165" fill="url(#sunShade)"/>
  <path class="ring" d="<lower arc>"/>                               <!-- in front -->
  <g clip-path="url(#near)"> <circle class="planet" r="50" fill="#666"/> </g>
</svg>
```

```css
.ring   { fill: none; stroke: #DEDEDE; stroke-width: 24; stroke-linecap: round; }
.planet { transform: translate(530px, 52px); }   /* fallback = exact static logo */

@supports (offset-path: path("M0 0")) {
  .planet {
    transform: none;
    /* START the path at the planet's static position so 0% = today's logo */
    offset-path: path("M530 52 A295 108 -23 1 0 <opposite pt> A295 108 -23 1 0 530 52");
    offset-rotate: 0deg;
    animation: orbit 18s linear infinite;
  }
}
@keyframes orbit { to { offset-distance: 100%; } }

@media (prefers-reduced-motion: reduce) { .planet { animation: none; } }
```

Starting the path at (530, 52) makes both fallbacks pixel-identical to today's logo for free.
**Easing: `linear`, non-negotiable** — easing reads as a pendulum; the tilted ellipse already
gives natural apparent speed variation. Duration ~18s (tune 14–24s). Build as
`src/components/BoojyMark.astro` (inline SVG + scoped style); use in the homepage hero always,
and in the nav **orbit on `.nav-brand:hover` only** (the nav is fixed/ever-present; WCAG 2.2.2
frowns on >5s auto-motion without a pause control — hover-orbit is the restrained option, ship
it first). **Keep the PNG** for JSON-LD logo, OG images, and favicons — scrapers want raster.

Tracing workflow: overlay the SVG on the PNG at 50% opacity on a scratch page, screenshot with
the existing tool, tune cx/cy/rx/ry/rotation until aligned.

Verify: planet glides smoothly and visibly passes behind the sun's upper edge and in front at
the lower-left, no flicker at the extremes; macOS Reduce Motion → frozen at today's exact logo;
view transition keeps the nav mark stable.
</details>

---

## Maintainability (what hurts in 12 months, prioritized)

1. **Product-page CSS duplication** — `audio/notes/design/cloud.css` are the same ~330-line
   stylesheet with prefixes swapped (~900 duplicate lines) and **already diverging** (different
   var usage, two naming schemes for the same checklist). **Consolidate into one
   `product-page.css` driven by per-page CSS variables** (the `--glow-color` pattern already
   exists — extend to `--page-accent`). Don't do a deep token refactor — the future
   Tailwind/shadcn restyle would discard it; consolidation makes that restyle 4× cheaper.
2. **Stale public meta copy** in `page-meta.ts` (the SEO finding) — 10 minutes, fix this week.
3. **The Cloud paid-tier ambiguity** — ROADMAP "Locked decisions" still says "Orbit = coming"
   and P4 plans a "paid-tier waitlist", while `cloud.ts` says "free + open-source, not
   subscription-driven" and the live page is free-only. `stripe.md` and `useAccount`'s Orbit
   mapping follow the old story. **One decision, one doc-sync commit** — otherwise a fresh
   session builds toward the wrong answer.
4. **One docs-sync PR:** CLAUDE.md routes list omits `design/`; root README says "Audio, Notes,
   and Cloud — rolling out soon" (no Design, Cloud is live) and omits boojy-design from the
   repo list; website README tree omits `src/hooks/`; BACKLOG's ".DS_Store is tracked" is stale
   (it's ignored); CHANGELOG's "Unreleased" has absorbed two shipped redesigns — adopt the
   date-stamped deploy convention the file already half-uses.
5. **One deletion PR:** `ProductCloudCard.astro` + its `site.ts` icon constants; ~100 dead
   `.product-cloud-*` lines in `shared.css` (shipped globally); ~125 dead `.hub-signup-*` lines
   in `hub.css`; decide the orphaned `/subscribed/` page (nothing links to it); move
   `INFRASTRUCTURE_SETUP.md` to docs/archive/; `scripts/suite-dashboard.sh` belongs in the
   umbrella repo. Also: `FaqAccordion`'s styles no longer exist anywhere — if remounted as-is it
   renders unstyled; note that on the component.
6. Smaller: two different Design oranges (`#ffa500` token vs `#e89940` used for nav/glow) while
   `#ffa500` *also* means "coming soon" — pick one meaning per hex before the restyle; nav hover
   hardcodes product hexes next to their own tokens; `AudioDownload`/`NotesDownload` ~70% shared
   (BACKLOG already tracks the merge — do it when a third downloadable app appears).

**Content/config rule drift:** taglines, checklists, and value-prop copy live in page
frontmatter, not `src/content/` as CLAUDE.md claims. Defensible for a solo designer — so soften
the CLAUDE.md sentence to "shared/cross-page copy in content/; page-local copy at the top of the
page's frontmatter" and make the doc true.

Dependencies: clean — all 7 runtime deps used, only patch/minor updates pending.

---

## Top 10 recommendations (ranked)

| # | Action | Effort |
|---|--------|--------|
| 1 | **Restore the Supabase project** (unpause in dashboard) — un-breaks accounts + everything backend | minutes |
| 2 | **Feedback form:** build P4 (real Turnstile keys + table + email notification) or mailto-fallback until then | hours / minutes |
| 3 | **Fix or remove dead umami analytics**; consider Cloudflare Web Analytics (also gives free CWV) | minutes |
| 4 | **Quick-wins PR:** Design card CTA fill, stale meta descriptions, hidden `<h1>`s, www redirect (CF dashboard), align Cloud status copy in all four places | an afternoon |
| 5 | **Animated orbit logo** (`BoojyMark.astro`, plan above) + nebula backdrop on subpages + 404 lost-in-space | a day, in pieces |
| 6 | **Testing PR 1+2:** Vitest for `github-release.ts` + 6-spec Playwright smoke vs dist; copy boojy-design's `.mcp.json` | a day |
| 7 | **"All versions →" links** to GitHub releases under the download buttons; publish boojy-notes' draft releases (app repo) | ~30 min |
| 8 | **News:** rewrite june-2026.md in your voice; drop "Monthly" from the subtitle | ~30 min |
| 9 | **CSS consolidation:** 4 product stylesheets → 1 + per-page variables (before any restyle) | a day |
| 10 | **Decide the Cloud paid-tier question**, then one docs-sync commit + one dead-code deletion PR | an hour |

Wordmark legibility (dark-on-dark) is the standing design question above all of these — it's a
brand-asset decision rather than a repo change, but it's the highest-leverage visual improvement
available.

---

*Verification panel rejected 8 candidate findings (including "stale fallback version" and several
plausible-sounding race conditions) as unverifiable or immaterial — they are excluded above.
Screenshots used for the UX review were taken 2026-06-11 from a fresh build of master at
390/768/1280px widths.*
