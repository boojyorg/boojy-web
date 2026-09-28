import { useEffect, useState } from 'react';
import { usePlatformsPanel } from '../hooks/usePlatformsPanel';
import { detectPlatform, isMobileDevice, type PlatformId, platformIconHtml } from '../lib/platform';
import { GitHubPlatformIcon, PlatformIcon } from './PlatformIcons';

interface AudioPlatform {
  id: string;
  label: string;
  name: string;
  href?: string;
  shortLabel?: string;
  disabled?: boolean;
  pill?: string;
}

const AUDIO_BASE_URL = 'https://github.com/boojyorg/boojy-audio/releases/latest/download/';

const AUDIO_PLATFORMS: AudioPlatform[] = [
  {
    id: 'mac-arm64',
    label: 'Apple Silicon',
    name: 'macOS',
    href: `${AUDIO_BASE_URL}Boojy-Audio-mac.dmg`,
    shortLabel: 'Apple Silicon',
  },
  {
    id: 'mac-x64',
    label: 'Intel',
    name: 'macOS',
    href: `${AUDIO_BASE_URL}Boojy-Audio-mac.dmg`,
    shortLabel: 'Intel',
  },
  {
    id: 'windows-x64',
    label: 'Windows 10+',
    name: 'Windows',
    href: `${AUDIO_BASE_URL}Boojy-Audio-win.exe`,
    shortLabel: 'Windows 10 and later',
  },
  {
    id: 'linux',
    label: 'Linux',
    name: 'Linux',
    disabled: true,
    pill: 'Planned',
  },
];

// Windows-on-ARM has no dedicated build; the x64 .exe runs under emulation.
function normalize(platform: PlatformId): PlatformId {
  return platform === 'windows-arm64' ? 'windows-x64' : platform;
}

/**
 * Interactive download CTA for /audio/. Server-renders a universal fallback (GitHub
 * releases) so the static HTML is complete; the client detects the OS on mount and
 * swaps in a direct download for the matched platform. `showFallback` is derived from the
 * href sentinel (`'#'` = no direct download yet) so there's a single source of truth.
 */
interface Props {
  /** Display version from the build-time release fetch, e.g. `v0.6` (lands in static HTML). */
  version: string;
}

export function AudioDownload({ version }: Props) {
  const { panelRef, toggleRef, toggle, close, panelClassName } = usePlatformsPanel();

  // Label/selection start empty so the SSR HTML (and Linux/unknown-OS visitors, whose
  // detection never matches) doesn't claim "(Silicon)" next to the generic fallback button.
  const [downloadHref, setDownloadHref] = useState('#');
  const [platformLabel, setPlatformLabel] = useState('');
  // OS family name (macOS / Windows) for the button label; the variant (Silicon /
  // Intel) stays in `platformLabel` for the meta line. Empty until a platform resolves.
  const [platformName, setPlatformName] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [downloadIconHtml, setDownloadIconHtml] = useState(platformIconHtml(null));
  const showFallback = downloadHref === '#';
  const [mobile, setMobile] = useState(false);

  const selectPlatform = (platform: AudioPlatform) => {
    if (platform.disabled || !platform.href) return;
    setDownloadHref(platform.href);
    setSelectedPlatform(platform.id);
    setPlatformLabel(platform.shortLabel ?? platform.label);
    setPlatformName(platform.name);
    setDownloadIconHtml(platformIconHtml(platform.id as PlatformId));
    close();
  };

  useEffect(() => {
    if (isMobileDevice()) {
      setMobile(true);
      return;
    }
    const detected = normalize(detectPlatform());
    setDownloadIconHtml(platformIconHtml(detected));
    const match = AUDIO_PLATFORMS.find((item) => item.id === detected && !item.disabled);
    if (match?.href) {
      setDownloadHref(match.href);
      setSelectedPlatform(match.id);
      setPlatformLabel(match.shortLabel ?? match.label);
      setPlatformName(match.name);
    }
  }, []);

  return (
    <div className="dl">
      {mobile ? (
        <p className="notes-desktop-note">A desktop app for macOS and Windows.</p>
      ) : (
        <div className="hero-buttons">
          {!showFallback ? (
            <div id="download-detected">
              <a className="btn-solid btn-audio audio-download" href={downloadHref}>
                <span className="btn-label">
                  <span
                    className="download-icon"
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted local SVG string
                    dangerouslySetInnerHTML={{ __html: downloadIconHtml }}
                  />
                  <span>Download for {platformName}</span>
                </span>
              </a>
            </div>
          ) : (
            <div id="download-fallback">
              <a
                href="https://github.com/boojyorg/boojy-audio/releases/latest"
                target="_blank"
                rel="noreferrer"
                className="btn-solid btn-audio audio-download"
              >
                <span className="btn-label">Download Boojy Audio</span>
              </a>
            </div>
          )}
        </div>
      )}
      <p className="dl-meta">
        {platformLabel ? `${platformLabel} · ` : ''}
        {version} · Early access ·{' '}
        <a href="#" className="other-platforms-link" ref={toggleRef} onClick={toggle}>
          Other platforms
        </a>
      </p>
      <div className={panelClassName} ref={panelRef}>
        {AUDIO_PLATFORMS.map((platform) =>
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
          href="https://github.com/boojyorg/boojy-audio/releases"
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
