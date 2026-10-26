/** Scan-only Revised artifact interior alignment; does not certify outer stock. */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { readObject } from './cache.mjs';
import { normalize } from './pixels-pure.mjs';
import { scanMatrix } from './scan-transform.mjs';
import { median } from './metrics.mjs';
import { medianFrameGradient, gradientOverlap, bestGradientShift } from './frame-edge-measure.mjs';

export const revisedArtifactStrips = Object.freeze({
  fitLeft: [42, 445, 22, 25, 'x'],
  fitRight: [426, 445, 28, 25, 'x'],
  validationLeft: [42, 500, 22, 25, 'x'],
  validationRight: [426, 500, 28, 25, 'x'],
  certificateLeft: [42, 550, 22, 25, 'x'],
  certificateRight: [426, 550, 28, 25, 'x'],
});
const rectangles = revisedArtifactStrips;
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const fitScore = (a, b, shift = 0) =>
  mean(['Left', 'Right'].map((k) => gradientOverlap(a['fit' + k], b['fit' + k], shift)));
const sample = (a, x) => {
  const l = Math.floor(x),
    f = x - l;
  return (a[l] ?? 0) * (1 - f) + (a[l + 1] ?? 0) * f;
};

/** Pure profile replay. Only calibration frame profiles define the target and gauge. */
export function fitPrintedFrameTranslations(rows) {
  assert(rows.length >= 4);
  assert.equal(new Set(rows.map((r) => r.id)).size, rows.length);
  assert(rows.filter((r) => r.cohort === 'calibration').length >= 3);
  for (const r of rows)
    for (const [k, rect] of Object.entries(rectangles)) {
      assert.equal(r.profiles[k].length, rect[2] - 1);
      assert(r.profiles[k].every((v) => Number.isFinite(v) && v >= 0));
    }
  rows = structuredClone(rows);
  const cal = rows.filter((r) => r.cohort === 'calibration'),
    medoid = cal
      .map((r) => ({
        r,
        score: mean(cal.filter((t) => t !== r).map((t) => fitScore(r.profiles, t.profiles))),
      }))
      .toSorted((a, b) => b.score - a.score || a.r.id.localeCompare(b.r.id))[0].r;
  let templates = medoid.profiles;
  for (let pass = 0; pass < 2; pass++) {
    const aligned = cal.map((r) => {
      let best = { shift: 0, score: fitScore(templates, r.profiles) };
      for (let j = -32; j <= 32; j++) {
        const shift = j * 0.125,
          s = fitScore(templates, r.profiles, shift);
        if (s > best.score + 1e-10) best = { shift, score: s };
      }
      return { r, ...best };
    });
    templates = Object.fromEntries(
      Object.keys(rectangles).map((k) => [
        k,
        templates[k].map((_, x) =>
          median(aligned.map((r) => sample(r.r.profiles[k], x + r.shift))),
        ),
      ]),
    );
  }
  for (const r of rows) {
    let best = { shift: 0, score: fitScore(templates, r.profiles) };
    for (let j = -32; j <= 32; j++) {
      const shift = j * 0.125,
        s = fitScore(templates, r.profiles, shift);
      if (s > best.score + 1e-10) best = { shift, score: s };
    }
    r.fit = { ...best, boundary: Math.abs(best.shift) === 4 };
    r.validation = {};
    for (const key of [
      'validationLeft',
      'validationRight',
      'certificateLeft',
      'certificateRight',
    ]) {
      const b = bestGradientShift(templates[key], r.profiles[key]);
      r.validation[key] = {
        best: b,
        atFit: gradientOverlap(templates[key], r.profiles[key], best.shift),
        residual: b.shift - best.shift,
        boundary: Math.abs(b.shift) === 4,
      };
    }
    r.accepted =
      !r.fit.boundary &&
      r.fit.score >= 90 &&
      Object.values(r.validation).every(
        (v) => !v.boundary && v.atFit >= 90 && Math.abs(v.residual) <= 0.5,
      );
  }
  const gauge = median(cal.map((r) => -r.fit.shift)) || 0;
  for (const r of rows) {
    r.interiorDelta = { dx: -r.fit.shift - gauge || 0, dy: 0 };
  }
  return { rows, templates, medoid: { id: medoid.id, name: medoid.name }, gauge };
}

async function main(inputFile, posesFile, output) {
  assert(output, 'Usage: revised-artifact-normalize.mjs INPUTS OUTER_POSES OUTPUT');
  const ib = await readFile(inputFile),
    pb = await readFile(posesFile),
    inputs = JSON.parse(ib),
    poses = JSON.parse(pb);
  assert.equal(inputs.set, '3ed', 'Only the reviewed Revised artifact strips are supported');
  const selected = inputs.entries.filter((e) => e.material === 'A'),
    observations = [];
  assert.equal(selected.length, 51);
  for (const e of selected) {
    const pose = poses.rows.find((p) => p.id === e.id);
    assert(pose?.accepted, 'The parent outer-stock pose must pass its numerical checks');
    assert.equal(pose.referenceHash, e.reference.sha256);
    const raw = await readObject(e.reference);
    assert.equal(hash(raw), e.reference.sha256);
    const image = normalize(PNG.sync.read(raw), pose.transform);
    const profiles = Object.fromEntries(
      Object.entries(rectangles).map(([k, rect]) => [k, medianFrameGradient(image, rect)]),
    );
    const changed = { ...image, data: image.data.slice() };
    for (let y = 0; y < 680; y++)
      for (let x = 0; x < 488; x++) {
        const inStrip = Object.values(rectangles).some(
          ([rx, ry, w, h]) => x >= rx && x < rx + w && y >= ry && y < ry + h,
        );
        if (!inStrip) changed.data.set([x % 255, y % 255, (x + y) % 255, 255], (y * 488 + x) * 4);
      }
    for (const [k, rect] of Object.entries(rectangles))
      assert.deepEqual(medianFrameGradient(changed, rect), profiles[k], 'Content isolation failed');
    observations.push({
      id: e.id,
      name: e.name,
      cohort: pose.cohort,
      referenceHash: e.reference.sha256,
      stockTransform: pose.transform,
      profiles,
      contentIsolationPassed: true,
    });
  }
  const fitted = fitPrintedFrameTranslations(observations);
  for (const r of fitted.rows) {
    const matrix = scanMatrix(r.stockTransform).slice();
    matrix[4] += r.interiorDelta.dx;
    r.transform = { matrix };
    r.reason = r.accepted
      ? null
      : 'Frame-edge support or independent residual failed; proposed pose is not approved.';
  }
  const sourceFiles = [
    'revised-artifact-normalize.mjs',
    'frame-edge-measure.mjs',
    'pixels-pure.mjs',
    'scan-transform.mjs',
    'metrics.mjs',
  ];
  const sources = Object.fromEntries(
    await Promise.all(
      sourceFiles.map(async (f) => [f, hash(await readFile(new URL(f, import.meta.url)))]),
    ),
  );
  const result = {
    schema: 1,
    status: 'awaiting-visual-printed-frame-review',
    set: inputs.set,
    validationKind: 'reused-development',
    inputHash: hash(ib),
    posesHash: hash(pb),
    sources,
    scope:
      'One horizontal reference-only translation from paired text-box frame edges. Fixed strips are frame/paper only; content isolation excludes all other pixels. Calibration-only medoid and aligned median templates; median calibration shift zero. No renderer, artwork, title or body fitting. Numerical acceptance is not visual certification. Keep stockTransform for physical-border/corner assessment; do not use this pose to erase stock errors.',
    rectangles,
    ...fitted,
    summary: {
      cards: fitted.rows.length,
      accepted: fitted.rows.filter((r) => r.accepted).length,
      rejected: fitted.rows.filter((r) => !r.accepted).map((r) => r.name),
      meanFit: mean(fitted.rows.map((r) => r.fit.score)),
      meanVerification: mean(
        fitted.rows.flatMap((r) => Object.values(r.validation).map((v) => v.atFit)),
      ),
    },
    excludedMaterials: inputs.entries.filter((e) => e.material !== 'A').map((e) => e.id),
  };
  await writeJson(output, result);
  console.log(result.summary);
}
if (process.argv[1] === fileURLToPath(import.meta.url)) await main(...process.argv.slice(2));
