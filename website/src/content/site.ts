export const GITHUB_ICON_PATH =
  'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z';

export const YOUTUBE_ICON_PATH =
  'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z';

export type ProductId = 'notes' | 'audio';

/**
 * Homepage app cards, in the canonical order (Audio, Notes — keep the nav and footer the
 * same). Each card is a link to the app's page: screenshot, name, one line, and a button.
 * (Boojy Cloud left the lineup 2026-08; Boojy Design was unlisted 2026-09 — its /design/
 * page is still live, just not promoted. See the suite VISION.md.)
 */
export interface ProductCardData {
  id: ProductId;
  href: string;
  name: string;
  /** The card's screenshot (dark theme). */
  screenshot: { src: string; alt: string };
  /** One line under the name. */
  line: string;
}

export const PRODUCT_CARDS: ProductCardData[] = [
  {
    id: 'audio',
    href: '/audio/',
    name: 'Boojy Audio',
    screenshot: {
      src: '/images/audio-v0.5.jpg',
      alt: 'Boojy Audio with a song open: tracks, clips and the piano roll',
    },
    line: 'A free, simple music studio',
  },
  {
    id: 'notes',
    href: '/notes/',
    name: 'Boojy Notes',
    screenshot: {
      src: '/images/notes-v0.10-dark.jpg',
      alt: 'Boojy Notes in dark mode with a trip-planning note open',
    },
    line: 'A calm place for the notes you own',
  },
];

/** The homepage "Hi, I'm Tyr." card: two paragraphs in Tyr's voice (it can grow later). */
export const ABOUT_PARAGRAPHS = [
  "I'm a computer science student, and I started making music as a teenager. A lot of the apps and tools I wanted sat behind paywalls, so eventually I started building my own. Boojy is the calm, free creative suite I wish I'd had back then.",
  "It's all early. Notes is nearly steady and Audio still has plenty of bugs, so for now I'm mostly fixing, then polishing, then adding features and platforms. Boojy is free and open source, and isn't accepting advertisements.",
];

/** Tyr's photo for the About card. Add one (square, ~400px+, face centred) and it appears. */
export const ABOUT_PHOTO: { src: string; alt: string } | null = null;
