import assert from 'node:assert/strict';
import { hash } from './common.mjs';
/** Offline Original-only size proposals. Never a production layout override. */
export function validateRulesNativePlan(plan, inputs, inputsHash, rendererHash) {
  assert.equal(plan.schema, 1);
  assert.equal(plan.set, 'm21');
  assert.equal(inputs.set, 'm21');
  assert.equal(inputs.entries.length, 297);
  assert.equal(plan.inputsHash, inputsHash, 'Text proposal inputs changed');
  assert.equal(plan.rendererHash, rendererHash, 'Text proposal renderer changed');
  assert(plan.selectionPolicy?.trim(), 'Missing text selection policy');
  const entries = new Map(inputs.entries.map((entry) => [entry.id, entry]));
  assert.equal(entries.size, 297);
  assert(
    plan.adjustments && typeof plan.adjustments === 'object' && !Array.isArray(plan.adjustments),
  );
  for (const [id, proposal] of Object.entries(plan.adjustments)) {
    const entry = entries.get(id);
    assert(entry, 'Unknown text proposal printing');
    assert.equal(entry.face.wordingMode, 'original');
    const type = entry.face.canonicalTypeLine ?? entry.face.typeLine ?? entry.card?.type_line ?? '';
    assert(
      entry.face.frameStyle !== 'retro' &&
        !entry.face.frameTemplate &&
        !entry.face.faces?.length &&
        (!entry.face.layout || entry.face.layout === 'normal') &&
        !/\b(Planeswalker|Saga|Battle|Class)\b/.test(type) &&
        !(/\bBasic\b/.test(type) && /\bLand\b/.test(type)),
      'Text proposal requires an ordinary nonbasic frame',
    );
    assert.equal(
      proposal.inputHash,
      hash(JSON.stringify(entry.face)),
      'Text proposal wording changed',
    );
    assert(
      proposal.adjustment &&
        typeof proposal.adjustment === 'object' &&
        !Array.isArray(proposal.adjustment),
    );
    for (const [key, value] of Object.entries(proposal.adjustment)) {
      if (key === 'maximumSize')
        assert(
          Number.isFinite(value) && value >= 15 && value <= 26,
          'Invalid proposed maximum size',
        );
      else {
        assert(
          ['smartQuotes', 'ignoreLegacyLineBudget'].includes(key),
          'Unsupported native text proposal knob',
        );
        assert.equal(typeof value, 'boolean');
      }
    }
  }
  return plan;
}
