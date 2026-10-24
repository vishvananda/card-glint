import assert from 'node:assert/strict';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { reusablePrintingScore } from '../games/magic/tools/accuracy/printing-score-reuse.mjs';
const entry = {
  face: { name: 'Test' },
  card: { finishes: ['nonfoil'], type_line: 'Creature' },
  reference: { sha256: 'reference' },
};
const pose = { accepted: true, transform: { matrix: [1, 0, 0, 1, 0, 0] } };
const native = {
  inputHash: hash(JSON.stringify(entry.face)),
  layers: { face: { sha256: 'render' } },
};
const prior = {
  inputHash: native.inputHash,
  referenceHash: 'reference',
  renderHash: 'render',
  poseHash: hash(JSON.stringify(pose.transform)),
  poseAccepted: true,
  nonfoilEligible: true,
  metric: { structuralScore: 0.75 },
  normalizedReference: { file: 'reference.png', sha256: 'normalized' },
};
const reusable = (p = prior, before = entry, current = entry, n = native, t = pose) =>
  reusablePrintingScore(p, before, current, n, t, hash);
assert(reusable());
assert(!reusable({ ...prior, renderHash: 'changed' }));
assert(!reusable({ ...prior, referenceHash: 'changed' }));
assert(!reusable(prior, { ...entry, face: { name: 'Changed' } }));
assert(!reusable(prior, entry, { ...entry, face: { name: 'Changed' } }));
assert(!reusable(prior, entry, { ...entry, card: { ...entry.card, type_line: 'Land' } }));
assert(
  !reusable(prior, entry, entry, native, { ...pose, transform: { matrix: [1, 0, 0, 1, 0.5, 0] } }),
);
assert(!reusable(prior, entry, entry, native, { ...pose, accepted: false }));
console.log(
  'Printing score reuse rejects changed pixels, wording, semantics, references and poses',
);
