import type { ReactNode } from 'react';
import '../../public/css/legal.css';
import { useHeroGlowTransition } from '../hooks/useHeroGlowTransition';

interface LegalLayoutProps {
  title: string;
  updated: string;
  contentClassName?: string;
  bodyClassName?: string;
  children: ReactNode;
}

export function LegalLayout({
  title,
  updated,
  contentClassName = 'legal-content',
  bodyClassName = 'legal-body',
  children,
}: LegalLayoutProps) {
  const glowRef = useHeroGlowTransition();

  return (
    <>
      <section className="legal-hero">
        <div className="legal-hero-glow" aria-hidden="true" ref={glowRef} />
        <div className="container">
          <h1>{title}</h1>
          <p>{updated}</p>
        </div>
      </section>
      <section className={contentClassName}>
        <div className="container">
          <div className={bodyClassName}>{children}</div>
        </div>
      </section>
    </>
  );
}
