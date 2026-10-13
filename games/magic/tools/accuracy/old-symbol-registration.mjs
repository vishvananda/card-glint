import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  readJson,
  writeJson,
  cacheRoot,
  fixtureRoot,
  outputRoot,
  objectFile,
  hash,
} from './common.mjs';
import { readPng, normalize, cropGray } from './pixels.mjs';
import { measureLandmarks, fitSharedTransform, IDENTITY } from './alignment.mjs';
import { compareRegion, median } from './metrics.mjs';

const snapshot = await readJson(`${cacheRoot}/rollout/old-symbol-material.json`),
  capture = await readJson(`${outputRoot}/old-symbol-material/before/capture.json`),
  groups = {};
for (const set of ['arn', 'leg', 'all', 'wth', 'exo']) {
  const family = set === 'atq' ? 'retro-fourth' : 'retro-seventh',
    samples = [];
  for (const e of snapshot.entries.filter(
    (e) => e.card.set === set && e.cohort === 'calibration',
  )) {
    const b = capture.rows.find((r) => r.id === e.id),
      source = await readPng(objectFile(e.reference)),
      renderedImage = normalize(
        await readPng(`${outputRoot}/old-symbol-material/before/${b.images.inspect.file}`),
      );
    samples.push({
      id: e.id,
      source,
      renderedImage,
      reference: measureLandmarks(normalize(source), family),
      rendered: measureLandmarks(renderedImage, family),
    });
  }
  const fit = fitSharedTransform(samples),
    strips =
      family === 'retro-fourth'
        ? [
            [47, 115, 12, 200],
            [433, 115, 12, 200],
            [90, 368, 290, 14],
          ]
        : [
            [50, 115, 12, 200],
            [427, 115, 12, 200],
            [90, 364, 290, 14],
          ];
  const score = (transform) =>
    samples.map((s) => {
      const aligned = normalize(s.source, transform);
      return median(
        strips.map((rect) => {
          const a = cropGray(aligned, rect),
            b = cropGray(s.renderedImage, rect);
          return compareRegion(a.gray, b.gray, a.width, a.height).edgeF1?.[1] ?? 0;
        }),
      );
    });
  const raw = score(IDENTITY),
    fitted = score(fit.transform),
    improvement = median(fitted.map((v, i) => v - raw[i])),
    nonRegressing = fitted.filter((v, i) => v >= raw[i] - 0.02).length,
    accepted = fit.status === 'calibrated' && improvement > 0.01 && nonRegressing >= 4;
  groups[set] = {
    family,
    ...fit,
    transform: accepted ? fit.transform : IDENTITY,
    accepted,
    validation: { raw, fitted, improvement, nonRegressing },
    calibrationIds: samples.map((s) => s.id),
  };
}
const profile = {
  schemaVersion: 1,
  scope:
    'Frozen per-set frame-only registration for the symbol sizing experiment. Five calibration cards; no symbol or text landmarks, no held-out inputs, no per-scan transform. Rejected fits use identity and remain uncertain. Does not certify frame geometry.',
  baselineRendererHash: capture.rendererHash,
  planHash: capture.planHash,
  methodHash: hash(await readFile(new URL(import.meta.url))),
  groups,
};
const file = `${fixtureRoot}/old-symbol-material-registration.json`;
try {
  assert.deepEqual(await readJson(file), profile);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  await writeJson(file, profile);
}
console.log(groups);
