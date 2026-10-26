/** Reproducible cache-only Revised ordinary-color horizontal registration. */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { readObject } from './cache.mjs';
import { revisedArtifactStrips } from './revised-artifact-normalize.mjs';
import {
  fitCenteredPrintedFramePixels,
  physicalRevisedMaterial,
} from './revised-pixel-template-fit.mjs';

export async function normalizeRevisedColors(inputFile, parentFile, output) {
  assert(
    inputFile && parentFile && output,
    'Usage: revised-colored-frame-normalize.mjs INPUTS OUTER_POSES OUTPUT',
  );
  const read = async (file) => {
    const bytes = await readFile(file);
    return file.endsWith('.gz') ? gunzipSync(bytes) : bytes;
  };
  const ib = await read(inputFile),
    pb = await read(parentFile),
    inputs = JSON.parse(ib),
    parent = JSON.parse(pb);
  assert.equal(inputs.set, '3ed');
  assert.equal(parent.set, '3ed');
  assert.equal(new Set(inputs.entries.map((e) => e.id)).size, inputs.entries.length);
  assert.equal(new Set(parent.rows.map((e) => e.id)).size, parent.rows.length);
  const groups = {},
    mismatches = inputs.entries
      .filter((e) => e.material !== physicalRevisedMaterial(e))
      .map((e) => ({
        id: e.id,
        name: e.name,
        recorded: e.material,
        physical: physicalRevisedMaterial(e),
      }));
  for (const material of ['W', 'U', 'B', 'R', 'G']) {
    const entries = inputs.entries.filter((e) => physicalRevisedMaterial(e) === material);
    const observations = [];
    for (const e of entries) {
      const p = parent.rows.find((p) => p.id === e.id);
      assert(p?.accepted, 'Parent stock pose must pass its independent checks');
      assert(['calibration', 'validation'].includes(p.cohort));
      assert.equal(p.referenceHash, e.reference.sha256);
      const bytes = await readObject(e.reference);
      assert.equal(hash(bytes), e.reference.sha256);
      observations.push({
        id: e.id,
        name: e.name,
        cohort: p.cohort,
        referenceHash: e.reference.sha256,
        stockTransform: p.transform,
        image: PNG.sync.read(bytes),
      });
    }
    const fitted = fitCenteredPrintedFramePixels(observations);
    groups[material] = {
      ...fitted,
      summary: {
        cards: fitted.rows.length,
        accepted: fitted.rows.filter((r) => r.accepted).length,
        rejected: fitted.rows.filter((r) => !r.accepted).map((r) => r.name),
      },
    };
    console.log(material, groups[material].summary);
  }
  const files = [
    'revised-colored-frame-normalize.mjs',
    'revised-pixel-template-fit.mjs',
    'revised-frame-pixel-fit.mjs',
    'revised-artifact-normalize.mjs',
    'normalized-rgba-region.mjs',
    'frame-edge-measure.mjs',
    'scan-transform.mjs',
    'metrics.mjs',
    'pixels-pure.mjs',
  ];
  const sources = Object.fromEntries(
    await Promise.all(
      files.map(async (f) => [f, hash(await readFile(new URL(f, import.meta.url)))]),
    ),
  );
  const report = {
    schema: 1,
    set: '3ed',
    status: 'numerical-horizontal-registration-awaiting-complete-frame-review',
    validationKind: 'reused-development',
    inputHash: hash(ib),
    parentHash: hash(pb),
    sources,
    scope:
      'Reference-only horizontal interior alignment for five physical mono-color frames. Calibration-only exact-pixel median templates are rebuilt after centering; three bounded refinement passes. Validation scans never choose templates or gauge. Two fit strips and four disjoint checks; overlap>=90 and residual<=0.5px. Original stock transforms remain separate. This does not certify vertical registration, frame scale, typography, colors, lands or a complete set. No renderer defaults change.',
    rectangles: revisedArtifactStrips,
    mismatches,
    groups,
  };
  await writeJson(output, report);
  return report;
}
if (process.argv[1] === fileURLToPath(import.meta.url))
  await normalizeRevisedColors(...process.argv.slice(2));
