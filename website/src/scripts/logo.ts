/**
 * Logo interactions (components/BoojyWordmark.astro, AppLockup.astro, the 404 moon).
 * The rule: things that glow react with light, things that orbit can be dragged.
 * - The sun, and the N / A on the app pages: a click blooms a hot spot where you clicked
 *   (clipped to the shape) and the glow swells, then both fade.
 * - The planet on the j, and the 404 moon: drag it anywhere and let go; it springs back
 *   with a small settle.
 */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const r2 = (n: number) => Math.round(n * 100) / 100;

function svgPoint(svg: SVGSVGElement, e: { clientX: number; clientY: number }) {
  const pt = svg.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  const m = svg.getScreenCTM();
  return m ? pt.matrixTransform(m.inverse()) : pt;
}

function flare(group: SVGGElement, pt: { x: number; y: number }) {
  if (reduceMotion) return;
  const hot = group.querySelector<SVGCircleElement>('.hot');
  const prev = group.previousElementSibling;
  const halo = prev?.classList.contains('halo')
    ? prev
    : group.ownerSVGElement?.querySelector('.halo');
  const c = {
    x: Number(group.dataset.cx),
    y: Number(group.dataset.cy),
    r: Number(group.dataset.r),
  };
  if (!hot || Number.isNaN(c.r)) return;
  const dx = pt.x - c.x;
  const dy = pt.y - c.y;
  const d = Math.hypot(dx, dy);
  const lim = c.r * 0.6;
  hot.setAttribute('cx', String(r2(d > lim ? c.x + (dx / d) * lim : pt.x)));
  hot.setAttribute('cy', String(r2(d > lim ? c.y + (dy / d) * lim : pt.y)));
  hot.animate(
    [
      { r: '0.5px', opacity: 1 },
      { r: `${r2(c.r * 0.55)}px`, opacity: 0.9, offset: 0.35 },
      { r: `${r2(c.r * 0.7)}px`, opacity: 0 },
    ],
    { duration: 1100, easing: 'ease-out' },
  );
  halo?.animate([{ opacity: 0.55 }, { opacity: 1, offset: 0.3 }, { opacity: 0.55 }], {
    duration: 1300,
    easing: 'ease-out',
  });
}

interface Body {
  g: SVGGElement;
  rest: { x: number; y: number };
  x: number;
  y: number;
  vx: number;
  vy: number;
  moving: boolean;
}
const bodies = new Map<SVGGElement, Body>();
const bodyOf = (g: SVGGElement) => {
  let b = bodies.get(g);
  if (!b) {
    b = {
      g,
      rest: { x: Number(g.dataset.rx), y: Number(g.dataset.ry) },
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      moving: false,
    };
    bodies.set(g, b);
  }
  return b;
};
let drag: {
  b: Body;
  svg: SVGSVGElement;
  start: DOMPoint;
  from: { x: number; y: number };
  last: DOMPoint;
  lastT: number;
  vx: number;
  vy: number;
  id: number;
  moved: boolean;
} | null = null;
let raf = 0;

// While a planet is dragged (and until it springs home) its logo is raised above the whole
// page, so it passes in front of text, buttons, cards, the nav and the footer instead of
// behind whatever comes later in the page. Each ancestor up to <body> gets a high z-index.
let raised: { el: HTMLElement; z: string; pos: string }[] = [];
function raise(svg: SVGSVGElement) {
  if (raised.length) return;
  for (let el = svg.parentElement; el && el !== document.body; el = el.parentElement) {
    raised.push({ el, z: el.style.zIndex, pos: el.style.position });
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    el.style.zIndex = '100';
  }
}
function lower() {
  for (const { el, z, pos } of raised) {
    el.style.zIndex = z;
    el.style.position = pos;
  }
  raised = [];
}

function place(b: Body) {
  b.g.setAttribute('transform', `translate(${r2(b.rest.x + b.x)} ${r2(b.rest.y + b.y)})`);
}
function step(now: number, last: number) {
  const dt = Math.min(0.05, (now - last) / 1000);
  let active = false;
  for (const b of bodies.values()) {
    if (!b.moving) continue;
    const k = 120;
    const c = 15;
    b.vx += (-k * b.x - c * b.vx) * dt;
    b.vy += (-k * b.y - c * b.vy) * dt;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    if (Math.hypot(b.x, b.y) < 0.05 && Math.hypot(b.vx, b.vy) < 0.5) {
      b.x = b.y = b.vx = b.vy = 0;
      b.moving = false;
    } else active = true;
    place(b);
  }
  raf = active ? requestAnimationFrame((t) => step(t, now)) : 0;
  if (!active && !drag) lower();
}
function spring(b: Body) {
  if (reduceMotion) {
    b.x = b.y = 0;
    place(b);
    lower();
    return;
  }
  b.moving = true;
  if (!raf) raf = requestAnimationFrame((t) => step(t, t - 16));
}

document.addEventListener('pointerdown', (e) => {
  const target = e.target as Element | null;
  const planet = target?.closest<SVGGElement>('.jplanet');
  if (planet?.ownerSVGElement) {
    const svg = planet.ownerSVGElement;
    const b = bodyOf(planet);
    b.moving = false;
    const pt = svgPoint(svg, e);
    drag = {
      b,
      svg,
      start: pt,
      from: { x: b.x, y: b.y },
      last: pt,
      lastT: performance.now(),
      vx: 0,
      vy: 0,
      id: e.pointerId,
      moved: false,
    };
    planet.setPointerCapture(e.pointerId);
    raise(svg);
    planet.classList.add('dragging');
    document.documentElement.classList.add('dragging');
    e.preventDefault();
    return;
  }
  const glowing = target?.closest<SVGGElement>('.sun, .glyphbtn');
  if (glowing?.ownerSVGElement) flare(glowing, svgPoint(glowing.ownerSVGElement, e));
});
document.addEventListener('pointermove', (e) => {
  if (!drag || e.pointerId !== drag.id) return;
  const pt = svgPoint(drag.svg, e);
  const dx = pt.x - drag.start.x;
  const dy = pt.y - drag.start.y;
  if (Math.hypot(dx, dy) > 3) drag.moved = true;
  const now = performance.now();
  const dt = Math.max(1, now - drag.lastT) / 1000;
  drag.vx = 0.7 * drag.vx + 0.3 * ((pt.x - drag.last.x) / dt);
  drag.vy = 0.7 * drag.vy + 0.3 * ((pt.y - drag.last.y) / dt);
  drag.last = pt;
  drag.lastT = now;
  drag.b.x = drag.from.x + dx;
  drag.b.y = drag.from.y + dy;
  place(drag.b);
});
function endDrag(e: PointerEvent) {
  if (!drag || e.pointerId !== drag.id) return;
  const { b } = drag;
  b.g.classList.remove('dragging');
  document.documentElement.classList.remove('dragging');
  b.vx = drag.moved ? drag.vx * 0.2 : 0;
  b.vy = drag.moved ? drag.vy * 0.2 : 0;
  drag = null;
  if (b.x || b.y) spring(b);
  else lower();
}
document.addEventListener('pointerup', endDrag);
document.addEventListener('pointercancel', endDrag);
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const glowing = (e.target as Element | null)?.closest<SVGGElement>('.sun, .glyphbtn');
  if (!glowing) return;
  e.preventDefault();
  flare(glowing, { x: Number(glowing.dataset.cx) - 6, y: Number(glowing.dataset.cy) - 6 });
});

export {};
