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
