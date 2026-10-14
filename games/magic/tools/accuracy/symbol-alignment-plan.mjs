import { createServer } from 'vite';
import { readObject } from './cache.mjs';
import { cacheRoot, readJson, writeJson, hash, root } from './common.mjs';
import { presentation } from './adapter.mjs';

// Freeze the original fitting names. The larger cached frame-study cohort is
// reserved for this alignment experiment; no additional name trains the fit.
const base = await readJson(`${cacheRoot}/rollout/major-calibration-plan.json`);
const sources = await readJson(`${cacheRoot}/rollout/old-frame-families.json`);
const sets = ['7ed', 'usg', 'ulg', 'uds'];
const server = await createServer({
  configFile: false,
  root,
  server: { middlewareMode: true, hmr: false },
});
const rows = [];
try {
  const { retroSetSymbol } = await server.ssrLoadModule(
    '/games/magic/src/presentation/retro-frame.ts',
  );
  for (const set of sets) {
    const snapshot = await readJson(`${cacheRoot}/rollout/sets/${set}.json`);
    const cards = (
      await Promise.all(
        snapshot.pages.map(async (p) => JSON.parse((await readObject(p)).toString()).data),
      )
    ).flat();
    const group = base.rows.find(
      (r) =>
        r.set === set && r.family === 'retro' && r.border === (set === '7ed' ? 'white' : 'black'),
    );
    const cachedIds = new Set(
      sources.entries.filter((e) => e.set === set && !e.issue).map((e) => e.id),
    );
    const samples = [...group.samples];
    const seen = new Set(samples.map((s) => s.card.name));
    for (const card of cards
      .filter((c) => cachedIds.has(c.id))
      .sort((a, b) => a.id.localeCompare(b.id))) {
      if (
        seen.has(card.name) ||
        card.nonfoil === false ||
        card.border_color !== group.border ||
        card.layout !== 'normal'
      )
        continue;
      seen.add(card.name);
      const face = presentation({ card }).face;
      samples.push({
        card,
        face,
        symbol: retroSetSymbol(face),
        cohort: 'validation',
        material: /Artifact/.test(card.type_line)
          ? 'A'
          : /Land/.test(card.type_line)
            ? 'L'
            : card.colors?.join('') || 'C',
      });
    }
    rows.push({ ...group, samples });
  }
} finally {
  await server.close();
}
const report = {
  schemaVersion: 1,
  basePlanHash: hash(JSON.stringify(base)),
  sourceCohortHash: hash(JSON.stringify(sources)),
  policy: 'old-symbol-alignment-v0213',
  scope:
    'Four ordinary nonfoil old-frame cohorts. Original six fitting names per set stay fixed; additional cached frame-study names are reserved. Seventh Edition uses white nonfoil stock only. This is sampled validation, not all-card coverage.',
  summary: {
    sets: rows.length,
    groups: rows.length,
    samples: rows.reduce((n, r) => n + r.samples.length, 0),
  },
  rows,
};
await writeJson(`${cacheRoot}/rollout/old-symbol-alignment-plan.json`, report);
console.log(report.summary);
for (const r of rows)
  console.log(
    r.key,
    r.samples.length,
    r.samples.filter((s) => s.cohort === 'calibration').length,
    'fitting',
  );
