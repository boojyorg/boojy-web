# Boojy.org

Source for **[boojy.org](https://boojy.org)** — the marketing website for the Boojy suite of free,
open-source creative tools (Audio, Notes, and Cloud — rolling out soon).

> **Looking for a product?** Boojy *Audio* (the DAW) lives at
> [boojyorg/boojy-audio](https://github.com/boojyorg/boojy-audio), and *Notes* at
> [boojyorg/boojy-notes](https://github.com/boojyorg/boojy-notes). **This repo is just the website.**

## Stack

A **static site built with [Astro](https://astro.build)** — every page ships fully-formed HTML (for
SEO and social cards), with the interactive pieces layered back in as **React islands**. Plain CSS
(no Tailwind), strict TypeScript, **pnpm**, and lint/format via **Biome**. No SSR and no server —
it's pure SSG, deployed on **Cloudflare Pages**.

## Quick start

The app lives in `website/`:

```bash
cd website
pnpm install
pnpm dev            # http://localhost:4321
```

| Command | What it does |
|---|---|
| `pnpm dev` | Astro dev server |
| `pnpm build` | Static build → `website/dist/` |
| `pnpm preview` | Serve the production build locally |
| `pnpm run check` | `astro check` — type/diagnostic gate |
| `pnpm lint` | Biome lint + format check |

## Deploy

**Cloudflare Pages Git integration** — pushes to `master` deploy production; branches get preview
deploys. CI (`.github/workflows/ci.yml`) runs the gates on every PR. No wrangler, no Actions-driven
deploy. Build settings: root `website`, command `pnpm build`, output `dist`.

## More

- **[website/README.md](website/README.md)** — routes, project structure, deploy verification
- **[CLAUDE.md](CLAUDE.md)** — full architecture, conventions, and gotchas

## License

MIT

**Built by [Tyr Bujac](https://github.com/tyrbujac)**
