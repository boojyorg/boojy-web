---
paths:
  - "website/src/lib/notes-version.ts"
  - "website/src/pages/notes/**"
---

# Notes version (build-time fetch)

- The Notes version string is **baked at build time**: `lib/notes-version.ts` fetches the latest tag
  from the GitHub API in `notes/index.astro` frontmatter.
- It **must never break the build** — AbortController timeout + try/catch returning a fallback
  string. Guard `tags[0]` (strict TS / `noUncheckedIndexedAccess`).
- No GitHub token needed: the unauthenticated API is 60 req/hr per IP on shared CF build IPs, and the
  fallback string covers the occasional rate-limit.
