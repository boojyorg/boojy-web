---
paths:
  - "website/src/lib/github-release.ts"
  - "website/src/pages/notes/**"
  - "website/src/pages/audio/**"
  - "website/src/components/NotesDownload.tsx"
  - "website/src/components/AudioDownload.tsx"
---

# Release version + download URLs (build-time fetch)

> Broader flow — how versions reach the site, the per-release checklist, and the planned
> auto-rebuild — lives in [`docs/WEBSITE-VERSION-UPDATES.md`](../../docs/WEBSITE-VERSION-UPDATES.md).

- `lib/github-release.ts` exports `getLatestRelease(repo, opts)`: **one** request to
  `/repos/<owner>/<repo>/releases?per_page=1` (newest published release, **pre-releases included** —
  `/releases/latest` skips the betas these apps ship), returning `versionText`, `tag`, `dateText`,
  and the resolved `assets[]` (real `browser_download_url`s). Called from the **`.astro` frontmatter**
  so everything is baked into the static HTML and re-fetched on each deploy.
- It **must never break the build** — AbortController (5s) + try/catch returning a `fallbackVersion`
  string and empty `assets`. Guard `releases[0]` (strict TS / `noUncheckedIndexedAccess`).
- **Notes asset names embed the version** (`Boojy-Notes-0.3.0-arm64.dmg`), so its download URLs **must**
  come from the fetched `assets[]` via `findAssetUrl(...)` — a hardcoded path or a
  `/releases/latest/download/<name>` URL would 404 on the next release (this is the bug that shipped a
  dead macOS link). **Audio asset names are stable/version-less** (`Boojy-Audio-mac.dmg`), so Audio
  keeps its `/releases/latest/download/` URLs and only consumes `versionText`.
- **Notes' Linux assets name x64 two ways** (electron-builder's choice): `…-x86_64.AppImage` but
  `…-amd64.deb`; ARM is `arm64` for both. Match each with its own regex.
- **Phones are not desktops.** iOS user agents say "like Mac OS X", Android's say "Linux", and
  iPadOS Safari claims to be a Mac. `detectPlatform()` returns `null` for them (`isMobileDevice()`),
  so no island ever offers a phone a desktop installer.
- The download components fall back to the **releases page** when an asset URL is unresolved, so no
  affordance is ever a dead link.
- Repo owner is **`boojyorg`** for both apps (`boojyorg/boojy-audio`, `boojyorg/boojy-notes`). The old
  `tyrbujac/boojy-audio` only survives as a 301 — never reintroduce it.
- **Authenticated with `GITHUB_TOKEN`** (a Cloudflare Pages build env var, read-only, public repos
  only) and **retried once**. Unauthenticated, the API allows 60 req/hr per IP, and Cloudflare's build
  IPs are shared, so that allowance is often spent before our build runs: this is why Notes v0.11.0
  went live showing the v0.10 fallback with no direct download links (2026-09-29). With the token the
  limit is 5,000/hr. A **401/403 that isn't a spent rate limit** means the token itself was refused
  (bad, expired, or blocked by the org's token policy): the fetch logs GitHub's message and retries
  **without** the token, so a broken token never does worse than none. Use a classic no-scope token
  (see the doc). Every fallback `console.warn`s the repo, the reason (HTTP status, rate limit,
  timeout) and whether a token was present, so the Cloudflare build log says why.
- Each app's `site-rebuild.yml` POSTs a CF Deploy Hook when a release is published, then checks
  boojy.org until the new version appears, and fails the run (GitHub emails Tyr) if it doesn't.
