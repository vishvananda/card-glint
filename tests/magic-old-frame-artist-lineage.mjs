import assert from 'node:assert/strict';
import { artistInputLineage } from '../games/magic/tools/accuracy/old-frame-artist-input-lineage.mjs';
const entry = {
  id: 'id',
  name: 'Card',
  material: 'R',
  reference: { sha256: 'scan' },
  art: { sha256: 'art' },
  card: { collector_number: '1' },
  face: {
    name: 'Card',
    artist: 'Normalized',
    typeLine: 'Summon Wizard',
    rulesParagraphs: [{ role: 'rules', runs: [{ text: 'Printed' }] }],
  },
};
const parent = { set: 'mir', entries: [entry] },
  next = structuredClone(parent);
next.entries[0].face.artist = 'Printed';
next.entries[0].face.rulesParagraphs[0].runs[0].italic = false;
const poses = {
    rows: [
      {
        id: 'id',
        referenceHash: 'scan',
        accepted: true,
        transform: { matrix: [1, 0, 0, 1, 0.5, -0.25] },
      },
    ],
  },
  exported = {
    rows: [
      {
        id: 'id',
        referenceHash: 'scan',
        accepted: true,
        pose: { matrix: [1, 0, 0, 1, 0.5, -0.25] },
      },
    ],
  },
  review = {
    set: 'mir',
    cards: {
      id: {
        name: 'Card',
        collectorNumber: '1',
        referenceHash: 'scan',
        reviewedFields: ['artist'],
        artist: 'Printed',
      },
    },
  };
const before = JSON.stringify({ parent, next, poses, exported, review });
const rows = artistInputLineage(parent, next, poses, exported, review);
assert.equal(rows.length, 1);
assert.deepEqual(rows[0].fields, ['artist', 'rulesParagraphs']);
assert.equal(JSON.stringify({ parent, next, poses, exported, review }), before);
for (const edit of [
  (e) => (e.face.typeLine = 'Creature — Wizard'),
  (e) => (e.material = 'U'),
  (e) => (e.reference.sha256 = 'different'),
  (e) => (e.art.sha256 = 'different'),
  (e) => (e.face.rulesParagraphs[0].runs[0].italic = true),
  (e) => (e.face.artist = 'Unreviewed'),
]) {
  const foreign = structuredClone(next);
  edit(foreign.entries[0]);
  assert.throws(() => artistInputLineage(parent, foreign, poses, exported, review));
}
assert.throws(() =>
  artistInputLineage(
    parent,
    { ...next, entries: [...next.entries, ...next.entries] },
    poses,
    exported,
    review,
  ),
);
console.log(
  'Artist-input lineage preserves exact scan poses, permits only reviewed credits and equivalent false defaults, and refuses semantic or source changes.',
);

const moved = structuredClone(poses);
moved.rows[0].transform.matrix[4] += 1;
assert.throws(() => artistInputLineage(parent, next, moved, exported, review));
