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

The fetch authenticates with the **`GITHUB_TOKEN`** build env var and retries once. Without a token,
GitHub allows 60 requests an hour per IP, and Cloudflare's build machines share IPs, so a build can
find the allowance already spent and quietly bake in the fallback. That happened with Notes v0.11.0.
A fallback is logged in the build log with its reason.

### Setting up `GITHUB_TOKEN` (one-off)

1. Make a **classic** token: github.com/settings/tokens/new, **no scopes ticked**, 1-year expiry.
   A classic token with no scopes can only read public data. Don't use a fine-grained token:
   the first one (2026-09-29) was refused by GitHub with HTTP 403 for boojyorg's repos, because
   the org's rules for fine-grained tokens apply to it, and classic ones sidestep that.
2. Cloudflare dashboard → Workers & Pages → the boojy.org Pages project → Settings → Variables and
   Secrets → add `GITHUB_TOKEN` as a **Secret**, for **Production and Preview**.
3. Retry the latest production deployment (or merge anything) so the site rebuilds with it.
4. When the token expires or is refused, the build logs `GITHUB_TOKEN rejected (…)` with
   GitHub's reason and retries without it, so it is never worse than no token. It may then hit
   the shared rate limit and fall back, and the release check below fails. Renew it then.

### Release checklist (boojy-notes / boojy-audio)

1. Bump the version, update `CHANGELOG.md`, commit.
2. Tag (`git tag v0.x.x`) and push the tag; publish the GitHub Release with the built assets.
3. **The website rebuilds itself** when the release is published (see below). The "Rebuild
   boojy.org" workflow then waits for the new version to appear on the site and fails if it
   doesn't, so a stale site shows up as a failed run (and an email). To fix one: check the
   Cloudflare build log for a `[github-release]` warning, then "Retry deployment" in Cloudflare
   Pages.
4. Keep the `fallbackVersion` in the page frontmatter roughly current so a rate-limited build doesn't
   look stale.

---

## Auto-rebuild on release

Because versions are baked at build time, a new app release only appears after the website rebuilds.
Each app repo has `.github/workflows/site-rebuild.yml`, which POSTs the Cloudflare Pages Deploy Hook
(secret `CF_PAGES_DEPLOY_HOOK_URL`) on `release: published`, so publishing a release rebuilds the
site with no manual redeploy. It fires on *published*, not on the tag push, because the tag only
builds a draft. Working since 2026-06; confirmed with Notes v0.10.0 on 2026-09-27.

The hook only proves Cloudflare *started* a build, not that the build found the new release (Notes
v0.11.0 rebuilt fine and still showed v0.10). So after the POST, the Notes workflow polls
`https://boojy.org/notes/` for up to ~10 minutes, looking for the release's direct download link,
and fails the run if it never appears.

---

## How deployment works

Cloudflare Pages builds the site (`pnpm build` in `website/`) and deploys: production on `master`,
previews per branch. GitHub Actions only runs the gates (lint/check/build) — it never deploys. See
`.claude/rules/caching-and-deploy.md`.
