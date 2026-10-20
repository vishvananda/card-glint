import '../../src/data/eager.ts';
import '../../src/data/eager-wording.ts';
import { composeCardTexture } from '../../src/presentation/canvas-face.ts';
import { canvasAssetUrls } from '../../src/presentation/canvas-assets.ts';
import { loadAccuracyImages } from './abu-assets.mjs';
import { paintLegacyCalibratedTitle } from '../../src/presentation/legacy-calibrated-title.ts';
import { paintTextInk } from '../../src/presentation/text-ink.ts';
import {
  createSetCalibrationCandidate,
  describeSetCalibration,
} from '../../src/calibration/editor.ts';
import { nativeGrayCrop, JsTextObjective } from './abu-type-objective.mjs';
import { cropGray } from './pixels-pure.mjs';
const props = [
  'font',
  'fontKerning',
  'textAlign',
  'textBaseline',
  'direction',
  'letterSpacing',
  'wordSpacing',
  'fillStyle',
  'shadowColor',
  'shadowBlur',
  'shadowOffsetX',
  'shadowOffsetY',
  'globalAlpha',
  'globalCompositeOperation',
  'filter',
];
// A released baseline must not move when the promoted profile is updated.
const baselineValues = Object.fromEntries(
  ['title', 'type'].flatMap((role) =>
    Object.entries({
      dx: 0,
      dy: 0,
      size: role === 'title' ? 27.8 : 22.2,
      width: 1,
      wordSpacing: 0,
      gray: 130,
      shadow: 1,
    }).map(([k, v]) => [role + '.' + k, v]),
  ),
);
function headingCandidate(face, values = {}) {
  const d = describeSetCalibration(face.setCode);
  return createSetCalibrationCandidate(face.setCode, d.revision, { ...baselineValues, ...values });
}
const states = new Map();
const rects = { title: [29, 24, 425, 48], type: [29, 358, 425, 49] };
const pixels = (c) =>
  c.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, c.width, c.height);
const canvas = (w, h) => Object.assign(document.createElement('canvas'), { width: w, height: h });
export async function prepare(entry, scanUrl) {
  const { face, id } = entry,
    signal = new AbortController().signal;
  const lease = await loadAccuracyImages(canvasAssetUrls(face), signal, face.illustration);
  const hooks = { loadImages: async () => ({ ...lease, dispose() {} }) };
  const input = {
    face: { ...face, setCalibrationCandidate: headingCandidate(face) },
    printingId: null,
    printedImage: null,
  };
  const full = await composeCardTexture(input, 'inspect', signal, hooks);
  let releasedParity;
  if (globalThis.__headingBaseline) {
    const before = await globalThis.__headingBaseline.composeCardTexture(
      { ...input, face },
      'inspect',
      signal,
      hooks,
    );
    const a = pixels(before).data,
      b = pixels(full).data;
    let changed = 0;
    for (let i = 0; i < a.length; i += 4)
      if ([0, 1, 2, 3].some((k) => a[i + k] !== b[i + k])) changed++;
    before.width = before.height = 0;
    if (changed) throw Error('Released default pixel mismatch: ' + face.name + ': ' + changed);
    releasedParity = { changedPixels: changed };
  }
  const calls = {};
  globalThis.__headingSpacingCapture = (c, f, x, y, width, role = 'title', text = f.name) => {
    const tr = c.getTransform();
    calls[role] = {
      x,
      y,
      width,
      role,
      text,
      transform: [tr.a, tr.b, tr.c, tr.d, tr.e, tr.f],
      properties: Object.fromEntries(props.map((k) => [k, c[k]])),
    };
    return true;
  };
  let background;
  try {
    background = await composeCardTexture(input, 'inspect', signal, hooks);
  } finally {
    delete globalThis.__headingSpacingCapture;
  }
  const im = new Image();
  im.src = scanUrl;
  await im.decode();
  const sc = canvas(488, 680);
  sc.getContext('2d').drawImage(im, 0, 0);
  const scan = pixels(sc),
    original = pixels(full);
  const prepared = {};
  for (const role of Object.keys(rects)) {
    if (!calls[role]) throw Error('Missing heading capture ' + face.name + '/' + role);
    const rect = rects[role],
      origin = [Math.floor(rect[0] * 1.5) - 16, Math.floor(rect[1] * 1.5) - 16],
      out = canvas(Math.ceil(rect[2] * 1.5) + 34, Math.ceil(rect[3] * 1.5) + 34);
    const gray = cropGray(scan, rect).gray;
    prepared[role] = {
      rect,
      origin,
      out,
      ctx: out.getContext('2d', { willReadFrequently: true }),
      objective: new JsTextObjective(gray, rect[2], rect[3]),
      baselineGray: nativeGrayCrop(original, rect),
    };
  }
  states.set(id, { face, input, lease, hooks, full, background, calls, prepared });
  const parity = {};
  for (const role of Object.keys(rects)) {
    measure(id, role, {});
    const p = prepared[role],
      a = nativeGrayCrop(pixels(p.out), p.rect, p.origin);
    parity[role] = Math.max(...a.map((v, i) => Math.abs(v - p.baselineGray[i])));
    if (parity[role] > 1.001)
      throw Error('Zero replay differs ' + face.name + '/' + role + ': ' + parity[role]);
  }
  sc.width = sc.height = 0;
  return { parity, releasedParity };
}
function candidate(face, role, values) {
  return headingCandidate(
    face,
    Object.fromEntries(Object.entries(values).map(([k, v]) => [role + '.' + k, v])),
  );
}

export function measure(id, role, values, context = {}) {
  const s = states.get(id),
    p = s.prepared[role],
    c = p.ctx,
    cmd = s.calls[role];
  c.resetTransform();
  c.clearRect(0, 0, p.out.width, p.out.height);
  c.drawImage(s.background, -p.origin[0], -p.origin[1]);
  c.save();
  c.setTransform(
    ...cmd.transform.slice(0, 4),
    cmd.transform[4] - p.origin[0],
    cmd.transform[5] - p.origin[1],
  );
  Object.assign(c, cmd.properties, context);
  const face = { ...s.face, setCalibrationCandidate: candidate(s.face, role, values) };
  if (!paintLegacyCalibratedTitle(c, face, cmd.x, cmd.y, cmd.width, role, cmd.text)) {
    if (role === 'type') paintTextInk(c, cmd.text, cmd.x, cmd.y, cmd.width, s.face.textInk, 'type');
    else c.fillText(cmd.text, cmd.x, cmd.y, cmd.width);
  }
  c.restore();
  return [
    ...p.objective.score_raster(
      pixels(p.out).data,
      p.out.width,
      new Float64Array(p.origin),
      new Float64Array(p.rect.slice(0, 2)),
    ),
  ];
}
export function controls() {
  return describeSetCalibration('lea').controls;
}
export function batch(ids, role, values) {
  return ids.map((id) => measure(id, role, values));
}
export async function verify(id, values) {
  const s = states.get(id),
    d = describeSetCalibration(s.face.setCode);
  const candidate = headingCandidate(s.face, values);
  const actual = await composeCardTexture(
    { ...s.input, face: { ...s.face, setCalibrationCandidate: candidate } },
    'inspect',
    new AbortController().signal,
    s.hooks,
  );
  const ap = pixels(actual),
    bp = pixels(s.full),
    parity = {};
  let changed = 0,
    outside = 0;
  for (const role of Object.keys(rects)) {
    measure(
      id,
      role,
      Object.fromEntries(
        Object.entries(values)
          .filter(([k]) => k.startsWith(role + '.'))
          .map(([k, v]) => [k.split('.')[1], v]),
      ),
    );
    const p = s.prepared[role],
      a = nativeGrayCrop(ap, p.rect),
      b = nativeGrayCrop(pixels(p.out), p.rect, p.origin);
    parity[role] = Math.max(...a.map((v, i) => Math.abs(v - b[i])));
    if (parity[role] > 1.001)
      throw Error('Candidate replay differs ' + s.face.name + '/' + role + ': ' + parity[role]);
  }
  for (let y = 0; y < actual.height; y++)
    for (let x = 0; x < actual.width; x++) {
      const i = (y * actual.width + x) * 4;
      if ([0, 1, 2, 3].some((k) => ap.data[i + k] !== bp.data[i + k])) {
        changed++;
        if (
          !Object.values(rects).some(
            ([rx, ry, w, h]) =>
              x >= rx * 1.5 && x < (rx + w) * 1.5 && y >= ry * 1.5 && y < (ry + h) * 1.5,
          )
        )
          outside++;
      }
    }
  if (outside) throw Error('Heading edit changes pixels outside heading regions: ' + outside);
  const result = {
    parity,
    defaultCandidateFields: Object.keys(candidate.values).length,
    changed,
    outside,
    before: s.full.toDataURL(),
    after: actual.toDataURL(),
  };
  actual.width = actual.height = 0;
  return result;
}
export function finish(id) {
  const s = states.get(id);
  for (const p of Object.values(s.prepared)) {
    p.out.width = p.out.height = 0;
    p.objective.free();
  }
  for (const c of [s.full, s.background]) c.width = c.height = 0;
  s.lease.dispose();
  states.delete(id);
}

/** Diagnostics only: these do not add new rendering defaults or per-card overrides. */
export function ablate(id, role, values) {
  const { dx, dy, size, width, wordSpacing } = values;
  const variants = {
    baseline: {},
    full: values,
    onlyWordSpacing: { wordSpacing },
    withoutWordSpacing: { ...values, wordSpacing: 0 },
    onlyPosition: { dx, dy },
    withoutPosition: { ...values, dx: 0, dy: 0 },
    onlySize: { size },
    onlyWidth: { width },
    onlySizeAndWidth: { size, width },
  };
  const scores = Object.fromEntries(
    Object.entries(variants).map(([name, value]) => [name, measure(id, role, value)]),
  );
  scores.baselineWithoutKerning = measure(id, role, {}, { fontKerning: 'none' });
  scores.fullWithoutKerning = measure(id, role, values, { fontKerning: 'none' });
  const { ctx: c } = states.get(id).prepared[role];
  const cmd = states.get(id).calls[role];
  c.save();
  Object.assign(c, cmd.properties);
  const initialPairs = [...cmd.text.matchAll(/(?:^|\s)(\S{2})/g)].map((m) => m[1]);
  const pairs = [...new Set(initialPairs)].map((pair) => {
    c.fontKerning = 'normal';
    const kerned = c.measureText(pair).width;
    c.fontKerning = 'none';
    return { pair, kerned, unkerned: c.measureText(pair).width };
  });
  c.restore();
  const positionSweep = [];
  for (let dx = -4; dx <= 4; dx += 0.5)
    positionSweep.push({ dx, score: measure(id, role, { dx })[0] });
  const bestHorizontal = positionSweep.reduce((a, b) => (b.score > a.score ? b : a));
  return { text: cmd.text, scores, initialPairs: pairs, positionSweep, bestHorizontal };
}
