// Fit internal glyphs in disc coordinates, without normalizing their ink bounds.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { manaGlyphMask, compareManaGlyph, GLYPH_SIZE } from './mana-glyph-metrics.mjs';
import { median } from './hsb-color.mjs';
const [nativeDirectory, auditFile, colorDirectory, output, mode = 'colored'] =
  process.argv.slice(2);
assert(['colored', 'numeric'].includes(mode));
assert(
  output,
  'Usage: early-mana-glyph-fit.mjs NATIVE AUDIT COLOR_CAPTURE OUTPUT [colored|numeric]',
);
const raw = await Promise.all(
  [
    path.join(nativeDirectory, 'capture.json'),
    auditFile,
    path.join(colorDirectory, 'capture.json'),
  ].map((f) => readFile(f)),
);
const [capture, audit, color] = raw.map((b) => JSON.parse(b));
const inputBytes = await readFile(path.join(nativeDirectory, 'inputs.json'));
const input = JSON.parse(inputBytes);
assert.equal(color.source.nativeInputsHash, hash(inputBytes));
assert.equal(audit.nativeCaptureHash, hash(raw[0]));
assert.equal(color.source.nativeCaptureHash, hash(raw[0]));
assert.equal(color.source.auditHash, hash(raw[1]));
assert.equal(color.completed, color.total);
const thresholds = [0.38, 0.48, 0.58],
  n = GLYPH_SIZE,
  rows = [];
const candidates = [{ id: 'current', adjustment: { scale: 1, dx: 0, dy: 0 } }];
for (const scale of [0.9, 0.94, 0.98, 1, 1.02, 1.06, 1.1, 1.14, 1.18, 1.22])
  for (const dx of [-0.75, 0, 0.75])
    for (const dy of [-1.5, -0.75, 0, 0.75]) {
      if (scale === 1 && dx === 0 && dy === 0) continue;
      candidates.push({ id: `glyph/${scale}/${dx}/${dy}`, adjustment: { scale, dx, dy } });
    }
const resize = (ink, a, radius) => {
  const out = new Uint8Array(n * n),
    units = (n - 4) / (2 * radius);
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const sx = Math.round((x - n / 2 - a.dx * units) / a.scale + n / 2),
        sy = Math.round((y - n / 2 - a.dy * units) / a.scale + n / 2);
      if (sx >= 0 && sy >= 0 && sx < n && sy < n) out[y * n + x] = ink[sy * n + sx];
    }
  return out;
};
for (const r of color.rows.filter((r) =>
  mode === 'numeric' ? r.symbol === 'N' : r.symbol !== 'N',
)) {
  const ar = audit.rows.find((x) => x.id === r.id),
    native = capture.rows.find((x) => x.id === r.id),
    trial = r.trials.find((t) => t.id === 'paper-ink');
  assert.equal(ar.poseHash, native.poseHash);
  assert.equal(r.poseHash, native.poseHash);
  const bytes = await Promise.all(
    [
      path.join(colorDirectory, trial.file),
      path.join(nativeDirectory, '2ed', r.id + '-scan.png'),
    ].map((f) => readFile(f)),
  );
  assert.equal(hash(bytes[0]), trial.faceHash);
  assert.equal(hash(bytes[1]), native.scanHash);
  const [source, reference] = bytes.map((b) => normalize(PNG.sync.read(b)));
  const sourceCircle = trial.circle ?? ar.render.circle;
  const costScale =
    color.definition.candidates.find((c) => c.id === 'paper-ink').profile.geometry?.scaleX ?? 1;
  const masks = [source, reference].map((im, i) =>
    thresholds.map((thresholdFraction) =>
      manaGlyphMask(im, i ? ar.scan.circle : sourceCircle, false, {
        normalizeBounds: false,
        thresholdFraction,
      }),
    ),
  );
  const failed = masks.flatMap((ms, i) =>
    ms.flatMap((m, j) =>
      m.status === 'measured'
        ? []
        : [{ side: i ? 'reference' : 'source', threshold: thresholds[j], status: m.status }],
    ),
  );
  const scores = failed.length
    ? []
    : candidates.map((c) =>
        median(
          thresholds.map(
            (_, i) =>
              compareManaGlyph(
                masks[1][i].ink,
                resize(masks[0][i].ink, c.adjustment, sourceCircle.radius / costScale),
              ).score,
          ),
        ),
      );
  rows.push({
    id: r.id,
    name: r.name,
    symbol: r.symbol,
    ...(mode === 'numeric'
      ? { number: input.entries.find((e) => e.id === r.id).face.manaSymbols.at(-1) }
      : {}),
    cohort: r.cohort,
    referenceHash: r.referenceHash,
    poseHash: r.poseHash,
    sourceHash: trial.faceHash,
    sourceCircle,
    referenceCircle: ar.scan.circle,
    accepted: !failed.length,
    failures: failed,
    sourceRatios: masks[0].map((m) => m.discRatio ?? null),
    referenceRatios: masks[1].map((m) => m.discRatio ?? null),
    scores,
  });
}
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const groups = {};
for (const symbol of mode === 'numeric' ? ['N'] : ['W', 'U', 'B', 'R', 'G']) {
  const all = rows.filter((r) => r.symbol === symbol),
    accepted = all.filter((r) => r.accepted),
    cal = accepted.filter((r) => r.cohort === 'calibration'),
    val = accepted.filter((r) => r.cohort === 'validation');
  if (cal.length < 3 || val.length < 3) {
    groups[symbol] = {
      status: 'insufficient-accepted-glyphs',
      total: all.length,
      accepted: accepted.length,
      calibration: cal.length,
      validation: val.length,
    };
    continue;
  }
  const ranking = candidates
    .map((c, i) => {
      const worst = Math.max(0, ...cal.map((r) => r.scores[0] - r.scores[i]));
      return {
        id: c.id,
        index: i,
        adjustment: c.adjustment,
        objective: mean(cal.map((r) => r.scores[i])) - 0.25 * worst,
        calibrationMean: mean(cal.map((r) => r.scores[i])),
        calibrationWorstRegression: worst,
      };
    })
    .sort((a, b) => b.objective - a.objective || a.index - b.index);
  const best = ranking[0],
    summary = (a) => ({
      count: a.length,
      beforeMean100: mean(a.map((r) => r.scores[0])) * 100,
      afterMean100: mean(a.map((r) => r.scores[best.index])) * 100,
      improved: a.filter((r) => r.scores[best.index] > r.scores[0] + 1e-9).length,
      worstRegression100: Math.max(0, ...a.map((r) => (r.scores[0] - r.scores[best.index]) * 100)),
    });
  groups[symbol] = {
    status: 'glyph-mask-candidate-needs-native-replay',
    total: all.length,
    accepted: accepted.length,
    selected: best,
    groups: { calibration: summary(cal), validation: summary(val) },
    ranking,
  };
}
await writeJson(output, {
  schema: 1,
  set: '2ed',
  status: 'disc-relative-glyph-candidates-needs-native-replay',
  mode,
  scope:
    (mode === 'numeric'
      ? 'Generic numerals in independently measured disc coordinates.'
      : 'Five colored glyphs in independently measured disc coordinates.') +
    ' No normalization of glyph ink bounds and no scan raster registration. Binary ink IoU/boundary scores use three contrast thresholds; each glyph family receives one shared scale and within-circle offset selected on calibration names with a worst-loss penalty. Validation is reused development evidence. Approximate mask transforms are predictions and need actual native verification; source ink expansion, source-font differences and final whole-set validation remain separate.',
  sources: {
    nativeCapture: hash(raw[0]),
    nativeInputs: hash(inputBytes),
    audit: hash(raw[1]),
    colorCapture: hash(raw[2]),
  },
  toolHash: hash(await readFile(new URL(import.meta.url))),
  dependencies: await Promise.all(
    ['pixels-pure.mjs', 'mana-glyph-metrics.mjs', 'hsb-color.mjs'].map(async (f) => [
      f,
      hash(await readFile(new URL(f, import.meta.url))),
    ]),
  ),
  thresholds,
  candidates,
  groups,
  rows,
});
console.log(
  JSON.stringify(
    Object.fromEntries(Object.entries(groups).map(([s, g]) => [s, { ...g, ranking: undefined }])),
  ),
);
