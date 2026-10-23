import { ordinaryTextLayout, paintRulesLayout } from '../../src/presentation/rules-paint.ts';
import { loadCanvasFonts } from '../../src/presentation/canvas-assets.ts';
import { faceManaAssets } from '../../src/presentation/mana-assets.ts';
import { faceRects, faceFrame } from '../../src/presentation/special-frames.ts';
import { plateBasicSymbol } from '../../src/presentation/plate-basic-land.ts';
import { mountedSecurityStamp } from '../../src/presentation/security-stamp-paint.ts';
import { loadAccuracyImages } from './abu-assets.mjs';
import { TextFilledObjective } from './text-filled-objective.mjs';
import { nativeGrayCrop } from './abu-type-objective.mjs';
import { nativeTextWindow } from './native-text-window.mjs';

// Full rules/flavor area. Reference exclusions are fixed from semantic badges;
// no card is normalized or moved to improve a text candidate.
const RECT = [39, 430, 410, 200];
const visible = (layout) =>
  layout.lines
    .flatMap((l) => l.runs.map((r) => r.text))
    .join('')
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/\s/g, '');
export async function prepareRulesStudy(fonts) {
  await import('../../src/data/eager.ts');
  await loadCanvasFonts();
  for (const font of fonts)
    document.fonts.add(
      await new FontFace(font.family, 'url("' + font.url + '")', {
        style: font.style ?? 'normal',
        weight: font.weight ?? '400',
      }).load(),
    );
}
export function supportsRulesStudy(face) {
  return (
    face.frameStyle !== 'retro' &&
    !face.frameTemplate &&
    faceFrame(face) === 'normal' &&
    !plateBasicSymbol(face) &&
    (!face.layout || face.layout === 'normal')
  );
}
export async function measureRulesStudy(face, referenceUrl, candidates) {
  const reference = await new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = referenceUrl;
  });
  if (reference.naturalWidth !== 488 || reference.naturalHeight !== 680)
    throw Error('Text study requires the frozen canonical scan');
  const scan = document.createElement('canvas');
  scan.width = 488;
  scan.height = 680;
  const sc = scan.getContext('2d', { willReadFrequently: true });
  sc.drawImage(reference, 0, 0);
  const [rx, ry, w, h] = RECT,
    pixels = sc.getImageData(rx, ry, w, h).data;
  const gray = Float32Array.from(
    { length: w * h },
    (_, i) => 0.2126 * pixels[4 * i] + 0.7152 * pixels[4 * i + 1] + 0.0722 * pixels[4 * i + 2],
  );
  const mask = new Uint8Array(w * h).fill(1),
    rects = faceRects(face),
    stamp = mountedSecurityStamp(face);
  const exclude = ([x, y, sw, sh]) => {
    for (
      let py = Math.max(0, Math.floor(y - ry - 2));
      py < Math.min(h, Math.ceil(y + sh - ry + 2));
      py++
    )
      for (
        let px = Math.max(0, Math.floor(x - rx - 2));
        px < Math.min(w, Math.ceil(x + sw - rx + 2));
        px++
      )
        mask[py * w + px] = 0;
  };
  if (face.power != null && face.toughness != null)
    exclude(rects.stats.map((v, i) => v * (i % 2 ? 680 : 488)));
  if (stamp) exclude(stamp.rect);
  const objective = new TextFilledObjective(gray, w, h, mask);
  const canvas = document.createElement('canvas');
  canvas.width = 732;
  canvas.height = 1020;
  const c = canvas.getContext('2d', { willReadFrequently: true }),
    window = nativeTextWindow(RECT, [0, 0], [732, 1020]);
  const lease = await loadAccuracyImages(faceManaAssets(face), new AbortController().signal);
  const rows = [];
  let expected;
  try {
    globalThis.__modernRulesStudy = {};
    const baselineSize = ordinaryTextLayout(c, face).size;
    for (const candidate of candidates) {
      globalThis.__modernRulesStudy = candidate.adjustment.retainSize
        ? {
            ...candidate.adjustment,
            maximumSize: Math.min(baselineSize, candidate.adjustment.maximumSize ?? baselineSize),
          }
        : candidate.adjustment;
      c.resetTransform();
      c.fillStyle = '#fff';
      c.fillRect(0, 0, 732, 1020);
      c.scale(1.5, 1.5);
      const layout = ordinaryTextLayout(c, face);
      const content = visible(layout);
      expected ??= content;
      if (content !== expected)
        throw Error('Text study lost content: ' + face.name + '/' + candidate.id);
      if (layout.overflow) {
        rows.push({ id: candidate.id, invalid: true, reason: 'overflow' });
        continue;
      }
      if (!layout.lines.length) {
        rows.push({ id: candidate.id, invalid: true, reason: 'empty' });
        continue;
      }
      paintRulesLayout(c, layout, lease.images);
      const image = c.getImageData(window.x, window.y, window.width, window.height);
      const result = objective.score(nativeGrayCrop(image, RECT, window.origin));
      rows.push({
        id: candidate.id,
        invalid: result.score < 0,
        ...result,
        size: layout.size,
        lineCount: layout.lines.length,
        left: layout.x,
        top: layout.top,
        width: layout.width,
        height: layout.height,
      });
    }
    return {
      region: RECT,
      excludedPixels: mask.length - sum(mask),
      referenceEdges: objective.count,
      trials: rows,
    };
  } finally {
    delete globalThis.__modernRulesStudy;
    lease.dispose();
    scan.width = scan.height = canvas.width = canvas.height = 0;
  }
}
const sum = (values) => values.reduce((a, b) => a + b, 0);
