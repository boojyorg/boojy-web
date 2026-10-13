---
paths:
  - "website/src/scripts/**"
  - "website/src/components/Sky.astro"
  - "website/src/components/BoojyWordmark.astro"
  - "website/src/components/AppLockup.astro"
  - "website/src/lib/wordmark.ts"
  - "website/src/styles/space.css"
---

# The sky, the logo and motion

Spec: the Sky Lab (https://claude.ai/artifact/17QQiaUjrCMM8iyGBNV6y8). Tyr signed off on it
2026-09-28; change the look there (or with him) before changing it here.

**Speed rules (each one was a real lag bug in the lab):**
- Never redraw a blurred or glowing shape every frame. The rings and the sun's wide glow are drawn
  once into a tall stored image covering the page's whole scroll, then slid into place.
- Cap the animation at 60fps; 120Hz screens otherwise double every frame's work.
- Don't read layout (`getBoundingClientRect`, `scrollHeight`) per frame. `sky.ts` measures the sun
  on load, on resize and once after the arrival animation.
- Scroll-in animations change `scrollHeight` by a few pixels while they play. Never key a cache on it.
- Check with a 4× CPU throttle: frames should stay ≤ 8–16ms, idle and while scrolling.

**Interaction rule:** things that glow react with light (the sun, the N, the A: click for a
flare); things that orbit can be dragged (the planets, the j's dot, the 404 moon). Homepage planets
drag with mouse/pen only, so touch keeps scrolling the page.
A picked-up homepage planet holds its place on the orbit and, let go, springs back to exactly where
it was picked up, then carries on (like the j's dot springing home). Tyr's pick over gliding to the
nearest point on its ring to the drop, which is still a tweak (`planetDrop`).
A dragged body always passes in front of everything: homepage planets move to the `sky-lift`
canvas; the j's dot / 404 moon raise their logo's ancestors (`logo.ts` `raise()`) until they settle.

**Scroll feel (Tyr's A/B pick, 2026-09-28):** stars scroll at 6–36% of page speed (not true-depth
slow) and the solar system fades to half past the hero, so the rings, which move with the page,
don't feel like glass sliding over a still sky. Planets grow up to 1.4× on big screens.

**Nav logo lap:** a click on any same-tab link to another page spins the nav planet once
(clockwise, 680ms); the next page resumes it mid-lap pre-paint (`Nav.astro`). No hover spin.

**Logo:** letters are Poppins Medium outlines in `content/glyphs.json`, never live text (a font
that fails to load turned the old logo into Times). The sun is the second "o"; the grey planet is
the j's dot.

**Arrival (2026-10-13):** `measureSun` measures where the sun will *rest*, taking off the
hero's `.rise` slide, so the system is drawn in its final place from the first frame (sized off
the moving logo, it used to jump when re-measured). It fades in alongside the logo (700ms):
Tyr's pick over appearing outright or fading in after the logo lands (he didn't like the wait).
The sun's wide glow is 1.0, down from the lab's 1.8. Planets sit on their ring line (no gap cut). Rings are 26% opacity, 1.5px
(Tyr found the lab's 36% / 1.8px too strong).

**Tweaks panel (dev only):** `scripts/tune.ts` holds the system's adjustable values (arrival, ring
strength, sun glow/halo/disc, orbit speed); its defaults are what ships. In `pnpm dev` the homepage
shows a panel (`scripts/tweaks.ts`, dynamically imported behind `import.meta.env.DEV`, so it never
reaches `dist/`) that changes them live, saves to localStorage, and copies changed values as JSON.
To adopt a value, change its default in `tune.ts`.
The homepage cards' A and N don't glow on hover: on the site a glowing A/N means "click for a
flare", and a card click opens the app's page instead.

**Reduced motion:** no orbits, twinkle, shooting stars, springs or arrival animations.
