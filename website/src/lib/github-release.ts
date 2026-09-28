const API_BASE = 'https://api.github.com/repos';

export interface ReleaseAsset {
  name: string;
  url: string;
}

export interface LatestRelease {
  /** Full display string, e.g. `v0.3.0 Early access · 29 May 2026`. */
  versionText: string;
  /** Raw tag, e.g. `v0.3.0` — `null` when unresolved (fetch failed). */
  tag: string | null;
  /** Display version: the tag without a trailing `.0` (`v0.10.0` → `v0.10`, `v0.6.1` stays). */
  version: string;
  /** Localised publish date, e.g. `29 May 2026` — empty string when unresolved. */
  dateText: string;
  /** Resolved release assets (real download URLs). Empty on any failure. */
  assets: ReleaseAsset[];
}

interface Options {
  /** Shown verbatim as `versionText` if the fetch fails (e.g. `v0.3.0 Early access`). */
  fallbackVersion: string;
  /** Word placed after the tag in `versionText`. Default `Early access`. */
  channel?: string;
}

interface GitHubRelease {
  tag_name: string;
  published_at: string | null;
  assets: { name: string; browser_download_url: string }[];
}

/**
 * Build-time fetch of a repo's latest GitHub Release. One request to
 * `/releases?per_page=1` gives the newest published release (pre-releases included —
 * `/releases/latest` would skip the betas these apps ship) with its tag, publish date,
 * and asset download URLs, all baked into the static HTML and re-fetched on every deploy.
 * Used by `/notes/` and `/audio/` so the shown version and the download links can never
 * drift from each other (Notes' asset names embed the version, so the URLs MUST come from
 * here, not a hardcoded path). Swallows every error and returns the fallback — a GitHub
 * hiccup or the unauthenticated 60 req/hr/IP rate limit must never break the build.
 */
export async function getLatestRelease(
  repo: string,
  { fallbackVersion, channel = 'Early access' }: Options,
): Promise<LatestRelease> {
  const fallback: LatestRelease = {
    versionText: fallbackVersion,
    tag: null,
    version: shortVersion(fallbackVersion.split(' ')[0] ?? fallbackVersion),
    dateText: '',
    assets: [],
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(`${API_BASE}/${repo}/releases?per_page=1`, {
      headers: { 'User-Agent': 'boojy.org-build', Accept: 'application/vnd.github+json' },
      signal: controller.signal,
    });
    if (!res.ok) return fallback;

    const releases = (await res.json()) as GitHubRelease[];
    const release = releases[0];
    if (!release?.tag_name) return fallback;

    const dateText = release.published_at
      ? new Date(release.published_at).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : '';
    const assets: ReleaseAsset[] = (release.assets ?? []).map((asset) => ({
      name: asset.name,
      url: asset.browser_download_url,
    }));

    return {
      versionText: `${release.tag_name} ${channel}${dateText ? ` · ${dateText}` : ''}`,
      tag: release.tag_name,
      version: shortVersion(release.tag_name),
      dateText,
      assets,
    };
  } catch {
    return fallback;
  } finally {
    clearTimeout(timeout);
  }
}

/** URL of the first asset whose filename matches `pattern`, or `undefined`. */
export function findAssetUrl(assets: ReleaseAsset[], pattern: RegExp): string | undefined {
  return assets.find((asset) => pattern.test(asset.name))?.url;
}

/**
 * The version as the site shows it: drop a trailing `.0` patch, keep any other patch.
 * `v0.10.0` → `v0.10`, `v0.6.0` → `v0.6`, `v0.6.1` → `v0.6.1`. Adds a leading `v` if missing.
 */
export function shortVersion(tag: string): string {
  const v = tag.startsWith('v') ? tag : `v${tag}`;
  return v.replace(/^(v\d+\.\d+)\.0$/, '$1');
}
