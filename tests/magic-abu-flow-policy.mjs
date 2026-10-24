import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
const b = await readFile(
  'games/magic/fixtures/accuracy/early-through-fourth/abu-flow-policy-trials.json.gz',
);
const r = JSON.parse(gunzipSync(b));
assert.equal(r.status, 'native-shared-flow-policy-study-not-adopted');
assert.equal(
  r.source.rendererHash,
  '6c1c2b27b63242240938efa217131f5073c183ab9965f4749a9136f096742010',
);
assert.equal(r.rows.length, 595);
assert.equal(new Set(r.rows.map((r) => r.id)).size, 85);
assert.equal(r.captures.length, 2);
assert.deepEqual(
  r.captures.map((c) => c.capture.total).sort((a, b) => a - b),
  [6, 79],
);
for (const m of r.methods) assert.equal(hash(m.text), m.sha256);
for (const c of r.captures) {
  assert.equal(hash(JSON.stringify(c.capture, null, 2) + '\n'), c.hash);
  assert(c.capture.source.closed);
  assert.deepEqual(c.capture.faults, []);
  for (const key of ['toolHash', 'pluginHash'])
    assert(r.methods.some((m) => m.sha256 === c.capture.source[key]));
}
for (const id of new Set(r.rows.map((r) => r.id))) {
  const rows = r.rows.filter((r) => r.id === id),
    base = rows.find((r) => r.trial === 'current'),
    control = rows.find((r) => r.trial === 'control');
  assert.equal(rows.length, 7);
  assert.equal(control.nativeFaceHash, base.nativeFaceHash);
  assert.deepEqual(control.score, base.score);
  for (const row of rows) {
    assert.equal(row.inputHash, base.inputHash);
    assert.equal(row.referenceHash, base.referenceHash);
    assert.equal(row.poseHash, base.poseHash);
    assert.equal(row.outside, 0);
    assert.equal(row.alpha, 0);
    assert(Number.isFinite(row.delta100));
  }
}
const bad = r.rows.filter((r) => r.trial === 'small-seven' && r.delta100 < -0.5);
assert.equal(bad.length, 1);
assert.equal(bad[0].name, 'Simulacrum');
assert.equal(bad[0].set, '2ed');
assert(bad[0].delta100 < -35);
const words = r.rows.filter(
  (r) =>
    r.trial === 'small-seven' && r.name === 'Word of Command' && ['lea', 'leb'].includes(r.set),
);
assert.equal(words.length, 2);
assert(words.every((r) => r.delta100 > 35 && r.layout.lines.length === 7));
const noY = r.rows.filter((r) => r.trial === 'centered-y-zero' && r.changed > 0);
assert.equal(noY.length, 3);
assert(noY.find((r) => r.name === 'Twiddle').delta100 < -9);
assert(noY.filter((r) => r.name === 'Howl from Beyond').every((r) => r.delta100 > 12));
const keyword = r.rows.filter((r) => r.trial === 'keyword-large' && r.changed > 0);
assert.equal(keyword.length, 1);
assert.equal(keyword[0].name, 'Birds of Paradise');
assert.equal(keyword[0].set, '2ed');
assert.equal(keyword[0].layout.size, 32.5);
assert.equal(r.summary.combined.all.regressions, 4);
console.log(
  'Flow study retains595 actual native faces,85 printing identities, exact controls and unsafe-layout flags; Simulacrum/Twiddle regressions prevent naive blanket adoption.',
);

const refined = JSON.parse(
  gunzipSync(
    await readFile(
      'games/magic/fixtures/accuracy/early-through-fourth/abu-refined-flow-trials.json.gz',
    ),
  ),
);
assert.equal(refined.status, 'native-shared-flow-policy-study-not-adopted');
assert.equal(refined.source.rendererHash, r.source.rendererHash);
assert.equal(refined.rows.length, 680);
assert.equal(new Set(refined.rows.map((r) => r.id)).size, 85);
for (const m of refined.methods) assert.equal(hash(m.text), m.sha256);
for (const c of refined.captures) {
  assert(c.capture.source.closed);
  assert.deepEqual(c.capture.faults, []);
  assert.equal(hash(JSON.stringify(c.capture, null, 2) + '\n'), c.hash);
  for (const key of ['toolHash', 'pluginHash'])
    assert(refined.methods.some((m) => m.sha256 === c.capture.source[key]));
}
for (const id of new Set(refined.rows.map((r) => r.id))) {
  const related = refined.rows.filter((r) => r.id === id),
    base = related.find((r) => r.trial === 'current'),
    old = r.rows.find((r) => r.id === id && r.trial === 'current');
  assert.equal(related.length, 8);
  assert.equal(base.nativeFaceHash, old.nativeFaceHash);
  assert.deepEqual(base.score, old.score);
  for (const row of related) {
    assert.equal(row.outside, 0);
    assert.equal(row.alpha, 0);
    assert.equal(row.referenceHash, old.referenceHash);
    assert.equal(row.inputHash, old.inputHash);
    assert.equal(row.poseHash, old.poseHash);
  }
  const c = related.find((r) => r.trial === 'combined');
  assert(c.delta100 >= 0);
  assert(!c.addedUnsafe);
  if (c.name === 'Simulacrum') assert.equal(c.layout.lines.length, base.layout.lines.length);
  if (
    (c.name === 'Twiddle' && c.set === 'lea') ||
    (c.name === 'Birds of Paradise' && c.set === 'leb')
  )
    assert.equal(c.nativeFaceHash, base.nativeFaceHash);
}
assert.equal(refined.summary.combined.all.gains, 29);
assert.equal(refined.summary.combined.all.regressions, 0);
assert.equal(refined.summary.combined.all.changed, 30);
assert.equal(refined.summary.combined.all.addedRows, 3);
const birds = refined.rows.find(
  (r) => r.set === '2ed' && r.name === 'Birds of Paradise' && r.trial === 'combined',
);
assert.equal(birds.layout.size, 32.5);
assert.equal(birds.layout.x, 80);
assert.equal(birds.layout.top, 420.672);
assert(birds.delta100 > 8);
console.log(
  'Refined flow:680 actual faces, same85 frozen identities,29 gains/no regressions; normal-width precision preserves six-line Simulacrum, reviewed Word passage allows seven rows, Howl moves without disturbing Twiddle, and keyword geometry reproduces Beta while fixing Unlimited.',
);

const stasis = JSON.parse(
  await readFile(
    'games/magic/fixtures/accuracy/early-through-fourth/abu-stasis-source-review.json',
  ),
);
assert.equal(stasis.cards.length, 3);
assert.deepEqual(stasis.cards.map((r) => r.set).sort(), ['2ed', 'lea', 'leb']);
assert.deepEqual(stasis.reviewedFields, ['rulesText']);
for (const row of stasis.cards) {
  assert.equal(row.name, 'Stasis');
  assert.equal(row.proposed, row.before.replace('during your upkeep', 'during upkeep'));
  assert.notEqual(row.proposed, row.before);
  assert(row.proposed.includes('Pay {U} during upkeep'));
  const before = refined.rows.find((r) => r.id === row.id && r.trial === 'current');
  assert(before);
  assert.equal(before.inputHash, row.beforeInputHash);
  assert.equal(before.referenceHash, row.referenceHash);
}
console.log(
  'Stasis:three independently read scan identities support removing the extra cached word; no Oracle or symbol substitution is proposed.',
);
