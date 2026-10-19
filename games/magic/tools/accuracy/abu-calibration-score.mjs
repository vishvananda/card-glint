import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFile, mkdir } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, readJson, writeJson, objectFile } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { scanBoundaryProfiles } from './scan-boundary-profiles.mjs';
import { profileSupport } from './scan-gradient-fit.mjs';
const [inputsFile, posesDirectory, baselineRoot, scorerFile, output] = process.argv.slice(2);
if (!output)
  throw Error(
    'Usage: abu-calibration-score.mjs INPUTS POSES_DIRECTORY BASELINE_ROOT SCORER.mjs OUTPUT',
  );
const inputs = await readJson(inputsFile),
  poses = await readJson(path.join(posesDirectory, 'normalization.json')),
  templates = await readJson(path.join(posesDirectory, 'templates.json'));
assert.equal(poses.inputHash, hash(await readFile(inputsFile)));
const { scoreRegions } = await import(pathToFileURL(path.resolve(scorerFile)));
const rows = [];
const neutral = { sx: 1, sy: 1, tx: 0, ty: 0, rotation: 0, shear: 0 };
const manifests = new Map();
for (const e of inputs.entries)
  if (!manifests.has(e.material))
    manifests.set(
      e.material,
      await readJson(path.join(baselineRoot, e.material, 'observations.json')),
    );
await mkdir(path.dirname(output), { recursive: true });
for (const e of inputs.entries) {
  const pose = poses.rows.find((r) => r.id === e.id);
  assert.equal(pose.referenceHash, e.reference.sha256);
  const manifest = manifests.get(e.material);
  assert.equal(manifest.baseline.version, '0.5.3');
  const native = manifest.records.find((r) => r.id === e.id);
  assert.deepEqual(native.face, e.face);
  const baseline = await readFile(path.join(baselineRoot, e.material, native.baseline.file));
  assert.equal(hash(baseline), native.baseline.sha256);
  const bytes = await readFile(objectFile(e.reference));
  assert.equal(hash(bytes), e.reference.sha256);
  const canonical = normalize(PNG.sync.read(bytes, { checkCRC: true }));
  const scan = normalize(canonical, pose.transform);
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
await writeJson(output, {
  schema: 1,
  set: poses.set,
  baseline: '0.5.3',
  inputHash: poses.inputHash,
  normalizationHash: hash(JSON.stringify(poses)),
  scorerHash: hash(await readFile(scorerFile)),
  scope:
    'Full native 0.5.3 replay using original-wording inputs. Scan-only profiles; two-stage canonical then affine resampling with untouched raster certification. Rejected poses remain diagnostic. Existing experimental frames are excluded.',
  summary,
  rows,
});
console.log(summary);
