import assert from 'node:assert/strict';
import { readJson, writeJson, cacheRoot, fixtureRoot, hash } from './common.mjs';
import { readObject } from './cache.mjs';
const samples = await readJson(cacheRoot + '/rollout/old-dual-hsb-samples.json');
const cards = new Map();
for (const set of new Set(samples.rows.map((r) => r.set))) {
  const s = await readJson(cacheRoot + '/rollout/sets/' + set + '.json');
  for (const p of s.pages)
    for (const c of JSON.parse((await readObject(p)).toString()).data) cards.set(c.id, c);
}
const excluded = samples.rows
  .filter((r) => cards.get(r.id)?.nonfoil === false)
  .map((r) => ({
    id: r.id,
    name: r.name,
    set: r.set,
    border: r.border,
    material: r.material,
    group: r.set + '/' + r.group,
    referenceHash: r.referenceHash,
    finishes: cards.get(r.id).finishes,
    reason: 'foil-only-reference',
  }));
const result = await readJson(fixtureRoot + '/old-dual-hsb-results.json');
const frameKeys = [...new Set(excluded.map((r) => r.set + '-' + r.border + '-' + r.material))];
const manaKeys = [
  ...new Set(
    excluded.flatMap((r) => {
      const c = cards.get(r.id);
      return [...(c.mana_cost ?? '').matchAll(/\{([^}]+)\}/g)].map(
        (m) => r.set + '-' + r.border + '-' + (/^\d+$/.test(m[1]) ? 'N' : m[1]),
      );
    }),
  ),
];
await writeJson(fixtureRoot + '/hsb-printing-scope.json', {
  schemaVersion: 1,
  sourceSamplesHash: hash(JSON.stringify(samples)),
  policy:
    'Only references with nonfoil !== false. Foil-only scans are excluded from ordinary printing colors; mixed-availability printings retain the source API default scan.',
  excluded,
  excludedFrameKeys: frameKeys,
  excludedManaKeys: manaKeys,
});
console.log({
  excluded: excluded.length,
  sets: [...new Set(excluded.map((r) => r.set))],
  activeFrames: result.groups
    .filter(
      (g) =>
        g.status === 'trial' &&
        frameKeys.includes(
          g.set +
            '-' +
            g.border +
            '-' +
            g.source.asset.split('/').at(-1).replace('.png', '').toUpperCase(),
        ),
    )
    .map((g) => g.key),
  activeMana: result.mana
    .filter(
      (g) => g.status === 'trial' && manaKeys.includes(g.set + '-' + g.border + '-' + g.symbol),
    )
    .map((g) => g.key),
});
