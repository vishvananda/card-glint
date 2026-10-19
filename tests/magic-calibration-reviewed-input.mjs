import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { createServer } from './magic-vite.mjs';
import { reviewedCalibrationInput } from '../games/magic/tools/accuracy/calibration-reviewed-input.mjs';
import { hash } from '../games/magic/tools/accuracy/common.mjs';

const fixture = async (name) =>
  JSON.parse(await readFile(`games/magic/fixtures/accuracy/2ed/${name}.json`));
const empty = await fixture('annotations-empty-rules'),
  types = await fixture('annotations-printed-types'),
  fields = await fixture('annotations-printed-fields');
assert.equal(Object.keys(empty.cards).length, 18);
assert.equal(Object.keys(types.cards).length, 302);
const evidenceRoot = 'games/magic/fixtures/accuracy/2ed/audit-preparation/',
  evidence = JSON.parse(await readFile(evidenceRoot + 'review.json'));
assert.equal(evidence.complete, false);
assert.equal(evidence.typography.candidateAdopted, false);
assert.ok(evidence.normalization.maximumKnownControlError < 0.15);
for (const [file, record] of Object.entries(evidence.files)) {
  const bytes = await readFile(evidenceRoot + file),
    raw = gunzipSync(bytes);
  assert.equal(hash(bytes), record.sha256, file);
  assert.equal(hash(raw), record.uncompressedSha256, file);
  assert.equal(raw.length, record.bytes, file);
}
const server = await createServer({ configFile: false, server: { middlewareMode: true } });
try {
  const api = await server.ssrLoadModule('/games/magic/src/index.ts');
  const entry = (id, review) => ({
    id,
    reference: { sha256: review.referenceHash },
    card: {
      id,
      name: review.name,
      set: '2ed',
      frame: '1993',
      colors: ['G'],
      type_line: 'Creature — Wall',
      oracle_text: 'Defender (This creature cannot attack.)',
      artist: 'Imported artist',
      mana_cost: '{G}',
    },
  });
  for (const [id, review] of Object.entries(empty.cards)) {
    const e = entry(id, review),
      prepared = reviewedCalibrationInput(e, {}, api);
    assert.equal(prepared.face.wordingMode, 'original');
    assert.equal(prepared.wordingEvidence.rules, 'scan-reviewed');
    assert.equal(prepared.wordingEvidence.type, 'scan-reviewed');
    assert.equal(prepared.wordingEvidence.flavor, 'scan-reviewed');
    assert.equal(prepared.face.typeLine, types.cards[id].typeLine);
    assert.ok(prepared.face.rulesParagraphs.every((p) => p.role === 'flavor'));
    assert.ok(!prepared.face.rulesText.includes('Defender'));
    assert.throws(
      () => reviewedCalibrationInput({ ...e, reference: { sha256: '0'.repeat(64) } }, {}, api),
      /Stale original wording/,
    );
  }
  const [id, review] = Object.entries(types.cards).find(([, r]) => r.name === 'Wall of Swords'),
    e = entry(id, review);
  // A type-only correction cannot turn absent original text into an empty body.
  assert.throws(() => reviewedCalibrationInput(e, {}, api), /Original rules unavailable/);
  const prepared = reviewedCalibrationInput(e, { [id]: { originalText: 'Flying' } }, api);
  assert.equal(prepared.wordingEvidence.rules, 'mtgjson-original');
  assert.equal(prepared.wordingEvidence.flavor, 'printing-metadata-unreviewed');
  assert.equal(prepared.face.rulesText, 'Flying');
  const rulesStyleApi = {
    ...api,
    resolvePrintingWording(...args) {
      const result = api.resolvePrintingWording(...args);
      result.provenance.corrections.push({
        fields: ['rulesParagraphs'],
        paragraphScope: 'rules-only',
      });
      return result;
    },
  };
  const styled = reviewedCalibrationInput(e, { [id]: { originalText: 'Flying' } }, rulesStyleApi);
  assert.equal(styled.wordingEvidence.rules, 'scan-reviewed');
  assert.equal(styled.wordingEvidence.flavor, 'printing-metadata-unreviewed');

  for (const [id, review] of Object.entries(fields.cards)) {
    const prepared = reviewedCalibrationInput(
      entry(id, review),
      { [id]: { originalText: 'Printing-specific rules' } },
      api,
    );
    for (const field of review.reviewedFields)
      assert.deepEqual(prepared.face[field], review[field]);
    assert.equal(
      prepared.wordingEvidence.rules,
      Object.hasOwn(empty.cards, id) ? 'scan-reviewed' : 'mtgjson-original',
    );
  }
} finally {
  await server.close();
}
console.log(
  'Calibration inputs use scan-bound public corrections without Oracle or empty-body fallback.',
);
