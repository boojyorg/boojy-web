# Boojy.org

Source for **[boojy.org](https://boojy.org)** — the marketing website for the Boojy suite of free,
open-source creative tools: Audio, Notes, Design, and Cloud (free sync for Notes, live now).

> **Looking for a product?** Boojy *Audio* (the DAW) lives at
> [boojyorg/boojy-audio](https://github.com/boojyorg/boojy-audio), *Notes* at
> [boojyorg/boojy-notes](https://github.com/boojyorg/boojy-notes), and *Design* (the browser image
> editor) at [boojyorg/boojy-design](https://github.com/boojyorg/boojy-design). **This repo is just
> the website.**

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

## Contributing

The Boojy suite is in **Early Access** and isn't accepting pull requests yet — contributions
will open as the apps reach their v1.0 releases. **Bug reports and feedback are very welcome** —
see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

GPLv3 — see [LICENSE](LICENSE). Copyright (c) 2025–2026 Tyr Bujac.

**Built by [Tyr Bujac](https://github.com/tyrbujac)**
