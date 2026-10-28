import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { root } from '../games/magic/tools/accuracy/common.mjs';
import { validateFourthSourceReadiness } from '../games/magic/tools/accuracy/fourth-source-readiness.mjs';
import {
  fourthSourceFiles,
  fourthSourceReadinessProof,
  fourthSourceInputCurrent,
} from '../games/magic/tools/accuracy/fourth-source-approval.mjs';
const read = async (file) => {
  const raw = await fs.readFile(root + '/' + file);
  return JSON.parse(file.endsWith('.gz') ? gunzipSync(raw) : raw);
};
const ledger = await read('games/magic/fixtures/accuracy/calibration-progress.json');
const set = ledger.sets.find((s) => s.set === '4ed');
const data = { set };
for (const [key, field] of [
  ['input', 'input'],
  ['native', 'native'],
  ['publicInputs', 'publicInputs'],
  ['types', 'types'],
  ['bodies', 'bodies'],
])
  data[key] = await read(fourthSourceFiles[field]);
const result = validateFourthSourceReadiness(data);
assert.deepEqual(result.summary, {
  typeReady: 378,
  rulesScanReviewed: 15,
  rulesProviderOrOtherReview: 363,
  eagerExact: 378,
  lazyExact: 378,
  changedInputs: 0,
});
const cache = new Map();
let ready = 0,
  partial = 0,
  typeReady = 0;
for (const group of set.groups) {
  const rules = group.tasks.rules.originalInput,
    type = group.tasks.headings.originalInput;
  assert(await fourthSourceInputCurrent(type, group, 'headings', set, cache));
  assert(await fourthSourceInputCurrent(rules, group, 'rules', set, cache));
  typeReady += type.coveredPrintings;
  if (rules.status === 'ready') ready += rules.coveredPrintings;
  else partial += rules.coveredPrintings;
  const bad = structuredClone(rules);
  bad.coveredPrintings++;
  assert.equal(await fourthSourceInputCurrent(bad, group, 'rules', set, cache), false);
  if (rules.status === 'partial') {
    const promoted = structuredClone(rules);
    promoted.status = 'ready';
    assert.equal(
      await fourthSourceInputCurrent(promoted, group, 'rules', set, cache),
      false,
      'Provider parity cannot approve transcription',
    );
  }
}
assert.equal(typeReady, 378);
assert.equal(ready, 15);
assert.equal(partial, 363);
for (const mutate of [
  (d) => {
    d.bodies.cards[0].referenceHash = '0'.repeat(64);
  },
  (d) => {
    const id = d.bodies.cards[0].id;
    d.bodies.cards[0].rulesText = d.publicInputs.rows.find(
      (r) => r.id === id,
    ).providerOracle.rulesText;
  },
  (d) => {
    d.bodies.cards.pop();
  },
  (d) => {
    d.bodies.cards[0].typeLine = 'Basic Land — Plains';
  },
  (d) => {
    d.bodies.cards[0].quality.nonfoil = false;
  },
  (d) => {
    d.publicInputs.rows[0].id = d.publicInputs.rows[1].id;
  },
  (d) => {
    Object.values(d.types.cards)[0].typeLine = 'Foreign modern type';
  },
]) {
  const bad = structuredClone(data);
  mutate(bad);
  assert.throws(() => validateFourthSourceReadiness(bad));
}
const group = set.groups[0],
  foreign = structuredClone(set);
foreign.groups[0].membershipHash = '0'.repeat(64);
assert.equal(
  await fourthSourceInputCurrent(
    group.tasks.headings.originalInput,
    foreign.groups[0],
    'headings',
    foreign,
  ),
  false,
);
const stale = structuredClone(group.tasks.headings.originalInput);
stale.guards['games/magic/src/printing/resolve.ts'] = '0'.repeat(64);
assert.equal(await fourthSourceInputCurrent(stale, group, 'headings', set, cache), false);
// Simulate changed source bytes only inside this test process; never edit the checkout.
const original = fs.readFile;
fs.readFile = async (file, ...args) =>
  String(file).endsWith('/games/magic/src/printing/resolve.ts')
    ? Buffer.from('Unreviewed source implementation')
    : original.call(fs, file, ...args);
try {
  await assert.rejects(() => fourthSourceReadinessProof(set), /Changed Original source dependency/);
  assert.equal(
    await fourthSourceInputCurrent(group.tasks.headings.originalInput, group, 'headings', set),
    false,
  );
} finally {
  fs.readFile = original;
}
assert(
  set.groups.every(
    (g) =>
      g.tasks.references.status === 'partial' &&
      g.tasks.rules.status === 'partial' &&
      g.tasks.headings.status === 'partial',
  ),
);
console.log(
  'Fourth Original readiness:378 reviewed type inputs,15 scan-read basic bodies,363 explicit partial bodies;foreign scans,Oracle substitution,missing/duplicate members,changed source and unjustified promotion reject. Parent calibrations remain open.',
);
