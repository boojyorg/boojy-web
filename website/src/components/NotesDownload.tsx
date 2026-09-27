import { useEffect, useMemo, useState } from 'react';
import { usePlatformsPanel } from '../hooks/usePlatformsPanel';
import { detectPlatform, isMobileDevice, type PlatformId, platformIconHtml } from '../lib/platform';
import { GitHubPlatformIcon, PlatformIcon } from './PlatformIcons';

/** Direct asset URLs from the build-time release fetch; `null` when unresolved. */
export interface NotesDownloadUrls {
  macArm64: string | null;
  winX64: string | null;
  linuxAppImageX64: string | null;
  linuxAppImageArm64: string | null;
  linuxDebX64: string | null;
  linuxDebArm64: string | null;
}

interface NotesPlatform {
  /** Row id; also the icon key (`mac…` / `windows…` / `linux…`). */
  id: string;
  /** Detected platform this row is the default download for, if any. */
  detects?: PlatformId;
  name: string;
  label: string;
  href: string;
}

const RELEASES_URL = 'https://github.com/boojyorg/boojy-notes/releases/latest';

// Windows-on-ARM has no dedicated build; the x64 installer runs under emulation.
function normalize(platform: PlatformId): PlatformId {
  return platform === 'windows-arm64' ? 'windows-x64' : platform;
}

interface Props {
  /** Version string, fetched at build time and passed in so it lands in static HTML. */
  versionText: string;
  urls: NotesDownloadUrls;
}

/**
 * Download CTA for /notes/. Boojy Notes is a desktop app (macOS, Windows, Linux); the
 * browser build at notes.boojy.org is a development target that keeps notes in browser
 * storage, so the site doesn't offer it.
 *
 * The button depends on what the visitor is on, detected on mount:
 * - a desktop with a build → "Download for <OS>" pointing straight at the installer
 *   (click-to-confirm: picking a row in "Other platforms" only swaps the target);
 * - a phone or tablet → no button, a line saying it's a desktop app;
 * - anything else (Intel Mac, unknown OS, and the SSR/no-JS HTML) → a plain "Download"
 *   that opens the platform list (or goes to GitHub releases without JS).
 * Linux defaults to the AppImage, which runs on any distro; the .deb is in the list.
 */
export function NotesDownload({ versionText, urls }: Props) {
  const { panelRef, toggleRef, toggle, close, panelClassName } = usePlatformsPanel();

  // Real (version-stamped) asset URLs; if the fetch failed, fall back to the releases page
  // so no affordance is ever a dead link. Memoised as a stable effect dependency.
  const platforms = useMemo<NotesPlatform[]>(
    () => [
      {
        id: 'mac-arm64',
        detects: 'mac-arm64',
        name: 'macOS',
        label: 'Apple Silicon',
        href: urls.macArm64 ?? RELEASES_URL,
      },
      {
        id: 'windows-x64',
        detects: 'windows-x64',
        name: 'Windows',
        label: '10 and later',
        href: urls.winX64 ?? RELEASES_URL,
      },
      {
        id: 'linux-appimage-x64',
        detects: 'linux',
        name: 'Linux',
        label: 'AppImage · x64',
        href: urls.linuxAppImageX64 ?? RELEASES_URL,
      },
      {
        id: 'linux-appimage-arm64',
        detects: 'linux-arm64',
        name: 'Linux',
        label: 'AppImage · ARM',
        href: urls.linuxAppImageArm64 ?? RELEASES_URL,
      },
      {
        id: 'linux-deb-x64',
        name: 'Linux',
        label: '.deb · x64',
        href: urls.linuxDebX64 ?? RELEASES_URL,
      },
      {
        id: 'linux-deb-arm64',
        name: 'Linux',
        label: '.deb · ARM',
        href: urls.linuxDebArm64 ?? RELEASES_URL,
      },
    ],
    [urls],
  );

  // Empty until a platform resolves (detection on mount, or a pick from the list).
  const [selected, setSelected] = useState<NotesPlatform | null>(null);
  const [mobile, setMobile] = useState(false);

  const selectPlatform = (platform: NotesPlatform) => {
    setSelected(platform);
    close();
  };

  useEffect(() => {
    if (isMobileDevice()) {
      setMobile(true);
      return;
    }
    const detected = normalize(detectPlatform());
    const match = platforms.find((item) => item.detects && item.detects === detected);
    if (match) setSelected(match);
  }, [platforms]);

  return (
    <div className="notes-cta reveal reveal-d2">
      {mobile && !selected ? (
        <p className="notes-desktop-note">A desktop app for macOS, Windows and Linux.</p>
      ) : (
        <div className="hero-buttons">
          {selected ? (
            <a className="btn btn-download btn-notes-download" href={selected.href}>
              <span className="btn-label">
                <span
                  className="download-icon"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted local SVG string
                  dangerouslySetInnerHTML={{ __html: platformIconHtml(selected.id as PlatformId) }}
                />
                <span>Download for {selected.name}</span>
              </span>
            </a>
          ) : (
            <a className="btn btn-download btn-notes-download" href={RELEASES_URL} onClick={toggle}>
              <span className="btn-label">
                <span>Download</span>
              </span>
            </a>
          )}
        </div>
      )}
      <p className="hero-meta">
        <span>{versionText}</span> ·{' '}
        <a href="#" className="other-platforms-link" ref={toggleRef} onClick={toggle}>
          Other platforms
        </a>{' '}
        ·{' '}
        <a
          href="https://github.com/boojyorg/boojy-notes/releases"
          className="other-platforms-link"
          target="_blank"
          rel="noreferrer"
        >
          All versions
        </a>
      </p>
      <div className={panelClassName} ref={panelRef}>
        {platforms.map((platform) => (
          <a
            key={platform.id}
            href={platform.href}
            className={`platform-item${selected?.id === platform.id ? ' selected' : ''}`}
            data-platform={platform.id}
            onClick={(event) => {
              event.preventDefault();
              selectPlatform(platform);
            }}
          >
            <PlatformIcon platform={platform.id} />
            <span>
              <strong>{platform.name}</strong> {platform.label}
            </span>
          </a>
        ))}
        <a
          className="platform-item platform-github"
          href="https://github.com/boojyorg/boojy-notes/releases"
          target="_blank"
          rel="noreferrer"
        >
          <GitHubPlatformIcon />
          <span>
            <strong>GitHub</strong> All releases
          </span>
        </a>
      </div>
    </div>
  );
}
