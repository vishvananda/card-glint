import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { hash, objectFile, writeJson, root } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { scanBoundaryProfiles } from './scan-boundary-profiles.mjs';
import { canonicalScanProfiles } from './printed-plate-registration.mjs';
import { fitGradientProfiles, profileSupport } from './scan-gradient-fit.mjs';
import { scanMatrix } from './scan-transform.mjs';
import { median } from './metrics.mjs';
const [inputFile, parentFile, out] = process.argv.slice(2);
assert(out, 'Usage: fourth-panel-registration.mjs ORIGINAL_INPUTS STOCK_POSES NEW_OUTPUT');
const ib = await fs.readFile(inputFile),
  pb = await fs.readFile(parentFile),
  inputs = JSON.parse(ib),
  parents = JSON.parse(pb);
assert.equal(inputs.set, '4ed');
assert.equal(parents.set, '4ed');
const identities = async () =>
  Object.fromEntries(
    await Promise.all(
      [
        'fourth-panel-registration.mjs',
        'scan-boundary-profiles.mjs',
        'printed-plate-registration.mjs',
        'scan-gradient-fit.mjs',
        'scan-transform.mjs',
        'pixels-pure.mjs',
        'metrics.mjs',
      ].map(async (f) => [f, hash(await fs.readFile(new URL(f, import.meta.url)))]),
    ),
  );
const sources = await identities();
assert.equal(inputs.entries.length, 378);
await fs.mkdir(out);
const bounds = { left: [42, 67], right: [420, 447], top: [396, 413], bottom: [594, 620] };
const windows = (v, h) => ({
  left: ['x', 47, 63, v, 5],
  right: ['x', 425, 441, v, 5],
  top: ['y', 400, 410, h, 5],
  bottom: ['y', 600, 615, h, 5],
});
const groups = [
  windows([442, 500, 558], [106, 244, 382]),
  windows([466, 526], [160, 326]),
  windows([484, 544], [196, 292]),
];
for (const side of Object.keys(bounds))
  for (let i = 0; i < 3; i++)
    for (let j = i + 1; j < 3; j++)
      for (const a of groups[i][side][3])
        for (const b of groups[j][side][3]) assert(Math.abs(a - b) > 10);
const observations = [],
  images = new Map();
for (const e of inputs.entries) {
  const p = parents.rows.find((p) => p.id === e.id);
  assert(p.accepted);
  assert.equal(p.referenceHash, e.reference.sha256);
  const bytes = await fs.readFile(objectFile(e.reference));
  assert.equal(hash(bytes), e.reference.sha256);
  const image = PNG.sync.read(bytes),
    stock = normalize(image, p.transform),
    profiles = groups.map((g) => scanBoundaryProfiles(stock, g, bounds));
  const isolated = { ...stock, data: new Uint8Array(stock.data.length) };
  for (let i = 0; i < isolated.data.length; i++) isolated.data[i] = (i * 73 + 31) % 256;
  for (const g of groups)
    for (const [side, [axis, , , along, span]] of Object.entries(g))
      for (const at of along) {
        const [lo, hi] = bounds[side];
        for (let normal = lo; normal <= hi; normal++)
          for (let a = at - span; a <= at + span; a++) {
            const index = ((axis === 'x' ? a : normal) * 488 + (axis === 'x' ? normal : a)) * 4;
            isolated.data.set(stock.data.subarray(index, index + 4), index);
          }
      }
  for (let i = 0; i < 3; i++)
    assert.deepEqual(scanBoundaryProfiles(isolated, groups[i], bounds), profiles[i]);
  observations.push({
    id: e.id,
    name: e.name,
    material: e.material,
    cohort: p.cohort,
    referenceHash: e.reference.sha256,
    parentTransform: p.transform,
    profiles: profiles[0],
    independentProfiles: profiles[1],
    certificationProfiles: profiles[2],
    contentIsolationPassed: true,
  });
  images.set(e.id, image);
  if (observations.length % 30 === 0) console.log('Extracted', observations.length);
}
const templates = groups.map((_, i) =>
  canonicalScanProfiles(
    observations.map((r) => ({
      ...r,
      profiles: [r.profiles, r.independentProfiles, r.certificationProfiles][i],
    })),
  ),
);
await writeJson(out + '/observations.json', {
  schema: 1,
  sources,
  inputHash: hash(ib),
  parentHash: hash(pb),
  bounds,
  groups,
  templates,
  rows: observations,
});
const compose = (r, p) => {
  const [a, b, c, d, x, y] = scanMatrix(p),
    [e, f, g, h, u, v] = scanMatrix(r);
  return {
    matrix: [
      e * a + g * b,
      f * a + h * b,
      e * c + g * d,
      f * c + h * d,
      e * x + g * y + u,
      f * x + h * y + v,
    ],
  };
};
const rows = [];
for (const r of observations) {
  const fit = fitGradientProfiles(
    { ...r, fit: { transform: { scale: 1, tx: 0, ty: 0 } } },
    {
      template: templates[0][r.material],
      independentTemplate: templates[1][r.material],
      search: 'independent-axis-seed-v1',
    },
  );
  const identity = { sx: 1, sy: 1, tx: 0, ty: 0, rotation: 0, shear: 0 },
    before = profileSupport(r.certificationProfiles, templates[2][r.material], identity, {
      residuals: true,
    });
  const certificate = profileSupport(
    r.certificationProfiles,
    templates[2][r.material],
    fit.parameters,
    { residuals: true },
  );
  const transform = compose(fit.transform, r.parentTransform),
    warped = normalize(images.get(r.id), transform);
  const exact = groups.map((g, i) =>
    profileSupport(scanBoundaryProfiles(warped, g, bounds), templates[i][r.material], identity, {
      residuals: true,
    }),
  );
  const passed = (v) =>
    v.accepted &&
    v.confidence >= 0.9 &&
    Object.values(v.sides).every((s) => s >= 0.8) &&
    v.residualRms <= 0.5;
  const accepted = fit.accepted && passed(certificate) && exact.every(passed);
  rows.push({ ...r, fit, before, certificate, exact, transform, accepted });
  if (rows.length % 10 === 0)
    console.log('Fitted', rows.length, 'accepted', rows.filter((r) => r.accepted).length);
  await writeJson(out + '/registration.json', {
    schema: 1,
    sources,
    status: 'running',
    scope:
      'Reference-only printed rules-panel alignment relative to frozen stock poses. Independent fitting,model-selection and certificate strips;exact single-pass sampling after affine composition. No renderer or text pixels select transforms. Numerical-only;not full-frame certification.',
    inputHash: hash(ib),
    parentHash: hash(pb),
    bounds,
    groups,
    rows,
  });
}
const summary = {
  cards: rows.length,
  accepted: rows.filter((r) => r.accepted).length,
  byMaterial: Object.fromEntries(
    [...new Set(rows.map((r) => r.material))].map((m) => {
      const a = rows.filter((r) => r.material === m),
        cal = a.filter((r) => r.cohort === 'calibration');
      return [
        m,
        {
          cards: a.length,
          accepted: a.filter((r) => r.accepted).length,
          baselineCertificateAccepted: a.filter(
            (r) => r.before.confidence >= 0.9 && r.before.residualRms <= 0.5,
          ).length,
          calibrationMedians: Object.fromEntries(
            ['sx', 'sy', 'tx', 'ty', 'rotation', 'shear'].map((k) => [
              k,
              median(cal.map((r) => r.fit.parameters[k])),
            ]),
          ),
        },
      ];
    }),
  ),
};
await assert.deepEqual(await identities(), sources);
assert.equal(hash(await fs.readFile(inputFile)), hash(ib));
assert.equal(hash(await fs.readFile(parentFile)), hash(pb));
await writeJson(out + '/registration.json', {
  schema: 1,
  sources,
  status: 'complete-experimental-not-adopted',
  scope:
    'Rules-panel normalization only. Stock poses remain separate;no layout defaults or scores change. Source-only templates;reused development scans,not a blind holdout.',
  inputHash: hash(ib),
  parentHash: hash(pb),
  bounds,
  groups,
  templates,
  summary,
  rows,
});
console.log(JSON.stringify(summary));
