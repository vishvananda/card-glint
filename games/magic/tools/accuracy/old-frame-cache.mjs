import { readJson, writeJson, fixtureRoot, cacheRoot, mapLimit, hash } from './common.mjs';
import { cachedFetch } from './cache.mjs';
const plan = await readJson(`${fixtureRoot}/old-frame-family-plan.json`);
const rows = plan.sets.flatMap((s) =>
  s.groups.flatMap((g) =>
    g.samples.map((c) => ({
      ...c,
      set: s.set,
      group: g.key,
      material: g.material,
      border: g.border,
      frame: g.frame,
    })),
  ),
);
let n = 0;
const entries = await mapLimit(rows, 3, async (row) => {
  try {
    const reference = await cachedFetch(row.referenceUrl);
    return { ...row, reference };
  } catch (error) {
    return { ...row, issue: String(error.message) };
  } finally {
    if (++n % 50 === 0) console.log('cached', n, '/', rows.length);
  }
});
await writeJson(`${cacheRoot}/rollout/old-frame-families.json`, {
  schemaVersion: 1,
  planHash: hash(JSON.stringify(plan)),
  entries,
});
console.log(
  'Finished',
  entries.length,
  'references;',
  entries.filter((e) => e.issue).length,
  'failures.',
);
