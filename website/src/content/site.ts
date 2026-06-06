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

export type ProductId = 'audio' | 'notes' | 'cloud' | 'design';

/**
 * Suite-wide release-stage ladder. Each app sits on one rung; the label is the
 * single source of truth for the stage badge shown on its card/band. As an app
 * matures, bump its `stage` here and every surface updates.
 */
export type Stage = 'early-access' | 'beta' | 'full-release';
export const STAGE_LABELS: Record<Stage, string> = {
  'early-access': 'Early access',
  beta: 'Beta',
  'full-release': 'Full release',
};

/**
 * Homepage product grid — one unified 2×2 of all four products. Audio/Notes/Cloud
 * are live (a `stage` badge + a "Learn more" link); Design is off-ladder
 * (`comingSoon`: muted card, "Coming soon" badge, no link). Products without a
 * screenshot (Design) use a gradient + glyph placeholder; the `name` is the
 * logo-image fallback for any product without a text logo.
 */
export interface ProductCardData {
  id: ProductId;
  /** Card destination. Omitted for products with no page yet (Design) → non-link card. */
  href?: string;
  /** Card image: an app screenshot/preview, or the gradient + glyph placeholder. */
  visual: { kind: 'image'; src: string; alt: string } | { kind: 'placeholder' };
  /** Text-logo image; omit to render the plain product `name` instead. */
  logo?: { src: string; alt: string };
  /** Product name — logo-image fallback + a11y label. */
  name: string;
  description: string;
  /** Ladder badge (Audio/Notes/Cloud). Omit + set `comingSoon` for off-ladder items. */
  stage?: Stage;
  /** Off-ladder, not yet shipped (Design): muted card, "Coming soon" badge, no CTA. */
  comingSoon?: boolean;
}

export const PRODUCT_CARDS: ProductCardData[] = [
  {
    id: 'audio',
    href: '/audio/',
    visual: {
      kind: 'image',
      src: '/images/audio-screenshot-v0.5.2.png',
      alt: 'Boojy Audio interface',
    },
    logo: { src: '/images/audio-text-logo.png', alt: 'Boojy Audio' },
    name: 'Boojy Audio',
    description: 'A free, simple music studio. For macOS and Windows.',
    stage: 'early-access',
  },
  {
    id: 'notes',
    href: '/notes/',
    visual: {
      kind: 'image',
      src: '/images/notes-screenshot-v0.1.png',
      alt: 'Boojy Notes interface',
    },
    logo: { src: '/images/Notes-text-logo.png', alt: 'Boojy Notes' },
    name: 'Boojy Notes',
    description: 'A calm space for your thoughts. Write in markdown. Own your files.',
    stage: 'early-access',
  },
  {
    id: 'cloud',
    href: '/cloud/',
    visual: { kind: 'image', src: '/images/cloud-preview.jpg', alt: 'Boojy Cloud' },
    logo: { src: '/images/cloud-text-logo.png', alt: 'Boojy Cloud' },
    name: 'Boojy Cloud',
    description:
      'Optional cloud storage that syncs Boojy Notes across your devices. Coming to more Boojy apps soon.',
    stage: 'early-access',
  },
  {
    id: 'design',
    visual: { kind: 'placeholder' },
    logo: { src: '/images/design-text-logo.png', alt: 'Boojy Design' },
    name: 'Boojy Design',
    description: 'An image editor in the browser. Draw, edit, and design.',
    comingSoon: true,
  },
];

export const CLOUD_DESCRIPTION =
  'Every Boojy app works offline, no account needed. Cloud already syncs Boojy Notes across your devices — free, up to 500 MB. Paid storage and Boojy Audio support are next.';

/**
 * "Why Boojy" — the homepage's about block. The personal story (left column)
 * + the brand promises as a scannable checklist (right column). The promises
 * are the differentiators that used to be buried in the prose.
 */
export const WHY_STORY =
  "Hi, I'm Tyr, a computer science student. I started making music as a teenager, but a lot of the tools I wanted sat behind paywalls. So I'm building the calm, free creative suite I wish I'd had.";

export interface WhyPoint {
  label: string;
  detail: string;
}

export const WHY_POINTS: WhyPoint[] = [
  { label: 'Always free', detail: 'Every app and feature, free to download and use.' },
  { label: "Open source, once it's ready", detail: "Each app's code opens up as it matures." },
  { label: 'Yours to keep', detail: 'Local-first and offline. Your files stay yours.' },
];
