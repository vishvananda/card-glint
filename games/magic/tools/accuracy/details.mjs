import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { options, outputRoot, readJson, writeJson, hash, sourceHash } from './common.mjs';
import { cropGray, readPng, normalize, savePng } from './pixels.mjs';
import { componentOffset } from './component-offset.mjs';
import { manaLandmark, manaRowLandmarks } from './mana-landmark.mjs';
import { median } from './metrics.mjs';
import { inkEdges } from './edges.mjs';
import { detailPage } from './details-page.mjs';

const opts = options(),
  start = performance.now();
const dir = path.join(outputRoot, opts.set, opts.run),
  previous = path.join(outputRoot, opts.set, opts.baseline);
const current = await readJson(path.join(dir, 'metrics.json')),
  before = await readJson(path.join(previous, 'metrics.json'));
for (const key of [
  'referenceIdentity',
  'alignmentHash',
  'metricSource',
  'browser',
  'fontStylesheetHash',
])
  if (current[key] !== before[key]) throw Error(`Incompatible pair: ${key}`);
if (!['mir', 'tmp', '4ed'].includes(opts.set))
  throw Error('Detail regions currently reviewed only for MIR/TMP/4ED');
const results = [];
for (const card of current.results) {
  const old = before.results.find((c) => c.id === card.id);
  if (!old || old.issue || card.issue || old.inputHash !== card.inputHash)
    throw Error(`Unpaired card: ${card.name}`);
  const images = [];
  for (const [root, entry, tier] of [
    [dir, card, 'reference'],
    [previous, old, 'inspect'],
    [dir, card, 'inspect'],
  ]) {
    const file = path.join(root, entry.images[tier].file);
    if (hash(await readFile(file)) !== entry.images[tier].sha256)
      throw Error(`Stale image: ${file}`);
    images.push(
      normalize(await readPng(file), tier === 'reference' ? card.alignment.transform : {}),
    );
  }
  const n = card.face.manaSymbols.length;
  const fourth = opts.set === '4ed';
  const legalLight = fourth
    ? /\bArtifact\b/.test(card.face.typeLine) ||
      (card.face.colors.length === 1 && ['B', 'G'].includes(card.face.colors[0]))
    : !/\bLand\b/.test(card.face.typeLine) &&
      !(card.face.colors.length === 1 && ['W', 'R'].includes(card.face.colors[0]));
  // Fixed reference windows, deliberately independent of current painter coordinates.
  const manaLeft = 423 - Math.max(0, n - 1) * 27;
  const regions = fourth
    ? [
        { id: 'title', rect: [38, 24, (n ? manaLeft - 6 : 449) - 38, 35], lightInk: true },
        { id: 'type', rect: [38, 374, 350, 31], lightInk: true },
        { id: 'artist', rect: [38, 610, 350, 22], lightInk: true },
        { id: 'copyright', rect: [38, 632, 350, 14], lightInk: legalLight },
      ]
    : [
        { id: 'set-outline', rect: [400, 370, 42, 34], lightInk: true },
        { id: 'artist', rect: [47, 605, 340, 24], lightInk: true },
        { id: 'copyright', rect: [47, 629, 345, 14], lightInk: legalLight },
      ];
  if (n)
    regions.unshift({
      id: 'mana',
      rect: fourth
        ? [manaLeft - 3, 24, 455 - manaLeft, 35]
        : [Math.max(48, 453 - n * 26), 25, Math.min(408, n * 26 + 6), 46],
      lightInk: false,
    });
  if (card.face.power != null)
    regions.push({ id: 'stats', rect: [394, 606, 65, 35], lightInk: true });
  const taps = [];
  for (const line of card.layout?.lines ?? []) {
    let x = line.x ?? card.layout.x;
    for (const run of line.runs) {
      if (run.symbol && run.text === 'T') taps.push({ x, baseline: line.baseline, size: run.size });
      x += run.width;
    }
  }
  // Tap windows are layout-assisted visual diagnostics, not independent shape ground truth.
  if (taps.length) {
    const tap = taps[0],
      size = tap.size * 0.8;
    regions.push({
      id: 'tap-layout-window',
      rect: [
        Math.max(0, Math.round(tap.x - 4)),
        Math.max(0, Math.round(tap.baseline - tap.size * 0.72 - 4)),
        Math.ceil(size + 8),
        Math.ceil(size + 8),
      ],
      lightInk: false,
    });
  }
  const measured = [];
  for (const region of regions) {
    if (region.rect.some((v) => !Number.isFinite(v))) continue;
    const crops = images.map((im) => cropGray(im, region.rect));
    const values = crops
      .slice(1)
      .map((c) => componentOffset(crops[0].gray, c.gray, c.width, c.height, region.lightInk));
    const [width, height] = region.rect.slice(2);
    const overlay = { width: width * 2, height, data: new Uint8Array(width * 2 * height * 4) };
    const edges = crops.map((c) => inkEdges(c.gray, width, height, region.lightInk).edges);
    for (let k = 0; k < 2; k++)
      for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++) {
          const i = y * width + x,
            p = (y * width * 2 + k * width + x) * 4,
            a = edges[0][i],
            b = edges[k + 1][i];
          overlay.data[p] = b ? 255 : 25;
          overlay.data[p + 1] = a ? 235 : 25;
          overlay.data[p + 2] = a || b ? 255 : 25;
          overlay.data[p + 3] = 255;
        }
    const file = `details/${card.id}.${region.id}.png`;
    await savePng(path.join(dir, file), overlay);
    measured.push({ ...region, before: values[0], after: values[1], overlay: file });
  }
  const manaRows = n
    ? images.map((im) => {
        const crop = cropGray(im, [0, 0, 488, 90]);
        return manaRowLandmarks(crop.gray, crop.width, crop.height, {
          count: n,
          rightX: fourth ? 435 : 438,
          y: fourth ? 39.5 : 45,
          pitch: fourth ? 27 : 25,
          range: 9,
        });
      })
    : null;
  const manaCircles = fourth
    ? (manaRows?.map((row) => row.circles[0]) ?? null)
    : n
      ? images.map((im) => {
          const c = cropGray(im, [411, 24, 53, 45]);
          const v = manaLandmark(c.gray, c.width, c.height, { x: 27, y: 21, range: 9 });
          return { ...v, x: v.x + 411, y: v.y + 24 };
        })
      : null;
  results.push({
    id: card.id,
    name: card.name,
    collectorNumber: card.collectorNumber,
    frame: card.frame,
    cohort: card.cohort,
    inputHash: card.inputHash,
    manaCircles,
    manaRows,
    alignmentUncertain: card.alignment.uncertain,
    regions: measured,
  });
}
const ids = [...new Set(results.flatMap((r) => r.regions.map((r) => r.id)))];
const summary = Object.fromEntries(
  ids.map((id) => {
    const rows = results
      .filter((c) => !c.alignmentUncertain)
      .flatMap((c) => c.regions.filter((r) => r.id === id));
    const valid = rows.filter(
      (r) => Number.isFinite(r.before.rawEdgeF1) && Number.isFinite(r.after.rawEdgeF1),
    );
    return [
      id,
      {
        count: valid.length,
        before: median(valid.map((r) => r.before.rawEdgeF1)),
        after: median(valid.map((r) => r.after.rawEdgeF1)),
        improved: valid.filter((r) => r.after.rawEdgeF1 > r.before.rawEdgeF1 + 0.02).length,
        regressed: valid.filter((r) => r.after.rawEdgeF1 < r.before.rawEdgeF1 - 0.02).length,
        afterFlags: rows.reduce(
          (a, r) => ({ ...a, [r.after.status]: (a[r.after.status] ?? 0) + 1 }),
          {},
        ),
        beforeOffset: ['dx', 'dy'].map((v) =>
          median(valid.map((r) => r.before[v]).filter(Number.isFinite)),
        ),
        afterOffset: ['dx', 'dy'].map((v) =>
          median(valid.map((r) => r.after[v]).filter(Number.isFinite)),
        ),
      },
    ];
  }),
);
const circlePairs = results.filter(
  (c) => !c.alignmentUncertain && c.manaCircles?.every((v) => v.status === 'measured'),
);
const circleSummary = {
  confidentTriples: circlePairs.length,
  unmeasuredOrUncertain: results.filter((c) => c.manaCircles).length - circlePairs.length,
  medianDistanceBefore: median(
    circlePairs.map((c) =>
      Math.hypot(c.manaCircles[0].x - c.manaCircles[1].x, c.manaCircles[0].y - c.manaCircles[1].y),
    ),
  ),
  medianDistanceAfter: median(
    circlePairs.map((c) =>
      Math.hypot(c.manaCircles[0].x - c.manaCircles[2].x, c.manaCircles[0].y - c.manaCircles[2].y),
    ),
  ),
  note: 'Rightmost disc only. White sun glyphs, textured backgrounds and boundary optima often fail confidence; retain them for visual review.',
};
const rowPairs = results.filter(
  (c) => !c.alignmentUncertain && c.manaRows?.every((row) => row.status === 'measured'),
);
const rowSummary = {
  confidentTriples: rowPairs.length,
  unmeasuredOrUncertain: results.filter((c) => c.manaRows).length - rowPairs.length,
  multiDiscTriples: rowPairs.filter((c) => c.manaRows[0].circles.length > 1).length,
  medianAbsolutePitchErrorBefore: median(
    rowPairs
      .filter((c) => c.manaRows[0].pitch != null)
      .map((c) => Math.abs(c.manaRows[0].pitch - c.manaRows[1].pitch)),
  ),
  medianAbsolutePitchErrorAfter: median(
    rowPairs
      .filter((c) => c.manaRows[0].pitch != null)
      .map((c) => Math.abs(c.manaRows[0].pitch - c.manaRows[2].pitch)),
  ),
  note: 'Independent nominal positions for every disc; no per-scan transforms. Missing/ambiguous discs or conflicting order invalidate the row aggregate. Full rows remain in per-card output.',
};
const report = {
  schemaVersion: 1,
  method: 'component-offset-v2',
  set: opts.set,
  run: opts.run,
  baseline: opts.baseline,
  alignmentHash: current.alignmentHash,
  referenceIdentity: current.referenceIdentity,
  rendererHashes: [before.rendererHash, current.rendererHash],
  diagnosticSource: await sourceHash(
    new URL('.', import.meta.url),
    /^(?:component-offset|mana-landmark|details|edges|pixels)\.mjs$/,
  ),
  attempted: results.length,
  eligible: current.eligibleCount,
  alignmentExcluded: results.filter((r) => r.alignmentUncertain).length,
  note: 'Paired examples; cohort is recorded per card. Edge F1 at one canonical pixel, never percent accuracy. Translation search is diagnostic only; scores and displayed images remain at frozen family alignment. Heuristic flags require visual review; cohort independence needs a separately frozen study plan.',
  seconds: (performance.now() - start) / 1000,
  summary,
  circleSummary,
  rowSummary,
  results,
};
await writeJson(path.join(dir, 'details.json'), report);
await detailPage({ opts, dir, previous, current, before, report });
console.log(
  JSON.stringify({ seconds: report.seconds, attempted: report.attempted, summary }, null, 2),
);
