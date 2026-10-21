// Photometric diagnostics for full native early-printing captures or geometry trials.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, readJson, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { sampleColor, delta, median, quantile } from './hsb-color.mjs';
import { sampleTexture, textureMetrics } from './hsb-texture.mjs';
const [nativeDirectory, output, trialDirectory, trialName] = process.argv.slice(2);
assert(
  output && Boolean(trialDirectory) === Boolean(trialName),
  'Usage: early-land-texture-audit.mjs NATIVE_CAPTURE OUTPUT [TRIAL_CAPTURE TRIAL_NAME]',
);
const captureBytes = await readFile(path.join(nativeDirectory, 'capture.json')),
  capture = JSON.parse(captureBytes),
  inputsBytes = await readFile(path.join(nativeDirectory, 'inputs.json')),
  inputs = JSON.parse(inputsBytes),
  trialBytes = trialDirectory ? await readFile(path.join(trialDirectory, 'capture.json')) : null,
  trial = trialBytes ? JSON.parse(trialBytes) : null;
assert.equal(inputs.source.rendererHash, capture.source.rendererHash);
if (trial) {
  assert.equal(trial.source.nativeCaptureHash, hash(captureBytes));
  assert.equal(trial.source.rendererHash, capture.source.rendererHash);
}
const patches = {
    frame: [
      [38, 140, 5, 40],
      [38, 230, 5, 40],
      [38, 320, 5, 40],
      [445, 140, 5, 40],
      [445, 230, 5, 40],
      [445, 320, 5, 40],
    ],
    paper: [[78, 434, 328, 140]],
    stock: [
      [6, 140, 5, 100],
      [477, 140, 5, 100],
      [130, 668, 100, 5],
    ],
  },
  rows = [],
  excluded = [];
for (const r of capture.rows) {
  const e = inputs.entries.find((e) => e.id === r.id);
  assert(e && e.pose.accepted && r.accepted);
  assert.equal(e.face.wordingMode, 'original');
  assert.equal(e.reference.sha256, r.referenceHash);
  const t = trial?.rows.find((t) => t.id === r.id);
  const selectedTrial = t?.trials[trialName] ? trialName : 'land-material';
  if (trial && !t?.trials[selectedTrial]) {
    excluded.push({ id: r.id, material: e.material, reason: 'not-in-geometry-trial' });
    continue;
  }
  if (t) for (const k of ['referenceHash', 'poseHash']) assert.equal(t[k], r[k]);
  const renderFile = trial
      ? path.join(trialDirectory, selectedTrial, r.id + '.png')
      : path.join(nativeDirectory, r.set, r.id + '.png'),
    renderBytes = await readFile(renderFile),
    scanBytes = await readFile(path.join(nativeDirectory, r.set, r.id + '-scan.png'));
  assert.equal(hash(renderBytes), t?.trials[selectedTrial].faceHash ?? r.renderHash);
  assert.equal(hash(scanBytes), r.scanHash);
  const render = normalize(PNG.sync.read(renderBytes)),
    reference = normalize(PNG.sync.read(scanBytes));
  const components = Object.fromEntries(
    Object.entries(patches).map(([key, windows]) => {
      const options = { paper: key === 'paper', tileSize: key === 'paper' ? 10 : 5 },
        a = sampleColor(render, windows, options),
        b = sampleColor(reference, windows, options);
      return [
        key,
        {
          deltaE: delta(a.rgb, b.rgb),
          renderRgb: a.rgb,
          referenceRgb: b.rgb,
          renderTiles: a.tiles,
          referenceTiles: b.tiles,
          renderSpread: a.spread,
          referenceSpread: b.spread,
          renderRejectedFraction: a.rejectedFraction,
          referenceRejectedFraction: b.rejectedFraction,
          ...(key === 'frame'
            ? {
                renderTexture: sampleTexture(render, windows),
                referenceTexture: sampleTexture(reference, windows),
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
  const basic = /\bBasic\b/.test(e.card.type_line),
    group = e.material === 'L' ? (basic ? 'L/' + e.card.name : 'L/nonbasic') : e.material;
  rows.push({
    id: r.id,
    name: r.name,
    material: e.material,
    group,
    cohort: e.pose.cohort,
    accepted: true,
    referenceHash: r.referenceHash,
    poseHash: r.poseHash,
    renderHash: hash(renderBytes),
    trial: selectedTrial,
    components,
  });
}
const groups = Object.fromEntries(
  [...new Set(rows.map((r) => r.group))].map((group) => {
    const all = rows.filter((r) => r.group === group);
    return [
      group,
      {
        total: all.length,
        accepted: all.length,
        components: Object.fromEntries(
          Object.keys(patches).map((key) => {
            const values = all.map((r) => r.components[key].deltaE);
            return [key, { medianDeltaE: median(values), p90DeltaE: quantile(values, 0.9) }];
          }),
        ),
      },
    ];
  }),
);
await writeJson(output, {
  schema: 1,
  set: inputs.entries[0].set,
  scope:
    'Land color/texture diagnostics on fixed native Original references. Brown rail corridors x[38,43) and x[445,450) avoid colored full-frame and art outlines across the shared source geometry envelope. Luminance-sorted texture bins avoid print-dot phase alignment. No scan pose/color correction is fitted. Basic land-material controls are used when a requested dual-only variant is absent; every selected variant is recorded. The broad paper median is only a penalty diagnostic, not a replacement for stripe-specific color checks. Distances are Oklab units, not whole-card scores; this does not certify a profile.',
  rendererHash: capture.source.rendererHash,
  nativeCaptureHash: hash(captureBytes),
  nativeInputsHash: hash(inputsBytes),
  trialCaptureHash: trialBytes ? hash(trialBytes) : null,
  trialName: trialName ?? null,
  toolHash: hash(await readFile(new URL(import.meta.url))),
  patches,
  groups,
  excluded,
  rows,
});
console.log(JSON.stringify({ count: rows.length, excluded: excluded.length, groups }));
