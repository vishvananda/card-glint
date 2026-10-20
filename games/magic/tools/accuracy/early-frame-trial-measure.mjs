// Score native geometry trials on fixed opaque frame strips, never refitting scans.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { frameProfiles } from './frame-family-metrics.mjs';
import { opaqueSupport, scoreOpaqueFamily, FAMILY_SCORE_VERSION } from './frame-family-score.mjs';
import { median } from './metrics.mjs';
const [nativeDirectory, trialDirectory, familyDirectory, output, supportDirectory] =
  process.argv.slice(2);
assert(
  output,
  'Usage: early-frame-trial-measure.mjs NATIVE_CAPTURE TRIAL_CAPTURE FAMILY_STUDY OUTPUT [BASELINE_SUPPORT_STUDY]',
);
const nativeBytes = await readFile(path.join(nativeDirectory, 'capture.json')),
  native = JSON.parse(nativeBytes),
  trialBytes = await readFile(path.join(trialDirectory, 'capture.json')),
  trial = JSON.parse(trialBytes),
  familyBytes = await readFile(path.join(familyDirectory, 'family-study.json')),
  family = JSON.parse(familyBytes),
  rows = [];
assert.equal(trial.source.nativeCaptureHash, hash(nativeBytes));
assert.equal(trial.source.rendererHash, native.source.rendererHash);
assert.equal(family.rendererHash, native.source.rendererHash);
const additionalBytes = supportDirectory
    ? await readFile(path.join(supportDirectory, 'family-study.json'))
    : null,
  additional = additionalBytes ? JSON.parse(additionalBytes) : null,
  supports = new Map();
if (additional) assert.equal(additional.rendererHash, native.source.rendererHash);
async function supportFor(row) {
  const entry = family.rows.find((e) => e.id === row.id),
    key = entry?.key ?? row.material;
  assert(family.groups[key], 'Missing source-family group: ' + key);
  for (const study of [family, additional].filter(Boolean)) {
    const source = study.rows.find((e) => e.id === row.id);
    assert(source, 'Missing source-family printing');
    for (const field of ['referenceHash', 'poseHash'])
      assert.equal(source[field], row[field], 'Source-family reference changed: ' + field);
    assert.equal(source.key ?? source.material, key);
  }
  if (!additional) return { key, support: family.groups[key].support };
  if (!supports.has(key)) {
    const plates = [];
    for (const [directory, study] of [
      [familyDirectory, family],
      [supportDirectory, additional],
    ]) {
      for (const asset of study.assets.filter((a) => a.key === key)) {
        const bytes = await readFile(path.join(directory, 'plates', asset.raster.file));
        assert.equal(hash(bytes), asset.raster.sha256);
        plates.push(normalize(PNG.sync.read(bytes)));
      }
    }
    assert(plates.length >= 4, 'Expected current and transformed source families');
    supports.set(key, opaqueSupport(plates));
  }
  return { key, support: supports.get(key) };
}
for (const r of trial.rows) {
  const before = native.rows.find((b) => b.id === r.id);
  assert(before && r.baselineParity);
  for (const key of ['referenceHash', 'poseHash']) assert.equal(before[key], r[key]);
  const scanBytes = await readFile(path.join(nativeDirectory, r.set, r.id + '-scan.png'));
  assert.equal(hash(scanBytes), before.scanHash);
  const reference = frameProfiles(normalize(PNG.sync.read(scanBytes))),
    { key: sourceKey, support } = await supportFor(r),
    candidates = {};
  for (const [key, value] of Object.entries(r.trials)) {
    const bytes = await readFile(path.join(trialDirectory, key, r.id + '.png'));
    assert.equal(hash(bytes), value.faceHash);
    candidates[key] = {
      ...scoreOpaqueFamily(reference, frameProfiles(normalize(PNG.sync.read(bytes))), support),
      outerBoundary: value.outerBoundary,
      etchingChanged: value.etchingChanged,
      changedPixels: value.changedPixels,
      interiorChanged: value.interiorChanged,
    };
  }
  assert.equal(r.trials.current.faceHash, before.renderHash);
  rows.push({
    id: r.id,
    name: r.name,
    material: r.material,
    sourceKey,
    cohort: r.cohort,
    candidates,
  });
}
const groups = {};
for (const material of [...new Set(rows.map((r) => r.material))]) {
  groups[material] = {};
  for (const cohort of ['calibration', 'validation']) {
    const subset = rows.filter((r) => r.material === material && r.cohort === cohort);
    groups[material][cohort] = Object.fromEntries(
      [...new Set(subset.flatMap((r) => Object.keys(r.candidates)))].map((key) => {
        const scores = subset.flatMap((r) =>
          r.candidates[key]?.score === null
            ? []
            : [r.candidates[key]?.score].filter((v) => v !== undefined),
        );
        return [
          key,
          {
            count: scores.length,
            median: median(scores),
            improved: subset.filter((r) => r.candidates[key]?.score > r.candidates.current.score)
              .length,
            mean: scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null,
          },
        ];
      }),
    );
  }
}
const result = {
  schema: 1,
  method: FAMILY_SCORE_VERSION,
  scope:
    'Native frame-strip diagnostic on fixed support shared with the source-family comparison. Scan poses and baseline pigment adjustments stay frozen. Art interiors and lettering are not fitting targets. When supplied, baseline support is intersected with transformed-family support to exclude art from every candidate. This regional index is not the Lab whole-card metric or complete-set certification.',
  nativeCaptureHash: hash(nativeBytes),
  trialCaptureHash: hash(trialBytes),
  familyStudyHash: hash(familyBytes),
  ...(additionalBytes ? { additionalSupportStudyHash: hash(additionalBytes) } : {}),
  supports: Object.fromEntries(supports),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  rendererHash: native.source.rendererHash,
  groups,
  rows,
};
await writeJson(output, result);
console.log(JSON.stringify(groups));
