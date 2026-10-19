import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFile, mkdir } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, readJson, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { normalizedReference } from './abu-reference-cache.mjs';
import { scanBoundaryProfiles } from './scan-boundary-profiles.mjs';
import { profileSupport } from './scan-gradient-fit.mjs';
import { metricSourceGraph } from './module-graph.mjs';
const [
  inputsFile,
  posesDirectory,
  baselineRoot,
  scorerFile,
  output,
  candidateDirectory,
  reusableScoresFile,
] = process.argv.slice(2);
if (!output)
  throw Error(
    'Usage: abu-calibration-score.mjs INPUTS POSES_DIRECTORY BASELINE_ROOT SCORER.mjs OUTPUT [CANDIDATE_STUDY] [BASELINE_SCORES]',
  );
const inputs = await readJson(inputsFile),
  poses = await readJson(path.join(posesDirectory, 'normalization.json')),
  templates = await readJson(path.join(posesDirectory, 'templates.json'));
assert.equal(poses.inputHash, hash(await readFile(inputsFile)));
const candidateStudy = candidateDirectory
  ? await readJson(path.join(candidateDirectory, '_source', 'study.json'))
  : undefined;
if (candidateStudy) {
  const { studyHash, ...definition } = candidateStudy;
  assert.equal(studyHash, hash(JSON.stringify(definition)));
  assert.equal(candidateStudy.inputHash, poses.inputHash);
  assert.equal(candidateStudy.normalizationHash, hash(JSON.stringify(poses)));
  assert.equal(candidateStudy.nativeTrials, true, 'Candidate requires full native replay');
}
const { scoreRegions } = await import(pathToFileURL(path.resolve(scorerFile)));
const scorerHash = hash(await readFile(scorerFile));
const metricGraph = await metricSourceGraph(scorerFile);
const reusableScores = reusableScoresFile ? await readJson(reusableScoresFile) : undefined;
const reusableRows = new Map(reusableScores?.rows.map((r) => [r.id, r]));
if (reusableScores) {
  assert.ok(candidateStudy, 'Baseline reuse requires a certified native candidate study');
  assert.equal(reusableScores.inputHash, poses.inputHash);
  assert.equal(reusableScores.normalizationHash, hash(JSON.stringify(poses)));
  assert.equal(reusableScores.scorerHash, scorerHash);
  assert.equal(reusableScores.metricGraph?.hash, metricGraph.hash);
  assert.equal(reusableScores.baseline, '0.5.3');
}
const rows = [];
const neutral = { sx: 1, sy: 1, tx: 0, ty: 0, rotation: 0, shear: 0 };
const manifests = new Map();
for (const e of inputs.entries)
  if (!manifests.has(e.material))
    manifests.set(
      e.material,
      await readJson(path.join(baselineRoot, e.material, 'observations.json')),
    );
const labels = [
  ...new Set([...manifests.values()].map((m) => m.baseline.variant ?? m.baseline.version)),
];
assert.equal(labels.length, 1, 'Mixed native capture variants');
const captureLabel = labels[0];
await mkdir(path.dirname(output), { recursive: true });
for (const e of inputs.entries) {
  const pose = poses.rows.find((r) => r.id === e.id);
  assert.equal(pose.referenceHash, e.reference.sha256);
  const manifest = manifests.get(e.material);
  assert.match(manifest.baseline.version, /^\d+\.\d+\.\d+$/);
  const native = manifest.records.find((r) => r.id === e.id);
  assert.deepEqual(native.face, e.face);
  let baseline = await readFile(path.join(baselineRoot, e.material, native.baseline.file));
  assert.equal(hash(baseline), native.baseline.sha256);
  if (candidateStudy) {
    const trial = await readJson(path.join(candidateDirectory, e.id + '.json'));
    assert.equal(trial.id, e.id);
    assert.equal(trial.studyHash, candidateStudy.studyHash);
    assert.equal(trial.referenceHash, e.reference.sha256);
    assert.equal(trial.poseHash, hash(JSON.stringify(pose)));
    assert.equal(trial.baselineHash, hash(baseline));
    assert.equal(trial.nativeTrial.outside, 0, 'Candidate changed pixels outside rules region');
    assert.ok(trial.nativeTrial.maximum <= 1.001, 'Candidate failed native replay parity');
    baseline = await readFile(path.join(candidateDirectory, e.id + '-candidate.png'));
    assert.equal(hash(baseline), trial.nativeTrial.renderHash);
  }
  const reused = reusableRows.get(e.id);
  if (reused && reused.renderHash === hash(baseline)) {
    assert.equal(reused.referenceHash, e.reference.sha256);
    assert.equal(reused.poseHash, hash(JSON.stringify(pose)));
    assert.equal(reused.profileAccepted, pose.accepted);
    rows.push({ ...reused, reusedScore: true });
    continue;
  }
  const { image: scan } = await normalizedReference(e, pose, path.join(posesDirectory, 'rasters'));
  const rendered = normalize(PNG.sync.read(baseline, { checkCRC: true }));
  const raster = profileSupport(
    scanBoundaryProfiles(scan, templates.groups[2], templates.bounds),
    templates.certification[e.material],
    neutral,
    { residuals: true },
  );
  const scored = scoreRegions(scan, rendered, e.card, e.face);
  rows.push({
    id: e.id,
    name: e.card.name,
    material: e.material,
    cohort: pose.cohort,
    referenceHash: e.reference.sha256,
    renderHash: hash(baseline),
    poseHash: hash(JSON.stringify(pose)),
    normalizationAccepted: pose.accepted && raster.accepted,
    profileAccepted: pose.accepted,
    rasterCertification: raster,
    structural100: scored.structuralScore === null ? null : 100 * scored.structuralScore,
    coverage: scored.coverage,
    components: Object.fromEntries(
      Object.entries(scored.components).map(([key, v]) => [
        key,
        {
          score100: v.score === null ? null : 100 * v.score,
          eligible: v.eligible,
          status: v.status,
        },
      ]),
    ),
    color: scored.color,
  });
  if (rows.length % 25 === 0) console.log('scored', rows.length, '/', inputs.entries.length);
}
const mean = (v) => (v.length ? v.reduce((a, b) => a + b, 0) / v.length : null),
  summary = {
    total: rows.length,
    reused: rows.filter((r) => r.reusedScore).length,
    accepted: rows.filter((r) => r.normalizationAccepted).length,
    materials: Object.fromEntries(
      [...new Set(rows.map((r) => r.material))].map((material) => {
        const a = rows.filter((r) => r.material === material && r.normalizationAccepted);
        return [
          material,
          {
            total: rows.filter((r) => r.material === material).length,
            accepted: a.length,
            structural100: mean(a.map((r) => r.structural100)),
            components: Object.fromEntries(
              Object.keys(a[0]?.components ?? {}).map((key) => [
                key,
                {
                  score100: mean(a.map((r) => r.components[key].score100).filter(Number.isFinite)),
                  eligible: a.filter((r) => r.components[key].eligible).length,
                },
              ]),
            ),
          },
        ];
      }),
    ),
  };
assert.deepEqual(await metricSourceGraph(scorerFile), metricGraph, 'Metric changed during scoring');
await writeJson(output, {
  schema: 1,
  set: poses.set,
  baseline: candidateStudy
    ? `${captureLabel} with experimental shared text-tier model`
    : captureLabel,
  ...(candidateStudy ? { candidateStudyHash: candidateStudy.studyHash } : {}),
  inputHash: poses.inputHash,
  normalizationHash: hash(JSON.stringify(poses)),
  scorerHash,
  metricGraph,
  ...(reusableScoresFile ? { reusableScoresHash: hash(await readFile(reusableScoresFile)) } : {}),
  scope:
    `Full native ${captureLabel} replay using original-wording inputs` +
    (candidateStudy ? ' and a rules-only experimental shared text-tier model' : '') +
    '. Scan-only profiles; two-stage canonical then affine resampling with untouched raster certification. Rejected poses remain diagnostic. Experimental replacement frame assets are excluded.',
  summary,
  rows,
});
console.log(summary);
