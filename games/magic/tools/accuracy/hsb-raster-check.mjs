import assert from 'node:assert/strict';
import {
  readJson,
  writeJson,
  fixtureRoot,
  outputRoot,
  cacheRoot,
  objectFile,
  hash,
  sourceHash,
  root,
} from './common.mjs';
import { readPng, normalize } from './pixels.mjs';
import { sampleColor, delta, center, quantile, median } from './hsb-color.mjs';
const base = `${outputRoot}/early-hsb`,
  plan = await readJson(`${fixtureRoot}/early-hsb-plan.json`),
  results = await readJson(`${fixtureRoot}/early-hsb-results.json`),
  snapshot = await readJson(`${cacheRoot}/rollout/early-hsb.json`),
  before = await readJson(`${base}/before/capture.json`),
  after = await readJson(`${base}/after/capture.json`);
assert.equal(after.rendererHash, await sourceHash(`${root}/games/magic/src`));
const rows = [],
  mana = [];
for (const row of after.rows) {
  const entry = snapshot.entries.find((e) => e.id === row.id),
    scan = normalize(await readPng(objectFile(entry.reference)));
  const original = before.rows.find((r) => r.id === row.id);
  for (const tier of ['inspect', 'table']) {
    const old = normalize(await readPng(`${base}/before/${original.images[tier].file}`)),
      current = normalize(await readPng(`${base}/after/${row.images[tier].file}`));
    // Inside the art window, safely away from antialiased frame boundaries.
    let artChanges = 0;
    for (let y = 100; y < 350; y++)
      for (let x = 80; x < 410; x++) {
        const i = (y * old.width + x) * 4;
        if ([0, 1, 2, 3].some((c) => old.data[i + c] !== current.data[i + c])) artChanges++;
      }
    assert.equal(artChanges, 0, `Art changed ${row.id}/${tier}`);
    const components = {};
    for (const component of ['frame', 'paper']) {
      const opts = { paper: component === 'paper', tileSize: plan.sampling.tileSize },
        patches = plan.sampling[component + 'Patches'];
      const ref = sampleColor(scan, patches, opts),
        a = sampleColor(old, patches, opts),
        b = sampleColor(current, patches, opts),
        group = results.groups.find(
          (g) => g.key === `${row.set}-${row.material}` && g.component === component,
        );
      components[component] = {
        status: group.status,
        flags: group.flags,
        before: delta(a.rgb, ref.rgb),
        after: delta(b.rgb, ref.rgb),
        referenceRgb: ref.rgb,
        beforeRgb: a.rgb,
        afterRgb: b.rgb,
        modelPrediction: group.rows.find((r) => r.id === row.id)?.after ?? null,
      };
    }
    rows.push({
      id: row.id,
      set: row.set,
      material: row.material,
      name: row.name,
      cohort: row.cohort,
      tier,
      artChanges,
      components,
    });
    if (tier === 'inspect') {
      const symbol = row.face.manaSymbols?.at(-1);
      if (['W', 'U', 'B', 'R', 'G'].includes(symbol)) {
        const [cx, cy] =
          row.set === '3ed' ? [435, 44.5] : row.set === 'leb' ? [435.5696, 47.328] : [432, 46];
        const ref = disc(scan, cx, cy),
          rendered = disc(old, cx, cy),
          sensitivity = Math.max(
            ...[
              [2, 0],
              [-2, 0],
              [0, 2],
              [0, -2],
            ].map(([dx, dy]) => delta(ref, disc(scan, cx + dx, cy + dy))),
          );
        mana.push({
          id: row.id,
          set: row.set,
          symbol,
          referenceRgb: ref,
          renderedRgb: rendered,
          error: delta(ref, rendered),
          offsetSensitivity: sensitivity,
          status: 'diagnostic-only; no mana recoloring',
          method:
            'Fixed annulus at the rendered rightmost cost center, radii 5–9; retain brighter half to suppress black glyph. No per-scan center search.',
        });
      }
    }
  }
}
const enabled = rows
  .filter((r) => r.cohort === 'validation' && r.tier === 'inspect')
  .flatMap((r) => Object.values(r.components).filter((c) => c.status === 'trial'));
const report = {
  schemaVersion: 1,
  rendererHash: after.rendererHash,
  planHash: after.planHash,
  resultsHash: hash(JSON.stringify(results)),
  beforeCaptureHash: hash(JSON.stringify(before)),
  afterCaptureHash: hash(JSON.stringify(after)),
  defaultPixelsIdentical: after.defaultPixelsIdentical,
  summary: {
    reservedEnabledComponents: enabled.length,
    before: median(enabled.map((c) => c.before)),
    after: median(enabled.map((c) => c.after)),
    worstRegression: Math.max(0, ...enabled.map((c) => c.after - c.before)),
    artChanges: 0,
  },
  rows,
  mana,
};
await writeJson(`${fixtureRoot}/early-hsb-raster-results.json`, report);
console.log(JSON.stringify(report.summary));
function disc(image, cx, cy) {
  const pixels = [];
  for (let y = Math.floor(cy - 9); y <= Math.ceil(cy + 9); y++)
    for (let x = Math.floor(cx - 9); x <= Math.ceil(cx + 9); x++) {
      const radius = Math.hypot(x - cx, y - cy);
      if (radius < 5 || radius > 9) continue;
      const i = (y * image.width + x) * 4;
      pixels.push([0, 1, 2].map((c) => image.data[i + c] / 255));
    }
  const limit = quantile(
    pixels.map((p) => Math.max(...p)),
    0.5,
  );
  return center(pixels.filter((p) => Math.max(...p) >= limit));
}
