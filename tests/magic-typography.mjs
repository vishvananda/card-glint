import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
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
const fixture = async (set, file) =>
  JSON.parse(
    await readFile(
      new URL(`../games/magic/fixtures/accuracy/${set}/${file}.json`, import.meta.url),
      'utf8',
    ),
  );
for (const set of ['m21', 'm20']) {
  const targets = await fixture(set, 'typography');
  const annotations = await fixture(set, 'annotations');
  const corpus = await fixture(set, 'corpus');
  for (const [id, target] of Object.entries(targets.cards)) {
    const annotation = annotations.cards[id];
    assert.ok(annotation?.reviewed, `${set}/${id}: line targets need reviewed text`);
    assert.equal(target.referenceHash, annotation.referenceHash);
    assert.equal(
      target.referenceHash,
      corpus.entries.find((entry) => entry.id === id)?.referenceHash,
    );
    const text = annotation.paragraphs.flatMap((p) => p.runs.map((r) => r.text)).join('');
    assert.equal(normalizedText(target.lines.map((l) => l.text).join('')), normalizedText(text));
    for (const {
      inkBounds: [x, y, w, h],
    } of target.lines)
      assert.ok(
        [x, y, w, h].every(Number.isFinite) &&
          x >= 0 &&
          y >= 0 &&
          w > 0 &&
          h > 0 &&
          x + w <= 488 &&
          y + h <= 680,
      );
  }
}
const m21Names = new Set((await fixture('m21', 'corpus')).entries.map((c) => c.name));
const transfer = await fixture('m20', 'cohorts');
assert.equal(transfer.calibration.length, 0, 'M20 is evaluation-only');
assert.equal(new Set(transfer.selection.map((c) => c.id)).size, 24);
assert.ok(
  transfer.selection.every((c) => !m21Names.has(c.name)),
  'Transfer cohort contains a training-set name',
);
console.log(
  'Typography metrics distinguish soft wrapping, forced paragraphs, content mismatch and line count.',
);
