import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  normalizedText,
  wrapping,
  typographyMetrics,
} from '../games/magic/tools/accuracy/typography-metrics.mjs';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { presentation } from '../games/magic/tools/accuracy/adapter.mjs';

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
const lineOnly = typographyMetrics(
  { lines: [{ text: 'A bright morning.' }] },
  {
    face: { rulesParagraphs: [{ runs: [{ text: 'A bright morning.' }] }] },
    layout: { lines: [{ runs: [{ text: 'A bright' }] }, { runs: [{ text: 'morning.' }] }] },
  },
);
assert.equal(lineOnly.lineCountError, 1);
assert.equal(lineOnly.exactWrapping, false);
assert.equal(lineOnly.blockEdgeMae, null, 'Line text alone cannot certify geometric alignment');
const fixture = async (set, file) =>
  JSON.parse(
    await readFile(
      new URL(`../games/magic/fixtures/accuracy/${set}/${file}.json`, import.meta.url),
      'utf8',
    ),
  );
for (const [set, suffix] of [
  ['m21', ''],
  ['m20', ''],
  ['mir', '-retro-type'],
  ['tmp', '-retro-type'],
  ['4ed', '-centered'],
]) {
  const targets = await fixture(set, 'typography' + suffix);
  const annotations = await fixture(set, 'annotations' + suffix);
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
    for (const line of target.lines) {
      if (set === '4ed') {
        assert.equal(line.inkBounds, undefined, 'Line-only targets must not invent ink boxes');
        continue;
      }
      const [x, y, w, h] = line.inkBounds;
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
  if (targets.alignmentHash)
    assert.equal(targets.alignmentHash, hash(JSON.stringify(await fixture(set, 'alignment'))));
}
const m21Names = new Set((await fixture('m21', 'corpus')).entries.map((c) => c.name));
const transfer = await fixture('m20', 'cohorts');
assert.equal(transfer.calibration.length, 0, 'M20 is evaluation-only');
assert.equal(new Set(transfer.selection.map((c) => c.id)).size, 24);
assert.ok(
  transfer.selection.every((c) => !m21Names.has(c.name)),
  'Transfer cohort contains a training-set name',
);
for (const set of ['mir', 'tmp']) {
  const annotations = await fixture(set, 'annotations');
  const corpus = await fixture(set, 'corpus');
  const cohort = await fixture(set, 'cohorts');
  assert.equal(corpus.eligibleCount, 350);
  assert.equal(corpus.entries.length, corpus.eligibleCount);
  assert.equal(Object.keys(annotations.cards).length, cohort.selection.length);
  for (const selected of cohort.selection) {
    const entry = corpus.entries.find((c) => c.id === selected.id);
    const annotation = annotations.cards[selected.id];
    assert.ok(annotation.reviewed);
    assert.equal(annotation.referenceHash, entry.referenceHash);
    assert.equal(
      normalizedText(annotation.paragraphs.flatMap((p) => p.runs.map((r) => r.text)).join('')),
      normalizedText(annotation.rulesText + annotation.flavorText),
    );
    assert.throws(
      () =>
        presentation(
          { card: { id: selected.id }, reference: { sha256: 'changed' } },
          annotations.cards,
        ),
      /stale/,
    );
  }
}
const mirAlignment = await fixture('mir', 'alignment');
const tmpAlignment = await fixture('tmp', 'alignment');
assert.equal(tmpAlignment.transferredFrom.profileHash, hash(JSON.stringify(mirAlignment)));
assert.deepEqual(tmpAlignment.frameFamilies, mirAlignment.frameFamilies);
const mirNames = new Set((await fixture('mir', 'corpus')).entries.map((c) => c.name));
const tmpCohort = await fixture('tmp', 'cohorts');
assert.equal(tmpCohort.calibration.length, 0);
assert.ok(tmpCohort.selection.every((c) => !mirNames.has(c.name)));
for (const set of ['mir', 'tmp']) {
  const old = await fixture(set, 'cohorts');
  const study = await fixture(set, 'cohorts-retro-type');
  const corpus = await fixture(set, 'corpus');
  const targets = await fixture(set, 'typography-retro-type');
  assert.equal(study.heldOut.length, 8);
  assert.ok(
    study.heldOut.every((n) => !old.selection.some((c) => c.collectorNumber === n)),
    'Fresh holdout was previously reviewed',
  );
  assert.equal(study.calibration.length, set === 'mir' ? 16 : 0);
  for (const n of [...study.calibration, ...study.heldOut])
    assert.ok(targets.cards[corpus.entries.find((c) => c.collectorNumber === n).id]);
  if (set === 'tmp') assert.ok(study.selection.every((c) => !mirNames.has(c.name)));
}
console.log(
  'Typography metrics distinguish soft wrapping, forced paragraphs, content mismatch and line count.',
);
