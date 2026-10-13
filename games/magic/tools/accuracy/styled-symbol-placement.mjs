import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { hash } from './common.mjs';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { normalize, cropGray } from './pixels-pure.mjs';
import { compareRegion } from './metrics.mjs';
// Capture uses a single cached browser session; scoring is pure Node CPU work.
// Timings are not GPU completion measurements. A grid can vary by set code.
const directory = process.argv[2];
if (!directory) throw Error('Usage: styled-symbol-placement.mjs CAPTURE_DIRECTORY [GRID_JSON]');
const dir = path.resolve(directory) + path.sep,
  snapshot = JSON.parse(await readFile(dir + 'snapshot.json')),
  examples = JSON.parse(await readFile(dir + 'examples.json')),
  fits = JSON.parse(await readFile(dir + 'placement-normalization.json'));
const grids = process.argv[3] ? JSON.parse(await readFile(process.argv[3])) : null;
const defaultParams = [];
for (const dx of [-2, -1, 0, 1, 2])
  for (const dy of [-2, -1, 0, 1, 2])
    for (const sx of [0.94, 1, 1.06])
      for (const sy of [0.94, 1, 1.06]) defaultParams.push({ dx, dy, sx, sy });
const session = await openBrowser(snapshot),
  rows = [];
try {
  for (const e of examples) {
    if (!/^[a-z0-9]+-[a-z0-9]+$/.test(e.slug)) throw Error('Unsafe capture slug');
    const saved = fits.find((r) => r.slug === e.slug),
      fit = saved?.fit;
    if (!fit?.accepted) continue;
    const params = grids?.[e.set] ?? (grids ? null : defaultParams);
    if (!params) continue;
    if (saved.resultHash !== hash(JSON.stringify(fit)))
      throw Error('Frozen frame transform changed');
    const referenceBytes = await readFile(dir + e.slug + '-reference.png');
    if (
      saved.identity.reference !== hash(referenceBytes) ||
      saved.identity.template !== hash(await readFile(dir + e.slug + '-before.png'))
    )
      throw Error('Normalization source identity changed');
    const face = { ...e.face, frameAssetFamily: e.family, setSymbolSource: 'auto' },
      rect = [382, 385, 74, 33];
    const ref = cropGray(normalize(PNG.sync.read(referenceBytes), fit.transform), rect);
    const capture = await session.page.evaluate(
      async ({ face, params, rect }) => {
        const { composeCardTexture, cardTextureKey } = await import(
          '/games/magic/src/presentation/canvas-face.ts'
        );
        const { loadCanvasImages, canvasAssetUrls } = await import(
          '/games/magic/src/presentation/canvas-assets.ts'
        );
        const { framePlate } = await import('/games/magic/src/presentation/frame-plates.ts');
        const { paintSetSymbol } = await import('/games/magic/src/presentation/canvas-text.ts');
        const { paintShapedSetSymbol, shapedSetCode } = await import(
          '/games/magic/src/presentation/shaped-set-symbol.ts'
        );
        const { paintCoreSetSymbol, hasCoreSetShield } = await import(
          '/games/magic/src/presentation/core-set-symbol.ts'
        );
        const { faceSetSymbol } = await import('/games/magic/src/presentation/assets.ts');
        const { setSymbolCrop } = await import('/games/magic/src/presentation/set-symbols.ts');
        const { isStyledSetSymbol } = await import(
          '/games/magic/src/presentation/styled-set-symbols.ts'
        );
        const sig = new AbortController().signal,
          loaded = await loadCanvasImages(canvasAssetUrls(face), sig),
          images = loaded.images,
          blank = await composeCardTexture(
            {
              face: { ...face, setCode: '', setSymbol: undefined },
              printingId: null,
              printedImage: null,
            },
            'inspect',
            sig,
          ),
          plate = framePlate(face),
          url = faceSetSymbol(face),
          icon = images.get(url),
          crop = setSymbolCrop(face),
          f = Math.min(
            (plate.symbol.width * 488) / (icon.width * crop[2]),
            (plate.symbol.height * 680) / (icon.height * crop[3]),
          ),
          iw = icon.width * crop[2] * f,
          ih = icon.height * crop[3] * f,
          shaped = shapedSetCode(face),
          canvas = document.createElement('canvas');
        canvas.width = rect[2] * 2;
        canvas.height = rect[3] * 2;
        const c = canvas.getContext('2d');
        c.scale(2, 2);
        c.translate(-rect[0], -rect[1]);
        const output = [];
        for (const p of params) {
          c.clearRect(...rect);
          c.drawImage(blank, 0, 0, 488, 680);
          const w = iw * p.sx,
            h = ih * p.sy,
            b = [
              plate.symbol.right * 488 + p.dx - w,
              plate.symbol.center * 680 + p.dy - h / 2,
              w,
              h,
            ];
          if (isStyledSetSymbol(url)) c.drawImage(icon, ...b);
          else if (hasCoreSetShield(face))
            paintCoreSetSymbol(c, icon, face.rarity, ...b, crop, 1.5);
          else if (shaped) paintShapedSetSymbol(c, icon, shaped, face.rarity, ...b, crop, false);
          else paintSetSymbol(c, icon, face.setCode, face.rarity, ...b, crop);
          output.push(canvas.toDataURL());
        }
        blank.width = blank.height = canvas.width = canvas.height = 0;
        loaded.dispose();
        return {
          rasters: output,
          baseline: plate.symbol,
          key: cardTextureKey({ face, printingId: null, printedImage: null }, 'inspect'),
        };
      },
      { face, params, rect },
    );
    const scores = capture.rasters.map((url, i) => {
      const png = PNG.sync.read(Buffer.from(url.split(',')[1], 'base64'));
      const data = new Uint8Array(rect[2] * rect[3] * 4);
      for (let y = 0; y < rect[3]; y++)
        for (let x = 0; x < rect[2]; x++)
          for (let c = 0; c < 4; c++)
            data[(y * rect[2] + x) * 4 + c] = Math.round(
              (png.data[(y * 2 * png.width + x * 2) * 4 + c] +
                png.data[(y * 2 * png.width + x * 2 + 1) * 4 + c] +
                png.data[((y * 2 + 1) * png.width + x * 2) * 4 + c] +
                png.data[((y * 2 + 1) * png.width + x * 2 + 1) * 4 + c]) /
                4,
            );
      const crop = cropGray({ width: rect[2], height: rect[3], data }, [0, 0, rect[2], rect[3]]);
      const score = compareRegion(ref.gray, crop.gray, rect[2], rect[3]);
      return { ...params[i], f1: score.edgeF1?.[1] ?? 0, distance: score.meanDistance };
    });
    rows.push({
      slug: e.slug,
      family: e.family,
      rect,
      identity: saved.identity,
      normalizationHash: saved.resultHash,
      baseline: capture.baseline,
      renderKey: capture.key,
      scores,
    });
    console.log(e.slug, [...scores].sort((a, b) => b.f1 - a.f1)[0]);
  }
  if (session.faults.length) throw Error(session.faults.join('\n'));
  await writeFile(
    dir + 'styled-symbol-placement.json',
    JSON.stringify({ schemaVersion: 1, rows }, null, 2),
  );
} finally {
  await session.close();
}
