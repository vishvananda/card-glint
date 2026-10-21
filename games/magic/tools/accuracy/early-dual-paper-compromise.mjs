// Compare shared paper fits with an explicit penalty for individual regressions.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { root, hash, writeJson } from './common.mjs';
import { center, delta, median, evaluateHsb } from './hsb-color.mjs';
const [fitFile, output] = process.argv.slice(2);
assert(output, 'Usage: early-dual-paper-compromise.mjs FIT OUTPUT');
const bytes = await readFile(fitFile),
  data = JSON.parse(bytes);
assert.equal(data.rows.length, 20);
const server = await createServer({
  root,
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const math = await server.ssrLoadModule('/games/magic/src/presentation/hsb.ts');
  const policies = [0, 0.5, 1, 2],
    candidates = [];
  for (const penalty of policies) {
    const groups = [];
    for (const color of 'WUBRG') {
      const rows = data.rows.filter((r) => r.color === color);
      assert.equal(rows.length, 4);
      const old = data.groups.find((g) => g.color === color),
        identity = { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 };
      const parts = rows.map((r) => ({
        ...r,
        before: delta(r.source.rgb, r.reference.rgb),
        tiles: r.source.tiles.filter(
          (_, i, a) => i === Math.floor(((Math.floor((i * 32) / a.length) + 0.5) * a.length) / 32),
        ),
      }));
      for (const p of parts) if (p.tiles.length < 3) p.tiles = p.source.tiles;
      const cache = new Map();
      const evaluate = (values) => {
        const key = JSON.stringify(values);
        if (cache.has(key)) return cache.get(key);
        const scores = parts.map((r) => {
          const rgb = center(r.tiles.map((t) => math.adjustHsb(t, values)));
          return { before: r.before, after: delta(rgb, r.reference.rgb) };
        });
        const mean = scores.reduce((s, r) => s + r.after, 0) / 4,
          worst = Math.max(0, ...scores.map((r) => r.after - r.before));
        const v = { values, mean, worst, loss: mean + penalty * worst };
        cache.set(key, v);
        return v;
      };
      let best;
      for (const start of [identity, old.fit.adjustment]) {
        let here = evaluate(start);
        for (const step of [4, 1, 0.25])
          for (let pass = 0; pass < 20; pass++) {
            let changed = false;
            for (const [key, scale] of [
              ['hueDegrees', 1],
              ['saturationScale', 0.02],
              ['brightnessScale', 0.005],
            ]) {
              if (key === 'hueDegrees' && old.fit.flags.includes('neutral-hue-locked')) continue;
              for (const sign of [-1, 1]) {
                const limits = data.model[key],
                  next = {
                    ...here.values,
                    [key]: Math.max(
                      limits[0],
                      Math.min(limits[1], here.values[key] + sign * step * scale),
                    ),
                  };
                const v = evaluate(next);
                if (v.loss < here.loss - 1e-8) {
                  here = v;
                  changed = true;
                }
              }
            }
            if (!changed) break;
          }
        if (!best || here.loss < best.loss) best = here;
      }
      const scores = rows.map((r) => ({
        id: r.id,
        name: r.name,
        ...evaluateHsb(r.source, r.reference, best.values, math),
      }));
      const summary = {
        color,
        count: 4,
        beforeMedian: median(scores.map((r) => r.before)),
        afterMedian: median(scores.map((r) => r.after)),
        beforeMean: scores.reduce((s, r) => s + r.before, 0) / 4,
        afterMean: scores.reduce((s, r) => s + r.after, 0) / 4,
        improved: scores.filter((r) => r.after < r.before).length,
        worstRegression: Math.max(0, ...scores.map((r) => r.after - r.before)),
        maximumClipping: Math.max(...scores.map((r) => r.clipping)),
      };
      groups.push({
        ...summary,
        fit: {
          adjustment: best.values,
          flags: old.fit.flags,
          searchEvaluations: cache.size,
          objective: best.loss,
        },
        scores,
      });
    }
    candidates.push({ penalty, groups });
    console.log(
      JSON.stringify({
        penalty,
        groups: groups.map(({ color, beforeMean, afterMean, worstRegression, improved }) => ({
          color,
          beforeMean,
          afterMean,
          worstRegression,
          improved,
        })),
      }),
    );
  }
  const selected = candidates.find((c) => c.penalty === 1);
  assert(selected.groups.every((g) => g.afterMean < g.beforeMean && g.maximumClipping === 0));
  await writeJson(output, {
    ...data,
    status: 'shared-dual-paper-compromise-needs-native-replay',
    scope:
      'A single mean-error plus worst-regression objective is applied to all five shared paper colors. Every one of the four dual references per color remains in the objective and report; no per-card parameters or scan correction are introduced. Four penalty values expose the tradeoff, with penalty 1 selected globally. This reuses development references, not held-out validation; full native replay and other land materials remain open.',
    parentFitHash: hash(bytes),
    toolHash: hash(await readFile(new URL(import.meta.url))),
    dependencies: await Promise.all(
      ['hsb-color.mjs', '../../src/presentation/hsb.ts'].map(async (f) => [
        f,
        hash(await readFile(new URL(f, import.meta.url))),
      ]),
    ),
    policy: {
      objective: 'mean Oklab distance + penalty * largest positive per-observation regression',
      selectedPenalty: 1,
      penalties: policies,
      starts: ['identity', 'prior median fit'],
      maximumSearchTilesPerObservation: 32,
    },
    candidates,
    groups: selected.groups,
  });
} finally {
  await server.close();
}
