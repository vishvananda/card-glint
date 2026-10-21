import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from './magic-vite.mjs';
import { printedArtistAnnotation } from '../games/magic/tools/accuracy/printed-artist.mjs';
const review = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/2ed/annotations-artist-final.json'),
);
const before = {
  'Melissa Benson': 'Melissa A. Benson',
  'Tom Wanerstrand': 'Tom Wänerstrand',
  'Brian Snoddy': 'Brian Snõddy',
};
const server = await createServer({
  configFile: false,
  server: { middlewareMode: true },
  appType: 'custom',
});
try {
  const { resolvePrintingArtist } = await server.ssrLoadModule('/games/magic/src/index.ts');
  assert.equal(Object.keys(review.cards).length, 13);
  for (const [id, row] of Object.entries(review.cards)) {
    const canonical = before[row.artist];
    assert(canonical);
    const result = resolvePrintingArtist(id, canonical, { referenceSha256: row.referenceHash });
    assert.equal(result.artist, row.artist);
    assert.equal(result.provenance.status, 'applied');
    const stale = resolvePrintingArtist(id, canonical, { referenceSha256: '0'.repeat(64) });
    assert.equal(stale.artist, canonical);
    assert.equal(stale.provenance.status, 'reference-mismatch');
    const entry = {
      card: {
        id,
        name: row.name,
        set: '2ed',
        artist: canonical,
        collector_number: row.collectorNumber,
      },
      reference: { sha256: row.referenceHash },
    };
    const annotation = printedArtistAnnotation(entry);
    assert.deepEqual(annotation, {
      artist: row.artist,
      referenceHash: row.referenceHash,
      reviewedFields: ['artist'],
    });
    assert.throws(
      () => printedArtistAnnotation({ ...entry, reference: { sha256: '0'.repeat(64) } }),
      /stale/,
    );
    assert.equal(entry.card.artist, canonical);
  }
  assert.equal(
    resolvePrintingArtist('unreviewed-printing', 'Melissa A. Benson').artist,
    'Melissa A. Benson',
  );
} finally {
  await server.close();
}
console.log(
  'Thirteen exact Unlimited credits: public/accuracy paths agree, stale scans reject and canonical provider data stays intact.',
);

const { artistReviewSource, artistReviewProofDependency } = await import(
  '../games/magic/tools/accuracy/artist-review-ancestry.mjs'
);
const file = 'games/magic/tools/accuracy/printed-artist.mjs';
const bytes = await readFile(file);
const old = await artistReviewProofDependency(file, bytes);
assert.notDeepEqual(bytes, old);
assert.deepEqual((await artistReviewSource(file, bytes, 'm21')).bytes, old);
for (const scope of ['2ed', undefined, '../', ''])
  assert.deepEqual((await artistReviewSource(file, bytes, scope)).bytes, bytes);
await assert.rejects(
  artistReviewProofDependency(file, Buffer.concat([bytes, Buffer.from('// unknown edit')])),
  /Unreviewed/,
);
console.log(
  'Artist helper compatibility preserves changed/unscoped identities and rejects unknown source edits.',
);
