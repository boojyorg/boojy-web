const SITE = 'https://boojy.org';
const DEFAULT_OG_IMAGE = `${SITE}/images/Boojy_Image_Logo.png`;

export interface PageMeta {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  path: string;
  ogImage?: string;
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
    'Boojy - Free, open-source creative tools. Audio, Notes, and Cloud storage rolling out soon.',
    '/',
    DEFAULT_OG_IMAGE,
    'Boojy - Free Creative Tools',
    'Free, open-source creative software. Music production, note-taking, and cloud storage rolling out soon.',
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
    'Boojy Cloud - Sync your creative work across all your devices. Rolling out soon — preview pricing and FAQ.',
    '/cloud/',
    `${SITE}/images/cloud-preview.jpg`,
    'Boojy Cloud - Sync Your Creative Work',
    'Sync your creative work across all your devices. Rolling out soon — preview pricing and FAQ.',
  ),
  '/account/': meta(
    'Boojy – Account',
    'Boojy Account - Sign in to sync your notes and manage your Boojy Cloud subscription.',
    '/account/',
    DEFAULT_OG_IMAGE,
    'Boojy Account',
    'Sign in to sync your notes and manage your Boojy Cloud subscription.',
  ),
  '/privacy.html': meta(
    'Privacy Policy – Boojy',
    'Boojy Privacy Policy - How we handle your data',
    '/privacy.html',
    DEFAULT_OG_IMAGE,
    'Privacy Policy – Boojy',
    'How we handle your data. No tracking, no selling, no surprises.',
  ),
  '/terms.html': meta(
    'Terms of Service – Boojy',
    'Boojy Terms of Service - Simple terms in plain English',
    '/terms.html',
    DEFAULT_OG_IMAGE,
    'Terms of Service – Boojy',
    'Simple terms in plain English. Your content is yours. 100%.',
  ),
  '/subscribed.html': meta(
    'Subscribed – Boojy',
    "You're subscribed to Boojy updates",
    '/subscribed.html',
    DEFAULT_OG_IMAGE,
    'Subscribed – Boojy',
    "You're subscribed to Boojy updates.",
  ),
  '/404.html': meta(
    '404 - Page Not Found | Boojy',
    'Page not found - Boojy',
    '/404.html',
    DEFAULT_OG_IMAGE,
    '404 - Page Not Found | Boojy',
    "The page you're looking for doesn't exist or has been moved.",
  ),
};

const NOT_FOUND_META = PAGE_META['/404.html'];

export function getPageMeta(pathname: string): PageMeta {
  return PAGE_META[pathname] ?? NOT_FOUND_META;
}

export function pageMetaUrl(meta: PageMeta): string {
  return `${SITE}${meta.path}`;
}
