// Opaque source-plate comparison against independently normalized printing scans.
// No artwork, lettering, color fitting or candidate-dependent scan alignment.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { root, hash, readJson, writeJson, sourceHash } from './common.mjs';
import { cachedFetch } from './cache.mjs';
import { openBrowser } from './browser.mjs';
import { normalize } from './pixels-pure.mjs';
import { frameProfiles } from './frame-family-metrics.mjs';
import { opaqueSupport, scoreOpaqueFamily, FAMILY_SCORE_VERSION } from './frame-family-score.mjs';
import { median } from './metrics.mjs';
const [inputsFile, posesFile, nativeDirectory, out] = process.argv.slice(2);
assert(out, 'Usage: early-frame-family-study.mjs INPUTS POSES NATIVE_CAPTURE OUT');
const rawInputs = await readFile(inputsFile),
  rawPoses = await readFile(posesFile),
  input = JSON.parse(rawInputs),
  poses = JSON.parse(rawPoses),
  captureBytes = await readFile(path.join(nativeDirectory, 'capture.json')),
  capture = JSON.parse(captureBytes),
  manifest = await readJson(path.join(root, 'games/magic/assets.json'));
assert.equal(poses.inputHash, hash(rawInputs));
assert(
  capture.source.inputs.some(
    (r) => r.inputHash === hash(rawInputs) && r.poseHash === hash(rawPoses),
  ),
);
assert.equal(capture.source.rendererHash, await sourceHash(path.join(root, 'games/magic/src')));
const basic = { Plains: 'W', Island: 'U', Swamp: 'B', Mountain: 'R', Forest: 'G' },
  key = (e) =>
    e.material === 'L' ? (basic[e.card.name] ? basic[e.card.name] + 'L' : null) : e.material,
  families = (k) => (k.endsWith('L') ? ['abu', 'seventh'] : ['abu', 'fourth', 'seventh']),
  keys = [...new Set(input.entries.map(key).filter(Boolean))],
  assets = [];
for (const k of keys)
  for (const family of families(k)) {
    const folder = family === 'seventh' ? 'seventh/regular' : 'old/' + family,
      url = manifest.RETRO_ROOT + '/img/frames/' + folder + '/' + k.toLowerCase() + '.png';
    assets.push({
      key: k,
      family,
      rect: family === 'fourth' ? [0.012, 0.01, 0.974, 0.982] : [0, 0, 1, 1],
      ...(await cachedFetch(url, { offline: true })),
    });
  }
await mkdir(path.join(out, 'plates'), { recursive: true });
const session = await openBrowser({ entries: [], components: assets }, { fonts: false }),
  plates = new Map();
try {
  for (const asset of assets) {
    const value = await session.page.evaluate(async (asset) => {
      const { loadCanvasImages, canvasAssetWidth } = await import(
        '/games/magic/src/presentation/canvas-assets.ts'
      );
      const lease = await loadCanvasImages([asset.url], new AbortController().signal);
      try {
        const bitmap = lease.images.get(asset.url);
        if (!bitmap) throw Error('Missing source plate');
        const canvas = document.createElement('canvas');
        canvas.width = 732;
        canvas.height = 1020;
        const c = canvas.getContext('2d');
        c.drawImage(
          bitmap,
          asset.rect[0] * 732,
          asset.rect[1] * 1020,
          asset.rect[2] * 732,
          asset.rect[3] * 1020,
        );
        return {
          width: bitmap.width,
          height: bitmap.height,
          decodeWidth: canvasAssetWidth(asset.url),
          png: canvas.toDataURL('image/png').split(',')[1],
        };
      } finally {
        lease.dispose();
      }
    }, asset);
    assert.equal(value.width, 768);
    const bytes = Buffer.from(value.png, 'base64'),
      file = asset.family + '-' + asset.key + '.png';
    await writeFile(path.join(out, 'plates', file), bytes);
    plates.set(asset.family + '/' + asset.key, {
      image: normalize(PNG.sync.read(bytes)),
      file,
      sha256: hash(bytes),
      width: value.width,
      height: value.height,
    });
  }
  assert.deepEqual(session.faults, []);
} finally {
  await session.close();
}
const supports = Object.fromEntries(
    keys.map((k) => [k, opaqueSupport(families(k).map((f) => plates.get(f + '/' + k).image))]),
  ),
  rows = [];
for (const r of capture.rows) {
  const entry = input.entries.find((e) => e.id === r.id),
    pose = poses.rows.find((p) => p.id === r.id),
    k = key(entry);
  assert.equal(r.referenceHash, entry.reference.sha256);
  assert.equal(r.poseHash, hash(JSON.stringify(pose.transform)));
  if (!k) {
    rows.push({
      id: r.id,
      name: r.name,
      material: entry.material,
      status: 'dual-overlay-separate-geometry-review',
    });
    continue;
  }
  assert.equal(pose.accepted, true);
  const bytes = await readFile(path.join(nativeDirectory, r.set, r.id + '-scan.png'));
  assert.equal(hash(bytes), r.scanHash);
  const reference = frameProfiles(normalize(PNG.sync.read(bytes))),
    candidates = {};
  for (const family of families(k))
    candidates[family] = scoreOpaqueFamily(
      reference,
      frameProfiles(plates.get(family + '/' + k).image),
      supports[k],
    );
  rows.push({
    id: r.id,
    name: r.name,
    key: k,
    cohort: pose.cohort,
    referenceHash: r.referenceHash,
    poseHash: r.poseHash,
    candidates,
  });
}
const summarize = (rr) => {
  const values = rr.map((r) => r.score).filter(Number.isFinite);
  return {
    count: rr.length,
    measured: values.length,
    median: median(values),
    mean: values.length ? values.reduce((a, b) => a + b, 0) / values.length : null,
  };
};
const groups = Object.fromEntries(
  keys.map((k) => {
    const rr = rows.filter((r) => r.key === k),
      cohorts = [...new Set(rr.map((r) => r.cohort))];
    return [
      k,
      {
        count: rr.length,
        support: supports[k],
        families: Object.fromEntries(
          families(k).map((f) => [
            f,
            Object.fromEntries(
              cohorts.map((co) => [
                co,
                summarize(rr.filter((r) => r.cohort === co).map((r) => r.candidates[f])),
              ]),
            ),
          ]),
        ),
      },
    ];
  }),
);
const dependencies = Object.fromEntries(
  await Promise.all(
    ['frame-family-metrics', 'frame-family-score', 'pixels-pure'].map(async (n) => [
      n,
      hash(await readFile(new URL('./' + n + '.mjs', import.meta.url))),
    ]),
  ),
);
await writeJson(path.join(out, 'family-study.json'), {
  schema: 1,
  status: 'source-family-diagnostic',
  method: FAMILY_SCORE_VERSION,
  scope:
    'Existing source families at their established initial geometry, production 768px decode and 732px plate paint. All families share eroded opaque support; artwork interiors do not score. Original independent per-card scan poses remain unchanged. Signed contrast gradients and census scores reduce photometric sensitivity; no HSB is fitted. This study alone does not approve internal geometry or complete a set. Dual overlays remain a separate review. Basic-land variants share a printed name, so their cohort scores are reused-development evidence, not independent-name validation.',
  inputHash: hash(rawInputs),
  normalizationHash: hash(rawPoses),
  captureHash: hash(captureBytes),
  rendererHash: capture.source.rendererHash,
  toolHash: hash(await readFile(new URL(import.meta.url))),
  dependencies,
  assets: assets.map((a) => ({
    ...a,
    raster: { ...plates.get(a.family + '/' + a.key), image: undefined },
  })),
  groups,
  rows,
});
console.log(JSON.stringify({ total: rows.length, groups }));
