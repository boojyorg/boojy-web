import { Link } from 'react-router-dom';
import { GITHUB_ICON_PATH, YOUTUBE_ICON_PATH } from '../content/site';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <nav className="footer-row-1">
          <Link to="/audio/">Audio</Link>
          <Link to="/notes/">Notes</Link>
          <a href="/cloud/">Cloud</a>
          <a href="/privacy.html">Privacy</a>
          <a href="/terms.html">Terms</a>
        </nav>
        <div className="footer-row-2">
          <a href="https://github.com/boojyorg" target="_blank" aria-label="GitHub" className="footer-icon" rel="noreferrer">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d={GITHUB_ICON_PATH} />
            </svg>
          </a>
          <a href="https://youtube.com/@boojy" target="_blank" aria-label="YouTube" className="footer-icon" rel="noreferrer">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d={YOUTUBE_ICON_PATH} />
            </svg>
          </a>
          <span className="footer-sep">&middot;</span>
          <a href="mailto:tyr@boojy.org" className="footer-email">
            tyr@boojy.org
          </a>
          <span className="footer-sep">&middot;</span>
          <span className="footer-copy">&copy; 2026 Boojy</span>
        </div>
      </div>
    </footer>
  );
}
