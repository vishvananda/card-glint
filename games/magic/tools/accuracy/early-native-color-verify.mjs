// Paired native material verification; no scan/color refitting or per-card defaults.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { median } from './metrics.mjs';
const [geometryDirectory, colorDirectory, beforeFile, afterFile, output] = process.argv.slice(2);
assert(
  output,
  'Usage: early-native-color-verify.mjs GEOMETRY_CAPTURE COLOR_CAPTURE BEFORE_AUDIT AFTER_AUDIT OUTPUT',
);
const paths = [
    path.join(geometryDirectory, 'capture.json'),
    path.join(colorDirectory, 'capture.json'),
    beforeFile,
    afterFile,
    path.join(colorDirectory, 'definition.json'),
  ],
  raw = await Promise.all(paths.map((f) => readFile(f))),
  [geometry, color, before, after, definition] = raw.map((b) => JSON.parse(b));
assert.equal(geometry.source.nativeCaptureHash, color.source.nativeCaptureHash);
assert.equal(geometry.source.rendererHash, color.source.rendererHash);
assert.equal(
  color.source.colorPluginHash,
  hash(await readFile(new URL('./early-color-trial-plugin.mjs', import.meta.url))),
);
assert.equal(
  color.source.toolHash,
  hash(await readFile(new URL('./early-frame-trial-replay.mjs', import.meta.url))),
);
assert.equal(geometry.rows.length, color.rows.length);
assert.equal(before.rows.length, after.rows.length);
assert.deepEqual(before.patches, after.patches);
const rows = [];
for (const b of geometry.rows) {
  const a = color.rows.find((r) => r.id === b.id),
    x = before.rows.find((r) => r.id === b.id),
    y = after.rows.find((r) => r.id === b.id);
  assert(a && x && y && a.baselineParity && b.baselineParity);
  for (const k of ['referenceHash', 'poseHash'])
    for (const v of [a, x, y]) assert.equal(v[k], b[k]);
  const p = b.trials['joint-art-paper'],
    q = a.trials['joint-and-color'];
  assert.equal(x.renderHash, p.faceHash);
  assert.equal(y.renderHash, q.faceHash);
  assert.equal(a.trials.current.faceHash, b.trials.current.faceHash);
  const material = definition.trials.find((t) => t.id === 'joint-and-color').materials[b.material];
  if (material.pigment) {
    assert.equal(q.appliedMaterialHash, hash(JSON.stringify(material.pigment.adjustment)));
    assert.notEqual(p.faceHash, q.faceHash);
  } else assert.equal(p.faceHash, q.faceHash, 'Unfitted material changed');
  const bytes = await Promise.all([
    readFile(path.join(geometryDirectory, 'joint-art-paper', b.id + '.png')),
    readFile(path.join(colorDirectory, 'joint-and-color', b.id + '.png')),
  ]);
  assert.equal(hash(bytes[0]), p.faceHash);
  assert.equal(hash(bytes[1]), q.faceHash);
  const images = bytes.map((v) => PNG.sync.read(v));
  let alphaChanged = 0,
    artCoreChanged = 0;
  for (let n = 0; n < 732 * 1020; n++) {
    const i = n * 4;
    if (images[0].data[i + 3] !== images[1].data[i + 3]) alphaChanged++;
    const x = n % 732,
      y = Math.floor(n / 732);
    if (
      x >= 105 &&
      x < 622 &&
      y >= 128 &&
      y < 532 &&
      [0, 1, 2, 3].some((k) => images[0].data[i + k] !== images[1].data[i + k])
    )
      artCoreChanged++;
  }
  assert.equal(alphaChanged, 0, b.name + ' alpha changed');
  assert.equal(artCoreChanged, 0, b.name + ' illustration color changed');
  assert.equal(p.etchingHash, q.etchingHash);
  rows.push({
    id: b.id,
    name: b.name,
    material: b.material,
    cohort: b.cohort,
    referenceHash: b.referenceHash,
    poseHash: b.poseHash,
    beforeFaceHash: p.faceHash,
    afterFaceHash: q.faceHash,
    appliedMaterialHash: q.appliedMaterialHash ?? null,
    alphaChanged,
    artCoreChanged,
    components: Object.fromEntries(
      ['frame', 'paper'].map((k) => [
        k,
        {
          before: x.components[k].deltaE,
          after: y.components[k].deltaE,
          delta: y.components[k].deltaE - x.components[k].deltaE,
          referenceRgb: y.components[k].referenceRgb,
          beforeRgb: x.components[k].renderRgb,
          afterRgb: y.components[k].renderRgb,
          ...(k === 'frame'
            ? { beforeTexture: x.components[k].texture, afterTexture: y.components[k].texture }
            : {}),
        },
      ]),
    ),
  });
}
const groups = Object.fromEntries(
  [...new Set(rows.map((r) => r.material))].map((material) => {
    const all = rows.filter((r) => r.material === material);
    const summary = (ss) =>
      Object.fromEntries(
        ['frame', 'paper'].map((k) => [
          k,
          {
            count: ss.length,
            before: median(ss.map((r) => r.components[k].before)),
            after: median(ss.map((r) => r.components[k].after)),
            improved: ss.filter((r) => r.components[k].delta < 0).length,
            worstRegression: Math.max(...ss.map((r) => r.components[k].delta)),
          },
        ]),
      );
    return [
      material,
      {
        all: summary(all),
        calibration: summary(all.filter((r) => r.cohort === 'calibration')),
        validation: summary(all.filter((r) => r.cohort === 'validation')),
        regressions: all
          .filter((r) => Object.values(r.components).some((c) => c.delta > 2))
          .map((r) => ({ id: r.id, name: r.name, components: r.components })),
      },
    ];
  }),
);
await writeJson(output, {
  schema: 1,
  status: 'native-color-candidate-not-adopted',
  method: 'paired-native-oklab-tiles-v1',
  scope:
    'All supplied nonland native material candidates, original frozen scan poses and glyph inputs. Source-local frame and paper HSB only; actual cached material pixels are sampled. White retains source pigment. Every supplied illustration core and face-alpha byte matches the geometry-only baseline. Outliers, texture contrast and black-level calibration remain separate requirements. Empty etching outputs match; no nonempty etching certification or whole-card compliance score is implied.',
  rendererHash: color.source.rendererHash,
  sourceHashes: Object.fromEntries(
    ['geometryCapture', 'colorCapture', 'beforeAudit', 'afterAudit', 'definition'].map((k, i) => [
      k,
      hash(raw[i]),
    ]),
  ),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  total: rows.length,
  alphaChanged: 0,
  artCoreChanged: 0,
  groups,
  rows,
});
console.log(
  JSON.stringify({
    total: rows.length,
    alphaChanged: 0,
    artCoreChanged: 0,
    groups: Object.fromEntries(Object.entries(groups).map(([k, v]) => [k, v.all])),
  }),
);
