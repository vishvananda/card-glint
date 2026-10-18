// Revise the local Alpha experiment's wording without refitting any geometry.
// A mode flag alone cannot prove that the supplied printing text is original.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { cacheRoot, hash, readJson, root, writeJson } from './common.mjs';
import { readPrintingText } from './printing-text.mjs';
import { calibrationPresentation } from './calibration-wording.mjs';

const [inputFile, outputFile] = process.argv.slice(2);
if (!outputFile) throw Error('Usage: frame-reconstruction-wording.mjs INPUTS OUTPUT');
const fixture = path.join(root, 'games/magic/fixtures/accuracy/lea');
const inputs = await readJson(inputFile);
const types = await readJson(path.join(fixture, 'annotations-white-types.json'));
const prior = await readJson(path.join(fixture, 'annotations.json'));
const snapshot = await readJson(path.join(cacheRoot, 'sets/lea.json'));
const printing = await readPrintingText(snapshot);
assert(printing, 'Cached Alpha printing text is required');
const entries = [];
const revisions = [];
for (const entry of inputs.entries.filter((e) => e.card.set === 'lea' && e.material === 'W')) {
  const review = types.cards[entry.id];
  assert(review, `Missing original type review: ${entry.card.name}`);
  assert.equal(review.referenceHash, entry.reference.sha256);
  const oldReview = prior.cards[entry.id] ?? {};
  const annotations = {
    [entry.id]: {
      ...oldReview,
      ...review,
      reviewedFields: [...new Set([...(oldReview.reviewedFields ?? []), ...review.reviewedFields])],
    },
  };
  const original = calibrationPresentation(entry, annotations, printing.cards);
  assert.equal(original.wordingEvidence.type, 'scan-reviewed');
  // Preserve every non-wording input, including semantic frame traits, original
  // symbols, art selection, and color calibration. Do not import a new layout.
  const face = {
    ...entry.face,
    typeLine: original.face.typeLine,
    rulesText: original.face.rulesText,
    rulesParagraphs: original.face.rulesParagraphs,
    wordingMode: 'original',
    rulesAlignment: { mode: 'auto', reference: original.face.rulesParagraphs },
  };
  revisions.push({
    id: entry.id,
    name: entry.card.name,
    oldType: entry.face.typeLine,
    originalType: face.typeLine,
    bodyChanged:
      JSON.stringify(face.rulesParagraphs) !== JSON.stringify(entry.face.rulesParagraphs),
    evidence: original.wordingEvidence,
  });
  entries.push({
    ...entry,
    face,
    wordingEvidence: original.wordingEvidence,
    inputHash: hash(JSON.stringify(face)),
  });
}
assert.equal(entries.length, 45, 'This review covers exactly the Alpha white experiment');
await writeJson(outputFile, {
  ...inputs,
  inputRevision: 'alpha-white-original-wording-v2',
  previousInputHash: hash(await readFile(inputFile)),
  typeReviewHash: hash(await readFile(path.join(fixture, 'annotations-white-types.json'))),
  printingTextSource: printing.source,
  entries,
  revisions,
});
console.log(
  JSON.stringify({
    cards: entries.length,
    typesChanged: revisions.filter((r) => r.oldType !== r.originalType).length,
    bodiesChanged: revisions.filter((r) => r.bodyChanged).length,
  }),
);
