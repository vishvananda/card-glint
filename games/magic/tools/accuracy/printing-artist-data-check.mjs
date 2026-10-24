// Validate a one-printing, data-only artist correction before restoring history.
import assert from 'node:assert/strict';
import { hash } from './common.mjs';
import { eighthPayloadData, eighthAggregateData } from './eighth-profile-data.mjs';
const prefix = 'games/magic/';
const paths = {
  fixture: prefix + 'fixtures/accuracy/lea/annotations-artist-credit.json',
  catalog: prefix + 'fixtures/accuracy/printing-review-catalog.json',
  payload: prefix + 'src/data/wording/lea.ts',
  aggregate: prefix + 'src/data/eager-wording.ts',
  metadata: prefix + 'src/data/review-metadata.ts',
  manifest: prefix + 'src/data/generated-manifest.json',
};
export function validatePrintingArtistDelta(p, after) {
  assert.equal(p.schema, 1);
  assert.equal(p.set, 'lea');
  assert.equal(p.id, 'a9c6c759-aabf-44e7-ba8c-33c5df232b56');
  assert.equal(p.artist, 'Mark Poole');
  assert.equal(p.previousArtist, 'Jesper Myrfors');
  assert.deepEqual(Object.keys(p.files).sort(), Object.values(paths).sort());
  const before = {};
  for (const [file, e] of Object.entries(p.files)) {
    assert.equal(hash(e.beforeSource), e.before);
    assert.equal(hash(after[file]), e.after);
    before[file] = e.beforeSource;
  }
  const fixture = JSON.parse(after[paths.fixture]),
    oldFixture = JSON.parse(before[paths.fixture]);
  const reviewed = fixture.cards[p.id];
  assert.equal(reviewed.name, 'Tropical Island');
  assert.equal(reviewed.artist, p.artist);
  assert.deepEqual(reviewed.reviewedFields, ['artist']);
  assert.equal(reviewed.referenceHash, p.referenceHash);
  assert.equal(reviewed.reviewed, undefined);
  assert(!oldFixture.cards[p.id]);
  delete fixture.cards[p.id];
  assert.deepEqual(fixture, oldFixture);
  const oldCatalog = JSON.parse(before[paths.catalog]),
    catalog = JSON.parse(after[paths.catalog]);
  assert.equal(Object.keys(catalog.artists).length, Object.keys(oldCatalog.artists).length + 1);
  const credit = catalog.artists[p.id];
  assert.equal(credit.artist, p.artist);
  assert.equal(credit.referenceSha256, p.referenceHash);
  assert.equal(credit.source, paths.fixture);
  assert.equal(catalog.sets[p.id], 'lea');
  assert.equal(catalog.artistRevision, hash(JSON.stringify(catalog.artists)));
  const newRevision = catalog.artistRevision;
  delete catalog.artists[p.id];
  catalog.artistRevision = oldCatalog.artistRevision;
  assert.deepEqual(catalog, oldCatalog, 'Only the physical artist catalog entry may change');
  const restorePayload = (data) => {
    data = structuredClone(data);
    assert.equal(data.set, 'lea');
    assert.equal(data.kind, 'wording');
    const row = data.tables.artistCredits?.[p.id];
    assert.equal(row?.artist, p.artist);
    assert.equal(row.referenceSha256, p.referenceHash);
    delete data.tables.artistCredits[p.id];
    return data;
  };
  const oldPayload = eighthPayloadData(before[paths.payload], paths.payload);
  const newPayload = restorePayload(eighthPayloadData(after[paths.payload], paths.payload));
  assert.deepEqual(newPayload, oldPayload, 'Other printing data changed');
  const oldAggregate = eighthAggregateData(before[paths.aggregate]);
  const newAggregate = eighthAggregateData(after[paths.aggregate]).map((data) =>
    data.set === 'lea' ? restorePayload(data) : data,
  );
  assert.equal(newAggregate.filter((d) => d.set === 'lea').length, 1);
  assert.deepEqual(newAggregate, oldAggregate, 'Other eager printing data changed');
  assert.equal(
    after[paths.metadata].replace(newRevision, oldCatalog.artistRevision),
    before[paths.metadata],
    'Only the artist revision may change',
  );
  const oldManifest = JSON.parse(before[paths.manifest]),
    manifest = JSON.parse(after[paths.manifest]);
  for (const file of [paths.payload, paths.aggregate, paths.metadata]) {
    assert.equal(oldManifest.files[file], p.files[file].before);
    assert.equal(manifest.files[file], p.files[file].after);
    manifest.files[file] = oldManifest.files[file];
  }
  assert.equal(manifest.sources[paths.catalog], p.files[paths.catalog].after);
  assert.equal(oldManifest.sources[paths.catalog], p.files[paths.catalog].before);
  manifest.sources[paths.catalog] = oldManifest.sources[paths.catalog];
  assert.deepEqual(manifest, oldManifest, 'Unrelated source or generated dependency changed');
  return {
    existingArtists: Object.keys(oldCatalog.artists).length,
    addedArtists: 1,
    wordingPrintings: Object.keys(oldCatalog.wording).length,
  };
}
