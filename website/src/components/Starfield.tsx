import { useEffect, useRef } from 'react';

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  color: string;
  maxBrightness: number;
  cycleDuration: number;
  phaseOffset: number;
  shadowBlur: number;
  parallax: number;
}

const SEED = '__boojy_hub__';
const COUNT = 350;
const TOP_EXCLUDE = 0.05;
const EMPTY_MULT = 1.6;
const FIELD_HEIGHT = 4000;
const COLOURS = [
  '#FFFFFF',
  '#FFFFFF',
  '#FFFFFF',
  '#FFFFFF',
  '#FFFFFF',
  '#FFFFFF',
  '#FFFFFF',
  '#FFFFFF',
  '#F0F4FF',
  '#FFFDDE',
];

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const context = canvasEl.getContext('2d');
    if (!context) return;

    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = context;

    const dpr = window.devicePixelRatio || 1;
    let animId = 0;
    let stars: Star[] = [];
    let lastW = 0;
    let lastH = 0;
    let scrollY = 0;

    const onScroll = () => {
      scrollY = window.pageYOffset;
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    function generate() {
      const w = window.innerWidth;
      const h = window.innerHeight;

      if (w === lastW && h === lastH && stars.length > 0) return;
      lastW = w;
      lastH = h;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const rand = mulberry32(hashString(SEED));
      const closeLayer = Math.round(COUNT * 0.32);
      stars = Array.from({ length: COUNT }, (_, i) => {
        const isHero = rand() < 0.08;
        const radius = isHero ? 1.5 + rand() * 1.0 : 0.3 + rand() * 1.2;
        return {
          x: rand() * w,
          y: FIELD_HEIGHT * TOP_EXCLUDE + rand() * FIELD_HEIGHT * (1 - TOP_EXCLUDE),
          radius,
          // index is always in-bounds (rand() is [0,1)); assert for noUncheckedIndexedAccess
          color: COLOURS[Math.floor(rand() * COLOURS.length)]!,
          maxBrightness: 0.3 + rand() * 0.7,
          cycleDuration: 7500 + rand() * 30000,
          phaseOffset: rand() * Math.PI * 2,
          shadowBlur: radius > 1.0 ? 8 + radius * 5 : 4 + radius * 3,
          parallax: i < closeLayer ? 0.15 : 0.05,
        };
      });
    }

    function draw(time: number) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      const viewH = lastH;

      for (const star of stars) {
        const drawY = star.y - scrollY * star.parallax;
        if (drawY < -20 || drawY > viewH + 20) continue;

        const cycle = (time % star.cycleDuration) / star.cycleDuration;
        const sine = Math.sin(cycle * Math.PI * 2 + star.phaseOffset);
        const norm = (sine + 1) / 2;
        const opacity = Math.min((0.08 + norm * (star.maxBrightness - 0.08)) * EMPTY_MULT, 1.0);

        ctx.globalAlpha = opacity;
        ctx.fillStyle = star.color;
        if (star.radius > 1.0) {
          ctx.shadowBlur = star.shadowBlur * (0.6 + norm * 0.4);
          ctx.shadowColor = star.color;
        }
        ctx.beginPath();
        ctx.arc(star.x, drawY, star.radius, 0, Math.PI * 2);
        ctx.fill();
        if (star.radius > 1.0) ctx.shadowBlur = 0;
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    }

    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @keyframes shootingStar {
        0% { transform: translateX(0) translateY(0); opacity: 1; }
        70% { opacity: 1; }
        100% { transform: translateX(400px) translateY(200px); opacity: 0; }
      }
      .shooting-star {
        position: fixed;
        width: 120px;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), white);
        pointer-events: none;
        z-index: 0;
        animation: shootingStar 1.5s linear forwards;
        transform-origin: left center;
        rotate: 25deg;
      }
    `;
    document.head.appendChild(styleEl);

    function spawnShootingStar() {
      const star = document.createElement('div');
      star.className = 'shooting-star';
      star.style.left = `${Math.random() * window.innerWidth * 0.7}px`;
      star.style.top = `${Math.random() * window.innerHeight * 0.4}px`;
      document.body.appendChild(star);
      star.addEventListener('animationend', () => star.remove());
      scheduleNext();
    }

    let shootingTimer = 0;
    function scheduleNext() {
      shootingTimer = window.setTimeout(spawnShootingStar, 15000 + Math.random() * 5000);
    }

    let resizeTimer = 0;
    function onResize() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        cancelAnimationFrame(animId);
        generate();
        animId = requestAnimationFrame(draw);
      }, 150);
    }

    const resizeObserver = new ResizeObserver(onResize);
    window.addEventListener('resize', onResize);
    resizeObserver.observe(document.documentElement);

    generate();
    animId = requestAnimationFrame(draw);
    scheduleNext();

    return () => {
      cancelAnimationFrame(animId);
      window.clearTimeout(resizeTimer);
      window.clearTimeout(shootingTimer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      resizeObserver.disconnect();
      styleEl.remove();
      document.querySelectorAll('.shooting-star').forEach((el) => el.remove());
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        viewTransitionName: 'starfield',
      }}
    />
  );
}
