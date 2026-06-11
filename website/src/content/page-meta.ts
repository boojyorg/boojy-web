const SITE = 'https://boojy.org';
export const DEFAULT_OG_IMAGE = `${SITE}/images/Boojy_Image_Logo.png`;

export interface PageMeta {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  path: string;
  ogImage?: string;
  /** Emit `<meta name="robots" content="noindex">` — for thin/behind-login pages. */
  noindex?: boolean;
}

const meta = (
  title: string,
  description: string,
  path: string,
  ogImage = DEFAULT_OG_IMAGE,
  ogTitle = title,
  ogDescription = description,
): PageMeta => ({
  title,
  description,
  ogTitle,
  ogDescription,
  path,
  ogImage,
});

/** Canonical meta per route — ported from former static HTML `<head>` tags. */
export const PAGE_META: Record<string, PageMeta> = {
  '/': meta(
    'Boojy – Creative Tools',
    'Boojy - Free, open-source creative tools: a simple music studio, a calm notes app, a browser image editor, and free cloud sync for Notes.',
    '/',
    DEFAULT_OG_IMAGE,
    'Boojy - Free Creative Tools',
    'Free, open-source creative software. Music production, notes, design, and free cloud sync.',
  ),
  '/audio/': meta(
    'Boojy Audio – Free DAW for Beginners',
    'Boojy Audio - A free, simple music studio for macOS and Windows. Perfect for making your first beat.',
    '/audio/',
    `${SITE}/images/audio-preview.jpg`,
    'Boojy Audio - Free DAW for Beginners',
    'A free, simple music studio for macOS and Windows. Perfect for making your first beat.',
  ),
  '/notes/': meta(
    'Boojy Notes – A Calm Space for Your Thoughts',
    'Boojy Notes - A calm space for your thoughts. Write in markdown, organize with folders. Free and runs in your browser.',
    '/notes/',
    `${SITE}/images/notes-screenshot-v0.1.png`,
    'Boojy Notes - A Calm Space for Your Thoughts',
    'Write in markdown, organize with folders. Free and runs in your browser.',
  ),
  '/cloud/': meta(
    'Boojy Cloud – Sync Your Creative Work',
    'Boojy Cloud - Free sync for Boojy Notes across your devices. 500 MB free, no card needed. Audio sync coming soon.',
    '/cloud/',
    `${SITE}/images/cloud-preview.jpg`,
    'Boojy Cloud - Sync Your Creative Work',
    'Free sync for Boojy Notes across your devices. 500 MB free, no card needed.',
  ),
  '/design/': meta(
    'Boojy Design – Image Editor in Your Browser',
    'Boojy Design - A free image editor that runs in your browser. Paint, shapes, layers, live text, and export. No install, no account.',
    '/design/',
    `${SITE}/images/design-screenshot-v0.4.png`,
    'Boojy Design - Image Editor in Your Browser',
    'Paint, shapes, layers, live text, and export — free, right in your browser.',
  ),
  '/news/': meta(
    'News – Boojy',
    'Notes from Tyr on what is new and improved across Boojy — Audio, Notes, Design, and Cloud.',
    '/news/',
    DEFAULT_OG_IMAGE,
    'Boojy News',
    'Notes from Tyr on what is new and improved across Boojy.',
  ),
  '/account/': {
    ...meta(
      'Boojy – Account',
      'Boojy Account - Sign in to sync your notes across your devices with Boojy Cloud.',
      '/account/',
      DEFAULT_OG_IMAGE,
      'Boojy Account',
      'Sign in to sync your notes across your devices with Boojy Cloud.',
    ),
    noindex: true,
  },
  '/privacy/': meta(
    'Privacy Policy – Boojy',
    'Boojy Privacy Policy - How we handle your data',
    '/privacy/',
    DEFAULT_OG_IMAGE,
    'Privacy Policy – Boojy',
    'How we handle your data. No tracking, no selling, no surprises.',
  ),
  '/terms/': meta(
    'Terms of Service – Boojy',
    'Boojy Terms of Service - Simple terms in plain English',
    '/terms/',
    DEFAULT_OG_IMAGE,
    'Terms of Service – Boojy',
    'Simple terms in plain English. Your content is yours. 100%.',
  ),
  '/subscribed/': {
    ...meta(
      'Subscribed – Boojy',
      "You're subscribed to Boojy updates",
      '/subscribed/',
      DEFAULT_OG_IMAGE,
      'Subscribed – Boojy',
      "You're subscribed to Boojy updates.",
    ),
    noindex: true,
  },
  '/404.html': meta(
    '404 - Page Not Found | Boojy',
    'Page not found - Boojy',
    '/404.html',
    DEFAULT_OG_IMAGE,
    '404 - Page Not Found | Boojy',
    "The page you're looking for doesn't exist or has been moved.",
  ),
};

const NOT_FOUND_META: PageMeta =
  PAGE_META['/404.html'] ?? meta('Page Not Found | Boojy', 'Page not found - Boojy', '/404.html');

export function getPageMeta(pathname: string): PageMeta {
  return PAGE_META[pathname] ?? NOT_FOUND_META;
}

export function pageMetaUrl(meta: PageMeta): string {
  return `${SITE}${meta.path}`;
}
