// Independent full-native cost verification, after all provided original costs are current.
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
const [native, auditFile, currentFile, correctedDirectory, directory, output] =
  process.argv.slice(2);
assert(
  output,
  'Usage: early-mana-all-verify.mjs NATIVE AUDIT CURRENT_INPUTS CORRECTED_HEADER CANDIDATE OUT',
);
const files = [
  path.join(native, 'capture.json'),
  path.join(native, 'inputs.json'),
  auditFile,
  currentFile,
  path.join(correctedDirectory, 'review.json'),
  path.join(directory, 'capture.json'),
];
const raw = await Promise.all(files.map((f) => readFile(f)));
const [nativeCapture, inputs, audit, current, corrected, capture] = raw.map((b) => JSON.parse(b));
assert.equal(capture.completed, 277);
assert.equal(capture.completed, capture.total);
for (const [key, i] of [
  ['nativeCaptureHash', 0],
  ['nativeInputsHash', 1],
  ['auditHash', 2],
  ['currentInputsHash', 3],
  ['correctedHeaderHash', 4],
])
  assert.equal(capture.source[key], hash(raw[i]));
for (const [key, file] of [
  ['toolHash', 'early-mana-all-replay.mjs'],
  ['pluginHash', 'early-mana-ink-plugin.mjs'],
  ['basePluginHash', 'early-mana-trial-plugin.mjs'],
])
  assert.equal(capture.source[key], hash(await readFile(new URL(file, import.meta.url))));
assert.equal(capture.source.rendererHash, nativeCapture.source.rendererHash);
const thresholds = [0.38, 0.48, 0.58],
  rows = [];
for (const r of capture.rows) {
  const e = inputs.entries.find((e) => e.id === r.id),
    c = current.entries.find((e) => e.id === r.id),
    ar = audit.rows.find((a) => a.id === r.id),
    nr = nativeCapture.rows.find((a) => a.id === r.id);
  assert.equal(r.poseHash, hash(JSON.stringify(e.pose.transform)));
  assert.equal(r.poseHash, ar.poseHash);
  const scanBytes = await readFile(path.join(native, e.set, r.id + '-scan.png'));
  assert.equal(hash(scanBytes), nr.scanHash);
  const cr = corrected.rows.find((a) => a.id === r.id);
  const bytes = await Promise.all(r.trials.map((t) => readFile(path.join(directory, t.file))));
  bytes.forEach((b, i) => assert.equal(hash(b), r.trials[i].faceHash));
  assert.equal(hash(bytes[0]), cr ? cr.correctedFaceHash : nr.renderHash);
  assert.equal(r.currentInputChanged, !!cr);
  assert.equal(c.face.wordingMode, 'original');
  const [before, after] = bytes.map((b) => PNG.sync.read(b));
  for (const im of [before, after]) assert.deepEqual([im.width, im.height], [732, 1020]);
  let changed = 0,
    outside = 0,
    alphaChanged = 0,
    headingChanged = 0,
    bodyChanged = 0;
  const [l, top, w, h] = r.rect;
  for (let p = 0; p < 732 * 1020; p++) {
    const i = p * 4,
      x = p % 732,
      y = Math.floor(p / 732);
    if (before.data[i + 3] !== after.data[i + 3]) alphaChanged++;
    if (![0, 1, 2, 3].some((k) => before.data[i + k] !== after.data[i + k])) continue;
    changed++;
    const cost = x >= l * 1.5 && x < (l + w) * 1.5 && y >= top * 1.5 && y < (top + h) * 1.5;
    const body = x >= 53 * 1.5 && x < 445 * 1.5 && y >= 404 * 1.5 && y < 603 * 1.5;
    if (body) bodyChanged++;
    if (!cost && !body) {
      if (x >= 29 * 1.5 && x < 437 * 1.5 && y >= 29 * 1.5 && y < 70 * 1.5) headingChanged++;
      else outside++;
    }
  }
  assert.deepEqual(
    [changed, outside, alphaChanged, headingChanged],
    [r.trials[1].changed, 0, 0, r.trials[1].headingChanged],
  );
  const scan = normalize(PNG.sync.read(scanBytes)),
    objective = new JsTextObjective(cropGray(scan, r.rect).gray, w, h);
  const score = [before, after].map((im) => objective.score(nativeGrayCrop(im, r.rect))[0]);
  const g = capture.candidates[1].profile.geometry,
    s = g.scaleX;
  const predicted = {
    x: 443.95 + (ar.render.circle.x - 443.95) * s + g.dx,
    y: 46 + (ar.render.circle.y - 46) * s + g.dy,
    radius: ar.render.circle.radius * s,
  };
  const normalized = [normalize(before), normalize(after)];
  const actual = outerManaCircle(normalized[1], {
    x: predicted.x,
    y: predicted.y,
    range: 2,
    radiusRange: [10, 13],
  });
  const circles = [ar.render.circle, actual, ar.scan.circle];
  const masks = [...normalized, scan].map((im, i) =>
    thresholds.map((thresholdFraction) =>
      manaGlyphMask(im, circles[i], false, { normalizeBounds: false, thresholdFraction }),
    ),
  );
  const failures = masks.flatMap((a, i) =>
    a.flatMap((m, j) =>
      m.status === 'measured' ? [] : [{ side: i, threshold: thresholds[j], status: m.status }],
    ),
  );
  if (actual.status !== 'measured') failures.push({ side: 1, status: actual.status });
  const ink = failures.length
    ? null
    : [0, 1].map((i) =>
        median(thresholds.map((_, j) => compareManaGlyph(masks[2][j].ink, masks[i][j].ink).score)),
      );
  rows.push({
    id: r.id,
    name: r.name,
    symbol: r.symbol,
    cohort: r.cohort,
    manaSymbols: c.face.manaSymbols,
    providedFaceHash: hash(JSON.stringify(c.face)),
    poseHash: r.poseHash,
    referenceHash: nr.referenceHash,
    scanHash: nr.scanHash,
    faceHashes: bytes.map(hash),
    score,
    ink,
    failures,
    changed,
    outside,
    alphaChanged,
    headingChanged,
    bodyChanged,
    circles: { before: ar.render.circle, after: actual, reference: ar.scan.circle, predicted },
    predictionError: {
      center: Math.hypot(predicted.x - actual.x, predicted.y - actual.y),
      radius: Math.abs(predicted.radius - actual.radius),
    },
  });
  if (rows.length % 50 === 0) console.log('Verified', rows.length);
}
const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
const groups = Object.fromEntries(
  ['all', 'calibration', 'validation', 'W', 'U', 'B', 'R', 'G', 'N'].map((k) => {
    const a = rows.filter((r) => k === 'all' || r.cohort === k || r.symbol === k),
      accepted = a.filter((r) => r.ink),
      geom = a.filter((r) => r.circles.after.status === 'measured');
    const metric = (field) => {
      const aa = a.filter((r) => r[field]);
      return {
        accepted: aa.length,
        mean100: [0, 1].map((i) => 100 * mean(aa.map((r) => r[field][i]))),
        improved: aa.filter((r) => r[field][1] > r[field][0] + 1e-9).length,
        regressed: aa.filter((r) => r[field][1] < r[field][0] - 1e-9).length,
        worstRegression100: 100 * Math.max(0, ...aa.map((r) => r[field][0] - r[field][1])),
      };
    };
    return [
      k,
      {
        count: a.length,
        cost: metric('score'),
        ink: metric('ink'),
        geometryAccepted: geom.length,
        centerMedianPx: ['before', 'after'].map((side) =>
          median(
            geom.map((r) =>
              Math.hypot(
                r.circles[side].x - r.circles.reference.x,
                r.circles[side].y - r.circles.reference.y,
              ),
            ),
          ),
        ),
        radiusMedianPx: ['before', 'after'].map((side) =>
          median(geom.map((r) => Math.abs(r.circles[side].radius - r.circles.reference.radius))),
        ),
        bodyChangedCards: a.filter((r) => r.bodyChanged).length,
        headingChangedCards: a.filter((r) => r.headingChanged).length,
      },
    ];
  }),
);
await writeJson(output, {
  schema: 1,
  status: 'joint-native-mana-candidate-verified-all-costs-not-promoted',
  sources: Object.fromEntries(
    [
      'nativeCapture',
      'nativeInputs',
      'audit',
      'currentInputs',
      'correctedHeader',
      'jointNativeCapture',
    ].map((key, i) => [key, hash(raw[i])]),
  ),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  dependencies: await Promise.all(
    [
      'abu-mana-ring.mjs',
      'mana-glyph-metrics.mjs',
      'pixels-pure.mjs',
      'abu-type-objective.mjs',
      'hsb-color.mjs',
    ].map(async (f) => [f, hash(await readFile(new URL(f, import.meta.url)))]),
  ),
  scope:
    'All 277 actual native original mana-cost faces and fixed independently frame-normalized scan poses. All current controls byte-identical to frozen renderer outputs; Drain Life uses separately verified corrected header. One common palette, circle/pitch, five glyph scales and numeral geometry, with R ink expansion 0.4; X source retained after cached-font comparison. Only mana/body regions or explicitly counted header-name pixels change, with unchanged alpha. Rightmost-disc physical localization is measurement, not raster registration. Whole-cost structural index, disc geometry and internal ink are separate. Reused development validation, no holdout; no whole-card score, etching certification or final material/body/footer integration.',
  thresholds,
  profile: capture.candidates[1].profile,
  groups,
  failedMeasurements: rows
    .filter((r) => r.failures.length)
    .map((r) => ({ id: r.id, name: r.name, failures: r.failures })),
  rows,
});
console.log(JSON.stringify(groups, null, 2));
