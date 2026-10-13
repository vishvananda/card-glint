import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { readJson, writeJson, fixtureRoot, outputRoot, hash } from './common.mjs';
const base = `${outputRoot}/ice-symbol-oracle`,
  plan = await readJson(`${fixtureRoot}/ice-symbol-oracle-plan.json`),
  before = await readJson(`${base}/before/capture.json`),
  controls = await readJson(`${base}/controls/capture.json`);
assert.equal(before.planHash, hash(JSON.stringify(plan)));
assert.equal(controls.planHash, before.planHash);
assert.equal(before.rendererHash, plan.baselineRendererHash);
assert.equal(before.rows.length, 389);
assert.equal(controls.rows.length, 6);
for (const [stage, capture] of [
  ['before', before],
  ['controls', controls],
])
  for (const r of capture.rows) {
    assert.equal(r.failure, undefined);
    assert.equal(r.face.wordingMode, 'oracle');
    assert.equal(r.face.symbolStyle, 'original');
    assert.equal(hash(JSON.stringify(r.face)), r.inputHash);
    for (const tier of ['inspect', 'table'])
      assert.equal(
        hash(await readFile(`${base}/${stage}/${r.images[tier].file}`)),
        r.images[tier].sha256,
      );
  }
const changedControls = [];
for (const r of controls.rows) {
  const b = before.rows.find((x) => x.id === r.id);
  assert.deepEqual(r.face, b.face);
  const changed = Object.keys(r.images).some((t) => r.images[t].sha256 !== b.images[t].sha256);
  if (changed) {
    assert.equal(r.set, 'exo');
    changedControls.push({
      id: r.id,
      name: r.name,
      set: r.set,
      reason: 'Intervening independently committed Exodus measurement correction (v73).',
    });
  }
}
assert.equal(changedControls.length, 1);
await writeJson(`${fixtureRoot}/ice-symbol-oracle-baseline.json`, {
  schemaVersion: 1,
  scope:
    'Complete explicit Oracle baseline with original symbols, separate from the legacy study. All 383 ordinary printings and six controls render at both tiers without overflow. Frozen v71 baseline is retained. Capture six controls again at v73 before any Ice Age renderer change: only the independently corrected Exodus control changes; all other controls remain byte-identical.',
  rendererHash: before.rendererHash,
  controlRendererHash: controls.rendererHash,
  planHash: before.planHash,
  captureHash: hash(JSON.stringify(before)),
  controlCaptureHash: hash(JSON.stringify(controls)),
  methodHash: hash(await readFile(new URL(import.meta.url))),
  ordinary: 383,
  rendered: 383,
  controls: 6,
  failures: [],
  changedControls,
});
console.log('Verified 389 baseline faces, 6 intervening controls, both tiers; no failures.');
