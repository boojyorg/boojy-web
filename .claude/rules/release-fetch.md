---
paths:
  - "website/src/lib/github-release.ts"
  - "website/src/pages/notes/**"
  - "website/src/pages/audio/**"
  - "website/src/components/NotesDownload.tsx"
  - "website/src/components/AudioDownload.tsx"
---

# Release version + download URLs (build-time fetch)

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
- The download components fall back to the **releases page** when an asset URL is unresolved, so no
  affordance is ever a dead link.
- Repo owner is **`boojyorg`** for both apps (`boojyorg/boojy-audio`, `boojyorg/boojy-notes`). The old
  `tyrbujac/boojy-audio` only survives as a 301 — never reintroduce it.
- No GitHub token needed: the unauthenticated API is 60 req/hr per IP on shared CF build IPs, and the
  fallback string covers the occasional rate-limit. (Future: a CF Deploy Hook from each app's release
  workflow auto-rebuilds the site so a new tag goes live without a manual deploy — see `dreams.md`.)
