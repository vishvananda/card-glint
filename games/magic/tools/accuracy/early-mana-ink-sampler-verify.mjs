// Audit the failed fixed-probe run without assuming sampler equivalence.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { hash, writeJson } from './common.mjs';
const [fixedDirectory, opaqueDirectory, output] = process.argv.slice(2);
assert(output, 'Usage: early-mana-ink-sampler-verify.mjs FIXED_INCOMPLETE OPAQUE_COMPLETE OUT');
const raw = await Promise.all(
  [fixedDirectory, opaqueDirectory].map((d) => readFile(path.join(d, 'capture.json'))),
);
const [fixed, opaque] = raw.map((b) => JSON.parse(b));
assert(fixed.completed < fixed.total);
assert.equal(opaque.completed, opaque.total);
for (const key of [
  'rendererHash',
  'nativeCaptureHash',
  'nativeInputsHash',
  'auditHash',
  'baselineHash',
])
  assert.equal(fixed.source[key], opaque.source[key]);
assert.deepEqual(fixed.candidates, opaque.candidates);
const rows = [];
for (const r of fixed.rows) {
  assert(['B', 'R'].includes(r.symbol));
  const other = opaque.rows.find((a) => a.id === r.id);
  assert(other);
  for (const t of r.trials) {
    const nt = other.trials.find((a) => a.id === t.id);
    assert(nt);
    for (const [directory, trial] of [
      [fixedDirectory, t],
      [opaqueDirectory, nt],
    ])
      assert.equal(hash(await readFile(path.join(directory, trial.file))), trial.faceHash);
    const equal = t.faceHash === nt.faceHash;
    assert.equal(equal, r.symbol === 'B' || t.amount < 0.4);
    rows.push({
      id: r.id,
      name: r.name,
      symbol: r.symbol,
      candidate: t.id,
      faceHashes: [t.faceHash, nt.faceHash],
      equal,
    });
  }
}
assert.equal(rows.length, 80);
await writeJson(output, {
  schema: 1,
  status: 'native-fixed-vs-opaque-paper-sampler-audit',
  sources: { fixedProbeIncompleteCapture: hash(raw[0]), opaqueSamplerCapture: hash(raw[1]) },
  toolHash: hash(await readFile(new URL(import.meta.url))),
  scope:
    'Eighty completed B/R native trials from the initial fixed-paper-probe study are compared against the existing opaque-percentile sampler. B is byte-identical throughout; R is identical at 0 and 0.2 but differs at 0.4 and 0.6 because expanded ink reaches the fixed paper probe. The selected R 0.4 MUST include opaque-percentile sampling in runtime integration. The first green candidate failed with Mana asset has no separable glyph; green expansion is rejected by the completed fit. No false equivalence claim and no final runtime integration.',
  firstRun: {
    completed: fixed.completed,
    total: fixed.total,
    failure: 'Mana asset has no separable glyph',
    nextSymbol: 'G',
  },
  rows,
});
console.log('Verified eighty native pairs: sixty identical, twenty different.');
