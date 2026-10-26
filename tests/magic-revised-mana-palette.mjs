import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { delta } from '../games/magic/tools/accuracy/hsb-color.mjs';
import { revisedBlackPaperDelta } from '../games/magic/tools/accuracy/revised-black-paper-ancestry.mjs';
const base = 'games/magic/fixtures/accuracy/3ed-recheck/',
  p = JSON.parse(await readFile(base + 'mana-palette-forward-receipt.json'));
const load = async (ref) => {
  const z = await readFile(base + ref.file);
  assert.equal(hash(z), ref.sha256);
  const b = gunzipSync(z);
  assert.equal(hash(b), ref.contentSha256);
  return JSON.parse(b);
};
assert.equal(p.status, 'reviewed-forward-palette-study-not-adopted');
assert.equal(p.rendererHash, (await revisedBlackPaperDelta()).afterRenderer);
for (const [file, h] of Object.entries(p.modules))
  assert.equal(hash(await readFile('games/magic/tools/accuracy/' + file)), h);
const study = await load(p.artifacts.study),
  definition = await load(p.artifacts.definition),
  capture = await load(p.artifacts.native),
  rings = JSON.parse(gunzipSync(await readFile(base + 'mana-ring-checked.json.gz'))),
  inputs = JSON.parse(gunzipSync(await readFile(base + 'mana-reviewed-inputs.json.gz')));
assert.equal(study.status, 'forward-native-palette-study-not-adopted');
assert.equal(
  study.toolHash,
  hash(await readFile('games/magic/tools/accuracy/revised-mana-palette-study.mjs')),
);
assert.equal(study.rendererHash, p.rendererHash);
assert.equal(capture.rendererHash, p.rendererHash);
assert.equal(capture.status, 'complete');
assert.deepEqual(capture.faults, []);
assert.deepEqual(study.faults, []);
assert.deepEqual(study.definition, definition);
assert.equal(study.sources['capture.json'], p.artifacts.native.contentSha256);
assert.equal(capture.rows.length, 306);
assert.equal(study.rows.length, 60);
assert.equal(new Set(study.rows.map((r) => r.id)).size, 60);
for (const r of rings.rows)
  for (const d of r.discs)
    if (d.accepted) assert.equal(d.circles.scan.polarity, d.circles.render.polarity);
const expected = new Set();
for (const symbol of ['W', 'U', 'B', 'R', 'G', 'N'])
  for (const [cohort, limit] of [
    ['calibration', 6],
    ['validation', 4],
  ]) {
    const eligible = rings.rows
      .filter(
        (r) =>
          r.cohort === cohort &&
          r.discs.some(
            (d) => d.accepted && (symbol === 'N' ? /^\d+$/.test(d.symbol) : d.symbol === symbol),
          ),
      )
      .sort((a, b) => hash(symbol + '/' + a.id).localeCompare(hash(symbol + '/' + b.id)));
    for (const r of eligible.slice(0, limit)) expected.add(r.id);
  }
assert.deepEqual(study.rows.map((r) => r.id).sort(), [...expected].sort());
for (const r of study.rows) {
  const n = capture.rows.find((n) => n.id === r.id),
    e = inputs.entries.find((e) => e.id === r.id),
    ring = rings.rows.find((t) => t.id === r.id);
  assert.equal(r.nativeHash, n.modes.original.sha256);
  assert.equal(r.referenceHash, e.reference.sha256);
  assert.equal(r.referenceHash, ring.referenceHash);
  assert.equal(r.poseHash, ring.poseHash);
  assert.equal(r.cohort, ring.cohort);
  assert.equal(n.modes.original.inputHash, hash(JSON.stringify(e.face)));
  for (const d of r.discs) {
    assert(d.counts.paper >= 8 && d.counts.ink >= 8);
    assert.deepEqual(
      d.trials.map((t) => t.name),
      definition.candidates.map((t) => t.name),
    );
    for (const t of d.trials) {
      for (const role of ['paper', 'ink']) {
        const error = delta(
          d.reference[role].map((v) => v / 255),
          t.colors[role].map((v) => v / 255),
        );
        assert.equal(t.error[role], error);
      }
      assert.equal(t.balanced, (t.error.paper + t.error.ink) / 2);
    }
  }
}
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
for (const [key, group] of Object.entries(study.groups)) {
  const [symbol, cohort] = key.split('/'),
    ds = study.rows
      .filter((r) => cohort === 'all' || r.cohort === cohort)
      .flatMap((r) => r.discs)
      .filter((d) => symbol === 'all' || d.symbol === symbol);
  for (const c of group) {
    const a = ds.map((d) => d.trials.find((t) => t.name === c.name));
    assert.equal(c.discs, a.length);
    for (const role of ['paper', 'ink']) assert.equal(c[role], mean(a.map((t) => t.error[role])));
    assert.equal(c.balanced, mean(a.map((t) => t.balanced)));
  }
  const before = group.find((t) => t.name === 'current'),
    after = group.find((t) => t.name === 'ink-40');
  assert(after.ink < before.ink, key + ' ink');
  assert(after.balanced < before.balanced, key + ' balanced color');
}
assert(
  study.groups['all/validation'].find((t) => t.name === 'ink-32').balanced <
    study.groups['all/validation'].find((t) => t.name === 'ink-40').balanced,
  'Keep the development-cohort tradeoff visible.',
);
console.log(
  'Revised palette: deterministic 60-card selection, 88 separate paper/ink checks, exact native baseline identities, recomputed color errors, and retained cohort tradeoff pass. No default adopted.',
);
