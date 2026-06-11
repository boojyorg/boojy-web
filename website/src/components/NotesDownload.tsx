import { useEffect, useState } from 'react';
import { usePlatformsPanel } from '../hooks/usePlatformsPanel';
import { detectPlatform, type PlatformId } from '../lib/platform';
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
 * Web-first CTA for /notes/. The primary action is "Open in Web" (notes.boojy.org); the
 * desktop installers live in the "Other platforms" dropdown as direct, version-stamped
 * download links plus a GitHub all-releases link — mirroring the /audio CTA's panel. The
 * client detects the OS on mount only to highlight the visitor's own platform row.
 */
export function NotesDownload({ versionText, macArm64Url, winX64Url }: Props) {
  const { panelRef, toggleRef, toggle, close, panelClassName } = usePlatformsPanel();
  const [detected, setDetected] = useState<string>('');

  // Real (version-stamped) asset URLs from the build-time release fetch; if that failed,
  // fall back to the releases page so no affordance is ever a dead link.
  const platforms: NotesPlatform[] = [
    { id: 'mac-arm64', label: 'Silicon', name: 'macOS', href: macArm64Url ?? RELEASES_URL },
    { id: 'mac-x64', label: 'Intel', name: 'macOS', disabled: true, pill: 'Coming soon' },
    { id: 'windows-x64', label: 'Windows', name: 'Windows', href: winX64Url ?? RELEASES_URL },
    { id: 'linux', label: 'Linux', name: 'Linux', disabled: true, pill: 'Coming soon' },
  ];

  useEffect(() => {
    setDetected(normalize(detectPlatform()) ?? '');
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
              href={platform.href}
              className={`platform-item${detected === platform.id ? ' selected' : ''}`}
              data-platform={platform.id}
              onClick={close}
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
