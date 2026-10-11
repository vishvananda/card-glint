import path from 'node:path';
import { PNG } from 'pngjs';
import { readFile } from 'node:fs/promises';
import {
  fixtureRoot,
  outputRoot,
  options,
  readJson,
  writeJson,
  hash,
  sourceHash,
} from './common.mjs';
import { normalize } from './pixels.mjs';
import { typographyMetrics } from './typography-metrics.mjs';
import { median } from './metrics.mjs';

const opts = options();
const fixtures = await readJson(path.join(fixtureRoot, opts.set, 'typography.json'));
const runRoot = path.join(outputRoot, opts.set, opts.run);
const report = await readJson(path.join(runRoot, 'metrics.json'));
const results = [];
for (const card of report.results) {
  const target = fixtures.cards[card.id];
  if (!target) continue;
  if (target.referenceHash !== card.images?.reference.sha256)
    throw Error(`Stale typography reference for ${card.name}`);
  if (card.issue || !card.layout) {
    results.push({ id: card.id, name: card.name, status: 'unavailable', issue: card.issue });
    continue;
  }
  const bytes = await readFile(path.join(runRoot, card.images.inspect.file));
  if (hash(bytes) !== card.images.inspect.sha256)
    throw Error(`Capture checksum mismatch: ${card.name}`);
  results.push({
    id: card.id,
    name: card.name,
    cohort: card.cohort,
    alignmentUncertain: card.alignment.uncertain,
    ...typographyMetrics(target, card, normalize(PNG.sync.read(bytes, { checkCRC: true }))),
  });
}
const summary = (cards) => {
  const measured = cards.filter((c) => c.status === 'measured' && !c.alignmentUncertain);
  return {
    count: measured.length,
    excluded: cards.length - measured.length,
    exactWrapping: measured.filter((c) => c.exactWrapping).length,
    meanSoftBreakF1: measured.length
      ? measured.reduce((n, c) => n + c.softBreakF1, 0) / measured.length
      : null,
    medianAbsoluteLineCountError: median(measured.map((c) => Math.abs(c.lineCountError))),
    medianBlockEdgeMae: median(measured.map((c) => c.blockEdgeMae).filter((v) => v != null)),
    medianMatchedLineTopMae: median(
      measured.map((c) => c.matchedLineTopMae).filter((v) => v != null),
    ),
    medianMatchedLineWidthMae: median(
      measured.map((c) => c.matchedLineWidthMae).filter((v) => v != null),
    ),
  };
};
const output = {
  schemaVersion: 1,
  set: opts.set,
  run: opts.run,
  referenceIdentity: report.referenceIdentity,
  alignmentHash: report.alignmentHash,
  rendererHash: report.rendererHash,
  browser: report.browser,
  fixtureHash: hash(JSON.stringify(fixtures)),
  metricSource: await sourceHash(
    new URL('.', import.meta.url),
    /^(?:typography(?:-metrics)?|edges|pixels|common)\.mjs$/,
  ),
  note: 'Soft wraps exclude input paragraph breaks. Geometry is in canonical pixels with about 2px scan-measurement uncertainty. Matched-line errors use identical line text only; inspect matched-line counts alongside errors. No registration or OCR at comparison time.',
  all: summary(results),
  calibration: summary(results.filter((c) => c.cohort === 'calibration')),
  heldOut: summary(results.filter((c) => c.cohort === 'held-out')),
  results,
};
await writeJson(path.join(runRoot, 'typography.json'), output);
console.log(
  JSON.stringify(
    { all: output.all, calibration: output.calibration, heldOut: output.heldOut },
    null,
    2,
  ),
);
