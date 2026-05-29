---
paths:
  - "website/public/_headers"
  - "website/public/_redirects"
  - "website/astro.config.mjs"
  - "website/package.json"
  - "package.json"
---

# Caching, redirects & the Cloudflare Pages deploy

- **Deploy is Cloudflare Pages Git integration** — CF watches the repo, builds it itself, ships a
  preview deploy per branch and production on `master`. CF build settings: root `website`, build
  `pnpm build`, output `dist`. **GitHub Actions runs CI gates only, never the deploy** (no wrangler,
  no CF secrets). Keep that split.
- ⚠️ **CF Pages build settings are shared between production and preview** — one build command /
  output dir for both. Never point them at a build the current `master` can't produce: validate any
  framework-level build change on a branch preview deploy, and flip the shared settings only in
  lockstep with the merge. (This is what made the SPA→Astro cutover load-bearing.)
- **Asset caching.** Astro content-hashes all CSS/JS under `/_astro/`, so `_headers` caches it
  `public, max-age=31536000, immutable`. **Do not add generic `/*.css` or `/*.js` rules** — they
  also match the hashed files, and Cloudflare *combines* matching `_headers` rules, producing a
  doubled, conflicting `Cache-Control`. `/*.html` stays `max-age=0, must-revalidate`. (CF's
  dashboard "Browser Cache TTL" must be set to "Respect Existing Headers" or it overrides these.)
- **Clean legal URLs + 301s.** Astro can't emit a literal `/privacy.html` file, so the legal /
  subscribed pages ship as clean URLs (`/privacy/`, `/terms/`, `/subscribed/`) with **301s from the
  old `.html` URLs in `public/_redirects`** — don't drop them; they preserve indexed URLs.
- **Sitemap filter.** `/account/` (login-gated `client:only`) and `/subscribed/` are excluded from
  the sitemap in `astro.config.mjs` — they render nothing server-side, so submitting them invites a
  soft-404 / "crawled, not indexed".
