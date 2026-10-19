import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { readJson, writeJson, hash } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { normalizedReference } from './abu-reference-cache.mjs';
import { sampleColor, delta, median, quantile } from './hsb-color.mjs';
import { sampleTexture, textureMetrics } from './hsb-texture.mjs';

const [inputsFile, posesDirectory, nativeRoot, output] = process.argv.slice(2);
if (!output) throw Error('Usage: abu-color-audit.mjs INPUTS POSES NATIVE OUT');
const input = await readJson(inputsFile);
const poses = await readJson(path.join(posesDirectory, 'normalization.json'));
assert.equal(poses.inputHash, hash(await readFile(inputsFile)));
const patches = {
  // Eroded rails avoid both the illustration and the secondary inner border.
  frame: [
    [33, 110, 11, 50],
    [33, 200, 11, 50],
    [33, 290, 11, 50],
    [444, 110, 11, 50],
    [444, 200, 11, 50],
    [444, 290, 11, 50],
  ],
  paper: [[78, 434, 328, 140]],
  stock: [
    [6, 140, 5, 100],
    [477, 140, 5, 100],
    [130, 668, 100, 5],
  ],
};
const manifests = new Map(),
  rows = [];
for (const e of input.entries) {
  if (!manifests.has(e.material))
    manifests.set(
      e.material,
      await readJson(path.join(nativeRoot, e.material, 'observations.json')),
    );
  const manifest = manifests.get(e.material);
  const record = manifest.records.find((r) => r.id === e.id);
  assert.deepEqual(record.face, e.face);
  assert.notEqual(e.face.colorCalibration, 'none');
  const bytes = await readFile(path.join(nativeRoot, e.material, record.baseline.file));
  assert.equal(hash(bytes), record.baseline.sha256);
  const render = normalize(PNG.sync.read(bytes));
  const pose = poses.rows.find((p) => p.id === e.id);
  const { image: reference } = await normalizedReference(
    e,
    pose,
    path.join(posesDirectory, 'rasters'),
  );
  const components = Object.fromEntries(
    Object.entries(patches).map(([key, windows]) => {
      const options = { paper: key === 'paper', tileSize: key === 'stock' ? 5 : 10 };
      const a = sampleColor(render, windows, options),
        b = sampleColor(reference, windows, options);
      return [
        key,
        {
          deltaE: delta(a.rgb, b.rgb),
          renderRgb: a.rgb,
          referenceRgb: b.rgb,
          renderSpread: a.spread,
          referenceSpread: b.spread,
          ...(key === 'frame'
            ? {
                texture: textureMetrics(
                  sampleTexture(render, windows),
                  sampleTexture(reference, windows),
                ),
              }
            : {}),
        },
      ];
    }),
  );
  const basic = /\bBasic\b/.test(e.card.type_line);
  const group = e.material === 'L' ? (basic ? `L/${e.card.name}` : 'L/nonbasic') : e.material;
  rows.push({
    id: e.id,
    name: e.card.name,
    material: e.material,
    group,
    cohort: pose.cohort,
    accepted: pose.accepted,
    referenceHash: e.reference.sha256,
    renderHash: hash(bytes),
    poseHash: hash(JSON.stringify(pose)),
    components,
  });
  if (rows.length % 50 === 0) console.log(input.set, rows.length, '/', input.entries.length);
}
const groups = Object.fromEntries(
  [...new Set(rows.map((r) => r.group))].map((group) => {
    const all = rows.filter((r) => r.group === group),
      eligible = all.filter((r) => r.accepted);
    return [
      group,
      {
        total: all.length,
        accepted: eligible.length,
        components: Object.fromEntries(
          Object.keys(patches).map((c) => {
            const a = eligible.map((r) => r.components[c].deltaE);
            return [
              c,
              {
                medianDeltaE: a.length ? median(a) : null,
                p90DeltaE: a.length ? quantile(a, 0.9) : null,
                worst: eligible
                  .toSorted((a, b) => b.components[c].deltaE - a.components[c].deltaE)
                  .slice(0, 3)
                  .map((r) => ({ id: r.id, name: r.name, deltaE: r.components[c].deltaE })),
              },
            ];
          }),
        ),
      },
    ];
  }),
);
await writeJson(output, {
  schema: 1,
  set: poses.set,
  scope:
    'Current native renderer versus frame-normalized nonfoil scans, original wording. Existing frame assets only. Oklab distances are color diagnostics, not accuracy percentages; printing and texture variation remain explicit. No per-scan color adjustment.',
  inputHash: poses.inputHash,
  normalizationHash: hash(JSON.stringify(poses)),
  patches,
  groups,
  rows,
});
console.log(JSON.stringify(groups, null, 2));
