import { preArtifactSourceRepair } from '../games/magic/tools/accuracy/artifact-source-repair-ancestry.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { root } from '../games/magic/tools/accuracy/common.mjs';
import {
  validateFourthSourceReadiness,
  loadFourthBodyReviews,
} from '../games/magic/tools/accuracy/fourth-source-readiness.mjs';
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
data.bodies = await loadFourthBodyReviews(data.bodies);
const result = validateFourthSourceReadiness(data);
assert.deepEqual(result.summary, {
  typeReady: 378,
  rulesScanReviewed: 33,
  rulesProviderOrOtherReview: 345,
  eagerExact: 378,
  lazyExact: 378,
  changedInputs: 0,
});
const same = data.bodies.cards.find((r) => r.name === 'Armageddon');
assert.equal(
  same.rulesText,
  data.publicInputs.rows.find((r) => r.id === same.id).providerOracle.rulesText,
);
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
  ready += rules.readyPrintings;
  partial += rules.partialPrintings;
  const bad = structuredClone(rules);
  bad.coveredPrintings++;
  assert.equal(await fourthSourceInputCurrent(bad, group, 'rules', set, cache), false);
  const incorrectPartition = structuredClone(rules);
  incorrectPartition.readyPrintings++;
  incorrectPartition.partialPrintings--;
  assert.equal(
    await fourthSourceInputCurrent(incorrectPartition, group, 'rules', set, cache),
    false,
  );
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
assert.equal(ready, 33);
assert.equal(partial, 345);
const { calibrationReport } = await import('../games/magic/tools/accuracy/calibration-report.mjs');
const [report] = await calibrationReport({ ...ledger, sets: [set] });
assert.deepEqual(report.originalRulesInputs, { ready: 33, partial: 345, stale: 0, unrecorded: 0 });
assert.deepEqual(report.originalTypeInputs, { ready: 378, partial: 0, stale: 0, unrecorded: 0 });

for (const mutate of [
  (d) => {
    const r = d.bodies.cards.find((r) => r.name === 'Wall of Ice');
    r.flavorParagraphs[0] += String.fromCharCode(10) + r.flavorParagraphs.splice(1, 1)[0];
  },
  (d) => {
    const r = d.bodies.cards.find((r) => r.name === 'Wall of Brambles');
    r.flavorText = r.flavorText.replace('Aiken', 'Wrong name');
  },

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
    d.bodies.cards.shift();
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
  'Fourth Original readiness:378 reviewed type inputs,33 scan-read bodies,345 explicit partial bodies;foreign scans,Oracle substitution,missing/duplicate members,changed source and unjustified promotion reject. Parent calibrations remain open.',
);

// Exact reporting history preserves old assertions without accepting foreign code.
const { preFourthSourceReport } = await import(
  '../games/magic/tools/accuracy/fourth-source-report-ancestry.mjs'
);
const reportFile = 'games/magic/tools/accuracy/calibration-report.mjs';
const reportBytes = await fs.readFile(root + '/' + reportFile);
const before = gunzipSync(
  await fs.readFile(root + '/games/magic/fixtures/accuracy/4ed/pre-source-readiness-report.mjs.gz'),
);
assert.deepEqual(
  await preFourthSourceReport(reportFile, await preArtifactSourceRepair(reportFile, reportBytes)),
  before,
);
assert.deepEqual(await preFourthSourceReport(reportFile, before), before);
const foreignReport = Buffer.concat([reportBytes, Buffer.from('\n// unreviewed code\n')]);
assert.deepEqual(await preFourthSourceReport(reportFile, foreignReport), foreignReport);
assert.deepEqual(await preArtifactSourceRepair(reportFile, foreignReport), foreignReport);
assert.deepEqual(await preFourthSourceReport('other-file.mjs', reportBytes), reportBytes);

const index = await read(fourthSourceFiles.bodies);
for (const mutate of [
  (v) => v.reviews.push(v.reviews[0]),
  (v) => {
    v.reviews[0].sha256 = '0'.repeat(64);
  },
  (v) => {
    v.reviews[0].file = 'games/magic/fixtures/accuracy/4ed/../foreign.json';
  },
]) {
  const bad = structuredClone(index);
  mutate(bad);
  await assert.rejects(() => loadFourthBodyReviews(bad));
}
