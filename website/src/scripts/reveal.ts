/**
 * Scroll-in reveals: browsers with scroll-driven animations handle `.sr` in CSS
 * (styles/space.css). Others get this fallback: each `.sr` fades up once it scrolls into view.
 */
if (!CSS.supports('animation-timeline: view()') && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('sr-io');
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.15 },
  );
  for (const el of document.querySelectorAll('.sr')) io.observe(el);
}

export {};
