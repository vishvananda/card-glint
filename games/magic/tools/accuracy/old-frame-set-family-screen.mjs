// Preliminary asset-family screen, before geometry/color fitting or adoption.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { hash, root, objectFile, writeJson } from './common.mjs';
import { cachedFetch } from './cache.mjs';
import { openBrowser } from './browser.mjs';
import { normalize } from './pixels-pure.mjs';
import { frameProfiles } from './frame-family-metrics.mjs';
import { opaqueSupport, scoreOpaqueFamily, FAMILY_SCORE_VERSION } from './frame-family-score.mjs';
const [inputFile, poseFile, out] = process.argv.slice(2);
assert(out, 'Use INPUTS POSES NEW_OUTPUT');
await fs.access(out).then(
  () => {
    throw Error('Output already exists');
  },
  (e) => {
    if (e.code !== 'ENOENT') throw e;
  },
);
const ib = await fs.readFile(inputFile),
  pb = await fs.readFile(poseFile),
  input = JSON.parse(ib),
  poses = JSON.parse(pb);
assert.equal(poses.inputHash, hash(ib));
const manifest = JSON.parse(await fs.readFile(path.join(root, 'games/magic/assets.json')));
const basic = { Plains: 'W', Island: 'U', Swamp: 'B', Mountain: 'R', Forest: 'G' };
const key = (e) => (e.material === 'L' ? (basic[e.name] ? basic[e.name] + 'L' : 'L') : e.material);
const keys = [...new Set(input.entries.map(key))],
  assets = [];
for (const k of keys) {
  const families =
    k.endsWith('L') && k !== 'L'
      ? ['abu', 'seventh']
      : k === 'M'
        ? ['fourth', 'seventh']
        : ['abu', 'fourth', 'seventh'];
  for (const family of families) {
    const folder = family === 'seventh' ? 'seventh/regular' : 'old/' + family;
    const url = manifest.RETRO_ROOT + '/img/frames/' + folder + '/' + k.toLowerCase() + '.png';
    assets.push({
      key: k,
      family,
      rect: family === 'fourth' ? [0.012, 0.01, 0.974, 0.982] : [0, 0, 1, 1],
      ...(await cachedFetch(url, { offline: true })),
    });
  }
}
const session = await openBrowser({ entries: [], components: assets }, { fonts: false }),
  plates = new Map();
try {
  for (const a of assets) {
    const png = await session.page.evaluate(async (a) => {
      const { loadCanvasImages } = await import('/games/magic/src/presentation/canvas-assets.ts');
      const lease = await loadCanvasImages([a.url], new AbortController().signal);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 732;
        canvas.height = 1020;
        canvas
          .getContext('2d')
          .drawImage(
            lease.images.get(a.url),
            a.rect[0] * 732,
            a.rect[1] * 1020,
            a.rect[2] * 732,
            a.rect[3] * 1020,
          );
        return canvas.toDataURL().split(',')[1];
      } finally {
        lease.dispose();
      }
    }, a);
    plates.set(a.family + '/' + a.key, normalize(PNG.sync.read(Buffer.from(png, 'base64'))));
  }
  assert.deepEqual(session.faults, []);
} finally {
  await session.close();
}
const supports = Object.fromEntries(
  keys.map((k) => [
    k,
    opaqueSupport(assets.filter((a) => a.key === k).map((a) => plates.get(a.family + '/' + k))),
  ]),
);
const rows = [];
for (const e of input.entries) {
  const pose = poses.rows.find((p) => p.id === e.id);
  assert.equal(pose.referenceHash, e.reference.sha256);
  if (!pose.accepted) {
    rows.push({ id: e.id, name: e.name, key: key(e), status: 'rejected-normalization' });
    continue;
  }
  const raw = await fs.readFile(objectFile(e.reference));
  assert.equal(hash(raw), e.reference.sha256);
  const profiles = frameProfiles(normalize(PNG.sync.read(raw), pose.transform)),
    k = key(e);
  rows.push({
    id: e.id,
    name: e.name,
    key: k,
    status: 'measured',
    referenceHash: e.reference.sha256,
    candidates: Object.fromEntries(
      assets
        .filter((a) => a.key === k)
        .map((a) => [
          a.family,
          scoreOpaqueFamily(profiles, frameProfiles(plates.get(a.family + '/' + k)), supports[k]),
        ]),
    ),
  });
}
const groups = Object.fromEntries(
  keys.map((k) => [
    k,
    Object.fromEntries(
      assets
        .filter((a) => a.key === k)
        .map((a) => {
          const all = rows.filter((r) => r.key === k),
            values = all.map((r) => r.candidates?.[a.family]?.score).filter(Number.isFinite);
          return [
            a.family,
            {
              inventory: all.length,
              measured: values.length,
              mean: values.length
                ? (100 * values.reduce((x, y) => x + y, 0)) / values.length
                : null,
            },
          ];
        }),
    ),
  ]),
);
await writeJson(out, {
  schema: 1,
  status: 'preliminary-family-screen-not-adopted',
  set: input.set,
  inputHash: hash(ib),
  poseHash: hash(pb),
  method: FAMILY_SCORE_VERSION,
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  node: process.version,
  sources: Object.fromEntries(
    await Promise.all(
      [
        'frame-family-metrics.mjs',
        'frame-family-score.mjs',
        'pixels-pure.mjs',
        'scan-transform.mjs',
        'metrics.mjs',
      ].map(async (n) => [n, hash(await fs.readFile(new URL(n, import.meta.url)))]),
    ),
  ),
  manifestHash: hash(await fs.readFile(path.join(root, 'games/magic/assets.json'))),
  scope:
    'Identical fixed opaque frame strips and scan-only frozen poses for all candidates. Source asset default rectangles only, not optimized family geometry; this screen is not a final family choice, HSB fit, held-out validation or whole-card compliance score. Text/art centers never score; ambiguous normalization stays explicit.',
  assets,
  supports,
  groups,
  rows,
});
console.log(JSON.stringify({ set: input.set, groups }));
