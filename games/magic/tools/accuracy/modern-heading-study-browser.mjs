import { FACE_TEXT } from '../../src/presentation/face-layout.ts';
import { WALKER_GEOMETRY } from '../../src/presentation/planeswalker-geometry.ts';
import { loadCanvasFonts } from '../../src/presentation/canvas-assets.ts';
import { loadModernHeadingFont } from '../../src/presentation/modern-heading-font.ts';
import { composeCardTexture } from '../../src/presentation/canvas-face.ts';
import { paintFittedText } from '../../src/presentation/canvas-text.ts';
import { canvasAssetUrls } from '../../src/presentation/canvas-assets.ts';
import { faceFrame } from '../../src/presentation/special-frames.ts';
import { framePlate } from '../../src/presentation/frame-plates.ts';
import { shapeModernHeading } from '../../src/presentation/modern-heading-font.ts';
import { loadAccuracyImages } from './abu-assets.mjs';
import { TextFilledObjective } from './text-filled-objective.mjs';
import { nativeGrayCrop } from './abu-type-objective.mjs';
import { nativeTextWindow } from './native-text-window.mjs';
import { inkEdges } from './edges.mjs';

const fields = [];
const zero = { dx: 0, dy: 0, size: 1, sx: 1, tracking: 0, optical: 0, precision: 0 };
const image = async (url) => {
  const im = new Image();
  im.src = url;
  await im.decode();
  return im;
};
const canvas = (w, h) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
};
const gray = (data) =>
  Float32Array.from(
    { length: data.width * data.height },
    (_, i) =>
      0.2126 * data.data[i * 4] + 0.7152 * data.data[i * 4 + 1] + 0.0722 * data.data[i * 4 + 2],
  );

/** Suppress fixed, long background keylines before trying any candidate.
 * No candidate ink contributes to this mask. Short texture/punctuation remains. */
function backgroundMask(background, width, height) {
  const { ink } = inkEdges(background, width, height),
    seen = new Uint8Array(ink.length);
  const mask = new Uint8Array(ink.length).fill(1),
    removed = [];
  for (let start = 0; start < ink.length; start++) {
    if (!ink[start] || seen[start]) continue;
    const stack = [start],
      component = [];
    seen[start] = 1;
    let l = width,
      r = 0,
      t = height,
      b = 0;
    while (stack.length) {
      const i = stack.pop(),
        x = i % width,
        y = Math.floor(i / width);
      component.push(i);
      l = Math.min(l, x);
      r = Math.max(r, x);
      t = Math.min(t, y);
      b = Math.max(b, y);
      for (const [dx, dy] of [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ]) {
        const nx = x + dx,
          ny = y + dy,
          j = ny * width + nx;
        if (nx < 0 || nx >= width || ny < 0 || ny >= height || seen[j] || !ink[j]) continue;
        seen[j] = 1;
        stack.push(j);
      }
    }
    if ((r - l > width * 0.45 || b - t > height * 0.8) && component.length > 20) {
      removed.push({ bounds: [l, t, r - l + 1, b - t + 1], pixels: component.length });
      for (const i of component) {
        const x = i % width,
          y = Math.floor(i / width);
        for (let dy = -2; dy <= 2; dy++)
          for (let dx = -2; dx <= 2; dx++) {
            const nx = x + dx,
              ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) mask[ny * width + nx] = 0;
          }
      }
    }
  }
  return { mask, removed };
}
function setup(c, m, origin = [0, 0]) {
  c.resetTransform();
  c.setTransform(
    m.matrix[0],
    m.matrix[1],
    m.matrix[2],
    m.matrix[3],
    m.matrix[4] - origin[0],
    m.matrix[5] - origin[1],
  );
  c.textBaseline = m.baseline;
  c.textAlign = m.align;
  c.direction = m.direction;
  c.fillStyle = m.fill;
  c.shadowColor = m.shadowColor;
  c.shadowOffsetX = m.shadowOffsetX;
  c.shadowOffsetY = m.shadowOffsetY;
  c.shadowBlur = m.shadowBlur;
  if (m.tracking) c.letterSpacing = m.tracking;
  if (m.rendering && m.rendering !== 'auto') c.textRendering = m.rendering;
  if (m.kerning && m.kerning !== 'auto') c.fontKerning = m.kerning;
  if (m.wordSpacing) c.wordSpacing = m.wordSpacing;
}
function draw(c, m, a) {
  // Reconstruct the actual final draw state, not an approximation to native
  // auto-hinting. CPU readback canvases can resolve auto differently.
  if (
    m.final &&
    !a.precision &&
    !a.dx &&
    !a.dy &&
    a.size === 1 &&
    a.sx === 1 &&
    !a.tracking &&
    !a.optical
  ) {
    const d = m.final,
      local = c.getTransform();
    const ox = m.matrix[4] - local.e,
      oy = m.matrix[5] - local.f;
    c.setTransform(
      d.matrix[0],
      d.matrix[1],
      d.matrix[2],
      d.matrix[3],
      d.matrix[4] - ox,
      d.matrix[5] - oy,
    );
    c.font = d.font;
    let best = { error: Infinity };
    for (const mode of ['auto', 'geometricPrecision'])
      for (const kerning of ['auto', 'normal', 'none']) {
        c.textRendering = mode;
        c.fontKerning = kerning;
        const error =
          Math.abs(c.measureText(d.text).width - d.width) +
          Math.abs(c.measureText('nnnnn').width - d.nWidth);
        if (error < best.error) best = { error, mode, kerning };
      }
    if (best.error > 0.002)
      throw Error(
        'Cannot reproduce native font advances ' +
          m.text +
          ' ' +
          JSON.stringify({
            best,
            final: m.final,
            mode: c.textRendering,
            kern: c.fontKerning,
            width: c.measureText(m.final.text).width,
            n: c.measureText('nnnnn').width,
          }),
      );
    c.textRendering = best.mode;
    c.fontKerning = best.kerning;
    c.fillText(d.text, d.x, d.y, d.maxWidth);
    return {
      font: c.font,
      advance: c.measureText(d.text).width,
      width: d.maxWidth,
      sourceMode: best.mode,
    };
  }
  if (a.precision) {
    c.textRendering = 'geometricPrecision';
    c.fontKerning = 'normal';
  }
  let widthScale = m.widthScale;
  if (a.precision && m.kind.startsWith('planeswalker')) {
    c.font = (m.bold ? 'bold ' : '') + m.size + 'px "' + m.family + '", Georgia';
    const measured = c.measureText(shapeModernHeading(m.text, m.family)).width;
    widthScale =
      m.role === 'type'
        ? measured * WALKER_GEOMETRY.typeWidth <= m.width * 0.97
          ? WALKER_GEOMETRY.typeWidth
          : 1
        : Math.max(1, Math.min(WALKER_GEOMETRY.titleWidth, (m.width - 0.5) / measured));
  }
  if (m.tracking || a.tracking) c.letterSpacing = parseFloat(m.tracking || '0') + a.tracking + 'px';
  const original = c.fillText;
  let drawn;
  c.fillText = function (text, x, y, width) {
    const metric = this.measureText(text);
    const left = (a.optical ?? 0) * metric.actualBoundingBoxLeft;
    drawn = {
      font: this.font,
      advance: metric.width,
      width,
      inkLeft: metric.actualBoundingBoxLeft,
    };
    original.call(this, text, x + left, y, width);
  };
  try {
    paintFittedText(
      c,
      m.text,
      m.x + a.dx,
      m.y + a.dy,
      m.width - a.dx,
      m.size * a.size,
      m.bold,
      widthScale * a.sx,
      m.family,
      m.strokeInset,
      m.textInk,
    );
  } finally {
    c.fillText = original;
  }
  return drawn;
}

export async function prepareHeadingStudy() {
  await import('../../src/data/eager.ts');
  await import('../../src/data/eager-wording.ts');
  await loadCanvasFonts();
  await loadModernHeadingFont({ name: '', setCode: 'm21', typeLine: 'Creature' });
}
export async function captureHeadingField(row) {
  const signal = new AbortController().signal,
    face = row.face;
  const lease = await loadAccuracyImages(canvasAssetUrls(face), signal, face.illustration);
  const observer = {
    targets: new Map([
      [face.name, 'name'],
      [face.typeLine, 'type'],
    ]),
    calls: [],
    erase: false,
  };
  globalThis.__m21HeadingObserver = observer;
  let full, background;
  try {
    const hooks = { loadImages: async () => ({ ...lease, dispose() {} }) };
    full = await composeCardTexture(
      { face, printingId: null, printedImage: null },
      'inspect',
      signal,
      hooks,
    );
    const calls = observer.calls.slice();
    observer.erase = true;
    observer.calls = [];
    background = await composeCardTexture(
      { face, printingId: null, printedImage: null },
      'inspect',
      signal,
      hooks,
    );
    delete globalThis.__m21HeadingObserver;
    const collected = [];
    for (const role of row.roles ?? [row.role ?? 'type']) {
      const matched = calls.filter((c) => c.role === role);
      if (matched.length !== 1)
        throw Error('Heading observer count ' + row.name + ' ' + matched.length);
      const m = { ...matched[0], kind: faceFrame(face) };
      // Chromium can return an empty letterSpacing string for fractional px.
      // Existing source uses this one shared tracking value on retained names.
      if (!m.tracking && role === 'name') m.tracking = FACE_TEXT.titleTracking + 'px';
      if (m.strokeInset || m.align !== 'left') throw Error('Unsupported heading ink ' + row.name);
      const probe = canvas(732, 1020),
        ctx = probe.getContext('2d', { willReadFrequently: true });
      setup(ctx, m);
      let actual;
      const nativeFill = ctx.fillText.bind(ctx);
      ctx.fillText = function (text, x, y, maxWidth) {
        const mt = this.measureText(text),
          d = this.getTransform();
        actual = {
          text,
          x,
          y,
          maxWidth,
          font: this.font,
          advance: mt.width,
          left: mt.actualBoundingBoxLeft,
          right: mt.actualBoundingBoxRight,
          ascent: mt.actualBoundingBoxAscent,
          descent: mt.actualBoundingBoxDescent,
          matrix: [d.a, d.b, d.c, d.d, d.e, d.f],
        };
        nativeFill(text, x, y, maxWidth);
      };
      draw(ctx, m, zero);
      if (!actual) throw Error('Heading not painted');
      const [a, b, c, d, e, f] = actual.matrix;
      if (b !== 0 || c !== 0) throw Error('Unexpected rotated standard heading');
      const squeeze = Math.min(1, actual.maxWidth / actual.advance);
      const x0 = (a * (actual.x - actual.left * squeeze) + e) / 1.5;
      const x1 = (a * (actual.x + actual.right * squeeze) + e) / 1.5;
      const y0 = (d * (actual.y - actual.ascent) + f) / 1.5;
      const y1 = (d * (actual.y + actual.descent) + f) / 1.5;
      const startX = (m.matrix[0] * m.x + m.matrix[4]) / 1.5;
      const endX = (m.matrix[0] * (m.x + m.width) + m.matrix[4]) / 1.5;
      const left = Math.max(0, Math.floor(Math.min(x0, startX) - 4));
      const top = Math.max(0, Math.floor(y0 - 3));
      const right = Math.min(
        488,
        Math.ceil(Math.min(endX - 2, x1 + Math.max(10, (x1 - x0) * 0.08))),
      );
      const bottom = Math.min(680, Math.ceil(y1 + 3));
      const rect = [left, top, right - left, bottom - top],
        win = nativeTextWindow(rect, [0, 0], [732, 1020]);
      const crop = canvas(win.width, win.height),
        cx = crop.getContext('2d', { willReadFrequently: true });
      cx.drawImage(background, win.x, win.y, win.width, win.height, 0, 0, win.width, win.height);
      const base = cx.getImageData(0, 0, win.width, win.height);
      const target = await image(row.reference),
        refCanvas = canvas(488, 680),
        rx = refCanvas.getContext('2d', { willReadFrequently: true });
      if (target.width !== 488 || target.height !== 680)
        throw Error('Frozen reference dimensions changed');
      rx.drawImage(target, 0, 0);
      const reference = gray(rx.getImageData(...rect));
      const own = await image(row.own),
        ownCanvas = canvas(732, 1020),
        ox = ownCanvas.getContext('2d', { willReadFrequently: true });
      ox.drawImage(own, 0, 0);
      const ownPixels = ox.getImageData(win.x, win.y, win.width, win.height),
        ownGray = nativeGrayCrop(ownPixels, rect, win.origin);
      const bgGray = nativeGrayCrop(base, rect, win.origin);
      const masked = backgroundMask(bgGray, rect[2], rect[3]);
      const kind = faceFrame(face),
        group = kind.startsWith('planeswalker')
          ? 'walker'
          : framePlate(face)
            ? 'plate'
            : 'components';
      const field = {
        id: row.id,
        name: row.name,
        number: row.number,
        nonfoil: row.nonfoil,
        role,
        group,
        kind,
        meta: m,
        actual,
        rect,
        window: win,
        crop,
        cx,
        base,
        mask: masked.mask,
        removed: masked.removed,
        objective: new TextFilledObjective(reference, rect[2], rect[3], masked.mask),
        reference,
        ownGray,
        ownObjective: new TextFilledObjective(ownGray, rect[2], rect[3], masked.mask),
      };
      const painted = paint(field, zero);
      let changed = 0,
        maxDelta = 0;
      for (let i = 0; i < painted.native.data.length; i++) {
        const delta = Math.abs(painted.native.data[i] - ownPixels.data[i]);
        if (delta) {
          changed++;
          maxDelta = Math.max(maxDelta, delta);
        }
      }
      let visibleGlyphPixels = 0,
        maskedGlyphPixels = 0;
      for (let i = 0; i < ownGray.length; i++)
        if (bgGray[i] - ownGray[i] > 10) {
          visibleGlyphPixels++;
          if (!masked.mask[i]) maskedGlyphPixels++;
        }
      if (maskedGlyphPixels) throw Error('Background mask erased native heading ink ' + row.name);
      const actualPixels = full.getContext('2d').getImageData(win.x, win.y, win.width, win.height);
      let sourceChanges = 0,
        sourceMax = 0;
      for (let i = 0; i < actualPixels.data.length; i++) {
        const d = Math.abs(actualPixels.data[i] - ownPixels.data[i]);
        if (d) {
          sourceChanges++;
          sourceMax = Math.max(sourceMax, d);
        }
      }
      field.parity = {
        sourceChanges,
        sourceMax,
        visibleGlyphPixels,
        maskedGlyphPixels,
        changedChannels: changed,
        maxDelta,
        own: field.ownObjective.score(painted.gray),
      };
      // Small local-coordinate rounding at an antialiased edge can differ by 1.
      if (maxDelta > 1)
        throw Error(
          'Full native heading parity failed ' +
            row.name +
            ' ' +
            JSON.stringify({
              parity: field.parity,
              role,
              m,
              actual,
              drawn: painted.drawn,
              rect,
              window: win,
            }),
        );
      fields.push(field);
      for (const c of [probe, refCanvas, ownCanvas]) c.width = c.height = 0;
      collected.push({
        id: row.id,
        name: row.name,
        role,
        group,
        rect,
        parity: field.parity,
        removed: field.removed,
        meta: m,
        actual,
      });
    }
    return collected;
  } finally {
    full && (full.width = full.height = 0);
    background && (background.width = background.height = 0);
    delete globalThis.__m21HeadingObserver;
    lease.dispose();
  }
}
function paint(field, a) {
  const { cx, window: win, meta: m } = field;
  cx.reset();
  cx.putImageData(field.base, 0, 0);
  setup(cx, m, [win.x, win.y]);
  const drawn = draw(cx, m, a);
  const native = cx.getImageData(0, 0, win.width, win.height);
  return { native, gray: nativeGrayCrop(native, field.rect, win.origin), drawn };
}
export function fitHeadingFields() {
  const reports = [];
  for (const role of ['name', 'type'])
    for (const group of ['plate', 'components', 'walker']) {
      const fitted = fields.filter((f) => f.group === group && f.role === role && f.nonfoil),
        controls = fields.filter((f) => f.group === group && f.role === role && !f.nonfoil);
      if (!fitted.length) continue;
      for (const mode of ['precise-shape', 'precise-tracking', 'precise-optical']) {
        const cache = new Map(),
          keys = mode.endsWith('shape')
            ? ['dx', 'dy', 'size', 'sx']
            : ['dx', 'dy', 'size', 'tracking'];
        const evaluate = (a, own = false, list = fitted) => {
          const key = JSON.stringify([a, own, list === fitted ? 'fit' : 'control']);
          if (cache.has(key)) return cache.get(key);
          const rows = list.map((f) => ({
            id: f.id,
            name: f.name,
            number: f.number,
            type: f.meta.text,
            ...(() => {
              const p = paint(f, a);
              return {
                quality: (own ? f.ownObjective : f.objective).score(p.gray),
                drawn: p.drawn,
              };
            })(),
          }));
          const score = rows.reduce((s, r) => s + r.quality.score, 0) / Math.max(1, rows.length);
          const result = { adjustment: a, score, rows };
          cache.set(key, result);
          return result;
        };
        const bounds = {
          dx: [-2, 2],
          dy: [-2, 2],
          size: [0.94, 1.08],
          sx: [0.94, 1.04],
          tracking: [-0.8, 0.3],
        };
        const search = (seed, own = false) => {
          let best = evaluate(seed, own);
          for (const step of [
            { dx: 0.5, dy: 0.5, size: 0.02, sx: 0.02, tracking: 0.2 },
            { dx: 0.25, dy: 0.25, size: 0.005, sx: 0.005, tracking: 0.05 },
          ]) {
            for (let n = 0; n < 40; n++) {
              let next = best;
              for (const k of keys)
                for (const sign of [-1, 1]) {
                  const a = {
                    ...best.adjustment,
                    [k]: +(best.adjustment[k] + sign * step[k]).toFixed(5),
                  };
                  if (a[k] < bounds[k][0] || a[k] > bounds[k][1]) continue;
                  const r = evaluate(a, own);
                  if (r.score > next.score + 1e-7) next = r;
                }
              if (next === best) break;
              if (n === 39) throw Error('Heading fit did not settle');
              best = next;
            }
          }
          return best;
        };
        const baseline = evaluate(zero),
          control = search(zero, true);
        const seed = { ...zero, precision: 1, optical: mode.endsWith('optical') ? 1 : 0 };
        const starts = [seed, { ...seed, dy: 0.5, size: 1.02 }];
        const selected = starts.map((a) => search(a)).sort((a, b) => b.score - a.score)[0];
        reports.push({
          role,
          group,
          mode,
          count: fitted.length,
          unfittedControls: controls.length,
          baseline,
          control,
          selected,
          baselineTransfers: controls.length ? evaluate(zero, false, controls) : null,
          transfers: controls.length ? evaluate(selected.adjustment, false, controls) : null,
          atBoundary: keys.filter((k) => bounds[k].includes(selected.adjustment[k])),
          candidates: cache.size,
        });
      }
    }
  return {
    reports,
    fields: fields.map(
      ({ id, name, number, group, kind, role, meta, actual, rect, parity, removed }) => ({
        id,
        name,
        number,
        group,
        kind,
        role,
        meta,
        actual,
        rect,
        parity,
        removed,
      }),
    ),
    scope:
      'Fixed native 1.5x M21 headings, painted by the actual production helper onto the complete pipeline with only that heading erased. Native crop parity checked before search. Background keylines are masked once, before candidates. One shared geometry/tracking fit per source family; foil-only references are transfer controls, never fitting samples.',
  };
}

export function exportHeadingFields() {
  return fields.map((f) => ({
    id: f.id,
    name: f.name,
    number: f.number,
    nonfoil: f.nonfoil,
    role: f.role,
    group: f.group,
    kind: f.kind,
    meta: f.meta,
    actual: f.actual,
    rect: f.rect,
    window: f.window,
    removed: f.removed,
    parity: f.parity,
    base: { width: f.base.width, height: f.base.height, data: Array.from(f.base.data) },
    reference: Array.from(f.reference),
    ownGray: Array.from(f.ownGray),
    mask: Array.from(f.mask),
  }));
}
export function importHeadingFields(rows) {
  if (fields.length) throw Error('Do not mix cached and newly captured fields');
  for (const f of rows) {
    const base = new ImageData(Uint8ClampedArray.from(f.base.data), f.base.width, f.base.height);
    const crop = canvas(base.width, base.height),
      cx = crop.getContext('2d', { willReadFrequently: true });
    const mask = Uint8Array.from(f.mask),
      reference = Float32Array.from(f.reference),
      ownGray = Float32Array.from(f.ownGray);
    const field = {
      ...f,
      base,
      crop,
      cx,
      mask,
      reference,
      ownGray,
      objective: new TextFilledObjective(reference, f.rect[2], f.rect[3], mask),
      ownObjective: new TextFilledObjective(ownGray, f.rect[2], f.rect[3], mask),
    };
    const check = paint(field, zero);
    for (let i = 0; i < check.gray.length; i++)
      if (check.gray[i] !== ownGray[i])
        throw Error('Cached native heading parity changed ' + f.name);
    fields.push(field);
  }
  return fields.length;
}

/** Compare the selected crop trial to the complete production face, not just
 * another invocation of the crop painter. This detects integration drift. */
export async function validateHeadingAdoption(rows) {
  const reports = [];
  for (const row of rows) {
    const f = fields.find((f) => f.id === row.id && f.role === row.role);
    if (!f) throw Error('Missing heading validation case');
    const painted = paint(f, row.adjustment);
    const source = await image(row.native);
    const target = canvas(f.window.width, f.window.height);
    const c = target.getContext('2d', { willReadFrequently: true });
    c.drawImage(
      source,
      f.window.x,
      f.window.y,
      f.window.width,
      f.window.height,
      0,
      0,
      target.width,
      target.height,
    );
    const actual = c.getImageData(0, 0, target.width, target.height);
    let changed = 0,
      maxDelta = 0;
    for (let i = 0; i < actual.data.length; i++) {
      const delta = Math.abs(actual.data[i] - painted.native.data[i]);
      if (delta) {
        changed++;
        maxDelta = Math.max(maxDelta, delta);
      }
    }
    const metric = f.objective.score(painted.gray);
    reports.push({
      id: f.id,
      name: f.name,
      role: f.role,
      group: f.group,
      changedChannels: changed,
      maxDelta,
      metric,
    });
    target.width = target.height = 0;
    if (maxDelta > 1)
      throw Error(
        'Production heading differs from selected trial ' + JSON.stringify(reports.at(-1)),
      );
  }
  return reports;
}
