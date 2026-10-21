// Scan-only registration. Shared templates never read a renderer image.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir } from 'node:fs/promises';
import { hash, root, writeJson } from './common.mjs';
import { unpackFramePatches, patchGradient, patchSupport } from './frame-patch-profiles.mjs';
import { NATIVE_FRAME_FILTER } from './native-frame-patches.mjs';
import { median } from './metrics.mjs';
import { fitScanResidual } from './printed-plate-registration.mjs';
import { profileSupport, bounded } from './scan-gradient-fit.mjs';
import { fitModernAffine as fitGradientProfiles } from './modern-affine-fit.mjs';
import { metricSourceGraph } from './module-graph.mjs';
const [observationsFile, outputDirectory] = process.argv.slice(2);
assert(outputDirectory, 'Usage: modern-calibration-normalize.mjs OBSERVATIONS OUT');
const bytes = await readFile(observationsFile),
  observations = JSON.parse(bytes);
assert.equal(observations.channel, 'HSV-V-coarse-and-native-v1');
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
assert.deepEqual(
  reviews[1].data.positions,
  observations.partitions.map((p) => p.bottom[3]),
);
assert(observations.partitions.every((p) => p.bottom[4] === reviews[1].data.halfSpan));
assert(observations.rows.every((r) => r.contentIsolationPassed));
const sources = Object.fromEntries(
  await Promise.all(
    [
      'modern-calibration-normalize.mjs',
      'modern-affine-fit.mjs',
      'frame-patch-profiles.mjs',
      'native-frame-patches.mjs',
      'modern-frame-value.mjs',
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
  assert(
    row.patches
      .flat()
      .every(
        (p) =>
          p.filter === NATIVE_FRAME_FILTER && p.channel === 'HSV-V-before-native-frame-filter-v1',
      ),
    'Require native antialiasing for the fine objective',
  );
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
          gradient: Array.from({ length: gradients[0].length }, (_, j) =>
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
  sourceGraphs: {
    affine: await metricSourceGraph(new URL('./modern-affine-fit.mjs', import.meta.url).pathname),
    nativeFields: await metricSourceGraph(
      new URL('./modern-frame-value.mjs', import.meta.url).pathname,
    ),
    coarse: await metricSourceGraph(
      new URL('./printed-plate-registration.mjs', import.meta.url).pathname,
    ),
  },
  graphToolHash: hash(await readFile(new URL('./module-graph.mjs', import.meta.url))),
  set: observations.set,
  channel: observations.channel,
  observationsHash: hash(bytes),
  sources,
  reviews: reviews.map(({ file, sha256 }) => ({ file, sha256 })),
  templates,
  partitionPolicy: {
    fit: [0, 1],
    validation: [2],
    modelSelection: 'none; fixed six-parameter affine',
  },
  policy:
    'Complete observed scan census. Physical geometry and normal-frame material families; gradient vectors use the matched outer-boundary interval for normalization and are normalized to L2 norm100 before taking population medians so pale cards cannot dominate the shared edge positions. Four tangential bins on each field, using finer eight-point quadrature on narrower bottom fields, retain local2D shape without consuming the reserve needed for tangential motion. Each bottom partition contains two left and one right strip, avoiding an accidental material/color split between fit and validation. A joint six-parameter affine fit samples small reviewed2D HSV-value fields computed from raw max(R,G,B) before filtering, independent of hue/saturation and preserving affine value gain/offset with the exact inverse matrix (including tangential movement along curves), and uses original unnormalized gradients, preserving low-signal rejection. Coarse profiles are also projected to HSV value before canonical resampling, so the starting search and fine objective share the same channel. The earlier stepwise models only supply starting points; independent strips and known-raster controls gate the affine result. All colors, foil flags and materials remain in the denominator. Two disjoint field partitions jointly fit the fixed affine model; the third partition alone validates and certifies it. Validation and certification are the same held pixels, not two independent tests; no held-out-name or unseen-transfer claim. Scan poses are comparison-only and never enter renderer defaults.',
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
  const family = templates[row.geometry];
  const template = family.partitions[0].concat(family.partitions[1]),
    independentTemplate = family.partitions[2];
  const fit = fitGradientProfiles(
    {
      ...row,
      profiles: row.profiles[0].concat(row.profiles[1]),
      independentProfiles: row.profiles[2],
      patches: row.patches[0].concat(row.patches[1]),
      independentPatches: row.patches[2],
      fit: fitScanResidual(row.profiles[0], template),
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
