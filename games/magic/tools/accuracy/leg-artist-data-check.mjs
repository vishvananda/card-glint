// Validate inert,printing-specific artist data before projecting historical source.
import assert from 'node:assert/strict';
import ts from 'typescript';
import { hash } from './common.mjs';
import { eighthPayloadData, eighthAggregateData } from './eighth-profile-data.mjs';
import { parseProfileData } from './profile-data-modules.mjs';
export const legArtistPaths = {
  catalog: 'games/magic/fixtures/accuracy/printing-review-catalog.json',
  index: 'games/magic/fixtures/accuracy/review-source-index.json',
  payload: 'games/magic/src/data/wording/leg.ts',
  aggregate: 'games/magic/src/data/eager-wording.ts',
  metadata: 'games/magic/src/data/review-metadata.ts',
  manifest: 'games/magic/src/data/generated-manifest.json',
  report: 'games/magic/tools/accuracy/calibration-report.mjs',
};
const annotationFile = 'games/magic/fixtures/accuracy/leg/annotations-artist-credit.json';
function metadata(text) {
  const source = ts.createSourceFile('metadata.ts', text, ts.ScriptTarget.Latest, true),
    fields = [];
  assert.equal(source.parseDiagnostics.length, 0);
  for (const s of source.statements) {
    assert(ts.isVariableStatement(s) && s.declarationList.flags & ts.NodeFlags.Const);
    assert.deepEqual(
      s.modifiers.map((m) => m.kind),
      [ts.SyntaxKind.ExportKeyword],
    );
    for (const d of s.declarationList.declarations) {
      assert(ts.isIdentifier(d.name));
      assert(
        ['printingCorrectionRevision', 'artistCreditRevision', 'reviewSources'].includes(
          d.name.text,
        ),
      );
      fields.push(JSON.stringify(d.name.text) + ':' + d.initializer.getText(source));
    }
  }
  assert.equal(fields.length, 3);
  return parseProfileData('export const profile={' + fields.join(',') + '};export const review={};')
    .profile;
}
export function validateLegArtistDataDelta(p) {
  assert.equal(p.schema, 1);
  assert.equal(p.set, 'leg');
  assert.equal(p.status, 'native-leg-artist-data-only');
  assert.deepEqual(Object.keys(p.files).sort(), Object.values(legArtistPaths).sort());
  const before = {},
    after = {};
  for (const [file, r] of Object.entries(p.files)) {
    assert.equal(hash(r.beforeSource), r.before);
    assert.equal(hash(r.afterSource), r.after);
    before[file] = r.beforeSource;
    after[file] = r.afterSource;
  }
  assert.equal(hash(p.annotation.source), p.annotation.sha256);
  assert.equal(hash(p.review.source), p.review.sha256);
  const annotation = JSON.parse(p.annotation.source),
    review = JSON.parse(p.review.source),
    ids = Object.keys(annotation.cards).sort();
  assert.equal(annotation.set, 'leg');
  assert.equal(ids.length, 40);
  assert.equal(review.rows.length, 310);
  assert.equal(review.counts.corrections, 40);
  assert.deepEqual(p.ids, ids);
  const oldCatalog = JSON.parse(before[legArtistPaths.catalog]),
    catalog = JSON.parse(after[legArtistPaths.catalog]);
  const previous = Object.keys(oldCatalog.artists).length;
  assert.equal(Object.keys(catalog.artists).length, previous + 40);
  assert.equal(catalog.artistRevision, hash(JSON.stringify(catalog.artists)));
  const oldRevision = oldCatalog.artistRevision,
    newRevision = catalog.artistRevision;
  for (const id of ids) {
    const r = annotation.cards[id],
      v = catalog.artists[id],
      c = review.rows.find((c) => c.id === id);
    assert(!oldCatalog.artists[id]);
    assert.equal(catalog.sets[id], 'leg');
    assert.equal(v.artist, r.artist);
    assert.equal(v.referenceSha256, r.referenceHash);
    assert.equal(v.source, annotationFile);
    assert.deepEqual(r.reviewedFields, ['artist']);
    assert.equal(c.printedArtist, r.artist);
    assert.equal(c.referenceHash, r.referenceHash);
    assert(c.changed);
    delete catalog.artists[id];
  }
  catalog.artistRevision = oldRevision;
  assert.deepEqual(catalog, oldCatalog, 'Unrelated artist or wording data changed');
  const oldIndex = JSON.parse(before[legArtistPaths.index]),
    index = JSON.parse(after[legArtistPaths.index]);
  assert.equal(index.sources.pop(), annotationFile);
  assert.deepEqual(index, oldIndex);
  const restore = (data) => {
    const copy = structuredClone(data);
    assert.equal(copy.set, 'leg');
    assert.equal(copy.kind, 'wording');
    for (const id of ids) {
      const row = copy.tables.artistCredits[id],
        r = annotation.cards[id];
      assert.equal(row.artist, r.artist);
      assert.equal(row.referenceSha256, r.referenceHash);
      assert.equal(row.evidence, oldIndex.sources.length);
      delete copy.tables.artistCredits[id];
    }
    if (!Object.keys(copy.tables.artistCredits).length) delete copy.tables.artistCredits;
    return copy;
  };
  assert.deepEqual(
    restore(eighthPayloadData(after[legArtistPaths.payload])),
    eighthPayloadData(before[legArtistPaths.payload]),
  );
  const aggregate = eighthAggregateData(after[legArtistPaths.aggregate]);
  assert.equal(aggregate.filter((r) => r.set === 'leg').length, 1);
  assert.deepEqual(
    aggregate.map((r) => (r.set === 'leg' ? restore(r) : r)),
    eighthAggregateData(before[legArtistPaths.aggregate]),
  );
  const oldMeta = metadata(before[legArtistPaths.metadata]),
    meta = structuredClone(metadata(after[legArtistPaths.metadata]));
  assert.equal(meta.artistCreditRevision, newRevision);
  assert.equal(meta.reviewSources.pop(), annotationFile);
  meta.artistCreditRevision = oldRevision;
  assert.deepEqual(meta, oldMeta);
  const oldManifest = JSON.parse(before[legArtistPaths.manifest]),
    manifest = JSON.parse(after[legArtistPaths.manifest]);
  for (const file of [legArtistPaths.payload, legArtistPaths.aggregate, legArtistPaths.metadata]) {
    assert.equal(oldManifest.files[file], p.files[file].before);
    assert.equal(manifest.files[file], p.files[file].after);
    manifest.files[file] = oldManifest.files[file];
  }
  for (const file of [legArtistPaths.catalog, legArtistPaths.index]) {
    assert.equal(oldManifest.sources[file], p.files[file].before);
    assert.equal(manifest.sources[file], p.files[file].after);
    manifest.sources[file] = oldManifest.sources[file];
  }
  assert.deepEqual(
    manifest,
    oldManifest,
    'Unrelated generated payloads or source identities changed',
  );
  return {
    existingArtists: previous,
    addedArtists: 40,
    wordingPrintings: Object.keys(oldCatalog.wording).length,
    reviewedCredits: 310,
  };
}
