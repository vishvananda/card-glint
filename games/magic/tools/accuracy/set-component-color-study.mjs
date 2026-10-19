import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { createServer } from 'vite';
import { readJson, writeJson, hash, root } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { normalizedReference } from './abu-reference-cache.mjs';
import { sampleColor, center, delta, median, oklab, quantile } from './hsb-color.mjs';
import { sampleTexture } from './hsb-texture.mjs';
import { searchCalibration } from './calibration-search.mjs';

const [inputFile, posesDirectory, nativeRoot, output, samplesFile] = process.argv.slice(2);
if (!output) throw Error('Usage: set-component-color-study.mjs INPUTS POSES NATIVE OUT');
const input = await readJson(inputFile),
  poses = await readJson(path.join(posesDirectory, 'normalization.json')),
  capture = await readJson(path.join(nativeRoot, 'capture.json'));
assert.equal(hash(await readFile(inputFile)), poses.inputHash);
assert.equal(capture.inputHash, poses.inputHash);
assert.equal(capture.complete, true);
const patches = {
  frame: [
    [33, 110, 11, 50],
    [33, 200, 11, 50],
    [33, 290, 11, 50],
    [444, 110, 11, 50],
    [444, 200, 11, 50],
    [444, 290, 11, 50],
  ],
  paper: [[78, 434, 328, 140]],
  stock: [
    [6, 140, 5, 100],
    [477, 140, 5, 100],
    [130, 668, 100, 5],
  ],
  ink: [
    [22, 80, 4, 520],
    [462, 80, 4, 520],
    [40, 26, 405, 4],
    [40, 650, 405, 4],
  ],
};
const ordered = (colors) => {
  const a = colors.map((rgb) => ({ rgb, l: oklab(rgb)[0] })).sort((a, b) => a.l - b.l);
  return Array.from({ length: 10 }, (_, i) =>
    center(
      a
        .slice(Math.floor((a.length * i) / 10), Math.floor((a.length * (i + 1)) / 10))
        .map((p) => p.rgb),
    ),
  );
};
const inkColor = (image) => {
  const rgb = [];
  for (const [x, y, w, h] of patches.ink)
    for (let yy = y; yy < y + h; yy++)
      for (let xx = x; xx < x + w; xx++) {
        const i = (yy * image.width + xx) * 4;
        assert.equal(image.data[i + 3], 255);
        rgb.push([0, 1, 2].map((c) => image.data[i + c] / 255));
      }
  rgb.sort((a, b) => Math.max(...a) - Math.max(...b));
  return center(rgb.slice(0, Math.max(1, Math.floor(rgb.length * 0.02))));
};
const basics = { Plains: 'W', Island: 'U', Swamp: 'B', Mountain: 'R', Forest: 'G' },
  manifests = new Map(),
  rows = [];
const parent = samplesFile ? await readJson(samplesFile) : undefined;
if (parent) {
  assert.equal(parent.inputHash, poses.inputHash);
  assert.equal(parent.normalizationHash, hash(JSON.stringify(poses)));
  assert.equal(parent.rendererHash, capture.rendererHash);
  assert.deepEqual(parent.patches, patches);
  assert.equal(parent.rows.length, input.entries.length);
  assert.equal(new Set(parent.rows.map((r) => r.id)).size, input.entries.length);
  for (const e of input.entries) {
    const r = parent.rows.find((r) => r.id === e.id),
      p = poses.rows.find((p) => p.id === e.id);
    assert.equal(r.name, e.card.name);
    assert.equal(r.material, e.material);
    assert.equal(r.cohort, p.cohort);
    assert.equal(r.accepted, p.accepted);
    const basic = e.material === 'L' && basics[e.card.name];
    assert.equal(r.group, basic ? `L-${basic}` : e.material === 'L' ? 'L/duals' : e.material);
    for (const sample of [r.render, r.scan]) {
      for (const component of ['frame', 'paper']) assert.equal(sample[component].length, 10);
      for (const rgb of [...sample.frame, ...sample.paper, sample.stock, sample.ink])
        assert.ok(rgb.length === 3 && rgb.every((v) => Number.isFinite(v) && v >= 0 && v <= 1));
    }
    assert.equal(r.referenceHash, e.reference.sha256);
    assert.equal(r.poseHash, hash(JSON.stringify(p)));
    assert.equal(r.nativeHash, capture.rows.find((row) => row.id === e.id).after);
  }
  rows.push(...parent.rows);
}
for (const e of parent ? [] : input.entries) {
  if (!manifests.has(e.material))
    manifests.set(
      e.material,
      await readJson(path.join(nativeRoot, e.material, 'observations.json')),
    );
  const record = manifests.get(e.material).records.find((r) => r.id === e.id);
  assert.deepEqual(record.face, e.face);
  const bytes = await readFile(path.join(nativeRoot, e.material, record.baseline.file));
  assert.equal(hash(bytes), record.baseline.sha256);
  const render = normalize(PNG.sync.read(bytes)),
    pose = poses.rows.find((r) => r.id === e.id),
    reference = (await normalizedReference(e, pose, path.join(posesDirectory, 'rasters'))).image;
  const sample = (image) => ({
    frame: sampleTexture(image, patches.frame),
    paper: ordered(sampleColor(image, patches.paper, { paper: true, tileSize: 10 }).tiles),
    stock: sampleColor(image, patches.stock, { tileSize: 5 }).rgb,
    ink: inkColor(image),
  });
  const basic = e.material === 'L' && basics[e.card.name];
  rows.push({
    id: e.id,
    name: e.card.name,
    material: e.material,
    group: basic ? `L-${basic}` : e.material === 'L' ? 'L/duals' : e.material,
    cohort: pose.cohort,
    accepted: pose.accepted,
    referenceHash: e.reference.sha256,
    nativeHash: hash(bytes),
    poseHash: hash(JSON.stringify(pose)),
    render: sample(render),
    scan: sample(reference),
  });
  if (rows.length % 50 === 0) console.log(input.set, rows.length, '/', input.entries.length);
}
const server = await createServer({
    configFile: false,
    root,
    server: { middlewareMode: true, hmr: false },
  }),
  groups = {};
try {
  const math = await server.ssrLoadModule('/games/magic/src/presentation/hsb.ts');
  for (const group of [
    ...new Set(rows.map((r) => r.group)),
    ...(rows.some((r) => r.material === 'L') ? ['L/shared-frame'] : []),
  ]) {
    const pooledLand = group === 'L/shared-frame';
    const all = rows
      .filter((r) => (pooledLand ? r.material === 'L' : r.group === group) && r.accepted)
      .sort((a, b) => a.id.localeCompare(b.id));
    if (group === 'L/duals') {
      groups[group] = { status: 'composite-palette-validation-required', cards: all.length };
      continue;
    }
    if (pooledLand) {
      const source = Array.from({ length: 10 }, (_, i) =>
        center(all.map((r) => r.render.frame[i])),
      );
      if (all.some((r) => r.render.frame.some((rgb, i) => delta(rgb, source[i]) > 1))) {
        groups[group] = { status: 'mixed-source-frame-pigment', cards: all.length };
        continue;
      }
    }
    const sibling = group.startsWith('L-');
    const train = sibling ? all.slice(0, -1) : all.filter((r) => r.cohort === 'calibration'),
      val = sibling ? all.slice(-1) : all.filter((r) => r.cohort === 'validation');
    if (train.length < (sibling ? 2 : 3) || val.length < (sibling ? 1 : 3)) {
      groups[group] = { status: 'sparse', cards: all.length };
      continue;
    }
    const components = {};
    for (const component of pooledLand ? ['frame'] : ['frame', 'paper']) {
      const source = Array.from({ length: 10 }, (_, i) =>
          center(train.map((r) => r.render[component][i])),
        ),
        target = Array.from({ length: 10 }, (_, i) =>
          center(train.map((r) => r.scan[component][i])),
        );
      const neutral =
        math.rgbToHsb(center(source))[1] < 0.06 || math.rgbToHsb(center(target))[1] < 0.06;
      const score = (p) =>
        -source.reduce((n, rgb, i) => n + delta(math.adjustHsb(rgb, p), target[i]), 0) / 10;
      const fit = await searchCalibration(
        { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, valueGamma: 1 },
        [
          ...(!neutral ? [{ key: 'hueDegrees', min: -40, max: 40, steps: [4, 1, 0.25] }] : []),
          { key: 'saturationScale', min: 0.3, max: 1.5, steps: [0.1, 0.025, 0.005] },
          { key: 'brightnessScale', min: 0.7, max: 1.5, steps: [0.1, 0.025, 0.005] },
          { key: 'valueGamma', min: 0.6, max: 1.5, steps: [0.1, 0.025, 0.005] },
        ],
        score,
        { maxSweeps: 200 },
      );
      const measurements = all.map((r) => ({
        id: r.id,
        cohort: train.includes(r) ? 'calibration' : 'validation',
        before:
          r.render[component].reduce((n, rgb, i) => n + delta(rgb, r.scan[component][i]), 0) / 10,
        after:
          r.render[component].reduce(
            (n, rgb, i) => n + delta(math.adjustHsb(rgb, fit.values), r.scan[component][i]),
            0,
          ) / 10,
        clipping:
          r.render[component].filter(
            (rgb) =>
              math.rgbToHsb(rgb)[2] ** fit.values.valueGamma * fit.values.brightnessScale > 1.0001,
          ).length / 10,
      }));
      const cohorts = Object.fromEntries(
        ['calibration', 'validation'].map((c) => {
          const a = measurements.filter((r) => r.cohort === c);
          return [
            c,
            {
              cards: a.length,
              before: median(a.map((r) => r.before)),
              after: median(a.map((r) => r.after)),
              worstRegression: Math.max(...a.map((r) => r.after - r.before)),
              improvedFraction: a.filter((r) => r.after < r.before).length / a.length,
              p90Regression: quantile(
                a.map((r) => r.after - r.before),
                0.9,
              ),
              maximumClipping: Math.max(...a.map((r) => r.clipping)),
            },
          ];
        }),
      );
      components[component] = {
        adjustment: fit.values,
        boundary: fit.boundary,
        exhausted: fit.exhausted,
        neutral,
        cohorts,
        measurements,
        status:
          fit.boundary.length || fit.exhausted
            ? 'search-review'
            : Object.values(cohorts).every(
                  (c) =>
                    c.after < c.before - 0.25 &&
                    c.worstRegression <= 2 &&
                    c.maximumClipping <= 0.02,
                )
              ? 'candidate'
              : Object.values(cohorts).every(
                    (c) =>
                      c.after < c.before - 0.25 &&
                      c.improvedFraction >= 0.8 &&
                      c.p90Regression <= 0.5 &&
                      c.maximumClipping <= 0.02,
                  )
                ? 'population-candidate-review-outliers'
                : 'retain-or-inspect',
      };
    }
    groups[group] = {
      cards: all.length,
      validationKind: sibling
        ? 'sibling-printing-family-transfer'
        : 'reused-development-name-cohorts',
      components,
      stockTarget: center(train.map((r) => r.scan.stock)),
      inkTarget: center(train.map((r) => r.scan.ink)),
      inkBaseline: center(train.map((r) => r.render.ink)),
      stockBaseline: center(train.map((r) => r.render.stock)),
    };
  }
} finally {
  await server.close();
}
await writeJson(output, {
  schema: 1,
  set: input.set,
  status: 'diagnostic-not-adopted',
  inputHash: poses.inputHash,
  normalizationHash: hash(JSON.stringify(poses)),
  rendererHash: capture.rendererHash,
  scope:
    'Native geometry and scan poses frozen. Fit separate source-plate frame/paper HSV and value curves to luminance-ordered RGB deciles; paper tiles reject dark text. Texture phase is not fitted. Basic-land assets use explicitly labeled sibling-printing transfers; composite lands require separate palette validation. Stock and near-black pinline samples are diagnostics, not automatic black-point adoption.',
  patches,
  sampleParent: parent
    ? { sha256: hash(await readFile(samplesFile)), sources: parent.sources }
    : null,
  sources: await Promise.all(
    [
      'set-component-color-study.mjs',
      'hsb-color.mjs',
      'hsb-texture.mjs',
      'calibration-search.mjs',
      '../../src/presentation/hsb.ts',
    ].map(async (f) => [f, hash(await readFile(new URL(f, import.meta.url)))]),
  ),
  groups,
  rows,
});
console.log(
  Object.fromEntries(
    Object.entries(groups).map(([k, g]) => [
      k,
      {
        ...g,
        components:
          g.components &&
          Object.fromEntries(
            Object.entries(g.components).map(([c, { measurements, ...m }]) => [c, m]),
          ),
      },
    ]),
  ),
);
