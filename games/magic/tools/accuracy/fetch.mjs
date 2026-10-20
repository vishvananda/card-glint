import path from 'node:path';
import {
  cacheRoot,
  fixtureRoot,
  mapLimit,
  options,
  writeJson,
  hash,
  referenceIdentity,
} from './common.mjs';
import { PNG } from 'pngjs';
import { cachedFetch, readObject } from './cache.mjs';
import { category, corpusPolicy, exclusion, qualityIssue } from './corpus.mjs';
import { fetchComponents } from './components.mjs';

const opts = options();
const query = `set:${opts.set} lang:en game:paper`;
let url =
  'https://api.scryfall.com/cards/search?' +
  new URLSearchParams({ q: query, unique: 'prints', order: 'set', include_variations: 'true' });
const cards = [],
  pages = [];
while (url) {
  const asset = await cachedFetch(url, opts);
  const page = JSON.parse((await readObject(asset)).toString('utf8'));
  if (!Array.isArray(page.data)) throw Error('Invalid Scryfall search response');
  pages.push(asset);
  cards.push(...page.data);
  url = page.has_more ? page.next_page : null;
  if (page.has_more && !url) throw Error('Missing next_page');
}
const excluded = cards.filter(exclusion).map((c) => ({
  id: c.id,
  name: c.name,
  collectorNumber: c.collector_number,
  reason: exclusion(c),
}));
const eligible = cards.filter((c) => !exclusion(c));
const selected = opts.limit ? eligible.slice(0, opts.limit) : eligible;
console.log(
  `${opts.set}: ${cards.length} printings, ${eligible.length} ordinary, ${excluded.length} excluded treatments; fetching ${selected.length}`,
);
const entries = await mapLimit(selected, 2, async (card, index) => {
  const issue = qualityIssue(card);
  const entry = { id: card.id, card, category: category(card), issue };
  if (!issue) {
    entry.reference = await cachedFetch(card.image_uris.png, opts);
    entry.art = await cachedFetch(card.image_uris.art_crop, opts);
    const decoded = PNG.sync.read(await readObject(entry.reference), { checkCRC: true });
    if (decoded.width < 700 || decoded.height < 1000)
      throw Error(`Undersize reference for ${card.name}`);
    entry.referenceDimensions = [decoded.width, decoded.height];
  }
  if ((index + 1) % 20 === 0 || index === selected.length - 1)
    console.log(`Cached ${index + 1}/${selected.length}`);
  return entry;
});
const snapshot = {
  schemaVersion: 1,
  policy: corpusPolicy(cards),
  set: opts.set,
  query,
  includeVariations: true,
  createdAt: new Date().toISOString(),
  totalPrintings: cards.length,
  eligibleCount: eligible.length,
  complete: entries.length === eligible.length,
  excluded,
  pages,
  entries,
};
snapshot.components = await fetchComponents(entries, opts);
snapshot.identity = hash(
  JSON.stringify({
    pages: pages.map((p) => p.sha256),
    ids: entries.map((e) => e.id),
    policy: snapshot.policy,
  }),
);
snapshot.referenceIdentity = referenceIdentity(entries);
// Publish only after all downloads succeed. Objects remain immutable across refreshes.
await writeJson(
  path.join(cacheRoot, 'sets', `${opts.set}${opts.limit ? '-sample' : ''}.json`),
  snapshot,
);
if (!opts.limit)
  await writeJson(path.join(fixtureRoot, opts.set, 'corpus.json'), {
    schemaVersion: 1,
    set: opts.set,
    identity: snapshot.identity,
    referenceIdentity: snapshot.referenceIdentity,
    query,
    policy: snapshot.policy,
    totalPrintings: cards.length,
    eligibleCount: eligible.length,
    excluded,
    entries: entries.map((e) => ({
      id: e.id,
      name: e.card.name,
      collectorNumber: e.card.collector_number,
      category: e.category,
      issue: e.issue,
      source: e.card.scryfall_uri,
      referenceHash: e.reference?.sha256,
      artHash: e.art?.sha256,
    })),
  });
console.log(
  `Snapshot ${snapshot.identity}; ${entries.filter((e) => e.issue).length} unavailable references/layouts`,
);
