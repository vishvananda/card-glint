import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { readJson, writeJson, hash } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { normalizedReference } from './abu-reference-cache.mjs';
import { outerManaCircle } from './abu-mana-ring.mjs';
import { center, delta, median, quantile } from './hsb-color.mjs';
const [inputsFile, posesDirectory, nativeRoot, output] = process.argv.slice(2);
if (!output) throw Error('Usage: abu-mana-audit.mjs INPUTS POSES NATIVE OUT');
const input = await readJson(inputsFile),
  poses = await readJson(path.join(posesDirectory, 'normalization.json'));
assert.equal(poses.inputHash, hash(await readFile(inputsFile)));
const rows = [],
  manifests = new Map();
function pigment(image, circle) {
  const pixels = [];
  for (
    let y = Math.ceil(circle.y - circle.radius * 0.92);
    y <= circle.y + circle.radius * 0.92;
    y++
  )
    for (
      let x = Math.ceil(circle.x - circle.radius * 0.92);
      x <= circle.x + circle.radius * 0.92;
      x++
    ) {
      if (Math.hypot(x - circle.x, y - circle.y) > circle.radius * 0.92) continue;
      const i = (y * image.width + x) * 4,
        rgb = [0, 1, 2].map((c) => image.data[i + c] / 255);
      pixels.push(rgb);
    }
  pixels.sort((a, b) => Math.max(...a) - Math.max(...b));
  const ink = pixels.slice(0, Math.ceil(pixels.length * 0.05)),
    paper = pixels.slice(Math.floor(pixels.length * 0.8));
  const disc = center(paper),
    glyph = center(ink);
  return {
    disc,
    glyph,
    separation: Math.max(...disc) - Math.max(...glyph),
    discSpread: quantile(
      paper.map((p) => delta(p, disc)),
      0.9,
    ),
  };
}
for (const e of input.entries) {
  const cost = e.face.manaSymbols ?? [];
  if (!cost.length) continue;
  // One independently measured rightmost circle per printing avoids overweighting
  // costs with repeated symbols. It never changes scan transforms or score pixels.
  const raw = cost.at(-1),
    symbol = /^\d+$/.test(raw) ? 'N' : raw;
  if (!/^[WUBRGN]$/.test(symbol)) continue;
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
    pose = poses.rows.find((p) => p.id === e.id),
    { image: scan } = await normalizedReference(e, pose, path.join(posesDirectory, 'rasters'));
  const nominal =
    input.entries[0].card.set === 'lea' ? { x: 432, y: 46 } : { x: 434.07, y: 47.328 };
  const measurement = {};
  for (const [key, image] of [
    ['render', render],
    ['scan', scan],
  ]) {
    const circle = outerManaCircle(image, { ...nominal, range: 3, radiusRange: [9.5, 14] });
    measurement[key] = { circle, ...pigment(image, circle) };
  }
  const accepted =
    pose.accepted &&
    Object.values(measurement).every((m) => m.circle.status === 'measured' && m.separation > 0.15);
  rows.push({
    id: e.id,
    name: e.card.name,
    material: e.material,
    symbol,
    cohort: pose.cohort,
    frameAccepted: pose.accepted,
    accepted,
    referenceHash: e.reference.sha256,
    renderHash: hash(bytes),
    poseHash: hash(JSON.stringify(pose)),
    ...measurement,
    discDeltaE: delta(measurement.render.disc, measurement.scan.disc),
    glyphDeltaE: delta(measurement.render.glyph, measurement.scan.glyph),
    geometry: {
      dx: measurement.scan.circle.x - measurement.render.circle.x,
      dy: measurement.scan.circle.y - measurement.render.circle.y,
      diameter: 2 * (measurement.scan.circle.radius - measurement.render.circle.radius),
    },
  });
  if (rows.length % 25 === 0) console.log(poses.set, 'mana', rows.length);
}
const groups = Object.fromEntries(
  [...new Set(rows.map((r) => r.symbol))].map((symbol) => {
    const all = rows.filter((r) => r.symbol === symbol),
      a = all.filter((r) => r.accepted),
      train = a.filter((r) => r.cohort === 'calibration'),
      val = a.filter((r) => r.cohort === 'validation');
    const target = train.length
      ? center(train.map((r) => r.scan.disc)).map((v) => Math.round(v * 255) / 255)
      : null;
    return [
      symbol,
      {
        total: all.length,
        accepted: a.length,
        training: train.length,
        validation: val.length,
        target,
        geometry: Object.fromEntries(
          ['dx', 'dy', 'diameter'].map((k) => [
            k,
            a.length ? median(a.map((r) => r.geometry[k])) : null,
          ]),
        ),
        discDeltaE: a.length ? median(a.map((r) => r.discDeltaE)) : null,
        glyphDeltaE: a.length ? median(a.map((r) => r.glyphDeltaE)) : null,
        colorTrial:
          target && val.length
            ? {
                before: median(val.map((r) => r.discDeltaE)),
                after: median(val.map((r) => delta(r.scan.disc, target))),
                worstRegression: Math.max(
                  ...val.map((r) => delta(r.scan.disc, target) - r.discDeltaE),
                ),
              }
            : null,
      },
    ];
  }),
);
await writeJson(output, {
  schema: 1,
  set: poses.set,
  inputHash: poses.inputHash,
  normalizationHash: hash(JSON.stringify(poses)),
  scope:
    'Frame-normalized nonfoil scans and unchanged native rasters. Perimeter measurements isolate disc pigment from dark glyph, without moving either scoring raster. First/last UUID-name cohorts inherited from frozen normalization; repeated development evidence. Diameter and center measurements are diagnostics, not per-card renderer overrides. Rightmost symbols have equal per-printing weight.',
  groups,
  rows,
});
console.log(groups);
