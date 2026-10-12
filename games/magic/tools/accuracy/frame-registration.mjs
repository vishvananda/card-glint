import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { fixtureRoot, outputRoot, hash, readJson, writeJson } from './common.mjs';
import { readPng, normalize, cropGray, savePng } from './pixels.mjs';
import { BOUNDARY_VERSION, measureWhiteFrame, boundaryDifference } from './frame-boundaries.mjs';
import { alignmentDiagnostic, fitSharedTransform, IDENTITY } from './alignment.mjs';
import { regions } from './regions.mjs';
import { compareRegion, median } from './metrics.mjs';

const phase = process.argv[2] ?? 'development';
if (!['development', 'validation', 'corpus'].includes(phase)) throw Error('Invalid phase');
const fixture = path.join(fixtureRoot, '3ed');
const plan = await readJson(path.join(fixture, 'frame-registration-plan.json'));
const sourceRoot = path.join(outputRoot, '3ed', plan.sourceRun);
const captureBytes = await readFile(path.join(sourceRoot, 'capture.json'));
if (hash(captureBytes) !== plan.captureHash) throw Error('Frozen capture changed');
const capture = JSON.parse(captureBytes);
const detectorHash = hash(await readFile(new URL('./frame-boundaries.mjs', import.meta.url)));
const frozen =
  phase === 'development'
    ? null
    : await readJson(path.join(fixture, 'frame-registration-candidate.json'));
if (frozen && frozen.detectorHash !== detectorHash)
  throw Error('Detector changed after validation freeze');
const selected =
  phase === 'corpus'
    ? capture.results.filter(
        (c) => !c.issue && c.frame === 'retro-fourth' && c.face.borderColor === 'white',
      )
    : (phase === 'development' ? plan.development : plan.reserved).map((row) =>
        capture.results.find((c) => c.id === row.id),
      );
const samples = [];
for (const card of selected) {
  const paths = Object.fromEntries(
    ['reference', 'inspect'].map((tier) => [tier, path.join(sourceRoot, card.images[tier].file)]),
  );
  for (const [tier, file] of Object.entries(paths))
    if (hash(await readFile(file)) !== card.images[tier].sha256)
      throw Error(`Image changed: ${card.name} ${tier}`);
  const source = await readPng(paths.reference);
  const referenceImage = normalize(source);
  const renderedImage = normalize(await readPng(paths.inspect));
  samples.push({
    card,
    source,
    referenceImage,
    renderedImage,
    reference: measureWhiteFrame(referenceImage),
    rendered: measureWhiteFrame(renderedImage),
  });
}
const fit = phase === 'development' ? fitSharedTransform(samples) : frozen.developmentFit;
const offsets = samples.map((s) => boundaryDifference(s.reference, s.rendered).centerDelta);
const translation = frozen?.translation ?? {
  ...IDENTITY,
  tx: median(offsets.map((p) => p[0])),
  ty: median(offsets.map((p) => p[1])),
};
const rows = [];
for (const sample of samples) {
  const { card } = sample;
  const alternatives = {};
  for (const [name, transform] of Object.entries({
    identity: IDENTITY,
    similarity: fit.transform,
    translation,
  })) {
    const image = name === 'identity' ? sample.referenceImage : normalize(sample.source, transform);
    const boundary = boundaryDifference(measureWhiteFrame(image), sample.rendered);
    const internalFrameF1 = median(
      regions(card)
        .filter((r) => ['frame-left', 'frame-right', 'type-border'].includes(r.id))
        .map((r) => {
          const a = cropGray(image, r.rect),
            b = cropGray(sample.renderedImage, r.rect);
          return compareRegion(a.gray, b.gray, a.width, a.height).edgeF1?.[1] ?? 0;
        }),
    );
    alternatives[name] = { boundary, internalFrameF1 };
  }
  rows.push({
    id: card.id,
    name: card.name,
    collectorNumber: card.collectorNumber,
    referenceHash: card.images.reference.sha256,
    renderedHash: card.images.inspect.sha256,
    legacy: alignmentDiagnostic(sample.referenceImage, sample.renderedImage, card.frame),
    referenceLandmarks: sample.reference,
    renderedLandmarks: sample.rendered,
    alternatives,
  });
  if (phase !== 'corpus') {
    const output = { width: 976, height: 680, data: new Uint8Array(976 * 680 * 4) };
    for (const [column, image, points] of [
      [0, sample.referenceImage, sample.reference],
      [1, sample.renderedImage, sample.rendered],
    ]) {
      for (let y = 0; y < 680; y++)
        output.data.set(
          image.data.subarray(y * 488 * 4, (y + 1) * 488 * 4),
          (y * 976 + column * 488) * 4,
        );
      for (const p of points)
        if (p.detected !== null) {
          const x = p.axis === 'x' ? Math.round(p.detected) : p.x;
          const y = p.axis === 'y' ? Math.round(p.detected) : p.y;
          for (let d = -25; d <= 25; d++) {
            const index =
              ((y + (p.axis === 'x' ? d : 0)) * 976 + column * 488 + x + (p.axis === 'y' ? d : 0)) *
              4;
            output.data.set([255, 40, 180, 255], index);
          }
        }
    }
    await savePng(
      path.join(outputRoot, '3ed', 'frame-registration', `${phase}-${card.collectorNumber}.png`),
      output,
    );
  }
}
const summary = Object.fromEntries(
  ['identity', 'similarity', 'translation'].map((name) => [
    name,
    {
      outerMedianResidualPx: median(
        rows.map((r) => r.alternatives[name].boundary.medianResidualPx),
      ),
      internalMedianPairedGain: median(
        rows.map(
          (r) => r.alternatives[name].internalFrameF1 - r.alternatives.identity.internalFrameF1,
        ),
      ),
      internalRegressions: rows.filter(
        (r) =>
          r.alternatives[name].internalFrameF1 < r.alternatives.identity.internalFrameF1 - 0.02,
      ).length,
    },
  ]),
);
const result = {
  schemaVersion: 1,
  phase,
  detectorVersion: BOUNDARY_VERSION,
  detectorHash,
  captureHash: plan.captureHash,
  transform: IDENTITY,
  developmentFit: fit,
  translation,
  summary,
  count: rows.length,
  legacyWarnings: rows.filter((r) => r.legacy.uncertain).length,
  coherentOuterBoundaries: rows.filter((r) => r.alternatives.identity.boundary.coherent).length,
  rows,
};
await writeJson(path.join(outputRoot, '3ed', 'frame-registration', `${phase}.json`), result);
console.log(
  JSON.stringify(
    {
      phase,
      count: result.count,
      legacyWarnings: result.legacyWarnings,
      coherentOuterBoundaries: result.coherentOuterBoundaries,
      summary,
      detectorHash,
    },
    null,
    2,
  ),
);
