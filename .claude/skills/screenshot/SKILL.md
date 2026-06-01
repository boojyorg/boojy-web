---
name: screenshot
description: Use when you need to SEE a rendered page during visual/design work — capture a PNG of the local site (homepage cosmic backdrop, layout, hover states, responsive breakpoints) and Read it back. Drives the installed Chrome headlessly via puppeteer-core.
disable-model-invocation: false
---

# Screenshot (visual iteration)

A self-contained helper for *seeing* design changes. It drives the locally-installed Google Chrome
through `puppeteer-core` — **no bundled Chromium download**, and it's isolated under `.claude/tools/`
so it never touches `website/`'s `package.json` or lockfile.

## Prerequisite: a running server

The script hits a URL, so the site must be served. The user normally runs `pnpm dev` (port 4321).
If that's not up, serve a fresh build on a side port so you don't fight the dev server:

```bash
cd website && pnpm build && pnpm preview --port 4399 &
# wait until it answers:
for i in $(seq 1 20); do curl -sf -o /dev/null http://localhost:4399/ && break; sleep 0.3; done
```

`pnpm preview` serves `dist/`, so **rebuild** (`pnpm build`) after each CSS/markup change before
re-shooting. (The dev server hot-reloads, but only the user runs that.)

## Capture

```bash
# from the repo root
node .claude/tools/screenshot/shot.mjs <url> [outPath] [flags]

# examples
node .claude/tools/screenshot/shot.mjs http://localhost:4399/ .claude/tools/screenshot/shots/home.png --full
node .claude/tools/screenshot/shot.mjs http://localhost:4399/ shots/hero.png            # viewport only
node .claude/tools/screenshot/shot.mjs http://localhost:4399/ shots/mid.png --scroll=1400
node .claude/tools/screenshot/shot.mjs http://localhost:4399/ shots/m.png --w=390 --h=844   # mobile
node .claude/tools/screenshot/shot.mjs http://localhost:4399/cloud/ shots/cloud.png --sel=".pricing-card"
```

Then **`Read` the PNG** to see it.

**Flags:** `--full` (full-page, not just viewport) · `--w=` / `--h=` (viewport, default 1440×900) ·
`--dpr=` (default 2) · `--scroll=<px>` (useful for `background-attachment: fixed` backdrops where the
look changes by scroll position) · `--sel="<css>"` (element-only shot) · `--dark` /
`--reduce-motion` (emulate media features) · `--wait=<ms>` (settle time for canvas/fonts, default 600).

Output PNGs live in `.claude/tools/screenshot/shots/` (gitignored). Set `CHROME_PATH` if Chrome
isn't at the standard macOS location.

## Notes
- The homepage starfield draws on `requestAnimationFrame`; the default 600ms wait lets it settle.
  Bump `--wait` if a capture looks mid-draw.
- For the cosmic backdrop (`hub.css`, `body` with `background-attachment: fixed`), a full-page shot
  flattens the fixed layers — use `--scroll=` viewport shots to judge what the user actually sees.
- This is dev tooling, not part of the site build. It is never imported by `website/`.
