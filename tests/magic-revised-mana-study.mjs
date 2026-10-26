import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
const base = 'games/magic/fixtures/accuracy/3ed-recheck/';
async function load(name) {
  const bytes = gunzipSync(await readFile(base + name + '.json.gz'));
  return { bytes, value: JSON.parse(bytes) };
}
const input = await load('corrected-original-inputs'),
  poses = await load('vertical-interior-normalization'),
  native = await load('footer-final-native'),
  old = await load('mana-ring-positive-control'),
  rings = await load('mana-ring-checked'),
  audit = await load('mana-glyph-audit'),
  fit = await load('mana-glyph-fit'),
  p = rings.value,
  a = audit.value,
  f = fit.value;
assert.equal(p.status, 'diagnostic-circles-not-adopted');
assert.equal(a.status, 'glyph-shape-diagnostic-not-adopted');
assert.equal(f.status, 'glyph-mask-proposals-need-native-validation');
assert.equal(p.rendererHash, native.value.rendererHash);
assert.equal(a.rendererHash, p.rendererHash);
assert.equal(f.rendererHash, p.rendererHash);
for (const d of [p, a, f]) {
  assert.equal(d.sources.inputs, hash(input.bytes));
  assert.equal(d.sources.poses, hash(poses.bytes));
  assert.equal(d.sources.capture, hash(native.bytes));
}
assert.equal(a.sources.rings, hash(rings.bytes));
assert.equal(f.sources.rings, hash(rings.bytes));
assert.equal(f.sources.audit, hash(audit.bytes));
for (const [d, name] of [
  [p, 'revised-mana-ring-study.mjs'],
  [a, 'revised-mana-glyph-audit.mjs'],
  [f, 'revised-mana-glyph-fit.mjs'],
]) {
  assert.equal(d.sources.toolHash, hash(await readFile('games/magic/tools/accuracy/' + name)));
  for (const [name, expected] of Object.entries(d.sources.modules))
    assert.equal(hash(await readFile('games/magic/tools/accuracy/' + name)), expected);
}
assert.deepEqual(p.summary, {
  nonlands: 281,
  acceptedFrames: 223,
  excludedFrames: 58,
  circles: 413,
  acceptedCircles: 360,
});
const byPose = new Map(
  Object.entries(poses.value.groups).flatMap(([material, g]) =>
    g.rows.map((r) => [r.id, { ...r, material }]),
  ),
);
let defaultControls = 0,
  circles = 0,
  accepted = 0;
for (const r of p.rows) {
  const e = input.value.entries.find((e) => e.id === r.id),
    pose = byPose.get(r.id),
    n = native.value.rows.find((n) => n.id === r.id),
    before = old.value.rows.find((x) => x.id === r.id);
  assert(pose.accepted);
  assert.equal(r.material, pose.material);
  assert.equal(r.cohort, pose.cohort);
  assert.equal(r.referenceHash, e.reference.sha256);
  assert.equal(r.poseHash, hash(JSON.stringify(pose.transform)));
  assert.equal(r.nativeHash, n.modes.original.sha256);
  assert.equal(e.face.wordingMode, 'original');
  assert.equal(e.face.symbolStyle, 'original');
  assert(!e.face.symbolAdjustment?.mana);
  assert.equal(r.discs.length, e.face.manaSymbols.length);
  for (const d of r.discs) {
    circles++;
    assert.equal(d.symbol, e.face.manaSymbols[d.index]);
    assert.equal(
      d.circles.scan.polarity,
      d.circles.render.polarity,
      'An inner glyph edge of the opposite polarity cannot replace the physical disc edge',
    );
    for (const side of ['scan', 'render']) {
      const c = d.candidates[side].find((c) => c.polarity === 'light-on-dark'),
        { polarity: _, ...unchanged } = c;
      assert.deepEqual(unchanged, before.discs[d.index].circles[side]);
      defaultControls++;
    }
    const nativeControl =
      d.circles.render.status === 'measured' &&
      Math.hypot(
        d.circles.render.x - (d.anchor.x - 0.5),
        d.circles.render.y - (d.anchor.y - 0.5),
      ) <= 0.5 &&
      Math.abs(d.circles.render.radius - 11.7) <= 0.5;
    assert.equal(d.nativeControlPassed, nativeControl);
    assert.equal(d.accepted, nativeControl && d.circles.scan.status === 'measured');
    if (d.accepted) accepted++;
    const g = a.rows.find((g) => g.id === r.id && g.index === d.index);
    assert.equal(g.ringAccepted, d.accepted);
    if (!d.accepted) {
      assert.equal(g.reason, 'perimeter-rejected');
      continue;
    }
    assert.equal(g.referenceHash, r.referenceHash);
    assert.equal(g.nativeHash, r.nativeHash);
    assert.equal(g.poseHash, r.poseHash);
    assert.equal(g.measurements.length, 3);
    for (const m of g.measurements)
      for (const side of ['scan', 'render']) {
        assert.equal(m[side].status, 'measured');
        assert.match(m[side].maskHash, /^[a-f0-9]{64}$/);
      }
    assert.deepEqual(
      g.paper.map((s) => s.fraction),
      [0.5, 0.6, 0.7],
    );
  }
}
assert.equal(circles, 413);
assert.equal(accepted, 360);
assert.equal(defaultControls, 826);
assert.equal(p.excluded.length, 58);
assert.equal(new Set([...p.rows, ...p.excluded].map((r) => r.id)).size, 281);
for (const r of p.excluded) assert.equal(byPose.get(r.id).accepted, false);
const lowContrast = p.rows.find((r) => r.name === 'Armageddon').discs[0];
assert(!lowContrast.nativeControlPassed, 'A texture/glyph arc cannot validate an invisible circle');
assert.equal(p.groups.rightmost.accepted, 220);
assert.equal(p.groups.rightmost.radiusDifference.median, 0);
for (const cohort of ['calibration', 'validation'])
  assert.equal(p.pitch[cohort].medianDifference, -0.25);
assert.equal(f.rows.length, 244);
assert.deepEqual(f.candidates[0], { id: 'current', scale: 1, dx: 0, dy: 0 });
for (const r of f.rows) {
  const parent = a.rows.find((a) => a.id === r.id && a.index === r.index);
  assert(parent.accepted);
  const scores = parent.measurements.map((m) => m.comparison.score).sort((a, b) => a - b);
  assert(Math.abs(r.scores[0] - scores[1] * 100) < 1e-10);
  assert.equal(r.scores.length, f.candidates.length);
  assert(r.scores.every((s) => Number.isFinite(s) && s >= 0 && s <= 100));
}
for (const symbol of ['W', 'U', 'B', 'R', 'G']) {
  const g = f.groups[symbol],
    c = f.candidates[g.selected.index];
  assert.equal(g.selected.scale, c.scale);
  assert.equal(g.selected.dx, c.dx);
  assert.equal(g.selected.dy, c.dy);
  assert(g.cohorts.calibration.count >= 10 && g.cohorts.validation.count >= 5);
  assert.equal(g.ranking[0].index, g.selected.index);
}
console.log(
  'Revised mana: 223 frozen frame poses,413 discs,826 unchanged default controls,360 checked glyphs,and244 colored-glyph proposals retain exact sources and explicit exclusions.',
);

const candidateInputs = await load('mana-glyph-prototype-inputs'),
  prototype = await load('mana-glyph-prototype-native'),
  review = await load('mana-glyph-native-review'),
  n = review.value;
assert.equal(n.status, 'native-glyph-prototype-reviewed');
assert.equal(n.rendererHash, p.rendererHash);
assert.equal(
  n.toolHash,
  hash(await readFile('games/magic/tools/accuracy/revised-mana-native-review.mjs')),
);
for (const [file, expected] of Object.entries(n.modules))
  assert.equal(hash(await readFile('games/magic/tools/accuracy/' + file)), expected);
assert.deepEqual(
  n.sources,
  Object.fromEntries(
    [
      ['inputs', input],
      ['poses', poses],
      ['before', native],
      ['after', prototype],
      ['rings', rings],
      ['audit', audit],
      ['fit', fit],
      ['candidateInputs', candidateInputs],
    ].map(([key, value]) => [key, hash(value.bytes)]),
  ),
);
assert.equal(prototype.value.inputHash, hash(candidateInputs.bytes));
assert.deepEqual(prototype.value.faults, []);
assert.deepEqual(n.summary, { cards: 223, changed: 190, unchanged: 33, outside: 0, alpha: 0 });
for (const r of n.rows) {
  const b = native.value.rows.find((b) => b.id === r.id),
    c = prototype.value.rows.find((c) => c.id === r.id);
  assert.equal(r.before, b.modes.original.sha256);
  assert.equal(r.after, c.modes.original.sha256);
  assert.equal(r.referenceHash, b.referenceHash);
  assert.equal(r.referenceHash, c.referenceHash);
  assert.equal(b.artHash, c.artHash);
  assert.equal(r.outside, 0);
  assert.equal(r.alpha, 0);
  if (r.material === 'A') {
    assert.equal(r.before, r.after);
    assert.equal(b.modes.original.keyHash, c.modes.original.keyHash);
  }
  assert(
    Object.keys(r.symbols).every((s) => /^[WUBRG]$/.test(s)),
    'Colored-glyph controls changed a generic numeral',
  );
}
assert.equal(n.comparisons.length, 360);
for (const r of n.comparisons) {
  assert(r.accepted);
  const b = a.rows.find((b) => b.id === r.id && b.index === r.index);
  const before = b.measurements.map((m) => m.comparison.score).sort((a, b) => a - b)[1] * 100;
  assert.equal(r.before, before);
  assert.equal(r.measures.length, 3);
  for (let i = 0; i < 3; i++) {
    assert.equal(r.measures[i].referenceMask, b.measurements[i].scan.maskHash);
    assert.equal(r.measures[i].baselineMask, b.measurements[i].render.maskHash);
  }
  if (!/^[WUBRG]$/.test(r.symbol)) {
    assert.equal(r.before, r.after);
    assert(r.measures.every((m) => m.baselineMask === m.candidateMask));
  }
}
for (const symbol of ['U', 'B', 'R', 'G'])
  for (const cohort of ['calibration', 'validation']) {
    const g = n.groups[symbol + '/' + cohort];
    assert(g.after > g.before);
  }
// The approximate mask proposal improves White, but the actual native replay
// regresses it. Keep this negative result so a proxy score cannot promote it.
assert(f.groups.W.cohorts.all.after > f.groups.W.cohorts.all.before);
for (const cohort of ['all', 'calibration', 'validation']) {
  const g = n.groups['W/' + cohort];
  assert(g.after < g.before);
}
assert(n.groups['G/all'].after - n.groups['G/all'].before > 20);
assert.equal(n.groups['N/all'].before, n.groups['N/all'].after);
console.log(
  'Actual native glyph controls improve U/B/R/G,leave116 numerals and33 artifact controls exact,and expose the proxy-only White regression.',
);
