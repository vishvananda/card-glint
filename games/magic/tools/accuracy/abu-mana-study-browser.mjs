import '../../src/data/eager.ts';
import '../../src/data/eager-wording.ts';
import { composeCardTexture } from '../../src/presentation/canvas-face.ts';
import { loadAccuracyImages } from './abu-assets.mjs';
import { canvasAssetUrls } from '../../src/presentation/canvas-assets.ts';
import { JsTextObjective, nativeGrayCrop } from './abu-type-objective.mjs';
import { cropGray } from './pixels-pure.mjs';
import { printingManaAdjustment } from '../../src/presentation/printing-mana-adjustment.ts';
import { modernCostMana } from '../../src/presentation/modern-cost-mana.ts';
import { earlyManaNumeral } from '../../src/presentation/early-expansion-mana.ts';
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
const pixels = (c) =>
  c.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, c.width, c.height);
export async function measure(e, url, candidates) {
  const signal = new AbortController().signal,
    lease = await loadAccuracyImages(canvasAssetUrls(e.face), signal, e.face.illustration),
    input = { face: e.face, printingId: e.id, printedImage: null };
  const hooks = { loadImages: async () => ({ ...lease, dispose() {} }) };
  const native = await composeCardTexture(input, 'inspect', signal, hooks);
  let retained, adjustment;
  globalThis.__abuManaAdjustment = (a) => (adjustment = a);
  globalThis.__abuManaCapture = (c, element, paint) => {
    if (element !== 'manaCost') return false;
    const m = c.getTransform();
    retained = {
      c,
      paint,
      m: [m.a, m.b, m.c, m.d, m.e, m.f],
      state: Object.fromEntries(properties.map((k) => [k, c[k]])),
    };
    return true;
  };
  let blank;
  try {
    // Enable decomposition once during preparation, even when the actual
    // baseline has no glyph/numeral override. Painting below restores its real
    // parameters and hides the extra numeral map for an unadjusted baseline.
    const user = e.face.symbolAdjustment?.mana ?? {};
    const preparedFace = {
      ...e.face,
      symbolAdjustment: {
        ...e.face.symbolAdjustment,
        mana: {
          ...user,
          numberDx: (user.numberDx ?? 0) + 0.000001,
          glyphs: Object.fromEntries(
            ['W', 'U', 'B', 'R', 'G'].map((s) => [s, { ...user.glyphs?.[s], scale: 1.000001 }]),
          ),
        },
      },
    };
    blank = await composeCardTexture({ ...input, face: preparedFace }, 'inspect', signal, hooks);
  } finally {
    delete globalThis.__abuManaCapture;
    delete globalThis.__abuManaAdjustment;
  }
  const base = { ...printingManaAdjustment(e.face) },
    backup = document.createElement('canvas');
  backup.width = blank.width;
  backup.height = blank.height;
  backup.getContext('2d').drawImage(blank, 0, 0);
  const scanImage = new Image();
  scanImage.src = url;
  await scanImage.decode();
  const scan = document.createElement('canvas');
  scan.width = 488;
  scan.height = 680;
  scan.getContext('2d').drawImage(scanImage, 0, 0);
  const count = e.face.manaSymbols.length,
    left = Math.floor(432 - (count - 1) * 28 - 19),
    rect = [left, 25, 458 - left, 43];
  const objective = new JsTextObjective(cropGray(pixels(scan), rect).gray, rect[2], rect[3]);
  const scores = [];
  const origin = [Math.floor(rect[0] * 1.5) - 1, Math.floor(rect[1] * 1.5) - 1];
  const readWidth = Math.ceil((rect[0] + rect[2]) * 1.5) + 1 - origin[0];
  const readHeight = Math.ceil((rect[1] + rect[3]) * 1.5) + 1 - origin[1];
  let parity = 0,
    regionParity = 0;
  let preparedImages;
  globalThis.__manaStudyImages = (images) => {
    preparedImages = images;
  };
  try {
    retained.paint();
  } finally {
    delete globalThis.__manaStudyImages;
  }
  const numerals = preparedImages?.manaNumerals;
  const historical = earlyManaNumeral(e.face),
    modern = modernCostMana(e.face);
  const numericActive = (a) =>
    !historical && (!!modern || !!(a.numberDx || a.numberDy) || (a.numberScale ?? 1) !== 1);
  const effects = [];
  let baselineRaster,
    candidateParity = null;
  const sentinels = new Map(),
    candidateParities = {};
  try {
    for (const candidate of candidates) {
      for (const k of Object.keys(adjustment)) delete adjustment[k];
      Object.assign(adjustment, base);
      const d = candidate.delta;
      for (const k of ['dx', 'dy', 'spacing']) adjustment[k] = (base[k] ?? 0) + (d[k] ?? 0);
      for (const k of ['scaleX', 'scaleY']) adjustment[k] = (base[k] ?? 1) * (d[k] ?? 1);
      for (const k of ['numberDx', 'numberDy']) adjustment[k] = (base[k] ?? 0) + (d[k] ?? 0);
      adjustment.numberScale = (base.numberScale ?? 1) * (d.numberScale ?? 1);
      if (d.glyph) {
        const symbol = e.face.manaSymbols.at(-1);
        if (['W', 'U', 'B', 'R', 'G'].includes(symbol)) {
          const old = base.glyphs?.[symbol] ?? {};
          adjustment.glyphs = {
            ...base.glyphs,
            [symbol]: {
              scale: (old.scale ?? 1) * d.glyph.scale,
              dx: (old.dx ?? 0) + d.glyph.dx,
              dy: (old.dy ?? 0) + d.glyph.dy,
            },
          };
        }
      }
      if (preparedImages)
        preparedImages.manaNumerals = numericActive(adjustment) ? numerals : undefined;
      const { c, paint, m, state } = retained;
      c.resetTransform();
      c.clearRect(0, 0, blank.width, blank.height);
      c.drawImage(backup, 0, 0);
      c.save();
      c.setTransform(...m);
      Object.assign(c, state);
      paint();
      c.restore();
      if (candidate.name === 'current') {
        const raster = pixels(blank),
          original = pixels(native);
        for (let i = 0; i < original.data.length; i++)
          parity = Math.max(parity, Math.abs(original.data[i] - raster.data[i]));
        if (parity !== 0) throw Error('Cost callback is not byte-identical: ' + parity);
        const complete = nativeGrayCrop(raster, rect);
        const cropped = retained.c.getImageData(origin[0], origin[1], readWidth, readHeight);
        const local = nativeGrayCrop(cropped, rect, origin);
        for (let i = 0; i < complete.length; i++)
          regionParity = Math.max(regionParity, Math.abs(complete[i] - local[i]));
        if (regionParity !== 0)
          throw Error('Regional readback changed sampling phase: ' + regionParity);
      }
      const raster = retained.c.getImageData(origin[0], origin[1], readWidth, readHeight);
      scores.push(objective.score(nativeGrayCrop(raster, rect, origin))[0]);
      if (candidate.name === 'current') baselineRaster = new Uint8ClampedArray(raster.data);
      let changed = 0;
      for (let i = 0; i < raster.data.length; i += 4)
        if ([0, 1, 2, 3].some((k) => raster.data[i + k] !== baselineRaster[i + k])) changed++;
      effects.push(changed);
      const family = candidate.name.startsWith('number/')
        ? 'number'
        : candidate.name.startsWith('glyph/')
          ? 'glyph'
          : 'global';
      const applicable =
        candidate.name !== 'current' &&
        (family === 'number'
          ? e.face.manaSymbols.some((s) => /^\d+$/.test(s))
          : family === 'glyph'
            ? ['W', 'U', 'B', 'R', 'G'].includes(e.face.manaSymbols.at(-1))
            : true);
      if (applicable && !sentinels.has(family))
        sentinels.set(family, { candidate, raster: new Uint8ClampedArray(pixels(blank).data) });
    }
    for (const [family, sentinel] of sentinels) {
      const d = sentinel.candidate.delta,
        user = e.face.symbolAdjustment?.mana ?? {},
        mana = { ...user };
      for (const key of ['dx', 'dy', 'spacing'])
        if (d[key] !== undefined) mana[key] = (user[key] ?? 0) + d[key];
      for (const key of ['scaleX', 'scaleY'])
        if (d[key] !== undefined) mana[key] = (user[key] ?? 1) * d[key];
      for (const key of ['numberDx', 'numberDy'])
        if (d[key] !== undefined) mana[key] = (user[key] ?? 0) + d[key];
      if (d.numberScale !== undefined) mana.numberScale = (user.numberScale ?? 1) * d.numberScale;
      if (d.glyph) {
        const s = e.face.manaSymbols.at(-1),
          old = user.glyphs?.[s] ?? {};
        mana.glyphs = {
          ...user.glyphs,
          [s]: {
            scale: (old.scale ?? 1) * d.glyph.scale,
            dx: (old.dx ?? 0) + d.glyph.dx,
            dy: (old.dy ?? 0) + d.glyph.dy,
          },
        };
      }
      const actual = await composeCardTexture(
        { ...input, face: { ...e.face, symbolAdjustment: { ...e.face.symbolAdjustment, mana } } },
        'inspect',
        signal,
        hooks,
      );
      try {
        const data = pixels(actual).data;
        candidateParity = 0;
        for (let i = 0; i < data.length; i++)
          candidateParity = Math.max(candidateParity, Math.abs(data[i] - sentinel.raster[i]));
        candidateParities[family] = candidateParity;
        if (candidateParity !== 0)
          throw Error('Prepared trial differs from actual native candidate: ' + candidateParity);
      } finally {
        actual.width = actual.height = 0;
      }
    }
    for (const kind of ['number/', 'glyph/']) {
      const applicable =
        kind === 'number/'
          ? e.face.manaSymbols.some((s) => /^\d+$/.test(s))
          : ['W', 'U', 'B', 'R', 'G'].includes(e.face.manaSymbols.at(-1));
      const indexes = candidates.flatMap((c, i) => (c.name.startsWith(kind) ? [i] : []));
      if (applicable && indexes.length && !indexes.some((i) => effects[i] > 0))
        throw Error('Calibration control produced no pixel changes: ' + kind);
    }
    return {
      parity,
      regionParity,
      candidateParity,
      candidateParities,
      effects,
      trialReadbackPixels: readWidth * readHeight,
      nativePng: native.toDataURL().split(',')[1],
      scores,
    };
  } finally {
    objective.free();
    lease.dispose();
    for (const c of [native, blank, backup, scan]) c.width = c.height = 0;
  }
}
