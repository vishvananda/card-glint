/** Reference-only refinement. Neither renderer pixels nor text select a pose. */
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { readObject } from './cache.mjs';
import { scanMatrix } from './scan-transform.mjs';
import { median } from './metrics.mjs';
import { normalizedRgbaRegion } from './normalized-rgba-region.mjs';
import { revisedArtifactStrips } from './revised-artifact-normalize.mjs';
import { medianFrameGradient, gradientOverlap, bestGradientShift } from './frame-edge-measure.mjs';

export const pixelRefinementSteps = Object.freeze(
  Array.from({ length: 13 }, (_, i) => (i - 6) * 0.125).sort(
    (a, b) => Math.abs(a) - Math.abs(b) || a - b,
  ),
);
const fitKeys = ['fitLeft', 'fitRight'];
const checkKeys = ['validationLeft', 'validationRight', 'certificateLeft', 'certificateRight'];
export function warpedFrameProfiles(image, transform, keys = Object.keys(revisedArtifactStrips)) {
  return Object.fromEntries(
    keys.map((key) => {
      const [x, y, w, h, axis] = revisedArtifactStrips[key];
      const window = normalizedRgbaRegion(image, [x, y, w, h], transform);
      return [key, medianFrameGradient(window, [0, 0, w, h, axis])];
    }),
  );
}
/** Deterministic fit-only choice; verification fields cannot affect selection. */
export function selectPixelRefinement(trials, templates) {
  assert.equal(trials.length, pixelRefinementSteps.length);
  assert.deepEqual(
    trials.map((t) => t.delta).toSorted((a, b) => a - b),
    [...pixelRefinementSteps].sort((a, b) => a - b),
  );
  let best;
  for (const trial of trials.toSorted(
    (a, b) => Math.abs(a.delta) - Math.abs(b.delta) || a.delta - b.delta,
  )) {
    const score =
      fitKeys.reduce((sum, key) => sum + gradientOverlap(templates[key], trial.profiles[key]), 0) /
      fitKeys.length;
    if (!best || score > best.score + 1e-10) best = { delta: trial.delta, score };
  }
  return best;
}
export function verifyWarpedFrame(profiles, templates, selected) {
  const validation = Object.fromEntries(
    Object.keys(revisedArtifactStrips).map((key) => [
      key,
      {
        score: gradientOverlap(templates[key], profiles[key]),
        best: bestGradientShift(templates[key], profiles[key]),
      },
    ]),
  );
  const fitPassed = fitKeys.every((key) => validation[key].score >= 90),
    independentPassed = checkKeys.every(
      (key) => validation[key].score >= 90 && Math.abs(validation[key].best.shift) <= 0.5,
    ),
    boundary = Math.abs(selected.delta) === 0.75;
  return {
    validation,
    fitPassed,
    independentPassed,
    boundary,
    accepted: fitPassed && independentPassed && !boundary,
  };
}
export function refinePrintedFramePixels(image, prior, templates) {
  const trials = pixelRefinementSteps.map((delta) => {
    const matrix = scanMatrix(prior).slice();
    matrix[4] += delta;
    return { delta, profiles: warpedFrameProfiles(image, { matrix }, fitKeys) };
  });
  const selected = selectPixelRefinement(trials, templates),
    matrix = scanMatrix(prior).slice();
  matrix[4] += selected.delta;
  const transform = { matrix },
    profiles = warpedFrameProfiles(image, transform);
  return {
    trials,
    refinement: selected.delta,
    fitScore: selected.score,
    transform,
    profiles,
    ...verifyWarpedFrame(profiles, templates, selected),
  };
}
async function main(inputFile, parentFile, output) {
  assert(
    inputFile && parentFile && output,
    'Usage: revised-frame-pixel-fit.mjs INPUTS PRIOR_TRANSLATIONS OUTPUT',
  );
  const inputBytes = await readFile(inputFile),
    parentBytes = await readFile(parentFile),
    inputs = JSON.parse(inputBytes),
    parent = JSON.parse(parentFile.endsWith('.gz') ? gunzipSync(parentBytes) : parentBytes);
  assert.equal(inputs.set, '3ed');
  assert.equal(parent.set, '3ed');
  assert.equal(parent.rows.length, 51);
  const entries = inputs.entries.filter((e) => e.material === 'A');
  assert.equal(entries.length, 51);
  const rows = [];
  for (const r of parent.rows) {
    const entry = entries.find((e) => e.id === r.id);
    assert(entry && entry.reference.sha256 === r.referenceHash);
    const bytes = await readObject(entry.reference);
    assert.equal(hash(bytes), r.referenceHash);
    const measured = refinePrintedFramePixels(PNG.sync.read(bytes), r.transform, parent.templates);
    rows.push({
      id: r.id,
      name: r.name,
      cohort: r.cohort,
      referenceHash: r.referenceHash,
      stockTransform: r.stockTransform,
      originalTransform: r.transform,
      previouslyAccepted: r.accepted,
      ...measured,
    });
    if (rows.length % 10 === 0) console.log('Pixel frame refinements', rows.length, '/51');
  }
  const sources = Object.fromEntries(
    await Promise.all(
      [
        'revised-frame-pixel-fit.mjs',
        'normalized-rgba-region.mjs',
        'revised-artifact-normalize.mjs',
        'frame-edge-measure.mjs',
        'pixels-pure.mjs',
        'scan-transform.mjs',
        'metrics.mjs',
      ].map(async (file) => [file, hash(await readFile(new URL(file, import.meta.url)))]),
    ),
  );
  const summary = {
    cards: rows.length,
    accepted: rows.filter((r) => r.accepted).length,
    rejected: rows.filter((r) => !r.accepted).map((r) => r.name),
    newAccepts: rows.filter((r) => r.accepted && !r.previouslyAccepted).map((r) => r.name),
    newRejects: rows.filter((r) => !r.accepted && r.previouslyAccepted).map((r) => r.name),
    calibrationMedianRefinement: median(
      rows.filter((r) => r.cohort === 'calibration').map((r) => r.refinement),
    ),
    boundaryWinners: rows.filter((r) => r.boundary).map((r) => r.name),
  };
  await writeJson(output, {
    schema: 1,
    set: '3ed',
    status: 'numerical-pixel-refinement-awaiting-visual-review',
    validationKind: 'reused-development',
    inputHash: hash(inputBytes),
    parentHash: hash(parentBytes),
    sources,
    scope:
      'Exact reference-only pixel refinement of prior scan translations. Fixed calibration-only template/gauge; two fit strips select the shift and four disjoint strips verify. Same90-overlap/0.5px-residual thresholds. No renderer or text in fitting. Retain stockTransform for physical borders; numerical acceptance is not set certification.',
    rectangles: revisedArtifactStrips,
    templates: parent.templates,
    steps: pixelRefinementSteps,
    summary,
    rows,
  });
  console.log(summary);
}
if (process.argv[1] === fileURLToPath(import.meta.url)) await main(...process.argv.slice(2));
