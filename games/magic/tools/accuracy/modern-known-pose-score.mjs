import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { patchSupport } from './frame-patch-profiles.mjs';
import { nativeFramePatches } from './native-frame-patches.mjs';
import { normalize } from './pixels-pure.mjs';
import { inverseScanMatrix, projectScanPoint } from './scan-transform.mjs';
import { scanBoundaryProfiles } from './scan-boundary-profiles.mjs';
import { fitScanResidual } from './printed-plate-registration.mjs';
import { profileSupport, bounded } from './scan-gradient-fit.mjs';
import { fitModernAffine as fitGradientProfiles } from './modern-affine-fit.mjs';
import { metricSourceGraph } from './module-graph.mjs';
const [obsFile, normalizationDirectory, controlDirectory, output] = process.argv.slice(2);
assert(output, 'Usage: modern-known-pose-score.mjs OBS NORMALIZATION_DIR CONTROLS_DIR OUT');
const read = async (p) => {
  const bytes = await readFile(p);
  return { bytes, data: JSON.parse(bytes) };
};
const obs = await read(obsFile),
  n = await read(path.join(normalizationDirectory, 'normalization.json')),
  t = await read(path.join(normalizationDirectory, 'templates.json')),
  controls = await read(path.join(controlDirectory, 'controls.json'));
assert.equal(n.data.rows.length, obs.data.rows.length);
assert.equal(n.data.summary.completed, n.data.summary.total);
assert.equal(n.data.observationsHash, hash(obs.bytes));
assert.equal(controls.data.observationsHash, hash(obs.bytes));
assert.equal(controls.data.templatesHash, hash(t.bytes));
assert.deepEqual(t.data.partitionPolicy.fit, [0, 1]);
assert.deepEqual(t.data.partitionPolicy.validation, [2]);
const definition = {
  schema: 1,
  sourceGraphs: {
    affine: await metricSourceGraph(new URL('./modern-affine-fit.mjs', import.meta.url).pathname),
    nativeFields: await metricSourceGraph(
      new URL('./native-frame-patches.mjs', import.meta.url).pathname,
    ),
    coarse: await metricSourceGraph(
      new URL('./printed-plate-registration.mjs', import.meta.url).pathname,
    ),
  },
  graphToolHash: hash(await readFile(new URL('./module-graph.mjs', import.meta.url))),
  observationsHash: hash(obs.bytes),
  normalizationHash: hash(n.bytes),
  templatesHash: hash(t.bytes),
  controlsHash: hash(controls.bytes),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  sources: Object.fromEntries(
    await Promise.all(
      [
        'pixels-pure.mjs',
        'modern-affine-fit.mjs',
        'frame-patch-profiles.mjs',
        'native-frame-patches.mjs',
        'scan-transform.mjs',
        'scan-boundary-profiles.mjs',
        'printed-plate-registration.mjs',
        'scan-gradient-fit.mjs',
      ].map(async (f) => [f, hash(await readFile(new URL(f, import.meta.url)))]),
    ),
  ),
  limits: { cornerRms: 0.35, cornerMax: 0.6 },
  policy:
    'Recover a known full-resolution raster warp against the same frozen scan templates, then compare the recovered matrix with baselinePose*inverse(knownWarp). Report every selected source and perturbation, including baseline/controlled rejections. The thresholds are declared before evaluating controls. These are numerical recovery controls, not an independent corpus or held-out printing claim.',
};
const multiply = (m, k) => [
  m[0] * k[0] + m[2] * k[1],
  m[1] * k[0] + m[3] * k[1],
  m[0] * k[2] + m[2] * k[3],
  m[1] * k[2] + m[3] * k[3],
  m[0] * k[4] + m[2] * k[5] + m[4],
  m[1] * k[4] + m[3] * k[5] + m[5],
];
const identity = hash(JSON.stringify(definition));
let rows = [];
try {
  const prior = await read(output);
  assert.equal(prior.data.definitionHash, identity, 'Use a new output after method/source changes');
  rows = prior.data.rows;
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const summary = () => ({
  total: controls.data.controls.length,
  completed: rows.length,
  passed: rows.filter((r) => r.passed).length,
  baselineRejected: rows.filter((r) => !r.baselineAccepted).length,
  controlledRejected: rows.filter((r) => !r.accepted).length,
  recoveryFailed: rows.filter((r) => !r.recovered).length,
  maxCornerError: Math.max(0, ...rows.map((r) => r.cornerMax)),
  families: Object.fromEntries(
    [...new Set(rows.map((r) => r.geometry))].map((g) => {
      const rs = rows.filter((r) => r.geometry === g);
      return [
        g,
        {
          count: rs.length,
          passed: rs.filter((r) => r.passed).length,
          maxCornerError: Math.max(...rs.map((r) => r.cornerMax)),
        },
      ];
    }),
  ),
});
const save = () =>
  writeJson(output, { definition, definitionHash: identity, summary: summary(), rows });
await mkdir(path.dirname(output), { recursive: true });
for (const control of controls.data.controls) {
  if (rows.some((r) => r.id === control.id && r.label === control.label)) continue;
  const source = obs.data.rows.find((r) => r.id === control.id),
    base = n.data.rows.find((r) => r.id === control.id);
  assert.equal(base.geometry, control.geometry);
  assert.equal(source.referenceHash, control.referenceHash);
  const bytes = await readFile(path.join(controlDirectory, control.file));
  assert.equal(hash(bytes), control.sha256);
  const raw = PNG.sync.read(bytes, { checkCRC: true }),
    image = normalize(raw),
    profiles = source.partitions.map((p) => scanBoundaryProfiles(image, p, source.bounds));
  const patches = source.partitions.map((p) => nativeFramePatches(raw, p, source.bounds));
  const family = t.data.templates[control.geometry];
  const template = family.partitions[0].concat(family.partitions[1]),
    independentTemplate = family.partitions[2];
  const fit = fitGradientProfiles(
    {
      profiles: profiles[0].concat(profiles[1]),
      independentProfiles: profiles[2],
      patches: patches[0].concat(patches[1]),
      independentPatches: patches[2],
      fit: fitScanResidual(profiles[0].concat(profiles[1]), template),
    },
    {
      template,
      independentTemplate,
      patchTemplate: family.patchTemplates[0].concat(family.patchTemplates[1]),
      independentPatchTemplate: family.patchTemplates[2],
      search: 'independent-axis-seed-v1',
    },
  );
  assert.equal(fit.model, 'affine-joint-2d');
  const certification = patchSupport(
    patches[2],
    t.data.templates[control.geometry].patchTemplates[2],
    fit.transform,
  );
  const expected = multiply(base.transform.matrix, inverseScanMatrix({ matrix: control.matrix }));
  const errors = [
    [20, 20],
    [468, 20],
    [20, 630],
    [468, 630],
  ].map(([x, y]) => {
    const a = projectScanPoint(x, y, { matrix: expected }),
      b = projectScanPoint(x, y, fit.transform);
    return Math.hypot(a[0] - b[0], a[1] - b[1]);
  });
  const cornerRms = Math.hypot(...errors) / Math.sqrt(errors.length),
    cornerMax = Math.max(...errors),
    recovered =
      cornerRms <= definition.limits.cornerRms && cornerMax <= definition.limits.cornerMax,
    accepted = fit.accepted && certification.accepted && bounded(fit.parameters);
  rows.push({
    id: control.id,
    name: control.name,
    label: control.label,
    geometry: control.geometry,
    referenceHash: control.referenceHash,
    controlHash: control.sha256,
    expected,
    baselineAccepted: base.accepted,
    ...fit,
    certification,
    accepted,
    cornerRms,
    cornerMax,
    recovered,
    passed: base.accepted && accepted && recovered,
  });
  await save();
  if (rows.length % 35 === 0)
    console.log(
      'known fit',
      rows.length,
      '/',
      controls.data.controls.length,
      'passed',
      rows.filter((r) => r.passed).length,
    );
}
await save();
console.log(JSON.stringify(summary()));
assert(
  rows.every((r) => r.passed),
  'Known-pose failures retained; do not certify the normalization',
);
