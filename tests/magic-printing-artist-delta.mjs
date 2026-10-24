import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash, sourceHash } from '../games/magic/tools/accuracy/common.mjs';
import {
  printingArtistDelta,
  prePrintingArtistData,
  printingArtistHistoricalHash,
  printingArtistAffected,
} from '../games/magic/tools/accuracy/printing-artist-data-ancestry.mjs';
import { validatePrintingArtistDelta } from '../games/magic/tools/accuracy/printing-artist-data-check.mjs';
const p = await printingArtistDelta(),
  after = {};
for (const [file, e] of Object.entries(p.files)) {
  after[file] = await readFile(file, 'utf8');
  assert.equal(hash(await prePrintingArtistData(file, Buffer.from(after[file]))), e.before);
  assert.equal(hash(await prePrintingArtistData(file, Buffer.from(e.beforeSource))), e.before);
  await assert.rejects(
    prePrintingArtistData(file, Buffer.from(after[file] + '\nunknown')),
    /Unreviewed printing artist data/,
  );
}
assert.deepEqual(validatePrintingArtistDelta(p, after), {
  existingArtists: 221,
  addedArtists: 1,
  wordingPrintings: 2962,
});
assert.equal(await sourceHash('games/magic/src'), p.afterRenderer);
assert.equal(await printingArtistHistoricalHash(), p.beforeRenderer);
const mutate = (file, transform) => {
  const proof = structuredClone(p),
    data = { ...after };
  data[file] = transform(data[file]);
  proof.files[file].after = hash(data[file]);
  return () => validatePrintingArtistDelta(proof, data);
};
const fixture = 'games/magic/fixtures/accuracy/lea/annotations-artist-credit.json';
assert.throws(
  mutate(fixture, (s) => {
    const v = JSON.parse(s);
    v.cards[p.id].reviewed = true;
    return JSON.stringify(v);
  }),
);
assert.throws(
  mutate(fixture, (s) => {
    const v = JSON.parse(s);
    v.cards[p.id].referenceHash = '0'.repeat(64);
    return JSON.stringify(v);
  }),
);
const catalog = 'games/magic/fixtures/accuracy/printing-review-catalog.json';
assert.throws(
  mutate(catalog, (s) => {
    const v = JSON.parse(s);
    v.wording[Object.keys(v.wording)[0]][0].fields.rulesText = 'Hidden change';
    return JSON.stringify(v);
  }),
);
assert.throws(
  mutate('games/magic/src/data/eager-wording.ts', (s) => s + '\nglobalThis.hidden=true;'),
);
assert.throws(
  mutate('games/magic/src/data/review-metadata.ts', (s) =>
    s.replace(/printingCorrectionRevision =\s*'[^']+'/, "printingCorrectionRevision = 'wrong'"),
  ),
);
for (const task of ['artist', 'fullCard', 'release']) {
  assert(await printingArtistAffected('lea', task, false, { printingIds: [p.id] }));
  assert.equal(
    await printingArtistAffected('lea', task, false, { printingIds: ['another-printing'] }),
    false,
  );
  assert.equal(await printingArtistAffected('leb', task, false, { printingIds: [p.id] }), false);
  assert.equal(await printingArtistAffected('lea', task, true, { printingIds: [p.id] }), false);
}
for (const task of [
  'rules',
  'flavor',
  'headings',
  'frameGeometry',
  'frameColor',
  'manaColor',
  'stats',
])
  assert.equal(await printingArtistAffected('lea', task, false, { printingIds: [p.id] }), false);
console.log(
  'Artist data: one exact Alpha credit,221 unchanged artists/2962 wording records; native footer-only parity, scoped invalidation, pure-data restoration and hidden-edit rejection pass.',
);
