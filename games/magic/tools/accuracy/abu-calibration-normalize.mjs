import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, readJson, writeJson, objectFile } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { canonicalScanProfiles, fitScanResidual } from './printed-plate-registration.mjs';
import { scanBoundaryProfiles } from './scan-boundary-profiles.mjs';
import { fitGradientProfiles, profileSupport, bounded } from './scan-gradient-fit.mjs';
const [inputFile, outputDirectory] = process.argv.slice(2);
if (!outputDirectory) throw Error('Usage: abu-calibration-normalize.mjs INPUTS.json OUT');
const source = await readJson(inputFile),
  entries = structuredClone(source.entries);
assert.ok(entries.length > 200 && entries.every((e) => ['lea', 'leb', '2ed'].includes(e.card.set)));
const set = entries[0].card.set;
assert.ok(entries.every((e) => e.card.set === set));
const dir = path.resolve(outputDirectory);
await mkdir(dir, { recursive: true });
await mkdir(path.join(dir, 'profiles'), { recursive: true });
const bounds = { left: [0, 34], right: [454, 487], top: [0, 30], bottom: [644, 679] };
const windows = (v, h, span) => ({
  left: ['x', 10, 34, v, span],
  right: ['x', 454, 478, v, span],
  top: ['y', 10, 30, h, span],
  bottom: ['y', 644, 671, h, span],
});
const groups = [
  windows([150, 300, 530], [90, 205, 320], 10),
  windows([205, 370, 580], [140, 255, 375], 10),
  windows([250, 440, 490], [165, 285, 405], 8),
];
for (const side of Object.keys(bounds))
  for (let i = 0; i < 3; i++)
    for (let j = i + 1; j < 3; j++)
      for (const x of groups[i][side][3])
        for (const y of groups[j][side][3])
          assert.ok(Math.abs(x - y) > groups[i][side][4] + groups[j][side][4]);
const files = [
  'abu-calibration-normalize.mjs',
  'scan-boundary-profiles.mjs',
  'scan-gradient-fit.mjs',
  'pixels-pure.mjs',
  'printed-plate-registration.mjs',
  'metrics.mjs',
];
const sources = Object.fromEntries(
  await Promise.all(files.map(async (f) => [f, hash(await readFile(new URL(f, import.meta.url)))])),
);
const methodHash = hash(JSON.stringify({ sources, bounds, groups }));
for (const e of entries)
  e.cohort =
    parseInt(hash(e.card.oracle_id ?? e.card.name).slice(0, 8), 16) % 3 === 0
      ? 'validation'
      : 'calibration';
const observations = [];
for (const e of entries) {
  const file = path.join(dir, 'profiles', e.id + '.json');
  let record;
  try {
    record = await readJson(file);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (record) {
    assert.equal(record.methodHash, methodHash, 'Use a new directory after changing the method');
    assert.equal(record.referenceHash, e.reference.sha256);
  } else {
    const bytes = await readFile(objectFile(e.reference));
    assert.equal(hash(bytes), e.reference.sha256);
    const image = normalize(PNG.sync.read(bytes, { checkCRC: true })),
      profiles = groups.map((g) => scanBoundaryProfiles(image, g, bounds));
    const changed = { ...image, data: image.data.slice() };
    for (let y = 31; y < 644; y++)
      for (let x = 35; x < 454; x++)
        changed.data.set([x % 255, y % 255, (x + y) % 255, 255], (y * 488 + x) * 4);
    for (let i = 0; i < groups.length; i++)
      assert.deepEqual(
        scanBoundaryProfiles(changed, groups[i], bounds),
        profiles[i],
        e.card.name + ': content isolation',
      );
    record = {
      id: e.id,
      name: e.card.name,
      set,
      material: e.material,
      cohort: e.cohort,
      referenceHash: e.reference.sha256,
      methodHash,
      contentIsolationPassed: true,
      profiles: profiles[0],
      independentProfiles: profiles[1],
      certificationProfiles: profiles[2],
    };
    await writeJson(file, record);
  }
  observations.push(record);
  if (observations.length % 50 === 0)
    console.log(set, 'profiles', observations.length, '/', entries.length);
}
const templates = canonicalScanProfiles(observations),
  independent = canonicalScanProfiles(
    observations.map((r) => ({ ...r, profiles: r.independentProfiles })),
  ),
  certification = canonicalScanProfiles(
    observations.map((r) => ({ ...r, profiles: r.certificationProfiles })),
  );
const template = {
  schema: 1,
  set,
  methodHash,
  bounds,
  groups,
  templates,
  independent,
  certification,
  calibration: observations
    .filter((r) => r.cohort === 'calibration')
    .map(({ id, name, material, referenceHash }) => ({ id, name, material, referenceHash })),
};
await writeJson(path.join(dir, 'templates.json'), template);
const templateHash = hash(JSON.stringify(template)),
  rows = [];
for (const r of observations) {
  const file = path.join(dir, r.id + '-pose.json');
  let row;
  try {
    row = await readJson(file);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (row) {
    assert.equal(row.methodHash, methodHash);
    assert.equal(row.templateHash, templateHash);
    assert.equal(row.referenceHash, r.referenceHash);
  } else {
    const fit = fitGradientProfiles(
      { ...r, fit: fitScanResidual(r.profiles, templates[r.material]) },
      {
        template: templates[r.material],
        independentTemplate: independent[r.material],
        search: 'independent-axis-seed-v1',
      },
    );
    const certificate = profileSupport(
      r.certificationProfiles,
      certification[r.material],
      fit.parameters,
      { residuals: true },
    );
    row = {
      id: r.id,
      name: r.name,
      set,
      material: r.material,
      cohort: r.cohort,
      referenceHash: r.referenceHash,
      methodHash,
      templateHash,
      ...fit,
      certification: certificate,
      accepted: fit.accepted && certificate.accepted && bounded(fit.parameters),
      contentIsolationPassed: true,
    };
    await writeJson(file, row);
  }
  rows.push(row);
  if (rows.length % 50 === 0) console.log(set, 'poses', rows.length, '/', entries.length);
}
const summary = {
  total: rows.length,
  accepted: rows.filter((r) => r.accepted).length,
  materials: Object.fromEntries(
    [...new Set(rows.map((r) => r.material))].map((m) => [
      m,
      {
        total: rows.filter((r) => r.material === m).length,
        accepted: rows.filter((r) => r.material === m && r.accepted).length,
      },
    ]),
  ),
};
await writeJson(path.join(dir, 'normalization.json'), {
  schema: 1,
  set,
  status: 'awaiting-visual-boundary-review',
  validationKind: 'reused-development',
  inputHash: hash(await readFile(inputFile)),
  methodHash,
  templateHash,
  sources,
  summary,
  policy:
    'Scan-only, name-grouped templates. Disjoint fit, model selection and untouched certification. Whole-interior replacement must leave all extracted profiles identical. Scan transforms are comparison-only and never enter renderer defaults. Axis scale diagnostics remain explicit; source frame geometry must be assessed against scan-derived templates, never against itself.',
  rows,
});
console.log(summary);
