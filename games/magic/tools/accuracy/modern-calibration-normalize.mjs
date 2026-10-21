// Scan-only registration. Shared templates never read a renderer image.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir } from 'node:fs/promises';
import { hash, root, writeJson } from './common.mjs';
import { unpackFramePatches, patchGradient, patchSupport } from './frame-patch-profiles.mjs';
import { median } from './metrics.mjs';
import { fitScanResidual } from './printed-plate-registration.mjs';
import { profileSupport, bounded } from './scan-gradient-fit.mjs';
import { fitModernAffine as fitGradientProfiles } from './modern-affine-fit.mjs';
const [observationsFile, outputDirectory] = process.argv.slice(2);
assert(outputDirectory, 'Usage: modern-calibration-normalize.mjs OBSERVATIONS OUT');
const bytes = await readFile(observationsFile),
  observations = JSON.parse(bytes);
const reviewFiles = ['m21-frame-window-upper-review.json', 'm21-frame-window-bottom-review.json'];
const reviews = await Promise.all(
  reviewFiles.map(async (f) => {
    const bytes = await readFile(path.join(root, 'games/magic/fixtures/accuracy', f));
    return { file: f, sha256: hash(bytes), data: JSON.parse(bytes) };
  }),
);
const ids = observations.rows.map((r) => [r.id, r.referenceHash]).sort();
for (const r of reviews)
  assert.deepEqual(
    r.data.references.map((r) => [r.id, r.referenceHash]).sort(),
    ids,
    'Review census',
  );
assert.equal(reviews[0].data.observationsHash, hash(bytes));
assert.deepEqual(reviews[0].data.bounds, observations.bounds);
assert.deepEqual(reviews[0].data.partitions, observations.partitions);
assert.deepEqual(reviews[0].data.windowProfiles, observations.windowProfiles);
assert.deepEqual(reviews[1].data.bounds, observations.bounds.bottom);
assert(observations.rows.every((r) => r.contentIsolationPassed));
const sources = Object.fromEntries(
  await Promise.all(
    [
      'modern-calibration-normalize.mjs',
      'modern-affine-fit.mjs',
      'frame-patch-profiles.mjs',
      'scan-transform.mjs',
      'pixels-pure.mjs',
      'printed-plate-registration.mjs',
      'scan-gradient-fit.mjs',
      'metrics.mjs',
    ].map(async (f) => [f, hash(await readFile(new URL(f, import.meta.url)))]),
  ),
);
const geometry = (r) =>
  r.kind.startsWith('planeswalker')
    ? r.kind
    : (r.profile.legendary ? 'normal-crown/' : 'normal-plain/') + r.profile.boxes;
const rows = observations.rows.map((r) => ({ ...r, geometry: geometry(r) }));
for (const row of rows) {
  const data = await readFile(path.join(path.dirname(observationsFile), row.framePatches.file));
  assert.equal(hash(data), row.framePatches.sha256);
  row.patches = unpackFramePatches(data, row.framePatches.description);
}
const templates = {};
for (const family of [...new Set(rows.map((r) => r.geometry))]) {
  const group = rows.filter((r) => r.geometry === family);
  templates[family] = {
    members: group.map((r) => r.id),
    names: [...new Set(group.map((r) => r.oracleId))],
    patchTemplates: [0, 1, 2].map((partition) =>
      group[0].patches[partition].map((p, i) => {
        const gradients = group.flatMap((r) => {
          const patch = r.patches[partition][i];
          const a = patchGradient(patch),
            norm = Math.hypot(...a);
          return norm * norm >= 10 ? [a.map((x) => (x * 100) / norm)] : [];
        });
        assert(gradients.length, 'No frame field signal');
        return {
          side: p.side,
          axis: p.axis,
          lo: p.lo,
          hi: p.hi,
          along: p.along,
          gradient: Array.from({ length: p.hi - p.lo + 1 }, (_, j) =>
            median(gradients.map((g) => g[j])),
          ),
        };
      }),
    ),
    partitions: [0, 1, 2].map((partition) =>
      group[0].profiles[partition].map((p, i) => {
        const gradients = group.flatMap((r) => {
          const v = r.profiles[partition][i];
          assert.deepEqual({ ...v, gradient: [] }, { ...p, gradient: [] });
          const norm = Math.hypot(...v.gradient.slice(v.lo - v.start, v.hi - v.start + 1));
          return norm * norm >= 10 ? [v.gradient.map((x) => (x * 100) / norm)] : [];
        });
        assert(gradients.length, 'No real frame signal for template strip');
        return { ...p, gradient: p.gradient.map((_, j) => median(gradients.map((g) => g[j]))) };
      }),
    ),
  };
}
const definition = {
  schema: 1,
  set: observations.set,
  observationsHash: hash(bytes),
  sources,
  reviews: reviews.map(({ file, sha256 }) => ({ file, sha256 })),
  templates,
  policy:
    'Complete observed scan census. Physical geometry and normal-frame material families; gradient vectors use the matched outer-boundary interval for normalization and are normalized to L2 norm100 before taking population medians so pale cards cannot dominate the shared edge positions. A joint six-parameter affine fit samples small reviewed2D gray fields with the exact inverse matrix (including tangential movement along curves), and uses original unnormalized gradients, preserving low-signal rejection. The earlier stepwise models only supply starting points; independent strips and known-raster controls gate the affine result. All colors, foil flags and materials remain in the denominator. Disjoint fit, model-selection and certification footprints; no held-out-name or unseen-transfer claim. Scan poses are comparison-only and never enter renderer defaults.',
};
const templateHash = hash(JSON.stringify(definition));
await mkdir(outputDirectory, { recursive: true });
await writeJson(path.join(outputDirectory, 'templates.json'), definition);
let fitted = [];
try {
  const previous = JSON.parse(await readFile(path.join(outputDirectory, 'normalization.json')));
  assert.equal(
    previous.templateHash,
    templateHash,
    'Use a new output directory after method/source changes',
  );
  fitted = previous.rows;
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const save = () =>
  writeJson(path.join(outputDirectory, 'normalization.json'), {
    schema: 1,
    set: observations.set,
    status: 'pending-known-transform-and-raster-certification',
    observationsHash: hash(bytes),
    templateHash,
    policy: definition.policy,
    rows: fitted,
    summary: {
      total: rows.length,
      completed: fitted.length,
      accepted: fitted.filter((r) => r.accepted).length,
      families: Object.fromEntries(
        Object.keys(templates).map((g) => [
          g,
          {
            total: rows.filter((r) => r.geometry === g).length,
            accepted: fitted.filter((r) => r.geometry === g && r.accepted).length,
          },
        ]),
      ),
    },
  });
for (const row of rows) {
  if (fitted.some((r) => r.id === row.id)) continue;
  const [template, independentTemplate, certificationTemplate] = templates[row.geometry].partitions;
  const fit = fitGradientProfiles(
    {
      ...row,
      profiles: row.profiles[0],
      independentProfiles: row.profiles[1],
      patches: row.patches[0],
      independentPatches: row.patches[1],
      fit: fitScanResidual(row.profiles[0], template),
    },
    {
      template,
      independentTemplate,
      patchTemplate: templates[row.geometry].patchTemplates[0],
      independentPatchTemplate: templates[row.geometry].patchTemplates[1],
      search: 'independent-axis-seed-v1',
    },
  );
  assert.equal(fit.model, 'affine-joint-2d');
  const certification = patchSupport(
    row.patches[2],
    templates[row.geometry].patchTemplates[2],
    fit.transform,
  );
  fitted.push({
    id: row.id,
    name: row.name,
    referenceHash: row.referenceHash,
    family: row.family,
    geometry: row.geometry,
    nonfoilEligible: row.nonfoilEligible,
    ...fit,
    certification,
    accepted: fit.accepted && certification.accepted && bounded(fit.parameters),
  });
  await save();
  if (fitted.length % 25 === 0)
    console.log(
      observations.set,
      fitted.length,
      '/',
      rows.length,
      'accepted',
      fitted.filter((r) => r.accepted).length,
    );
}
await save();
console.log(
  JSON.stringify({
    total: fitted.length,
    accepted: fitted.filter((r) => r.accepted).length,
    families: Object.fromEntries(
      Object.keys(templates).map((g) => [
        g,
        {
          total: rows.filter((r) => r.geometry === g).length,
          accepted: fitted.filter((r) => r.geometry === g && r.accepted).length,
        },
      ]),
    ),
  }),
);
