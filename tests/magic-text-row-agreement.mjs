import assert from 'node:assert/strict';
import { textRowAgreement } from '../games/magic/tools/accuracy/text-row-agreement.mjs';
const rows = [
  'Fortunately, Hill Giants have large',
  'blind spots in which a human can',
  'easily hide. Unfortunately, these',
  'blind spots are beneath the bottoms of',
  'their feet.',
];
assert.equal(textRowAgreement(rows, rows).exact, true);
// A pixel objective preferred this smaller four-row candidate in the Fourth
// study. Its improved overlap cannot establish the correct printed wrapping.
const shorter = [
  'Fortunately, Hill Giants have large blind',
  'spots in which a human can easily hide.',
  'Unfortunately, these are beneath the bottoms of',
  'their feet.',
];
assert.equal(textRowAgreement(rows, shorter).status, 'content-mismatch');
const fourRows = [
  'Fortunately, Hill Giants have large blind',
  'spots in which a human can easily hide.',
  'Unfortunately, these blind spots are beneath',
  'the bottoms of their feet.',
];
const different = textRowAgreement(rows, fourRows);
assert.equal(different.status, 'measured');
assert.equal(different.exact, false);
assert.equal(different.referenceRows, 5);
assert.equal(different.renderedRows, 4);
assert(different.score < 0.5);
assert.equal(
  textRowAgreement(['Pay {4}: target—creature.'], ['Pay 4: target creature.']).exact,
  true,
);
assert.equal(textRowAgreement(['“It’s unchanged.”'], ['"It\'s unchanged."']).exact, true);
assert.equal(textRowAgreement(['Target creature.'], ['Target artifact.']).score, null);
assert.equal(textRowAgreement([], []).status, 'not-applicable');
assert.equal(textRowAgreement([], ['Defender']).status, 'content-mismatch');
assert.throws(() => textRowAgreement('not rows', []), TypeError);
console.log(
  'Printed-row audit distinguishes wrapping from pixel overlap and rejects changed wording.',
);

// The extended targets retain the original six reviews and use the same words
// and scan identities as the exact native baseline; only printed breaks differ.
{
  const fs = await import('node:fs/promises');
  const { gunzipSync } = await import('node:zlib');
  const base = JSON.parse(
    await fs.readFile('games/magic/fixtures/accuracy/4ed/printed-row-targets.json'),
  );
  const extended = JSON.parse(
    await fs.readFile('games/magic/fixtures/accuracy/4ed/printed-row-targets-extended.json'),
  );
  const study = JSON.parse(
    gunzipSync(
      await fs.readFile(
        'games/magic/fixtures/accuracy/4ed/native-request-unconstrained-study.json.gz',
      ),
    ),
  );
  assert.equal(extended.parent, 'games/magic/fixtures/accuracy/4ed/printed-row-targets.json');
  assert.deepEqual(extended.rows.slice(0, base.rows.length), base.rows);
  assert.equal(extended.rows.length, 12);
  assert.equal(new Set(extended.rows.map((r) => r.id)).size, 12);
  for (const row of extended.rows) {
    const native = study.rows.find((r) => r.id === row.id);
    assert(native);
    assert.equal(row.referenceHash, native.referenceHash);
    assert.equal(
      textRowAgreement(
        row.printedRows,
        native.trials[0].layout.lines.map((l) => l.text),
      ).status,
      'measured',
    );
  }
}
