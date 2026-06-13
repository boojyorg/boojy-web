import { useEffect, useState } from 'react';
import { usePlatformsPanel } from '../hooks/usePlatformsPanel';
import { detectPlatform, type PlatformId, platformIconHtml } from '../lib/platform';
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
    shortLabel: 'Silicon',
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
    shortLabel: 'Windows',
  },
  {
    id: 'linux',
    label: 'Linux',
    name: 'Linux',
    disabled: true,
    pill: 'Coming soon',
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
  /** Version string, fetched at build time and passed in so it lands in static HTML. */
  versionText: string;
}

export function AudioDownload({ versionText }: Props) {
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
    <div className="audio-cta reveal reveal-d2">
      <div className="hero-buttons">
        {!showFallback ? (
          <div id="download-detected">
            <a className="btn btn-download" href={downloadHref}>
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
              className="btn btn-download"
            >
              <span className="btn-label">Download Boojy Audio</span>
            </a>
          </div>
        )}
      </div>
      <p className="hero-meta">
        {versionText}
        {platformLabel ? <span> ({platformLabel})</span> : null} ·{' '}
        <a href="#" className="other-platforms-link" ref={toggleRef} onClick={toggle}>
          Other platforms
        </a>{' '}
        ·{' '}
        <a
          href="https://github.com/boojyorg/boojy-audio/releases"
          className="other-platforms-link"
          target="_blank"
          rel="noreferrer"
        >
          All versions
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
