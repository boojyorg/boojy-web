const FALLBACK = 'v0.1.3 Beta · 12 March 2026';
const TAGS_URL = 'https://api.github.com/repos/boojyorg/boojy-notes/tags?per_page=1';

interface GitHubTag {
  name: string;
  commit: { url: string };
}

interface GitHubCommit {
  commit: { committer: { date: string } };
}

/**
 * Build-time fetch of the latest Boojy Notes release version. Called from the
 * notes/index.astro frontmatter so the version is baked into the static HTML (re-fetched
 * on every deploy). Swallows all errors and returns the fallback — a GitHub hiccup or
 * the unauthenticated 60 req/hr/IP rate limit must never break the build.
 */
export async function getNotesVersion(): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const headers = { 'User-Agent': 'boojy.org-build' };
    const res = await fetch(TAGS_URL, { headers, signal: controller.signal });
    if (!res.ok) return FALLBACK;

    const tags = (await res.json()) as GitHubTag[];
    const tag = tags[0];
    if (!tag) return FALLBACK;

    // We have a real tag now — never drop below `${tag.name} Beta`. A separate try keeps a
    // slow/aborted commit fetch (the shared 5s timeout can fire mid-second-request) from
    // throwing to the outer catch and discarding the tag name we already fetched.
    try {
      const commitRes = await fetch(tag.commit.url, { headers, signal: controller.signal });
      if (!commitRes.ok) return `${tag.name} Beta`;

      const commit = (await commitRes.json()) as GitHubCommit;
      const formatted = new Date(commit.commit.committer.date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      return `${tag.name} Beta · ${formatted}`;
    } catch {
      return `${tag.name} Beta`;
    }
  } catch {
    return FALLBACK;
  } finally {
    clearTimeout(timeout);
  }
}
