// Browser-independent check of the actual cached native palette candidates.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { normalize, cropGray } from './pixels-pure.mjs';
import { JsTextObjective, nativeGrayCrop } from './abu-type-objective.mjs';
import { median } from './hsb-color.mjs';
const [nativeDirectory, colorDirectory, output] = process.argv.slice(2);
assert(output, 'Usage: early-mana-color-verify.mjs NATIVE COLOR_CAPTURE OUTPUT');
const raw = await Promise.all(
  [
    path.join(nativeDirectory, 'capture.json'),
    path.join(nativeDirectory, 'inputs.json'),
    path.join(colorDirectory, 'capture.json'),
  ].map((f) => readFile(f)),
);
const [capture, inputs, color] = raw.map((b) => JSON.parse(b));
assert.equal(color.source.nativeCaptureHash, hash(raw[0]));
assert.equal(color.source.nativeInputsHash, hash(raw[1]));
assert.equal(color.completed, color.total);
assert.equal(color.source.rendererHash, capture.source.rendererHash);
for (const [file, key] of [
  ['early-mana-color-replay.mjs', 'toolHash'],
  ['early-mana-trial-plugin.mjs', 'pluginHash'],
])
  assert.equal(color.source[key], hash(await readFile(new URL(file, import.meta.url))));
for (const [file, digest] of color.source.dependencies)
  assert.equal(digest, hash(await readFile(new URL(file, import.meta.url))));
assert.deepEqual(color.rows.map((r) => r.id).sort(), [...color.definition.ids].sort());
const rows = [];
for (const row of color.rows) {
  const c = capture.rows.find((r) => r.id === row.id),
    e = inputs.entries.find((e) => e.id === row.id);
  assert(e.pose.accepted && e.face.wordingMode === 'original');
  assert.equal(hash(JSON.stringify(e.pose.transform)), row.poseHash);
  for (const key of ['referenceHash', 'poseHash', 'scanHash']) assert.equal(row[key], c[key]);
  const bytes = await readFile(path.join(nativeDirectory, e.set, e.id + '.png')),
    scanBytes = await readFile(path.join(nativeDirectory, e.set, e.id + '-scan.png'));
  assert.equal(hash(bytes), row.baselineHash);
  assert.equal(hash(scanBytes), row.scanHash);
  const before = PNG.sync.read(bytes),
    scan = normalize(PNG.sync.read(scanBytes)),
    rect = row.rect;
  const objective = new JsTextObjective(cropGray(scan, rect).gray, rect[2], rect[3]);
  for (const trial of row.trials) {
    const b =
        trial.id === 'current' ? bytes : await readFile(path.join(colorDirectory, trial.file)),
      image = PNG.sync.read(b);
    assert.equal(hash(b), trial.faceHash);
    assert.deepEqual([image.width, image.height], [732, 1020]);
    const score = objective.score(nativeGrayCrop(image, rect))[0];
    assert(Math.abs(score - trial.score) < 1e-10, e.name + ' score mismatch');
    let changed = 0,
      outside = 0,
      alphaChanged = 0;
    for (let p = 0; p < 732 * 1020; p++) {
      const i = p * 4,
        x = p % 732,
        y = Math.floor(p / 732);
      if (before.data[i + 3] !== image.data[i + 3]) alphaChanged++;
      if (![0, 1, 2, 3].some((k) => before.data[i + k] !== image.data[i + k])) continue;
      changed++;
      if (
        !(
          (x >= rect[0] * 1.5 &&
            x < (rect[0] + rect[2]) * 1.5 &&
            y >= rect[1] * 1.5 &&
            y < (rect[1] + rect[3]) * 1.5) ||
          (x >= 79.5 && x < 667.5 && y >= 606 && y < 904.5)
        )
      )
        outside++;
    }
    assert.equal(changed, trial.changed);
    assert.equal(outside, 0);
    assert.equal(alphaChanged, 0);
  }
  rows.push({
    id: row.id,
    name: row.name,
    symbol: row.symbol,
    cohort: row.cohort,
    trials: row.trials.map(({ id, faceHash, score, discDeltaE, glyphDeltaE, changed }) => ({
      id,
      faceHash,
      score,
      discDeltaE,
      glyphDeltaE,
      changed,
    })),
  });
}
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const groups = Object.fromEntries(
  [
    'all',
    'calibration',
    'validation',
    ...['W', 'U', 'B', 'R', 'G', 'N'].map((s) => 'symbol/' + s),
  ].map((key) => {
    const a = rows.filter((r) => key === 'all' || r.cohort === key || key === 'symbol/' + r.symbol);
    return [
      key,
      {
        count: a.length,
        trials: Object.fromEntries(
          color.definition.candidates.map((c) => {
            const ts = a.map((r) => r.trials.find((t) => t.id === c.id));
            return [
              c.id,
              {
                costMean100: 100 * mean(ts.map((t) => t.score)),
                medianDiscDeltaE: median(ts.map((t) => t.discDeltaE)),
                medianGlyphDeltaE: median(ts.map((t) => t.glyphDeltaE)),
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
  set: '2ed',
  status: 'native-shared-mana-pigment-candidates-verified-not-adopted',
  scope:
    'Browser-independent native PNG score and pixel-isolation verification for the predefined 54-printing color sample. Shared disc/ink colors come from calibration names. Their values were not selected by the edge objective; color errors and structural scores are reported separately. Current rasters and poses are immutable. All changes remain within cost or rules regions, and face alpha is unchanged. Original wording is used throughout. This is not a full-set geometry/glyph/numeral or etching certification.',
  sources: { nativeCapture: hash(raw[0]), nativeInputs: hash(raw[1]), colorCapture: hash(raw[2]) },
  toolHash: hash(await readFile(new URL(import.meta.url))),
  groups,
  rows,
});
console.log(JSON.stringify({ status: 'native-mana-colors-verified', groups }));
