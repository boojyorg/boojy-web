const API_BASE = 'https://api.github.com/repos';

/** Per-attempt timeout. Two attempts max, so a dead API costs the build ~11s, not a hang. */
const ATTEMPT_TIMEOUT_MS = 5000;
const RETRY_DELAY_MS = 1000;

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
  /**
   * GitHub token for the request. Defaults to the `GITHUB_TOKEN` build env var (set in
   * Cloudflare Pages). Without one the API allows 60 requests/hr per IP, and Cloudflare's
   * build IPs are shared, so that allowance is often already spent.
   */
  token?: string;
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
 * here, not a hardcoded path). Authenticates with `GITHUB_TOKEN` when set and retries
 * once. Swallows every error and returns the fallback — a GitHub hiccup must never break
 * the build — but logs why, so a stale version shows up in the Cloudflare build log.
 */
export async function getLatestRelease(
  repo: string,
  { fallbackVersion, channel = 'Early access', token = buildEnv('GITHUB_TOKEN') }: Options,
): Promise<LatestRelease> {
  const fallback: LatestRelease = {
    versionText: fallbackVersion,
    tag: null,
    version: shortVersion(fallbackVersion.split(' ')[0] ?? fallbackVersion),
    dateText: '',
    assets: [],
  };

  const headers: Record<string, string> = {
    'User-Agent': 'boojy.org-build',
    Accept: 'application/vnd.github+json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  let reason = '';
  for (let attempt = 1; attempt <= 2; attempt++) {
    if (attempt > 1) await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), ATTEMPT_TIMEOUT_MS);
    try {
      const res = await fetch(`${API_BASE}/${repo}/releases?per_page=1`, {
        headers,
        signal: controller.signal,
      });
      if (!res.ok) {
        const remaining = res.headers?.get('x-ratelimit-remaining');
        const body = (await res.json().catch(() => null)) as { message?: string } | null;
        reason = `HTTP ${res.status}${remaining === '0' ? ' (rate limit spent)' : ''}${
          body?.message ? `: ${body.message}` : ''
        }`;
        // A rejected token (bad, expired, or refused by the org's token policy) must never
        // do worse than no token: log it and try again without one.
        if (
          (res.status === 401 || res.status === 403) &&
          remaining !== '0' &&
          headers.Authorization
        ) {
          console.warn(
            `[github-release] ${repo}: GITHUB_TOKEN rejected (${reason}); retrying without it`,
          );
          delete headers.Authorization;
        }
        continue;
      }

      const releases = (await res.json()) as GitHubRelease[];
      const release = releases[0];
      if (!release?.tag_name) {
        // A real answer, just not a usable one — retrying won't change it.
        reason = 'no published release in the response';
        break;
      }

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
    } catch (error) {
      reason = error instanceof Error ? error.message : String(error);
    } finally {
      clearTimeout(timeout);
    }
  }

  console.warn(
    `[github-release] ${repo}: using fallback "${fallbackVersion}" (${reason}; ${headers.Authorization ? 'with' : 'no'} GITHUB_TOKEN)`,
  );
  return fallback;
}

/** A build-time env var, read without depending on Node's types. */
function buildEnv(name: string): string | undefined {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env;
  return env?.[name] || undefined;
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
