import { Outlet, useLocation } from 'react-router-dom';
import { getPageMeta } from '../content/page-meta';
import { usePageMeta } from '../hooks/usePageMeta';
import { Starfield } from './Starfield';
import { Nav } from './Nav';
import { Footer } from './Footer';

export function SiteLayout() {
  const { pathname } = useLocation();
  usePageMeta(getPageMeta(pathname));

  return (
    <>
      <Starfield />
      <Nav />
      <Outlet />
      <Footer />
    </>
  );
}
