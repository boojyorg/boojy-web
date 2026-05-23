# Boojy Website

Source code for [boojy.org](https://boojy.org).

## Migration status

The site uses a **hybrid deploy**: React routes are built by Vite; remaining pages are static HTML copied from `public/` into `dist/` on build.

| Route | Status | Notes |
|-------|--------|-------|
| `/` | React | Hub — product cards, Cloud teaser |
| `/audio/` | React | Download detection, platforms panel |
| `/notes/` | React | Web CTA, downloads, live version from GitHub |
| `/cloud/` | React | Preview pricing; checkout disabled until launch |
| `/account/` | React | Supabase auth; billing UI gated by `CLOUD_LAUNCHED` |
| `/privacy.html`, `/terms.html`, etc. | Static | Legal + misc pages |

**Still to migrate:** legal pages (`privacy`, `terms`, `404`, `subscribed`). **Deferred:** removing `sync-partials.py` / `bump-cache.py` (still used for legal pages).

Cloud messaging was updated site-wide: storage is **rolling out soon** (preview pricing on `/cloud/`, no live checkout).

## Local Development

```bash
cd website
npm install
npm run dev
```

Then visit `http://localhost:5173/`

- React routes: `/`, `/audio/`, `/notes/`, `/cloud/`, `/account/`
- Static pages: `/privacy.html`, `/terms.html`, etc.

Do **not** use `python3 -m http.server` for React work — use `npm run dev` or `npm run preview`.

## Build

```bash
cd website
npm run build
npm run preview   # optional — preview production build locally
```

Output goes to `website/dist/` — this is what Cloudflare Pages deploys.

## Project Structure

```
website/
├── index.html          # Vite entry
├── src/
│   ├── App.tsx         # React Router (hub, audio, notes, cloud, account)
│   ├── pages/
│   ├── components/
│   ├── hooks/
│   └── lib/            # platform detection, supabase client
├── public/
│   ├── css/
│   ├── js/             # dev-tools.js; shared.js for static legal pages
│   ├── images/
│   ├── _headers
│   ├── _redirects      # SPA fallbacks for /audio/*, /notes/*, /cloud/*, /account/*
│   ├── robots.txt
│   └── sitemap.xml
├── partials/           # Nav/footer source for static pages only
├── sync-partials.py    # Sync partials into public/ HTML (not React routes)
├── bump-cache.py       # Cache-bust ?v= on static pages
├── vite.config.ts
└── package.json
```

## Deployment

Hosted on Cloudflare Pages:

| Setting | Value |
|---------|-------|
| Root directory | `website` |
| Build command | `npm run build` |
| Output directory | `dist` |

Pushes to `master` auto-deploy.

**Important:** Cloudflare project must use the Vite build settings above. A plain static deploy (no build step) will not serve the React app correctly.

## Tech Stack

- React 19 + TypeScript + Vite + React Router (product + cloud + account routes)
- Static HTML for legal pages only
- Supabase JS `@2.43.4` via npm on `/account/` (no CDN script tag)

## Links

- **Live site:** [boojy.org](https://boojy.org)
- **App repo:** [tyrbujac/boojy-audio](https://github.com/tyrbujac/boojy-audio)
