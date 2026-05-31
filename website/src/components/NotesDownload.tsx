import { useEffect, useState } from 'react';
import { usePlatformsPanel } from '../hooks/usePlatformsPanel';
import { detectPlatform, type PlatformId, platformIconHtml } from '../lib/platform';
import { GitHubPlatformIcon, PlatformIcon } from './PlatformIcons';
import { WebIcon } from './WebIcon';

interface NotesPlatform {
  id: string;
  label: string;
  name: string;
  href?: string;
  disabled?: boolean;
  pill?: string;
}

const RELEASES_URL = 'https://github.com/boojyorg/boojy-notes/releases/latest';

// Windows-on-ARM has no dedicated build; the x64 installer runs under emulation.
function normalize(platform: PlatformId): PlatformId {
  return platform === 'windows-arm64' ? 'windows-x64' : platform;
}

interface Props {
  /** Version string, fetched at build time and passed in so it lands in static HTML. */
  versionText: string;
  /** Direct macOS (Apple Silicon) .dmg URL from the latest release; null if unresolved. */
  macArm64Url: string | null;
  /** Direct Windows installer URL from the latest release; null if unresolved. */
  winX64Url: string | null;
}

/**
 * Interactive download CTA for /notes/. Server-renders a universal fallback (GitHub
 * releases) — so no-JS / unmatched-platform (e.g. Windows-on-ARM, Linux) visitors are never
 * handed the wrong-OS binary — then the client detects the OS on mount and swaps in a direct
 * download. `showFallback` is derived from the href sentinel (`'#'` = no direct download yet).
 */
export function NotesDownload({ versionText, macArm64Url, winX64Url }: Props) {
  const { panelRef, toggleRef, toggle, close, panelClassName } = usePlatformsPanel();

  const [downloadHref, setDownloadHref] = useState('#');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [downloadIconHtml, setDownloadIconHtml] = useState(platformIconHtml(null));
  const showFallback = downloadHref === '#';

  // Real (version-stamped) asset URLs from the build-time release fetch; if that failed,
  // fall back to the releases page so no affordance is ever a dead link.
  const platforms: NotesPlatform[] = [
    { id: 'mac-arm64', label: 'Silicon', name: 'macOS', href: macArm64Url ?? RELEASES_URL },
    { id: 'mac-x64', label: 'Intel', name: 'macOS', disabled: true, pill: 'Coming soon' },
    { id: 'windows-x64', label: 'Windows', name: 'Windows', href: winX64Url ?? RELEASES_URL },
    { id: 'linux', label: 'Linux', name: 'Linux', disabled: true, pill: 'Coming soon' },
  ];

  const selectPlatform = (platform: NotesPlatform) => {
    if (platform.disabled || !platform.href) return;
    setDownloadHref(platform.href);
    setSelectedPlatform(platform.id);
    setDownloadIconHtml(platformIconHtml(platform.id as PlatformId));
    close();
  };

  useEffect(() => {
    const detected = normalize(detectPlatform());
    const href =
      detected === 'mac-arm64' ? macArm64Url : detected === 'windows-x64' ? winX64Url : null;
    if (detected && href) {
      setDownloadHref(href);
      setSelectedPlatform(detected);
      setDownloadIconHtml(platformIconHtml(detected));
    }
  }, [macArm64Url, winX64Url]);

  return (
    <div className="notes-cta reveal reveal-d2">
      <div className="hero-buttons">
        <a
          href="https://notes.boojy.org"
          target="_blank"
          rel="noreferrer"
          className="btn btn-web-notes"
        >
          <span className="btn-label">
            <span className="web-icon">
              <WebIcon />
            </span>
            Open in Web
          </span>
        </a>
        {!showFallback ? (
          <div id="download-detected">
            <a className="btn btn-download" href={downloadHref}>
              <span className="btn-label">
                <span
                  className="download-icon"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted local SVG string
                  dangerouslySetInnerHTML={{ __html: downloadIconHtml }}
                />
                <span>Download</span>
              </span>
            </a>
          </div>
        ) : (
          <div id="download-fallback">
            <a href={RELEASES_URL} target="_blank" rel="noreferrer" className="btn btn-download">
              <span className="btn-label">Download</span>
            </a>
          </div>
        )}
      </div>
      <p className="hero-meta">
        <span>{versionText}</span> ·{' '}
        <a href="#" className="other-platforms-link" ref={toggleRef} onClick={toggle}>
          Other platforms
        </a>
      </p>
      <div className={panelClassName} ref={panelRef}>
        {platforms.map((platform) =>
          'disabled' in platform && platform.disabled ? (
            <span
              key={platform.id}
              className={`platform-item platform-disabled${selectedPlatform === platform.id ? ' selected' : ''}`}
              data-platform={platform.id}
            >
              <PlatformIcon platform={platform.id} />
              <span>
                <strong>{platform.name}</strong> {platform.label}{' '}
                {'pill' in platform && platform.pill ? (
                  <span className="platform-pill">{platform.pill}</span>
                ) : null}
              </span>
            </span>
          ) : (
            <a
              key={platform.id}
              href="#"
              className={`platform-item${selectedPlatform === platform.id ? ' selected' : ''}`}
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
          ),
        )}
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
