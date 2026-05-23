# Boojy Website

Source code for [boojy.org](https://boojy.org).

## Migration status

The site is a **full React SPA** built with Vite. Static assets (CSS, images, `_headers`, `_redirects`, etc.) live in `public/` and are copied into `dist/` on build.

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

Cloud messaging was updated site-wide: storage is **rolling out soon** (preview pricing on `/cloud/`, no live checkout).

## Local Development

```bash
cd website
npm install
npm run dev
```

Then visit `http://localhost:5173/`

All routes are React — use `npm run dev` or `npm run preview`, not `python3 -m http.server`.

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
│   ├── App.tsx         # React Router (all routes)
│   ├── pages/
│   ├── components/
│   ├── content/        # site copy, cloud FAQ, legal HTML bodies
│   ├── hooks/
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
| Root directory | `website` |
| Build command | `npm run build` |
| Output directory | `dist` |

Pushes to `master` auto-deploy.

**Important:** Cloudflare project must use the Vite build settings above. A plain static deploy (no build step) will not serve the React app correctly.

## Tech Stack

- React 19 + TypeScript + Vite + React Router (all routes)
- Supabase JS `@2.43.4` via npm on `/account/` (no CDN script tag)

## Links

- **Live site:** [boojy.org](https://boojy.org)
- **App repo:** [tyrbujac/boojy-audio](https://github.com/tyrbujac/boojy-audio)
