// Three flavor paragraph edits; no painter, Oracle or unrelated table change.
import assert from 'node:assert/strict';
import { hash } from './common.mjs';
import { eighthPayloadData, eighthAggregateData } from './eighth-profile-data.mjs';
const base = 'games/magic/';
export const flavorDataFiles = [
  ...['lea', 'leb', '2ed'].map(
    (s) => base + 'fixtures/accuracy/' + s + '/annotations-empty-rules.json',
  ),
  base + 'fixtures/accuracy/printing-review-catalog.json',
  ...['lea', 'leb', '2ed'].map((s) => base + 'src/data/wording/' + s + '.ts'),
  base + 'src/data/eager-wording.ts',
  base + 'src/data/review-metadata.ts',
  base + 'src/data/generated-manifest.json',
];
const effective = (rows) => Object.assign({}, ...rows.map((r) => r.fields));
export function validatePrintingFlavorDelta(p, after, review) {
  assert.equal(p.schema, 1);
  assert.equal(review.cards.length, 3);
  assert.deepEqual(review.cards.map((r) => r.set).sort(), ['2ed', 'lea', 'leb']);
  assert.deepEqual(Object.keys(p.files).sort(), [...flavorDataFiles].sort());
  const before = {};
  for (const [file, e] of Object.entries(p.files)) {
    assert.equal(hash(e.beforeSource), e.before, 'Changed historical data snapshot');
    assert.equal(hash(after[file]), e.after, 'Unreviewed printing flavor data: ' + file);
    before[file] = e.beforeSource;
  }
  const catalogPath = base + 'fixtures/accuracy/printing-review-catalog.json';
  const oldCatalog = JSON.parse(before[catalogPath]),
    catalog = JSON.parse(after[catalogPath]);
  assert.deepEqual(catalog.artists, oldCatalog.artists);
  assert.equal(catalog.artistRevision, oldCatalog.artistRevision);
  assert.deepEqual(catalog.sets, oldCatalog.sets);
  assert.deepEqual(Object.keys(catalog.wording).sort(), Object.keys(oldCatalog.wording).sort());
  for (const row of review.cards) {
    assert.equal(row.name, 'Pearled Unicorn');
    assert.equal(row.proposed.replace('\n', ' '), row.before);
    assert(row.proposed.includes('\n—Lewis Carroll'));
    const f = base + 'fixtures/accuracy/' + row.set + '/annotations-empty-rules.json';
    const oldFixture = JSON.parse(before[f]),
      fixture = JSON.parse(after[f]),
      edited = fixture.cards[row.id];
    assert.equal(edited.name, row.name);
    assert.equal(edited.referenceHash, row.referenceHash);
    assert.equal(edited.flavorText, row.proposed);
    if (oldFixture.cards[row.id]) {
      assert.equal(oldFixture.cards[row.id].flavorText, row.before);
      fixture.cards[row.id] = oldFixture.cards[row.id];
    } else {
      assert.deepEqual(edited.reviewedFields, ['flavorText']);
      assert.equal(edited.reviewed, undefined);
      delete fixture.cards[row.id];
    }
    assert.deepEqual(fixture, oldFixture, 'Unrelated annotation changed');
    const old = effective(oldCatalog.wording[row.id]),
      next = effective(catalog.wording[row.id]);
    // Unlimited did not previously have a catalog flavor override.
    assert(old.flavorText === undefined || old.flavorText === row.before);
    assert.equal(next.flavorText, row.proposed);
    delete old.flavorText;
    delete next.flavorText;
    assert.deepEqual(next, old, 'Unrelated printing field changed');
    assert(catalog.wording[row.id].every((r) => r.referenceSha256 === row.referenceHash));
  }
  const restoredCatalog = structuredClone(catalog);
  for (const row of review.cards) restoredCatalog.wording[row.id] = oldCatalog.wording[row.id];
  assert.equal(catalog.revision, hash(JSON.stringify(catalog.wording)));
  restoredCatalog.revision = oldCatalog.revision;
  assert.deepEqual(restoredCatalog, oldCatalog, 'Unrelated review or provenance changed');
  const restorePayload = (current, previous) => {
    current = structuredClone(current);
    for (const row of review.cards.filter((r) => r.set === current.set)) {
      const next = current.tables.printingCorrections[row.id];
      assert.equal(effective(next).flavorText, row.proposed);
      assert(next.every((r) => r.referenceSha256 === row.referenceHash));
      current.tables.printingCorrections[row.id] = previous.tables.printingCorrections[row.id];
    }
    return current;
  };
  for (const set of ['lea', 'leb', '2ed']) {
    const file = base + 'src/data/wording/' + set + '.ts';
    const old = eighthPayloadData(before[file], file),
      next = eighthPayloadData(after[file], file);
    assert.equal(next.set, set);
    assert.equal(next.kind, 'wording');
    assert.deepEqual(restorePayload(next, old), old, 'Unrelated lazy printing data changed');
  }
  const aggregate = base + 'src/data/eager-wording.ts';
  const oldEager = eighthAggregateData(before[aggregate]),
    newEager = eighthAggregateData(after[aggregate]);
  assert.deepEqual(
    newEager.map((d) => {
      const old = oldEager.find((o) => o.set === d.set && o.kind === d.kind);
      assert(old);
      return review.cards.some((r) => r.set === d.set) ? restorePayload(d, old) : d;
    }),
    oldEager,
    'Unrelated eager printing data changed',
  );
  const metadata = base + 'src/data/review-metadata.ts';
  assert.equal(
    after[metadata].replace(catalog.revision, oldCatalog.revision),
    before[metadata],
    'Only the wording revision may change',
  );
  const manifest = base + 'src/data/generated-manifest.json';
  const oldManifest = JSON.parse(before[manifest]),
    newManifest = JSON.parse(after[manifest]);
  assert.deepEqual(Object.keys(newManifest), Object.keys(oldManifest));
  for (const kind of ['files', 'sources']) {
    assert.deepEqual(Object.keys(newManifest[kind]), Object.keys(oldManifest[kind]));
    for (const [file, value] of Object.entries(newManifest[kind])) {
      if (value === oldManifest[kind][file]) continue;
      assert(p.files[file], 'Unexpected generated dependency change: ' + file);
      assert.equal(value, p.files[file].after);
      assert.equal(oldManifest[kind][file], p.files[file].before);
      newManifest[kind][file] = oldManifest[kind][file];
    }
  }
  assert.deepEqual(newManifest, oldManifest, 'Unrelated manifest field changed');
  return {
    wordingPrintings: Object.keys(catalog.wording).length,
    changedFlavorPrintings: 3,
    unchangedArtists: Object.keys(catalog.artists).length,
    changedSets: ['lea', 'leb', '2ed'],
  };
}
