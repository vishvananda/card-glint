// Full-card native composition proof for reviewed relative mana controls.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { root, hash, sourceHash, objectFile, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { manaGlyphMask, compareManaGlyph } from './mana-glyph-metrics.mjs';
import { median } from './hsb-color.mjs';
const [
  inputFile,
  poseFile,
  beforeDirectory,
  afterDirectory,
  ringFile,
  auditFile,
  glyphReviewFile,
  numericStudyFile,
  selectionFile,
  candidateInputFile,
  output,
] = process.argv.slice(2);
assert(
  output,
  'Usage: revised-mana-combined-review.mjs INPUTS POSES BEFORE AFTER RINGS AUDIT GLYPH_REVIEW NUMERIC_STUDY SELECTION CANDIDATE_INPUTS NEW_OUTPUT',
);
const files = [
    inputFile,
    poseFile,
    path.join(beforeDirectory, 'capture.json'),
    path.join(afterDirectory, 'capture.json'),
    ringFile,
    auditFile,
    glyphReviewFile,
    numericStudyFile,
    selectionFile,
    candidateInputFile,
  ],
  bytes = await Promise.all(files.map((f) => fs.readFile(f))),
  [
    inputs,
    poses,
    before,
    after,
    ring,
    audit,
    glyphReview,
    numericStudy,
    selection,
    candidateInputs,
  ] = bytes.map((b) => JSON.parse(b)),
  toolHash = hash(await fs.readFile(new URL(import.meta.url))),
  moduleNames = [
    'pixels-pure.mjs',
    'scan-transform.mjs',
    'mana-glyph-metrics.mjs',
    'edges.mjs',
    'metrics.mjs',
    'hsb-color.mjs',
  ],
  identities = async () =>
    Object.fromEntries(
      await Promise.all(
        moduleNames.map(async (f) => [f, hash(await fs.readFile(new URL(f, import.meta.url)))]),
      ),
    ),
  modules = await identities(),
  rows = [],
  glyphs = [];
for (const d of [after, ring, audit, glyphReview, numericStudy])
  assert.equal(d.rendererHash, before.rendererHash);
assert.equal(before.inputHash, hash(bytes[0]));
assert.equal(after.inputHash, hash(bytes[9]));
assert.equal(ring.sources.poses, hash(bytes[1]));
assert.equal(audit.sources.rings, hash(bytes[4]));
assert.equal(selection.sourceInputsHash, hash(bytes[0]));
assert.equal(selection.nativeNumeralStudyHash, hash(bytes[7]));
assert.equal(selection.glyphNativeReviewHash, hash(bytes[6]));
assert.deepEqual(candidateInputs.experiment.proposal, selection.mana);
assert.equal(candidateInputs.entries.length, inputs.entries.length);
assert.equal(inputs.entries.length, 306);
assert.equal(after.rows.length, 306);
assert.deepEqual(after.faults, []);
await fs.writeFile(output, JSON.stringify({ status: 'running' }), { flag: 'wx' });
const start = performance.now();
for (const e of inputs.entries) {
  const b = before.rows.find((x) => x.id === e.id),
    a = after.rows.find((x) => x.id === e.id),
    candidate = candidateInputs.entries.find((x) => x.id === e.id),
    expected = structuredClone(e.face);
  if (e.face.manaSymbols?.length) expected.symbolAdjustment = { mana: selection.mana };
  assert.deepEqual(
    candidate.face,
    expected,
    'Candidate recipe changed outside reviewed mana controls',
  );
  assert.equal(a.referenceHash, b.referenceHash);
  assert.equal(a.artHash, b.artHash);
  assert.deepEqual(a.modes.original.layout, b.modes.original.layout);
  const bb = await fs.readFile(path.join(beforeDirectory, b.modes.original.file)),
    ab = await fs.readFile(path.join(afterDirectory, a.modes.original.file));
  assert.equal(hash(bb), b.modes.original.sha256);
  assert.equal(hash(ab), a.modes.original.sha256);
  const base = PNG.sync.read(bb),
    next = PNG.sync.read(ab);
  assert.equal(base.width, 732);
  assert.equal(base.height, 1020);
  assert.equal(next.width, 732);
  assert.equal(next.height, 1020);
  const count = e.face.manaSymbols?.length ?? 0,
    first = 435 - (count - 1) * 27,
    rect = count
      ? [
          Math.floor((first - 13) * 1.5),
          Math.floor(31.5 * 1.5),
          Math.ceil((461 - first) * 1.5),
          Math.ceil(26 * 1.5),
        ]
      : null;
  let changed = 0,
    outside = 0,
    alpha = 0;
  for (let i = 0; i < base.width * base.height; i++) {
    const at = i * 4;
    if (base.data[at + 3] !== next.data[at + 3]) alpha++;
    if ([0, 1, 2].every((c) => base.data[at + c] === next.data[at + c])) continue;
    changed++;
    const x = i % base.width,
      y = Math.floor(i / base.width);
    if (!rect || x < rect[0] || y < rect[1] || x >= rect[0] + rect[2] || y >= rect[1] + rect[3])
      outside++;
  }
  assert.equal(outside, 0, 'RGB changed outside mana cost:' + e.name);
  assert.equal(alpha, 0, 'Alpha changed:' + e.name);
  if (!count) assert.equal(hash(bb), hash(ab));
  rows.push({
    id: e.id,
    name: e.name,
    land: e.face.land,
    referenceHash: b.referenceHash,
    artHash: b.artHash,
    before: hash(bb),
    after: hash(ab),
    rect,
    changed,
    outside,
    alpha,
  });
  const r = ring.rows.find((r) => r.id === e.id);
  if (!r) continue;
  const p = Object.values(poses.groups)
      .flatMap((g) => g.rows)
      .find((p) => p.id === e.id),
    sb = await fs.readFile(objectFile(e.reference));
  assert(p.accepted);
  assert.equal(hash(sb), r.referenceHash);
  assert.equal(hash(JSON.stringify(p.transform)), r.poseHash);
  const reference = normalize(PNG.sync.read(sb), p.transform),
    beforeImage = normalize(base),
    afterImage = normalize(next);
  for (const d of r.discs.filter((d) => d.accepted)) {
    const parent = audit.rows.find((a) => a.id === r.id && a.index === d.index),
      prior = glyphReview.comparisons.find((x) => x.id === r.id && x.index === d.index);
    const measurements = audit.thresholds.map((thresholdFraction, index) => {
      const target = manaGlyphMask(reference, d.circles.scan, false, {
          normalizeBounds: false,
          thresholdFraction,
        }),
        original = manaGlyphMask(beforeImage, d.circles.render, false, {
          normalizeBounds: false,
          thresholdFraction,
        }),
        trial = manaGlyphMask(afterImage, d.circles.render, false, {
          normalizeBounds: false,
          thresholdFraction,
        }),
        positionedOriginal = manaGlyphMask(beforeImage, d.circles.scan, false, {
          normalizeBounds: false,
          thresholdFraction,
        }),
        positionedTrial = manaGlyphMask(afterImage, d.circles.scan, false, {
          normalizeBounds: false,
          thresholdFraction,
        });
      for (const m of [target, original, trial, positionedOriginal, positionedTrial])
        assert.equal(m.status, 'measured');
      assert.equal(hash(target.ink), parent.measurements[index].scan.maskHash);
      assert.equal(hash(original.ink), parent.measurements[index].render.maskHash);
      if (selection.mana.glyphs?.[d.symbol])
        assert.equal(
          hash(trial.ink),
          prior.measures[index].candidateMask,
          'Mixed numeral controls changed a colored glyph',
        );
      if (/^[WUBRGX]$/.test(d.symbol) && !selection.mana.glyphs?.[d.symbol])
        assert.equal(hash(trial.ink), hash(original.ink), 'Unselected colored/X glyph changed');
      return {
        thresholdFraction,
        referenceMask: hash(target.ink),
        beforeMask: hash(original.ink),
        afterMask: hash(trial.ink),
        shapeBefore: compareManaGlyph(target.ink, original.ink).score * 100,
        shapeAfter: compareManaGlyph(target.ink, trial.ink).score * 100,
        positionedBefore: compareManaGlyph(target.ink, positionedOriginal.ink).score * 100,
        positionedAfter: compareManaGlyph(target.ink, positionedTrial.ink).score * 100,
      };
    });
    const scores = Object.fromEntries(
      ['shapeBefore', 'shapeAfter', 'positionedBefore', 'positionedAfter'].map((k) => [
        k,
        median(measurements.map((m) => m[k])),
      ]),
    );
    if (/^\d+$/.test(d.symbol)) {
      const nr = numericStudy.rows.find((n) => n.id === r.id && n.index === d.index);
      assert.equal(scores.shapeBefore, nr.scores[0]);
      assert.equal(
        scores.shapeAfter,
        nr.scores[selection.numberCandidateIndex],
        'Combined native number differs from retained native study',
      );
    }
    glyphs.push({
      id: r.id,
      name: r.name,
      cohort: r.cohort,
      material: r.material,
      index: d.index,
      symbol: d.symbol,
      ...scores,
      measurements,
    });
  }
  if (rows.length % 25 === 0) console.log('Combined native cost review', rows.length);
}
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
function summary(a) {
  if (!a.length) return { count: 0 };
  const g = { count: a.length };
  for (const role of ['shape', 'positioned']) {
    g[role] = {
      before: mean(a.map((r) => r[role + 'Before'])),
      after: mean(a.map((r) => r[role + 'After'])),
      gains: a.filter((r) => r[role + 'After'] > r[role + 'Before'] + 1e-10).length,
      losses: a.filter((r) => r[role + 'After'] < r[role + 'Before'] - 1e-10).length,
      worstRegression: Math.max(0, ...a.map((r) => r[role + 'Before'] - r[role + 'After'])),
    };
  }
  return g;
}
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), before.rendererHash);
assert.equal(hash(await fs.readFile(new URL(import.meta.url))), toolHash);
assert.deepEqual(await identities(), modules);
assert.deepEqual(
  await Promise.all(files.map(async (f) => hash(await fs.readFile(f)))),
  bytes.map(hash),
);
await writeJson(output, {
  schema: 1,
  set: '3ed',
  status: 'combined-native-mana-proposal-reviewed',
  scope:
    'All306 Original full-native printings use only the reviewed relative public mana controls. Unchanged source scans/art,body layouts,alpha and every pixel outside the cost. Selected colored glyph masks reproduce their individual native proposals exactly; unselected colored/X glyphs are unchanged; all106 measured numbers reproduce the selected production-native study exactly. Separate glyph-shape and frame-positioned glyph metrics on the223 accepted frame sample. Rejected frame/circle cases remain explicit in upstream records. No new renderer defaults or whole-card/set certification is implied.',
  rendererHash: before.rendererHash,
  sources: Object.fromEntries(
    [
      'inputs',
      'poses',
      'before',
      'after',
      'rings',
      'audit',
      'glyphReview',
      'numericStudy',
      'selection',
      'candidateInputs',
    ].map((k, i) => [k, hash(bytes[i])]),
  ),
  toolHash,
  modules,
  selectedColors: Object.keys(selection.mana.glyphs),
  summary: {
    cards: rows.length,
    changed: rows.filter((r) => r.changed).length,
    unchanged: rows.filter((r) => !r.changed).length,
    unchangedLands: rows.filter((r) => r.land && !r.changed).length,
    outside: rows.reduce((s, r) => s + r.outside, 0),
    alpha: rows.reduce((s, r) => s + r.alpha, 0),
    glyphs: glyphs.length,
  },
  groups: Object.fromEntries(
    [
      ['all', glyphs],
      ...['calibration', 'validation'].map((c) => [c, glyphs.filter((r) => r.cohort === c)]),
      ...['W', 'U', 'B', 'R', 'G', 'N'].map((s) => [
        'symbol/' + s,
        glyphs.filter((r) => (s === 'N' ? !/^[WUBRG]$/.test(r.symbol) : r.symbol === s)),
      ]),
      ...[...new Set(glyphs.filter((r) => /^\d+$/.test(r.symbol)).map((r) => r.symbol))]
        .sort()
        .map((s) => ['numeral/' + s, glyphs.filter((r) => r.symbol === s)]),
    ].map(([k, a]) => [k, summary(a)]),
  ),
  rows,
  glyphs,
  elapsedSeconds: (performance.now() - start) / 1000,
});
console.log('Saved combined native mana review', rows.length, glyphs.length);
