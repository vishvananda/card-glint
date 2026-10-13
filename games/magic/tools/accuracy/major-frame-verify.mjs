import { PNG } from 'pngjs';
import { cacheRoot, hash, readJson, writeJson, sourceHash, root } from './common.mjs';
import { readObject } from './cache.mjs';
import { openBrowser } from './browser.mjs';
import { normalize, cropGray } from './pixels-pure.mjs';
import { compareRegion } from './metrics.mjs';
import { fetchComponents } from './components.mjs';
import { calibrationGroups } from './major-calibration-groups.mjs';

// Test the renderer's existing horizontal-inset parameter. No new asset warp,
// per-card geometry, or scan refitting is used. Propose from calibration rail
// residuals only; reserve different names for production-raster validation.
const directory = `${cacheRoot}/rollout/major-calibration`;
const plan = await readJson(`${cacheRoot}/rollout/major-calibration-plan.json`);
const rendererHash = await sourceHash(`${root}/games/magic/src`);
const session = await openBrowser({ entries: [], components: [] });
session.addAssets((await readJson(`${cacheRoot}/rollout/early-hsb.json`)).components);
session.addAssets(await fetchComponents([], {}));
let instrumented = false;
await session.page.route(
  '**/games/magic/src/presentation/normal-frame-geometry.ts*',
  async (route) => {
    const response = await route.fetch();
    const original = await response.text();
    const marker = 'export function normalFrameInset(face) {';
    if (!original.includes(marker)) throw Error('Inset observation hook changed');
    const body = original.replace(
      marker,
      `${marker}\nif (typeof globalThis.__majorFrameInset === 'number') return globalThis.__majorFrameInset;`,
    );
    instrumented = true;
    await route.fulfill({ response, body });
  },
);
const mean = (values) => values.reduce((n, v) => n + v, 0) / values.length;
try {
  for (const group of calibrationGroups(plan.rows, process.argv.slice(2)).filter(
    (g) => g.family === 'component',
  )) {
    const key = group.key.replaceAll('/', '-');
    let measured;
    try {
      measured = await readJson(`${directory}/${key}-measure.json`);
    } catch (e) {
      if (e.code === 'ENOENT') continue;
      throw e;
    }
    const left = measured.frame.rulesLeft,
      right = measured.frame.rulesRight;
    if (![left, right].every((p) => p.calibration >= 3 && p.validation >= 3)) continue;
    // Shared insets cannot repair a translated or asymmetric source frame.
    const delta = Math.round(left.fit - right.fit) / 2;
    if (Math.abs(left.fit + right.fit) > 1.5 || Math.abs(delta) < 0.5) continue;
    const baseline = ['m15', 'm19', 'm20', 'war'].includes(group.set) ? 1.5 : 0;
    const inset = baseline + delta;
    if (inset < 0 || inset > 3) continue;
    const measurementHash = hash(JSON.stringify(measured));
    try {
      const prior = await readJson(`${directory}/${key}-frame-verified.json`);
      if (prior.rendererHash === rendererHash && prior.measurementHash === measurementHash) {
        console.log('cached', key);
        continue;
      }
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }
    const capture = await readJson(`${directory}/${key}.json`);
    if (
      capture.rendererHash !== rendererHash ||
      hash(JSON.stringify(capture)) !== measured.captureHash
    )
      throw Error('Stale frame capture');
    const rows = [];
    for (const sample of capture.samples) {
      const comparison = measured.rows.find((r) => r.id === sample.id);
      if (!comparison?.fit?.accepted) continue;
      session.addAssets([sample.reference, sample.art, ...sample.components]);
      const exports = await session.page.evaluate(
        async ({ face, inset }) => {
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
          const images = [];
          try {
            for (const candidate of [undefined, inset]) {
              globalThis.__majorFrameInset = candidate;
              const canvas = await composeCardTexture(
                { face, printingId: null, printedImage: null },
                'inspect',
                new AbortController().signal,
                { loadImages: async () => ({ images: loaded.images, dispose() {} }) },
              );
              images.push(canvas.toDataURL());
              canvas.width = canvas.height = 0;
            }
            return images;
          } finally {
            delete globalThis.__majorFrameInset;
            loaded.dispose();
          }
        },
        { face: sample.face, inset },
      );
      if (!instrumented) throw Error('Inset hook did not execute');
      const referenceBytes = await readObject(sample.reference);
      if (
        hash(referenceBytes) !== comparison.referenceHash ||
        comparison.fitHash !== hash(JSON.stringify(comparison.fit))
      )
        throw Error('Frame pose identity changed');
      const reference = normalize(PNG.sync.read(referenceBytes), comparison.fit.transform);
      const scores = exports.map((url) => {
        const bytes = Buffer.from(url.split(',')[1], 'base64');
        const rendered = normalize(PNG.sync.read(bytes));
        const sides = [
          [25, 440, 22, 135],
          [439, 440, 25, 135],
        ].map((rect) => {
          const a = cropGray(reference, rect),
            b = cropGray(rendered, rect);
          const m = compareRegion(a.gray, b.gray, rect[2], rect[3]);
          return {
            f1: m.edgeF1?.[1] ?? 0,
            exact: m.edgeF1?.[0] ?? 0,
            distance: m.meanDistance ?? 20,
          };
        });
        return {
          sha256: hash(bytes),
          sides,
          f1: mean(sides.map((m) => m.f1)),
          exact: mean(sides.map((m) => m.exact)),
          distance: mean(sides.map((m) => m.distance)),
        };
      });
      rows.push({
        id: sample.id,
        name: sample.name,
        cohort: sample.cohort,
        material: sample.material,
        normalizationHash: comparison.fitHash,
        referenceHash: comparison.referenceHash,
        before: scores[0],
        after: scores[1],
      });
    }
    const reserved = rows.filter((r) => r.cohort === 'validation');
    const average = (key, field) => mean(reserved.map((r) => r[key][field]));
    const flags = [];
    if (reserved.length < 3) flags.push('sparse-validation');
    if (average('after', 'f1') - average('before', 'f1') < 0.005) flags.push('no-reserved-gain');
    if (average('after', 'distance') > average('before', 'distance') - 0.02)
      flags.push('no-distance-gain');
    if (reserved.some((r) => r.after.f1 < r.before.f1 - 0.02)) flags.push('reserved-regression');
    if (rows.some((r) => r.after.sides.some((s, i) => s.f1 < r.before.sides[i].f1 - 0.04)))
      flags.push('side-regression');
    const report = {
      schemaVersion: 1,
      key: group.key,
      rendererHash,
      measurementHash,
      inset,
      baseline,
      status: flags.length ? 'review' : 'validated',
      flags,
      before: average('before', 'f1'),
      after: average('after', 'f1'),
      rows,
    };
    await writeJson(`${directory}/${key}-frame-verified.json`, report);
    console.log(key, report.status, inset, report.before, report.after, flags);
  }
  if ((await sourceHash(`${root}/games/magic/src`)) !== rendererHash)
    throw Error('Renderer changed during frame verification');
} finally {
  await session.close();
}
