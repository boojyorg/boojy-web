export const GITHUB_ICON_PATH =
  'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z';

export const YOUTUBE_ICON_PATH =
  'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z';

export const LAPTOP_ICON_PATH =
  'M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16';

export const GLOBE_ICON_PATHS = [
  'M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20',
  'M2 12h20',
] as const;

export type ProductId = 'audio' | 'notes';

/** Single source of truth for the early-access label shown on Audio + Notes. */
export const EARLY_ACCESS = 'Early access';

export interface ProductCardData {
  id: ProductId;
  href: string;
  screenshot: string;
  screenshotAlt: string;
  logo: string;
  logoAlt: string;
  description: string;
  /** Stage badge, e.g. "Early access" — driven from one config value. */
  badge: string;
}

export const PRODUCT_CARDS: ProductCardData[] = [
  {
    id: 'audio',
    href: '/audio/',
    screenshot: '/images/screenshot-main-interface.png',
    screenshotAlt: 'Boojy Audio interface',
    logo: '/images/audio-text-logo.png',
    logoAlt: 'Boojy Audio',
    description: 'A free, simple music studio. For macOS and Windows.',
    badge: EARLY_ACCESS,
  },
  {
    id: 'notes',
    href: '/notes/',
    screenshot: '/images/notes-screenshot-v0.1.png',
    screenshotAlt: 'Boojy Notes interface',
    logo: '/images/Notes-text-logo.png',
    logoAlt: 'Boojy Notes',
    description: 'A calm space for your thoughts. Write in markdown. Own your files.',
    badge: EARLY_ACCESS,
  },
];

/** Homepage "Coming soon" cards — Design + Cloud, a muted tier below the live apps. */
export type ComingSoonId = 'design' | 'cloud';

export interface ComingSoonItem {
  id: ComingSoonId;
  name: string;
  description: string;
  /** Card visual: a screenshot, or the gradient placeholder for Cloud (nothing to shoot). */
  visual: { kind: 'image'; src: string; alt: string } | { kind: 'placeholder' };
  /** Optional CTA (Cloud → waitlist; Design has no page yet, so no link/button). */
  cta?: { href: string; label: string };
}

export const COMING_SOON: ComingSoonItem[] = [
  {
    id: 'design',
    name: 'Boojy Design',
    description: 'An image editor in the browser.',
    visual: {
      kind: 'image',
      src: '/images/boojy-design-screenshot.png',
      alt: 'Boojy Design interface',
    },
  },
  {
    id: 'cloud',
    name: 'Boojy Cloud',
    description: 'Sync your work across all your devices.',
    visual: { kind: 'placeholder' },
    cta: { href: '/cloud/', label: 'Join waitlist →' },
  },
];

export const CLOUD_DESCRIPTION =
  'Every Boojy app works offline, no account needed. Cloud storage is rolling out soon — sync across devices, free up to 500 MB when it launches.';
