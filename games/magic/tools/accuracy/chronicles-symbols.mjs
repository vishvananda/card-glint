import assert from 'node:assert/strict';
import { readJson, writeJson, atomicWrite, cacheRoot, fixtureRoot, root } from './common.mjs';
import { readObject } from './cache.mjs';

const sources = {},
  cards = {};
for (const set of ['chr', 'arn', 'atq', 'leg', 'drk']) {
  const source = await readJson(`${cacheRoot}/rollout/sets/${set}.json`);
  sources[set] = { query: source.query, identity: source.sourceIdentity, pages: source.pages };
  cards[set] = [];
  for (const page of source.pages)
    cards[set].push(...JSON.parse((await readObject(page)).toString()).data);
}
const origins = {},
  rows = [];
for (const card of cards.chr) {
  const matches = ['arn', 'atq', 'leg', 'drk'].filter((set) =>
    cards[set].some((original) => original.oracle_id === card.oracle_id),
  );
  assert.equal(matches.length, 1, `Ambiguous original symbol: ${card.name}`);
  origins[card.name] = matches[0];
  rows.push({
    id: card.id,
    oracleId: card.oracle_id,
    name: card.name,
    number: card.collector_number,
    symbol: matches[0],
  });
}
assert.equal(rows.length, 125);
assert.equal(Object.keys(origins).length, 116);
await writeJson(`${fixtureRoot}/chronicles-symbol-identities.json`, {
  schemaVersion: 1,
  scope:
    'All 125 English Chronicles printings, 116 distinct names. Exact Oracle identity matches to the four original expansions; this establishes symbol identity, not shape/placement or all-card scan certification.',
  sources,
  rows,
});
const sorted = Object.fromEntries(Object.entries(origins).sort(([a], [b]) => a.localeCompare(b)));
await atomicWrite(
  `${root}/games/magic/src/presentation/chronicles-symbols.ts`,
  `/** Chronicles retains each card's original expansion symbol. Generated from\n * exact Scryfall printing identities; see fixtures/accuracy/chronicles-symbol-identities.json.\n * Caller-supplied setSymbol still overrides this English printing-name lookup. */\nconst origins: Readonly<Record<string, string>> = ${JSON.stringify(sorted, null, 2)};\n\nexport function chroniclesSymbol(name: string): string | null {\n  return Object.hasOwn(origins, name) ? origins[name]! : null;\n}\n`,
);
console.log(
  `Resolved ${rows.length} Chronicles printings to ${Object.keys(origins).length} names.`,
);
