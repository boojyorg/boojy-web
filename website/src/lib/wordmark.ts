import glyphData from '../content/glyphs.json';

/**
 * Boojy wordmark geometry, built at compile time from Poppins Medium outlines
 * (`content/glyphs.json`, 100 units = 1em, baseline at y = 0). Drawing the letters as
 * paths means the logo never depends on a web font loading, and building it from parts
 * lets the sun (the second "o") and the grey planet (the dot of the "j") be their own
 * shapes: the sun flares on click, the planet can be dragged. See the Sky Lab brief.
 */
interface Contour {
  d: string;
  bb: [number, number, number, number];
}
interface Word {
  glyphs: { ch: string; contours: Contour[] }[];
  width: number;
}
const G = glyphData as unknown as Record<'Boojy' | 'otes' | 'udio', Word>;

export type AppId = 'notes' | 'audio';

const r2 = (n: number) => Math.round(n * 100) / 100;

/** One path per glyph (its contours together, so holes in B, o, d, e stay open). */
function glyphD(word: keyof typeof G, index: number, skipContour = -1): string {
  const glyph = G[word].glyphs[index];
  if (!glyph) return '';
  return glyph.contours
    .filter((_, i) => i !== skipContour)
    .map((c) => c.d)
    .join('');
}

// The j's dot is its highest contour; the second o's outer contour gives the sun's place.
const jContours = G.Boojy.glyphs[3]?.contours ?? [];
const J_DOT = jContours.reduce(
  (best, c, i) => (c.bb[1] < (jContours[best]?.bb[1] ?? 0) ? i : best),
  0,
);
const o2 = G.Boojy.glyphs[2]?.contours[0]?.bb ?? [130, -56, 187, 1];
const jd = jContours[J_DOT]?.bb ?? [196, -77, 211, -62];

/** The sun (in place of the second "o") and the planet (the j's dot), in glyph units. */
export const SUN = {
  x: (o2[0] + o2[2]) / 2,
  y: (o2[1] + o2[3]) / 2,
  r: ((o2[2] - o2[0]) / 2) * 1.06,
};
export const PLANET = {
  x: (jd[0] + jd[2]) / 2,
  y: (jd[1] + jd[3]) / 2,
  r: ((jd[2] - jd[0]) / 2) * 1.12,
};
export const BOOJY_WIDTH = G.Boojy.width;
/** Cap height of "B", used to size the app glyphs (N, A) to match. */
const CAP = 69.5;
const INK = 'var(--ink)';

/** "Bo · j · y" letters without the sun and the j's dot. */
export function boojyLettersMarkup(): string {
  return `<g fill="${INK}" stroke="${INK}" stroke-width="0.7" stroke-linejoin="round"><path d="${glyphD('Boojy', 0)}"/><path d="${glyphD('Boojy', 1)}"/><path d="${glyphD('Boojy', 3, J_DOT)}"/><path d="${glyphD('Boojy', 4)}"/></g>`;
}

/** The interactive parts: glow, sun (click for a flare) and the draggable planet. */
export function boojyPartsMarkup(): string {
  return `<circle class="halo" cx="${r2(SUN.x)}" cy="${r2(SUN.y)}" r="${r2(SUN.r * 3.4)}" fill="url(#bj-halo)" opacity="0.55"/>
${boojyLettersMarkup()}
<g class="sun" role="button" tabindex="0" aria-label="The sun: click it for a flare" data-cx="${r2(SUN.x)}" data-cy="${r2(SUN.y)}" data-r="${r2(SUN.r)}"><circle class="core" cx="${r2(SUN.x)}" cy="${r2(SUN.y)}" r="${r2(SUN.r)}" fill="url(#bj-sun)"/><circle class="hot" cx="${r2(SUN.x)}" cy="${r2(SUN.y)}" r="0" fill="url(#bj-hot)" opacity="0"/></g>`;
}

export function planetMarkup(): string {
  return `<g class="jplanet" data-rx="${r2(PLANET.x)}" data-ry="${r2(PLANET.y)}" role="button" tabindex="0" aria-label="The planet: drag it" transform="translate(${r2(PLANET.x)} ${r2(PLANET.y)})"><circle r="${r2(PLANET.r * 2.4)}" fill="transparent"/><circle class="pbody" r="${r2(PLANET.r)}" fill="url(#bj-planet)"/></g>`;
}

/**
 * The app glyph (teal N / blue A) plus "otes"/"udio", at the same scale and baseline as
 * "Boojy", starting at x0. `interactive` wraps the glyph so it flares like the sun.
 */
export function appWordMarkup(
  app: AppId,
  x0: number,
  interactive: boolean,
  clipId: string,
): { svg: string; end: number } {
  const notes = app === 'notes';
  const gw = notes ? CAP * (171 / 224) : CAP * (269 / 240);
  const d = notes
    ? `M${r2(x0)} ${-CAP} L${r2(x0 + gw * 0.75)} ${r2(-CAP * 0.29)} L${r2(x0 + gw * 0.75)} ${-CAP} L${r2(x0 + gw)} ${-CAP} L${r2(x0 + gw)} 0 L${r2(x0)} 0 Z`
    : `M${r2(x0 + gw / 2)} ${-CAP} L${r2(x0 + gw)} 0 L${r2(x0)} 0 Z`;
  const fill = notes ? 'var(--notes)' : 'var(--audio)';
  const stroke = notes ? '' : ' stroke="var(--audio)" stroke-width="3" stroke-linejoin="round"';
  let glyph = `<path class="glyph" fill="${fill}"${stroke} d="${d}"/>`;
  if (interactive) {
    const cx = x0 + gw / 2;
    const cy = -CAP * 0.45;
    glyph = `<defs><clipPath id="${clipId}"><path d="${d}"/></clipPath></defs>
<circle class="halo" cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(CAP * 1.5)}" fill="url(#bj-${app}-halo)" opacity="0.55"/>
<g class="glyphbtn" role="button" tabindex="0" aria-label="${notes ? 'N' : 'A'}: click it for a flare" data-cx="${r2(cx)}" data-cy="${r2(cy)}" data-r="${r2(CAP * 0.5)}">${glyph}<circle class="hot" cx="${r2(cx)}" cy="${r2(cy)}" r="0" fill="url(#bj-${app}-hot)" opacity="0" clip-path="url(#${clipId})"/></g>`;
  }
  const word = notes ? 'otes' : 'udio';
  const shift = x0 + gw + (notes ? 3 : -1);
  const letters = G[word].glyphs.map((_, i) => `<path d="${glyphD(word, i)}"/>`).join('');
  return {
    svg: `${glyph}<g transform="translate(${r2(shift)} 0)" fill="${INK}" stroke="${INK}" stroke-width="0.7">${letters}</g>`,
    end: shift + G[word].width,
  };
}

/** Shared gradients for every logo on a page (rendered once, in the layout). */
export const LOGO_DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
<radialGradient id="bj-sun" cx="38%" cy="34%" r="70%"><stop offset="0" stop-color="#ffd35a"/><stop offset="0.55" stop-color="#f8b51e"/><stop offset="1" stop-color="#ef9e12"/></radialGradient>
<radialGradient id="bj-halo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="rgba(255,196,80,0.55)"/><stop offset="0.35" stop-color="rgba(255,170,50,0.18)"/><stop offset="1" stop-color="rgba(255,150,40,0)"/></radialGradient>
<radialGradient id="bj-hot" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fffbe8"/><stop offset="0.45" stop-color="rgba(255,238,170,0.85)"/><stop offset="1" stop-color="rgba(255,214,110,0)"/></radialGradient>
<radialGradient id="bj-planet" cx="35%" cy="32%" r="75%"><stop offset="0" stop-color="#eceef3"/><stop offset="1" stop-color="#aeb2bd"/></radialGradient>
<radialGradient id="bj-notes-halo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="rgba(164,200,204,0.5)"/><stop offset="0.35" stop-color="rgba(143,193,198,0.16)"/><stop offset="1" stop-color="rgba(143,193,198,0)"/></radialGradient>
<radialGradient id="bj-audio-halo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="rgba(60,140,255,0.5)"/><stop offset="0.35" stop-color="rgba(24,124,252,0.16)"/><stop offset="1" stop-color="rgba(24,124,252,0)"/></radialGradient>
<radialGradient id="bj-notes-hot" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#f2fbfc"/><stop offset="0.45" stop-color="rgba(200,236,240,0.85)"/><stop offset="1" stop-color="rgba(164,200,204,0)"/></radialGradient>
<radialGradient id="bj-audio-hot" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#eef5ff"/><stop offset="0.45" stop-color="rgba(150,195,255,0.85)"/><stop offset="1" stop-color="rgba(60,140,255,0)"/></radialGradient>
<radialGradient id="bj-moon-halo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="rgba(225,230,245,0.4)"/><stop offset="0.4" stop-color="rgba(210,218,240,0.12)"/><stop offset="1" stop-color="rgba(200,210,240,0)"/></radialGradient>
</defs></svg>`;
