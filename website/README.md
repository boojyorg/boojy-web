# Boojy Website

Source code for [boojy.org](https://boojy.org) — live as a React SPA on Cloudflare Pages.

## Routes

| Route | Notes |
|-------|-------|
| `/` | Hub — product cards, Cloud teaser |
| `/audio/` | Download detection, platforms panel |
| `/notes/` | Web CTA, downloads, live version from GitHub |
| `/cloud/` | Preview pricing; checkout disabled until launch |
| `/account/` | Supabase auth; billing UI gated by `CLOUD_LAUNCHED` |
| `/privacy.html`, `/terms.html` | Legal content via `LegalLayout` |
| `/subscribed.html` | Post-newsletter signup confirmation |
| `*` (404) | React `NotFoundPage` |

Cloud storage is **rolling out soon** — preview pricing on `/cloud/`, no live checkout.

## What's next

1. **Cloud launch** — set `CLOUD_LAUNCHED = true` in `src/lib/supabase.ts`, re-enable checkout on `/cloud/`, verify Stripe + billing UI on `/account/`
2. **Optional cleanup** — remove empty `public/audio/`, `notes/`, `cloud/`, `account/` dirs; drop `logo-test/` or legacy `shared.js` / `starfield.js`
3. **Share cards** — if link previews matter, SPA client-side OG tags won't help crawlers; consider prerender or edge HTML later
4. **Legal edits** — move privacy/terms from raw HTML blobs in `src/content/legal/` to Markdown/TSX when you next update copy

## Local Development

```bash
cd website
npm install
npm run dev
```

Then visit `http://localhost:5173/`

Use `npm run dev` or `npm run preview` — not a plain static file server.

## Build

From `website/` (day-to-day):

```bash
cd website
npm run build
npm run preview   # optional — preview production build locally
```

From repo root (matches Cloudflare):

```bash
npm run build
```

Output goes to `website/dist/` — this is what Cloudflare Pages deploys.

## Project Structure

```
website/
├── index.html          # Vite entry
├── src/
│   ├── App.tsx         # React Router (all routes)
│   ├── pages/
│   ├── components/
│   ├── content/        # site copy, cloud FAQ, page-meta.ts, legal HTML bodies
│   ├── hooks/          # usePageMeta, useAccount, …
│   └── lib/            # platform detection, supabase client
├── public/
│   ├── css/
│   ├── js/             # dev-tools.js (logo-test)
│   ├── images/
│   ├── _headers
│   ├── _redirects      # SPA fallback /* → index.html
│   ├── robots.txt
│   └── sitemap.xml
├── vite.config.ts
└── package.json
```

## Deployment

Hosted on Cloudflare Pages:

| Setting | Value |
|---------|-------|
| Root directory | *(leave empty — repo root)* |
| Build command | `npm run build` |
| Output directory | `website/dist` |

The repo root [`package.json`](../package.json) runs the Vite build inside `website/`.

**Alternative:** Root directory `website`, build `npm run build`, output `dist`.

Pushes to `master` auto-deploy.

### Deploy verification

- Build log shows `vite build` completing
- `curl -s https://boojy.org/ | grep assets/index` → `/assets/index-*.js`, not `main.tsx`
- Browser smoke: hub starfield, `/audio/` downloads, `/account/` sign-in, fake URL → 404

### Troubleshooting

**Build failed with `ENOENT ... repo/package.json`?** Cloudflare ran the build at repo root without finding `package.json` — use the settings above (empty root directory + `website/dist` output).

**Live site shows `/src/main.tsx`?** The Vite build did not run — check the deploy log for `vite build`.

## Tech Stack

- React 19 + TypeScript + Vite + React Router (all routes)
- Supabase JS `@2.43.4` via npm on `/account/` (no CDN script tag)

## Links

- **Live site:** [boojy.org](https://boojy.org)
- **App repo:** [tyrbujac/boojy-audio](https://github.com/tyrbujac/boojy-audio)
- **Project context:** [CLAUDE.md](../CLAUDE.md)
