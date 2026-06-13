import { afterEach, describe, expect, it, vi } from 'vitest';
import { findAssetUrl, getLatestRelease } from './github-release';

const REPO = 'boojyorg/boojy-audio';
const OPTS = { fallbackVersion: 'v0.5.4 Early access' };

/** What every failure path must collapse to — the build must never break. */
const FALLBACK = {
  versionText: 'v0.5.4 Early access',
  tag: null,
  dateText: '',
  assets: [],
};

function stubFetchJson(body: unknown, ok = true) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok, json: async () => body }));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getLatestRelease', () => {
  it('builds versionText, tag, date and assets from the newest release', async () => {
    stubFetchJson([
      {
        tag_name: 'v0.5.4',
        published_at: '2026-05-29T12:00:00Z',
        assets: [
          { name: 'Boojy-Audio-mac.dmg', browser_download_url: 'https://example.com/mac.dmg' },
          { name: 'Boojy-Audio-win.exe', browser_download_url: 'https://example.com/win.exe' },
        ],
      },
    ]);

    expect(await getLatestRelease(REPO, OPTS)).toEqual({
      versionText: 'v0.5.4 Early access · 29 May 2026',
      tag: 'v0.5.4',
      dateText: '29 May 2026',
      assets: [
        { name: 'Boojy-Audio-mac.dmg', url: 'https://example.com/mac.dmg' },
        { name: 'Boojy-Audio-win.exe', url: 'https://example.com/win.exe' },
      ],
    });
  });

  it('uses the given channel word in versionText', async () => {
    stubFetchJson([{ tag_name: 'v1.0.0', published_at: null, assets: [] }]);

    const release = await getLatestRelease(REPO, { fallbackVersion: 'v1 Alpha', channel: 'Alpha' });
    expect(release.versionText).toBe('v1.0.0 Alpha');
  });

  it('omits the date separator when published_at is null', async () => {
    stubFetchJson([{ tag_name: 'v0.5.4', published_at: null, assets: [] }]);

    const release = await getLatestRelease(REPO, OPTS);
    expect(release.versionText).toBe('v0.5.4 Early access');
    expect(release.dateText).toBe('');
  });

  it('falls back when the API responds non-OK (e.g. rate-limited)', async () => {
    stubFetchJson({ message: 'API rate limit exceeded' }, false);

    expect(await getLatestRelease(REPO, OPTS)).toEqual(FALLBACK);
  });

  it('falls back when the network request throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('getaddrinfo ENOTFOUND')));

    expect(await getLatestRelease(REPO, OPTS)).toEqual(FALLBACK);
  });

  it('falls back when the repo has no releases', async () => {
    stubFetchJson([]);

    expect(await getLatestRelease(REPO, OPTS)).toEqual(FALLBACK);
  });

  it('falls back when the response is not the expected shape', async () => {
    stubFetchJson([{ published_at: '2026-05-29T12:00:00Z' }]); // no tag_name

    expect(await getLatestRelease(REPO, OPTS)).toEqual(FALLBACK);
  });
});

describe('findAssetUrl', () => {
  const assets = [
    { name: 'Boojy-Notes-0.5.2-arm64.dmg', url: 'https://example.com/arm64.dmg' },
    { name: 'Boojy-Notes-Setup-0.5.2.exe', url: 'https://example.com/setup.exe' },
  ];

  it('returns the first asset matching the pattern', () => {
    expect(findAssetUrl(assets, /arm64\.dmg$/)).toBe('https://example.com/arm64.dmg');
  });

  it('returns undefined when nothing matches', () => {
    expect(findAssetUrl(assets, /linux/)).toBeUndefined();
  });
});
