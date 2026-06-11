---
paths:
  - "website/src/layouts/**"
  - "website/src/styles/**"
---

# View transitions & the cross-page glow morph

- **Native View Transitions, not Astro's `<ClientRouter />`.** The site uses browser-native
  `@view-transition { navigation: auto }` (in `shared.css`, with `view-transition-name` on the
  navbar / starfield / hero glow). It works on a static MPA for free. Adding `<ClientRouter />`
  would re-introduce SPA navigation and risk a glow color-flash. Keep the CSS; ship no router.
  *Native cross-document VTs are Chromium-mostly — Safari/Firefox just do a plain navigation
  (graceful, not a bug). Check the glow morph in Chromium.*
- **The glow morph is a pre-paint `is:inline` script, not a React island.** Hydrating it flashes the
  destination color before React mounts. The `is:inline` script in `<head>` must set the origin
  color via a **root-level CSS variable on `documentElement`** (read synchronously from
  `sessionStorage`) **before** paint — do **not** query the glow element (it isn't parsed yet).
  Logic is lifted verbatim from the old `useHeroGlowTransition.ts`; only delivery changed.
- The glow gradient is **duplicated** in the JS morph string and the glow CSS — a stop change must
  touch both, or the morph's last frame won't match the resting state.
- **Analytics ships no tag at all.** Cloudflare Web Analytics runs via "Automatic setup" — the
  beacon is injected at the CF edge (only while boojy.org stays orange-cloud proxied), and native
  MPA navigation means pageviews count without route tracking. If a tag is ever added to the code
  instead, it must be `is:inline` so Astro leaves it untouched. (The self-hosted umami tag was
  removed 2026-06 — its Railway app had died and 404'd silently on every view.)
