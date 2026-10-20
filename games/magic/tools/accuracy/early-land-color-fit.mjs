// Development fits for the five basic land plates; no independent-name claim.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir } from 'node:fs/promises';
import { createServer } from 'vite';
import { root, hash, writeJson } from './common.mjs';
import { fitHsb, evaluateHsb, center, median } from './hsb-color.mjs';

const [auditDirectory, geometryDirectory, outputDirectory] = process.argv.slice(2);
assert(
  outputDirectory,
  'Usage: early-land-color-fit.mjs AUDIT_DIRECTORY BASIC_GEOMETRY_DIRECTORY OUTPUT_DIRECTORY',
);
const keys = ['WL', 'UL', 'BL', 'RL', 'GL'];
const names = ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest'];
const audits = await Promise.all(
  keys.map(async (key, i) => {
    const bytes = await readFile(path.join(auditDirectory, key + '-audit.json'));
    const audit = JSON.parse(bytes);
    assert.equal(audit.rows.length, 3);
    assert.equal(audit.trialName, 'shared-search');
    assert(audit.rows.every((r) => r.accepted && r.material === 'L' && r.name === names[i]));
    assert.equal(Object.keys(audit.groups).length, 1);
    return { key, bytes, audit };
  }),
);
for (const { audit } of audits) {
  assert.equal(audit.rendererHash, audits[0].audit.rendererHash);
  assert.equal(audit.nativeCaptureHash, audits[0].audit.nativeCaptureHash);
  assert.equal(audit.nativeInputsHash, audits[0].audit.nativeInputsHash);
}
const model = {
  neutralSaturation: 0.06,
  hueDegrees: [-35, 35],
  saturationScale: [0.4, 1.4],
  brightnessScale: [0.7, 1.4],
};
const sampled = (tiles) => {
  assert(tiles.length >= 3);
  return tiles.length <= 64
    ? tiles
    : Array.from({ length: 64 }, (_, i) => tiles[Math.floor(((i + 0.5) * tiles.length) / 64)]);
};
const sourceOf = (rows, component) => ({
  rgb: center(rows.map((r) => r.components[component].renderRgb)),
  tiles: rows.flatMap((r) => sampled(r.components[component].renderTiles)),
});
const score = (rows, component, adjustment, math) =>
  rows.map((r) => {
    const c = r.components[component];
    return {
      id: r.id,
      name: r.name,
      ...evaluateHsb(
        { rgb: c.renderRgb, tiles: c.renderTiles, spread: c.renderSpread },
        { rgb: c.referenceRgb, spread: c.referenceSpread },
        adjustment,
        math,
      ),
    };
  });
const summary = (rows) => ({
  count: rows.length,
  medianBefore: median(rows.map((r) => r.before)),
  medianAfter: median(rows.map((r) => r.after)),
  improved: rows.filter((r) => r.after < r.before).length,
  worstRegression: Math.max(...rows.map((r) => r.after - r.before)),
  maximumClipping: Math.max(...rows.map((r) => r.clipping)),
});
const server = await createServer({
  root,
  configFile: false,
  optimizeDeps: { noDiscovery: true, entries: [] },
  server: { middlewareMode: true, hmr: false },
});
try {
  await mkdir(outputDirectory, { recursive: true });
  const math = await server.ssrLoadModule('/games/magic/src/presentation/hsb.ts');
  const all = audits.flatMap((x) => x.audit.rows);
  const frameFit = fitHsb(
    sourceOf(all, 'frame'),
    all.map((r) => ({ rgb: r.components.frame.referenceRgb })),
    model,
    math,
  );
  const materials = {},
    observations = [];
  for (const { key, audit, bytes } of audits) {
    const rows = audit.rows;
    const paperFit = fitHsb(
      sourceOf(rows, 'paper'),
      rows.map((r) => ({ rgb: r.components.paper.referenceRgb })),
      model,
      math,
    );
    const geometryBytes = await readFile(path.join(geometryDirectory, key + '-definition.json'));
    const geometry = JSON.parse(geometryBytes);
    const before = geometry.trials[0].materials.L;
    assert.equal(geometry.trials[0].id, 'shared-search');
    assert.deepEqual([...geometry.ids].sort(), rows.map((r) => r.id).sort());
    // Straight source paper interior, inside its printed keyline. Gray bevels
    // and disconnected art/outer accent lines remain outside this selection.
    const adjustment = {
      frame: frameFit.adjustment,
      paper: paperFit.adjustment,
      mask: {
        kind: 'rect',
        rect: [206 / 1500, 1280 / 2100, 1094 / 1500, 568 / 2100],
        feather: 2 / 1500,
      },
    };
    const pigment = { asset: before.asset, adjustment };
    const trials = [
      { id: 'shared-search', materials: { L: before } },
      { id: 'land-color', materials: { L: { ...before, pigment } } },
    ];
    const definition = { schema: 1, pigment: true, ids: geometry.ids, trials };
    await writeJson(path.join(outputDirectory, key + '-definition.json'), definition);
    const diagnostics = Object.fromEntries(
      ['frame', 'paper'].map((component) => {
        const values = score(
          rows,
          component,
          component === 'frame' ? frameFit.adjustment : paperFit.adjustment,
          math,
        );
        return [component, { ...summary(values), rows: values }];
      }),
    );
    materials[key] = { asset: before.asset, adjustment };
    observations.push({
      key,
      auditHash: hash(bytes),
      geometryDefinitionHash: hash(geometryBytes),
      paperFit,
      diagnostics,
    });
    console.log(
      key,
      JSON.stringify(
        Object.fromEntries(
          Object.entries(diagnostics).map(([k, v]) => [
            k,
            { before: v.medianBefore, after: v.medianAfter, improved: v.improved },
          ]),
        ),
      ),
    );
  }
  await writeJson(path.join(outputDirectory, 'fit.json'), {
    schema: 1,
    set: '2ed',
    status: 'development-land-color-candidates-needs-native-verification',
    scope:
      'All fifteen basic land references, three illustrations per name. One shared brown-frame HSB fit across fifteen scans; separate paper fit per five source plates. All samples use fixed independently normalized original scans and verified native geometry. These are development observations, not independent-name validation. No per-card fit, final-image filter, black-level or contrast certification. Colored rim accents and derived dual-land pinline colors remain separately open.',
    rendererHash: audits[0].audit.rendererHash,
    nativeCaptureHash: audits[0].audit.nativeCaptureHash,
    nativeInputsHash: audits[0].audit.nativeInputsHash,
    toolHash: hash(await readFile(new URL(import.meta.url))),
    dependencies: await Promise.all(
      ['hsb-color.mjs', '../../src/presentation/hsb.ts'].map(async (f) => [
        f,
        hash(await readFile(new URL(f, import.meta.url))),
      ]),
    ),
    model,
    frameFit,
    materials,
    observations,
  });
} finally {
  await server.close();
}
