// Shared HSB fits retain the source texture distribution instead of one RGB median.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { root, hash, writeJson } from './common.mjs';
import { fitHsb, evaluateHsb, center, median } from './hsb-color.mjs';
const [inputFile, output] = process.argv.slice(2);
assert(output, 'Usage: early-native-color-fit.mjs NATIVE_COLOR_AUDIT OUTPUT');
const raw = await readFile(inputFile),
  data = JSON.parse(raw),
  server = await createServer({
    root,
    configFile: false,
    server: { middlewareMode: true, hmr: false },
  }),
  groups = [];
const sampled = (tiles, maximum = 64) => {
  assert(tiles.length >= 3, 'Missing actual source texture samples');
  return tiles.length <= maximum
    ? tiles
    : Array.from(
        { length: maximum },
        (_, i) => tiles[Math.floor(((i + 0.5) * tiles.length) / maximum)],
      );
};
try {
  const math = await server.ssrLoadModule('/games/magic/src/presentation/hsb.ts');
  for (const group of Object.keys(data.groups)) {
    const rows = data.rows.filter((r) => r.group === group && r.accepted),
      train = rows.filter((r) => r.cohort === 'calibration'),
      validation = rows.filter((r) => r.cohort === 'validation');
    for (const component of ['frame', 'paper']) {
      assert(
        train.length >= 3 && validation.length >= 3,
        'Sparse families require their own review',
      );
      const source = {
          rgb: center(train.map((r) => r.components[component].renderRgb)),
          tiles: train.flatMap((r) => sampled(r.components[component].renderTiles)),
        },
        model = {
          neutralSaturation: 0.06,
          hueDegrees: [-35, 35],
          saturationScale: [0.4, 1.4],
          brightnessScale: [0.7, 1.4],
        },
        fit = fitHsb(
          source,
          train.map((r) => ({ rgb: r.components[component].referenceRgb })),
          model,
          math,
        ),
        scores = validation.map((r) => {
          const c = r.components[component],
            v = evaluateHsb(
              { rgb: c.renderRgb, tiles: c.renderTiles, spread: c.renderSpread },
              { rgb: c.referenceRgb, spread: c.referenceSpread },
              fit.adjustment,
              math,
            );
          return { id: r.id, name: r.name, before: v.before, after: v.after, clipping: v.clipping };
        }),
        before = median(scores.map((r) => r.before)),
        after = median(scores.map((r) => r.after)),
        worstRegression = Math.max(...scores.map((r) => r.after - r.before)),
        maximumClipping = Math.max(...scores.map((r) => r.clipping));
      groups.push({
        group,
        component,
        training: train.length,
        validation: validation.length,
        sourceSamples: source.tiles.length,
        adjustment: fit.adjustment,
        flags: fit.flags,
        targetRgb: fit.target,
        fitError: fit.fitError,
        before,
        after,
        worstRegression,
        maximumClipping,
        status:
          after < before - 0.25
            ? worstRegression > 2
              ? 'candidate-with-outliers'
              : 'candidate'
            : 'retain-current',
        scores,
      });
      console.log(
        group,
        component,
        before.toFixed(3),
        after.toFixed(3),
        JSON.stringify(fit.adjustment),
      );
    }
  }
  await writeJson(output, {
    schema: 1,
    set: data.set,
    method: 'shared-source-texture-hsb-v1',
    scope:
      'Fit only predeclared calibration cohorts using at most 64 actual texture tiles per printing. Source/paper medians remain separate; no per-card color adjustment. Predictions retain the full validation source-tile distribution and clipping diagnostics. Native cached-material replay is still required before promotion. No contrast/gamma or black-level certification is implied.',
    auditHash: hash(raw),
    rendererHash: data.rendererHash,
    toolHash: hash(await readFile(new URL(import.meta.url))),
    dependencies: await Promise.all(
      ['hsb-color.mjs', '../..//src/presentation/hsb.ts'].map(async (name) => [
        name,
        hash(await readFile(new URL(name, import.meta.url))),
      ]),
    ),
    model: { hueDegrees: [-35, 35], saturationScale: [0.4, 1.4], brightnessScale: [0.7, 1.4] },
    groups,
  });
} finally {
  await server.close();
}
