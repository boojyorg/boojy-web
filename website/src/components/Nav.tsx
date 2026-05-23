import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GITHUB_ICON_PATH } from '../content/site';

export function Nav() {
  const location = useLocation();
  const navbarRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const activeProduct = location.pathname.startsWith('/audio/')
    ? 'audio'
    : location.pathname.startsWith('/notes/')
      ? 'notes'
      : undefined;

  useEffect(() => {
    const navbar = navbarRef.current;
    if (!navbar) return;

    const onScroll = () => {
      if (window.pageYOffset > 50) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((open) => !open);

  const hamburgerStyle = menuOpen
    ? {
        first: { transform: 'rotate(45deg) translateY(7px)' },
        second: { opacity: '0' },
        third: { transform: 'rotate(-45deg) translateY(-7px)' },
      }
    : {
        first: { transform: 'none' },
        second: { opacity: '1' },
        third: { transform: 'none' },
      };

  return (
    <nav className="navbar" ref={navbarRef}>
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <img src="/images/Boojy_Image_Logo.png" alt="Boojy" className="logo-icon" />
        </Link>

        <div className="nav-products">
          <Link
            to="/audio/"
            className={`nav-product${activeProduct === 'audio' ? ' active' : ''}`}
            data-product="audio"
          >
            Audio
          </Link>
          <Link
            to="/notes/"
            className={`nav-product${activeProduct === 'notes' ? ' active' : ''}`}
            data-product="notes"
          >
            Notes
          </Link>
        </div>

        <div className="nav-right">
          <a href="https://github.com/boojyorg" target="_blank" className="nav-github" aria-label="GitHub" rel="noreferrer">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d={GITHUB_ICON_PATH} />
            </svg>
          </a>
          <a href="/account/" className="nav-signin">
            Account
          </a>
          <button
            className="nav-toggle"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={toggleMenu}
            type="button"
          >
            <span style={hamburgerStyle.first} />
            <span style={hamburgerStyle.second} />
            <span style={hamburgerStyle.third} />
          </button>
        </div>

        <div className={`nav-mobile-menu${menuOpen ? ' active' : ''}`}>
          <Link
            to="/audio/"
            className={`nav-mobile-link${activeProduct === 'audio' ? ' active' : ''}`}
            data-product="audio"
            onClick={closeMenu}
          >
            Audio
          </Link>
          <Link
            to="/notes/"
            className={`nav-mobile-link${activeProduct === 'notes' ? ' active' : ''}`}
            data-product="notes"
            onClick={closeMenu}
          >
            Notes
          </Link>
          <a href="/account/" className="nav-mobile-link" onClick={closeMenu}>
            Account
          </a>
          <a
            href="https://github.com/boojyorg"
            target="_blank"
            className="nav-mobile-link"
            onClick={closeMenu}
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
