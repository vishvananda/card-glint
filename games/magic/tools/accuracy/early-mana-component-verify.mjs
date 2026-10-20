// Independent native cost/glyph/disc checks, with each component kept separate.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { normalize, cropGray } from './pixels-pure.mjs';
import { JsTextObjective, nativeGrayCrop } from './abu-type-objective.mjs';
import { outerManaCircle } from './abu-mana-ring.mjs';
import { manaGlyphMask, compareManaGlyph } from './mana-glyph-metrics.mjs';
import { median } from './hsb-color.mjs';
const [nativeDirectory, auditFile, discDirectory, glyphDirectory, output] = process.argv.slice(2);
assert(
  output,
  'Usage: early-mana-component-verify.mjs NATIVE AUDIT DISC_CAPTURE GLYPH_CAPTURE OUTPUT',
);
const raw = await Promise.all(
  [
    path.join(nativeDirectory, 'capture.json'),
    auditFile,
    path.join(discDirectory, 'capture.json'),
    path.join(glyphDirectory, 'capture.json'),
  ].map((f) => readFile(f)),
);
const [capture, audit, disc, glyph] = raw.map((b) => JSON.parse(b));
for (const d of [disc, glyph]) {
  assert.equal(d.completed, d.total);
  assert.equal(d.source.nativeCaptureHash, hash(raw[0]));
  assert.equal(d.source.auditHash, hash(raw[1]));
  assert.equal(d.source.rendererHash, capture.source.rendererHash);
  for (const [file, key] of [
    ['early-mana-geometry-replay.mjs', 'toolHash'],
    ['early-mana-trial-plugin.mjs', 'pluginHash'],
  ])
    assert.equal(d.source[key], hash(await readFile(new URL(file, import.meta.url))));
  for (const [file, digest] of d.source.dependencies)
    assert.equal(digest, hash(await readFile(new URL(file, import.meta.url))));
}
assert.deepEqual(
  disc.rows.map((r) => r.id),
  glyph.rows.map((r) => r.id),
);
const thresholds = [0.38, 0.48, 0.58],
  rows = [];
for (const r of glyph.rows) {
  const dr = disc.rows.find((x) => x.id === r.id),
    ar = audit.rows.find((x) => x.id === r.id),
    c = capture.rows.find((x) => x.id === r.id);
  for (const key of ['referenceHash', 'poseHash', 'scanHash']) {
    assert.equal(r[key], c[key]);
    assert.equal(dr[key], c[key]);
  }
  const trials = [
    dr.trials.find((t) => t.id === 'paper-ink'),
    r.trials.find((t) => t.id === 'disc-fit'),
    r.trials.find((t) => t.id === 'glyph-fit'),
  ];
  assert.equal(trials[1].faceHash, dr.trials.find((t) => t.id === 'disc-fit').faceHash);
  const files = [
    path.join(discDirectory, trials[0].file),
    path.join(glyphDirectory, trials[1].file),
    path.join(glyphDirectory, trials[2].file),
    path.join(nativeDirectory, '2ed', r.id + '-scan.png'),
  ];
  const bytes = await Promise.all(files.map((f) => readFile(f)));
  for (let i = 0; i < 3; i++) assert.equal(hash(bytes[i]), trials[i].faceHash);
  assert.equal(hash(bytes[3]), r.scanHash);
  const native = bytes.slice(0, 3).map((b) => PNG.sync.read(b)),
    canonical = native.map((im) => normalize(im)),
    scan = normalize(PNG.sync.read(bytes[3]));
  const rect = r.rect,
    objective = new JsTextObjective(cropGray(scan, rect).gray, rect[2], rect[3]);
  const costScores = native.map((im, i) => {
    const s = objective.score(nativeGrayCrop(im, rect))[0];
    assert(Math.abs(s - trials[i].score) < 1e-10, r.name + ' native cost score');
    return s;
  });
  const countChanges = (a, b) => {
    let changed = 0,
      heading = 0,
      outside = 0,
      alphaChanged = 0;
    for (let p = 0; p < 732 * 1020; p++) {
      const i = p * 4,
        x = p % 732,
        y = Math.floor(p / 732);
      if (a.data[i + 3] !== b.data[i + 3]) alphaChanged++;
      if (![0, 1, 2, 3].some((k) => a.data[i + k] !== b.data[i + k])) continue;
      changed++;
      if (x >= rect[0] * 1.5 && x < (rect[0] + rect[2]) * 1.5 && y >= 37.5 && y < 102) continue;
      if (x >= 43.5 && x < 655.5 && y >= 43.5 && y < 105) heading++;
      else outside++;
    }
    assert.equal(outside, 0, r.name + ' changed outside cost/name');
    assert.equal(alphaChanged, 0);
    return { changed, heading, outside, alphaChanged };
  };
  const geometryChanges = countChanges(native[0], native[1]),
    glyphChanges = countChanges(native[1], native[2]);
  assert.equal(glyphChanges.heading, 0);
  if (['U', 'N'].includes(r.symbol))
    assert.equal(
      hash(bytes[1]),
      hash(bytes[2]),
      r.name + ' unchanged internal glyph should remain exact',
    );
  const predicted = trials[2].circle;
  const circle = outerManaCircle(canonical[2], {
    x: predicted.x,
    y: predicted.y,
    range: 1.5,
    radiusRange: [9.5, 14],
  });
  const reference = ar.scan.circle;
  const component = {
    circleStatus: circle.status,
    actual: circle,
    predicted,
    centerPredictionError: Math.hypot(circle.x - predicted.x, circle.y - predicted.y),
    radiusPredictionError: Math.abs(circle.radius - predicted.radius),
    beforeCenterError: Math.hypot(
      ar.render.circle.x - reference.x,
      ar.render.circle.y - reference.y,
    ),
    afterCenterError: Math.hypot(circle.x - reference.x, circle.y - reference.y),
    beforeRadiusError: Math.abs(ar.render.circle.radius - reference.radius),
    afterRadiusError: Math.abs(circle.radius - reference.radius),
  };
  const masks = [canonical[1], canonical[2], scan].map((im, i) =>
    thresholds.map((thresholdFraction) =>
      manaGlyphMask(im, i === 2 ? reference : circle, false, {
        normalizeBounds: false,
        thresholdFraction,
      }),
    ),
  );
  const failures = masks.flatMap((a, i) =>
    a.flatMap((m, j) =>
      m.status === 'measured' ? [] : [{ side: i, threshold: thresholds[j], status: m.status }],
    ),
  );
  const inkScores = failures.length
    ? null
    : [0, 1].map((i) =>
        median(thresholds.map((_, j) => compareManaGlyph(masks[2][j].ink, masks[i][j].ink).score)),
      );
  rows.push({
    id: r.id,
    name: r.name,
    symbol: r.symbol,
    cohort: r.cohort,
    referenceHash: r.referenceHash,
    poseHash: r.poseHash,
    faceHashes: bytes.slice(0, 3).map(hash),
    costScores,
    geometryChanges,
    glyphChanges,
    component,
    inkScores,
    failures,
  });
  if (rows.length % 10 === 0) console.log(rows.length + '/' + glyph.total, r.name);
}
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const groups = Object.fromEntries(
  [
    'all',
    'calibration',
    'validation',
    ...['W', 'U', 'B', 'R', 'G', 'N'].map((s) => 'symbol/' + s),
  ].map((key) => {
    const a = rows.filter((r) => key === 'all' || r.cohort === key || key === 'symbol/' + r.symbol),
      ink = a.filter((r) => r.inkScores),
      circles = a.filter((r) => r.component.circleStatus === 'measured');
    return [
      key,
      {
        count: a.length,
        costMean100: [0, 1, 2].map((i) => 100 * mean(a.map((r) => r.costScores[i]))),
        inkAccepted: ink.length,
        inkBeforeMean100: ink.length ? 100 * mean(ink.map((r) => r.inkScores[0])) : null,
        inkAfterMean100: ink.length ? 100 * mean(ink.map((r) => r.inkScores[1])) : null,
        inkImproved: ink.filter((r) => r.inkScores[1] > r.inkScores[0] + 1e-9).length,
        inkWorstRegression100: ink.length
          ? 100 * Math.max(0, ...ink.map((r) => r.inkScores[0] - r.inkScores[1]))
          : null,
        circlesAccepted: circles.length,
        beforeCenterMedian: median(circles.map((r) => r.component.beforeCenterError)),
        afterCenterMedian: median(circles.map((r) => r.component.afterCenterError)),
        beforeRadiusMedian: median(circles.map((r) => r.component.beforeRadiusError)),
        afterRadiusMedian: median(circles.map((r) => r.component.afterRadiusError)),
        maxCirclePredictionError: Math.max(
          ...circles.map((r) => r.component.centerPredictionError),
        ),
        maxRadiusPredictionError: Math.max(
          ...circles.map((r) => r.component.radiusPredictionError),
        ),
      },
    ];
  }),
);
await writeJson(output, {
  schema: 1,
  set: '2ed',
  status: 'native-mana-component-candidates-verified-not-adopted',
  scope:
    'Independent cached native PNG verification of cost score, physical discs and internal ink masks. Geometry-only changes cannot alter body/alpha or content outside cost/name regions. Internal glyph changes must remain in the cost; unchanged blue/numeric glyphs retain exact full PNG bytes. Disc-relative ink masks retain size and centering without normalizing ink bounds, at three thresholds. Perimeter errors are reported separately; measured circles never change scoring rasters. Approximate fit scores are not substituted for native measurements. Generic numerals, source ink expansion and final whole-set/material integration remain open.',
  sources: {
    nativeCapture: hash(raw[0]),
    audit: hash(raw[1]),
    discCapture: hash(raw[2]),
    glyphCapture: hash(raw[3]),
  },
  toolHash: hash(await readFile(new URL(import.meta.url))),
  dependencies: await Promise.all(
    [
      'abu-type-objective.mjs',
      'pixels-pure.mjs',
      'abu-mana-ring.mjs',
      'mana-glyph-metrics.mjs',
    ].map(async (f) => [f, hash(await readFile(new URL(f, import.meta.url)))]),
  ),
  groups,
  rows,
});
console.log(JSON.stringify({ status: 'native-mana-components-verified', groups }));
