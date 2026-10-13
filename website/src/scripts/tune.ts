/**
 * The homepage solar system's adjustable values. These defaults are what ships; in `pnpm dev`
 * the tweaks panel (scripts/tweaks.ts) can change them live and saves its changes in this
 * browser, so they're loaded here before the sky reads them.
 */

export type RingArrival = 'in-place' | 'with-logo' | 'after-logo';

export const DEFAULTS = {
  /** How the rings, belt and planets appear on load. */
  ringArrival: 'with-logo' as RingArrival,
  /** Fade length for the two fade arrivals (ms). */
  ringFadeMs: 700,
  /** The hero's slide-up on load (logo, headline, subtitle). */
  rise: true,
  riseMs: 700,
  riseDistance: 14,
  ringAlpha: 0.26,
  ringWidth: 1.5,
  /** The wide warm glow behind the logo, drawn by the sky. */
  glow: 1,
  /** The logo's own halo just around the sun disc (share of its normal strength). */
  halo: 1,
  /** The sun disc's brightness on the homepage. */
  sunBrightness: 1,
  /** Orbit and belt speed. */
  orbitSpeed: 1,
};

export type Tune = typeof DEFAULTS;

export const STORAGE_KEY = 'boojy-tweaks';

export const tune: Tune = { ...DEFAULTS };

if (import.meta.env.DEV) {
  try {
    Object.assign(tune, JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}'));
  } catch {
    // No saved tweaks (or storage is blocked): keep the defaults.
  }
}
