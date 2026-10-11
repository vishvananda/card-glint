import path from 'node:path';
import { readPng, normalize, cropGray } from './pixels.mjs';
import {
  ALIGNMENT_VERSION,
  frameFamily,
  measureLandmarks,
  fitSharedTransform,
  IDENTITY,
} from './alignment.mjs';
import { compareRegion, median } from './metrics.mjs';
import { regions } from './regions.mjs';
import {
  fixtureRoot,
  hash,
  options,
  outputRoot,
  readJson,
  referenceIdentity,
  writeJson,
} from './common.mjs';

const opts = options();
const runRoot = path.join(outputRoot, opts.set, opts.run);
const capture = await readJson(path.join(runRoot, 'capture.json'));
const cohorts = await readJson(path.join(fixtureRoot, opts.set, 'cohorts.json'));
const target = path.join(fixtureRoot, opts.set, 'alignment.json');
try {
  await readJson(target);
  if (!opts.refresh) throw Error('Alignment is frozen; use --refresh to recalibrate explicitly');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const groups = new Map();
for (const result of capture.results.filter(
  (r) => !r.issue && cohorts.calibration.includes(r.collectorNumber),
)) {
  const family = frameFamily(result);
  const source = await readPng(path.join(runRoot, result.images.reference.file));
  const reference = normalize(source);
  const rendered = normalize(await readPng(path.join(runRoot, result.images.inspect.file)));
  if (!groups.has(family)) groups.set(family, []);
  groups.get(family).push({
    id: result.id,
    source,
    renderedImage: rendered,
    regions: regions(result).filter((r) =>
      ['frame-left', 'frame-right', 'type-border'].includes(r.id),
    ),
    reference: measureLandmarks(reference, family),
    rendered: measureLandmarks(rendered, family),
  });
}
const frameFamilies = {};
for (const [family, samples] of groups) {
  const fit = fitSharedTransform(samples);
  const score = (transform) =>
    samples.map((sample) => {
      const aligned = normalize(sample.source, transform);
      return median(
        sample.regions.map(({ rect }) => {
          const a = cropGray(aligned, rect),
            b = cropGray(sample.renderedImage, rect);
          return compareRegion(a.gray, b.gray, a.width, a.height).edgeF1?.[1] ?? 0;
        }),
      );
    });
  const raw = score(IDENTITY),
    fitted = score(fit.transform);
  const improvement = median(fitted.map((value, i) => value - raw[i]));
  const nonRegressing = fitted.filter((value, i) => value >= raw[i] - 0.02).length;
  // A landmark fit must also improve frame-only structure on the calibration cohort.
  // No names, rules text, or held-out cards enter this decision.
  const accepted =
    fit.status === 'calibrated' && improvement > 0.01 && nonRegressing / samples.length >= 2 / 3;
  frameFamilies[family] = {
    ...fit,
    transform: accepted ? fit.transform : IDENTITY,
    status: accepted
      ? 'calibrated'
      : fit.status === 'calibrated'
        ? 'identity-frame-validation'
        : fit.status,
    validation: {
      rawMedianF1: median(raw),
      fittedMedianF1: median(fitted),
      medianPairedImprovement: improvement,
      nonRegressing,
      accepted,
    },
    calibrationIds: samples.map((s) => s.id),
  };
}
const profile = {
  version: ALIGNMENT_VERSION,
  scope: 'set-and-frame',
  set: opts.set,
  canonicalSize: [488, 680],
  sourceRun: opts.run,
  sourceSnapshot: capture.snapshotIdentity,
  referenceIdentity: capture.referenceIdentity ?? referenceIdentity(capture.results),
  sourceDiffHash: capture.sourceDiffHash,
  cohortHash: hash(JSON.stringify(cohorts)),
  frameFamilies,
  note: 'One frozen transform per frame family for this set. No per-scan fitting. Identity applies to uncalibrated families. Raw scores remain available.',
};
await writeJson(target, profile);
console.log(JSON.stringify(frameFamilies, null, 2));
