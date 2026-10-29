import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { preArnSymbolRoleSource } from '../games/magic/tools/accuracy/arn-symbol-role-ancestry.mjs';
const base = 'games/magic/fixtures/accuracy/3ed-recheck/';
async function load(name) {
  const bytes = gunzipSync(await readFile(base + name + '.json.gz'));
  return { bytes, value: JSON.parse(bytes) };
}
const inputs = await load('corrected-original-inputs'),
  poses = await load('vertical-interior-normalization'),
  baseline = await load('footer-final-native'),
  rings = await load('mana-ring-checked'),
  audit = await load('mana-glyph-audit'),
  glyph = await load('mana-glyph-native-review'),
  fd = await load('mana-numeral-font-definition'),
  font = await load('mana-numeral-font-study'),
  nd = await load('mana-numeral-native-definition'),
  native = await load('mana-numeral-native-study');
for (const d of [font, native]) {
  assert.equal(d.value.rendererHash, baseline.value.rendererHash);
  assert.equal(d.value.sources.inputs, hash(inputs.bytes));
  assert.equal(d.value.sources.poses, hash(poses.bytes));
  assert.equal(d.value.sources.capture, hash(baseline.bytes));
  assert.equal(d.value.sources.rings, hash(rings.bytes));
  assert.equal(d.value.sources.audit, hash(audit.bytes));
  assert.equal(d.value.rows.length, 106);
  for (const [file, expected] of Object.entries(d.value.modules))
    assert.equal(hash(await readFile('games/magic/tools/accuracy/' + file)), expected);
}
assert.equal(font.value.sources.definition, hash(fd.bytes));
assert.equal(native.value.sources.definition, hash(nd.bytes));
assert.equal(
  font.value.toolHash,
  hash(await readFile('games/magic/tools/accuracy/revised-mana-numeral-study.mjs')),
);
assert.equal(
  native.value.toolHash,
  hash(await readFile('games/magic/tools/accuracy/revised-mana-numeral-native-study.mjs')),
);
assert.equal(font.value.status, 'numeral-font-and-source-proposals-not-adopted');
assert.equal(font.value.fonts.length, 11);
assert(
  font.value.fonts.every((f) => f.faces.length && f.faces.every((x) => x.status === 'loaded')),
);
assert(fd.value.fonts.every((f) => /^[a-f0-9]{64}$/.test(f.asset.sha256) && f.asset.bytes > 0));
assert.equal(fd.value.fonts.length, 4);
assert.equal(fd.value.candidates[font.value.selected.index].kind, 'source-mask');
assert.equal(native.value.status, 'production-native-numeral-control-proposal');
assert.equal(nd.value.candidates.length, 37);
assert.deepEqual(nd.value.candidates[0], { name: 'current', delta: {} });
const median = (a) => [...a].sort((a, b) => a - b)[1];
for (const r of native.value.rows) {
  assert.equal(r.parity, 0);
  assert.equal(r.regionParity, 0);
  assert.equal(r.candidateParity, 0);
  assert.equal(r.scores.length, 37);
  assert.equal(r.effects[0], 0);
  assert(r.effects.slice(1).every((n) => n > 0));
  const a = audit.value.rows.find((a) => a.id === r.id && a.index === r.index);
  assert.equal(r.scores[0], median(a.measurements.map((m) => m.comparison.score)) * 100);
  const f = font.value.rows.find((f) => f.id === r.id && f.index === r.index);
  assert.equal(f.scores[0], r.scores[0]);
}
const v1 = {
    selection: await load('mana-combined-selection'),
    inputs: await load('mana-combined-inputs'),
    native: await load('mana-combined-native'),
    review: await load('mana-combined-review'),
    scores: await load('mana-combined-whole-scores'),
  },
  v2 = {
    selection: await load('mana-reviewed-selection'),
    inputs: await load('mana-reviewed-inputs'),
    native: await load('mana-reviewed-native'),
    review: await load('mana-reviewed-review'),
    scores: await load('mana-reviewed-whole-scores'),
  };
const prior = await load('footer-final-score-reuse');
for (const p of [v1, v2]) {
  const r = p.review.value,
    s = p.scores.value;
  assert.equal(r.status, 'combined-native-mana-proposal-reviewed');
  assert.equal(r.rendererHash, baseline.value.rendererHash);
  assert.equal(
    r.toolHash,
    hash(await readFile('games/magic/tools/accuracy/revised-mana-combined-review.mjs')),
  );
  for (const [file, expected] of Object.entries(r.modules))
    assert.equal(hash(await readFile('games/magic/tools/accuracy/' + file)), expected);
  assert.deepEqual(
    r.sources,
    Object.fromEntries(
      [
        ['inputs', inputs],
        ['poses', poses],
        ['before', baseline],
        ['after', p.native],
        ['rings', rings],
        ['audit', audit],
        ['glyphReview', glyph],
        ['numericStudy', native],
        ['selection', p.selection],
        ['candidateInputs', p.inputs],
      ].map(([k, d]) => [k, hash(d.bytes)]),
    ),
  );
  assert.equal(p.native.value.inputHash, hash(p.inputs.bytes));
  assert.equal(p.native.value.rendererHash, baseline.value.rendererHash);
  assert.deepEqual(p.native.value.faults, []);
  assert.equal(p.native.value.rows.length, 306);
  assert.equal(r.rows.length, 306);
  assert.equal(r.glyphs.length, 360);
  assert.equal(r.summary.outside, 0);
  assert.equal(r.summary.alpha, 0);
  assert.equal(r.summary.unchangedLands, 25);
  for (const row of r.rows) {
    assert.equal(row.outside, 0);
    assert.equal(row.alpha, 0);
    const b = baseline.value.rows.find((b) => b.id === row.id),
      a = p.native.value.rows.find((a) => a.id === row.id);
    assert.equal(row.before, b.modes.original.sha256);
    assert.equal(row.after, a.modes.original.sha256);
    assert.deepEqual(a.modes.original.layout, b.modes.original.layout);
    assert.equal(a.artHash, b.artHash);
    assert.equal(a.referenceHash, b.referenceHash);
    if (row.land) assert.equal(row.before, row.after);
  }
  assert.equal(s.status, 'complete-native-mana-input-comparison');
  assert.equal(
    s.toolHash,
    hash(await readFile('games/magic/tools/accuracy/printing-native-input-score.mjs')),
  );
  assert.equal(s.beforeInputHash, hash(inputs.bytes));
  assert.equal(s.inputHash, hash(p.inputs.bytes));
  assert.equal(s.sources.beforeCapture, hash(baseline.bytes));
  assert.equal(s.sources.afterCapture, hash(p.native.bytes));
  assert.equal(s.sources.prior, hash(prior.bytes));
  assert.deepEqual(s.metricGraph, prior.value.metricGraph);
  assert.equal(
    s.metricGraph.hash,
    hash(JSON.stringify({ node: s.metricGraph.node, sources: s.metricGraph.sources })),
  );
  assert.equal(s.summary.all.before100, prior.value.summary.all.current100);
  assert.equal(s.reuse.reused, r.summary.unchanged);
  assert.equal(s.reuse.fresh, r.summary.changed);
  for (const row of s.rows) {
    const b = prior.value.rows.find((b) => b.id === row.id),
      a = r.rows.find((a) => a.id === row.id);
    assert.deepEqual(row.beforeScore, b.score);
    assert.equal(row.beforeNativeHash, a.before);
    assert.equal(row.nativeHash, a.after);
    assert.equal(row.referenceHash, b.referenceHash);
    assert.equal(row.poseHash, b.poseHash);
    assert.match(row.regionPlanHash, /^[a-f0-9]{64}$/);
    assert.equal(row.scoreReused, a.before === a.after);
    if (row.scoreReused) assert.deepEqual(row.score, b.score);
  }
}
assert.deepEqual(Object.keys(v1.selection.value.mana.glyphs), ['U', 'B', 'R', 'G']);
assert.deepEqual(Object.keys(v2.selection.value.mana.glyphs), ['B', 'R', 'G']);
assert.equal(v2.selection.value.nativeNumeralStudyHash, hash(native.bytes));
assert.equal(v2.selection.value.numberCandidateIndex, 12);
assert.deepEqual(nd.value.candidates[12].delta, {
  numberScale: 1.02,
  numberDx: 0,
  numberDy: -0.25,
});
assert.deepEqual(v2.review.value.summary, {
  cards: 306,
  changed: 238,
  unchanged: 68,
  unchangedLands: 25,
  outside: 0,
  alpha: 0,
  glyphs: 360,
});
let numbers = 0;
for (const r of v2.review.value.glyphs) {
  if (/^\d+$/.test(r.symbol)) {
    const n = native.value.rows.find((n) => n.id === r.id && n.index === r.index);
    assert.equal(r.shapeAfter, n.scores[12]);
    numbers++;
  }
  if (['W', 'U', 'X'].includes(r.symbol)) {
    assert.equal(r.shapeBefore, r.shapeAfter);
    assert(r.measurements.every((m) => m.beforeMask === m.afterMask));
  }
}
assert.equal(numbers, 106);
assert(
  v1.review.value.groups['symbol/U'].positioned.after <
    v1.review.value.groups['symbol/U'].positioned.before,
);
assert(v1.scores.value.summary.U.current100 < v1.scores.value.summary.U.before100);
assert.equal(
  v2.review.value.groups['symbol/U'].positioned.after,
  v2.review.value.groups['symbol/U'].positioned.before,
);
assert(v2.scores.value.summary.U.current100 >= v2.scores.value.summary.U.before100);
for (const cohort of ['calibration', 'validation']) {
  const g = v2.review.value.groups[cohort];
  assert(g.shape.after > g.shape.before);
  assert(g.positioned.after > g.positioned.before);
}
assert(v2.review.value.groups.all.shape.worstRegression < 2);
assert(v2.scores.value.summary.all.current100 > v1.scores.value.summary.all.current100);
console.log(
  'Revised numeral native grid,11 font controls,306-card combined isolation,106 exact numeric reproductions,blue rejection,and68 exact full-score reuses pass.',
);

const paperProbe = await load('mana-paper-sampler-observation'),
  // The sampler observation predates the source-bound ARN symbol-role addition.
  source = (
    await preArnSymbolRoleSource(
      'games/magic/src/presentation/mana-numeral.ts',
      await readFile('games/magic/src/presentation/mana-numeral.ts'),
    )
  ).toString();
assert.equal(paperProbe.value.status, 'native-paper-sampler-observation');
assert.equal(paperProbe.value.proof.source, hash(source));
const marker = '    let darkest = sample;';
assert.equal(source.split(marker).length, 2);
assert.equal(
  paperProbe.value.proof.observed,
  hash(
    source.replace(
      marker,
      "    (globalThis as any).__manaPaperProbe?.({paper:[...paper],opaque:[...opaqueManaPaper(p)],sample:paperSample??'fixed-probe',width:source.width,height:source.height});\n" +
        marker,
    ),
  ),
);
assert.equal(paperProbe.value.rows.length, 6);
for (const r of paperProbe.value.rows)
  assert.equal(r.faceHash, v2.native.value.rows.find((n) => n.id === r.id).modes.original.sha256);
const black = paperProbe.value.rows
  .find((r) => r.name === 'Bad Moon')
  .samples.find((s) => s.width === 160);
assert.deepEqual(black.paper, [151, 148, 144]);
assert.deepEqual(black.opaque, [164, 160, 157]);
assert.equal(black.sample, 'fixed-probe');
console.log(
  'Six unchanged native paper observations expose the skull-contaminated fixed background probe without promoting a color target.',
);
