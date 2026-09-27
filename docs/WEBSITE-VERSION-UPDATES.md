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

### Release checklist (boojy-notes / boojy-audio)

1. Bump the version, update `CHANGELOG.md`, commit.
2. Tag (`git tag v0.x.x`) and push the tag; publish the GitHub Release with the built assets.
3. **The website rebuilds itself** when the release is published (see below). If boojy.org still
   shows the old version a few minutes later, check that app's "Rebuild boojy.org" workflow run,
   or use "Retry deployment" in Cloudflare Pages.
4. Keep the `fallbackVersion` in the page frontmatter roughly current so a rate-limited build doesn't
   look stale.

---

## Auto-rebuild on release

Because versions are baked at build time, a new app release only appears after the website rebuilds.
Each app repo has `.github/workflows/site-rebuild.yml`, which POSTs the Cloudflare Pages Deploy Hook
(secret `CF_PAGES_DEPLOY_HOOK_URL`) on `release: published`, so publishing a release rebuilds the
site with no manual redeploy. It fires on *published*, not on the tag push, because the tag only
builds a draft. Working since 2026-06; confirmed with Notes v0.10.0 on 2026-09-27.

---

## How deployment works

Cloudflare Pages builds the site (`pnpm build` in `website/`) and deploys: production on `master`,
previews per branch. GitHub Actions only runs the gates (lint/check/build) — it never deploys. See
`.claude/rules/caching-and-deploy.md`.
