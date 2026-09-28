/**
 * Scroll-in reveals: each `.sr` fades up once it scrolls into view (styles/space.css).
 * BaseLayout adds `sr-io` to <html> pre-paint when IntersectionObserver exists; without it
 * nothing is hidden.
 */
if (document.documentElement.classList.contains('sr-io')) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.1 },
  );
  for (const el of document.querySelectorAll('.sr')) io.observe(el);
}

export {};
