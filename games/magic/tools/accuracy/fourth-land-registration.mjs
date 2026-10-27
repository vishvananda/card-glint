import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { PNG } from 'pngjs';
import { normalize } from './pixels-pure.mjs';
import { objectFile, hash, root } from './common.mjs';
import { canonicalScanProfiles } from './printed-plate-registration.mjs';
import { scanBoundaryProfiles } from './scan-boundary-profiles.mjs';
import { fitGradientProfiles, profileSupport } from './scan-gradient-fit.mjs';
import { scanMatrix } from './scan-transform.mjs';
import { normalizedRgbaRegion } from './normalized-rgba-region.mjs';
import {
  FrameTexturePatch,
  FrameTextureObjective,
  grayFrameTexturePatch as gray,
} from './frame-texture-objective.mjs';
import { median } from './metrics.mjs';
const [inputFile, parentFile, out] = process.argv.slice(2);
assert(out, 'Use ORIGINAL_INPUTS STOCK_POSES OUTPUT');
await fs.writeFile(out, '{}\n', { flag: 'wx' });
const ib = await fs.readFile(inputFile),
  pb = await fs.readFile(parentFile);
const input = JSON.parse(ib),
  parent = JSON.parse(pb);
const entries = input.entries.filter(
  (e) => e.card.set === '4ed' && /^Basic Land\b/.test(e.card.type_line),
);
assert.equal(input.entries.filter((e) => e.card.set === '4ed').length, 378);
assert.equal(entries.length, 15);
assert.equal(new Set(entries.map((e) => e.id)).size, 15);
assert(entries.every((e) => e.card.produced_mana.length === 1));
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
const rects = [100, 230, 330].flatMap((y) => [
  [28, y - 18, 20, 36],
  [440, y - 18, 20, 36],
]);
const policy = {
  panelConfidence: 0.9,
  minimumSide: 0.8,
  maximumPanelResidual: 0.5,
  texturePeers: 2,
  minimumTextureNcc: 0.8,
  minimumMeanNccGain: 0.01,
  maximumIndividualNccLoss: 0.01,
  minimumResidualImprovement: 0.25,
  minimumTextureStd: 1,
  caveat:
    'Exploratory gates fixed before measuring any text or full-card scores. No independent held-out cards.',
};
const sources = {};
for (const file of [
  'fourth-land-registration.mjs',
  'common.mjs',
  'edges.mjs',
  'scan-boundary-profiles.mjs',
  'printed-plate-registration.mjs',
  'scan-gradient-fit.mjs',
  'scan-transform.mjs',
  'normalized-rgba-region.mjs',
  'frame-texture-objective.mjs',
  'pixels-pure.mjs',
  'metrics.mjs',
])
  sources[file] = hash(await fs.readFile(new URL(file, import.meta.url)));
sources['package-lock.json'] = hash(await fs.readFile(root + '/package-lock.json'));
const data = [];
for (const e of entries) {
  const p = parent.rows.find((r) => r.id === e.id);
  assert(p.accepted);
  const bytes = await fs.readFile(objectFile(e.reference));
  assert.equal(hash(bytes), e.reference.sha256);
  const image = PNG.sync.read(bytes),
    stock = normalize(image, p.transform);
  const preserved = new Uint8Array(488 * 680);
  for (const g of groups)
    for (const [side, [axis, , , along, span]] of Object.entries(g))
      for (const at of along) {
        const [lo, hi] = bounds[side];
        for (let normal = lo; normal <= hi; normal++)
          for (let a = at - span; a <= at + span; a++)
            preserved[(axis === 'x' ? a : normal) * 488 + (axis === 'x' ? normal : a)] = 1;
      }
  // All independent texture windows stay outside every panel-selection strip.
  for (const [x, y, w, h] of rects)
    for (let yy = y; yy < y + h; yy++)
      for (let xx = x; xx < x + w; xx++) assert.equal(preserved[yy * 488 + xx], 0);
  const changed = { ...stock, data: stock.data.slice() };
  for (let i = 0; i < preserved.length; i++)
    if (!preserved[i])
      for (let k = 0; k < 4; k++) changed.data[i * 4 + k] = k === 3 ? 255 : (i * 73 + k * 31) % 256;
  const profiles = groups.map((g) => scanBoundaryProfiles(stock, g, bounds));
  assert.deepEqual(
    groups.map((g) => scanBoundaryProfiles(changed, g, bounds)),
    profiles,
  );
  data.push({
    id: e.id,
    name: e.name,
    number: e.card.collector_number,
    material: 'L-' + e.card.produced_mana.join(''),
    cohort: 'calibration',
    referenceHash: e.reference.sha256,
    parentTransform: p.transform,
    parentConfidence: p.fit.confidence,
    texturePeerEligible:
      p.fit.confidence >= 0.9 &&
      p.certification.confidence >= 0.9 &&
      Object.values(p.certification.sides).every((v) => v >= 0.8),
    image,
    profiles,
    contentIsolationPassed: true,
  });
}
const templates = groups.map((_, i) =>
  canonicalScanProfiles(data.map((r) => ({ ...r, profiles: r.profiles[i] }))),
);
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
const identity = { sx: 1, sy: 1, tx: 0, ty: 0, rotation: 0, shear: 0 };
const rows = [];
for (const r of data) {
  const fit = fitGradientProfiles(
    {
      ...r,
      profiles: r.profiles[0],
      independentProfiles: r.profiles[1],
      fit: { transform: { scale: 1, tx: 0, ty: 0 } },
    },
    {
      template: templates[0][r.material],
      independentTemplate: templates[1][r.material],
      search: 'independent-axis-seed-v1',
    },
  );
  const transform = compose(fit.transform, r.parentTransform),
    warped = normalize(r.image, transform);
  const before = profileSupport(r.profiles[2], templates[2][r.material], identity, {
    residuals: true,
  });
  const certificate = profileSupport(r.profiles[2], templates[2][r.material], fit.parameters, {
    residuals: true,
  });
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
  const peers = data.filter(
    (q) => q.material === r.material && q.id !== r.id && q.texturePeerEligible,
  );
  const texture =
    peers.length < 2
      ? []
      : rects.map((rect) => {
          const peerPatches = peers.map((q) =>
            gray(normalizedRgbaRegion(q.image, rect, q.parentTransform)),
          );
          const template = peerPatches[0].map((_, k) => median(peerPatches.map((p) => p[k])));
          const objective = new FrameTextureObjective(new FrameTexturePatch(template));
          const measure = (transform) => {
            const source = new FrameTexturePatch(
              gray(normalizedRgbaRegion(r.image, rect, transform)),
            );
            const at = objective.score(source);
            let best = { ...at, dx: 0, dy: 0 };
            for (const dx of [0, -0.5, 0.5, -1, 1, -1.5, 1.5, -2, 2])
              for (const dy of [0, -0.5, 0.5, -1, 1, -1.5, 1.5, -2, 2]) {
                const v = objective.score(source, dx, dy);
                if (v.score > best.score + 1e-9) best = { ...v, dx, dy };
              }
            return {
              at,
              best,
              residual: Math.hypot(best.dx, best.dy),
              weak: at.templateStd < 1 || at.sourceStd < 1,
            };
          };
          return { rect, before: measure(r.parentTransform), after: measure(transform) };
        });
  const mean = (values) => values.reduce((n, v) => n + v, 0) / values.length;
  const textureSummary = texture.length
    ? {
        beforeNcc: mean(texture.map((t) => t.before.at.score)),
        afterNcc: mean(texture.map((t) => t.after.at.score)),
        beforeResidual: mean(texture.map((t) => t.before.residual)),
        afterResidual: mean(texture.map((t) => t.after.residual)),
        minimumPatchDelta: Math.min(...texture.map((t) => t.after.at.score - t.before.at.score)),
        weak: texture.some((t) => t.before.weak || t.after.weak),
      }
    : null;
  const panelAccepted = fit.accepted && passed(certificate) && exact.every(passed);
  const textureAccepted = Boolean(
    textureSummary &&
      !textureSummary.weak &&
      textureSummary.afterNcc >= 0.8 &&
      textureSummary.afterNcc >= textureSummary.beforeNcc + 0.01 &&
      textureSummary.minimumPatchDelta >= -0.01 &&
      textureSummary.afterResidual <= textureSummary.beforeResidual - 0.25,
  );
  rows.push({
    id: r.id,
    name: r.name,
    number: r.number,
    material: r.material,
    referenceHash: r.referenceHash,
    parentTransform: r.parentTransform,
    parentConfidence: r.parentConfidence,
    contentIsolationPassed: r.contentIsolationPassed,
    transform,
    fit,
    before,
    certificate,
    exact,
    panelAccepted,
    texturePeers: peers.map((p) => p.id),
    textureSummary,
    textureAccepted,
    acceptedExperimental: panelAccepted && textureAccepted,
    texture,
  });
  await fs.writeFile(
    out,
    JSON.stringify(
      {
        schema: 1,
        status: 'running',
        inputHash: hash(ib),
        parentHash: hash(pb),
        sources,
        policy,
        bounds,
        groups,
        rects,
        scope:
          'Per-color panel medians use all three development scans; not independent held-out cards. Disjoint panel fit/model/certificate strips, plus leave-one-scan-out texture templates from two independently well-supported stock poses. Separate outer-frame texture patches must improve in NCC and displacement. No text,art or renderer selects transforms. No pose or score adoption.',
        rows,
      },
      null,
      2,
    ) + '\n',
  );
  console.log(
    r.name,
    r.number,
    'panel',
    rows.at(-1).panelAccepted,
    'certificate',
    before.confidence,
    certificate.confidence,
    'texture',
    textureSummary,
    'eligible',
    panelAccepted && textureAccepted,
  );
}

assert.equal(hash(await fs.readFile(inputFile)), hash(ib));
assert.equal(hash(await fs.readFile(parentFile)), hash(pb));
for (const [file, expected] of Object.entries(sources))
  assert.equal(
    hash(
      await fs.readFile(
        file === 'package-lock.json' ? root + '/' + file : new URL(file, import.meta.url),
      ),
    ),
    expected,
    'Method changed during registration',
  );

const final = JSON.parse(await fs.readFile(out));
final.status = 'complete-experimental-not-adopted';
await fs.writeFile(out, JSON.stringify(final, null, 2) + '\n');
