import '../../src/data/eager.ts';
import '../../src/data/eager-wording.ts';
import { composeCardTexture } from '../../src/presentation/canvas-face.ts';
import { canvasAssetUrls, loadCanvasImages } from '../../src/presentation/canvas-assets.ts';
import { paintRulesLayout } from '../../src/presentation/rules-paint.ts';
import { baseRetroTextLayout } from '../../src/presentation/retro-rules.ts';
import { rulesLayoutRequest, layoutRules } from '../../src/presentation/rules-layout.ts';
import { cropGray } from './pixels-pure.mjs';
import { countLayout } from './abu-count-layout.mjs';
import { JsTextObjective, nativeGrayCrop as grayCrop } from './abu-type-objective.mjs';
const config = await fetch('/__type_kernel/config.json').then((r) => r.json());
let TextObjective = JsTextObjective;
if (config.wasm) {
  const kernelUrl = '/__type_kernel/text_fit_kernel.js';
  const kernel = await import(/* @vite-ignore */ kernelUrl);
  await kernel.default();
  TextObjective = kernel.TextObjective;
}
const properties = [
  'font',
  'textAlign',
  'textBaseline',
  'letterSpacing',
  'fillStyle',
  'shadowColor',
  'shadowBlur',
  'shadowOffsetX',
  'shadowOffsetY',
  'globalAlpha',
  'globalCompositeOperation',
  'filter',
];
const rects = {
  title: [29, 29, 408, 41],
  type: [29, 362, 417, 42],
  artist: [36, 607, 350, 39],
  stats: [377, 596, 72, 39],
  rules: [54, 411, 390, 190],
};
const canvas = (w, h) => Object.assign(document.createElement('canvas'), { width: w, height: h });
const pixels = (c) =>
  c.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, c.width, c.height);
const image = async (url) => {
  const i = new Image();
  i.src = url;
  await i.decode();
  return i;
};
const matrix = (context) => {
  const m = context.getTransform();
  return [m.a, m.b, m.c, m.d, m.e, m.f];
};

export async function prepare(entry, scanUrl, roles = Object.keys(rects)) {
  const face = entry.face,
    signal = new AbortController().signal;
  const input = { face, printingId: entry.id, printedImage: null };
  const lease = await loadCanvasImages(canvasAssetUrls(face), signal);
  const hooks = { loadImages: async () => ({ ...lease, dispose() {} }) };
  const full = await composeCardTexture(input, 'inspect', signal, hooks);
  const proto = CanvasRenderingContext2D.prototype,
    native = proto.fillText,
    commands = [];
  let body;
  globalThis.__abuBody = (context, layout, images, ...args) => {
    body = { layout, images, args, transform: matrix(context) };
    return true;
  };
  proto.fillText = function (text, x, y, maxWidth) {
    const transform = this.getTransform(),
      cy = (transform.b * x + transform.d * y + transform.f) / 1.5;
    const role =
      cy < 80 && text === face.name
        ? 'title'
        : cy > 350 && cy < 405 && text === face.typeLine
          ? 'type'
          : cy > 600 && String(text).startsWith('Illus.')
            ? 'artist'
            : cy > 590 && cy < 637 && /^[*\dX]+\s*\/\s*[*\dX]+$/.test(String(text))
              ? 'stats'
              : null;
    if (!role) return native.call(this, text, x, y, maxWidth);
    commands.push({
      role,
      text,
      x,
      y,
      maxWidth,
      transform: matrix(this),
      properties: Object.fromEntries(properties.map((k) => [k, this[k]])),
    });
  };
  let background;
  try {
    background = await composeCardTexture(input, 'inspect', signal, hooks);
  } finally {
    proto.fillText = native;
    delete globalThis.__abuBody;
  }
  const s = canvas(488, 680),
    sc = s.getContext('2d');
  sc.drawImage(await image(scanUrl), 0, 0);
  const scan = pixels(s),
    fullPixels = pixels(full);
  const baseLayout = baseRetroTextLayout(full.getContext('2d'), face);
  const request = baseLayout && rulesLayoutRequest(baseLayout);
  const prepared = {};
  for (const [role, rect] of Object.entries(rects)) {
    if (!roles.includes(role)) continue;
    const selected = commands.filter((c) => c.role === role);
    if (!(role === 'rules' ? body : selected.length)) continue;
    const origin = [Math.floor(rect[0] * 1.5) - 16, Math.floor(rect[1] * 1.5) - 16];
    const out = canvas(Math.ceil(rect[2] * 1.5) + 34, Math.ceil(rect[3] * 1.5) + 34);
    const ctx = out.getContext('2d', { willReadFrequently: true });
    ctx.imageSmoothingQuality = 'high';
    const gray = cropGray(scan, rect).gray;
    const objective = new TextObjective(gray, rect[2], rect[3]);
    prepared[role] = {
      selected,
      rect,
      origin,
      out,
      ctx,
      objective,
      baselineGray: grayCrop(fullPixels, rect, [0, 0]),
    };
    if (config.wasm) {
      const js = new JsTextObjective(gray, rect[2], rect[3]);
      const a = js.score(prepared[role].baselineGray),
        b = objective.score(prepared[role].baselineGray);
      const error = Math.max(...a.map((v, i) => Math.abs(v - b[i])));
      if (error > 1e-6) throw Error(`WASM/JS text objective mismatch: ${error}`);
    }
  }
  const state = { face, full, background, body, request, prepared, lease, baseLayout, input };
  globalThis.__abuState = state;
  const parity = {};
  for (const role of Object.keys(prepared)) {
    const a = measure(role, {}),
      p = prepared[role];
    const g = grayCrop(pixels(p.out), p.rect, p.origin);
    parity[role] = Math.max(...g.map((v, i) => Math.abs(v - p.baselineGray[i])));
    if (parity[role] > 1.001)
      throw Error(`Native zero replay differs for ${face.name}/${role}: ${parity[role]}`);
  }
  return {
    png: full.toDataURL().split(',')[1],
    parity,
    roles: Object.keys(prepared),
    commands: commands.map((c) => ({
      role: c.role,
      text: c.text,
      font: c.properties.font,
      fill: c.properties.fillStyle,
    })),
    layout: body && {
      size: body.layout.size,
      top: body.layout.top,
      x: body.layout.x,
      width: body.layout.width,
      horizontalScale: body.layout.horizontalScale,
      lines: body.layout.lines.map((l) => ({
        text: l.runs.map((r) => r.text).join(''),
        x: l.x,
        baseline: l.baseline,
      })),
    },
    request: request && {
      paragraphs: request.paragraphs,
      bounds: request.bounds,
      typography: request.typography,
    },
  };
}

function paint(role, a) {
  const { background, body, request, prepared, face, baseLayout } = globalThis.__abuState;
  const p = prepared[role],
    { ctx: c, out, origin } = p;
  c.resetTransform();
  c.clearRect(0, 0, out.width, out.height);
  c.drawImage(background, -origin[0], -origin[1]);
  if (role === 'rules') {
    let layout = body.layout;
    if (a.policy === 'count') layout = countLayout(c, face, a, baseLayout);
    if (a.reflow) {
      const paragraphs = request.paragraphs.map((p) => ({ ...p, align: a.align ?? p.align }));
      const size = a.size ?? body.layout.size;
      layout = layoutRules(
        c,
        paragraphs,
        { x: a.left ?? 80.5, y: 411, width: a.width ?? 334, height: 190 },
        size,
        size,
        {
          ...request.typography,
          leading: a.leading ?? 1.1,
          paragraphGap: a.paragraphGap ?? 0,
          flavorGap: a.flavorGap ?? 0,
          balanceLines: a.align === 'center',
          centerOffset: 0,
        },
      );
      if (layout.overflow) return false;
    }
    const dx = a.dx ?? 0,
      dy = a.dy ?? 0;
    layout = {
      ...layout,
      top: layout.top + dy,
      lines: layout.lines.map((l) => ({
        ...l,
        x: (l.x ?? layout.x) + dx,
        baseline: l.baseline + dy,
        inkBounds: [l.inkBounds[0] + dx, l.inkBounds[1] + dy, l.inkBounds[2], l.inkBounds[3]],
      })),
    };
    if (
      layout.lines.some((l) => {
        const [x, y, w, h] = l.inkBounds;
        return y < 409 || y + h > 601 || x < 48 || x + w > 449;
      })
    )
      return false;
    c.save();
    c.setTransform(
      ...body.transform.slice(0, 4),
      body.transform[4] - origin[0],
      body.transform[5] - origin[1],
    );
    paintRulesLayout(c, layout, body.images, ...body.args);
    c.restore();
  } else
    for (const command of p.selected) {
      c.save();
      c.setTransform(
        ...command.transform.slice(0, 4),
        command.transform[4] - origin[0],
        command.transform[5] - origin[1],
      );
      Object.assign(c, command.properties);
      const sx = 1 + (a.width ?? 0) / 100;
      c.translate(command.x + (a.dx ?? 0), command.y + (a.dy ?? 0));
      c.scale(sx, 1);
      c.font = c.font.replace(/([\d.]+)px/, (_, n) => `${+n + (a.size ?? 0)}px`);
      // Preserve the separately painted dark shadow when fitting filled gray ink.
      if (a.gray !== undefined && command.properties.fillStyle !== '#17140f')
        c.fillStyle = `rgb(${a.gray},${a.gray},${a.gray})`;
      c.fillText(command.text, 0, 0, command.maxWidth == null ? undefined : command.maxWidth / sx);
      c.restore();
    }
  return true;
}

export function measure(role, adjustment) {
  if (!paint(role, adjustment)) return -1;
  const p = globalThis.__abuState.prepared[role];
  return p.objective.score_raster(
    pixels(p.out).data,
    p.out.width,
    new Float64Array(p.origin),
    new Float64Array(p.rect.slice(0, 2)),
  )[0];
}

export function fit(role) {
  const specs =
    role === 'rules'
      ? { dx: [-10, 10, 1], dy: [-16, 16, 1] }
      : { dx: [-6, 6, 0.5], dy: [-5, 5, 0.5], size: [-2, 2, 0.5], width: [-6, 6, 1] };
  let best = {},
    value = measure(role, best),
    baseline = value,
    trials = 1;
  const optimize = (initial, dimensions) => {
    let a = { ...initial },
      score = measure(role, a);
    for (let round = 0; round < 2; round++)
      for (const [key, [lo, hi, step]] of Object.entries(dimensions)) {
        let winner = a;
        for (let v = lo; v <= hi + 1e-6; v += step) {
          const b = { ...a, [key]: v },
            m = measure(role, b);
          trials++;
          if (m > score + 1e-9) {
            score = m;
            winner = b;
          }
        }
        a = winner;
      }
    if (score > value) {
      value = score;
      best = a;
    }
  };
  optimize({}, specs);
  if (role === 'rules') {
    // Independent per-card probes diagnose shared size/alignment classes. They
    // are never adopted as per-card renderer overrides.
    for (const size of [15.5, 22.5, 27.5, 32.5])
      for (const align of ['left', 'center']) {
        const seed = { reflow: true, size, align };
        const m = measure(role, seed);
        trials++;
        if (m > value - 0.07)
          optimize(seed, {
            dy: [-16, 16, 4],
            left: [68, 84, 4],
            width: [328, 364, 6],
            leading: [1, 1.3, 0.1],
          });
      }
  }
  return { baseline, score: value, adjustment: best, trials };
}

export function finish() {
  const s = globalThis.__abuState;
  for (const p of Object.values(s.prepared)) {
    p.objective.free();
    p.out.width = p.out.height = 0;
  }
  for (const c of [s.full, s.background]) c.width = c.height = 0;
  s.lease.dispose();
  delete globalThis.__abuState;
}

/** Fixed, deliberately small candidate grid. Select on calibration names and
 * report validation separately; individual probes never become printing fixes. */
export function shared() {
  const grids = {
    title: [{}, { dx: 0.5 }, { dx: 1 }, { size: -0.5 }, { dx: 0.5, size: -0.5 }],
    type: [
      {},
      { dx: -2, dy: -1, size: 0.5 },
      { dx: -2, dy: -1, size: 0.5, width: 1 },
      { dx: -1.5, dy: -1, size: 0.5, width: 1 },
      { dx: -2, dy: -1.5, size: 0.5, width: 1 },
    ],
    artist: [{}, { dy: -0.5 }, { dy: -0.75 }, { dy: -1 }],
    stats: [{}, { dx: 0.5 }, { dx: 1 }, { dx: 1, dy: -0.5 }],
    rules: [{}, { dy: -1 }, { dy: -2 }, { dy: -3 }, { dx: -1, dy: -2 }, { dx: 1, dy: -2 }],
  };
  return Object.fromEntries(
    Object.keys(globalThis.__abuState.prepared).map((role) => [
      role,
      grids[role].map((adjustment) => ({ adjustment, score: measure(role, adjustment) })),
    ]),
  );
}

export function countTrials(selectedOnly = false) {
  const variants = selectedOnly
    ? [{}, { policy: 'count', mediumSize: 22.5, denseWidth: 1 }]
    : [
        {},
        ...[21.5, 22, 22.5].flatMap((mediumSize) =>
          [0.98, 1].map((denseWidth) => ({ policy: 'count', mediumSize, denseWidth })),
        ),
      ];
  return {
    rules: variants.map((adjustment) => ({ adjustment, score: measure('rules', adjustment) })),
  };
}

export async function nativeRulesTrial(adjustment) {
  const s = globalThis.__abuState;
  let calls = 0;
  const hook = (context, _layout, images, ...args) => {
    calls++;
    const layout = countLayout(context, s.face, adjustment, baseRetroTextLayout(context, s.face));
    delete globalThis.__abuBody;
    try {
      paintRulesLayout(context, layout, images, ...args);
    } finally {
      globalThis.__abuBody = hook;
    }
    return true;
  };
  globalThis.__abuBody = hook;
  let trial;
  try {
    trial = await composeCardTexture(s.input, 'inspect', new AbortController().signal, {
      loadImages: async () => ({ ...s.lease, dispose() {} }),
    });
  } finally {
    delete globalThis.__abuBody;
  }
  if (calls !== 1) throw Error('Native rules replacement did not paint exactly once');
  const score = measure('rules', adjustment),
    p = s.prepared.rules;
  // Fractional glyph coverage can reach the neighboring device row even when
  // measured ink bounds are inside the canonical region. Certify that fringe too.
  const isolationRect = [p.rect[0] - 1, p.rect[1] - 1, p.rect[2] + 2, p.rect[3] + 2];
  const actual = pixels(trial),
    before = pixels(s.full),
    predicted = grayCrop(pixels(p.out), isolationRect, p.origin);
  const gray = grayCrop(actual, isolationRect, [0, 0]);
  let maximum = 0,
    outside = 0;
  const outsideBounds = [Infinity, Infinity, -Infinity, -Infinity];
  for (let i = 0; i < gray.length; i++)
    maximum = Math.max(maximum, Math.abs(gray[i] - predicted[i]));
  for (let y = 0; y < trial.height; y++)
    for (let x = 0; x < trial.width; x++) {
      if (
        x >= isolationRect[0] * 1.5 &&
        x < (isolationRect[0] + isolationRect[2]) * 1.5 &&
        y >= isolationRect[1] * 1.5 &&
        y < (isolationRect[1] + isolationRect[3]) * 1.5
      )
        continue;
      const i = (y * trial.width + x) * 4;
      for (let k = 0; k < 4; k++)
        if (actual.data[i + k] !== before.data[i + k]) {
          outside++;
          outsideBounds[0] = Math.min(outsideBounds[0], x / 1.5);
          outsideBounds[1] = Math.min(outsideBounds[1], y / 1.5);
          outsideBounds[2] = Math.max(outsideBounds[2], x / 1.5);
          outsideBounds[3] = Math.max(outsideBounds[3], y / 1.5);
          break;
        }
    }
  if (maximum > 1.001 || outside)
    throw Error(
      `Native candidate differs from prepared replay: ${maximum}, outside ${outside}, bounds ${outsideBounds}`,
    );
  const png = trial.toDataURL().split(',')[1];
  trial.width = trial.height = 0;
  return { png, score, maximum, outside, isolationRect };
}
