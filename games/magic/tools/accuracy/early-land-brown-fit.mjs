// One shared brown-rail HSB fit; existing geometry, paper and accents stay source-bound.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { root, hash, writeJson } from './common.mjs';
import { fitHsb, evaluateHsb, median } from './hsb-color.mjs';
const [auditFile, baseDefinitionFile, accentFitFile, output, definitionFile] =
  process.argv.slice(2);
assert(
  definitionFile,
  'Usage: early-land-brown-fit.mjs BROWN_AUDIT BASE_DEFINITION ACCENT_FIT OUT DEFINITION',
);
const load = async (p) => {
  const bytes = await readFile(p);
  return { bytes, data: JSON.parse(bytes) };
};
const audit = await load(auditFile),
  base = await load(baseDefinitionFile),
  accents = await load(accentFitFile);
assert.equal(audit.data.rows.length, 25);
const train = audit.data.rows.filter((r) => r.cohort === 'calibration');
const reserved = audit.data.rows.filter((r) => r.cohort === 'validation');
assert(train.length >= 3 && reserved.length >= 3);
const source = {
  rgb: [0, 1, 2].map((c) => median(train.map((r) => r.components.frame.renderRgb[c]))),
  tiles: train.flatMap((r) => r.components.frame.renderTiles),
};
const model = {
  neutralSaturation: 0.06,
  hueDegrees: [-15, 15],
  saturationScale: [0.6, 1.4],
  brightnessScale: [0.85, 1.2],
};
const server = await createServer({
  root,
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const math = await server.ssrLoadModule('/games/magic/src/presentation/hsb.ts');
  const fit = fitHsb(
    source,
    train.map((r) => ({ rgb: r.components.frame.referenceRgb })),
    model,
    math,
  );
  const prior = base.data.trials.find((t) => t.id === 'brown-transfer').materials.L;
  const common = Object.values(prior.pigments)[0].frame;
  assert(
    Object.values(prior.pigments).every((a) => JSON.stringify(a.frame) === JSON.stringify(common)),
  );
  const absolute = {
    hueDegrees: common.hueDegrees + fit.adjustment.hueDegrees,
    saturationScale: common.saturationScale * fit.adjustment.saturationScale,
    brightnessScale: common.brightnessScale * fit.adjustment.brightnessScale,
  };
  const prepared = structuredClone(
    base.data.trials.find((t) => t.id === 'land-material').materials,
  );
  const outlines = base.data.trials.find((t) => t.id === 'outline-transfer').materials;
  for (const [name, m] of Object.entries(outlines)) {
    const copy = structuredClone(m);
    for (const [asset, a] of Object.entries(copy.pigments)) {
      const key = asset.split('/').at(-1).slice(0, 1).toUpperCase() + 'L';
      assert(accents.data.observations.some((o) => o.key === key));
      a.accents = [
        {
          mask: accents.data.observations.find((o) => o.key === key)?.mask,
          adjustment: accents.data.observations.find((o) => o.key === key)?.fit.adjustment,
        },
      ];
    }
    prepared[name] = copy;
  }
  delete prepared.L;
  const fitted = structuredClone(prepared);
  for (const m of Object.values(fitted))
    for (const a of Object.values(m.pigments)) a.frame = absolute;
  const rows = audit.data.rows.map((r) => {
    const c = r.components.frame;
    return {
      id: r.id,
      name: r.name,
      cohort: r.cohort,
      ...evaluateHsb(
        { rgb: c.renderRgb, tiles: c.renderTiles, spread: c.renderSpread },
        { rgb: c.referenceRgb, spread: c.referenceSpread },
        fit.adjustment,
        math,
      ),
    };
  });
  const summary = {};
  for (const cohort of ['all', 'calibration', 'validation']) {
    const a = rows.filter((r) => cohort === 'all' || r.cohort === cohort);
    summary[cohort] = {
      count: a.length,
      medianBefore: median(a.map((r) => r.before)),
      medianPredicted: median(a.map((r) => r.after)),
      improved: a.filter((r) => r.after < r.before).length,
      worstRegression: Math.max(0, ...a.map((r) => r.after - r.before)),
    };
  }
  const doc = {
    schema: 1,
    status: 'shared-land-brown-candidate-needs-native-verification',
    scope:
      'One common brown HSB on fixed source rails, selected from calibration names; all visibly dark references remain in their original calibration/validation cohorts and report. Existing source paper and accent values are preserved, with independently reviewed dual outline sources. Reserved names are reused development observations. This is a source-material prediction, not a final-card color filter or per-printing fit.',
    source: {
      auditHash: hash(audit.bytes),
      baseDefinitionHash: hash(base.bytes),
      accentFitHash: hash(accents.bytes),
      rendererHash: audit.data.rendererHash,
      toolHash: hash(await readFile(new URL(import.meta.url))),
    },
    model,
    training: train.length,
    reserved: reserved.length,
    fit,
    prior: common,
    absolute,
    summary,
    rows,
  };
  await writeJson(output, doc);
  await writeJson(definitionFile, {
    schema: 1,
    ids: base.data.ids,
    trials: [
      base.data.trials.find((t) => t.id === 'land-material'),
      { id: 'land-prepared', materials: prepared },
      { id: 'land-hsb', materials: fitted },
    ],
    scope:
      'Actual native comparison of shared land brown HSB, with previously measured source accents, paper and semantic dual outline choices preserved. Per-name entries identify shared basic plates and reviewed dual color pairs, not per-printing renderer fits.',
  });
  console.log(JSON.stringify({ absolute, fit, summary }, null, 2));
} finally {
  await server.close();
}
