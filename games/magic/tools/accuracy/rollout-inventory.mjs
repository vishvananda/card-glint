import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { cachedFetch, readObject } from './cache.mjs';
import { cacheRoot, fixtureRoot, hash, mapLimit, readJson, writeJson } from './common.mjs';
import { ROLLOUT_POLICY, MAJOR_SET_MINIMUM, summarizeSet } from './rollout-policy.mjs';
const [action = 'report', ...codes] = process.argv.slice(2);
assert.ok(['fetch', 'report'].includes(action));
assert.ok(codes.every((c) => /^[a-z0-9]{2,10}$/.test(c)));
const policyHash = hash(await readFile(new URL('./rollout-policy.mjs', import.meta.url))),
  asOf = '2026-10-12';
let catalog;
if (action === 'fetch') {
  const source = await cachedFetch('https://api.scryfall.com/sets'),
    page = JSON.parse((await readObject(source)).toString());
  assert.ok(Array.isArray(page.data) && !page.has_more);
  catalog = { source, sets: page.data };
  await writeJson(`${cacheRoot}/rollout-set-list.json`, catalog);
} else catalog = await readJson(`${cacheRoot}/rollout-set-list.json`);
function preliminary(set) {
  if (set.digital) return 'digital-set';
  if (set.released_at > asOf) return 'not-released';
  if (set.card_count < MAJOR_SET_MINIMUM) return 'fewer-than-50-total-printings';
  if (['token', 'art_series', 'minigame'].includes(set.set_type)) return 'non-card-product';
  return null;
}
const candidates = catalog.sets
  .filter((s) => !preliminary(s) && (!codes.length || codes.includes(s.code)))
  .sort((a, b) => a.released_at.localeCompare(b.released_at) || a.code.localeCompare(b.code));
if (action === 'fetch') {
  let completed = 0;
  await mapLimit(candidates, 2, async (set) => {
    const file = `${cacheRoot}/rollout/sets/${set.code}.json`,
      query = `set:${set.code} lang:en game:paper`,
      pages = [],
      cards = [];
    let url =
        'https://api.scryfall.com/cards/search?' +
        new URLSearchParams({
          q: query,
          unique: 'prints',
          order: 'set',
          include_variations: 'true',
        }),
      noResults = null;
    const initialUrl = url;
    while (url) {
      let asset;
      try {
        asset = await cachedFetch(url);
      } catch (error) {
        if (!pages.length && String(error.message).startsWith('Asset HTTP 404:')) {
          noResults = { url, status: 404, observedAt: new Date().toISOString() };
          break;
        }
        throw error;
      }
      const page = JSON.parse((await readObject(asset)).toString());
      assert.ok(Array.isArray(page.data));
      pages.push(asset);
      cards.push(...page.data);
      url = page.has_more ? page.next_page : null;
      if (page.has_more) assert.ok(url);
    }
    assert.equal(
      new Set(cards.map((c) => c.id)).size,
      cards.length,
      'Duplicate printing in inventory',
    );
    const summary = summarizeSet(cards),
      sourceIdentity = hash(JSON.stringify({ pages: pages.map((p) => p.sha256), noResults }));
    await writeJson(file, {
      schemaVersion: 1,
      set: set.code,
      query: initialUrl,
      policy: ROLLOUT_POLICY,
      policyHash,
      sourceIdentity,
      pages,
      noResults,
      summary,
      printingIds: cards.map((c) => c.id),
    });
    completed++;
    console.log(
      `${completed}/${candidates.length} ${set.code}: ${summary.admission}, ${summary.distinctOrdinary} distinct / ${summary.ordinaryPrintings} ordinary, ${summary.classificationReview} review`,
    );
  });
}
const rows = [];
for (const set of catalog.sets) {
  const row = {
    set: set.code,
    name: set.name,
    releasedAt: set.released_at,
    setType: set.set_type,
    metadataCardCount: set.card_count,
    status: preliminary(set),
    source: set.search_uri,
  };
  if (!row.status) {
    try {
      const snapshot = await readJson(`${cacheRoot}/rollout/sets/${set.code}.json`);
      assert.equal(snapshot.policyHash, policyHash, `Stale policy: ${set.code}`);
      Object.assign(row, {
        status: snapshot.summary.admission,
        source: snapshot.query,
        sourceIdentity: snapshot.sourceIdentity,
        ...snapshot.summary,
      });
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      row.status = 'inventory-pending';
    }
  }
  rows.push(row);
}
rows.sort((a, b) => a.releasedAt.localeCompare(b.releasedAt) || a.set.localeCompare(b.set));
const major = rows.filter((r) => r.status === 'major'),
  summary = {
    catalogSets: rows.length,
    inventoried: rows.filter((r) => r.sourceIdentity).length,
    pending: rows.filter((r) => r.status === 'inventory-pending').length,
    majorSets: major.length,
    ordinaryPrintings: major.reduce((n, r) => n + r.ordinaryPrintings, 0),
    classificationReviewPrintings: major.reduce((n, r) => n + r.classificationReview, 0),
    old: major.filter((r) => r.groups.some((g) => g.wave === 'old')).map((r) => r.set),
    new: major.filter((r) => r.groups.some((g) => g.wave === 'new')).map((r) => r.set),
    statuses: Object.fromEntries(
      [...new Set(rows.map((r) => r.status))]
        .sort()
        .map((status) => [status, rows.filter((r) => r.status === status).length]),
    ),
  };
await writeJson(`${fixtureRoot}/rollout-inventory.json`, {
  schemaVersion: 1,
  asOf,
  policy: ROLLOUT_POLICY,
  policyHash,
  source: catalog.source,
  minimumDistinctOrdinary: MAJOR_SET_MINIMUM,
  scope:
    'Inventory only. Includes printing variations explicitly. Reference readiness is metadata quality, not proof of downloaded bytes. Frame/layout evaluator eligibility is separate from ordinary-card admission. All passes start unverified; earlier captures may be reused after provenance checks.',
  complete: summary.pending === 0,
  summary,
  sets: rows,
});
console.log(JSON.stringify(summary));
