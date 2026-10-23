import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  compileComponentCensus,
  summarizeComponents,
} from '../games/magic/tools/accuracy/modern-component-census.mjs';
const fixture = 'games/magic/fixtures/accuracy/m21/current-component-census.json';
const summary = JSON.parse(await readFile(fixture));
const compressed = await readFile('games/magic/fixtures/accuracy/m21/' + summary.evidence.file);
assert.equal(hash(compressed), summary.evidence.sha256);
const raw = gunzipSync(compressed);
assert.equal(hash(raw), summary.evidence.contentSha256);
const census = JSON.parse(raw);
assert.match(census.definition.rendererHash, /^[a-f0-9]{64}$/);
assert.equal(
  census.definition.toolHash,
  hash(await readFile('games/magic/tools/accuracy/modern-component-census.mjs')),
);
assert.equal(census.rows.length, 297);
assert.equal(census.summary.nonfoil, 292);
assert.equal(census.summary.foilOnly, 5);
assert.equal(census.groups.length, 85);
assert.deepEqual(summarizeComponents(census.rows), census.summary);
assert.deepEqual(summary.groups, census.groups);
const ledger = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/calibration-progress.json'),
);
const groups = ledger.sets.find((set) => set.set === 'm21').groups;
assert.equal(
  census.definition.inventoryScopeHash,
  hash(JSON.stringify(groups.map((group) => [group.key, group.scopeHash]))),
);
for (const group of groups) {
  const rows = census.rows.filter((row) => group.printingIds.includes(row.id));
  const item = census.groups.find((item) => item.key === group.key);
  assert.equal(item.printings, group.printings);
  assert.deepEqual(
    {
      ...item,
      key: undefined,
      scopeHash: undefined,
      sourceHash: undefined,
      palette: undefined,
      kind: undefined,
    },
    {
      ...summarizeComponents(rows),
      key: undefined,
      scopeHash: undefined,
      sourceHash: undefined,
      palette: undefined,
      kind: undefined,
    },
  );
}
assert.equal(census.summary.components.credits.measuredNonfoil, 0);
assert(census.summary.components.credits.diagnosticMean100 > 0);
assert.equal(census.summary.components.credits.statuses['content-review'], 292);
assert.equal(census.summary.components.mana.measuredNonfoil, 259);

// Failed ink matches must count as zero, rather than disappearing from means.
// Unverified diagnostic text and foil controls must stay out of approval means.
const row = {
  id: 'a',
  name: 'A',
  number: '1',
  nonfoil: true,
  poseAccepted: true,
  structure100: 50,
  coverage: 0.5,
  components: {
    rules: {
      applicable: true,
      eligible: true,
      score100: 0,
      diagnostic100: 0,
      status: 'missing-ink',
    },
    credits: {
      applicable: true,
      eligible: false,
      score100: null,
      diagnostic100: 90,
      status: 'content-review',
    },
  },
};
const synthetic = summarizeComponents([
  row,
  { ...row, id: 'b', nonfoil: false, structure100: 100 },
]);
assert.equal(synthetic.components.rules.mean100, 0);
assert.equal(synthetic.components.rules.measuredNonfoil, 1);
assert.equal(synthetic.components.rules.foilOnlyControls, 1);
assert.equal(synthetic.components.credits.mean100, null);
assert.equal(synthetic.wholeCard.mean100, 75);
assert.equal(synthetic.wholeCard.nonfoilMean100, 50);

// Exercise cross-file provenance failures without private scans or native PNGs.
const pose = { matrix: [1, 0, 0, 1, 0, 0] },
  digest = 'a'.repeat(64);
const inputFace = { wordingMode: 'original' };
const entries = Array.from({ length: 297 }, (_, i) => ({
  id: String(i),
  face: inputFace,
  reference: { sha256: digest },
  card: { name: 'Card ' + i, collector_number: String(i), finishes: ['nonfoil'] },
}));
const rows = entries.map((entry) => ({
  id: entry.id,
  inputHash: hash(JSON.stringify(inputFace)),
  referenceHash: digest,
  layers: { face: { sha256: digest }, etching: { sha256: digest } },
}));
const poses = entries.map((entry) => ({
  id: entry.id,
  referenceHash: digest,
  transform: pose,
  accepted: true,
}));
const measurements = entries.map((entry) => ({
  id: entry.id,
  inputHash: hash(JSON.stringify(inputFace)),
  referenceHash: digest,
  renderHash: digest,
  poseHash: hash(JSON.stringify(pose)),
  poseAccepted: true,
  nonfoilEligible: true,
  metric: { structuralScore: 0.8, coverage: 1, components: {} },
}));
const args = {
  inputs: { set: 'm21', entries },
  native: { completed: 297, denominator: 297, faults: [], rows },
  normalization: { rows: poses },
  scores: { rows: measurements },
  groups: [{ key: 'one', printingIds: entries.map((entry) => entry.id) }],
};
assert.equal(compileComponentCensus(args).rows.length, 297);
for (const change of [
  (value) => {
    value.inputs.entries[0].face.wordingMode = 'oracle';
  },
  (value) => {
    value.native.rows[0].layers.face.sha256 = 'b'.repeat(64);
  },
  (value) => {
    value.normalization.rows[0].transform.matrix[4] = 1;
  },
  (value) => {
    value.scores.rows[0].inputHash = 'b'.repeat(64);
  },
  (value) => {
    value.scores.rows[0].metric.structuralScore = NaN;
  },
  (value) => {
    value.scores.rows[0].metric.structuralScore = 1.1;
  },
  (value) => {
    value.scores.rows[0].nonfoilEligible = false;
  },
  (value) => {
    value.groups[0].printingIds.pop();
  },
  (value) => {
    value.native.rows[1].id = value.native.rows[0].id;
  },
]) {
  const changed = structuredClone(args);
  change(changed);
  assert.throws(() => compileComponentCensus(changed));
}
console.log(
  'Current M21 census: 297 Original members/85 physical variants; exact source/pose/native bindings, nonfoil means, rejected-region coverage and unverified-credit diagnostics pass.',
);
