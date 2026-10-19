import '../../src/data/eager.ts';
import '../../src/data/eager-wording.ts';
import { composeCardTexture } from '../../src/presentation/canvas-face.ts';
import { loadCanvasImages, canvasAssetUrls } from '../../src/presentation/canvas-assets.ts';
import { JsTextObjective, nativeGrayCrop } from './abu-type-objective.mjs';
import { cropGray } from './pixels-pure.mjs';
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
    lease = await loadCanvasImages(canvasAssetUrls(e.face), signal),
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
    blank = await composeCardTexture(input, 'inspect', signal, hooks);
  } finally {
    delete globalThis.__abuManaCapture;
    delete globalThis.__abuManaAdjustment;
  }
  const base = Object.assign({}, adjustment),
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
  let parity = 0;
  try {
    for (const candidate of candidates) {
      for (const k of Object.keys(adjustment)) delete adjustment[k];
      Object.assign(adjustment, base);
      const d = candidate.delta;
      for (const k of ['dx', 'dy', 'spacing']) adjustment[k] = (base[k] ?? 0) + (d[k] ?? 0);
      for (const k of ['scaleX', 'scaleY']) adjustment[k] = (base[k] ?? 1) * (d[k] ?? 1);
      const { c, paint, m, state } = retained;
      c.resetTransform();
      c.clearRect(0, 0, blank.width, blank.height);
      c.drawImage(backup, 0, 0);
      c.save();
      c.setTransform(...m);
      Object.assign(c, state);
      paint();
      c.restore();
      const raster = pixels(blank);
      if (candidate.name === 'current') {
        const original = pixels(native);
        for (let i = 0; i < original.data.length; i++)
          parity = Math.max(parity, Math.abs(original.data[i] - raster.data[i]));
        if (parity !== 0) throw Error('Cost callback is not byte-identical: ' + parity);
      }
      scores.push(objective.score(nativeGrayCrop(raster, rect))[0]);
    }
    return { parity, nativePng: native.toDataURL().split(',')[1], scores };
  } finally {
    objective.free();
    lease.dispose();
    for (const c of [native, blank, backup, scan]) c.width = c.height = 0;
  }
}
