import { useHeroGlowTransition } from '../hooks/useHeroGlowTransition';

export function HubHero() {
  const glowRef = useHeroGlowTransition();

  return (
    <section className="hub-hero">
      <div className="hub-hero-glow" aria-hidden="true" ref={glowRef} />
      <div className="container">
        <div className="hub-hero-title reveal">
          <img src="/images/boojy-logo.svg" alt="Boojy" className="hub-hero-logo" />
          <img src="/images/Boojy_Image_Logo.png" alt="" className="hub-hero-icon" />
        </div>
        <p className="hub-tagline reveal reveal-d1">Free, open-source creative software.</p>
        <p className="hub-tagline-sub reveal reveal-d2">Made by Tyr.</p>
      </div>
    </section>
  );
}
