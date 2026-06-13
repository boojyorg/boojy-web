import { useEffect, useMemo, useState } from 'react';
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
 * Web-first CTA for /notes/. The primary action is "Open in Web" (notes.boojy.org), which
 * opens immediately — it's navigation, not a file download, so there's nothing abrupt to
 * confirm. A secondary "Download for <OS>" button appears once the visitor's platform is
 * known (detected on mount, or chosen from "Other platforms"); the desktop installers are
 * click-to-confirm — picking a row only swaps the button's target, it never auto-downloads.
 * SSR / no-JS / Linux / unknown-OS visitors see just the web button (no wrong-OS claim).
 */
export function NotesDownload({ versionText, macArm64Url, winX64Url }: Props) {
  const { panelRef, toggleRef, toggle, close, panelClassName } = usePlatformsPanel();

  // Real (version-stamped) asset URLs from the build-time release fetch; if that failed,
  // fall back to the releases page so no affordance is ever a dead link. Memoised on the
  // prop URLs so it's a stable dependency for the detect-on-mount effect.
  const platforms = useMemo<NotesPlatform[]>(
    () => [
      { id: 'mac-arm64', label: 'Silicon', name: 'macOS', href: macArm64Url ?? RELEASES_URL },
      { id: 'mac-x64', label: 'Intel', name: 'macOS', disabled: true, pill: 'Coming soon' },
      { id: 'windows-x64', label: 'Windows', name: 'Windows', href: winX64Url ?? RELEASES_URL },
      { id: 'linux', label: 'Linux', name: 'Linux', disabled: true, pill: 'Coming soon' },
    ],
    [macArm64Url, winX64Url],
  );

  // Empty until a platform resolves (detection on mount, or a dropdown pick); the secondary
  // download button only renders once it's set, so SSR/unknown-OS stays web-only.
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [downloadHref, setDownloadHref] = useState('');
  const [downloadName, setDownloadName] = useState('');
  const [downloadIconHtml, setDownloadIconHtml] = useState('');
  const showDownload = selectedPlatform !== '';

  const selectPlatform = (platform: NotesPlatform) => {
    if (platform.disabled || !platform.href) return;
    setSelectedPlatform(platform.id);
    setDownloadHref(platform.href);
    setDownloadName(platform.name);
    setDownloadIconHtml(platformIconHtml(platform.id as PlatformId));
    close();
  };

  useEffect(() => {
    const detected = normalize(detectPlatform());
    const match = platforms.find((item) => item.id === detected && !item.disabled && item.href);
    if (match?.href) {
      setSelectedPlatform(match.id);
      setDownloadHref(match.href);
      setDownloadName(match.name);
      setDownloadIconHtml(platformIconHtml(detected));
    }
  }, [platforms]);

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
        {showDownload ? (
          <a className="btn btn-download btn-notes-download" href={downloadHref}>
            <span className="btn-label">
              <span
                className="download-icon"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted local SVG string
                dangerouslySetInnerHTML={{ __html: downloadIconHtml }}
              />
              <span>Download for {downloadName}</span>
            </span>
          </a>
        ) : null}
      </div>
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
        {platforms.map((platform) =>
          platform.disabled ? (
            <span
              key={platform.id}
              className="platform-item platform-disabled"
              data-platform={platform.id}
            >
              <PlatformIcon platform={platform.id} />
              <span>
                <strong>{platform.name}</strong>{' '}
                {platform.pill ? (
                  <span className="platform-pill">{platform.pill}</span>
                ) : (
                  platform.label
                )}
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
