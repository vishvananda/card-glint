import assert from 'node:assert/strict';
import { normalizedText, wrapping } from '../games/magic/tools/accuracy/typography-metrics.mjs';

assert.equal(normalizedText('“One”\n‘two’'), '"One"\'two\'');
const paragraphs = ['A bright morning.', 'A silent evening.'];
const exact = wrapping(
  ['A bright', 'morning.', 'A silent evening.'],
  ['A bright', 'morning.', 'A silent evening.'],
  paragraphs,
);
assert.equal(exact.softBreakF1, 1);
assert.equal(exact.exactWrapping, true);
const wrong = wrapping(
  ['A bright', 'morning.', 'A silent evening.'],
  ['A', 'bright morning.', 'A silent evening.'],
  paragraphs,
);
assert.equal(
  wrong.softBreakF1,
  0,
  'A matching forced paragraph break must not reward wrong soft wraps',
);
assert.equal(wrong.lineCountError, 0, 'Equal line counts can still have wrong wraps');
const missing = wrapping(['A bright', 'morning.'], ['A bright', 'evening.'], ['A bright morning.']);
assert.equal(missing.status, 'content-mismatch');
const extra = wrapping(['A bright morning.'], ['A bright', 'morning.'], ['A bright morning.']);
assert.equal(extra.softBreakF1, 0);
assert.equal(extra.lineCountError, 1);
assert.equal(wrapping(paragraphs, paragraphs, paragraphs).softBreakF1, 1);
console.log(
  'Typography metrics distinguish soft wrapping, forced paragraphs, content mismatch and line count.',
);
