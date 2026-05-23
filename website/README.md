# Boojy Website

Source code for [boojy.org](https://boojy.org).

## Migration status

The site uses a **hybrid deploy**: React routes are built by Vite; remaining pages are static HTML copied from `public/` into `dist/` on build.

| Route | Status | Notes |
|-------|--------|-------|
| `/` | React | Hub — product cards, Cloud teaser |
| `/audio/` | React | Download detection, platforms panel |
| `/notes/` | React | Web CTA, downloads, live version from GitHub |
| `/cloud/` | Static | Preview pricing; checkout disabled until Cloud launches |
| `/account/` | Static | Auth works; billing/storage UI hidden until launch |
| `/privacy.html`, `/terms.html`, etc. | Static | Legal + misc pages |

**Still to migrate:** Cloud, Account, legal pages. **Deferred:** full SPA for static routes, removing `sync-partials.py` / `bump-cache.py`.

Cloud messaging was updated site-wide: storage is **rolling out soon** (preview pricing on `/cloud/`, no live checkout).

## Local Development

```bash
cd website
npm install
npm run dev
```

Then visit `http://localhost:5173/`

- React routes: `/`, `/audio/`, `/notes/`
- Static pages: `/cloud/`, `/account/`, `/privacy.html`, etc.

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
│   ├── App.tsx         # React Router (/ , /audio/ , /notes/)
│   ├── pages/          # HubPage, AudioPage, NotesPage
│   ├── components/     # Nav, Footer, Starfield, ProductCloudCard, …
│   ├── hooks/          # glow transition, platforms panel, notes version
│   └── lib/            # platform detection
├── public/             # Static assets + unmigrated HTML pages
│   ├── cloud/
│   ├── account/
│   ├── css/            # shared.css + page styles (imported by React + static pages)
│   ├── js/             # account.js, shared.js, dev-tools.js (static pages only)
│   ├── images/
│   ├── _headers
│   ├── _redirects      # includes SPA fallbacks for /audio/* and /notes/*
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

- React 19 + TypeScript + Vite + React Router (`/`, `/audio/`, `/notes/`)
- Static HTML/CSS/JS for unmigrated routes
- Cloudflare Pages hosting
- Umami analytics
- Supabase auth on `/account/` (static, CDN `@2.43.4`)
- Stripe checkout removed from `/cloud/` until Cloud launches

## Links

- **Live site:** [boojy.org](https://boojy.org)
- **App repo:** [tyrbujac/boojy-audio](https://github.com/tyrbujac/boojy-audio)
