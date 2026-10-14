import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import {
  cacheRoot,
  hash,
  readJson,
  writeJson,
  sourceHash,
  root as repositoryRoot,
} from './common.mjs';
import { readObject } from './cache.mjs';
import { openBrowser } from './browser.mjs';
import { normalize, cropGray } from './pixels-pure.mjs';
import { compareRegion } from './metrics.mjs';
import { fetchComponents } from './components.mjs';
import { calibrationGroups } from './major-calibration-groups.mjs';

// Verify candidates with fresh production Canvas exports. The CPU sampler is
// used only to propose parameters; it never supplies the release's final score.
import {
  calibrationDirectory as directory,
  calibrationRevision,
} from './major-calibration-run.mjs';
const plan = await readJson(`${cacheRoot}/rollout/major-calibration-plan.json`);
const root = process.env.MAGIC_CALIBRATION_SOURCE_ROOT ?? repositoryRoot;
const filter = process.argv.slice(2);
const rendererHash = await sourceHash(`${root}/games/magic/src`);
const session = await openBrowser({ entries: [], components: [] }, { sourceRoot: root });
const fonts = await readJson(`${cacheRoot}/rollout/early-hsb.json`);
session.addAssets(fonts.components);
session.addAssets(await fetchComponents([], {}));
try {
  for (const group of calibrationGroups(plan.rows, filter)) {
    const key = group.key.replaceAll('/', '-');
    let measured;
    try {
      measured = await readJson(`${directory}/${key}-measure.json`);
    } catch (e) {
      if (e.code === 'ENOENT') continue;
      throw e;
    }
    if (measured.symbol.status !== 'candidate') continue;
    const measurementHash = hash(JSON.stringify(measured));
    try {
      const prior = await readJson(`${directory}/${key}-verified.json`);
      if (prior.rendererHash === rendererHash && prior.measurementHash === measurementHash) {
        console.log('cached', key);
        continue;
      }
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }
    const capture = await readJson(`${directory}/${key}.json`);
    if (
      (!calibrationRevision && capture.rendererHash !== rendererHash) ||
      hash(JSON.stringify(capture)) !== measured.captureHash
    )
      throw Error('Stale source capture');
    const rows = [];
    for (const sample of capture.samples) {
      const comparison = measured.rows.find((r) => r.id === sample.id);
      if (!comparison?.symbol || !comparison.fit.accepted) continue;
      session.addAssets([sample.reference, sample.art, ...sample.components]);
      const exports = await session.page.evaluate(
        async ({ face, symbol, params }) => {
          const { composeCardTexture } = await import(
            '/games/magic/src/presentation/canvas-face.ts'
          );
          const { loadCanvasImages, canvasAssetUrls } = await import(
            '/games/magic/src/presentation/canvas-assets.ts'
          );
          const loaded = await loadCanvasImages(
            canvasAssetUrls(face),
            new AbortController().signal,
          );
          const icon = loaded.images.get(symbol),
            proto = CanvasRenderingContext2D.prototype,
            original = proto.drawImage;
          const images = [];
          let baselineBounds = null;
          try {
            for (const mode of ['before', 'after', 'blank']) {
              const adjusted = mode === 'after';
              proto.drawImage = function (image, ...args) {
                if (mode === 'before' && image === icon && args.length === 4) baselineBounds = args;
                if (mode === 'blank' && image === icon && args.length === 4) return;
                if (adjusted && image === icon && args.length === 4) {
                  const [x, y, w, h] = args,
                    [dx, dy, sx, sy] = params;
                  return original.call(
                    this,
                    image,
                    x + w + dx - w * sx,
                    y + h / 2 + dy - (h * sy) / 2,
                    w * sx,
                    h * sy,
                  );
                }
                return original.call(this, image, ...args);
              };
              const c = await composeCardTexture(
                { face, printingId: null, printedImage: null },
                'inspect',
                new AbortController().signal,
                { loadImages: async () => ({ images: loaded.images, dispose() {} }) },
              );
              if (mode === 'blank') {
                const small = document.createElement('canvas');
                small.width = 488;
                small.height = 680;
                small.getContext('2d').drawImage(c, 0, 0, 488, 680);
                images.push(small.toDataURL());
                small.width = small.height = 0;
              } else images.push(c.toDataURL());
              c.width = c.height = 0;
            }
            return [...images, baselineBounds];
          } finally {
            proto.drawImage = original;
            loaded.dispose();
          }
        },
        { face: sample.face, symbol: sample.symbol, params: measured.symbol.params },
      );
      const referenceBytes = await readObject(sample.reference);
      if (
        hash(referenceBytes) !== comparison.referenceHash ||
        comparison.fitHash !== hash(JSON.stringify(comparison.fit))
      )
        throw Error('Normalization identity changed');
      const rect = group.family === 'retro' ? [350, 370, 112, 46] : [377, 379, 86, 45];
      const ref = cropGray(
        normalize(PNG.sync.read(referenceBytes), comparison.fit.transform),
        rect,
      );
      // Follow-up capture may predate unrelated title/footer edits. Transfer its
      // frozen frame pose only when every comparison-region pixel of the blank
      // plate is reproduced exactly by the current painter.
      const oldBlankBytes = await readFile(`${directory}/${sample.images.blank.file}`);
      if (hash(oldBlankBytes) !== sample.images.blank.sha256) throw Error('Changed blank capture');
      const oldBlank = cropGray(PNG.sync.read(oldBlankBytes), rect).gray;
      const newBlank = cropGray(
        PNG.sync.read(Buffer.from(exports[2].split(',')[1], 'base64')),
        rect,
      ).gray;
      if (
        JSON.stringify(exports[3]) !== JSON.stringify(sample.bounds) ||
        !oldBlank.every((v, i) => v === newBlank[i])
      ) {
        rows.push({
          id: sample.id,
          name: sample.name,
          cohort: sample.cohort,
          issue: 'comparison-baseline-changed',
        });
        continue;
      }
      const scores = exports.slice(0, 2).map((url) => {
        const bytes = Buffer.from(url.split(',')[1], 'base64'),
          rendered = cropGray(normalize(PNG.sync.read(bytes)), rect);
        const metric = compareRegion(ref.gray, rendered.gray, rect[2], rect[3]);
        return {
          sha256: hash(bytes),
          f1: metric.edgeF1?.[1] ?? 0,
          distance: metric.meanDistance ?? 20,
          census: metric.censusSimilarity ?? 0,
        };
      });
      rows.push({
        id: sample.id,
        name: sample.name,
        cohort: sample.cohort,
        material: sample.material,
        rarity: sample.rarity,
        normalizationHash: comparison.fitHash,
        referenceHash: comparison.referenceHash,
        before: scores[0],
        after: scores[1],
      });
    }
    const validation = rows.filter((r) => r.cohort === 'validation' && !r.issue);
    const mean = (key, field) =>
      validation.reduce((n, r) => n + r[key][field], 0) / Math.max(1, validation.length);
    const before = mean('before', 'f1'),
      after = mean('after', 'f1'),
      flags = [];
    if (rows.some((r) => r.issue)) flags.push('comparison-baseline-changed');
    if (validation.length < 3) flags.push('sparse-validation');
    if (after - before < 0.005) flags.push('no-reserved-gain');
    if (validation.some((r) => r.after.f1 < r.before.f1 - 0.02))
      flags.push('reserved-raster-regression');
    if (rows.some((r) => !r.issue && r.after.f1 < r.before.f1 - 0.04))
      flags.push('development-raster-regression');
    if (mean('after', 'distance') > mean('before', 'distance') + 0.05)
      flags.push('distance-regression');
    const report = {
      schemaVersion: 1,
      key: group.key,
      set: group.set,
      family: group.family,
      border: group.border,
      rendererHash,
      captureRendererHash: capture.rendererHash,
      baselineProof:
        'Exact canonical blank-region grayscale pixels; fixed reference hashes and frame poses.',
      measurementHash,
      status: flags.length ? 'review' : 'validated',
      flags,
      params: measured.symbol.params,
      before,
      after,
      rows,
    };
    await writeJson(`${directory}/${key}-verified.json`, report);
    console.log(key, report.status, before, after, flags);
  }
  if ((await sourceHash(`${root}/games/magic/src`)) !== rendererHash)
    throw Error('Renderer changed during verification');
} finally {
  await session.close();
}
