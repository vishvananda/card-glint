import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { readJson, writeJson, hash } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { normalizedReference } from './abu-reference-cache.mjs';
import { scanBoundaryProfiles } from './scan-boundary-profiles.mjs';
import { canonicalScanProfiles } from './printed-plate-registration.mjs';
import { profileSupport } from './scan-gradient-fit.mjs';
import { searchCalibration } from './calibration-search.mjs';
import { median } from './metrics.mjs';

const [inputFile, posesDirectory, nativeRoot, output] = process.argv.slice(2);
if (!output) throw Error('Usage: set-frame-geometry-study.mjs INPUTS POSES NATIVE OUT');
const input = await readJson(inputFile),
  poses = await readJson(path.join(posesDirectory, 'normalization.json')),
  templates = await readJson(path.join(posesDirectory, 'templates.json')),
  capture = await readJson(path.join(nativeRoot, 'capture.json'));
assert.equal(poses.inputHash, hash(await readFile(inputFile)));
assert.equal(capture.inputHash, poses.inputHash);
assert.equal(capture.complete, true);
const matrices = (p) => [p.sx, 0, 0, p.sy, p.tx, p.ty];
const sources = new Map(),
  rows = [];
for (const e of input.entries) {
  if (!sources.has(e.material))
    sources.set(e.material, await readJson(path.join(nativeRoot, e.material, 'observations.json')));
  const record = sources.get(e.material).records.find((r) => r.id === e.id),
    pose = poses.rows.find((r) => r.id === e.id);
  assert.deepEqual(record.face, e.face);
  const bytes = await readFile(path.join(nativeRoot, e.material, record.baseline.file));
  assert.equal(hash(bytes), record.baseline.sha256);
  const image = normalize(PNG.sync.read(bytes, { checkCRC: true })),
    reference = (await normalizedReference(e, pose, path.join(posesDirectory, 'rasters'))).image;
  const profiles = templates.groups.map((g) => scanBoundaryProfiles(image, g, templates.bounds)),
    target = templates.groups.map((g) => scanBoundaryProfiles(reference, g, templates.bounds));
  rows.push({
    id: e.id,
    name: e.card.name,
    material: e.material,
    cohort: pose.cohort,
    accepted: pose.accepted,
    referenceHash: e.reference.sha256,
    nativeHash: hash(bytes),
    poseHash: hash(JSON.stringify(pose)),
    profiles,
    target,
  });
  if (rows.length % 50 === 0) console.log(input.set, rows.length, '/', input.entries.length);
}
const sourceTemplates = canonicalScanProfiles(
    rows.filter((r) => r.accepted).map((r) => ({ ...r, profiles: r.profiles[0] })),
  ),
  neutral = { sx: 1, sy: 1, tx: 0, ty: 0 },
  groups = {};
for (const material of Object.keys(sourceTemplates)) {
  const score = (p) =>
    profileSupport(sourceTemplates[material], templates.templates[material], matrices(p)).objective;
  const fit = await searchCalibration(
    neutral,
    [
      { key: 'sx', min: 0.97, max: 1.03, steps: [0.002, 0.001, 0.0005, 0.0001] },
      { key: 'sy', min: 0.97, max: 1.03, steps: [0.002, 0.001, 0.0005, 0.0001] },
      { key: 'tx', min: -6, max: 6, steps: [1, 0.5, 0.25, 0.1] },
      { key: 'ty', min: -6, max: 6, steps: [1, 0.5, 0.25, 0.1] },
    ],
    score,
  );
  const measured = rows
    .filter((r) => r.material === material && r.accepted)
    .map((r) => {
      const evaluate = (p) =>
        r.profiles.map((source, i) =>
          profileSupport(source, r.target[i], matrices(p), { residuals: true }),
        );
      return {
        id: r.id,
        name: r.name,
        cohort: r.cohort,
        before: evaluate(neutral),
        after: evaluate(fit.values),
      };
    });
  const cohorts = Object.fromEntries(
    ['calibration', 'validation'].map((cohort) => {
      const a = measured.filter((r) => r.cohort === cohort);
      const metric = (key, group) => a.reduce((n, r) => n + r[key][group].objective, 0) / a.length;
      return [
        cohort,
        {
          cards: a.length,
          before100: 100 * metric('before', 0),
          after100: 100 * metric('after', 0),
          independentGain: metric('after', 1) - metric('before', 1),
          certificateGain: metric('after', 2) - metric('before', 2),
          beforeRms: median(a.map((r) => r.before[2].residualRms)),
          afterRms: median(a.map((r) => r.after[2].residualRms)),
          certificateRegressions: a.filter(
            (r) => r.after[2].objective < r.before[2].objective - 0.01,
          ).length,
        },
      ];
    }),
  );
  groups[material] = {
    parameters: fit.values,
    search: { evaluations: fit.evaluations, boundary: fit.boundary, exhausted: fit.exhausted },
    status:
      fit.boundary.length || fit.exhausted
        ? 'search-review'
        : Object.values(cohorts).every(
              (c) =>
                c.cards >= 3 &&
                c.independentGain > 0.001 &&
                c.certificateGain > 0.001 &&
                c.afterRms < c.beforeRms - 0.025,
            )
          ? 'candidate'
          : 'retain-or-inspect',
    cohorts,
    rows: measured,
  };
}
await writeJson(output, {
  schema: 1,
  set: input.set,
  status: 'diagnostic-not-adopted',
  inputHash: poses.inputHash,
  normalizationHash: hash(JSON.stringify(poses)),
  rendererHash: capture.rendererHash,
  scope:
    'Fit the rendered plate to frozen scan-derived geometry, never refit a scan against the renderer. Per-material source placement only: independent x/y scale and translation; no rendered rotation/shear. Three disjoint outer-frame strip groups exclude every text/art component. Native capture required after applying values; internal apertures/bevels and color remain separate audits.',
  sources: await Promise.all(
    [
      'set-frame-geometry-study.mjs',
      'scan-boundary-profiles.mjs',
      'scan-gradient-fit.mjs',
      'calibration-search.mjs',
      'pixels-pure.mjs',
    ].map(async (f) => [f, hash(await readFile(new URL(f, import.meta.url)))]),
  ),
  groups,
});
console.log(Object.fromEntries(Object.entries(groups).map(([k, { rows, ...g }]) => [k, g])));
