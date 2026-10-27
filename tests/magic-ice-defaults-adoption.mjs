import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash, sourceHash } from '../games/magic/tools/accuracy/common.mjs';
import {
  iceDefaultsDelta,
  iceDefaultsHistoricalHash,
  preIceDefaultsSource,
} from '../games/magic/tools/accuracy/ice-defaults-ancestry.mjs';
import { fourthDetailsDelta } from '../games/magic/tools/accuracy/fourth-details-ancestry.mjs';
const delta = await iceDefaultsDelta();
assert.equal(await sourceHash('games/magic/src'), delta.afterRenderer);
assert.equal(await iceDefaultsHistoricalHash(), delta.beforeRenderer);
for (const [file, r] of Object.entries(delta.files)) {
  const b = await fs.readFile(file);
  assert.equal(hash(b), r.after);
  assert.equal(hash(await preIceDefaultsSource(file, b)), r.before);
  const unknown = Buffer.concat([b, Buffer.from('\n// unknown source edit\n')]);
  assert.deepEqual(await preIceDefaultsSource(file, unknown), unknown);
}
const read = async (ref) => {
  const bytes = await fs.readFile(ref.file);
  assert.equal(hash(bytes), ref.sha256);
  const raw = gunzipSync(bytes);
  assert.equal(hash(raw), ref.contentSha256);
  assert(!/\/home\/|\/Users\/|127\.0\.0\.1/.test(raw.toString()));
  return raw;
};
const adoption = JSON.parse(
  await fs.readFile('games/magic/fixtures/accuracy/old-frame-defaults/ice-inheritance.json'),
);
assert.equal(adoption.status, 'integrated-inherited-starting-point-audit-open');
const raw = Object.fromEntries(
  await Promise.all(Object.entries(adoption.artifacts).map(async ([k, v]) => [k, await read(v)])),
);
const review = JSON.parse(raw.review),
  capture = JSON.parse(raw.capture),
  inputs = JSON.parse(raw.inputs);
assert.equal(review.rendererHash, delta.afterRenderer);
assert.equal(capture.rendererHash, delta.afterRenderer);
assert.equal(capture.status, 'complete');
assert.deepEqual(capture.faults, []);
assert.equal(review.inputsHash, hash(raw.inputs));
assert.equal(review.captureHash, hash(raw.capture));
assert.equal(review.toolHash, hash(raw.tool));
assert.equal(
  review.toolHash,
  hash(await fs.readFile('games/magic/tools/accuracy/ice-defaults-native-review.mjs')),
);
assert.deepEqual(review.summary, adoption.summary);
assert.equal(capture.rows.length, 488);
assert.equal(inputs.entries.length, 488);
assert.equal(new Set(review.rows.map((r) => r.id)).size, 488);
const detail = await fourthDetailsDelta(),
  signedFourth = JSON.parse(await read(detail.native));
assert.equal(signedFourth.afterRenderer, delta.beforeRenderer);
assert.equal(review.previousFourthHash, signedFourth.source.afterCapture);
const pilot = JSON.parse(
  await fs.readFile('games/magic/fixtures/accuracy/old-frame-defaults/review.json'),
);
let variants = 0;
for (const row of review.rows) {
  const e = inputs.entries.find((e) => e.id === row.id),
    n = capture.rows.find((n) => n.id === row.id);
  assert.equal(row.referenceHash, e.reference.sha256);
  assert.equal(row.inputHash, hash(JSON.stringify(e.face)));
  assert.equal(n.referenceHash, e.reference.sha256);
  for (const [mode, m] of Object.entries(row.modes)) {
    variants++;
    assert.equal(m.after, n.modes[mode].sha256);
    assert.equal(m.afterKey, n.modes[mode].keyHash);
    if (row.set !== 'ice') {
      assert.equal(m.before, m.after);
      assert.equal(m.beforeKey, m.afterKey);
    }
    if (row.set === '4ed') {
      const old = signedFourth.rows.find((r) => r.id === row.id).modes[mode];
      assert.equal(old.after, m.before);
      assert.equal(old.afterKey, m.beforeKey);
    }
  }
}
assert.equal(variants, 1622);
const ranked = review.rows.filter((r) => r.set === 'ice' && r.ranked);
assert.equal(ranked.length, 17);
const mean = (k) => (100 * ranked.reduce((s, r) => s + r[k].structuralScore, 0)) / ranked.length;
assert.equal(mean('before'), review.summary.before100);
assert.equal(mean('after'), review.summary.after100);
assert.equal(review.summary.gains, 16);
assert.equal(review.summary.losses, 1);
const ice = pilot.sets.find((s) => s.set === 'ice');
assert(Math.abs(mean('before') - ice.summary.current.whole100) < 1e-12);
assert(Math.abs(mean('after') - ice.summary['fourth-frame-layout'].whole100) < 1e-12);
assert(adoption.limits.some((s) => s.includes('does not score that legal line')));
console.log(
  'Ice inheritance:488 native cards/1952 modes,1622 exact prior joins,459 unaffected Originals,strict source reconstruction,17 accepted frozen-pose score comparisons and explicit open-audit limits pass.',
);
