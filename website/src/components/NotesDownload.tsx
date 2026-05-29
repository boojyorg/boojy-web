import { useEffect, useState } from 'react';
import { usePlatformsPanel } from '../hooks/usePlatformsPanel';
import { detectPlatform, type PlatformId, platformIconHtml } from '../lib/platform';
import { GitHubPlatformIcon, PlatformIcon } from './PlatformIcons';
import { WebIcon } from './WebIcon';

const NOTES_PLATFORMS = [
  {
    id: 'mac-arm64',
    label: 'Silicon',
    name: 'macOS',
    href: 'https://github.com/boojyorg/boojy-notes/releases/download/v0.1.3/Boojy-Notes-0.1.3-arm64.dmg',
  },
  {
    id: 'mac-x64',
    label: 'Intel',
    name: 'macOS',
    disabled: true,
    pill: 'Coming soon',
  },
  {
    id: 'windows-x64',
    label: 'Windows',
    name: 'Windows',
    href: 'https://github.com/boojyorg/boojy-notes/releases/download/v0.1.3/Boojy-Notes-Setup-0.1.3.exe',
  },
  {
    id: 'linux',
    label: 'Linux',
    name: 'Linux',
    disabled: true,
    pill: 'Coming soon',
  },
] as const;

const RELEASES_URL = 'https://github.com/boojyorg/boojy-notes/releases/latest';

// Windows-on-ARM has no dedicated build; the x64 installer runs under emulation.
function normalize(platform: PlatformId): PlatformId {
  return platform === 'windows-arm64' ? 'windows-x64' : platform;
}

interface Props {
  /** Version string, fetched at build time and passed in so it lands in static HTML. */
  versionText: string;
}

/**
 * Interactive download CTA for /notes/. Server-renders a universal fallback (GitHub
 * releases) — so no-JS / unmatched-platform (e.g. Windows-on-ARM, Linux) visitors are never
 * handed the wrong-OS binary — then the client detects the OS on mount and swaps in a direct
 * download. `showFallback` is derived from the href sentinel (`'#'` = no direct download yet).
 */
export function NotesDownload({ versionText }: Props) {
  const { panelRef, toggleRef, toggle, close, panelClassName } = usePlatformsPanel();

  const [downloadHref, setDownloadHref] = useState('#');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [downloadIconHtml, setDownloadIconHtml] = useState(platformIconHtml(null));
  const showFallback = downloadHref === '#';

  const selectPlatform = (platform: (typeof NOTES_PLATFORMS)[number]) => {
    if ('disabled' in platform && platform.disabled) return;
    if (!('href' in platform) || !platform.href) return;
    setDownloadHref(platform.href);
    setSelectedPlatform(platform.id);
    setDownloadIconHtml(platformIconHtml(platform.id as PlatformId));
    close();
  };

  useEffect(() => {
    const detected = normalize(detectPlatform());
    const match = NOTES_PLATFORMS.find((item) => item.id === detected && 'href' in item);
    if (match && 'href' in match && match.href) {
      setDownloadHref(match.href);
      setSelectedPlatform(match.id);
      setDownloadIconHtml(platformIconHtml(detected));
    }
  }, []);

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
                {/* biome-ignore lint/security/noDangerouslySetInnerHtml: trusted local SVG string */}
                <span
                  className="download-icon"
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
        {NOTES_PLATFORMS.map((platform) =>
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
