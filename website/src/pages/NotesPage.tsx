import { useEffect, useMemo, useState } from 'react';
import '../../public/css/notes.css';
import { useHeroGlowTransition } from '../hooks/useHeroGlowTransition';
import { useNotesVersion } from '../hooks/useNotesVersion';
import { usePlatformsPanel } from '../hooks/usePlatformsPanel';
import { ProductCloudCard } from '../components/ProductCloudCard';
import { WebIcon } from '../components/WebIcon';
import { CLOUD_DESCRIPTION } from '../content/site';
import { detectPlatform, platformIconHtml, type PlatformId } from '../lib/platform';

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

const DEFAULT_DOWNLOAD =
  'https://github.com/boojyorg/boojy-notes/releases/download/v0.1.3/Boojy-Notes-0.1.3-arm64.dmg';

export function NotesPage() {
  const glowRef = useHeroGlowTransition();
  const versionText = useNotesVersion();
  const { panelRef, toggleRef, toggle, close, panelClassName } = usePlatformsPanel();
  const detected = useMemo(() => detectPlatform(), []);

  const initialPlatform = useMemo(() => {
    const match = NOTES_PLATFORMS.find((item) => item.id === detected && !('disabled' in item));
    return match && 'href' in match ? match : NOTES_PLATFORMS[0];
  }, [detected]);

  const [downloadHref, setDownloadHref] = useState(
    'href' in initialPlatform ? initialPlatform.href : DEFAULT_DOWNLOAD,
  );
  const [selectedPlatform, setSelectedPlatform] = useState<string>(initialPlatform.id);
  const [downloadIconHtml, setDownloadIconHtml] = useState(platformIconHtml(detected));

  useEffect(() => {
    if (detected === 'linux') {
      return;
    }
    const match = NOTES_PLATFORMS.find((item) => item.id === detected && 'href' in item);
    if (match && 'href' in match && match.href) {
      setDownloadHref(match.href);
      setSelectedPlatform(match.id);
      setDownloadIconHtml(platformIconHtml(detected));
    }
  }, [detected]);

  const selectPlatform = (platform: (typeof NOTES_PLATFORMS)[number]) => {
    if ('disabled' in platform && platform.disabled) return;
    if (!('href' in platform) || !platform.href) return;
    setDownloadHref(platform.href);
    setSelectedPlatform(platform.id);
    setDownloadIconHtml(platformIconHtml(platform.id as PlatformId));
    close();
  };

  return (
    <>
      <section className="notes-hero">
        <div className="notes-hero-glow" aria-hidden="true" ref={glowRef} />
        <div className="container">
          <div className="notes-hero-title reveal">
            <img src="/images/boojy-logo.svg" alt="Boojy" className="notes-hero-logo" />
            <img src="/images/Notes-text-logo.png" alt="Notes" className="notes-hero-product" />
          </div>
          <p className="notes-tagline reveal reveal-d1">Your notes. Your files. Your devices.</p>
          <div className="notes-cta reveal reveal-d2">
            <div className="hero-buttons">
              <a href="https://notes.boojy.org" target="_blank" rel="noreferrer" className="btn btn-web-notes">
                <span className="btn-label">
                  <span className="web-icon">
                    <WebIcon />
                  </span>
                  Open in Web
                </span>
              </a>
              <div id="download-detected">
                <a className="btn btn-download" href={downloadHref}>
                  <span className="btn-label">
                    <span
                      className="download-icon"
                      dangerouslySetInnerHTML={{ __html: downloadIconHtml }}
                    />
                    <span>Download</span>
                  </span>
                </a>
              </div>
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
                      {platform.pill ? <span className="platform-pill">{platform.pill}</span> : null}
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
        </div>
      </section>

      <section className="notes-screenshot-section">
        <div className="container">
          <div className="notes-screenshot-wrapper reveal reveal-d3">
            <img
              src="/images/notes-screenshot-v0.1.png"
              alt="Boojy Notes"
              className="notes-screenshot"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="notes-features-section">
        <div className="container">
          <div className="notes-features-grid">
            <div className="notes-feature-card">
              <svg
                className="notes-feature-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                <path d="m15 5 4 4" />
              </svg>
              <h3>Markdown files</h3>
              <p>Write in markdown, rendered live. Your notes are plain files — always yours.</p>
            </div>
            <div className="notes-feature-card">
              <svg
                className="notes-feature-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
              <h3>Cross-platform</h3>
              <p>Web and desktop. Pick up where you left off.</p>
            </div>
            <div className="notes-feature-card">
              <svg
                className="notes-feature-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h.01" />
                <path d="M8.5 16.429a5 5 0 0 1 7 0" />
                <path d="M5 12.859a10 10 0 0 1 5.17-2.69" />
                <path d="M13.83 10.17A10 10 0 0 1 19 12.859" />
                <path d="M1.42 9a16 16 0 0 1 6.81-4.15" />
                <path d="M15.77 4.85A16 16 0 0 1 22.58 9" />
                <line x1="2" x2="22" y1="2" y2="22" />
              </svg>
              <h3>Offline first</h3>
              <p>Works without internet. Cloud sync coming soon.</p>
            </div>
          </div>
        </div>
      </section>

      <ProductCloudCard
        ctaClassName="notes-cloud-cta"
        description={CLOUD_DESCRIPTION}
      />
    </>
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

  if (platform === 'linux') {
    return (
      <svg className="platform-icon platform-icon-linux" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139z" />
      </svg>
    );
  }

  return (
    <svg className="platform-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
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
