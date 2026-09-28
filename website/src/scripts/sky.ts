/**
 * The sky behind every page (see components/Sky.astro): stars with a slow parallax, rare
 * shooting stars, and on the homepage the solar system around the logo's sun — rings,
 * an asteroid belt and eight planets you can drag (let go and they bounce back onto the
 * nearest point of their orbit).
 *
 * Performance rules, learned in the Sky Lab (docs/BACKLOG.md):
 * - Anything static is drawn once and slid into place: the rings and the sun's wide glow
 *   live in a tall stored image covering the whole page, rebuilt only when the page size
 *   or the window changes. Never redraw a blurred/glowing shape every frame.
 * - At most 60 frames a second (120Hz screens would otherwise double the work).
 * - Layout (getBoundingClientRect, scrollHeight) is read on load/resize, never per frame.
 * - Reduced motion: no orbits, twinkle, shooting stars or springs.
 */

type Page = 'home' | 'notes' | 'audio' | 'lost' | 'other';

const root = document.querySelector<HTMLElement>('.sky');
const starsEl = document.getElementById('sky-stars') as HTMLCanvasElement | null;
const ringsEl = document.getElementById('sky-rings') as HTMLCanvasElement | null;
const systemEl = document.getElementById('sky-system') as HTMLCanvasElement | null;
const liftEl = document.getElementById('sky-lift') as HTMLCanvasElement | null;
const fx = document.getElementById('sky-fx');

if (root && starsEl && ringsEl && systemEl && liftEl && fx)
  start(root, starsEl, ringsEl, systemEl, liftEl, fx);

function start(
  root: HTMLElement,
  starsEl: HTMLCanvasElement,
  ringsEl: HTMLCanvasElement,
  systemEl: HTMLCanvasElement,
  liftEl: HTMLCanvasElement,
  fx: HTMLElement,
) {
  const page = (root.dataset.page ?? 'other') as Page;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sctx = starsEl.getContext('2d');
  const rctx = ringsEl.getContext('2d');
  const yctx = systemEl.getContext('2d');
  const lctx = liftEl.getContext('2d');
  if (!sctx || !rctx || !yctx || !lctx) return;

  let W = 0;
  let H = 0;
  let dpr = 1;

  /* ---------- helpers ---------- */
  const rng = (seed: number) => () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const hexRgb = (hex: string): [number, number, number] => {
    const n = Number.parseInt(hex.slice(1), 16);
    return [n >> 16, (n >> 8) & 255, n & 255];
  };
  const rgba = (hex: string, a: number) => {
    const [r, g, b] = hexRgb(hex);
    return `rgba(${r},${g},${b},${a})`;
  };
  const shade = (hex: string, amt: number) => {
    const [r, g, b] = hexRgb(hex);
    const c = (v: number) => Math.max(0, Math.min(255, v + amt));
    return `rgb(${c(r)},${c(g)},${c(b)})`;
  };
  /** Colour strength: push a colour away from grey (the Sky Lab's 115%). */
  const tone = (hex: string, k = 1.15) => {
    const [r, g, b] = hexRgb(hex);
    const grey = 0.3 * r + 0.59 * g + 0.11 * b;
    const f = (v: number) => Math.max(0, Math.min(255, Math.round(grey + (v - grey) * k)));
    return `#${[f(r), f(g), f(b)].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
  };

  /* ---------- stars (soft style: brighter stars fade smoothly outwards) ---------- */
  interface Star {
    x: number;
    y: number;
    r: number;
    a: number;
    speed: number;
    cyc: number;
    ph: number;
    c: string;
  }
  const TEMPS = [
    '#ffffff',
    '#ffffff',
    '#ffffff',
    '#e4ecff',
    '#d6e2ff',
    '#fff3de',
    '#ffe6c4',
    '#ffdca8',
    '#ffe9b8',
  ];
  let stars: Star[] = [];
  let haze: HTMLCanvasElement | null = null;
  const soft = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const x = c.getContext('2d');
    if (x) {
      const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
      for (const [o, a] of [
        [0, 1],
        [0.06, 0.75],
        [0.14, 0.42],
        [0.26, 0.2],
        [0.42, 0.08],
        [0.65, 0.025],
        [1, 0],
      ] as const)
        g.addColorStop(o, `rgba(255,255,255,${a})`);
      x.fillStyle = g;
      x.fillRect(0, 0, 128, 128);
    }
    return c;
  })();
  function makeStars() {
    const rand = rng(1337);
    const field = H * 3;
    const area = (W * H) / (1000 * 700);
    const n = Math.round(2100 * Math.min(area, 2.2));
    stars = [];
    for (let i = 0; i < n; i++) {
      let x = rand() * W;
      let y = rand() * field;
      if (rand() < 0.35) {
        const t = rand() * 1.4 - 0.2;
        const off = ((rand() + rand() + rand()) / 1.5 - 1) * H * 0.18;
        x = t * W;
        y = (0.9 - t * 0.5) * H + off + Math.floor(rand() * 3) * H;
      }
      const m = rand() ** 3.2;
      const r = 0.25 + m * 2.0;
      stars.push({
        x,
        y,
        r,
        a: 0.25 + Math.min(0.75, m * 1.4 + rand() * 0.35),
        speed: r < 0.6 ? 0.03 : r < 1.2 ? 0.09 : 0.18,
        cyc: 5000 + rand() * 24000,
        ph: rand() * 6.28,
        c: TEMPS[Math.floor(rand() * TEMPS.length)] ?? '#ffffff',
      });
    }
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.ceil(W));
    c.height = Math.max(1, Math.ceil(H * 1.6));
    const x = c.getContext('2d');
    if (x) {
      const r2 = rng(7);
      x.translate(c.width / 2, c.height / 2);
      x.rotate(-0.42);
      const g = x.createLinearGradient(0, -c.height * 0.16, 0, c.height * 0.16);
      g.addColorStop(0, 'rgba(180,190,255,0)');
      g.addColorStop(0.5, 'rgba(190,195,255,0.06)');
      g.addColorStop(1, 'rgba(180,190,255,0)');
      x.fillStyle = g;
      x.fillRect(-c.width, -c.height * 0.16, c.width * 2, c.height * 0.32);
      for (let i = 0; i < 3200; i++) {
        const off = ((r2() + r2() + r2()) / 1.5 - 1) * c.height * 0.13;
        x.fillStyle = `rgba(230,232,255,${0.06 + r2() * 0.2})`;
        x.fillRect((r2() - 0.5) * c.width * 2, off, 0.7, 0.7);
      }
    }
    haze = c;
  }
  function drawStars(ctx: CanvasRenderingContext2D, time: number, scroll: number) {
    ctx.clearRect(0, 0, W, H);
    const field = H * 3;
    if (haze) ctx.drawImage(haze, 0, -H * 0.3 - scroll * 0.02, W, H * 1.6);
    for (const s of stars) {
      let y = (s.y - scroll * s.speed) % field;
      if (y < 0) y += field;
      if (y > H + 10) continue;
      const tw = reduceMotion ? 0.6 : (Math.sin((time / s.cyc) * 6.28 + s.ph) + 1) / 2;
      const a = Math.min(1, s.a * (0.55 + tw * 0.45));
      if (s.r > 1.3) {
        const h = s.r * 6.5;
        ctx.globalAlpha = a * 0.6;
        ctx.drawImage(soft, s.x - h, y - h, h * 2, h * 2);
      }
      ctx.globalAlpha = a;
      ctx.fillStyle = s.c;
      ctx.beginPath();
      ctx.arc(s.x, y, s.r * 0.8, 0, 6.2832);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  /* ---------- the solar system (homepage only) ---------- */
  interface Mark {
    lon: number;
    lat: number;
    w: number;
    h: number;
    c: string;
  }
  interface Planet {
    f: number;
    r: number;
    c: string;
    kind: 'rock' | 'earth' | 'gas' | 'ice';
    day: number;
    tilt: number;
    ring?: boolean;
    bands?: [number, number, string][];
    marks: Mark[];
  }
  const PLANETS: Planet[] = [
    { f: 1.0, r: 4.5, c: '#cdd0d8', kind: 'rock', day: 26000, tilt: 0.03, marks: [] }, // Mercury: the same grey as the dot on the j
    {
      f: 1.54,
      r: 7,
      c: '#f2b544',
      kind: 'rock',
      day: 34000,
      tilt: 0.05,
      marks: [
        { lon: 0.2, lat: 0.12, w: 0.5, h: 0.16, c: '#f7c868' },
        { lon: 0.7, lat: -0.35, w: 0.4, h: 0.14, c: '#de9f36' },
      ],
    },
    {
      f: 2.14,
      r: 7.5,
      c: '#2f7bff',
      kind: 'earth',
      day: 18000,
      tilt: 0.41,
      marks: [
        { lon: 0.0, lat: -0.1, w: 0.78, h: 0.7, c: '#3fbf6a' },
        { lon: 0.45, lat: 0.22, w: 0.72, h: 0.62, c: '#3fbf6a' },
        { lon: 0.74, lat: -0.42, w: 0.46, h: 0.36, c: '#3fbf6a' },
      ],
    },
    {
      f: 3.1,
      r: 5.5,
      c: '#e5533d',
      kind: 'rock',
      day: 20000,
      tilt: 0.44,
      marks: [
        { lon: 0.25, lat: 0.1, w: 0.55, h: 0.4, c: '#cc4633' },
        { lon: 0.7, lat: -0.2, w: 0.45, h: 0.35, c: '#d24b37' },
      ],
    },
    {
      f: 5.8,
      r: 16,
      c: '#e8a04a',
      kind: 'gas',
      day: 14000,
      tilt: 0.05,
      bands: [[0.22, 0.12, '#f2bd72']],
      marks: [
        { lon: 0.35, lat: 0.4, w: 0.14, h: 0.08, c: '#c9603f' },
        { lon: 0.68, lat: -0.18, w: 0.12, h: 0.07, c: '#bd7338' },
        { lon: 0.05, lat: 0.02, w: 0.1, h: 0.06, c: '#cf8845' },
        { lon: 0.85, lat: 0.5, w: 0.09, h: 0.05, c: '#c46d3a' },
      ],
    },
    {
      f: 8.2,
      r: 13,
      c: '#efc46a',
      kind: 'gas',
      day: 16000,
      tilt: 0.42,
      ring: true,
      bands: [[0.2, 0.12, '#f8da92']],
      marks: [],
    },
    {
      f: 10.84,
      r: 10,
      c: '#8fc1c6',
      kind: 'ice',
      day: 22000,
      tilt: 1.4,
      marks: [
        { lon: 0.2, lat: 0.22, w: 0.32, h: 0.22, c: '#b3dde1' },
        { lon: 0.65, lat: -0.3, w: 0.26, h: 0.18, c: '#a6d3d8' },
      ],
    }, // Uranus, on its side
    {
      f: 13.48,
      r: 10,
      c: '#187cfc',
      kind: 'ice',
      day: 20000,
      tilt: 0.49,
      marks: [{ lon: 0.4, lat: 0.25, w: 0.22, h: 0.13, c: '#0d5fd6' }],
    },
  ];
  // Soft spectrum, warm near the sun to cool further out (the Sky Lab pick), at 30%.
  const RING_COLOURS = [
    '#ffd98a',
    '#ffbf94',
    '#ffa6c4',
    '#e7a8ff',
    '#c3adff',
    '#a9b8ff',
    '#9ed2ff',
    '#98e6ec',
  ];
  const RING_ALPHA = 0.3;
  const BELT_F = 4.3;
  const SQUASH = 0.4;
  const TILT = -0.14;
  const RING_TINT = '#f3e7c9';
  const PLANET_SIZE = 1.1;
  const GLOW = 1.8;

  interface Body {
    ox: number;
    oy: number;
    vx: number;
    vy: number;
    drag: boolean;
    px: number;
    py: number;
    sx: number;
    sy: number;
    r: number;
    phase: number;
    relT: number;
  }
  const bodies: Body[] = PLANETS.map(() => ({
    ox: 0,
    oy: 0,
    vx: 0,
    vy: 0,
    drag: false,
    px: 0,
    py: 0,
    sx: -999,
    sy: -999,
    r: 0,
    phase: 0,
    relT: 0,
  }));
  interface Rock {
    a: number;
    off: number;
    s: number;
    sp: number;
    rot: number;
    spin: number;
    c: string;
    verts: [number, number][];
  }
  let rocks: Rock[] = [];
  const ROCK_COLOURS = [
    '#77716c',
    '#847d77',
    '#918982',
    '#8c7563',
    '#7d6554',
    '#9b9086',
    '#68625e',
  ];
  function makeRocks() {
    const br = rng(99);
    rocks = Array.from({ length: 560 }, () => {
      const n = 5 + Math.floor(br() * 3);
      const verts: [number, number][] = [];
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const rr = 0.62 + br() * 0.5;
        verts.push([Math.cos(a) * rr, Math.sin(a) * rr]);
      }
      return {
        a: br() * Math.PI * 2,
        off: (br() + br() + br()) / 1.5 - 1,
        s: 1.2 + br() ** 2.2 * 3.2,
        sp: 0.9 + br() * 0.2,
        rot: br() * 6.28,
        spin: (br() - 0.5) * 0.6,
        c: ROCK_COLOURS[Math.floor(br() * ROCK_COLOURS.length)] ?? '#848080',
        verts,
      };
    }).sort((p, q) => (p.c < q.c ? -1 : 1));
  }

  // Where the logo's sun is (page coordinates) and how tall the page is: measured on load,
  // on resize and once after the arrival animation — never per frame.
  interface SunInfo {
    x: number;
    y0: number;
    logoW: number;
    maxScroll: number;
  }
  let sun: SunInfo | null = null;
  function measureSun() {
    const core = document.querySelector<SVGCircleElement>('svg[data-system] .core');
    const logo = core?.ownerSVGElement;
    if (!core || !logo) {
      sun = null;
      return;
    }
    const cr = core.getBoundingClientRect();
    sun = {
      x: cr.left + cr.width / 2,
      y0: cr.top + cr.height / 2 + window.scrollY,
      logoW: logo.getBoundingClientRect().width,
      maxScroll: Math.max(0, document.documentElement.scrollHeight - window.innerHeight) + 120,
    };
  }

  // Rings + wide glow, drawn once into tall images covering the page's whole scroll range.
  let cache: {
    key: string;
    glow: HTMLCanvasElement;
    rings: HTMLCanvasElement;
    yS: number;
    h: number;
  } | null = null;
  function buildCache(s: SunInfo, inner: number, key: string) {
    const pad = 40;
    const h = H + s.maxScroll + pad * 2;
    let cs = Math.min(dpr, 1.5);
    if (h * cs > 12000) cs = 12000 / h; // stay inside browsers' canvas limits on very long pages
    const make = () => {
      const c = document.createElement('canvas');
      c.width = Math.ceil(W * cs);
      c.height = Math.ceil(h * cs);
      const x = c.getContext('2d');
      x?.setTransform(cs, 0, 0, cs, 0, 0);
      return [c, x] as const;
    };
    const [gc, gx] = make();
    const [rc, rx] = make();
    const yS = s.y0 + pad;
    if (gx) {
      const glowR = Math.max(s.logoW * 1.35, 380);
      gx.save();
      gx.translate(s.x, yS);
      gx.scale(1.9, 1);
      const ng = gx.createRadialGradient(0, 0, 0, 0, 0, glowR);
      ng.addColorStop(0, `rgba(255,186,80,${Math.min(0.55, 0.13 * GLOW)})`);
      ng.addColorStop(0.2, `rgba(250,150,90,${Math.min(0.32, 0.07 * GLOW)})`);
      ng.addColorStop(0.55, `rgba(110,110,220,${0.06 * Math.min(GLOW, 1.5)})`);
      ng.addColorStop(1, 'rgba(60,70,160,0)');
      gx.fillStyle = ng;
      gx.fillRect(-glowR, -glowR, glowR * 2, glowR * 2);
      gx.restore();
    }
    if (rx) {
      // Plain lines, fading with distance from the sun: inner rings clearest, outer rings quiet.
      rx.save();
      rx.translate(s.x, yS);
      rx.rotate(TILT);
      PLANETS.forEach((p, i) => {
        const r = inner * p.f;
        rx.strokeStyle = RING_COLOURS[i] ?? '#ffffff';
        rx.globalAlpha = RING_ALPHA * (1 - 0.55 * (i / (PLANETS.length - 1)));
        rx.lineWidth = 1.3;
        rx.beginPath();
        rx.ellipse(0, 0, r, r * SQUASH, 0, 0, Math.PI * 2);
        rx.stroke();
      });
      rx.restore();
    }
    cache = { key, glow: gc, rings: rc, yS, h };
  }

  // Each planet is painted on a scratch canvas: a smooth disc, then its markings on top of
  // the disc only (so the edge stays smooth), shaded like the logo's sun.
  const scratch = document.createElement('canvas');
  scratch.width = scratch.height = 320;
  const scx = scratch.getContext('2d');
  function drawPlanet(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    r: number,
    p: Planet,
    t: number,
    open: number,
  ) {
    if (!scx) return;
    const gassy = p.kind === 'gas' || p.kind === 'ice';
    const col = tone(p.c);
    const hr = r * (gassy ? 2.6 : 2.0);
    const ha = gassy ? 0.17 : 0.09;
    const h = ctx.createRadialGradient(x, y, r * 1.02, x, y, hr);
    h.addColorStop(0, rgba(col, ha));
    h.addColorStop(1, rgba(col, 0));
    ctx.fillStyle = h;
    ctx.beginPath();
    ctx.arc(x, y, hr, 0, Math.PI * 2);
    ctx.fill();
    const ringRy = r * (0.12 + 0.62 * open);
    const ringHalf = (from: number, to: number, a: number) => {
      ctx.lineCap = 'round';
      ctx.strokeStyle = rgba(RING_TINT, a);
      ctx.lineWidth = Math.max(1.2, r * 0.2);
      ctx.beginPath();
      ctx.ellipse(x, y, r * 2.15, ringRy, p.tilt, from, to);
      ctx.stroke();
      ctx.strokeStyle = rgba(RING_TINT, a * 0.5);
      ctx.lineWidth = Math.max(0.8, r * 0.1);
      ctx.beginPath();
      ctx.ellipse(x, y, r * 2.15 * 0.78, ringRy * 0.78, p.tilt, from, to);
      ctx.stroke();
    };
    if (p.ring) ringHalf(Math.PI, Math.PI * 2, 0.7);
    const scale = Math.max(1, ctx.getTransform().a);
    const S = Math.min(320, Math.ceil((r + 1.5) * 2 * scale));
    const half = S / 2;
    scx.setTransform(1, 0, 0, 1, 0, 0);
    scx.clearRect(0, 0, S + 2, S + 2);
    scx.globalCompositeOperation = 'source-over';
    scx.globalAlpha = 1;
    scx.setTransform(scale, 0, 0, scale, half, half);
    const base = scx.createRadialGradient(-r * 0.3, -r * 0.38, 0, 0, 0, r * 1.15);
    base.addColorStop(0, shade(col, 20));
    base.addColorStop(0.6, col);
    base.addColorStop(1, shade(col, -7));
    scx.fillStyle = base;
    scx.beginPath();
    scx.arc(0, 0, r, 0, Math.PI * 2);
    scx.fill();
    scx.globalCompositeOperation = 'source-atop';
    scx.save();
    scx.rotate(p.tilt);
    for (const [lat, hgt, bc] of p.bands ?? []) {
      scx.fillStyle = rgba(tone(bc), 0.45);
      scx.fillRect(-r * 1.3, lat * r - hgt * r, r * 2.6, hgt * r * 2);
    }
    const turn = (t / p.day) % 1;
    for (const m of p.marks) {
      const th = ((m.lon + turn) % 1) * Math.PI * 2 - Math.PI;
      const cz = Math.cos(th);
      if (cz <= 0.02) continue;
      scx.globalAlpha = Math.min(1, cz * 1.5);
      scx.fillStyle = tone(m.c);
      scx.beginPath();
      scx.ellipse(Math.sin(th) * r * 0.95, m.lat * r, m.w * r * cz, m.h * r, 0, 0, Math.PI * 2);
      scx.fill();
    }
    scx.restore();
    scx.globalAlpha = 1;
    scx.globalCompositeOperation = 'source-over';
    ctx.drawImage(scratch, 0, 0, S, S, x - half / scale, y - half / scale, S / scale, S / scale);
    if (p.ring) ringHalf(0, Math.PI, 0.9);
  }

  let simTime = 0;
  let geom: { cx: number; cy: number; inner: number; cosT: number; sinT: number } | null = null;
  const orbitAngle = (i: number) => {
    const p = PLANETS[i];
    const b = bodies[i];
    if (!p || !b) return 0;
    return i * 1.9 + 0.8 + b.phase + (simTime / (50000 * p.f ** 0.65)) * Math.PI * 2;
  };
  const orbitPoint = (i: number, a: number) => {
    const g = geom;
    const p = PLANETS[i];
    if (!g || !p) return { x: -999, y: -999 };
    const rx = g.inner * p.f;
    const lx = Math.cos(a) * rx;
    const ly = Math.sin(a) * rx * SQUASH;
    return { x: g.cx + lx * g.cosT - ly * g.sinT, y: g.cy + lx * g.sinT + ly * g.cosT };
  };

  function drawSystem(dt: number, scroll: number) {
    if (!rctx || !yctx || !lctx || !sctx) return;
    rctx.clearRect(0, 0, W, H);
    yctx.clearRect(0, 0, W, H);
    lctx.clearRect(0, 0, W, H);
    if (page !== 'home' || !sun) return;
    const s = sun;
    const cy = s.y0 - scroll;
    const inner = Math.max(s.logoW * 0.7, 120);
    geom = { cx: s.x, cy, inner, cosT: Math.cos(TILT), sinT: Math.sin(TILT) };
    const key = [
      Math.round(s.x / 4),
      Math.round(inner / 4),
      Math.round(W),
      Math.round(H),
      dpr,
      Math.round(s.maxScroll / 16),
      Math.round(s.y0 / 8),
    ].join('|');
    if (!cache || cache.key !== key) buildCache(s, inner, key);
    if (!cache) return;
    // Glow on the stars layer (behind the rings), rings on their own layer.
    sctx.drawImage(cache.glow, 0, cy - cache.yS, W, cache.h);
    const core = sctx.createRadialGradient(s.x, cy, 0, s.x, cy, s.logoW * 0.55);
    core.addColorStop(0, `rgba(255,200,105,${Math.min(0.55, 0.15 * GLOW)})`);
    core.addColorStop(1, 'rgba(255,180,80,0)');
    sctx.fillStyle = core;
    sctx.fillRect(s.x - s.logoW * 0.55, cy - s.logoW * 0.55, s.logoW * 1.1, s.logoW * 1.1);
    rctx.drawImage(cache.rings, 0, cy - cache.yS, W, cache.h);
    // The asteroid belt turns, so it stays live: one transform per rock, off-screen rocks skipped.
    const g = geom;
    const mid = inner * BELT_F;
    const width = inner * 0.34;
    const spinT = simTime * 0.0004;
    const turnA = (simTime / 300000) * Math.PI * 2;
    let lastC = '';
    yctx.globalAlpha = 0.9;
    for (const b of rocks) {
      const a = b.a + turnA * b.sp;
      const rr = mid + b.off * width;
      const px = Math.cos(a) * rr;
      const py = Math.sin(a) * rr * SQUASH;
      const sx = g.cx + g.cosT * px - g.sinT * py;
      const sy = g.cy + g.sinT * px + g.cosT * py;
      if (sx < -10 || sx > W + 10 || sy < -10 || sy > H + 10) continue;
      const ang = TILT + b.rot + spinT * b.spin;
      const k = dpr * b.s * (inner / 300);
      const co = Math.cos(ang) * Math.max(k, dpr * 0.8);
      const si = Math.sin(ang) * Math.max(k, dpr * 0.8);
      if (b.c !== lastC) {
        yctx.fillStyle = b.c;
        lastC = b.c;
      }
      yctx.setTransform(co, si, -si, co, dpr * sx, dpr * sy);
      yctx.beginPath();
      const [first, ...rest] = b.verts;
      if (!first) continue;
      yctx.moveTo(first[0], first[1]);
      for (const [vx, vy] of rest) yctx.lineTo(vx, vy);
      yctx.closePath();
      yctx.fill();
    }
    yctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    yctx.globalAlpha = 1;
    // Planets: in front of their rings (a small gap is cut in the ring line), pulled back by
    // gentle gravity with a small settle; a dragged or gliding planet rides above the page.
    const now = performance.now();
    const scaleR = Math.min(1, inner / 300);
    PLANETS.forEach((p, i) => {
      const b = bodies[i];
      if (!b) return;
      const a = orbitAngle(i);
      const o = orbitPoint(i, a);
      if (b.drag) {
        b.ox = b.px - o.x;
        b.oy = b.py - o.y;
      } else if (b.ox || b.oy) {
        if (reduceMotion) {
          b.ox = b.oy = 0;
        } else {
          const since = (now - b.relT) / 1000;
          const ramp = Math.min(1, (since / 0.35) ** 2);
          const kk = 12 + 248 * ramp;
          const c = 1.05 * Math.sqrt(kk);
          b.vx += (-kk * b.ox - c * b.vx) * dt;
          b.vy += (-kk * b.oy - c * b.vy) * dt;
          b.ox += b.vx * dt;
          b.oy += b.vy * dt;
          if (since > 0.3 && Math.hypot(b.ox, b.oy) < 0.1 && Math.hypot(b.vx, b.vy) < 1)
            b.ox = b.oy = b.vx = b.vy = 0;
        }
      }
      b.r = p.r * PLANET_SIZE * Math.max(0.7, scaleR);
      b.sx = o.x + b.ox;
      b.sy = o.y + b.oy;
      if (b.sy < -60 || b.sy > H + 60) return;
      const lifted = b.drag || Math.hypot(b.ox, b.oy) > 0.5;
      if (!lifted) {
        rctx.save();
        rctx.globalCompositeOperation = 'destination-out';
        rctx.beginPath();
        rctx.arc(b.sx, b.sy, b.r + 2, 0, Math.PI * 2);
        rctx.fill();
        rctx.restore();
      }
      drawPlanet(lifted ? lctx : yctx, b.sx, b.sy, b.r, p, simTime, Math.abs(Math.sin(a)));
    });
  }

  /* ---------- dragging planets (mouse and pen; touch keeps scrolling the page) ---------- */
  const INTERACTIVE =
    'a, button, input, textarea, select, [role="button"], [role="link"], .app, .about, .desc, .tile, .shotwrap, .site-nav, .site-foot';
  const hitPlanet = (x: number, y: number) => {
    for (let i = bodies.length - 1; i >= 0; i--) {
      const b = bodies[i];
      if (b && Math.hypot(x - b.sx, y - b.sy) < b.r + 8) return i;
    }
    return -1;
  };
  let drag: {
    i: number;
    last: { x: number; y: number };
    lastT: number;
    vx: number;
    vy: number;
    id: number;
  } | null = null;
  if (page === 'home') {
    window.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch' || e.button !== 0) return;
      const target = e.target as Element | null;
      if (target?.closest(INTERACTIVE) || target?.closest('.jplanet')) return;
      const i = hitPlanet(e.clientX, e.clientY);
      const b = bodies[i];
      if (!b) return;
      b.drag = true;
      b.px = e.clientX;
      b.py = e.clientY;
      drag = {
        i,
        last: { x: e.clientX, y: e.clientY },
        lastT: performance.now(),
        vx: 0,
        vy: 0,
        id: e.pointerId,
      };
      document.documentElement.classList.add('dragging');
      window.getSelection()?.removeAllRanges();
      e.preventDefault();
    });
    window.addEventListener('pointermove', (e) => {
      if (!drag) {
        if (e.pointerType !== 'touch') {
          const target = e.target as Element | null;
          const over = !target?.closest(INTERACTIVE) && hitPlanet(e.clientX, e.clientY) >= 0;
          document.documentElement.style.cursor = over ? 'grab' : '';
        }
        return;
      }
      if (e.pointerId !== drag.id) return;
      const b = bodies[drag.i];
      if (!b) return;
      b.px = e.clientX;
      b.py = e.clientY;
      document.documentElement.style.cursor = 'grabbing';
    });
    const end = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const i = drag.i;
      const b = bodies[i];
      drag = null;
      document.documentElement.classList.remove('dragging');
      document.documentElement.style.cursor = '';
      const g = geom;
      if (!b || !g) return;
      b.drag = false;
      // Let go: glide to the nearest point on its own ring and carry on orbiting from there.
      const dx = b.sx - g.cx;
      const dy = b.sy - g.cy;
      const lx = dx * g.cosT + dy * g.sinT;
      const ly = -dx * g.sinT + dy * g.cosT;
      b.phase += Math.atan2(ly / SQUASH, lx) - orbitAngle(i);
      const o = orbitPoint(i, orbitAngle(i));
      b.ox = b.sx - o.x;
      b.oy = b.sy - o.y;
      b.vx = b.vy = 0;
      b.relT = performance.now();
    };
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    window.addEventListener('selectstart', (e) => {
      if (drag) e.preventDefault();
    });
  }

  /* ---------- shooting stars: rare, and only while the tab is visible ---------- */
  let shootTimer = 0;
  function shootingStar() {
    const el = document.createElement('div');
    el.className = 'shoot';
    el.style.left = `${Math.random() * W * 0.6}px`;
    el.style.top = `${Math.random() * H * 0.35}px`;
    fx.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
  function scheduleShoot() {
    window.clearTimeout(shootTimer);
    if (reduceMotion) return;
    shootTimer = window.setTimeout(
      () => {
        if (!document.hidden) shootingStar();
        scheduleShoot();
      },
      12000 + Math.random() * 8000,
    );
  }
  document.addEventListener('visibilitychange', () => {
    window.clearTimeout(shootTimer);
    if (!document.hidden) scheduleShoot();
  });

  /* ---------- size, loop ---------- */
  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    for (const [c, x] of [
      [starsEl, sctx],
      [ringsEl, rctx],
      [systemEl, yctx],
      [liftEl, lctx],
    ] as const) {
      c.width = Math.round(W * dpr);
      c.height = Math.round(H * dpr);
      x?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    makeStars();
    measureSun();
    cache = null;
  }
  let resizeTimer = 0;
  let lastW = 0;
  let lastH = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      // Ignore the small height changes of mobile browser bars appearing and hiding.
      if (window.innerWidth === lastW && Math.abs(window.innerHeight - lastH) < 120) return;
      lastW = window.innerWidth;
      lastH = window.innerHeight;
      resize();
    }, 150);
  });

  if (page === 'home') makeRocks();
  resize();
  lastW = W;
  lastH = H;
  // The hero's arrival animation moves the logo for ~1s; measure again once it has settled.
  window.setTimeout(measureSun, 1200);
  window.addEventListener('load', () => window.setTimeout(measureSun, 300));
  scheduleShoot();

  let last = performance.now();
  function frame(now: number) {
    requestAnimationFrame(frame);
    if (now - last < 15.5) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!reduceMotion) simTime += dt * 1000;
    const scroll = window.scrollY;
    if (sctx) drawStars(sctx, now, scroll);
    drawSystem(dt, scroll);
  }
  requestAnimationFrame(frame);
}

export {};
