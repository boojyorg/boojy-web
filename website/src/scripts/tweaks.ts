/**
 * Dev-only tweaks panel for the homepage solar system (loaded by sky.ts in `pnpm dev` only, so
 * it never ships). Ring, glow and speed changes show live; arrival changes show on Replay.
 * Changes are saved in this browser; Copy puts the changed values on the clipboard as JSON.
 */
import { DEFAULTS, STORAGE_KEY, type Tune, tune } from './tune';

type Control =
  | {
      key: keyof Tune;
      label: string;
      kind: 'range';
      min: number;
      max: number;
      step: number;
      unit?: string;
    }
  | { key: keyof Tune; label: string; kind: 'toggle' }
  | { key: keyof Tune; label: string; kind: 'choice'; options: [string, string][] };

const GROUPS: [string, Control[]][] = [
  [
    'Arrival (press Replay)',
    [
      {
        key: 'ringArrival',
        label: 'Rings appear',
        kind: 'choice',
        options: [
          ['in-place', 'In place'],
          ['with-logo', 'Fade with logo'],
          ['after-logo', 'Fade after logo'],
        ],
      },
      {
        key: 'ringFadeMs',
        label: 'Ring fade',
        kind: 'range',
        min: 100,
        max: 2000,
        step: 50,
        unit: 'ms',
      },
      { key: 'rise', label: 'Logo slides up', kind: 'toggle' },
      {
        key: 'riseMs',
        label: 'Slide time',
        kind: 'range',
        min: 200,
        max: 2000,
        step: 50,
        unit: 'ms',
      },
      {
        key: 'riseDistance',
        label: 'Slide distance',
        kind: 'range',
        min: 0,
        max: 60,
        step: 1,
        unit: 'px',
      },
    ],
  ],
  [
    'Rings',
    [
      { key: 'ringAlpha', label: 'Opacity', kind: 'range', min: 0, max: 0.6, step: 0.01 },
      { key: 'ringWidth', label: 'Width', kind: 'range', min: 0.5, max: 3, step: 0.1, unit: 'px' },
    ],
  ],
  [
    'Sun',
    [
      { key: 'glow', label: 'Wide glow', kind: 'range', min: 0, max: 3, step: 0.05 },
      { key: 'halo', label: 'Halo', kind: 'range', min: 0, max: 1.5, step: 0.05 },
      {
        key: 'sunBrightness',
        label: 'Disc brightness',
        kind: 'range',
        min: 0.6,
        max: 1.2,
        step: 0.01,
      },
    ],
  ],
  [
    'Motion',
    [
      {
        key: 'orbitSpeed',
        label: 'Orbit speed',
        kind: 'range',
        min: 0,
        max: 5,
        step: 0.1,
        unit: '×',
      },
      {
        key: 'planetDrop',
        label: 'Dropped planet goes',
        kind: 'choice',
        options: [
          ['pickup', 'Back where it was'],
          ['nearest', 'Nearest on its ring'],
        ],
      },
    ],
  ],
];

const OPEN_KEY = 'boojy-tweaks-open';

function changed(): Partial<Tune> {
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(DEFAULTS) as (keyof Tune)[])
    if (tune[k] !== DEFAULTS[k]) out[k] = tune[k];
  return out as Partial<Tune>;
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(changed()));
  } catch {
    // Storage blocked: the tweak still applies until reload.
  }
}

// The CSS side of the tweaks: the hero's slide-up and the logo's halo and disc.
const css = document.createElement('style');
document.head.appendChild(css);
function applyCss() {
  const rules: string[] = [];
  if (!tune.rise) rules.push('.home-hero .rise { animation: none !important; }');
  else if (tune.riseMs !== DEFAULTS.riseMs || tune.riseDistance !== DEFAULTS.riseDistance)
    rules.push(
      `@keyframes tweak-rise { from { opacity: 0; transform: translateY(${tune.riseDistance}px); } }`,
      `.home-hero .rise { animation-name: tweak-rise !important; animation-duration: ${tune.riseMs}ms !important; }`,
    );
  if (tune.halo !== DEFAULTS.halo) rules.push(`.home-logo .halo { fill-opacity: ${tune.halo}; }`);
  if (tune.sunBrightness !== DEFAULTS.sunBrightness)
    rules.push(`.home-logo .sun { filter: brightness(${tune.sunBrightness}); }`);
  css.textContent = rules.join('\n');
}

/** Plays the hero's arrival again, with the sky arriving the current way too. */
function replay() {
  applyCss();
  for (const el of document.querySelectorAll<HTMLElement>('.home-hero .rise')) {
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = '';
  }
  window.dispatchEvent(new Event('boojy:replay'));
}

const fmt = (c: Control & { kind: 'range' }, v: number) =>
  `${c.step < 1 ? v.toFixed(2) : v}${c.unit ?? ''}`;

const panel = document.createElement('aside');
panel.className = 'dev-tweaks';
panel.setAttribute('aria-label', 'Dev tweaks');
const style = document.createElement('style');
style.textContent = `
.dev-tweaks { position: fixed; right: 16px; bottom: 16px; z-index: 10000; width: 270px;
  max-height: calc(100vh - 32px); overflow: auto; padding: 10px 12px 12px; border-radius: 12px;
  background: rgba(12, 14, 22, 0.94); border: 1px solid rgba(255, 255, 255, 0.12);
  color: #e8eaf0; font: 12px/1.4 system-ui, sans-serif; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5); }
.dev-tweaks.closed { width: auto; padding: 0; }
.dev-tweaks.closed .dt-body { display: none; }
.dev-tweaks button { font: inherit; color: inherit; cursor: pointer; border-radius: 6px;
  background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.14); padding: 4px 8px; }
.dev-tweaks button:hover { background: rgba(255, 255, 255, 0.16); }
.dev-tweaks .dt-toggle { width: 100%; text-align: left; border: 0; background: none; font-weight: 600; padding: 4px 2px; }
.dev-tweaks.closed .dt-toggle { padding: 8px 12px; }
.dev-tweaks h3 { margin: 12px 0 4px; font-size: 11px; font-weight: 600; color: #9aa0b4; }
.dev-tweaks .dt-row { display: grid; grid-template-columns: 1fr auto; gap: 2px 8px; margin: 6px 0; align-items: center; }
.dev-tweaks .dt-row input[type=range] { grid-column: 1 / -1; width: 100%; accent-color: #f8b51e; margin: 0; }
.dev-tweaks .dt-row output { color: #9aa0b4; font-variant-numeric: tabular-nums; }
.dev-tweaks .dt-row.changed > span { color: #f8b51e; }
.dev-tweaks select { font: inherit; color: inherit; background: #1b1e2a; border: 1px solid rgba(255, 255, 255, 0.14); border-radius: 6px; padding: 2px 4px; }
.dev-tweaks .dt-actions { display: flex; gap: 6px; margin-top: 12px; }
.dev-tweaks .dt-note { margin-top: 8px; color: #9aa0b4; min-height: 1em; }
`;
document.head.appendChild(style);

const toggle = document.createElement('button');
toggle.className = 'dt-toggle';
toggle.type = 'button';
const body = document.createElement('div');
body.className = 'dt-body';
panel.append(toggle, body);

function setOpen(open: boolean) {
  panel.classList.toggle('closed', !open);
  toggle.textContent = open ? 'Tweaks ▾' : 'Tweaks ▸';
  try {
    localStorage.setItem(OPEN_KEY, open ? '1' : '0');
  } catch {}
}
toggle.addEventListener('click', () => setOpen(panel.classList.contains('closed')));

const refreshers: (() => void)[] = [];
for (const [title, controls] of GROUPS) {
  const h = document.createElement('h3');
  h.textContent = title;
  body.appendChild(h);
  for (const c of controls) {
    const row = document.createElement('label');
    row.className = 'dt-row';
    const name = document.createElement('span');
    name.textContent = c.label;
    row.appendChild(name);
    const mark = () => row.classList.toggle('changed', tune[c.key] !== DEFAULTS[c.key]);
    const set = (v: unknown) => {
      (tune as Record<string, unknown>)[c.key] = v;
      mark();
      save();
      applyCss();
    };
    if (c.kind === 'range') {
      const out = document.createElement('output');
      const input = document.createElement('input');
      input.type = 'range';
      input.min = String(c.min);
      input.max = String(c.max);
      input.step = String(c.step);
      input.addEventListener('input', () => {
        set(Number(input.value));
        out.textContent = fmt(c, Number(input.value));
      });
      row.append(out, input);
      refreshers.push(() => {
        input.value = String(tune[c.key]);
        out.textContent = fmt(c, tune[c.key] as number);
        mark();
      });
    } else if (c.kind === 'toggle') {
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.addEventListener('change', () => set(input.checked));
      row.appendChild(input);
      refreshers.push(() => {
        input.checked = Boolean(tune[c.key]);
        mark();
      });
    } else {
      const select = document.createElement('select');
      for (const [value, text] of c.options) select.add(new Option(text, value));
      select.addEventListener('change', () => set(select.value));
      row.appendChild(select);
      refreshers.push(() => {
        select.value = String(tune[c.key]);
        mark();
      });
    }
    body.appendChild(row);
  }
}

const actions = document.createElement('div');
actions.className = 'dt-actions';
const note = document.createElement('div');
note.className = 'dt-note';
const button = (text: string, onClick: () => void) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = text;
  b.addEventListener('click', onClick);
  actions.appendChild(b);
};
button('Replay', replay);
button('Reset', () => {
  Object.assign(tune, DEFAULTS);
  save();
  for (const r of refreshers) r();
  replay();
  note.textContent = 'Back to the defaults.';
});
button('Copy values', () => {
  const text = JSON.stringify(changed(), null, 2);
  navigator.clipboard.writeText(text).then(
    () => {
      note.textContent =
        text === '{}' ? 'Nothing changed from the defaults.' : 'Copied the changed values.';
    },
    () => {
      note.textContent = "Couldn't copy. Changed values are in the console.";
      console.log(text);
    },
  );
});
body.append(actions, note);

// Keep clicks on the panel from starting a planet drag underneath it.
panel.addEventListener('pointerdown', (e) => e.stopPropagation());

for (const r of refreshers) r();
let startOpen = true;
try {
  startOpen = localStorage.getItem(OPEN_KEY) !== '0';
} catch {}
setOpen(startOpen);
document.body.appendChild(panel);
// Saved arrival tweaks: the first arrival ran before this panel loaded, so play it again.
const ARRIVAL: (keyof Tune)[] = ['ringArrival', 'ringFadeMs', 'rise', 'riseMs', 'riseDistance'];
if (ARRIVAL.some((k) => tune[k] !== DEFAULTS[k])) replay();
else applyCss();
