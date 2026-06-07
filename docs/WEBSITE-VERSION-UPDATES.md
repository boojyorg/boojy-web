# Website Version Updates

How version and download info flows from the app repos to boojy.org.

> This is an **Astro static site**. Versions are fetched at **build time** (not on page load) and
> baked into the static HTML — see `.claude/rules/release-fetch.md`. The old `website/js/*.js`
> page-load flow no longer exists.

---

## Both apps are automatic

`website/src/lib/github-release.ts` exports `getLatestRelease(repo, opts)`. Each product page calls it
in its `.astro` frontmatter at build time:

- **Notes** — `src/pages/notes/index.astro` fetches `boojyorg/boojy-notes`. Notes' asset filenames
  embed the version (`Boojy-Notes-0.3.0-arm64.dmg`), so the **download URLs are resolved from the
  release assets** and passed into `<NotesDownload>` (a hardcoded path would 404 on the next release).
- **Audio** — `src/pages/audio/index.astro` fetches `boojyorg/boojy-audio` for the **version string
  only**; Audio ships stable, version-less asset names (`Boojy-Audio-mac.dmg`), so `<AudioDownload>`
  keeps its `/releases/latest/download/` URLs.

The fetch never breaks the build (AbortController + try/catch → `fallbackVersion`), and the download
components fall back to the releases page if an asset URL is unresolved, so no link is ever dead.

The version string is the **tag only** (`v0.5.4 · 6 June 2026`) — no "Beta"/stage word. The release
stage shown to users ("Early access" etc.) is the card/band badge, driven solely by `Stage` in
`content/site.ts`; keeping a stage word out of the version string is what stops the two drifting.

**Screenshots are refreshed per minor milestone only** (v0.6, v0.7 …), never for patch releases —
a screenshot lagging the version string by a few patches is expected and fine. At each milestone,
capture a new one and update the `src` references (`site.ts` + the product page).

### Release checklist (boojy-notes / boojy-audio)

1. Bump the version, update `CHANGELOG.md`, commit.
2. Tag (`git tag v0.x.x`) and push the tag; **publish** the GitHub Release with the built assets.
3. Publishing triggers the site rebuild automatically (see below) — verify boojy.org shows the new
   version a few minutes later.
4. Keep the `fallbackVersion` in the page frontmatter roughly current so a rate-limited build doesn't
   look stale.

---

## Auto-rebuild on release (Phase 2 — wired)

Because versions are baked at build time, a new app release only appears after the website rebuilds.
Each app repo has a `.github/workflows/site-rebuild.yml` that POSTs the site's **Cloudflare Pages
Deploy Hook** on `release: published` (not tag push — the tag only builds the *draft*), so publishing
a release rebuilds boojy.org automatically.

It needs the **`CF_PAGES_DEPLOY_HOOK_URL`** secret in each app repo (CF dashboard → Pages project →
Settings → Builds & deployments → Deploy hooks); the workflow no-ops with a log line until the
secret is set.

---

## How deployment works

Cloudflare Pages builds the site (`pnpm build` in `website/`) and deploys: production on `master`,
previews per branch. GitHub Actions only runs the gates (lint/check/build) — it never deploys. See
`.claude/rules/caching-and-deploy.md`.
