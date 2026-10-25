// Compare pinned source families against renderer-independent scan poses.
// This diagnostic does not approve a set or apply scan transforms to rendering.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { root, hash, readJson, writeJson, sourceHash } from './common.mjs';
import { cachedFetch, readObject } from './cache.mjs';
import { openBrowser } from './browser.mjs';
import { normalize } from './pixels-pure.mjs';
import { frameProfiles } from './frame-family-metrics.mjs';
import { opaqueSupport, scoreOpaqueFamily, FAMILY_SCORE_VERSION } from './frame-family-score.mjs';
import { median } from './metrics.mjs';

const [inputsFile, posesFile, out, geometryFile] = process.argv.slice(2);
assert(out, 'Usage: early-source-family-study.mjs INPUTS POSES OUT [SOURCE_GEOMETRY]');
const inputBytes = await readFile(inputsFile),
  poseBytes = await readFile(posesFile);
const input = JSON.parse(inputBytes),
  poses = JSON.parse(poseBytes);
assert.equal(poses.inputHash, hash(inputBytes), 'Poses belong to different inputs');
const source = await sourceHash(path.join(root, 'games/magic/src'));
assert.equal(input.rendererHash, source, 'Freeze inputs before changing the renderer');
const geometryBytes = geometryFile ? await readFile(geometryFile) : null;
const geometry = geometryBytes ? JSON.parse(geometryBytes) : {};
const manifest = await readJson(path.join(root, 'games/magic/assets.json'));
const basic = { Plains: 'W', Island: 'U', Swamp: 'B', Mountain: 'R', Forest: 'G' };
const keyFor = (e) =>
  e.material === 'L' && basic[e.card.name] ? basic[e.card.name] + 'L' : e.material;
const families = (key) =>
  key.length === 2 && key.endsWith('L') ? ['abu', 'seventh'] : ['abu', 'fourth', 'seventh'];
const entries = input.entries.filter((e) => poses.rows.find((p) => p.id === e.id)?.accepted);
const keys = [...new Set(entries.map(keyFor))],
  assets = [];
for (const key of keys)
  for (const family of families(key)) {
    const folder = family === 'seventh' ? 'seventh/regular' : 'old/' + family;
    const url = manifest.RETRO_ROOT + '/img/frames/' + folder + '/' + key.toLowerCase() + '.png';
    assets.push({
      key,
      family,
      rect:
        geometry[key]?.[family]?.frame ??
        (family === 'fourth' ? [0.012, 0.01, 0.974, 0.982] : [0, 0, 1, 1]),
      ...(await cachedFetch(url, { offline: true })),
    });
  }
await mkdir(path.join(out, 'plates'), { recursive: true });
const session = await openBrowser({ entries: [], components: assets }, { fonts: false });
const plates = new Map();
try {
  for (const asset of assets) {
    const value = await session.page.evaluate(async (asset) => {
      const { loadCanvasImages, canvasAssetWidth } = await import(
        '/games/magic/src/presentation/canvas-assets.ts'
      );
      const lease = await loadCanvasImages([asset.url], new AbortController().signal);
      try {
        const image = lease.images.get(asset.url);
        if (!image) throw Error('Missing source plate');
        const canvas = document.createElement('canvas');
        canvas.width = 732;
        canvas.height = 1020;
        canvas
          .getContext('2d')
          .drawImage(
            image,
            asset.rect[0] * 732,
            asset.rect[1] * 1020,
            asset.rect[2] * 732,
            asset.rect[3] * 1020,
          );
        return {
          width: image.width,
          height: image.height,
          decodeWidth: canvasAssetWidth(asset.url),
          png: canvas.toDataURL('image/png').split(',')[1],
        };
      } finally {
        lease.dispose();
      }
    }, asset);
    assert.equal(value.width, 768, 'Use the production decoded source tier');
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
  keys.map((key) => [
    key,
    opaqueSupport(families(key).map((f) => plates.get(f + '/' + key).image)),
  ]),
);
const rows = [];
for (const e of entries) {
  const pose = poses.rows.find((p) => p.id === e.id),
    key = keyFor(e);
  assert.equal(pose.referenceHash, e.reference.sha256);
  const bytes = await readObject(e.reference);
  assert.equal(hash(bytes), e.reference.sha256);
  const reference = frameProfiles(normalize(PNG.sync.read(bytes), pose.transform));
  rows.push({
    id: e.id,
    name: e.card.name,
    material: e.material,
    key,
    cohort: pose.cohort,
    referenceHash: e.reference.sha256,
    poseHash: hash(JSON.stringify(pose.transform)),
    candidates: Object.fromEntries(
      families(key).map((family) => [
        family,
        scoreOpaqueFamily(
          reference,
          frameProfiles(plates.get(family + '/' + key).image),
          supports[key],
        ),
      ]),
    ),
  });
}
const summarize = (values) => ({
  count: values.length,
  measured: values.filter(Number.isFinite).length,
  median: median(values.filter(Number.isFinite)),
  mean: values.some(Number.isFinite)
    ? values.filter(Number.isFinite).reduce((a, b) => a + b, 0) /
      values.filter(Number.isFinite).length
    : null,
});
const groups = Object.fromEntries(
  keys.map((key) => [
    key,
    {
      count: rows.filter((r) => r.key === key).length,
      support: supports[key],
      families: Object.fromEntries(
        families(key).map((family) => [
          family,
          Object.fromEntries(
            ['calibration', 'validation'].map((cohort) => [
              cohort,
              summarize(
                rows
                  .filter((r) => r.key === key && r.cohort === cohort)
                  .map((r) => r.candidates[family].score),
              ),
            ]),
          ),
        ]),
      ),
    },
  ]),
);
await writeJson(path.join(out, 'family-study.json'), {
  schema: 1,
  status: 'source-family-diagnostic',
  method: FAMILY_SCORE_VERSION,
  scope:
    'Pinned source plates at explicitly recorded source geometry, using production 768px decode and native 732px paint. Each family has identical eroded opaque comparison support. Artwork and lettering are not fitting targets. Independent scan-only per-card poses remain frozen; no HSB is fitted. Scores are regional indices, not whole-card compliance. Geometry must be reviewed separately before selecting a family. Basic variants grouped by name do not constitute independent holdouts.',
  inputHash: hash(inputBytes),
  normalizationHash: hash(poseBytes),
  rendererHash: source,
  ...(geometryBytes ? { sourceGeometryHash: hash(geometryBytes) } : {}),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  dependencies: Object.fromEntries(
    await Promise.all(
      ['frame-family-metrics', 'frame-family-score', 'pixels-pure'].map(async (n) => [
        n,
        hash(await readFile(new URL('./' + n + '.mjs', import.meta.url))),
      ]),
    ),
  ),
  assets: assets.map((a) => ({
    ...a,
    raster: { ...plates.get(a.family + '/' + a.key), image: undefined },
  })),
  groups,
  rows,
});
assert.equal(
  source,
  await sourceHash(path.join(root, 'games/magic/src')),
  'Renderer changed during study',
);
console.log(JSON.stringify({ total: rows.length, groups }));
