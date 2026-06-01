import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * `news` — human-written monthly notes ("June 2026") on what's changed across Boojy.
 * One markdown file per month in `src/content/news/`; the filename is the slug
 * (→ `/news/june-2026/`). `summary` is the one-liner shown in the archive list and
 * the homepage "Latest" teaser; the body is the prose post.
 */
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
  }),
});

export const collections = { news };
