import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { readJson, writeJson, fixtureRoot, outputRoot, hash } from './common.mjs';
import { readPng, normalize, cropGray } from './pixels.mjs';
import { measureEarlyArt, EARLY_BOUNDARY_VERSION } from './early-frame-landmarks.mjs';
import { measureWhiteFrame, boundaryDifference } from './frame-boundaries.mjs';
import { fitSharedTransform, IDENTITY } from './alignment.mjs';
import { compareRegion, median } from './metrics.mjs';

const plan = await readJson(path.join(fixtureRoot, 'early-lettering-plan.json'));
const samples = [];
for (const set of plan.sets) {
  const base = path.join(outputRoot, set.code, 'early-fields');
  const bytes = await readFile(path.join(base, 'capture.json'));
  if (hash(bytes) !== set.captureHash) throw Error('Frozen development capture changed');
  for (const card of JSON.parse(bytes).results) {
    if (!set.development.some((c) => c.id === card.id)) throw Error('Nondevelopment card');
    const source = await readPng(path.join(base, card.images.reference.file));
    const referenceImage = normalize(source);
    const renderedImage = normalize(await readPng(path.join(base, card.images.inspect.file)));
    samples.push({
      set: set.code,
      card,
      source,
      referenceImage,
      renderedImage,
      reference: measureEarlyArt(referenceImage),
      rendered: measureEarlyArt(renderedImage),
    });
  }
}
const proposedFit = fitSharedTransform(
  samples.filter((s) => !s.card.face.typeLine.includes('Land')),
);
const rows = samples.map((s) => {
  const alternatives = Object.fromEntries(
    Object.entries({ identity: IDENTITY, internalFit: proposedFit.transform }).map(
      ([name, transform]) => {
        const reference = normalize(s.source, transform);
        const internalF1 = median(
          [
            [44, 92, 17, 260],
            [427, 92, 17, 260],
            [64, 368, 360, 16],
            [64, 60, 360, 15],
          ].map((rect) => {
            const a = cropGray(reference, rect),
              b = cropGray(s.renderedImage, rect);
            return compareRegion(a.gray, b.gray, a.width, a.height).edgeF1[1];
          }),
        );
        return [
          name,
          {
            internalF1,
            outer:
              s.set === '2ed'
                ? boundaryDifference(
                    measureWhiteFrame(reference),
                    measureWhiteFrame(s.renderedImage),
                  )
                : null,
          },
        ];
      },
    ),
  );
  return {
    set: s.set,
    id: s.card.id,
    name: s.card.name,
    referenceHash: s.card.images.reference.sha256,
    referenceLandmarks: s.reference,
    renderedLandmarks: s.rendered,
    artBoundaryDifference: boundaryDifference(s.reference, s.rendered),
    alternatives,
  };
});
await writeJson(path.join(fixtureRoot, 'early-frame-review.json'), {
  schemaVersion: 1,
  detector: EARLY_BOUNDARY_VERSION,
  detectorHash: hash(await readFile(new URL('./early-frame-landmarks.mjs', import.meta.url))),
  proposedFit,
  adoptedTransform: IDENTITY,
  decision:
    'Keep shared identity. The internal fit improves some art-border scores but shifts the independently centered Unlimited outer frame. The art detector is diagnostic only: competing bevel/art peaks make several black, red and land examples incoherent. Do not promote its per-card coordinates to scan transforms or confident registration labels.',
  alphaLimitation:
    'Black stock exposes plate edges outside the intended frame; white-frame detector cannot certify Alpha outer registration. Inspect Alpha gains directly and retain whole-frame uncertainty.',
  rows,
});
console.log('Recorded sixteen development frame reviews; identity retained.');
