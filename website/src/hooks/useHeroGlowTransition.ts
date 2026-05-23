import { useEffect, useRef } from 'react';

const COLOR_KEY = 'boojy-glow-from';
const OPACITY_KEY = 'boojy-glow-opacity-from';
const DURATION = 2500;

export function useHeroGlowTransition() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    const computed = getComputedStyle(glow);
    const targetStr = computed.getPropertyValue('--glow-color').trim();
    const target = targetStr.split(',').map(Number);
    if (target.length !== 3) return;

    const targetOpacity = parseFloat(computed.getPropertyValue('--glow-opacity')) || 0.75;

    const fromStr = sessionStorage.getItem(COLOR_KEY);
    const fromOpacityStr = sessionStorage.getItem(OPACITY_KEY);
    sessionStorage.removeItem(COLOR_KEY);
    sessionStorage.removeItem(OPACITY_KEY);

    if (fromStr) {
      const from = fromStr.split(',').map(Number);
      const fromOpacity = fromOpacityStr ? parseFloat(fromOpacityStr) : targetOpacity;
      const colorChanged = from.length === 3 && from.some((value, index) => value !== target[index]);
      const opacityChanged = Math.abs(fromOpacity - targetOpacity) > 0.001;

      if (colorChanged || opacityChanged) {
        const start = performance.now();

        function tick(now: number) {
          if (!glow) return;
          const t = Math.min((now - start) / DURATION, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          const r = Math.round(from[0] + (target[0] - from[0]) * ease);
          const g = Math.round(from[1] + (target[1] - from[1]) * ease);
          const b = Math.round(from[2] + (target[2] - from[2]) * ease);
          const o = fromOpacity + (targetOpacity - fromOpacity) * ease;
          glow.style.opacity = String(o);
          glow.style.background = `radial-gradient(ellipse, rgba(${r},${g},${b}, 0.25) 0%, rgba(${r},${g},${b}, 0.12) 40%, transparent 70%)`;
          if (t < 1) {
            requestAnimationFrame(tick);
          } else {
            glow.style.background = '';
            glow.style.opacity = '';
          }
        }

        requestAnimationFrame(tick);
      }
    }

    const onClick = (event: MouseEvent) => {
      const targetEl = event.target;
      if (!(targetEl instanceof Element)) return;

      const link = targetEl.closest('a[href]');
      if (!link) return;

      const href = link.getAttribute('href');
      if (href?.startsWith('/')) {
        sessionStorage.setItem(COLOR_KEY, targetStr);
        sessionStorage.setItem(OPACITY_KEY, String(targetOpacity));
      }
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return glowRef;
}
