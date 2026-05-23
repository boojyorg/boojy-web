import { Outlet } from 'react-router-dom';
import { Starfield } from './Starfield';
import { Nav } from './Nav';
import { Footer } from './Footer';

export function SiteLayout() {
  return (
    <>
      <Starfield />
      <Nav />
      <Outlet />
      <Footer />
    </>
  );
}
