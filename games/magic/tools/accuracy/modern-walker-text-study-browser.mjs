import { planeswalkerRuleRows } from '../../src/presentation/planeswalker-rules.ts';
import { faceFrame } from '../../src/presentation/special-frames.ts';
import { loadCanvasFonts } from '../../src/presentation/canvas-assets.ts';
import { faceManaAssets } from '../../src/presentation/mana-assets.ts';
import { paintRulesLayout } from '../../src/presentation/rules-paint.ts';
import { loadAccuracyImages } from './abu-assets.mjs';
import { TextFilledObjective } from './text-filled-objective.mjs';
import { nativeGrayCrop } from './abu-type-objective.mjs';
import { nativeTextWindow } from './native-text-window.mjs';
const image = async (url) => {
  const im = new Image();
  im.src = url;
  await im.decode();
  return im;
};
const raster = () => {
  const c = document.createElement('canvas');
  c.width = 732;
  c.height = 1020;
  return c;
};
export async function prepareWalkerStudy() {
  await import('../../src/data/eager.ts');
  await loadCanvasFonts();
}
export async function walkerTextFields(rows) {
  const fields = [];
  for (const row of rows) {
    const face = row.face,
      large = faceFrame(face) === 'planeswalker-large';
    const rect = large ? [108, 386, 324, 220] : [108, 433, 324, 173],
      w = rect[2],
      h = rect[3],
      window = nativeTextWindow(rect, [0, 0], [732, 1020]);
    const targets = [];
    for (const url of [row.own, row.reference]) {
      const im = await image(url),
        c = document.createElement('canvas');
      c.width = im.naturalWidth;
      c.height = im.naturalHeight;
      const x = c.getContext('2d', { willReadFrequently: true });
      x.drawImage(im, 0, 0);
      const d =
        im.naturalWidth === 488
          ? x.getImageData(...rect)
          : x.getImageData(window.x, window.y, window.width, window.height);
      const gray =
        im.naturalWidth === 488
          ? Float32Array.from(
              { length: w * h },
              (_, i) =>
                0.2126 * d.data[i * 4] + 0.7152 * d.data[i * 4 + 1] + 0.0722 * d.data[i * 4 + 2],
            )
          : nativeGrayCrop(d, rect, window.origin);
      const mask = new Uint8Array(w * h).fill(1);
      targets.push(new TextFilledObjective(gray, w, h, mask));
      c.width = c.height = 0;
    }
    const lease = await loadAccuracyImages(faceManaAssets(face), new AbortController().signal),
      c = raster(),
      ctx = c.getContext('2d', { willReadFrequently: true });
    fields.push({ ...row, face, large, rect, window, targets, lease, c, ctx });
  }
  const history = [];
  const visible = (rows) =>
    rows
      .map((r) =>
        r.layout.lines
          .flatMap((l) => l.runs.map((r) => r.text))
          .join('')
          .replace(/\s/g, ''),
      )
      .join('|');
  const paint = (f, adjustment) => {
    globalThis.__m21WalkerText = adjustment;
    const c = f.ctx;
    c.resetTransform();
    c.fillStyle = '#fff';
    c.fillRect(0, 0, 732, 1020);
    c.scale(1.5, 1.5);
    c.textAlign = 'left';
    c.fillStyle = '#17140f';
    const layouts = planeswalkerRuleRows(c, f.face);
    const text = visible(layouts);
    f.expected ??= text;
    if (f.expected !== text) throw Error('Lost walker text ' + f.name);
    if (layouts.some((r) => r.layout.overflow)) return null;
    for (const r of layouts) paintRulesLayout(c, r.layout, f.lease.images);
    const d = c.getImageData(f.window.x, f.window.y, f.window.width, f.window.height);
    return {
      gray: nativeGrayCrop(d, f.rect, f.window.origin),
      layouts: layouts.map((r) => ({
        size: r.font,
        top: r.layout.top,
        height: r.layout.height,
        lines: r.layout.lines.length,
        overflow: r.layout.overflow,
      })),
    };
  };
  const reports = [];
  for (const large of [false, true]) {
    const group = fields.filter((f) => f.large === large),
      cache = new Map();
    if (!group.length) continue;
    const evaluate = (adjustment, kind) => {
      const key = JSON.stringify([adjustment, kind]);
      if (cache.has(key)) return cache.get(key);
      const rows = group.map((f) => {
        const p = paint(f, adjustment);
        return {
          id: f.id,
          name: f.name,
          invalid: !p,
          quality: p ? f.targets[kind].score(p.gray) : null,
          layouts: p?.layouts,
        };
      });
      const score = rows.some((r) => r.invalid)
        ? -1
        : rows.reduce((s, r) => s + r.quality.score, 0) / rows.length;
      const result = { adjustment, score, rows };
      cache.set(key, result);
      return result;
    };
    const bounds = {
      size: [-1.5, 2],
      dx: [-3, 4],
      dy: [-6, 6],
      width: [-6, 6],
      height: [-12, 12],
      leading: [0.85, 1.1],
    };
    const baseline = { size: 0, dx: 0, dy: 0, width: 0, height: 0, leading: large ? 0.9 : 1 };
    const search = (seed, kind) => {
      let best = evaluate(seed, kind);
      for (const steps of [
        [0.5, 1, 0.04],
        [0.25, 0.5, 0.02],
      ]) {
        let n = 0;
        for (; n < 30; n++) {
          let next = best;
          for (const [key, [lo, hi]] of Object.entries(bounds))
            for (const sign of [-1, 1]) {
              const a = { ...best.adjustment };
              a[key] = Number(
                (
                  a[key] +
                  sign * (key === 'leading' ? steps[2] : key === 'size' ? steps[0] : steps[1])
                ).toFixed(4),
              );
              if (a[key] < lo || a[key] > hi) continue;
              const r = evaluate(a, kind);
              if (r.score > next.score + 1e-7) next = r;
            }
          if (next === best) break;
          best = next;
        }
        if (n === 30) throw Error('Walker text search did not settle');
        history.push({
          large,
          kind,
          steps,
          best: { adjustment: best.adjustment, score: best.score },
        });
      }
      return best;
    };
    const control = search(baseline, 0),
      a = search(baseline, 1),
      b = search({ ...baseline, size: 0.5, dy: -2 }, 1),
      best = a.score >= b.score ? a : b;
    reports.push({
      large,
      count: group.length,
      baseline: evaluate(baseline, 1),
      control,
      selected: best,
      atBoundary: Object.entries(best.adjustment)
        .filter(([k, v]) => bounds[k].includes(v))
        .map(([k]) => k),
      candidates: cache.size,
    });
  }
  for (const f of fields) {
    f.lease.dispose();
    f.c.width = f.c.height = 0;
  }
  delete globalThis.__m21WalkerText;
  return {
    reports,
    history,
    scope:
      'Canonical frozen scan pixels; native1.5x isolated ability text; excludes badges/colons/shields, uses filled-ink plus symmetric edge objective. One shared candidate per ordinary/tall geometry; no per-card offsets or font sizes fitted. Own native raster is an independent placement control.',
  };
}
