// Validate three scan-reviewed body edits independently of the renderer refit.
import assert from 'node:assert/strict';
import { hash } from './common.mjs';
import { eighthPayloadData, eighthAggregateData } from './eighth-profile-data.mjs';
const base = 'games/magic/';
export const flowRuntimeFiles = [
  'alpha-typography',
  'canvas-face',
  'early-text-tiers',
  'retro-rules',
].map((f) => base + 'src/presentation/' + f + '.ts');
export const flowDataFiles = [
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
export function validateAbuFlowData(p, after, review) {
  assert.equal(p.schema, 1);
  assert.deepEqual(Object.keys(p.files).sort(), [...flowRuntimeFiles, ...flowDataFiles].sort());
  assert.equal(review.cards.length, 3);
  assert.deepEqual(review.cards.map((r) => r.set).sort(), ['2ed', 'lea', 'leb']);
  const before = {};
  for (const [file, r] of Object.entries(p.files)) {
    assert.equal(hash(r.beforeSource), r.before);
    assert.equal(hash(after[file]), r.after, 'Unreviewed flow source/data: ' + file);
    before[file] = r.beforeSource;
  }
  const cat = base + 'fixtures/accuracy/printing-review-catalog.json',
    old = JSON.parse(before[cat]),
    next = JSON.parse(after[cat]);
  assert.deepEqual(next.artists, old.artists);
  assert.equal(next.artistRevision, old.artistRevision);
  assert.deepEqual(next.sets, old.sets);
  assert.deepEqual(Object.keys(next.wording), Object.keys(old.wording));
  for (const r of review.cards) {
    assert.equal(r.name, 'Stasis');
    assert.equal(r.proposed, r.before.replace('during your upkeep', 'during upkeep'));
    assert.notEqual(r.before, r.proposed);
    const file = base + 'fixtures/accuracy/' + r.set + '/annotations-empty-rules.json',
      a = JSON.parse(before[file]),
      b = JSON.parse(after[file]);
    assert.equal(a.cards[r.id], undefined);
    const entry = b.cards[r.id];
    assert(entry);
    assert.equal(entry.name, r.name);
    assert.equal(entry.referenceHash, r.referenceHash);
    assert.equal(entry.rulesText, r.proposed);
    assert.deepEqual(entry.reviewedFields, ['rulesText']);
    assert.equal(entry.reviewed, undefined);
    assert.deepEqual(Object.keys(entry).sort(), [
      'name',
      'referenceHash',
      'reviewNote',
      'reviewedFields',
      'rulesText',
    ]);
    const note = a.note.replace(
      'Individually scan-reviewed printings with no rules text.',
      'Individually scan-reviewed printing fields. Most records confirm empty rules; later field-only corrections list their reviewed fields.',
    );
    assert.equal(b.note, note);
    delete b.cards[r.id];
    b.note = a.note;
    assert.deepEqual(b, a, 'Unrelated annotation changed');
    const prev = effective(old.wording[r.id]),
      proposed = effective(next.wording[r.id]);
    assert(prev.rulesText === undefined || prev.rulesText === r.before);
    assert.equal(proposed.rulesText, r.proposed);
    delete prev.rulesText;
    delete proposed.rulesText;
    assert.deepEqual(proposed, prev, 'Unrelated printing field changed');
    assert(next.wording[r.id].every((e) => e.referenceSha256 === r.referenceHash));
  }
  const restored = structuredClone(next);
  for (const r of review.cards) restored.wording[r.id] = old.wording[r.id];
  assert.equal(next.revision, hash(JSON.stringify(next.wording)));
  restored.revision = old.revision;
  assert.deepEqual(restored, old, 'Unrelated catalog/provenance changed');
  const restore = (current, previous) => {
    current = structuredClone(current);
    for (const r of review.cards.filter((r) => r.set === current.set)) {
      assert.equal(effective(current.tables.printingCorrections[r.id]).rulesText, r.proposed);
      current.tables.printingCorrections[r.id] = previous.tables.printingCorrections[r.id];
    }
    return current;
  };
  for (const set of ['lea', 'leb', '2ed']) {
    const file = base + 'src/data/wording/' + set + '.ts',
      a = eighthPayloadData(before[file], file),
      b = eighthPayloadData(after[file], file);
    assert.equal(b.set, set);
    assert.equal(b.kind, 'wording');
    assert.deepEqual(restore(b, a), a, 'Unrelated lazy wording data changed');
  }
  const eager = base + 'src/data/eager-wording.ts',
    a = eighthAggregateData(before[eager]),
    b = eighthAggregateData(after[eager]);
  assert.deepEqual(
    b.map((current) => {
      const previous = a.find((p) => p.set === current.set && p.kind === current.kind);
      assert(previous);
      return review.cards.some((r) => r.set === current.set) ? restore(current, previous) : current;
    }),
    a,
    'Unrelated eager wording data changed',
  );
  const metadata = base + 'src/data/review-metadata.ts';
  assert.equal(
    after[metadata].replace(next.revision, old.revision),
    before[metadata],
    'Unrelated review indices changed',
  );
  const manifest = base + 'src/data/generated-manifest.json',
    ma = JSON.parse(before[manifest]),
    mb = JSON.parse(after[manifest]);
  assert.deepEqual(Object.keys(mb), Object.keys(ma));
  for (const kind of ['files', 'sources']) {
    assert.deepEqual(Object.keys(mb[kind]), Object.keys(ma[kind]));
    for (const [file, digest] of Object.entries(mb[kind])) {
      if (digest === ma[kind][file]) continue;
      assert(p.files[file], 'Unexpected generated dependency change: ' + file);
      assert.equal(digest, p.files[file].after);
      assert.equal(ma[kind][file], p.files[file].before);
      mb[kind][file] = ma[kind][file];
    }
  }
  assert.deepEqual(mb, ma, 'Unrelated generated metadata changed');
  return {
    wordingPrintings: Object.keys(next.wording).length,
    changedRulesPrintings: 3,
    unchangedArtists: Object.keys(next.artists).length,
    changedSets: ['lea', 'leb', '2ed'],
  };
}
