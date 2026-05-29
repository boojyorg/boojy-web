import { useEffect, useState } from 'react';
import { usePlatformsPanel } from '../hooks/usePlatformsPanel';
import { detectPlatform, type PlatformId, platformIconHtml } from '../lib/platform';
import { WebIcon } from './WebIcon';

interface AudioPlatform {
  id: string;
  label: string;
  name: string;
  href?: string;
  shortLabel?: string;
  disabled?: boolean;
  pill?: string;
}

const AUDIO_BASE_URL = 'https://github.com/tyrbujac/boojy-audio/releases/latest/download/';

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

/**
 * Interactive download CTA for /audio/. Server-renders a universal fallback (GitHub
 * releases) so the static HTML is complete; the client detects the OS on mount and
 * swaps in a direct download for the matched platform.
 */
export function AudioDownload() {
  const { panelRef, toggleRef, toggle, close, panelClassName } = usePlatformsPanel();

  const [downloadHref, setDownloadHref] = useState('#');
  const [platformLabel, setPlatformLabel] = useState('Silicon');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('mac-arm64');
  const [downloadIconHtml, setDownloadIconHtml] = useState(platformIconHtml(null));
  const [showFallback, setShowFallback] = useState(true);

  useEffect(() => {
    const detected = detectPlatform();
    setDownloadIconHtml(platformIconHtml(detected));
    if (detected === 'linux' || detected === null) {
      setShowFallback(true);
      return;
    }
    const match = AUDIO_PLATFORMS.find((item) => item.id === detected && !item.disabled);
    if (match?.href) {
      setDownloadHref(match.href);
      setSelectedPlatform(match.id);
      setPlatformLabel(match.shortLabel ?? match.label);
      setShowFallback(false);
    } else {
      setShowFallback(true);
    }
  }, []);

  const selectPlatform = (platform: AudioPlatform) => {
    if (platform.disabled || !platform.href) return;
    setDownloadHref(platform.href);
    setSelectedPlatform(platform.id);
    setPlatformLabel(platform.shortLabel ?? platform.label);
    setDownloadIconHtml(platformIconHtml(platform.id as PlatformId));
    setShowFallback(false);
    close();
  };

  return (
    <div className="audio-cta reveal reveal-d2">
      <div className="hero-buttons">
        <a className="btn btn-web-audio btn-disabled">
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
                <span>Download Boojy Audio</span>
              </span>
            </a>
          </div>
        ) : (
          <div id="download-fallback">
            <a
              href="https://github.com/tyrbujac/boojy-audio/releases/latest"
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
        v0.1 Beta (<span>{platformLabel}</span>) · 28 Feb 2026 ·{' '}
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
              <LinuxPlatformIcon />
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
          href="https://github.com/tyrbujac/boojy-audio/releases"
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

function PlatformIcon({ platform }: { platform: string }) {
  if (platform === 'windows-x64') {
    return (
      <svg className="platform-icon platform-icon-win" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
      </svg>
    );
  }

  return (
    <svg className="platform-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function LinuxPlatformIcon() {
  return (
    <svg className="platform-icon platform-icon-linux" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139z" />
    </svg>
  );
}

function GitHubPlatformIcon() {
  return (
    <svg className="platform-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
