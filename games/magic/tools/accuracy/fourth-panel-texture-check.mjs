import {
  FrameTexturePatch,
  FrameTextureObjective,
  grayFrameTexturePatch as gray,
} from './frame-texture-objective.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, objectFile, writeJson } from './common.mjs';
import { normalizedRgbaRegion } from './normalized-rgba-region.mjs';
import { median } from './metrics.mjs';
const [inputFile, registrationFile, output] = process.argv.slice(2);
assert(output, 'Usage: fourth-panel-texture-check.mjs INPUTS PANEL_REGISTRATION NEW_OUTPUT');
const ib = await fs.readFile(inputFile),
  inputs = JSON.parse(ib),
  rb = await fs.readFile(registrationFile),
  registration = JSON.parse(rb),
  rects = [118, 228, 324].flatMap((y) => [
    [28, y - 2, 20, 36],
    [440, y - 2, 20, 36],
  ]),
  observations = [];
assert.equal(inputs.set, '4ed');
assert.equal(registration.inputHash, hash(ib));
assert.equal(registration.rows.length, 378);
const sources = Object.fromEntries(
  await Promise.all(
    [
      'fourth-panel-texture-check.mjs',
      'frame-texture-objective.mjs',
      'normalized-rgba-region.mjs',
      'scan-transform.mjs',
      'metrics.mjs',
    ].map(async (f) => [f, hash(await fs.readFile(new URL(f, import.meta.url)))]),
  ),
);
for (const r of registration.rows) {
  const e = inputs.entries.find((e) => e.id === r.id),
    b = await fs.readFile(objectFile(e.reference));
  assert.equal(hash(b), e.reference.sha256);
  const image = PNG.sync.read(b);
  const patches = {
    before: rects.map((rect) => gray(normalizedRgbaRegion(image, rect, r.parentTransform))),
    after: rects.map((rect) => gray(normalizedRgbaRegion(image, rect, r.transform))),
  };
  observations.push({
    id: r.id,
    name: r.name,
    material: r.material,
    cohort: r.cohort,
    panelAccepted: r.accepted,
    referenceHash: r.referenceHash,
    patches,
  });
  if (observations.length % 40 === 0) console.log('Patches', observations.length);
}
await writeJson(output + '.observations.json', {
  schema: 1,
  registrationHash: hash(rb),
  rects,
  rows: observations,
});
const objectives = new WeakMap(),
  prepared = new WeakMap();
function score(template, data, dx = 0, dy = 0) {
  let objective = objectives.get(template),
    source = prepared.get(data);
  if (!objective) {
    objective = new FrameTextureObjective(new FrameTexturePatch(template));
    objectives.set(template, objective);
  }
  if (!source) {
    source = new FrameTexturePatch(data);
    prepared.set(data, source);
  }
  return objective.score(source, dx, dy);
}
const materials = [...new Set(observations.map((r) => r.material))],
  templates = Object.fromEntries(
    materials.map((material) => {
      const c = observations.filter((r) => r.material === material && r.cohort === 'calibration');
      return [
        material,
        Object.fromEntries(
          ['before', 'after'].map((mode) => [
            mode,
            rects.map((_, i) =>
              c[0].patches[mode][i].map((_, k) => median(c.map((r) => r.patches[mode][i][k]))),
            ),
          ]),
        ),
      ];
    }),
  );
const rows = [];
for (const r of observations) {
  const result = Object.fromEntries(
    ['before', 'after'].map((mode) => [
      mode,
      rects.map((_, i) => {
        const t = templates[r.material][mode][i],
          data = r.patches[mode][i],
          at = score(t, data),
          steps = [0, -0.5, 0.5, -1, 1, -1.5, 1.5, -2, 2];
        let best = { ...at, dx: 0, dy: 0 };
        for (const dx of steps)
          for (const dy of steps) {
            const p = score(t, data, dx, dy);
            if (p.score > best.score + 1e-9) best = { ...p, dx, dy };
          }
        return { at, best, weak: at.templateStd < 1 || at.sourceStd < 1 };
      }),
    ]),
  );
  rows.push({
    id: r.id,
    name: r.name,
    material: r.material,
    cohort: r.cohort,
    panelAccepted: r.panelAccepted,
    ...result,
  });
  if (rows.length % 40 === 0) console.log('Texture checked', rows.length);
}
const mean = (a) => a.reduce((s, n) => s + n, 0) / a.length;
const summary = Object.fromEntries(
  materials.map((m) => {
    const a = rows.filter((r) => r.material === m && r.cohort === 'validation');
    return [
      m,
      Object.fromEntries(
        ['before', 'after'].map((mode) => {
          const p = a.flatMap((r) => r[mode]).filter((p) => !p.weak);
          return [
            mode,
            {
              cards: a.length,
              patches: p.length,
              ncc: mean(p.map((p) => p.at.score)),
              residual: mean(p.map((p) => Math.hypot(p.best.dx, p.best.dy))),
              nearZero: p.filter((p) => Math.hypot(p.best.dx, p.best.dy) <= 0.5).length,
            },
          ];
        }),
      ),
    ];
  }),
);
await writeJson(output, {
  schema: 1,
  status: 'complete-independent-texture-diagnostic-not-approval',
  inputHash: hash(ib),
  sources,
  registrationHash: hash(rb),
  rects,
  summary,
  rows,
});
console.log(JSON.stringify(summary));
