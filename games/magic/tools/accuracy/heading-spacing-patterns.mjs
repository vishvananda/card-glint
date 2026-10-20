/** Descriptive analysis of a paired heading study. Does not change calibration. */
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const [file, output] = process.argv.slice(2);
assert(output, 'Usage: heading-spacing-patterns.mjs FIT_JSON OUTPUT_DIRECTORY');
const fit = JSON.parse(await readFile(file, 'utf8'));
const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
const median = (a) => {
  const s = [...a].sort((a, b) => a - b),
    m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const rows = fit.nativeVerification.map((r) => {
  assert.equal(r.outside, 0, 'Unverified region ownership: ' + r.name);
  assert.equal(r.defaultParity.changedPixels, 0, 'Released baseline drift: ' + r.name);
  const words = r.name.split(/\s+/);
  const before = 100 * r.scores.title.before[0],
    after = 100 * r.scores.title.after[0];
  return {
    ...r,
    before,
    after,
    delta: after - before,
    characters: r.name.length,
    words: words.length,
    firstWord: words[0],
    firstLetter: r.name[0],
    firstPair: r.name.slice(0, 2),
    firstWordLength: words[0].length,
    lengthBand:
      r.name.length <= 8
        ? '1–8'
        : r.name.length <= 12
          ? '9–12'
          : r.name.length <= 16
            ? '13–16'
            : r.name.length <= 20
              ? '17–20'
              : '21+',
  };
});
assert(rows.length > 0);
assert.equal(new Set(rows.map((r) => r.id)).size, rows.length);
function summary(rs) {
  return {
    count: rs.length,
    oldBetter: rs.filter((r) => r.delta < 0).length,
    newBetter: rs.filter((r) => r.delta > 0).length,
    unchanged: rs.filter((r) => r.delta === 0).length,
    before: mean(rs.map((r) => r.before)),
    after: mean(rs.map((r) => r.after)),
    delta: mean(rs.map((r) => r.delta)),
    medianDelta: median(rs.map((r) => r.delta)),
  };
}
function correlation(a, b) {
  const ma = mean(a),
    mb = mean(b);
  const denom = Math.sqrt(
    a.reduce((s, x) => s + (x - ma) ** 2, 0) * b.reduce((s, x) => s + (x - mb) ** 2, 0),
  );
  return denom ? a.reduce((s, x, i) => s + (x - ma) * (b[i] - mb), 0) / denom : null;
}
function groups(feature, rs = rows, fn = summary) {
  return Object.fromEntries(
    [...new Set(rs.map((r) => r[feature]))]
      .sort((a, b) => String(a).localeCompare(String(b)))
      .map((value) => [value, fn(rs.filter((r) => r[feature] === value))]),
  );
}
const old = rows.filter((r) => r.delta < 0),
  improved = rows.filter((r) => r.delta > 0);
const report = {
  schema: 1,
  scope:
    'Paired Alpha name regions, fixed scan poses and original wording. Scores are structural indices out of 100. Post-hoc development analysis; associations do not establish a glyph rule. Individual best shifts are diagnostics, never defaults.',
  values: fit.fits.title.values,
  overall: summary(rows),
  splits: Object.fromEntries(
    [
      ['oldBetter', old],
      ['newBetter', improved],
    ].map(([name, rs]) => [
      name,
      {
        ...summary(rs),
        meanCharacters: mean(rs.map((r) => r.characters)),
        meanWords: mean(rs.map((r) => r.words)),
      },
    ]),
  ),
  groups: Object.fromEntries(
    ['words', 'lengthBand', 'firstLetter', 'firstPair', 'firstWord', 'material', 'cohort'].map(
      (feature) => [feature, groups(feature)],
    ),
  ),
  correlations: Object.fromEntries(
    ['characters', 'words', 'firstWordLength', 'before'].map((feature) => [
      feature,
      correlation(
        rows.map((r) => r[feature]),
        rows.map((r) => r.delta),
      ),
    ]),
  ),
};
for (const [i, name] of ['a', 'b', 'c', 'd', 'tx', 'ty'].entries())
  report.correlations['pose.' + name] = correlation(
    rows.map((r) => r.pose.matrix[i]),
    rows.map((r) => r.delta),
  );
const ablated = rows.filter((r) => r.ablation?.title?.bestHorizontal);
if (ablated.length) {
  const variants = Object.keys(ablated[0].ablation.title.scores);
  report.ablation = {
    count: ablated.length,
    variants: Object.fromEntries(
      variants.map((name) => [
        name,
        {
          score: mean(ablated.map((r) => r.ablation.title.scores[name][0] * 100)),
          deltaFromBaseline: mean(
            ablated.map(
              (r) => (r.ablation.title.scores[name][0] - r.ablation.title.scores.baseline[0]) * 100,
            ),
          ),
        },
      ]),
    ),
  };
  function shiftSummary(rs) {
    return {
      count: rs.length,
      medianDx: median(rs.map((r) => r.ablation.title.bestHorizontal.dx)),
      meanDx: mean(rs.map((r) => r.ablation.title.bestHorizontal.dx)),
      rangeBoundary: rs.filter((r) => Math.abs(r.ablation.title.bestHorizontal.dx) === 4).length,
    };
  }
  report.horizontalOnly = {
    scope:
      'Old font size, width and spacing retained. Each card tests dx=-4..4 in 0.5px steps. Boundary optima remain unresolved.',
    overall: shiftSummary(ablated),
    oldBetter: shiftSummary(ablated.filter((r) => r.delta < 0)),
    newBetter: shiftSummary(ablated.filter((r) => r.delta > 0)),
    byFirstLetter: groups('firstLetter', ablated, shiftSummary),
    sharedScores: ablated[0].ablation.title.positionSweep.map(({ dx }, i) => ({
      dx,
      score: mean(ablated.map((r) => r.ablation.title.positionSweep[i].score * 100)),
    })),
  };
}
await mkdir(output, { recursive: true });
const save = (name, value) =>
  writeFile(path.join(output, name), JSON.stringify(value, null, 2) + '\n');
await save('patterns.json', report);
for (const [name, rs] of [
  ['old-better', old],
  ['new-better', improved],
])
  await save(
    name + '.json',
    [...rs]
      .sort((a, b) => a.delta - b.delta)
      .map(({ id, name, material, before, after, delta, ablation }) => ({
        id,
        name,
        material,
        before,
        after,
        delta,
        ...(ablation?.title?.bestHorizontal
          ? { bestHorizontal: ablation.title.bestHorizontal }
          : {}),
      })),
  );
console.log(
  JSON.stringify(
    {
      overall: report.overall,
      splits: report.splits,
      ablation: report.ablation,
      horizontalOnly: report.horizontalOnly && {
        overall: report.horizontalOnly.overall,
        oldBetter: report.horizontalOnly.oldBetter,
        newBetter: report.horizontalOnly.newBetter,
      },
    },
    null,
    2,
  ),
);
