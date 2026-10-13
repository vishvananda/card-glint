import { readJson, writeJson, fixtureRoot, hash } from './common.mjs';
import { median } from './hsb-color.mjs';
const results = await readJson(`${fixtureRoot}/early-hsb-shared-results.json`);
const sets = results.global.map((global) => {
  const materials = global.byMaterial.map((m) => {
    const g = results.groups.find((g) => g.key === `${global.set}-${m.material}`);
    return {
      material: m.material,
      before: m.before,
      global: m.after,
      perColor: median(g.rows.flatMap((r) => Object.values(r.components).map((c) => c.after))),
      adjustment: g.adjustment,
      runtimeStatus: g.status,
    };
  });
  const average = (k) => materials.reduce((s, m) => s + m[k], 0) / materials.length;
  return {
    set: global.set,
    globalAdjustment: global.adjustment,
    materials,
    averageMaterialMedian: {
      before: average('before'),
      global: average('global'),
      perColor: average('perColor'),
    },
    colorsWorsenedByGlobal: materials.filter((m) => m.global > m.before).map((m) => m.material),
  };
});
await writeJson(`${fixtureRoot}/early-hsb-global-results.json`, {
  schemaVersion: 1,
  resultsHash: hash(JSON.stringify(results)),
  metric:
    '100 × Oklab distance. Per material: median of all reserved frame and paper component errors. Set summary: equally weighted average of six material medians. Per-color column includes proposed fits even when runtime admission rejected them. No land or mana measurements in this comparison. Reused reserved cohort, not a fresh blind test.',
  conclusion:
    'Retain per-color whole-frame profiles. Global adjustments sacrifice individual colors and do not match the per-color fits across any of the four sets.',
  sets,
});
console.log(
  sets.map(({ set, averageMaterialMedian, colorsWorsenedByGlobal }) => ({
    set,
    ...averageMaterialMedian,
    colorsWorsenedByGlobal,
  })),
);
