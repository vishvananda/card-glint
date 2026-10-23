// Native adoption audit: fixed scans, fixed masks, filled ink and explicit residuals.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { nativeGrayCrop } from './abu-type-objective.mjs';
import { TextFilledObjective } from './text-filled-objective.mjs';
import { blur } from './edges.mjs';
const [
  inputFile,
  beforeDir,
  afterDir,
  scoreDir,
  fieldsFile,
  bodyTrialFile,
  statsTrialFile,
  output,
] = process.argv.slice(2);
assert(
  output,
  'Usage: modern-typography-native-audit.mjs INPUTS BEFORE AFTER SCORES FIELDS_GZ BODY_TRIAL STATS_TRIAL OUTPUT',
);
const read = async (file) => {
  const bytes = await readFile(file);
  return { bytes, data: JSON.parse(bytes) };
};
const [input, before, after, scores, bodyTrial, statsTrial] = await Promise.all(
  [
    inputFile,
    path.join(beforeDir, 'capture.json'),
    path.join(afterDir, 'capture.json'),
    path.join(scoreDir, 'scores.json'),
    bodyTrialFile,
    statsTrialFile,
  ].map(read),
);
const fieldsBytes = await readFile(fieldsFile),
  fields = JSON.parse(gunzipSync(fieldsBytes));
assert.equal(input.data.set, 'm21');
assert.equal(input.data.entries.length, 297);
assert.equal(fields.length, 268);
for (const c of [before, after]) {
  assert.equal(c.data.completed, 297);
  assert.equal(c.data.denominator, 297);
  assert.equal(c.data.source.inputsHash, hash(input.bytes));
  assert.deepEqual(c.data.faults, []);
  assert.equal(new Set(c.data.rows.map((r) => r.id)).size, 297);
}
assert.equal(scores.data.definition.inputsHash, hash(input.bytes));
const index = (rows) => new Map(rows.map((r) => [r.id, r])),
  old = index(before.data.rows),
  now = index(after.data.rows),
  refs = index(scores.data.rows),
  bodyFields = index(fields),
  oldBody = index(bodyTrial.data.rows),
  oldStats = index(statsTrial.data.rows);
const bodyRows = [],
  statsRows = [],
  isolation = [];
const contrast = (gray, w, h, radius, threshold) => {
  const mean = blur(gray, w, h, radius);
  return Float32Array.from(
    gray,
    (v, i) => 255 - Math.min(255, Math.max(0, mean[i] - v - threshold) * 2),
  );
};
function objectives(ref, w, h, mask, radius, threshold) {
  return {
    raw: new TextFilledObjective(ref, w, h, mask),
    ink: new TextFilledObjective(contrast(ref, w, h, radius, threshold), w, h, mask),
  };
}
function measure(gray, obj, w, h, radius, threshold) {
  const raw = obj.raw.score(gray),
    ink = obj.ink.score(contrast(gray, w, h, radius, threshold));
  return { score: 0.8 * ink.score + 0.2 * raw.score, raw, ink };
}
async function raster(dir, meta) {
  const bytes = await readFile(path.join(dir, meta.file));
  assert.equal(hash(bytes), meta.sha256);
  return PNG.sync.read(bytes, { checkCRC: true });
}
function referenceGray(image, [rx, ry, w, h]) {
  return Float32Array.from({ length: w * h }, (_, i) => {
    const x = i % w,
      y = Math.floor(i / w),
      k = ((ry + y) * image.width + rx + x) * 4;
    return 0.2126 * image.data[k] + 0.7152 * image.data[k + 1] + 0.0722 * image.data[k + 2];
  });
}
function bodyMask(f) {
  const [rx, ry, w, h] = f.rect,
    b = f.request.bounds,
    mask = new Uint8Array(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const xx = x + rx,
        yy = y + ry;
      mask[y * w + x] =
        xx >= b.x - 3 && xx <= b.x + b.width + 3 && yy >= b.y - 3 && yy <= b.y + b.height + 3
          ? 1
          : 0;
    }
  for (const [i, [x, y, bw, bh]] of (b.exclusions ?? []).entries()) {
    const padding = f.face.power != null && f.face.toughness != null && i === 0 ? 0 : 1;
    for (
      let yy = Math.max(0, Math.floor(y - ry - padding));
      yy < Math.min(h, Math.ceil(y + bh - ry + padding));
      yy++
    )
      for (
        let xx = Math.max(0, Math.floor(x - rx - padding));
        xx < Math.min(w, Math.ceil(x + bw - rx + padding));
        xx++
      )
        mask[yy * w + xx] = 0;
  }
  assert.equal(
    mask.reduce((n, x) => n + x, 0),
    f.maskPixels,
    'Changed frozen body mask ' + f.name,
  );
  return mask;
}
for (const e of input.data.entries) {
  const b = old.get(e.id),
    a = now.get(e.id),
    s = refs.get(e.id);
  assert(b && a && s);
  for (const r of [b, a]) {
    assert.equal(r.inputHash, hash(JSON.stringify(e.face)));
    assert.equal(r.referenceHash, e.reference.sha256);
  }
  const x = await raster(beforeDir, b.layers.face),
    y = await raster(afterDir, a.layers.face);
  assert.deepEqual([x.width, x.height, y.width, y.height], [732, 1020, 732, 1020]);
  const oldEtch = await raster(beforeDir, b.layers.etching),
    newEtch = await raster(afterDir, a.layers.etching);
  assert(oldEtch.data.equals(newEtch.data), 'Changed etching ' + e.card.name);
  const f = bodyFields.get(e.id),
    hasStats = e.face.power != null && e.face.toughness != null;
  const support = [...(f ? [[37, 428, 416, 204]] : []), ...(hasStats ? [[379, 602, 86, 43]] : [])];
  let changedPixels = 0;
  if (!x.data.equals(y.data)) {
    for (let py = 0; py < 1020; py++)
      for (let px = 0; px < 732; px++) {
        const k = (py * 732 + px) * 4;
        if ([0, 1, 2, 3].every((c) => x.data[k + c] === y.data[k + c])) continue;
        assert.equal(x.data[k + 3], y.data[k + 3], 'Changed silhouette ' + e.card.name);
        const cx = (px + 0.5) / 1.5,
          cy = (py + 0.5) / 1.5;
        assert(
          support.some(([sx, sy, w, h]) => cx >= sx && cx < sx + w && cy >= sy && cy < sy + h),
          'Changed pixel outside typography ' + e.card.name + '/' + cx + '/' + cy,
        );
        changedPixels++;
      }
  }
  isolation.push({
    id: e.id,
    name: e.card.name,
    before: b.layers.face.sha256,
    after: a.layers.face.sha256,
    changedPixels,
    etching: a.layers.etching.sha256,
    support,
  });
  if (!f && !hasStats) continue;
  assert(
    s.poseAccepted && s.nonfoilEligible,
    'Typography requires accepted nonfoil reference ' + e.card.name,
  );
  const ref = await raster(scoreDir, s.normalizedReference);
  assert.deepEqual([ref.width, ref.height], [488, 680]);
  const source = {
    id: e.id,
    name: e.card.name,
    number: e.card.collector_number,
    referenceHash: e.reference.sha256,
    poseHash: s.poseHash,
    normalizedReferenceHash: s.normalizedReference.sha256,
    beforeFaceHash: b.layers.face.sha256,
    afterFaceHash: a.layers.face.sha256,
  };
  if (f) {
    const rect = f.rect,
      [, , w, h] = rect,
      mask = bodyMask(f),
      obj = objectives(referenceGray(ref, rect), w, h, mask, 7, 30),
      previous = measure(nativeGrayCrop(x, rect), obj, w, h, 7, 30),
      current = measure(nativeGrayCrop(y, rect), obj, w, h, 7, 30);
    const control = oldBody.get(e.id)?.trials.find((t) => t.id === 'current');
    assert(control);
    assert(
      Math.abs(control.score - previous.score) < 1e-7,
      'Old native body objective replay drift ' + e.card.name,
    );
    bodyRows.push({
      ...source,
      rect,
      maskPixels: f.maskPixels,
      before: previous,
      after: current,
      delta100: (current.score - previous.score) * 100,
    });
  }
  if (hasStats) {
    const rect = [383, 605, 77, 37],
      [, , w, h] = rect,
      mask = new Uint8Array(w * h);
    for (let py = 0; py < h; py++)
      for (let px = 0; px < w; px++)
        mask[py * w + px] =
          px + rect[0] >= 389 && px + rect[0] <= 454 && py + rect[1] >= 609 && py + rect[1] <= 638
            ? 1
            : 0;
    const obj = objectives(referenceGray(ref, rect), w, h, mask, 5, 25),
      previous = measure(nativeGrayCrop(x, rect), obj, w, h, 5, 25),
      current = measure(nativeGrayCrop(y, rect), obj, w, h, 5, 25);
    const control = oldStats.get(e.id)?.trials.find((t) => t.id === 'current');
    assert(control);
    assert(
      Math.abs(control.score - previous.score) < 1e-7,
      'Old native stats objective replay drift ' + e.card.name,
    );
    statsRows.push({
      ...source,
      rect,
      before: previous,
      after: current,
      delta100: (current.score - previous.score) * 100,
    });
  }
  if (isolation.length % 25 === 0)
    console.log('native typography audit ' + isolation.length + '/297');
}
assert.equal(bodyRows.length, 268);
assert.equal(statsRows.length, 148);
const summarize = (rows) => ({
  fields: rows.length,
  beforeMean100: rows.reduce((n, r) => n + r.before.score * 100, 0) / rows.length,
  afterMean100: rows.reduce((n, r) => n + r.after.score * 100, 0) / rows.length,
  improved: rows.filter((r) => r.delta100 > 1e-7).length,
  regressed: rows.filter((r) => r.delta100 < -1e-7).length,
  worstDelta100: Math.min(...rows.map((r) => r.delta100)),
  residuals: rows
    .filter((r) => r.delta100 < -1e-7)
    .sort((a, b) => a.delta100 - b.delta100)
    .map((r) => ({
      id: r.id,
      name: r.name,
      number: r.number,
      before100: r.before.score * 100,
      after100: r.after.score * 100,
      delta100: r.delta100,
    })),
});
const report = {
  schema: 1,
  set: 'm21',
  status: 'native-typography-adoption-not-set-completion',
  definition: {
    inputsHash: hash(input.bytes),
    beforeCaptureHash: hash(before.bytes),
    afterCaptureHash: hash(after.bytes),
    referenceScoresHash: hash(scores.bytes),
    fieldsHash: hash(fieldsBytes),
    bodyTrialHash: hash(bodyTrial.bytes),
    statsTrialHash: hash(statsTrial.bytes),
    beforeRenderer: before.data.source.rendererHash,
    afterRenderer: after.data.source.rendererHash,
    normalizationHash: scores.data.definition.normalizationHash,
    toolHash: hash(await readFile(new URL(import.meta.url))),
    method:
      'Actual complete native Original faces, frozen frame-normalized scans, unchanged reference and semantic masks. Every old baseline field reproduces the independent study objective. Score80% local high-contrast filled/edge ink plus20% raw-field filled/edge ink; no per-card transforms. Optical finishes and print-dot additions are disabled.',
  },
  summary: {
    body: summarize(bodyRows),
    stats: summarize(statsRows),
    nativeFaces: 297,
    changedFaces: isolation.filter((r) => r.changedPixels > 0).length,
    unchangedFaces: isolation.filter((r) => r.changedPixels === 0).length,
    unchangedEtchings: 297,
    outsideTypographyChanges: 0,
  },
  review: [
    'Body fit is a shared policy. A fixed32-card semantic/density refinement cohort selects numeric candidates; full268 verification retains every regression. The legacy layout supplies only a content-derived maximum line count. The new metrics then fit down to that budget without per-card exceptions.',
    'The P/T cohort contains all148 ordinary printed stat fields. Font/size/position comparisons use the same source family and fixed masks. Both font alternatives must be actually loaded; no missing-font fallbacks count as candidates.',
    'Fractional metrics are explicit for measurement, request replay and painting. The painter still retains browser rasterization, including bounded HTML/Offscreen differences; numerical layout precision does not imply pixel identity between backends.',
    'Residuals remain visible. Native adoption parity and improved indices do not certify scan poses, missing art spills, exact printing data, all modern donor sets or M21 completion.',
  ],
  bodyRows,
  statsRows,
  isolation,
};
await writeJson(output, report);
console.log(
  JSON.stringify({
    body: report.summary.body,
    stats: report.summary.stats,
    nativeFaces: 297,
    changedFaces: report.summary.changedFaces,
    unchangedEtchings: 297,
  }),
);
